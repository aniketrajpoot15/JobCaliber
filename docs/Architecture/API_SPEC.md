<!-- 📌 WHAT IS THIS FILE? This is the complete REST API specification for JobCaliber. Every endpoint is documented with its HTTP method, URL path, request body/params, validation rules, success response, error responses, and security requirements. Any developer or agent implementing controllers and routes must follow this specification exactly. -->

# JOBCALIBER — REST API SPECIFICATION

> **Version:** 1.0.0  
> **Status:** Phase 1 (Architecture) — In Progress  
> **Last Updated:** 2026-09-26  
> **Base URL:** `http://localhost:5000` (development)  
> **Content-Type:** `application/json` for all request/response bodies  
> **Authentication:** JWT in HttpOnly cookie (ADR-007)  
> **Reference Documents:**  
> - `docs/Research_And_Documentation/PRD.md` (Functional Requirements)  
> - `docs/Research_And_Documentation/DECISIONS.md` (Architecture Decision Records)  
> - `docs/Architecture/DATABASE_SCHEMA.md` (Schema Definitions)  
> - `AGENTS.md` (Section 7: API Route Structure, Section 9: Security Rules)

---

## Table of Contents

1. [API Design Conventions](#1-api-design-conventions)
2. [Standard Error Response Format](#2-standard-error-response-format)
3. [Authentication Cookie Configuration](#3-authentication-cookie-configuration)
4. [Auth API — `/api/auth`](#4-auth-api--apiauth)
5. [Applications API — `/api/applications`](#5-applications-api--apiapplications)
6. [Interviews API — `/api/interviews`](#6-interviews-api--apiinterviews)
7. Analytics API — `/api/analytics` *(Step 1.9)*

---

## 1. API Design Conventions

These conventions apply consistently across **every** endpoint in the API.

### 1.1 HTTP Methods

| Method | Purpose | Idempotent? |
|---|---|---|
| `GET` | Retrieve resource(s) | Yes |
| `POST` | Create a new resource | No |
| `PUT` | Full resource replacement | Yes |
| `PATCH` | Partial resource update | Yes |
| `DELETE` | Remove / archive a resource | Yes |

### 1.2 URL Naming

- All lowercase, kebab-case for multi-word segments
- Resource nouns are plural: `/api/applications`, `/api/interviews`
- Single-resource access via ID: `/api/applications/:id`
- Sub-resources: `/api/applications/:id/status`
- Action endpoints where REST doesn't fit: `/api/auth/login`, `/api/auth/logout`

### 1.3 Status Code Usage

| Code | Meaning | When Used |
|---|---|---|
| `200` | OK | Successful GET, PATCH, PUT, or action |
| `201` | Created | Successful POST that creates a resource |
| `204` | No Content | Successful DELETE or action with no response body |
| `400` | Bad Request | Validation failure, malformed input |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Valid token but insufficient permissions (tenant mismatch) |
| `404` | Not Found | Resource doesn't exist or belongs to another user |
| `409` | Conflict | Duplicate resource (e.g., email already registered) |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server failure |

### 1.4 Tenant Isolation

Every endpoint that accesses user-owned data **MUST** include `{ userId: req.user._id }` in every database query. This is the non-negotiable security boundary (AGENTS.md §9, Rule #3). The API spec notes this per-endpoint, but the rule is global.

### 1.5 Request Validation

All request bodies and query parameters are validated using `express-validator` **before** reaching controller logic. Validation errors are collected and returned as a structured array (see §2).

---

## 2. Standard Error Response Format

Every error response from the API follows this consistent shape:

### 2.1 Validation Error (400)

Returned when `express-validator` catches one or more input problems.

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### 2.2 Authentication Error (401)

Returned when no valid JWT cookie is present.

```json
{
  "success": false,
  "message": "Not authenticated. Please log in."
}
```

### 2.3 Resource Not Found (404)

Returned when the requested resource doesn't exist or doesn't belong to the authenticated user.

```json
{
  "success": false,
  "message": "Application not found"
}
```

### 2.4 Conflict Error (409)

Returned when a unique constraint is violated (e.g., duplicate email).

```json
{
  "success": false,
  "message": "An account with this email already exists"
}
```

### 2.5 Rate Limit Error (429)

Returned when the user exceeds the rate limit for an endpoint.

```json
{
  "success": false,
  "message": "Too many requests. Please try again after 15 minutes."
}
```

### 2.6 Server Error (500)

Returned for unexpected internal errors. **Never** expose stack traces or internal details to the client.

```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later."
}
```

### Why This Format?

- **`success: false`** lets the frontend quickly branch on `response.data.success` without inspecting status codes
- **`message`** is always human-readable — suitable for displaying in a toast/alert
- **`errors[]`** (validation only) provides per-field feedback for inline form error highlighting
- **`field`** in each error maps directly to the form input name, enabling the frontend to show "Email is invalid" next to the email field

---

## 3. Authentication Cookie Configuration

All auth endpoints that issue or clear the JWT use this exact cookie configuration (ADR-007):

### 3.1 Cookie Settings

```javascript
const COOKIE_OPTIONS = {
  httpOnly: true,       // JavaScript cannot read the cookie (XSS protection)
  secure: process.env.NODE_ENV === 'production',  // HTTPS-only in production
  sameSite: 'lax',      // Prevents CSRF for non-GET requests
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
  path: '/'             // Cookie sent with all routes
};
```

### 3.2 Cookie Name

```
token
```

### 3.3 JWT Payload

The JWT contains only what's needed to identify the user and verify the token:

```json
{
  "id": "60f7b2a1e13e8c001f8e4b2a",
  "iat": 1726876800,
  "exp": 1727481600
}
```

| Field | Type | Description |
|---|---|---|
| `id` | `String` | The user's MongoDB `_id` (hex string) |
| `iat` | `Number` | Issued-at timestamp (seconds since epoch, auto-set by `jsonwebtoken`) |
| `exp` | `Number` | Expiration timestamp (7 days from issuance, auto-set by `jsonwebtoken`) |

### Why Only `id` in the Payload?

- **Minimal payload = smaller cookie size.** Cookies are sent with *every* request. Keeping the payload small (< 200 bytes) avoids bloating headers.
- **No stale data.** If we included `fullName` or `email` in the token, changes to those fields wouldn't reflect until the user re-logged in. By storing only `id`, the `GET /api/auth/me` endpoint always returns fresh data from the database.
- **Security.** Less data in the token = less data leaked if the token is somehow exposed (though HttpOnly mitigates this).

### 3.4 JWT Signing Configuration

```javascript
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,  // From .env — NEVER hardcoded
  expiresIn: '7d'                  // 7-day token lifetime
};
```

### 3.5 Auth Middleware Flow

Protected endpoints use an `auth` middleware that:

1. Reads the `token` cookie from `req.cookies.token`
2. If missing → responds `401` (see §2.2)
3. Verifies the JWT using `jwt.verify(token, process.env.JWT_SECRET)`
4. If invalid/expired → responds `401`
5. Fetches the user from the database: `User.findById(decoded.id)`
6. If user not found (deleted account) → responds `401`
7. Attaches the user document to `req.user` for downstream use
8. Calls `next()` to proceed to the controller

```
Browser Request
    │
    ▼
[cookie-parser] → Parses cookie header → req.cookies.token available
    │
    ▼
[auth middleware] → Verify JWT → Fetch user → req.user = user document
    │
    ▼
[controller] → Uses req.user._id for tenant-isolated queries
```

---

## 4. Auth API — `/api/auth`

**Purpose:** User registration, login, logout, and session verification.  
**Rate Limiting:** Auth endpoints are rate-limited to **10 requests per 15 minutes per IP** (FR-01.5).  
**Requirements Coverage:** FR-01.1 through FR-01.7

### Rate Limit Configuration

```javascript
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // 10 attempts per window
  message: {
    success: false,
    message: 'Too many requests. Please try again after 15 minutes.'
  },
  standardHeaders: true,      // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false        // Disable X-RateLimit-* headers
});
```

**Why 10 per 15 minutes?** This is aggressive enough to stop brute-force password attacks (a bot would need 16+ hours to try 10,000 passwords) while permitting legitimate users who mistype credentials a few times.

---

### 4.1 `POST /api/auth/register`

**Purpose:** Create a new user account.  
**Auth Required:** No (public)  
**Rate Limited:** Yes (10 per 15 min per IP)  
**Requirement:** FR-01.1, FR-01.2, FR-01.3

#### Request

```
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**

```json
{
  "fullName": "Aniket Rajpoot",
  "email": "aniket@example.com",
  "password": "MySecure1"
}
```

**Field Validation Rules (express-validator):**

| Field | Type | Required | Validation | Sanitization |
|---|---|---|---|---|
| `fullName` | `String` | Yes | `isLength({ min: 2, max: 100 })` | `trim()` |
| `email` | `String` | Yes | `isEmail()`, `isLength({ max: 255 })` | `trim()`, `normalizeEmail()` |
| `password` | `String` | Yes | `isLength({ min: 8, max: 128 })` | None (raw input hashed, never stored) |

**Password Policy:**
- Minimum 8 characters (enforced server-side)
- Maximum 128 characters (prevent bcrypt DoS — bcrypt has a 72-byte input limit; 128 chars is safely above what users would type while still capped)
- Frontend adds UX hints (1 uppercase, 1 number) but server does NOT enforce complexity — only length. This is a deliberate MVP simplification; complexity rules can be added later without API changes.

#### Success Response

```
HTTP/1.1 201 Created
Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "fullName": "Aniket Rajpoot",
      "email": "aniket@example.com",
      "targetRole": "",
      "staleThresholdDays": 14,
      "createdAt": "2026-09-26T10:00:00.000Z",
      "updatedAt": "2026-09-26T10:00:00.000Z"
    }
  }
}
```

**Notes:**
- `passwordHash` is **NEVER** included in any response (enforced by `select: false` + `toJSON` transform)
- `__v` is stripped by the `toJSON` transform
- The JWT cookie is set automatically — the client doesn't need to handle it

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Missing/invalid fields | `400` | `{ success: false, message: "Validation failed", errors: [...] }` |
| Email already registered | `409` | `{ success: false, message: "An account with this email already exists" }` |
| Rate limit exceeded | `429` | `{ success: false, message: "Too many requests. Please try again after 15 minutes." }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1. Run express-validator checks → if errors, return 400
2. Check if email exists: User.findOne({ email })
   → If found, return 409
3. Hash password: bcrypt.hash(password, 12)
4. Create user: User.create({ fullName, email, passwordHash })
5. Generate JWT: jwt.sign({ id: user._id }, secret, { expiresIn: '7d' })
6. Set cookie: res.cookie('token', jwt, COOKIE_OPTIONS)
7. Return 201 with user data (passwordHash excluded automatically)
```

---

### 4.2 `POST /api/auth/login`

**Purpose:** Authenticate an existing user and issue a JWT cookie.  
**Auth Required:** No (public)  
**Rate Limited:** Yes (10 per 15 min per IP)  
**Requirement:** FR-01.3, FR-01.4, FR-01.5

#### Request

```
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "aniket@example.com",
  "password": "MySecure1"
}
```

**Field Validation Rules (express-validator):**

| Field | Type | Required | Validation | Sanitization |
|---|---|---|---|---|
| `email` | `String` | Yes | `isEmail()` | `trim()`, `normalizeEmail()` |
| `password` | `String` | Yes | `isLength({ min: 1 })` (non-empty) | None |

**Why minimal password validation on login?** During login, we don't enforce password policy (min 8, etc.). The password was validated at registration time. On login, we only check it's non-empty — then let bcrypt.compare() determine if it matches. This avoids leaking password policy rules to attackers and prevents locking out users if the policy changes.

#### Success Response

```
HTTP/1.1 200 OK
Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "fullName": "Aniket Rajpoot",
      "email": "aniket@example.com",
      "targetRole": "",
      "staleThresholdDays": 14,
      "createdAt": "2026-09-26T10:00:00.000Z",
      "updatedAt": "2026-09-26T10:00:00.000Z"
    }
  }
}
```

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Missing/invalid fields | `400` | `{ success: false, message: "Validation failed", errors: [...] }` |
| Email not found | `401` | `{ success: false, message: "Invalid email or password" }` |
| Wrong password | `401` | `{ success: false, message: "Invalid email or password" }` |
| Rate limit exceeded | `429` | `{ success: false, message: "Too many requests. Please try again after 15 minutes." }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

