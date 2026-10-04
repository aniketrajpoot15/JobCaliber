// server/models/User.js
// Single Source of Truth: docs/Architecture/DATABASE_SCHEMA.md §2
//
// The User model stores account credentials, profile settings, and system
// threshold preferences. It is the TENANT BOUNDARY — every child record in
// the system (applications, rounds, questions, problem logs) belongs to a user.
//
// Step 2.10: Schema definition (fields, types, validators, indexes).
// Step 2.11: Pre-save hook for automatic password hashing with bcrypt.
// Step 2.12: matchPassword instance method will be added.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  DEFAULT_STALE_THRESHOLD_DAYS,
  MIN_STALE_THRESHOLD_DAYS,
  MAX_STALE_THRESHOLD_DAYS
} = require('../utils/constants');

// =========================================================================
// SCHEMA DEFINITION
// =========================================================================

const userSchema = new mongoose.Schema(
  {
    // ── Identity Fields ──

    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,       // MongoDB enforces uniqueness via index (E11000 on duplicate)
      trim: true,
      lowercase: true,    // "John@Gmail.COM" → "john@gmail.com" before storage
      maxlength: [255, 'Email cannot exceed 255 characters'],
      match: [
        // RFC 5322 email format validation
        // Allows: letters, digits, and special chars before @
        // Requires: valid domain structure after @
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
        'Please provide a valid email address'
      ]
    },

    // ── Auth Fields ──

    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      // minlength validates the PLAINTEXT password before the pre-save hook
      // hashes it. We check >= 8 chars here (matching express-validator rules).
      // Why not minlength: 60 (bcrypt hash length)? Because Mongoose runs
      // validation BEFORE pre-save hooks. The plaintext password (e.g., 8 chars)
      // would fail a 60-char check before the hook gets to hash it.
      minlength: [8, 'Password must be at least 8 characters'],
      // select: false means this field is EXCLUDED from query results by default.
      // To include it, you must explicitly call .select('+passwordHash').
      // This prevents accidental exposure in API responses.
      select: false
    },

    // ── Profile Fields ──

    targetRole: {
      type: String,
      trim: true,
      default: '',  // Optional — empty string means "not set yet"
      maxlength: [100, 'Target role cannot exceed 100 characters']
    },

    // ── Settings Fields ──

    staleThresholdDays: {
      type: Number,
      required: true,
      default: DEFAULT_STALE_THRESHOLD_DAYS,  // 14 days (ADR-004: 81% of callbacks within 14 days)
      min: [MIN_STALE_THRESHOLD_DAYS, `Stale threshold must be at least ${MIN_STALE_THRESHOLD_DAYS} days`],
      max: [MAX_STALE_THRESHOLD_DAYS, `Stale threshold cannot exceed ${MAX_STALE_THRESHOLD_DAYS} days`],
      // Custom validator: must be a whole number (no 14.5 days)
      validate: {
        validator: Number.isInteger,
        message: 'Stale threshold must be an integer'
      }
    }
  },
  {
    // ── Schema Options ──

    // timestamps: true adds createdAt and updatedAt fields automatically.
    // Mongoose sets createdAt on document creation and updatedAt on every save.
    timestamps: true,

    // toJSON transform runs every time a document is converted to JSON
    // (e.g., when sending res.json(user)). This is a safety net:
    // even if a developer forgets to exclude sensitive fields, this
    // transform strips them before the response leaves the server.
    toJSON: {
      transform: function (doc, ret) {
        delete ret.passwordHash;  // Never expose password hash in API responses
        delete ret.__v;           // Mongoose version key — internal use only
        return ret;
      }
    }
  }
);

// =========================================================================
// INDEXES
// =========================================================================
// Explicit index creation. While `unique: true` on the email field already
// creates an index, defining it explicitly here makes the index strategy
// visible and self-documenting alongside the schema.

userSchema.index({ email: 1 }, { unique: true });

