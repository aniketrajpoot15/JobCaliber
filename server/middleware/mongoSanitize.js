// ============================================
// Custom NoSQL Injection Sanitizer
// ============================================
// WHY CUSTOM: The express-mongo-sanitize package (v2.2.0) is
// abandoned (last updated Jan 2022) and incompatible with Express 5.
// Express 5 made req.query a read-only getter, so the package crashes
// with "Cannot set property query of #<IncomingMessage>".
//
// WHAT THIS DOES: Recursively scans objects for keys starting with
// '$' or containing '.' — both are MongoDB operators that attackers
// can inject to bypass queries. For example:
//   { "email": { "$gt": "" } }  →  matches ALL documents
//   { "password": { "$ne": "" } }  →  bypasses password check
//
// This middleware sanitizes req.body and req.params (the mutable ones).
// req.query is read-only in Express 5, so we validate query params
// through express-validator on specific routes instead.
// ============================================

/**
 * Recursively check if an object contains any MongoDB operator keys.
 * A key is dangerous if it starts with '$' or contains '.'.
 *
 * @param {*} obj - The value to check (can be object, array, or primitive)
 * @returns {boolean} true if a prohibited key was found
 */
function hasDollarOrDot(obj) {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  if (Array.isArray(obj)) {
    return obj.some(item => hasDollarOrDot(item));
  }

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      return true;
    }
    if (hasDollarOrDot(obj[key])) {
      return true;
    }
  }

  return false;
}

/**
 * Recursively strip dangerous keys from an object (in-place mutation).
 * Keys starting with '$' or containing '.' are replaced: the '$' or '.'
 * character is swapped with '_'.
 *
 * @param {*} obj - The object to sanitize (mutated in place)
 * @returns {*} The sanitized object (same reference)
 */
function sanitize(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    obj.forEach(item => sanitize(item));
    return obj;
  }

  for (const key of Object.keys(obj)) {
    // Recursively sanitize the value first
    sanitize(obj[key]);

    // Check if this key itself is dangerous
    if (key.startsWith('$') || key.includes('.')) {
      // Create a safe key by replacing $ and . with _
      const safeKey = key.replace(/\$/g, '_').replace(/\./g, '_');
      obj[safeKey] = obj[key];
      delete obj[key];
    }
  }

  return obj;
}

/**
 * Express middleware that sanitizes req.body and req.params
 * to prevent NoSQL injection attacks.
 *
 * Usage: app.use(mongoSanitize());
 *
 * @returns {Function} Express middleware function
 */
function mongoSanitize() {
  return function mongoSanitizeMiddleware(req, res, next) {
    // Sanitize req.body (parsed JSON from express.json())
    if (req.body) {
      sanitize(req.body);
    }

    // Sanitize req.params (URL parameters like :id)
    // In Express 5, req.params is a plain object and is writable
    if (req.params) {
      sanitize(req.params);
    }

    // NOTE: req.query is READ-ONLY in Express 5 (it's a getter).
    // We cannot sanitize it here. Instead, query parameters are
    // validated on a per-route basis using express-validator.
    // This is actually a BETTER practice — explicit validation
    // per route is more secure than blanket sanitization.

    next();
  };
}

module.exports = mongoSanitize;