**Security: Why the same message for "email not found" and "wrong password"?**

Both cases return the identical message `"Invalid email or password"`. This is an intentional security practice called **error message normalization**. If the API said "User not found" vs. "Wrong password," an attacker could:
1. Try random emails until they get "Wrong password" → now they know that email is registered
2. Focus their brute-force attack on that known-valid email

By returning the same generic message for both cases, the API prevents **user enumeration attacks** — the attacker learns nothing about which emails exist in the system.

#### Server-Side Logic (Controller Pseudocode)

```
1. Run express-validator checks → if errors, return 400
2. Find user: User.findOne({ email }).select('+passwordHash')
   → Note: .select('+passwordHash') overrides select: false to include the hash
   → If not found, return 401 (generic message)
3. Compare password: bcrypt.compare(password, user.passwordHash)
   → If no match, return 401 (same generic message)
4. Generate JWT: jwt.sign({ id: user._id }, secret, { expiresIn: '7d' })
5. Set cookie: res.cookie('token', jwt, COOKIE_OPTIONS)
6. Return 200 with user data (passwordHash excluded by toJSON transform)
```

---

### 4.3 `POST /api/auth/logout`

**Purpose:** Clear the JWT cookie, ending the user's session.  
**Auth Required:** No (clearing a non-existent cookie is harmless)  
**Rate Limited:** Yes (10 per 15 min per IP — grouped with other auth endpoints)  
**Requirement:** FR-01.6

#### Request

```
POST /api/auth/logout
```

**Request Body:** None

**Why POST instead of GET?** Logout is a state-changing action (it destroys the session). Per HTTP semantics, state-changing operations should use POST, not GET. Additionally, GET requests can be triggered by link prefetching, browser preloading, or image tags in emails — any of which would accidentally log the user out.

#### Success Response

```
HTTP/1.1 200 OK
Set-Cookie: token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookie Clearing Mechanism:**
Setting `Max-Age=0` (or `expires` to a past date) tells the browser to immediately delete the cookie. The replacement value is an empty string.

```javascript
res.cookie('token', '', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 0,       // Expire immediately
  path: '/'
});
```

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Rate limit exceeded | `429` | `{ success: false, message: "Too many requests. Please try again after 15 minutes." }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

**Why no 401 on logout?** If the user's token is already expired or missing, the logout should still succeed — the goal is to ensure the cookie is cleared. Requiring authentication for logout creates edge cases where users with expired tokens can't log out.

---

### 4.4 `GET /api/auth/me`

**Purpose:** Return the currently authenticated user's profile. Used by the frontend on page load to check if the user is still logged in and to populate the UI with their data.  
**Auth Required:** Yes (auth middleware)  
**Rate Limited:** No (standard endpoint, not a security-sensitive action)  
**Requirement:** FR-01.7

#### Request

```
GET /api/auth/me
Cookie: token=<jwt>
```

**Request Body:** None  
**Query Parameters:** None

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "fullName": "Aniket Rajpoot",
      "email": "aniket@example.com",
      "targetRole": "Full-Stack Engineer",
      "staleThresholdDays": 14,
      "createdAt": "2026-09-26T10:00:00.000Z",
      "updatedAt": "2026-09-26T15:30:00.000Z"
    }
  }
}
```

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| No token cookie present | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Token expired | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Token invalid (tampered) | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| User deleted (token valid but user gone) | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

**Why multiple 401 scenarios with the same message?** Same principle as login error normalization. Whether the token is missing, expired, tampered, or the user was deleted — the client only needs to know "you're not logged in, go to the login page." Differentiating these cases would leak implementation details.

#### Server-Side Logic (Controller Pseudocode)

```
1. Auth middleware runs (§3.5):
   → Reads token from cookie
   → Verifies JWT
   → Fetches user from DB
   → Attaches to req.user
2. Controller returns req.user (already has passwordHash excluded by toJSON)
3. Return 200 with user data
```

#### Frontend Usage Pattern

The frontend calls `GET /api/auth/me` on application mount (e.g., in an `AuthContext` or `useAuth` hook) to:
1. Check if the user has a valid session
2. If 200 → store user data in React state, show authenticated UI
3. If 401 → clear any stale state, redirect to login page
4. `credentials: 'include'` must be set on the fetch/axios request so the browser sends the HttpOnly cookie

```javascript
// Example: useAuth hook pattern (Phase 2)
useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  checkAuth();
}, []);
```

---

### 4.5 Auth API Summary Table

| # | Method | Path | Auth | Rate Limited | Purpose | FR |
|---|---|---|---|---|---|---|
| 4.1 | `POST` | `/api/auth/register` | No | Yes (10/15min) | Create account + issue cookie | FR-01.1, FR-01.2, FR-01.3 |
| 4.2 | `POST` | `/api/auth/login` | No | Yes (10/15min) | Authenticate + issue cookie | FR-01.3, FR-01.4, FR-01.5 |
| 4.3 | `POST` | `/api/auth/logout` | No | Yes (10/15min) | Clear cookie | FR-01.6 |
| 4.4 | `GET` | `/api/auth/me` | Yes | No | Get current user | FR-01.7 |

---

### 4.6 Auth Route File Structure (Phase 2 Reference)

```
server/
├── routes/
│   └── authRoutes.js       ← Route definitions + validation chains
├── controllers/
│   └── authController.js   ← Handler logic (register, login, logout, me)
├── middleware/
│   └── auth.js             ← JWT verification middleware
└── config/
    └── cookieOptions.js     ← Shared COOKIE_OPTIONS constant
```

**Express-Validator Chain Location:** Validation chains live in the route file, not the controller. This keeps the controller focused on business logic and makes validation rules visible alongside route definitions.

```javascript
// Pattern for authRoutes.js (Phase 2)
const { body } = require('express-validator');
const { register, login, logout, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({ /* ... config from §4 ... */ });

router.post('/register', authLimiter, [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 8, max: 128 }).withMessage('Password must be 8-128 characters')
], register);

