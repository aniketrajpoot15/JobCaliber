// ============================================
// Global Error Handler Middleware
// ============================================
// This is Stage 10 of the middleware pipeline (SECURITY.md §8).
// It MUST be registered LAST in server.js — after all routes.
//
// WHY WE NEED THIS:
// Without a global error handler, unhandled errors either:
//   1. Crash the entire server (unhandled promise rejection)
//   2. Send raw stack traces to the client (security risk)
//   3. Return inconsistent error formats (bad API design)
//
// This middleware catches ALL errors and returns a consistent
// JSON response: { success: false, message, stack (dev only) }
//
// HOW EXPRESS ERROR MIDDLEWARE WORKS:
// Normal middleware has 3 params: (req, res, next)
// Error middleware has 4 params: (err, req, res, next)
//                                 ^^^
// Express recognizes the 4th param and ONLY calls this middleware
// when an error is thrown or passed via next(error).
//
// HOW ERRORS REACH HERE:
//   1. throw new Error('...')     → Express catches it
//   2. next(error)                → Explicitly passed by a controller
//   3. Promise rejection in async → Express 5 auto-catches these
// ============================================

/**
 * Global error handler middleware.
 *
 * Catches all errors thrown by routes/controllers and returns
 * a consistent JSON error response. Handles specific Mongoose
 * error types (CastError, duplicate key, validation errors)
 * with user-friendly messages.
 *
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function (required for Express to recognize this as error middleware)
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 (Internal Server Error) if no status code was set.
  // Controllers can set a custom status code before throwing:
  //   const error = new Error('Not found');
  //   error.statusCode = 404;
  //   throw error;
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred. Please try again later.';

  // --- Log the error on the server (for debugging) ---
  // This log stays on the server and is NEVER sent to the client.
  // In production, you'd send this to a logging service (Datadog, Sentry, etc.)
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  // =============================================
  // MONGOOSE-SPECIFIC ERROR HANDLING
  // =============================================
  // Mongoose throws specific error types that we convert into
  // user-friendly messages. Without this, the client would see
  // cryptic internal error messages.

  // --- Mongoose CastError ---
  // Thrown when an invalid ObjectId is passed (e.g., GET /api/applications/not-a-valid-id)
  // Default message would be: "Cast to ObjectId failed for value "not-a-valid-id""
  // We replace it with something human-readable.
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource identifier: ${err.value}`;
  }

  // --- MongoDB Duplicate Key Error (code 11000) ---
  // Thrown when a unique index constraint is violated.
  // Most common case: trying to register with an email that already exists.
  // We give a specific message for email, generic for other fields.
  if (err.code === 11000) {
    statusCode = 409; // 409 Conflict
    const field = Object.keys(err.keyValue)[0];
    message = field === 'email'
      ? 'An account with this email address already exists.'
      : `Duplicate entry recorded for ${field}.`;
  }

  // --- Mongoose ValidationError ---
  // Thrown when a document fails schema validation (required fields missing,
  // enum mismatch, minlength violated, etc.)
  // Contains multiple sub-errors, one per invalid field.
  // We return them as a structured array so the frontend can show
  // field-specific error messages.
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

  // =============================================
  // SEND THE ERROR RESPONSE
  // =============================================
  // In development: include the stack trace (helpful for debugging).
  // In production: NEVER include the stack trace (security risk —
  //   it reveals file paths, function names, and internal structure).
  const isDevelopment = process.env.NODE_ENV === 'development';

  return res.status(statusCode).json({
    success: false,
    message,
    // The spread operator (...) conditionally includes the stack:
    //   isDevelopment && { stack: err.stack }
    // If isDevelopment is true  → spreads { stack: "Error: ..." }
    // If isDevelopment is false → spreads false (which spreads nothing)
    ...(isDevelopment && { stack: err.stack })
  });
};

module.exports = errorHandler;