// =========================================================================
// HOOKS
// =========================================================================

// Cost factor for bcrypt hashing. Higher = more secure but slower.
// 12 rounds ≈ ~250ms per hash (good balance of security vs. performance).
// Each +1 round doubles the computation time.
// AGENTS.md §9 mandates salt rounds = 12. Do not change without approval.
const SALT_ROUNDS = 12;

// PRE-SAVE HOOK: Automatic Password Hashing (Step 2.11)
//
// This hook runs EVERY TIME a document is saved (user.save()).
// It checks if passwordHash was modified (new user or password change).
// If yes, it replaces the plaintext with a bcrypt hash.
//
// WHY a hook instead of hashing in the controller?
// - Controllers can forget to hash. The hook makes it automatic.
// - If we add a "change password" feature later, it's already handled.
// - Single Responsibility: the model owns its own data integrity.
//
// WHY pre('save') and not pre('validate')?
// - We changed passwordHash minlength from 60 to 8, so plaintext passes
//   validation. The hook then converts it to a 60-char hash before save.
// - pre('save') runs after validation but before the actual database write.
//
// IMPORTANT: Must use `function()` (not arrow function) because Mongoose
// binds `this` to the document being saved. Arrow functions don't have
// their own `this` — they inherit from the enclosing scope, which would
// be the module, not the document.
userSchema.pre('save', async function (next) {
  // Only hash if passwordHash was modified (or is new).
  // On a profile update (e.g., changing targetRole), passwordHash is
  // NOT modified, so we skip hashing and save time.
  if (!this.isModified('passwordHash')) {
    return next();
  }

  // Generate a salt and hash the plaintext password in one step.
  // bcrypt.hash(plaintext, saltRounds) does:
  //   1. Generates a random salt with the given cost factor
  //   2. Combines the salt + password and runs the Blowfish cipher
  //   3. Returns a 60-char string: $2a$12$<22-char-salt><31-char-hash>
  this.passwordHash = await bcrypt.hash(this.passwordHash, SALT_ROUNDS);

  next();
});

// =========================================================================
// INSTANCE METHODS (Step 2.12)
// =========================================================================
// Instance methods are available on every individual document (instance)
// returned by a query (e.g., const user = await User.findById(...); await user.matchPassword(...)).
//
// WHY define matchPassword on the model instead of in the controller?
// - Information Expert / Encapsulation: The User model knows how its password
//   is stored (bcrypt hash in this.passwordHash). Controllers shouldn't need to know
//   which hashing algorithm or library is used.
// - DRY (Don't Repeat Yourself): Any controller or service that needs to authenticate
//   a user (login, password re-entry for sensitive actions) uses this exact same method.
// - Clean Controllers: Controllers stay focused on HTTP req/res handling.
//
// IMPORTANT: Must use `function()` (not an arrow function `() => {}`) because
// Mongoose needs to bind `this` to the specific document instance.
// In an arrow function, `this` would refer to module.exports / undefined.
//
// NOTE ON select: false:
// Because `passwordHash` has `select: false` in the schema, any query intending
// to check the password MUST explicitly include `.select('+passwordHash')`.
// e.g.: const user = await User.findOne({ email }).select('+passwordHash');
// If omitted, `this.passwordHash` will be undefined.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare(plaintext, hash):
  // 1. Extracts the salt and cost factor from the 60-character stored hash
  // 2. Hashes the entered plaintext password with that same salt & cost
  // 3. Compares the resulting hash against the stored hash in constant time
  //    (timing-safe comparison to prevent side-channel timing attacks)
  // 4. Returns true if they match, false otherwise
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// =========================================================================
// MODEL EXPORT
// =========================================================================
// mongoose.model('User', userSchema) does two things:
// 1. Registers the model with Mongoose (so other files can use mongoose.model('User'))
// 2. Maps it to the 'users' collection in MongoDB (auto-pluralized lowercase)

module.exports = mongoose.model('User', userSchema);