router.post('/login', authLimiter, [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.post('/logout', authLimiter, logout);

router.get('/me', auth, getMe);
```

---

## 5. Applications API — `/api/applications`

**Purpose:** Create, read, update, filter, search, and archive job applications. This is the most endpoint-rich and query-intensive API surface in JobCaliber.  
**Auth Required:** Yes — every endpoint requires the `auth` middleware (§3.5)  
**Tenant Isolation:** Every database query includes `{ userId: req.user._id }` — no exceptions  
**Rate Limited:** No (standard authenticated endpoints)  
**Requirements Coverage:** FR-02 (Quick-Add), FR-03 (Pipeline), FR-04 (Stale Engine), FR-05 (Search & Filters), FR-06 (JD Snapshot)

---

### 5.1 `GET /api/applications`

**Purpose:** Retrieve a filtered, searched, sorted, and paginated list of the user's applications. This is the most frequently called endpoint in the system — it powers both the Kanban board and the Table view.  
**Auth Required:** Yes  
**Requirements:** FR-03.1, FR-03.3, FR-03.8, FR-04.2, FR-05.1–FR-05.6

#### Request

```
GET /api/applications?status=Applied&search=google&stale=true&startDate=2026-01-01&endDate=2026-09-30&page=1&limit=20&sort=-appliedDate&view=table
Cookie: token=<jwt>
```

**Query Parameters:**

| Parameter | Type | Required | Default | Validation | Description |
|---|---|---|---|---|---|
| `status` | `String` | No | (all statuses) | Must be one of the 7 valid statuses or a comma-separated list of valid statuses | Filter by pipeline stage. Supports multi-select: `status=Applied,Interviewing` (FR-05.3) |
| `search` | `String` | No | (none) | `trim`, `maxLength: 200` | Text search across `companyName` and `roleTitle` (case-insensitive, partial match). Uses MongoDB `$text` index (FR-05.1) |
| `stale` | `String` | No | (none) | Must be `'true'` or `'false'` | Filter by stale flag. `stale=true` returns only stale applications (FR-05.5) |
| `startDate` | `String` | No | (none) | Valid ISO 8601 date string | Filter applications with `appliedDate >= startDate` (FR-05.4) |
| `endDate` | `String` | No | (none) | Valid ISO 8601 date string | Filter applications with `appliedDate <= endDate` (FR-05.4) |
| `archived` | `String` | No | `'false'` | Must be `'true'` or `'false'` | `false` = active pipeline (default). `true` = archived applications only |
| `page` | `Number` | No | `1` | Positive integer, `min: 1` | Page number for pagination |
| `limit` | `Number` | No | `20` | Positive integer, `min: 1`, `max: 100` | Results per page (FR-03.3: default 20) |
| `sort` | `String` | No | `-appliedDate` | Allowed fields: `appliedDate`, `-appliedDate`, `companyName`, `-companyName`, `lastStatusUpdate`, `-lastStatusUpdate`, `createdAt`, `-createdAt` | Sort order. Prefix `-` for descending |
| `view` | `String` | No | `'kanban'` | Must be `'kanban'` or `'table'` | Determines response shape — Kanban needs grouping by status; Table needs flat list |

**How Filters Combine (FR-05.6):**

All filters use AND logic:
```
query = {
  userId: req.user._id,
  isArchived: false,          // default
  AND status IN [Applied]     // if status filter set
  AND $text search "google"   // if search set  
  AND isStale === true        // if stale filter set
  AND appliedDate >= start    // if startDate set
  AND appliedDate <= end      // if endDate set
}
```

#### Success Response — Kanban View (`view=kanban`)

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "data": {
    "columns": {
      "Saved": {
        "count": 5,
        "applications": [
          {
            "_id": "60f7b2a1e13e8c001f8e4b2a",
            "companyName": "Google",
            "roleTitle": "SWE Intern",
            "status": "Saved",
            "appliedDate": "2026-09-20T00:00:00.000Z",
            "lastStatusUpdate": "2026-09-20T00:00:00.000Z",
            "isStale": false,
            "resumeVersionTag": "Backend_v2",
            "daysInStage": 6,
            "createdAt": "2026-09-20T10:00:00.000Z"
          }
        ]
      },
      "Applied": {
        "count": 12,
        "applications": [/* ... */]
      },
      "OA / Screening": { "count": 3, "applications": [/* ... */] },
      "Interviewing": { "count": 2, "applications": [/* ... */] },
      "Offer": { "count": 0, "applications": [] },
      "Rejected": { "count": 4, "applications": [/* ... */] },
      "Ghosted": { "count": 1, "applications": [/* ... */] }
    },
    "totalCount": 27,
    "filters": {
      "status": null,
      "search": null,
      "stale": null,
      "startDate": null,
      "endDate": null,
      "archived": false
    }
  }
}
```

**Why group by status for Kanban?** The Kanban board renders 7 columns, one per status. Grouping server-side avoids the frontend needing to iterate over a flat list and bucket each application — which would re-run on every render.

**`daysInStage`** is a computed field calculated server-side: `Math.floor((Date.now() - lastStatusUpdate) / 86400000)`. It's NOT stored in the database — it's added to the response in the controller.

#### Success Response — Table View (`view=table`)

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "60f7b2a1e13e8c001f8e4b2a",
        "companyName": "Google",
        "roleTitle": "SWE Intern",
        "status": "Applied",
        "appliedDate": "2026-09-15T00:00:00.000Z",
        "lastStatusUpdate": "2026-09-15T00:00:00.000Z",
        "isStale": false,
        "location": "Mountain View, CA",
        "workMode": "Hybrid",
        "source": "LinkedIn",
        "resumeVersionTag": "Backend_v2",
        "daysInStage": 11,
        "createdAt": "2026-09-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalResults": 27,
      "totalPages": 2,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "status": null,
      "search": null,
      "stale": null,
      "startDate": null,
      "endDate": null,
      "archived": false
    }
  }
}
```

**Why no pagination for Kanban?** Kanban shows ALL applications grouped by column. Users need to see every card to drag between columns. Pagination only applies to Table view (FR-03.3).

#### Stale Recalculation on List Fetch (FR-04.2 — On-Read)

Before returning results, the controller recalculates `isStale` for every application in the result set:

```
FOR each application in results:
  IF status is 'Applied' OR 'OA / Screening':
    daysSinceUpdate = floor((now - lastStatusUpdate) / 86400000)
    newIsStale = daysSinceUpdate >= user.staleThresholdDays
    IF newIsStale !== application.isStale:
      application.isStale = newIsStale  // Update in-memory
      // Bulk-write updated isStale flags to DB (batched, non-blocking)
  ELSE:
    IF application.isStale === true:
      application.isStale = false  // Clear stale for non-staleable statuses
```

**Why on-read?** An application submitted 13 days ago was fresh yesterday. Today (day 14, the default threshold), it becomes stale. Without on-read recalculation, the stale badge wouldn't appear until a background job runs. On-read ensures the UI is always accurate.

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid query parameter | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "status", message: "'Unknown' is not a valid status" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1.  Parse query params: status, search, stale, startDate, endDate, archived, page, limit, sort, view
2.  Build MongoDB filter object:
    a. Always: { userId: req.user._id }
    b. Always (default): { isArchived: false } (unless archived=true)
    c. If status: { status: { $in: statusArray } }
    d. If search: { $text: { $search: searchQuery } }
    e. If stale: { isStale: stale === 'true' }
    f. If startDate: { appliedDate: { $gte: new Date(startDate) } }
    g. If endDate: { appliedDate: { $lte: new Date(endDate) } }
3.  Count total results: Application.countDocuments(filter)
4.  Fetch applications:
    a. If view === 'kanban': Application.find(filter).sort(sortObj)  [no pagination]
    b. If view === 'table': Application.find(filter).sort(sortObj).skip((page-1)*limit).limit(limit)
5.  Recalculate isStale for each result (on-read, see above)
6.  Compute daysInStage for each result
7.  If view === 'kanban': Group results into columns object by status
8.  Return 200 with formatted response
```

---

### 5.2 `POST /api/applications`

**Purpose:** Create a new job application (the "Quick-Add" action). Only 2 fields are mandatory (ADR-008).  
**Auth Required:** Yes  
**Requirements:** FR-02.1, FR-02.2, FR-02.3, FR-02.4, FR-02.5, FR-02.6, FR-02.7, FR-02.8

#### Request

```
POST /api/applications
Content-Type: application/json
Cookie: token=<jwt>
```

**Request Body (minimal — Quick-Add):**

```json
{
  "companyName": "Google",
  "roleTitle": "SWE Intern"
}
```

**Request Body (full — with "More Details"):**

```json
{
  "companyName": "Google",
  "roleTitle": "SWE Intern",
  "jobUrl": "https://careers.google.com/jobs/123",
  "location": "Mountain View, CA",
  "workMode": "Hybrid",
  "salaryRange": "$120k–$150k",
  "fullJobDescription": "We are looking for a software engineer...",
  "source": "LinkedIn",
  "resumeVersionTag": "Backend_v2",
  "appliedDate": "2026-09-25",
  "notes": "Referred by John from university"
}
```

**Field Validation Rules (express-validator):**

| Field | Type | Required | Validation | Sanitization |
|---|---|---|---|---|
| `companyName` | `String` | **Yes** | `isLength({ min: 1, max: 200 })` | `trim()` |
| `roleTitle` | `String` | **Yes** | `isLength({ min: 1, max: 200 })` | `trim()` |
| `jobUrl` | `String` | No | `optional()`, `isLength({ max: 2000 })` | `trim()` |
| `location` | `String` | No | `optional()`, `isLength({ max: 150 })` | `trim()` |
| `workMode` | `String` | No | `optional()`, `isIn(['Remote', 'Hybrid', 'Onsite', ''])` | None |
| `salaryRange` | `String` | No | `optional()`, `isLength({ max: 100 })` | `trim()` |
| `fullJobDescription` | `String` | No | `optional()` (no length limit) | None |
| `source` | `String` | No | `optional()`, `isIn(['LinkedIn', 'Naukri', 'Referral', 'Company Website', 'Indeed', 'AngelList', 'Other', ''])` | None |
| `resumeVersionTag` | `String` | No | `optional()`, `isLength({ max: 50 })` | `trim()` |
| `appliedDate` | `String` | No | `optional()`, `isISO8601()` (valid date) | `toDate()` |
| `notes` | `String` | No | `optional()`, `isLength({ max: 2000 })` | `trim()` |

**Fields the client CANNOT set (server-controlled):**
- `userId` — set from `req.user._id`
- `status` — defaults to `'Saved'` (FR-02.2)
- `lastStatusUpdate` — defaults to `Date.now`
- `isStale` — defaults to `false`
- `isArchived` — defaults to `false`

#### Success Response — No Duplicate

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Application created",
  "data": {
    "application": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "userId": "60f7b2a1e13e8c001f8e4b21",
      "companyName": "Google",
      "roleTitle": "SWE Intern",
      "status": "Saved",
      "lastStatusUpdate": "2026-09-26T10:00:00.000Z",
      "isStale": false,
      "jobUrl": "",
      "location": "",
      "workMode": "",
      "salaryRange": "",
      "fullJobDescription": "",
      "source": "",
      "resumeVersionTag": "",
      "appliedDate": "2026-09-26T00:00:00.000Z",
      "notes": "",
      "isArchived": false,
      "createdAt": "2026-09-26T10:00:00.000Z",
      "updatedAt": "2026-09-26T10:00:00.000Z"
    }
  }
}
```

#### Success Response — Duplicate Detected (FR-02.7, FR-02.8)

The application is **still created** — the warning is non-blocking:

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Application created",
  "data": {
    "application": { /* ... same as above ... */ },
    "warning": {
      "type": "DUPLICATE_DETECTED",
      "message": "You already have an application for Google — SWE Intern created on Sep 15, 2026",
      "existingApplicationId": "60f7b2a1e13e8c001f8e4b15"
    }
  }
}
```

