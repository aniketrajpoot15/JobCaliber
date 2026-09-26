<!-- 📌 WHAT IS THIS FILE? This is the complete Security Architecture Specification for JobCaliber. It defines the Express middleware pipeline, authentication and JWT cookie transport, tenant isolation patterns, input validation and sanitization, rate limiting, and defense against OWASP Top 10 vulnerabilities. Every developer or agent writing backend code must follow this specification exactly. -->

# JOBCALIBER — SECURITY ARCHITECTURE SPECIFICATION

> **Version:** 1.0.0  
> **Status:** Phase 1 (Architecture) — In Progress  
> **Last Updated:** 2026-09-26  
> **Reference Documents:**  
> - `AGENTS.md` (Section 9: Security Rules, Non-Negotiable Directives)  
> - `docs/Research_And_Documentation/DECISIONS.md` (ADR-007 JWT Cookie Transport)  
> - `docs/Architecture/API_SPEC.md` (Endpoint Contracts & Validation Rules)  
> - `docs/Architecture/DATABASE_SCHEMA.md` (Tenant Anchor & Indexing)

---

## Table of Contents

1. [Security Core Directives (Non-Negotiable)](#1-security-core-directives-non-negotiable)
2. [Express Middleware Execution Pipeline](#2-express-middleware-execution-pipeline)
3. [Authentication & Session Transport (ADR-007)](#3-authentication--session-transport-adr-007)
4. [Tenant Isolation Architecture](#4-tenant-isolation-architecture)
5. [Input Validation & Data Sanitization](#5-input-validation--data-sanitization)
6. [Rate Limiting & Brute-Force Defense](#6-rate-limiting--brute-force-defense)
7. [OWASP Top 10 Defense Matrix](#7-owasp-top-10-defense-matrix)
8. [Centralized Error Handling & Information Leakage Prevention](#8-centralized-error-handling--information-leakage-prevention)
9. [Environment Configuration & Secret Management](#9-environment-configuration--secret-management)
10. [Security Verification & Testing Checklist](#10-security-verification--testing-checklist)

---

## 1. Security Core Directives (Non-Negotiable)

These 8 directives from `AGENTS.md` (§9) are absolute. No code may violate them under any circumstance:

| # | Directive | Implementation Rule |
|---|---|---|
| **SR-1** | **Password Hashing** | Passwords must be hashed using `bcryptjs` with a work factor (salt rounds) of `12`. Plaintext passwords must NEVER be logged or stored. |
| **SR-2** | **JWT Transport** | JWT tokens must be transmitted strictly via `HttpOnly`, `SameSite=Lax` cookies. Storing tokens in `localStorage` or `sessionStorage` is strictly FORBIDDEN. |
| **SR-3** | **Universal Tenant Isolation** | Every database query on user-owned data must include `{ userId: req.user._id }`. Zero queries may rely solely on resource `_id`. |
| **SR-4** | **Server-Side Validation** | `express-validator` must validate and sanitize all payload inputs. Client-side validation is strictly for user experience; the server is the single source of truth. |
| **SR-5** | **NoSQL Injection Defense** | `express-mongo-sanitize` must strip all `$` and `.` operators from `req.body`, `req.query`, and `req.params`. |
| **SR-6** | **Brute-Force Rate Limiting** | Auth endpoints (`/api/auth/*`) are strictly limited to `10 requests per 15 minutes` per IP address. |
| **SR-7** | **Zero Hardcoded Secrets** | All secrets (JWT keys, DB URIs, cookie secrets) must be injected via environment variables. |
| **SR-8** | **Git Cleanliness** | `.env` files, production credentials, and secret keys must never be committed to Git. Enforced by `.gitignore`. |

---

## 2. Express Middleware Execution Pipeline

The sequence in which middleware executes in Express determines application security. A single misordered middleware (e.g., parsing bodies after sanitization) completely breaks defense-in-depth.

### 2.1 The 10-Stage Middleware Pipeline

```
Incoming HTTP Request
       │
[Stage 1]  CORS Middleware (Whitelist client origin with credentials)
       │
[Stage 2]  Helmet Security Headers (CSP, X-Frame-Options, HSTS, etc.)
       │
[Stage 3]  Body Parser with Size Limit (express.json({ limit: '10kb' }))
       │
[Stage 4]  Cookie Parser (cookie-parser for HttpOnly JWT extraction)
       │
[Stage 5]  NoSQL Sanitizer (express-mongo-sanitize strips $ and .)
       │
[Stage 6]  Rate Limiter (express-rate-limit applied to /api/auth/*)
       │
[Stage 7]  Authentication Guard (auth middleware verifies JWT and sets req.user)
       │
[Stage 8]  Input Validation & Sanitization (express-validator rules)
       │
[Stage 9]  Route Controller Execution (Business logic with tenant isolation)
       │
[Stage 10] Centralized Global Error Handler (Sanitizes error output)
       │
Outgoing HTTP Response
```

### 2.2 Server Entrypoint Implementation Blueprint

```javascript
// server/server.js (Security Middleware Pipeline Blueprint)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Stage 1: CORS Configuration
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true, // Allow cookies to be sent cross-origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Stage 2: Helmet Security Headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.CLIENT_URL || 'http://localhost:5173']
    }
  }
}));

// Stage 3: Body Parser with Payload Limit (DOS prevention)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Stage 4: Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// Stage 5: NoSQL Injection Defense
app.use(mongoSanitize({
  replaceWith: '_' // Replaces prohibited characters with '_'
}));

// Routes mounted here (Stages 6, 7, 8, 9)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Stage 10: Global Centralized Error Handler (Must be registered last)
app.use(errorHandler);

module.exports = app;
```

---

## 3. Authentication & Session Transport (ADR-007)

### 3.1 Why HttpOnly Cookies Beat LocalStorage

| Threat Vector | `localStorage` | `HttpOnly` Cookie | JobCaliber Defense |
|---|---|---|---|
| **Cross-Site Scripting (XSS)** | 🔴 **Fatal:** Any injected JavaScript can read `localStorage.getItem('token')` and exfiltrate user accounts. | 🟢 **Immune:** JavaScript cannot read `HttpOnly` cookies. Even in the presence of an XSS bug, tokens cannot be stolen. | **HttpOnly flag enforced** on all auth cookies. |
| **Cross-Site Request Forgery (CSRF)** | 🟢 Immune (requires explicit header insertion). | 🟡 Vulnerable if default settings used. | **`SameSite=Lax` enforced:** Browser refuses to attach cookie to cross-site state-changing POST/PUT/DELETE requests. |
| **Token Exfiltration via NPM supply chain** | 🔴 Any compromised frontend dependency can steal token. | 🟢 Zero script access to the token. | **Protected by browser sandbox.** |

### 3.2 Cookie Configuration Specification

```javascript
// server/utils/cookieConfig.js
const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,                         // Prevents JavaScript access (XSS defense)
  secure: isProduction,                   // Requires HTTPS in production
  sameSite: isProduction ? 'None' : 'Lax', // Cross-site defense; None+Secure for prod domains
  maxAge: 7 * 24 * 60 * 60 * 1000,        // 7 days in milliseconds (matches JWT expiry)
  path: '/'                               // Available across all application routes
};

module.exports = COOKIE_OPTIONS;
```

### 3.3 JWT Payload & Signing Architecture

- **Algorithm:** `HS256` (HMAC with SHA-256)
- **Token Expiry:** `7d` (7 days)
- **Payload Minimality:** The JWT payload contains **only** the user ID (`{ id: user._id }`). It never contains email, passwords, roles, or personal data. If a user updates their email or settings, the token remains valid without becoming stale.

```javascript
// JWT Creation Blueprint
const jwt = require('jsonwebtoken');

function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
```

### 3.4 Auth Middleware Verification Pattern

```javascript
// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 1. Extract token from cookie (fallback to Bearer header for dev/testing curl)
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    // 2. Verify signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Verify user still exists in database
    const user = await User.findById(decoded.id).select('_id email fullName staleThresholdDays');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session no longer valid. Please log in again.'
      });
    }

    // 4. Attach authenticated user to request context
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.'
    });
  }
};

module.exports = auth;
```

---

## 4. Tenant Isolation Architecture

Tenant isolation is the bedrock of multi-tenant security in JobCaliber. Because multiple users store sensitive job applications, interview debriefs, and salary numbers in the same MongoDB database, cross-tenant data leaks are catastrophic.

### 4.1 The Golden Rule: Universal Tenant Isolation

> **Rule:** Every MongoDB operation (`find`, `findOne`, `findById`, `updateOne`, `deleteOne`, `aggregate`) performed on behalf of a user MUST include `{ userId: req.user._id }`.

### 4.2 Query Patterns: Insecure vs. Secure

#### Case 1: Fetching a single application by ID
- ❌ **INSECURE (IDOR Vulnerability):**
  ```javascript
  // ANY user who guesses or iterates an ObjectId can view or delete another user's application!
  const app = await Application.findById(req.params.id);
  ```
- ✅ **SECURE (Tenant Isolated):**
  ```javascript
  // Guarantees document belongs to the authenticated user:
  const app = await Application.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  ```

#### Case 2: Parent-Child Referential Integrity
When creating a child record (e.g. an `InterviewRound` for an `Application`):
- ❌ **INSECURE:**
  ```javascript
  // Attacker links their interview round to another user's application ID!
  await InterviewRound.create({ applicationId: req.body.applicationId, ... });
  ```
- ✅ **SECURE (Verified Parent Ownership):**
  ```javascript
  // 1. Verify parent application belongs to req.user._id
  const parentApp = await Application.findOne({
    _id: req.body.applicationId,
    userId: req.user._id
  });
  if (!parentApp) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  // 2. Create child record with explicit userId
  const round = await InterviewRound.create({
    applicationId: parentApp._id,
    userId: req.user._id,
    ...req.body
  });
  ```

#### Case 3: Aggregation Pipelines
- ✅ **SECURE:**
  ```javascript
  const pipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } }, // Tenant anchor
    ...
  ];
  ```

---

## 5. Input Validation & Data Sanitization

JobCaliber implements strict **Layer 2 (Express-Validator)** and **Layer 3 (Mongoose Schema)** validation on all incoming inputs.

### 5.1 Validation Error Formatter Pattern

Express-validator rules return raw error arrays. JobCaliber standardizes these into a uniform structure:

```javascript
// server/middleware/validate.js
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

module.exports = validate;
```

### 5.2 Endpoint Validation Matrix

| Endpoint | Fields Validated | Exact Validation Rules | Sanitization Rules |
|---|---|---|---|
| `POST /api/auth/register` | `fullName`, `email`, `password` | `fullName`: min 2, max 100 chars<br>`email`: valid email format<br>`password`: min 8 chars, 1 uppercase, 1 digit | `trim()`, `normalizeEmail()` |
| `POST /api/auth/login` | `email`, `password` | `email`: valid email format<br>`password`: non-empty | `trim()`, `normalizeEmail()` |
| `PATCH /api/auth/profile` | `fullName`, `targetRole`, `staleThresholdDays` | `staleThresholdDays`: integer between 7 and 45 | `trim()`, `toInt()` |
| `POST /api/applications` | `companyName`, `roleTitle`, `status`, `jobUrl`, `workMode` | `companyName`: min 1, max 200<br>`roleTitle`: min 1, max 200<br>`status`: valid 7-stage enum<br>`workMode`: enum ['', 'Remote', 'Hybrid', 'Onsite'] | `trim()` |
| `PATCH /api/applications/:id/status` | `status` | `status`: valid 7-stage enum (ADR-003) | `trim()` |
| `POST /api/interviews/:id/debrief` | `rating`, `problemLogs` | `rating`: integer 1 to 5<br>`problemLogs.*.topicName`: min 2, max 100<br>`problemLogs.*.category`: enum `['Technical', 'Behavioral', 'System Design', 'Custom']` | `trim()`, `toInt()` |

---

## 6. Rate Limiting & Brute-Force Defense

To prevent password-guessing brute-force attacks and denial-of-service, strict rate limiters are applied using `express-rate-limit`.

### 6.1 Rate Limiting Configuration

```javascript
// server/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Strict Auth Limiter (Login & Register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10,                   // Limit each IP to 10 requests per window
  standardHeaders: true,     // Return standard RateLimit-* headers
  legacyHeaders: false,      // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// General API Limiter (Protects general backend endpoints)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,                  // 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.'
  }
});

module.exports = { authLimiter, apiLimiter };
```

---

## 7. OWASP Top 10 Defense Matrix

| Vulnerability (OWASP 2021) | Threat Context in JobCaliber | Architectural Defense |
|---|---|---|
| **A01: Broken Access Control** | User viewing or deleting another user's applications or debriefs. | 1. Universal `{ userId: req.user._id }` query filter.<br>2. Verification of parent application ownership on all child routes.<br>3. Prevention of IDOR on all update/delete routes. |
| **A02: Cryptographic Failures** | Compromised password hashes; exposed session tokens. | 1. `bcryptjs` work factor `12`.<br>2. `HttpOnly`, `SameSite=Lax`, `Secure` cookie transport.<br>3. `select: false` on `passwordHash` in Mongoose schema. |
| **A03: Injection** | NoSQL query injection using `{"$gt": ""}` in login/search fields. | 1. `express-mongo-sanitize` strips `$` and `.` from all inputs.<br>2. Strongly typed Mongoose schemas.<br>3. `express-validator` sanitization. |
| **A04: Insecure Design** | Premature or misleading analytics; user enumeration. | 1. Statistical guardrails ($N \ge 5$ debriefs, $N \ge 15$ cohort apps).<br>2. Unified `"Invalid email or password"` login error message.<br>3. Fixed 7-stage pipeline enum (ADR-003, ADR-012). |
| **A05: Security Misconfiguration** | Leaked stack traces; open CORS policies. | 1. Whitelisted `CORS` origins.<br>2. `helmet` security headers.<br>3. Centralized error handler masking internal stack traces in production. |
| **A06: Vulnerable Components** | Outdated or high-risk npm packages. | 1. Strictly locked dependency list (ADR-002).<br>2. Zero untrusted or unreviewed dependencies.<br>3. Pure MERN stack with verified packages. |
| **A07: Identification & Auth Failures** | Brute-force credential stuffing. | 1. `authLimiter` (10 attempts per 15 min).<br>2. Strict password complexity rules on register (min 8 chars, 1 uppercase, 1 digit). |
| **A08: Software & Data Integrity** | Corrupted debrief submissions or manipulated status changes. | 1. Strict enum validation.<br>2. Atomic debrief submission endpoint.<br>3. Timestamp immutability checks. |
| **A09: Security Logging & Monitoring** | Attackers exploiting errors without detection. | 1. Structured server error logging.<br>2. Passwords and tokens stripped from all log statements. |
| **A10: Server-Side Request Forgery** | User providing malicious `jobUrl` triggering internal server fetches. | 1. JobCaliber stores `jobUrl` strictly as text for outbound client navigation.<br>2. No server-side HTTP scraping or fetching is performed on user URLs in MVP. |

---

## 8. Centralized Error Handling & Information Leakage Prevention

Information leakage in error responses gives attackers clues about server frameworks, file paths, and database structures.

### 8.1 Error Handler Implementation Blueprint

```javascript
// server/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred. Please try again later.';

  // Log error details on the server (never expose to client)
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose CastError (Invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource identifier: ${err.value}`;
  }

  // Mongoose Duplicate Key Error (e.g. unique email or roundId+topicName)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = field === 'email' 
      ? 'An account with this email address already exists.' 
      : `Duplicate entry recorded for ${field}.`;
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
    return res.status(statusCode).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Production vs Development response
  const isDevelopment = process.env.NODE_ENV === 'development';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && { stack: err.stack }) // Stack trace only exposed in dev mode
  });
};

module.exports = errorHandler;
```

---

## 9. Environment Configuration & Secret Management

All sensitive parameters must be configured via environment variables.

### 9.1 `.env.example` Specification

```bash
# Server Environment Configuration
NODE_ENV=development
PORT=5000

# Database Connection (MongoDB)
MONGO_URI=mongodb://localhost:27017/jobcaliber

# Authentication & Security
JWT_SECRET=super_secret_jwt_key_must_be_at_least_32_characters_long_random_entropy
COOKIE_SECRET=super_secret_cookie_parser_signing_key_at_least_32_chars

# Client Application URL (For CORS Whitelist)
CLIENT_URL=http://localhost:5173
```

### 9.2 Secret Generation Best Practice

In production, `JWT_SECRET` and `COOKIE_SECRET` must be cryptographically generated:
```bash
# Command to generate 64-byte high-entropy hex string:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 10. Security Verification & Testing Checklist

Before any backend code is approved for Phase 2, it must pass this verification matrix:

- [ ] **Auth Cookie Test:** Verify `Set-Cookie` contains `HttpOnly; SameSite=Lax` and NO token is in response body.
- [ ] **Rate Limit Test:** Send 11 rapid requests to `POST /api/auth/login` and verify HTTP 429 status.
- [ ] **NoSQL Injection Test:** Send `{ "email": { "$gt": "" }, "password": "pass" }` and verify `$` is stripped.
- [ ] **IDOR Protection Test:** Authenticate as User A and attempt to `GET /api/applications/:userBAppId`; verify HTTP 404 is returned.
- [ ] **Parent-Child Integrity Test:** Authenticate as User A and attempt to log a round referencing User B's application ID; verify HTTP 404.
- [ ] **Password Exposure Test:** Verify `passwordHash` is excluded from all `GET /api/auth/me` and user responses.
- [ ] **Error Sanitization Test:** Trigger database failure and verify stack trace is NOT visible in production mode.

---

*End of Security Architecture Specification (Step 1.14).*
