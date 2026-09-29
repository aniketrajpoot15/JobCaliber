// ============================================
// JobCaliber Server — Application Entry Point
// ============================================
// This is the FIRST file Node.js executes.
// It loads environment variables, creates the Express app,
// registers middleware, and starts listening for HTTP requests.
// ============================================

// --- Step 1: Load environment variables ---
// dotenv reads the .env file and injects each KEY=VALUE pair
// into process.env, making them accessible anywhere in the app.
// This MUST be the very first thing that runs — before importing
// any module that might read process.env (like a future db.js).
const dotenv = require('dotenv');
dotenv.config();

// --- Step 2: Import Express and middleware packages ---
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('./middleware/mongoSanitize');

// --- Step 3: Create the Express application ---
// express() returns an "app" object — the central piece of an Express server.
// All middleware, routes, and error handlers will be registered on this object.
const app = express();

// ============================================
// MIDDLEWARE PIPELINE (Stages 1–5)
// ============================================
// Middleware executes in the ORDER it is registered.
// This order follows the 10-stage security pipeline defined in
// docs/Architecture/SECURITY.md (§2). Stages 6–10 will be added
// in future steps as routes and auth are built.
// ============================================

// --- Stage 1: CORS (Cross-Origin Resource Sharing) ---
// The browser blocks requests from one origin (e.g., localhost:5173)
// to a different origin (e.g., localhost:5000) by default. CORS
// middleware tells the browser: "It's okay, I trust this origin."
//
// WHY FIRST: CORS must run before any other processing. If it fails,
// the browser rejects the request before it even reaches our routes.
//
// credentials: true → allows the browser to send cookies (our JWT lives
//   in an HttpOnly cookie, so this is essential for authentication)
// origin function → dynamically checks if the request's origin is in
//   our whitelist (only CLIENT_URL is allowed)
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, server-to-server)
    // or requests from our whitelisted origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Stage 2: Helmet (Security HTTP Headers) ---
// Helmet sets ~15 HTTP response headers that defend against common
// web vulnerabilities:
//   - X-Content-Type-Options: nosniff → prevents MIME-type sniffing
//   - X-Frame-Options: SAMEORIGIN → prevents clickjacking
//   - Strict-Transport-Security → enforces HTTPS in production
//   - Content-Security-Policy → controls what resources the page can load
//
// WHY SECOND: Security headers must be set on every response,
// regardless of whether the request succeeds or fails. They go
// early so every response — including error responses — gets them.
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

// --- Stage 3: Body Parsers (JSON + URL-encoded) ---
// express.json() parses incoming request bodies that have
// Content-Type: application/json. Without this, req.body is undefined.
//
// limit: '10kb' → rejects request bodies larger than 10KB.
// This prevents attackers from sending massive payloads to exhaust
// server memory (a Denial-of-Service vector).
//
// express.urlencoded() parses form submissions (Content-Type:
// application/x-www-form-urlencoded). extended: true allows nested objects.
//
// WHY THIRD: Body must be parsed before sanitization (Stage 5) can
// inspect it, and before route handlers can read req.body.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- Stage 4: Cookie Parser ---
// Parses the Cookie header from incoming requests and populates
// req.cookies (unsigned cookies) and req.signedCookies (signed cookies).
//
// We pass COOKIE_SECRET so cookie-parser can verify signed cookies.
// Signed cookies include a cryptographic signature — if someone tampers
// with the cookie value, the signature won't match and the server knows
// it was modified.
//
// WHY FOURTH: Cookies must be parsed before the auth middleware (Stage 7,
// future step) can extract the JWT token from req.cookies.
app.use(cookieParser(process.env.COOKIE_SECRET));

// --- Stage 5: NoSQL Injection Defense ---
// MongoDB operators like $gt, $ne, $or can be injected through user input
// to bypass authentication or extract unauthorized data. For example:
//   { "email": { "$gt": "" }, "password": { "$gt": "" } }
// would match ALL users in the database.
//
// Our custom sanitizer (middleware/mongoSanitize.js) strips any keys
// containing $ or . from req.body and req.params. It replaces the
// prohibited characters with '_' to preserve object structure.
//
// NOTE: We wrote a custom sanitizer because the popular
// express-mongo-sanitize package (v2.2.0) is abandoned and crashes
// on Express 5 (req.query is read-only in Express 5). Our version
// sanitizes req.body and req.params; query params are validated
// per-route using express-validator (which is more secure anyway).
//
// WHY FIFTH: Sanitization must happen AFTER the body is parsed (Stage 3)
// but BEFORE any route handler or database query reads the data.
app.use(mongoSanitize());

// ============================================
// ROUTES (Stages 6–9 — added in future steps)
// ============================================
// Future: Rate limiting (Stage 6), Auth guard (Stage 7),
// Validation (Stage 8), Route handlers (Stage 9)

// --- Temporary health-check route ---
// A simple GET route to verify the server is reachable.
// Useful for quick testing before real routes are built.
// This will be removed or moved once proper routes are added.
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'JobCaliber API is running',
    environment: process.env.NODE_ENV
  });
});

// ============================================
// ERROR HANDLER (Stage 10 — added in Step 2.8)
// ============================================
// Future: Global error handler middleware (must be registered LAST)

// --- Define the port ---
// Read from environment variable first (set in .env).
// Fall back to 5000 if not defined (defensive default).
const PORT = process.env.PORT || 5000;

// --- Start the server ---
// app.listen() binds the Express app to a TCP port and begins
// accepting incoming HTTP connections. The callback fires once
// the server is ready.
app.listen(PORT, () => {
  console.log(`JobCaliber server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