**Why non-blocking?** Users may legitimately re-apply to the same company + role (different team, different hiring cycle). The warning helps catch accidental duplicates without restricting intentional ones.

**Frontend handling:** Display the warning as a dismissible banner/toast. Include a link to the existing application so the user can check if it's truly a duplicate.

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Missing required fields | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "companyName", message: "Company name is required" }] }` |
| Invalid enum value | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "workMode", message: "'Flexible' is not a valid work mode" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1. Run express-validator checks → if errors, return 400
2. Duplicate detection:
   a. sixtyDaysAgo = new Date(Date.now() - 60*24*60*60*1000)
   b. existingApp = Application.findOne({
        userId: req.user._id,
        companyName: case-insensitive match,
        roleTitle: case-insensitive match,
        createdAt: { $gte: sixtyDaysAgo }
      })
   c. If found → prepare warning object (do NOT block creation)
3. Build application object:
   a. userId: req.user._id
   b. companyName, roleTitle from req.body (required)
   c. Optional fields from req.body (defaults from schema if not provided)
   d. status: 'Saved' (hardcoded — client cannot override)
   e. lastStatusUpdate: Date.now (hardcoded)
   f. isStale: false (hardcoded)
   g. isArchived: false (hardcoded)
4. Create: Application.create(applicationObject)
5. Return 201 with application + warning (if duplicate found)
```

---

### 5.3 `GET /api/applications/:id`

**Purpose:** Retrieve a single application's full details. Used on the Application Detail page.  
**Auth Required:** Yes  
**Requirements:** FR-06.1, FR-06.3

#### Request

```
GET /api/applications/60f7b2a1e13e8c001f8e4b2a
Cookie: token=<jwt>
```

**Path Parameters:**

| Parameter | Type | Required | Validation |
|---|---|---|---|
| `id` | `String` | Yes | Valid MongoDB ObjectId format (24-character hex string) |

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "userId": "60f7b2a1e13e8c001f8e4b21",
      "companyName": "Google",
      "roleTitle": "SWE Intern",
      "status": "Interviewing",
      "lastStatusUpdate": "2026-09-22T00:00:00.000Z",
      "isStale": false,
      "jobUrl": "https://careers.google.com/jobs/123",
      "location": "Mountain View, CA",
      "workMode": "Hybrid",
      "salaryRange": "$120k–$150k",
      "fullJobDescription": "We are looking for a software engineer intern...",
      "source": "LinkedIn",
      "resumeVersionTag": "Backend_v2",
      "appliedDate": "2026-09-15T00:00:00.000Z",
      "notes": "Referred by John from university",
      "isArchived": false,
      "daysInStage": 4,
      "createdAt": "2026-09-15T10:00:00.000Z",
      "updatedAt": "2026-09-22T14:30:00.000Z"
    }
  }
}
```

**Note:** `fullJobDescription` is included in the single application response (it's needed for the detail page) but is **excluded** from list responses (§5.1) to keep payload sizes small.

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid ObjectId format | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "id", message: "Invalid application ID format" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Application not found (or belongs to another user) | `404` | `{ success: false, message: "Application not found" }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

**Security: Why 404 instead of 403 for tenant mismatch?** If the API returned `403 Forbidden` when a user tries to access another user's application, the attacker would learn "this application exists, I just can't access it." By returning `404`, the API reveals nothing — the attacker can't tell whether the application doesn't exist or belongs to someone else.

#### Server-Side Logic (Controller Pseudocode)

```
1. Validate :id is a valid ObjectId → if not, return 400
2. Find application: Application.findOne({ _id: req.params.id, userId: req.user._id })
   → Note: userId filter enforces tenant isolation
3. If not found → return 404
4. Recalculate isStale for this application (on-read)
5. Compute daysInStage
6. Return 200 with application
```

---

### 5.4 `PATCH /api/applications/:id`

**Purpose:** Update one or more fields of an existing application. Used for editing details on the Application Detail page.  
**Auth Required:** Yes  
**Requirements:** FR-02.3, FR-02.4, FR-06.1

#### Request

```
PATCH /api/applications/60f7b2a1e13e8c001f8e4b2a
Content-Type: application/json
Cookie: token=<jwt>
```

**Request Body (partial update — only include fields being changed):**

```json
{
  "location": "New York, NY",
  "salaryRange": "$130k–$160k",
  "notes": "Updated: second interview scheduled"
}
```

**Editable Fields and Validation Rules:**

| Field | Type | Validation | Sanitization |
|---|---|---|---|
| `companyName` | `String` | `optional()`, `isLength({ min: 1, max: 200 })` | `trim()` |
| `roleTitle` | `String` | `optional()`, `isLength({ min: 1, max: 200 })` | `trim()` |
| `jobUrl` | `String` | `optional()`, `isLength({ max: 2000 })` | `trim()` |
| `location` | `String` | `optional()`, `isLength({ max: 150 })` | `trim()` |
| `workMode` | `String` | `optional()`, `isIn(['Remote', 'Hybrid', 'Onsite', ''])` | None |
| `salaryRange` | `String` | `optional()`, `isLength({ max: 100 })` | `trim()` |
| `fullJobDescription` | `String` | `optional()` (no length limit) | None |
| `source` | `String` | `optional()`, `isIn(['LinkedIn', 'Naukri', 'Referral', 'Company Website', 'Indeed', 'AngelList', 'Other', ''])` | None |
| `resumeVersionTag` | `String` | `optional()`, `isLength({ max: 50 })` | `trim()` |
| `appliedDate` | `String` | `optional()`, `isISO8601()` | `toDate()` |
| `notes` | `String` | `optional()`, `isLength({ max: 2000 })` | `trim()` |

**Fields the client CANNOT update via this endpoint (server-controlled):**
- `userId` — immutable (tenant anchor)
- `status` — use `PATCH /api/applications/:id/status` instead (§5.5)
- `lastStatusUpdate` — managed by status change logic
- `isStale` — computed by the stale engine
- `isArchived` — use `PATCH /api/applications/:id/archive` instead (§5.6)
- `_id`, `createdAt` — immutable system fields

**Why a separate endpoint for status?** Status changes trigger side effects (resetting `lastStatusUpdate`, recalculating `isStale`). Mixing status updates with general field edits would make it unclear whether side effects should fire. Separating them keeps each endpoint's behavior predictable.

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Application updated",
  "data": {
    "application": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "companyName": "Google",
      "roleTitle": "SWE Intern",
      "status": "Interviewing",
      "location": "New York, NY",
      "salaryRange": "$130k–$160k",
      "notes": "Updated: second interview scheduled",
      "updatedAt": "2026-09-26T14:00:00.000Z"
    }
  }
}
```

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid ObjectId format | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "id", message: "Invalid application ID format" }] }` |
| Invalid field values | `400` | `{ success: false, message: "Validation failed", errors: [...] }` |
| Attempted to update protected field | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "status", message: "Use PATCH /api/applications/:id/status to change status" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Application not found | `404` | `{ success: false, message: "Application not found" }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1. Validate :id is a valid ObjectId → if not, return 400
2. Run express-validator checks on body fields → if errors, return 400
3. Strip any protected fields from req.body (status, userId, isStale, isArchived, etc.)
4. Find and update: Application.findOneAndUpdate(
     { _id: req.params.id, userId: req.user._id },
     { $set: allowedFields },
     { new: true, runValidators: true }
   )
   → Note: { new: true } returns the UPDATED document
   → Note: { runValidators: true } ensures Mongoose enum/length validators fire on update
5. If not found → return 404
6. Return 200 with updated application
```

---

### 5.5 `PATCH /api/applications/:id/status`

**Purpose:** Change an application's pipeline status. This is a dedicated endpoint because status changes trigger side effects: resetting `lastStatusUpdate` and recalculating `isStale`.  
**Auth Required:** Yes  
**Requirements:** FR-03.1, FR-03.6, FR-04.1, FR-04.2, FR-04.6

#### Request

```
PATCH /api/applications/60f7b2a1e13e8c001f8e4b2a/status
Content-Type: application/json
Cookie: token=<jwt>
```

**Request Body:**

```json
{
  "status": "Interviewing"
}
```

**Field Validation Rules:**

| Field | Type | Required | Validation |
|---|---|---|---|
| `status` | `String` | **Yes** | Must be one of: `'Saved'`, `'Applied'`, `'OA / Screening'`, `'Interviewing'`, `'Offer'`, `'Rejected'`, `'Ghosted'` |

**Status Transition Rules:** In the MVP, any status can transition to any other status. The backend does NOT enforce a state machine (e.g., it's valid to go from `Interviewing` back to `Applied`). The frontend guides logical transitions through the Kanban drag-and-drop UI, but the API is permissive. This is a deliberate MVP simplification.

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Status updated to Interviewing",
  "data": {
    "application": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "companyName": "Google",
      "roleTitle": "SWE Intern",
      "status": "Interviewing",
      "lastStatusUpdate": "2026-09-26T14:30:00.000Z",
      "isStale": false,
      "daysInStage": 0,
      "updatedAt": "2026-09-26T14:30:00.000Z"
    }
  }
}
```

#### Side Effects on Status Change

When status changes, the controller MUST perform these operations atomically:

```
1. Set status = newStatus
2. Set lastStatusUpdate = Date.now()  ← ALWAYS reset on status change
3. Recalculate isStale:
   a. If newStatus is 'Applied' or 'OA / Screening':
      → isStale = false  (just moved here, so clock resets to 0 days)
   b. If newStatus is anything else ('Saved', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'):
      → isStale = false  (these statuses are NEVER stale — FR-04.6)
```

**Why is `isStale` always `false` after a status change?** Because `lastStatusUpdate` is reset to `Date.now()`. Even if the application moves to a staleable status (`Applied` or `OA / Screening`), it was JUST moved there — 0 days have passed, which is always less than the minimum threshold of 7 days. The next time the list is fetched (on-read), the stale engine will recalculate based on elapsed time.

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid ObjectId format | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "id", message: "Invalid application ID format" }] }` |
| Missing status field | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "status", message: "Status is required" }] }` |
| Invalid status value | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "status", message: "'InProgress' is not a valid status" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Application not found | `404` | `{ success: false, message: "Application not found" }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1. Validate :id is a valid ObjectId → if not, return 400
2. Validate req.body.status is a valid enum value → if not, return 400
3. Find and update: Application.findOneAndUpdate(
     { _id: req.params.id, userId: req.user._id },
     {
       $set: {
         status: req.body.status,
         lastStatusUpdate: new Date(),
         isStale: false  // Always false immediately after status change
       }
     },
     { new: true, runValidators: true }
   )
4. If not found → return 404
5. Compute daysInStage (will be 0 since lastStatusUpdate is now)
6. Return 200 with updated application
```

---

### 5.6 `PATCH /api/applications/:id/archive`

**Purpose:** Toggle the archive state of an application. Archiving is the "soft delete" — it hides the application from the active pipeline while preserving it for analytics.  
**Auth Required:** Yes  
**Requirements:** FR-04.4 (one-click archive for stale apps), database schema §3.4.10

#### Request

```
PATCH /api/applications/60f7b2a1e13e8c001f8e4b2a/archive
Content-Type: application/json
Cookie: token=<jwt>
```

**Request Body:**

```json
{
  "isArchived": true
}
```

**Field Validation Rules:**

| Field | Type | Required | Validation |
|---|---|---|---|
| `isArchived` | `Boolean` | **Yes** | Must be `true` or `false` |

**Why a toggle instead of separate archive/unarchive endpoints?** One endpoint with a boolean body handles both directions with a single route. The frontend can archive (`true`) from the pipeline view and unarchive (`false`) from the archived view using the same API call.

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Application archived",
  "data": {
    "application": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "companyName": "Google",
      "roleTitle": "SWE Intern",
      "isArchived": true,
      "updatedAt": "2026-09-26T15:00:00.000Z"
    }
  }
}
```

When unarchiving (`isArchived: false`), the message changes to `"Application restored"`.

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid ObjectId format | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "id", message: "Invalid application ID format" }] }` |
| Missing isArchived field | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "isArchived", message: "isArchived is required" }] }` |
| Invalid isArchived type | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "isArchived", message: "isArchived must be a boolean" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Application not found | `404` | `{ success: false, message: "Application not found" }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1. Validate :id is a valid ObjectId → if not, return 400
2. Validate req.body.isArchived is a boolean → if not, return 400
3. Find and update: Application.findOneAndUpdate(
     { _id: req.params.id, userId: req.user._id },
     { $set: { isArchived: req.body.isArchived } },
     { new: true }
   )
4. If not found → return 404
5. Return 200 with updated application
```

---

### 5.7 `DELETE /api/applications/:id`

**Purpose:** Permanently delete an application and all its child records (interview rounds, questions, problem logs). This is a destructive action reserved for cases where the user explicitly wants to remove data — not the normal archive flow.  
**Auth Required:** Yes  
**Requirements:** Database schema §3.4.10 (archive is preferred; delete is the nuclear option)

#### Request

```
DELETE /api/applications/60f7b2a1e13e8c001f8e4b2a
Cookie: token=<jwt>
```

**Request Body:** None

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Application and all related data permanently deleted"
}
```

**Why 200 instead of 204?** We return a JSON body with a success message for consistency with the rest of the API. The frontend expects all responses to follow the `{ success, message }` shape.

#### Cascade Delete

When an application is deleted, the controller MUST also delete all child records:

```
1. Delete all InterviewRound documents: { applicationId: appId }
2. For each deleted round, delete its:
   a. InterviewQuestion documents: { roundId: roundId }
   b. ProblemLog documents: { roundId: roundId }
3. Delete the Application document itself
```

**Why cascade manually instead of using Mongoose middleware?** Mongoose `pre('deleteOne')` hooks only fire on `document.deleteOne()`, not on `Model.deleteOne()`. Since we use `findOneAndDelete` (query-level), we cascade explicitly in the controller for reliability and clarity.

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid ObjectId format | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "id", message: "Invalid application ID format" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Application not found | `404` | `{ success: false, message: "Application not found" }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1. Validate :id is a valid ObjectId → if not, return 400
2. Find application: Application.findOne({ _id: req.params.id, userId: req.user._id })
   → If not found, return 404
3. Get all round IDs: InterviewRound.find({ applicationId: appId }).select('_id')
4. Delete child data:
   a. InterviewQuestion.deleteMany({ roundId: { $in: roundIds } })
   b. ProblemLog.deleteMany({ roundId: { $in: roundIds } })
   c. InterviewRound.deleteMany({ applicationId: appId })
5. Delete the application: Application.findOneAndDelete({ _id: appId, userId: req.user._id })
6. Return 200 with success message
```

---

### 5.8 Applications API Summary Table

| # | Method | Path | Auth | Purpose | FR |
|---|---|---|---|---|---|
| 5.1 | `GET` | `/api/applications` | Yes | List with filters, search, pagination, stale recalc | FR-03, FR-04, FR-05 |
| 5.2 | `POST` | `/api/applications` | Yes | Create application (Quick-Add) + duplicate detection | FR-02 |
| 5.3 | `GET` | `/api/applications/:id` | Yes | Get single application (full detail) | FR-06 |
| 5.4 | `PATCH` | `/api/applications/:id` | Yes | Update application fields | FR-02.3, FR-02.4 |
| 5.5 | `PATCH` | `/api/applications/:id/status` | Yes | Change pipeline status + side effects | FR-03.1, FR-03.6, FR-04 |
| 5.6 | `PATCH` | `/api/applications/:id/archive` | Yes | Toggle archive (soft delete / restore) | FR-04.4 |
| 5.7 | `DELETE` | `/api/applications/:id` | Yes | Permanently delete + cascade children | — |

---

### 5.9 Applications Route File Structure (Phase 2 Reference)

```
server/
├── routes/
│   └── applicationRoutes.js  ← Route definitions + validation chains
├── controllers/
│   └── applicationController.js  ← 7 handler functions
└── utils/
    └── staleEngine.js         ← Shared isStale calculation logic
```

**Express-Validator Chain Location:** Same convention as auth — validation chains live in the route file:

```javascript
// Pattern for applicationRoutes.js (Phase 2)
const { body, param, query } = require('express-validator');
const {
  getApplications,
  createApplication,
  getApplication,
  updateApplication,
  updateStatus,
  toggleArchive,
  deleteApplication
} = require('../controllers/applicationController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/', [
  query('status').optional().custom(/* validate comma-separated status list */),
  query('search').optional().trim().isLength({ max: 200 }),
  query('stale').optional().isIn(['true', 'false']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sort').optional().isIn([
    'appliedDate', '-appliedDate',
    'companyName', '-companyName',
    'lastStatusUpdate', '-lastStatusUpdate',
    'createdAt', '-createdAt'
  ]),
  query('view').optional().isIn(['kanban', 'table']),
  query('archived').optional().isIn(['true', 'false'])
], getApplications);

router.post('/', [
  body('companyName').trim().isLength({ min: 1, max: 200 })
    .withMessage('Company name is required (1-200 characters)'),
  body('roleTitle').trim().isLength({ min: 1, max: 200 })
    .withMessage('Role title is required (1-200 characters)'),
  body('jobUrl').optional().trim().isLength({ max: 2000 }),
  body('location').optional().trim().isLength({ max: 150 }),
  body('workMode').optional().isIn(['Remote', 'Hybrid', 'Onsite', '']),
  body('salaryRange').optional().trim().isLength({ max: 100 }),
  body('fullJobDescription').optional(),
  body('source').optional().isIn([
    'LinkedIn', 'Naukri', 'Referral', 'Company Website',
    'Indeed', 'AngelList', 'Other', ''
  ]),
  body('resumeVersionTag').optional().trim().isLength({ max: 50 }),
  body('appliedDate').optional().isISO8601().toDate(),
  body('notes').optional().trim().isLength({ max: 2000 })
], createApplication);

router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid application ID format')
], getApplication);

router.patch('/:id', [
  param('id').isMongoId().withMessage('Invalid application ID format'),
  body('companyName').optional().trim().isLength({ min: 1, max: 200 }),
  body('roleTitle').optional().trim().isLength({ min: 1, max: 200 }),
  /* ... other optional field validators ... */
], updateApplication);

router.patch('/:id/status', [
  param('id').isMongoId().withMessage('Invalid application ID format'),
  body('status').isIn([
    'Saved', 'Applied', 'OA / Screening', 'Interviewing',
    'Offer', 'Rejected', 'Ghosted'
  ]).withMessage('Invalid application status')
], updateStatus);

router.patch('/:id/archive', [
  param('id').isMongoId().withMessage('Invalid application ID format'),
  body('isArchived').isBoolean().withMessage('isArchived must be true or false')
], toggleArchive);

router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid application ID format')
], deleteApplication);
```

---

## 6. Interviews API — `/api/interviews`

**Purpose:** Schedule interview rounds, track round history, record post-interview debriefs (FR-08), log questions and stumbled topics / problem logs (FR-09), and feed into Action Center (FR-13) and Weakness Heatmap (FR-10).  
**Auth Required:** Yes — every endpoint requires the `auth` middleware (§3.5)  
**Tenant Isolation:** Every database query includes `{ userId: req.user._id }` — no exceptions  
**Rate Limited:** No (standard authenticated endpoints)  
**Requirements Coverage:** FR-07 (Interview Round Logger), FR-08 (90s Post-Interview Debrief), FR-09 (Stumbled Topic Tagging), FR-13 (Action Center upcoming interviews & debrief nudges)

---

### 6.1 `GET /api/interviews/upcoming`

**Purpose:** Retrieve all upcoming scheduled interview rounds for the authenticated user within a configurable window (default: next 7 days). Powers the Dashboard upcoming interviews widget and Action Center Nudge #1 ("Interview scheduled within next 48 hours").  
**Auth Required:** Yes  
**Requirements:** FR-07.4, FR-13.1

#### Request

```
GET /api/interviews/upcoming?days=7&limit=10
Cookie: token=<jwt>
```

**Query Parameters:**

| Parameter | Type | Required | Default | Validation | Description |
|---|---|---|---|---|---|
| `days` | `Number` | No | `7` | Positive integer, `min: 1`, `max: 60` | Lookahead window in days (`scheduledDate` between now and now + days) |
| `limit` | `Number` | No | `10` | Positive integer, `min: 1`, `max: 50` | Maximum number of upcoming interviews to return |

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "data": {
    "interviews": [
      {
        "_id": "60f7b2a1e13e8c001f8e4b31",
        "applicationId": "60f7b2a1e13e8c001f8e4b2a",
        "companyName": "Google",
        "roleTitle": "SWE Intern",
        "applicationStatus": "Interviewing",
        "roundType": "Technical",
        "roundOrder": 2,
        "scheduledDate": "2026-09-28T14:00:00.000Z",
        "interviewerName": "Alex Chen",
        "interviewerRole": "Staff SWE",
        "hoursUntilInterview": 45,
        "notes": "Focus on distributed systems and graph algorithms"
      }
    ],
    "count": 1
  }
}
```

**Computed Field:** `hoursUntilInterview` is calculated server-side: `Math.round((scheduledDate - Date.now()) / 3600000)`. It enables Action Center Nudge #1 triggers (< 48 hours) directly from the response.

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid query parameter | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "days", message: "Days must be between 1 and 60" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1. Parse query params: days = parseInt(req.query.days) || 7, limit = parseInt(req.query.limit) || 10
2. now = new Date()
3. futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
4. Fetch rounds:
   InterviewRound.find({
     userId: req.user._id,
     scheduledDate: { $gte: now, $lte: futureDate },
     debriefCompleted: false
   })
   .sort({ scheduledDate: 1 })
   .limit(limit)
   .populate('applicationId', 'companyName roleTitle status')
5. Map results to flatten companyName, roleTitle, applicationStatus and compute hoursUntilInterview
6. Return 200 with formatted array
```

---

### 6.2 `GET /api/interviews/applications/:applicationId`

**Purpose:** Retrieve all interview rounds for a specific job application, ordered chronologically by `roundOrder`. Returns full details including child questions and problem logs for each round.  
**Auth Required:** Yes  
**Requirements:** FR-07.3, FR-08.1

#### Request

```
GET /api/interviews/applications/60f7b2a1e13e8c001f8e4b2a
Cookie: token=<jwt>
```

**Path Parameters:**

| Parameter | Type | Required | Validation |
|---|---|---|---|
| `applicationId` | `String` | Yes | Valid MongoDB ObjectId format |

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "data": {
    "rounds": [
      {
        "_id": "60f7b2a1e13e8c001f8e4b30",
        "applicationId": "60f7b2a1e13e8c001f8e4b2a",
        "roundType": "Screening",
        "roundOrder": 1,
        "scheduledDate": "2026-09-18T10:00:00.000Z",
        "interviewerName": "Sarah Miller",
        "interviewerRole": "Recruiter",
        "debriefCompleted": true,
        "debriefCompletedAt": "2026-09-18T11:00:00.000Z",
        "rating": 4,
        "overallNotes": "Great conversation, covered resume projects and timeline.",
        "questions": [
          {
            "_id": "60f7b2a1e13e8c001f8e4b41",
            "roundId": "60f7b2a1e13e8c001f8e4b30",
            "questionText": "Tell me about a challenging bug you fixed in your project.",
            "topicTag": "Behavioral",
            "difficulty": "Easy",
            "notes": "Discussed the race condition in auth refresh."
          }
        ],
        "problemLogs": [],
        "createdAt": "2026-09-15T12:00:00.000Z",
        "updatedAt": "2026-09-18T11:00:00.000Z"
      },
      {
        "_id": "60f7b2a1e13e8c001f8e4b31",
        "applicationId": "60f7b2a1e13e8c001f8e4b2a",
        "roundType": "Technical",
        "roundOrder": 2,
        "scheduledDate": "2026-09-28T14:00:00.000Z",
        "interviewerName": "Alex Chen",
        "interviewerRole": "Staff SWE",
        "debriefCompleted": false,
        "debriefCompletedAt": null,
        "rating": null,
        "overallNotes": "",
        "questions": [],
        "problemLogs": [],
        "createdAt": "2026-09-20T14:00:00.000Z",
        "updatedAt": "2026-09-20T14:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid ObjectId format | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "applicationId", message: "Invalid application ID format" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Application not found (or unauthorized) | `404` | `{ success: false, message: "Application not found" }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1. Validate req.params.applicationId is a valid ObjectId
2. Verify parent application exists and belongs to user:
   app = Application.findOne({ _id: req.params.applicationId, userId: req.user._id })
   → If not found, return 404 (tenant isolation protection)
3. Fetch rounds:
   rounds = InterviewRound.find({ applicationId: app._id, userId: req.user._id }).sort({ roundOrder: 1 })
4. For each round, query child collections:
   roundIds = rounds.map(r => r._id)
   questions = InterviewQuestion.find({ roundId: { $in: roundIds } })
   problemLogs = ProblemLog.find({ roundId: { $in: roundIds }, userId: req.user._id })
5. Group questions and problemLogs by roundId and attach to each round object
6. Return 200 with rounds array
```

---

### 6.3 `POST /api/interviews`

**Purpose:** Schedule / create a new interview round for an application (FR-07.1, FR-07.2). Automatically assigns `roundOrder` and synchronizes parent application status if needed.  
**Auth Required:** Yes  
**Requirements:** FR-07.1, FR-07.2

#### Request

```
POST /api/interviews
Content-Type: application/json
Cookie: token=<jwt>
```

```json
{
  "applicationId": "60f7b2a1e13e8c001f8e4b2a",
  "roundType": "Technical",
  "scheduledDate": "2026-09-28T14:00:00.000Z",
  "interviewerName": "Alex Chen",
  "interviewerRole": "Staff SWE",
  "notes": "Two coding questions expected: Trees and DP."
}
```

**Field Validation Rules:**

| Field | Type | Required | Validation | Sanitization |
|---|---|---|---|---|
| `applicationId` | `String` | **Yes** | Valid MongoDB ObjectId | None |
| `roundType` | `String` | **Yes** | Must be one of: `'Screening'`, `'Technical'`, `'System Design'`, `'Behavioral'`, `'Hiring Manager'`, `'Take-Home / OA'`, `'Other'` | None |
| `scheduledDate` | `String` | **Yes** | Valid ISO 8601 Date string | `toDate()` |
| `interviewerName` | `String` | No | `optional()`, `isLength({ max: 100 })` | `trim()` |
| `interviewerRole` | `String` | No | `optional()`, `isLength({ max: 100 })` | `trim()` |
| `notes` | `String` | No | `optional()`, `isLength({ max: 2000 })` | `trim()` |

**Server-Controlled Fields (cannot be set via request body):**
- `userId` — set from `req.user._id`
- `roundOrder` — auto-calculated sequentially per application
- `debriefCompleted` — initialized to `false`
- `debriefCompletedAt` — initialized to `null`
- `rating` — initialized to `null`
- `overallNotes` — initialized to `""`

#### Success Response

```
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Interview round scheduled",
  "data": {
    "round": {
      "_id": "60f7b2a1e13e8c001f8e4b31",
      "applicationId": "60f7b2a1e13e8c001f8e4b2a",
      "userId": "60f7b2a1e13e8c001f8e4b21",
      "roundType": "Technical",
      "roundOrder": 2,
      "scheduledDate": "2026-09-28T14:00:00.000Z",
      "interviewerName": "Alex Chen",
      "interviewerRole": "Staff SWE",
      "debriefCompleted": false,
      "debriefCompletedAt": null,
      "rating": null,
      "overallNotes": "",
      "notes": "Two coding questions expected: Trees and DP.",
      "createdAt": "2026-09-26T16:00:00.000Z",
      "updatedAt": "2026-09-26T16:00:00.000Z"
    },
    "applicationStatusUpdated": true,
    "newApplicationStatus": "Interviewing"
  }
}
```

#### Application Status Synchronization Logic

When scheduling an interview round:
- If the parent application is currently in `'Saved'`, `'Applied'`, or `'OA / Screening'`, the system automatically transitions the application's status to `'Interviewing'`.
- This resets `lastStatusUpdate = new Date()` and `isStale = false`.
- If the application is already in `'Interviewing'`, `'Offer'`, `'Rejected'`, or `'Ghosted'`, its status is left untouched.

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Missing required fields | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "roundType", message: "Invalid round type" }] }` |
| Invalid scheduledDate | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "scheduledDate", message: "Valid scheduled date is required" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Application not found (or unauthorized) | `404` | `{ success: false, message: "Application not found" }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

#### Server-Side Logic (Controller Pseudocode)

```
1. Run express-validator checks → if errors, return 400
2. Verify parent application exists and belongs to user:
   app = Application.findOne({ _id: req.body.applicationId, userId: req.user._id })
   → If not found, return 404
3. Calculate roundOrder:
   existingCount = InterviewRound.countDocuments({ applicationId: app._id })
   roundOrder = existingCount + 1
4. Create InterviewRound document:
   round = InterviewRound.create({
     applicationId: app._id,
     userId: req.user._id,
     roundType: req.body.roundType,
     roundOrder: roundOrder,
     scheduledDate: req.body.scheduledDate,
     interviewerName: req.body.interviewerName || '',
     interviewerRole: req.body.interviewerRole || '',
     notes: req.body.notes || ''
   })
5. Sync parent application status if needed:
   statusUpdated = false
   if (['Saved', 'Applied', 'OA / Screening'].includes(app.status)) {
     app.status = 'Interviewing'
     app.lastStatusUpdate = new Date()
     app.isStale = false
     await app.save()
     statusUpdated = true
   }
6. Return 201 with round and status update metadata
```

---

### 6.4 `GET /api/interviews/:id`

**Purpose:** Retrieve single interview round details with its child questions and problem logs.  
**Auth Required:** Yes  
**Requirements:** FR-07.3, FR-08.1

#### Request

```
GET /api/interviews/60f7b2a1e13e8c001f8e4b31
Cookie: token=<jwt>
```

**Path Parameters:**

| Parameter | Type | Required | Validation |
|---|---|---|---|
| `id` | `String` | Yes | Valid MongoDB ObjectId format |

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "data": {
    "round": {
      "_id": "60f7b2a1e13e8c001f8e4b31",
      "applicationId": {
        "_id": "60f7b2a1e13e8c001f8e4b2a",
        "companyName": "Google",
        "roleTitle": "SWE Intern",
        "status": "Interviewing"
      },
      "roundType": "Technical",
      "roundOrder": 2,
      "scheduledDate": "2026-09-28T14:00:00.000Z",
      "interviewerName": "Alex Chen",
      "interviewerRole": "Staff SWE",
      "debriefCompleted": true,
      "debriefCompletedAt": "2026-09-28T15:30:00.000Z",
      "rating": 3,
      "overallNotes": "Struggled with Dijkstra optimization, but behavioral portion went well.",
      "notes": "Two coding questions expected",
      "questions": [
        {
          "_id": "60f7b2a1e13e8c001f8e4b51",
          "questionText": "Find shortest path in weighted directed acyclic graph.",
          "topicTag": "Graphs",
          "difficulty": "Medium",
          "notes": "Took 25 minutes to resolve edge case"
        }
      ],
      "problemLogs": [
        {
          "_id": "60f7b2a1e13e8c001f8e4b61",
          "topicName": "Graphs",
          "category": "DSA",
          "difficulty": "Medium",
          "severity": "Major Gap",
          "notes": "Forgot topological sort step for DAG shortest path"
        }
      ],
      "createdAt": "2026-09-26T16:00:00.000Z",
      "updatedAt": "2026-09-28T15:30:00.000Z"
    }
  }
}
```

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid ObjectId format | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "id", message: "Invalid interview round ID format" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Round not found (or belongs to another user) | `404` | `{ success: false, message: "Interview round not found" }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

---

### 6.5 `PATCH /api/interviews/:id`

**Purpose:** Update metadata of an interview round (reschedule date, change interviewer name/role, edit preparation notes, change round type).  
**Auth Required:** Yes  
**Requirements:** FR-07.3

#### Request

```
PATCH /api/interviews/60f7b2a1e13e8c001f8e4b31
Content-Type: application/json
Cookie: token=<jwt>
```

```json
{
  "scheduledDate": "2026-09-29T16:00:00.000Z",
  "interviewerName": "Alex Chen & Priya Patel",
  "notes": "Rescheduled by recruiter. Two interviewers now."
}
```

**Field Validation Rules:**

| Field | Type | Validation | Sanitization |
|---|---|---|---|
| `roundType` | `String` | `optional()`, `isIn(['Screening', 'Technical', 'System Design', 'Behavioral', 'Hiring Manager', 'Take-Home / OA', 'Other'])` | None |
| `scheduledDate` | `String` | `optional()`, `isISO8601()` | `toDate()` |
| `interviewerName` | `String` | `optional()`, `isLength({ max: 100 })` | `trim()` |
| `interviewerRole` | `String` | `optional()`, `isLength({ max: 100 })` | `trim()` |
| `notes` | `String` | `optional()`, `isLength({ max: 2000 })` | `trim()` |

**Protected Fields (cannot be modified via PATCH):**
- `userId` — immutable tenant anchor
- `applicationId` — round belongs to a fixed application
- `roundOrder` — sequential order managed by system
- `debriefCompleted`, `debriefCompletedAt`, `rating`, `overallNotes` — use dedicated debrief endpoints (§6.6, §6.7)

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Interview round updated",
  "data": {
    "round": {
      "_id": "60f7b2a1e13e8c001f8e4b31",
      "scheduledDate": "2026-09-29T16:00:00.000Z",
      "interviewerName": "Alex Chen & Priya Patel",
      "notes": "Rescheduled by recruiter. Two interviewers now.",
      "updatedAt": "2026-09-26T16:30:00.000Z"
    }
  }
}
```

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid ObjectId | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "id", message: "Invalid interview round ID format" }] }` |
| Attempt to edit protected field | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "rating", message: "Use POST /api/interviews/:id/debrief to submit debrief" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Round not found | `404` | `{ success: false, message: "Interview round not found" }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

---

### 6.6 `POST /api/interviews/:id/debrief`

**Purpose:** Submit the 90-Second Post-Interview Debrief (FR-08, FR-09). This is JobCaliber's signature transactional endpoint — it records round ratings, questions asked, and stumbled topic problem logs in a single atomic request.  
**Auth Required:** Yes  
**Requirements:** FR-08.1, FR-08.2, FR-08.3, FR-08.4, FR-09.1, FR-09.2, FR-09.3, FR-09.4

#### Request

```
POST /api/interviews/60f7b2a1e13e8c001f8e4b31/debrief
Content-Type: application/json
Cookie: token=<jwt>
```

```json
{
  "rating": 3,
  "overallNotes": "Interviewer was friendly. Got stuck on graph traversal complexity.",
  "questions": [
    {
      "questionText": "Implement topological sort and find cycle in a dependency graph.",
      "topicTag": "Graphs",
      "difficulty": "Medium",
      "notes": "Used Kahn's algorithm with indegree array."
    },
    {
      "questionText": "Why did you choose MongoDB over PostgreSQL in your project?",
      "topicTag": "System Design",
      "difficulty": "Easy",
      "notes": "Answered well, explained document flexibility."
    }
  ],
  "problemLogs": [
    {
      "topicName": "Graphs",
      "category": "DSA",
      "difficulty": "Medium",
      "severity": "Major Gap",
      "notes": "Forgot how to detect cycles using DFS coloring (white/gray/black)."
    }
  ]
}
```

**Field Validation Rules:**

| Field | Type | Required | Validation Rules |
|---|---|---|---|
| `rating` | `Number` | **Yes** | Integer between `1` and `5` |
| `overallNotes` | `String` | No | `optional()`, `isLength({ max: 2000 })`, `trim()` |
| `questions` | `Array` | No | Array of question objects (defaults to `[]` if omitted) |
| `questions.*.questionText` | `String` | **Yes** (if question in array) | `isLength({ min: 1, max: 1000 })`, `trim()` |
| `questions.*.topicTag` | `String` | No | `optional()`, `isLength({ max: 50 })`, `trim()` |
| `questions.*.difficulty` | `String` | No | `optional()`, `isIn(['Easy', 'Medium', 'Hard', 'N/A'])` |
| `questions.*.notes` | `String` | No | `optional()`, `isLength({ max: 1000 })`, `trim()` |
| `problemLogs` | `Array` | No | Array of problem log objects (defaults to `[]` if omitted) |
| `problemLogs.*.topicName` | `String` | **Yes** (if item in array) | `isLength({ min: 1, max: 100 })`, `trim()` (FR-09.2 canonical taxonomy or custom) |
| `problemLogs.*.category` | `String` | **Yes** (if item in array) | `isIn(['DSA', 'System Design', 'Behavioral', 'CS Fundamentals', 'Language/Framework', 'Other'])` |
| `problemLogs.*.difficulty` | `String` | No | `optional()`, `isIn(['Easy', 'Medium', 'Hard', 'N/A'])` |
| `problemLogs.*.severity` | `String` | No | `optional()`, `isIn(['Minor Blunder', 'Major Gap', 'Total Blank'])` |
| `problemLogs.*.notes` | `String` | No | `optional()`, `isLength({ max: 1000 })`, `trim()` |

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Debrief submitted successfully",
  "data": {
    "round": {
      "_id": "60f7b2a1e13e8c001f8e4b31",
      "applicationId": "60f7b2a1e13e8c001f8e4b2a",
      "roundType": "Technical",
      "roundOrder": 2,
      "rating": 3,
      "overallNotes": "Interviewer was friendly. Got stuck on graph traversal complexity.",
      "debriefCompleted": true,
      "debriefCompletedAt": "2026-09-28T15:30:00.000Z",
      "updatedAt": "2026-09-28T15:30:00.000Z"
    },
    "questions": [
      {
        "_id": "60f7b2a1e13e8c001f8e4b51",
        "roundId": "60f7b2a1e13e8c001f8e4b31",
        "questionText": "Implement topological sort and find cycle in a dependency graph.",
        "topicTag": "Graphs",
        "difficulty": "Medium",
        "notes": "Used Kahn's algorithm with indegree array.",
        "createdAt": "2026-09-28T15:30:00.000Z"
      },
      {
        "_id": "60f7b2a1e13e8c001f8e4b52",
        "roundId": "60f7b2a1e13e8c001f8e4b31",
        "questionText": "Why did you choose MongoDB over PostgreSQL in your project?",
        "topicTag": "System Design",
        "difficulty": "Easy",
        "notes": "Answered well, explained document flexibility.",
        "createdAt": "2026-09-28T15:30:00.000Z"
      }
    ],
    "problemLogs": [
      {
        "_id": "60f7b2a1e13e8c001f8e4b61",
        "roundId": "60f7b2a1e13e8c001f8e4b31",
        "userId": "60f7b2a1e13e8c001f8e4b21",
        "topicName": "Graphs",
        "category": "DSA",
        "difficulty": "Medium",
        "severity": "Major Gap",
        "notes": "Forgot how to detect cycles using DFS coloring (white/gray/black).",
        "createdAt": "2026-09-28T15:30:00.000Z"
      }
    ],
    "analyticsGuardrailStatus": {
      "totalCompletedDebriefs": 3,
      "minimumRequiredForHeatmap": 5,
      "heatmapUnlocked": false
    }
  }
}
```

**Guardrail Transparency (ADR-005):** The response includes `analyticsGuardrailStatus` reporting progress toward the 5-debrief heatmap unlock threshold (`3/5`).

#### Transactional Integrity Pattern

Saving a debrief touches three collections: `interviewrounds`, `interviewquestions`, and `problemlogs`. To prevent orphaned records if a failure occurs halfway through:

```
1. Start MongoDB session & transaction:
   session = await mongoose.startSession()
   session.startTransaction()

2. Try:
   a. Update round:
      round = await InterviewRound.findOneAndUpdate(
        { _id: roundId, userId: req.user._id },
        {
          rating: req.body.rating,
          overallNotes: req.body.overallNotes || '',
          debriefCompleted: true,
          debriefCompletedAt: new Date()
        },
        { new: true, session }
      )
      if (!round) throw NotFound

   b. Insert questions:
      if (questions.length > 0) {
        questionDocs = questions.map(q => ({ ...q, roundId: round._id }))
        await InterviewQuestion.insertMany(questionDocs, { session })
      }

   c. Insert problem logs:
      if (problemLogs.length > 0) {
        logDocs = problemLogs.map(p => ({ ...p, roundId: round._id, userId: req.user._id }))
        await ProblemLog.insertMany(logDocs, { session })
      }

   d. Commit transaction:
      await session.commitTransaction()

3. Catch error:
   await session.abortTransaction()
   throw error

4. Finally:
   session.endSession()
```

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid rating or payload format | `400` | `{ success: false, message: "Validation failed", errors: [{ field: "rating", message: "Rating must be an integer between 1 and 5" }] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Round not found (or unauthorized) | `404` | `{ success: false, message: "Interview round not found" }` |
| Debrief already completed | `409` | `{ success: false, message: "Debrief has already been submitted for this round. Use PUT /api/interviews/:id/debrief to update." }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

---

### 6.7 `PUT /api/interviews/:id/debrief`

**Purpose:** Edit or revise an already submitted post-interview debrief. Allows the user to update their rating, edit overall notes, or modify questions and stumbled topic problem logs.  
**Auth Required:** Yes  
**Requirements:** FR-08.1, FR-09.1

#### Request

```
PUT /api/interviews/60f7b2a1e13e8c001f8e4b31/debrief
Content-Type: application/json
Cookie: token=<jwt>
```

```json
{
  "rating": 4,
  "overallNotes": "Re-evaluated: solved the problem with minimal hints. Better than I thought.",
  "questions": [
    {
      "questionText": "Implement topological sort and find cycle in a dependency graph.",
      "topicTag": "Graphs",
      "difficulty": "Medium",
      "notes": "Used Kahn's algorithm with indegree array."
    }
  ],
  "problemLogs": [
    {
      "topicName": "Graphs",
      "category": "DSA",
      "difficulty": "Medium",
      "severity": "Minor Blunder",
      "notes": "Small syntax mixup on queue pop."
    }
  ]
}
```

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Debrief updated successfully",
  "data": {
    "round": {
      "_id": "60f7b2a1e13e8c001f8e4b31",
      "rating": 4,
      "overallNotes": "Re-evaluated: solved the problem with minimal hints. Better than I thought.",
      "debriefCompleted": true,
      "debriefCompletedAt": "2026-09-28T15:30:00.000Z",
      "updatedAt": "2026-09-28T18:00:00.000Z"
    },
    "questions": [/* updated questions array */],
    "problemLogs": [/* updated problemLogs array */]
  }
}
```

#### Replacement Semantics

`PUT` performs a complete replacement of child data:
1. Deletes existing `InterviewQuestion` and `ProblemLog` records for `roundId: id`.
2. Inserts new `InterviewQuestion` and `ProblemLog` records from the request body.
3. Updates `rating` and `overallNotes` on `InterviewRound`.
4. Executed inside a Mongoose transaction for atomicity.

#### Error Responses

| Scenario | Status | Response |
|---|---|---|
| Invalid ObjectId | `400` | `{ success: false, message: "Validation failed", errors: [...] }` |
| Not authenticated | `401` | `{ success: false, message: "Not authenticated. Please log in." }` |
| Debrief not yet created | `404` | `{ success: false, message: "No debrief found to update. Submit a debrief first using POST." }` |
| Server error | `500` | `{ success: false, message: "An unexpected error occurred. Please try again later." }` |

---

### 6.8 `DELETE /api/interviews/:id`

**Purpose:** Delete an interview round and cascade delete all associated child questions and problem logs.  
**Auth Required:** Yes  
**Requirements:** Database schema §3.4.10

#### Request

```
DELETE /api/interviews/60f7b2a1e13e8c001f8e4b31
Cookie: token=<jwt>
```

#### Success Response

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Interview round and associated questions and logs deleted"
}
```

#### Cascade Deletion Logic

```
1. Verify round exists and belongs to user:
   round = InterviewRound.findOne({ _id: req.params.id, userId: req.user._id })
   → If not found, return 404
2. Delete child records:
   await InterviewQuestion.deleteMany({ roundId: round._id })
   await ProblemLog.deleteMany({ roundId: round._id, userId: req.user._id })
3. Delete round:
   await InterviewRound.findByIdAndDelete(round._id)
4. Return 200 with success message
```

---

### 6.9 Interviews API Summary Table

| # | Method | Path | Auth | Purpose | FR |
|---|---|---|---|---|---|
| 6.1 | `GET` | `/api/interviews/upcoming` | Yes | List upcoming interviews (lookahead window, countdown) | FR-07.4, FR-13.1 |
| 6.2 | `GET` | `/api/interviews/applications/:applicationId` | Yes | Get all rounds for an application (with child data) | FR-07.3, FR-08.1 |
| 6.3 | `POST` | `/api/interviews` | Yes | Schedule round + sync application status to Interviewing | FR-07.1, FR-07.2 |
| 6.4 | `GET` | `/api/interviews/:id` | Yes | Get single round detail with questions and problem logs | FR-07.3, FR-08.1 |
| 6.5 | `PATCH` | `/api/interviews/:id` | Yes | Update round metadata (reschedule, interviewer, notes) | FR-07.3 |
| 6.6 | `POST` | `/api/interviews/:id/debrief` | Yes | Submit 90s debrief (rating + questions + problem logs) | FR-08, FR-09 |
| 6.7 | `PUT` | `/api/interviews/:id/debrief` | Yes | Edit / replace existing debrief | FR-08, FR-09 |
| 6.8 | `DELETE` | `/api/interviews/:id` | Yes | Delete round + cascade delete child data | — |

---

### 6.10 Interviews Route File Structure (Phase 2 Reference)

```
server/
├── routes/
│   └── interviewRoutes.js    ← Route definitions + validation chains
├── controllers/
│   └── interviewController.js ← 8 handler functions
└── utils/
    └── taxonomy.js           ← Canonical topic taxonomy list (FR-09.2)
```

**Express-Validator Chain Location:** Validation chains live in the route file:

```javascript
// Pattern for interviewRoutes.js (Phase 2)
const { body, param, query } = require('express-validator');
const {
  getUpcomingInterviews,
  getRoundsByApplication,
  createRound,
  getRound,
  updateRound,
  submitDebrief,
  updateDebrief,
  deleteRound
} = require('../controllers/interviewController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/upcoming', [
  query('days').optional().isInt({ min: 1, max: 60 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
], getUpcomingInterviews);

router.get('/applications/:applicationId', [
  param('applicationId').isMongoId().withMessage('Invalid application ID format')
], getRoundsByApplication);

router.post('/', [
  body('applicationId').isMongoId().withMessage('Valid application ID required'),
  body('roundType').isIn([
    'Screening', 'Technical', 'System Design', 'Behavioral',
    'Hiring Manager', 'Take-Home / OA', 'Other'
  ]).withMessage('Invalid round type'),
  body('scheduledDate').isISO8601().toDate().withMessage('Valid scheduled date required'),
  body('interviewerName').optional().trim().isLength({ max: 100 }),
  body('interviewerRole').optional().trim().isLength({ max: 100 }),
  body('notes').optional().trim().isLength({ max: 2000 })
], createRound);

router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid interview round ID format')
], getRound);

router.patch('/:id', [
  param('id').isMongoId().withMessage('Invalid interview round ID format'),
  body('roundType').optional().isIn([
    'Screening', 'Technical', 'System Design', 'Behavioral',
    'Hiring Manager', 'Take-Home / OA', 'Other'
  ]),
  body('scheduledDate').optional().isISO8601().toDate(),
  body('interviewerName').optional().trim().isLength({ max: 100 }),
  body('interviewerRole').optional().trim().isLength({ max: 100 }),
  body('notes').optional().trim().isLength({ max: 2000 })
], updateRound);

router.post('/:id/debrief', [
  param('id').isMongoId().withMessage('Invalid interview round ID format'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('overallNotes').optional().trim().isLength({ max: 2000 }),
  body('questions').optional().isArray(),
  body('questions.*.questionText').trim().isLength({ min: 1, max: 1000 }).withMessage('Question text is required'),
  body('questions.*.topicTag').optional().trim().isLength({ max: 50 }),
  body('questions.*.difficulty').optional().isIn(['Easy', 'Medium', 'Hard', 'N/A']),
  body('problemLogs').optional().isArray(),
  body('problemLogs.*.topicName').trim().isLength({ min: 1, max: 100 }).withMessage('Topic name is required'),
  body('problemLogs.*.category').isIn([
    'DSA', 'System Design', 'Behavioral', 'CS Fundamentals', 'Language/Framework', 'Other'
  ]).withMessage('Valid problem category is required'),
  body('problemLogs.*.severity').optional().isIn(['Minor Blunder', 'Major Gap', 'Total Blank'])
], submitDebrief);

router.put('/:id/debrief', [
  param('id').isMongoId().withMessage('Invalid interview round ID format'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('overallNotes').optional().trim().isLength({ max: 2000 })
  // question and problem log validation same as POST
], updateDebrief);

router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid interview round ID format')
], deleteRound);
```

---

*Section 7 (Analytics API — `/api/analytics`) will be added in Step 1.9.*

