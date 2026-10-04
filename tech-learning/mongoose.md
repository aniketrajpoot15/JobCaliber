<!-- 📌 WHAT IS THIS FILE? This is the learning guide for Mongoose, written for a student who is building JobCaliber. It explains what an ODM is, how Mongoose schemas work, and connects every concept to the actual schema blueprints we've already designed for this project. -->

# Mongoose

> **Status:** 🟢 `IMPLEMENTING` — User model, pre-save hooks, and instance methods implemented in Phase 2  
> **Category:** ODM (Object Data Modeling)  
> **Used in:** `docs/Architecture/DATABASE_SCHEMA.md` (schema specs), `server/models/` (`User.js`, upcoming models), `server/config/db.js`

---

## 1. What Is It?

**Mongoose** is a **JavaScript library** that sits between your Node.js code and MongoDB. Its job is to make working with MongoDB easier, safer, and more organized.

Without Mongoose, you'd talk to MongoDB directly using the MongoDB driver — which works, but gives you no structure:

```javascript
// Without Mongoose — raw MongoDB driver:
const result = await db.collection('applications').insertOne({
  companyName: "Google",
  status: "appleid",        // Typo! MongoDB doesn't care — it saves it anyway
  staleThreshold: "banana"  // Wrong type! MongoDB doesn't care — saves it too
});
```

With Mongoose, you define **schemas** — rules that describe what your data should look like. Mongoose enforces these rules before data ever reaches MongoDB:

```javascript
// With Mongoose — enforced schema:
const app = await Application.create({
  companyName: "Google",
  status: "appleid",        // ❌ ValidationError: "appleid" is not a valid status
  staleThreshold: "banana"  // ❌ ValidationError: expected Number, got String
});
```

**In simple terms:** MongoDB is the filing cabinet. Mongoose is the librarian who checks that every document is properly formatted before putting it in the cabinet.

---

## 2. Why Are We Using It?

### The Problem Mongoose Solves

MongoDB is **schema-less** by design — it accepts any document in any shape. This flexibility is a double-edged sword:

**Without Mongoose:**
- Nothing prevents saving `{ comapnyName: "Google" }` (note the typo) — MongoDB happily stores it
- Nothing prevents saving `status: 42` when status should be a String
- Nothing prevents saving a document without required fields like `companyName`
- Nothing ensures `email` is unique across all users
- You write raw BSON queries for everything — verbose and error-prone

**With Mongoose:**
- **Schema validation** catches typos, wrong types, and missing fields before they reach the database
- **Enum enforcement** restricts `status` to exactly 7 allowed values
- **Default values** automatically set `status: "Saved"` when not specified
- **Index management** creates database indexes from your schema definition
- **Clean API** — `Application.find()` instead of `db.collection('applications').find()`

### Why Mongoose Specifically?

| Reason | Explanation |
|---|---|
| **Industry standard** | The most widely used MongoDB ODM for Node.js (~25 million weekly npm downloads) |
| **Type safety at runtime** | Validates data types, required fields, and custom rules |
| **Developer knows it** | Listed in your known technologies (AGENTS.md §3) |
| **ADR-002** | Locked in the tech stack decision |

---

## 3. Where Is It Used in Our Project?

### Current (Phase 1 — Designing):
| File | What It Does |
|---|---|
| `docs/Architecture/DATABASE_SCHEMA.md` §2.5 | Blueprint code for `User` schema |
| `docs/Architecture/DATABASE_SCHEMA.md` §3.5 | Blueprint code for `Application` schema |
| `docs/Architecture/DATABASE_SCHEMA.md` §4.5 | Blueprint code for `InterviewRound` schema |
| `docs/Architecture/DATABASE_SCHEMA.md` §5.5 | Blueprint code for `InterviewQuestion` schema |
| `docs/Architecture/DATABASE_SCHEMA.md` §6.5 | Blueprint code for `ProblemLog` schema |

### Future (Phase 2+ — Implementation):
| File/Folder | What It Will Do |
|---|---|
| `server/models/User.js` | The actual Mongoose model for users |
| `server/models/Application.js` | The actual Mongoose model for applications |
| `server/models/InterviewRound.js` | The actual Mongoose model for interview rounds |
| `server/models/InterviewQuestion.js` | The actual Mongoose model for interview questions |
| `server/models/ProblemLog.js` | The actual Mongoose model for problem logs |
| `server/config/db.js` | Uses `mongoose.connect()` to connect to MongoDB |

---

## 4. Prerequisites

Before learning Mongoose, you should understand:

- [ ] **JavaScript objects** — `{ key: "value", nested: { a: 1 } }`
- [ ] **JavaScript classes/constructors** — `new ClassName()`, `this` keyword
- [ ] **Async/await** — `const result = await someAsyncFunction()` (promises)
- [ ] **MongoDB basics** — documents, collections, what `_id` is (see [mongodb.md](./mongodb.md))
- [ ] **npm** — how to install packages (`npm install mongoose`)

If you've read `mongodb.md` in this directory, you have the MongoDB prerequisites covered.

---

## 5. Core Concepts I Need to Know

### Concept 1: Schema — The Blueprint

A **schema** defines the structure and rules for documents in a collection. Think of it as a contract: "Every document in this collection MUST look like this."

```javascript
const mongoose = require('mongoose');

// Define the shape of a "User" document
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,      // Must be a string
    required: true,    // Can't be missing
    trim: true,        // Remove whitespace from edges
    minlength: 2,      // At least 2 characters
    maxlength: 100     // At most 100 characters
  },
  email: {
    type: String,
    required: true,
    unique: true,      // No two users can have the same email
    lowercase: true    // "ARJUN@test.com" → stored as "arjun@test.com"
  },
  staleThresholdDays: {
    type: Number,
    required: true,
    default: 14,       // If not specified, use 14
    min: 7,            // Can't be less than 7
    max: 45            // Can't be more than 45
  }
});
```

**Key idea:** The schema doesn't store data. It defines *rules* for data. The data is stored in MongoDB. The schema is the rulebook that Mongoose checks against.

### Concept 2: Model — The Interface

A **model** is what you actually use in your code to create, read, update, and delete documents. You create a model from a schema:

```javascript
// Create the model (uppercase singular name)
const User = mongoose.model('User', userSchema);

// Now you can use it:
const newUser = await User.create({ fullName: "Arjun", email: "arjun@test.com" });
const users = await User.find({ staleThresholdDays: { $gte: 14 } });
const oneUser = await User.findById("507f1f77...");
```

**The naming convention:**
- Schema variable: `camelCase` → `userSchema`, `applicationSchema`
- Model variable: `PascalCase` → `User`, `Application`
- Collection name: MongoDB automatically lowercases + pluralizes → `users`, `applications`

### Concept 3: Field Types

Mongoose supports these types (BSON types mapped to JavaScript):

| Mongoose Type | JavaScript Equivalent | Example | Used in JobCaliber |
|---|---|---|---|
| `String` | `"hello"` | `companyName: "Google"` | companyName, roleTitle, status, email |
| `Number` | `42`, `3.14` | `staleThresholdDays: 14` | staleThresholdDays |
| `Boolean` | `true`, `false` | `isStale: false` | isStale, isArchived, debriefCompleted |
| `Date` | `new Date()` | `appliedDate: new Date()` | appliedDate, lastStatusUpdate, createdAt |
| `ObjectId` | `ObjectId("507f...")` | `userId: ObjectId("...")` | userId (foreign key to User) |
| `Array` | `[1, 2, 3]` | (not used in MVP) | — |
| `Mixed` | anything | (avoid — no validation) | — |

### Concept 4: Validation — Catching Bad Data

Mongoose validates data BEFORE sending it to MongoDB. If validation fails, the save is rejected and no data reaches the database.

**Built-in validators:**

```javascript
fieldName: {
  type: String,
  required: [true, 'Custom error message'],     // Must be present
  minlength: [2, 'Too short'],                  // Minimum string length
  maxlength: [100, 'Too long'],                 // Maximum string length
  enum: ['A', 'B', 'C'],                        // Must be one of these values
  match: [/regex/, 'Invalid format'],            // Must match this regex pattern
  min: [0, 'Too low'],                           // Minimum number (for Number type)
  max: [100, 'Too high'],                        // Maximum number (for Number type)
  trim: true,                                    // Remove whitespace from both ends
  lowercase: true,                               // Convert to lowercase before saving
  unique: true,                                  // No duplicate values in collection
  default: 'some value'                          // Use this if not provided
}
```

**Custom validators:**

```javascript
staleThresholdDays: {
  type: Number,
  validate: {
    validator: Number.isInteger,           // Custom check: must be a whole number
    message: 'Must be an integer'
  }
}
```

### Concept 5: Enum — Restricting to a Fixed Set

An **enum** limits a String field to specific allowed values. This is how we enforce the 7-stage pipeline:

```javascript
status: {
  type: String,
  required: true,
  default: 'Saved',
  enum: {
    values: ['Saved', 'Applied', 'OA / Screening', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'],
    message: '{VALUE} is not a valid application status'
  }
}
```

If someone tries to set `status: "In Progress"`, Mongoose rejects it:
```
ValidationError: "In Progress" is not a valid application status
```

**Why this matters for JobCaliber:** Our funnel analytics group applications by `status`. If statuses aren't consistent (typos, variations), the analytics are useless. Enums guarantee consistency at the database level.

### Concept 6: ObjectId References — Linking Collections

Since MongoDB doesn't have JOINs (like SQL), we link collections manually using ObjectId references:

```javascript
// In the Application schema:
userId: {
  type: mongoose.Schema.Types.ObjectId,  // This field holds an ObjectId
  ref: 'User',                           // It points to the User collection
  required: true
}
```

This is like a **foreign key** in SQL. The `ref: 'User'` part tells Mongoose which model the ObjectId belongs to, enabling `.populate()`:

```javascript
// populate() replaces the ObjectId with the actual document
const app = await Application.findById(id).populate('userId');
// app.userId is now { fullName: "Arjun", email: "arjun@test.com" } instead of just "507f..."
```

### Concept 7: Indexes — Telling MongoDB What to Optimize

You define indexes in Mongoose, and Mongoose tells MongoDB to create them:

```javascript
// Single-field index
userSchema.index({ email: 1 }, { unique: true });

// Compound index (multiple fields together)
applicationSchema.index({ userId: 1, status: 1 });

// Text index (for search)
applicationSchema.index({ companyName: 'text', roleTitle: 'text' });
```

The `1` means ascending order. `-1` means descending. For compound indexes, the **order of fields matters** (left-prefix rule — explained in mongodb.md).

### Concept 8: Timestamps — Automatic Date Tracking

When you pass `{ timestamps: true }` as a schema option, Mongoose automatically adds and manages two fields:

```javascript
const applicationSchema = new mongoose.Schema(
  { /* ...fields... */ },
  { timestamps: true }  // ← This option
);

// Now every document automatically has:
// createdAt: Date  ← set once when document is first created
// updatedAt: Date  ← updated every time the document is modified
```

You never manually set these fields — Mongoose handles them.

### Concept 9: `toJSON` Transform — Controlling What Gets Sent to the Client

When you send a Mongoose document as a JSON response, you might want to remove internal fields:

```javascript
const userSchema = new mongoose.Schema(
  { /* ...fields... */ },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.passwordHash;  // NEVER send password hash to the client
        delete ret.__v;           // Remove internal version key (noise)
        return ret;
      }
    }
  }
);
```

`ret` is the JSON representation of the document. You modify it before it's sent to the client. This is a safety net — even if a developer forgets to exclude `passwordHash` from a query, the `toJSON` transform strips it automatically.

### Concept 10: `select: false` — Hiding Sensitive Fields

The `select: false` option tells Mongoose to **never include this field in query results** unless you explicitly ask for it:

```javascript
passwordHash: {
  type: String,
  required: true,
  select: false  // ← This field is hidden by default
}
```

Now:
```javascript
const user = await User.findById(id);
console.log(user.passwordHash);  // undefined — field was excluded

// To explicitly include it (only in auth logic):
const user = await User.findById(id).select('+passwordHash');
console.log(user.passwordHash);  // "$2b$12$LJ3..." — now it's there
```

This prevents accidental exposure of sensitive data.

### Concept 11: Virtual Population (`localField` & `foreignField`)

In relational databases (SQL), you join tables using foreign keys. In Mongoose, what if collection B has an `applicationId` pointing to collection A, and you want to ask collection A: "Give me all rounds that belong to you"?

Without virtual populate, you might think you need to store an array of round IDs inside Application: `rounds: [id1, id2, id3]`. But that leads to data sync bugs (if a round is deleted, the array in Application is now out of date!).

**Virtual Populate** solves this cleanly:
```javascript
// On InterviewRound: we define a virtual that finds child questions
interviewRoundSchema.virtual('questions', {
  ref: 'InterviewQuestion',      // Which model to query
  localField: '_id',             // What field on InterviewRound matches...
  foreignField: 'roundId'        // ...what field on InterviewQuestion
});
```

Now you can do:
```javascript
const round = await InterviewRound.findById(roundId).populate('questions');
// round.questions is now an array of questions, without InterviewRound ever storing array of question IDs!
```

### Concept 12: Embedding vs. Referencing Decision Matrix

When designing Mongoose schemas, a student's most common dilemma is: **Should I embed documents as a sub-array, or make a separate collection and reference it?**

| Criteria | Embed as Subdocument Array (`[ { ... } ]`) | Reference Separate Collection (`ref: '...'`) |
|---|---|---|
| **Relationship** | 1-to-Few (e.g., 2-3 contact emails) | 1-to-Many or 1-to-Unbounded |
| **Child Queries** | Child is NEVER queried independently | Child is frequently queried on its own (e.g. Action Center pending debriefs) |
| **Document Size** | Data is small; won't approach 16MB BSON limit | Data can grow over time |
| **Child Relationships**| Child has no children of its own | Child has its own related entities (e.g. `InterviewRound` has `InterviewQuestion` and `ProblemLog`) |

**JobCaliber Application:** We chose **referencing** for `InterviewRound` because the Action Center needs to query pending debriefs across *all* applications directly, and each round has its own children (`questions` and `problem logs`).

### Concept 13: Compound Unique Indexes for Deduplication

In many applications, a field is not globally unique by itself, but is unique **in combination with another field**.

**Example in JobCaliber:**
In `ProblemLog`, a topic name like `"Dynamic Programming"` can appear many times in the database (across different rounds and different users). But inside a **single debrief round**, a candidate should not tag `"Dynamic Programming"` twice:

```javascript
// Compound unique index on roundId + topicName
problemLogSchema.index({ roundId: 1, topicName: 1 }, { unique: true });
```

**How it works:**
- Round 1 + "Dynamic Programming" → ✅ Saved
- Round 1 + "Graphs" → ✅ Saved
- Round 2 + "Dynamic Programming" → ✅ Saved (different round)
- Round 1 + "Dynamic Programming" → ❌ Rejected with E11000 duplicate key error!

This guarantees data integrity directly at the database storage layer without requiring manual checking in Javascript.

### Concept 14: Denormalization for Aggregation Performance

In relational databases (SQL), you normalize everything to 3rd normal form (no duplicate columns). In MongoDB, deliberate **denormalization** is a standard architectural pattern for performance.

**Why `ProblemLog` has `userId` directly:**
The Weakness Heatmap needs to count how many times a user stumbled on each topic:
```javascript
ProblemLog.aggregate([
  { $match: { userId: req.user._id } },
  { $group: { _id: '$topicName', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```
If `ProblemLog` only had `roundId`:
1. MongoDB would have to `$lookup` `interviewrounds` for every single log.
2. Filter those rounds by user.
3. Group the results.

By placing `userId` directly on `ProblemLog`, MongoDB filters with `{ userId: 1, topicName: 1 }` in an instantaneous index scan with zero joins.

### Concept 15: Document Middleware (Pre-Save Hooks)

Mongoose middleware (also called pre and post hooks) are functions that get executed during the document lifecycle.

```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});
```

**Key rules for Mongoose hooks:**
- **Regular function syntax:** Always use `function()` instead of arrow functions `() => {}` because Mongoose binds `this` to the document being saved.
- **`this.isModified(field)`:** Only perform expensive operations (like hashing) if the field was actually modified.
- **Execution order:** `pre('validate')` → schema validation → `pre('save')` → database write → `post('save')`.

### Concept 16: Document Instance Methods (`schema.methods`)

Instance methods allow you to add custom helper functions directly to document instances returned from queries.

```javascript
// Adding an instance method to userSchema
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Calling it on a document instance in your controller:
const user = await User.findOne({ email }).select('+passwordHash');
const isMatch = await user.matchPassword(enteredPassword);
```

**Why use instance methods instead of putting logic in the controller?**
- **Encapsulation:** The model owns its own security comparison logic.
- **DRY:** The same method can be reused in login, password update verification, account deletion confirmation, etc.
- **Timing safety:** `bcrypt.compare` executes in constant time, preventing side-channel timing attacks.

---

## 6. How It Works

### Mongoose Lifecycle — What Happens When You Save a Document

```
Your code: Application.create({ companyName: "Google", status: "Applied" })
    │
    ▼
1. CASTING — Mongoose converts values to their schema types
   "14" (string) → 14 (number) if the field type is Number
    │
    ▼
2. DEFAULT VALUES — Missing fields get their defaults
   status not provided? → "Saved"
   appliedDate not provided? → Date.now
   isStale not provided? → false
    │
    ▼
3. VALIDATION — Mongoose checks all rules
   ├── required fields present? ✅
   ├── string lengths within bounds? ✅
   ├── enum values valid? ✅
   ├── custom validators pass? ✅
   └── All pass? → Continue. Any fail? → Throw ValidationError (document NOT saved)
    │
    ▼
4. PRE-SAVE MIDDLEWARE (if any) — hooks that run before saving
   (e.g., hash password before saving user)
    │
    ▼
5. SAVE TO MONGODB — Mongoose converts to BSON and sends to MongoDB
    │
    ▼
6. POST-SAVE MIDDLEWARE (if any) — hooks that run after saving
    │
    ▼
7. RETURN — Created document returned to your code (with _id, createdAt, etc.)
```

### Connection Flow

```
server.js starts
    │
    ▼
mongoose.connect(process.env.MONGO_URI)
    │
    ▼
Mongoose creates a connection pool (5 connections by default)
    │
    ▼
Each request uses one connection from the pool
    │
    ▼
When the request finishes, the connection goes back to the pool
```

---

## 7. Project-Specific Implementation

### The User Model Blueprint (from DATABASE_SCHEMA.md §2.5)

```javascript
// server/models/User.js — this is what we'll create in Phase 2

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
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
      unique: true,            // ← Creates a unique index automatically
      trim: true,
      lowercase: true,         // ← "ARJUN@TEST.COM" → "arjun@test.com"
      maxlength: [255, 'Email cannot exceed 255 characters'],
      match: [/regex_pattern/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false            // ← NEVER returned in queries by default
    },
    staleThresholdDays: {
      type: Number,
      required: true,
      default: 14,             // ← ADR-004: 14 days is the researched default
      min: [7, 'Minimum is 7 days'],
      max: [45, 'Maximum is 45 days'],
      validate: {
        validator: Number.isInteger,  // ← Custom: must be whole number
        message: 'Must be an integer'
      }
    }
  },
  {
    timestamps: true,          // ← Auto-adds createdAt and updatedAt
    toJSON: {
      transform: function (doc, ret) {
        delete ret.passwordHash;  // ← Safety net: strip password from JSON
        delete ret.__v;           // ← Remove version key noise
        return ret;
      }
    }
  }
);

// Create index explicitly
userSchema.index({ email: 1 }, { unique: true });

// Export the model
module.exports = mongoose.model('User', userSchema);
```

**Reading this code line by line:**

1. `require('mongoose')` — Import the Mongoose library
2. `new mongoose.Schema({...}, {...})` — First object = field definitions, second object = options
3. Each field has `type`, `required`, and validation rules specific to its purpose
4. `select: false` on `passwordHash` — security measure to prevent accidental exposure
5. `timestamps: true` — Mongoose auto-manages `createdAt` and `updatedAt`
6. `toJSON.transform` — A function that runs when the document is converted to JSON (e.g., for API responses). We use it to strip sensitive/internal fields.
7. `userSchema.index(...)` — Explicitly create a database index for fast email lookups
8. `mongoose.model('User', userSchema)` — Creates the `User` model and ties it to the `users` collection

### The Application Model Blueprint (from DATABASE_SCHEMA.md §3.5)

Key patterns specific to the Application model:

```javascript
// Enum with custom error message:
status: {
  type: String,
  enum: {
    values: ['Saved', 'Applied', 'OA / Screening', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'],
    message: '{VALUE} is not a valid application status'
    //       ↑ {VALUE} is replaced with the actual invalid value in the error message
  }
}

// ObjectId reference to another collection:
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}

// Compound indexes for common query patterns:
applicationSchema.index({ userId: 1, status: 1 });           // Pipeline view
applicationSchema.index({ userId: 1, companyName: 1, roleTitle: 1 }); // Duplicates
applicationSchema.index({ userId: 1, appliedDate: -1 });     // Date sorting
applicationSchema.index({ companyName: 'text', roleTitle: 'text' }); // Search
```

---

## 8. Small Examples

### Example 1: Define a simple schema and model
```javascript
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, min: 1 },
  published: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);
```

### Example 2: Create a document
```javascript
const book = await Book.create({
  title: "Clean Code",
  author: "Robert C. Martin",
  pages: 464
});
// book._id → ObjectId("...") (auto-generated)
// book.published → current date (from default)
```

### Example 3: Validation failure
```javascript
try {
  await Book.create({ title: "No Author Book" });
  // author is required but missing!
} catch (error) {
  console.log(error.message);
  // "Book validation failed: author: Path `author` is required."
}
```

### Example 4: Find documents
```javascript
// Find all books by one author
const books = await Book.find({ author: "Robert C. Martin" });

// Find one book by ID
const book = await Book.findById("507f1f77bcf86cd799439011");

// Find with conditions
const longBooks = await Book.find({ pages: { $gte: 400 } });
```

### Example 5: Update a document
```javascript
// Find by ID and update
const updated = await Book.findByIdAndUpdate(
  "507f1f77bcf86cd799439011",
  { pages: 500 },
  { new: true, runValidators: true }
  //   ↑ return the updated document, not the old one
  //          ↑ run schema validators on the update too
);
```

### Example 6: Delete a document
```javascript
await Book.findByIdAndDelete("507f1f77bcf86cd799439011");
```

---

## 9. Important Terminology

| Term | Definition |
|---|---|
| **Schema** | A blueprint defining the structure, types, and validation rules for documents in a collection |
| **Model** | A JavaScript class created from a schema. Used to create, read, update, and delete documents. |
| **ODM** | Object Data Modeling — a library that maps JavaScript objects to database documents (Mongoose is an ODM) |
| **Validator** | A rule that checks data before saving (e.g., required, minlength, enum, custom functions) |
| **Enum** | A validator that restricts a field to a fixed set of allowed values |
| **Cast** | Mongoose automatically converting a value to the schema type (e.g., `"14"` → `14` for Number fields) |
| **Default** | A value automatically assigned to a field if no value is provided |
| **Middleware (Hooks)** | Functions that run automatically at certain points (pre-save, post-save, pre-find, etc.) |
| **Populate** | Replacing an ObjectId reference with the actual document from the referenced collection |
| **Virtual** | A computed property that exists on the document but is NOT stored in MongoDB |
| **select: false** | A schema option that excludes a field from query results by default |
| **toJSON transform** | A function that modifies the document before it's serialized to JSON |
| **Timestamps** | The `{ timestamps: true }` option that auto-adds `createdAt` and `updatedAt` fields |
| **runValidators** | An option for update operations that forces Mongoose to validate the new values |
| **Connection Pool** | A set of reusable database connections (default: 5) managed by Mongoose |

---

## 10. Common Mistakes

### Mistake 1: Forgetting `runValidators: true` on updates
```javascript
// BAD — validators don't run on updates by default!
await Application.findByIdAndUpdate(id, { status: "Invalid Status" });
// This SAVES even though "Invalid Status" isn't in the enum!

// GOOD — explicitly enable validators:
await Application.findByIdAndUpdate(id, { status: "Invalid Status" }, { runValidators: true });
// Now this throws a ValidationError ✅
```

**Why?** Mongoose was designed this way for backwards compatibility. Always pass `{ runValidators: true }` on updates.

### Mistake 2: Using `unique` as a validator
```javascript
email: {
  type: String,
  unique: true  // ← This is NOT a Mongoose validator — it's an index instruction
}
```

`unique: true` creates a MongoDB unique index. It does NOT produce a Mongoose `ValidationError`. Instead, MongoDB throws a `E11000 duplicate key error`. You need to catch this differently:

```javascript
// In your error handling middleware:
if (error.code === 11000) {
  return res.status(400).json({ message: 'Email already registered' });
}
```

### Mistake 3: Returning `passwordHash` in API responses
```javascript
// BAD — passwordHash is sent to the client!
const user = await User.findById(id).select('+passwordHash');
res.json(user);

// GOOD — either don't select it, or strip it before responding
const user = await User.findById(id); // select: false keeps passwordHash hidden
res.json(user);
```

### Mistake 4: Not awaiting async operations
```javascript
// BAD — creates a promise but doesn't wait for it
const user = User.findById(id);
console.log(user.fullName);  // undefined — user is a Promise, not a document!

// GOOD — await the result
const user = await User.findById(id);
console.log(user.fullName);  // "Arjun" ✅
```

### Mistake 5: Defining the model multiple times
```javascript
// BAD — called twice (crashes with OverwriteModelError)
mongoose.model('User', userSchema);
mongoose.model('User', userSchema);

// GOOD — define once, export once, import everywhere
// In models/User.js:
module.exports = mongoose.model('User', userSchema);

// In controllers/authController.js:
const User = require('../models/User');
```

---

## 11. Things I Should Understand Before Moving Forward

- [ ] I understand the difference between a schema (rules) and a model (interface for CRUD)
- [ ] I can read a Mongoose schema definition and understand each field's constraints
- [ ] I know what `required`, `default`, `enum`, `trim`, `minlength`, `maxlength` do
- [ ] I understand ObjectId references (`ref: 'User'`) and why they link collections
- [ ] I can explain what `select: false` does and why `passwordHash` uses it
- [ ] I understand `{ timestamps: true }` and what `createdAt`/`updatedAt` are
- [ ] I can explain what the `toJSON` transform does and why we strip `passwordHash` and `__v`
- [ ] I know the Mongoose validation lifecycle: casting → defaults → validation → save
- [ ] I understand that `unique` is an index, not a validator (produces E11000, not ValidationError)
- [ ] I know to always use `{ runValidators: true }` on update operations
- [ ] I can read the User and Application schema blueprints in DATABASE_SCHEMA.md and understand every line

---

## 12. Official Documentation

### Primary (authoritative) sources:
- [Mongoose Official Documentation](https://mongoosejs.com/docs/guide.html) — the main guide
- [Mongoose Schema Types](https://mongoosejs.com/docs/schematypes.html) — all field types
- [Mongoose Validation](https://mongoosejs.com/docs/validation.html) — all validators
- [Mongoose Queries](https://mongoosejs.com/docs/queries.html) — find, update, delete
- [Mongoose Models](https://mongoosejs.com/docs/models.html) — creating and using models
- [Mongoose Middleware](https://mongoosejs.com/docs/middleware.html) — pre/post hooks
- [Mongoose Populate](https://mongoosejs.com/docs/populate.html) — joining documents

### Secondary (high-quality learning) resources:
- [Mongoose Getting Started Tutorial](https://mongoosejs.com/docs/) — official quick start
- [MDN Express Tutorial — Mongoose](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose) — practical Mongoose with Express

---

## 13. Learning Order

Learn Mongoose concepts in this order:

```
1. What an ODM is and why schemas matter
   ↓
2. Defining schemas — field types, required, default
   ↓
3. Creating models — mongoose.model('Name', schema)
   ↓
4. Basic CRUD — create, find, findById, findByIdAndUpdate, findByIdAndDelete
   ↓
5. Validation — enum, minlength, maxlength, min, max, custom validators
   ↓
6. Schema options — timestamps, toJSON transform, select: false
   ↓
7. Indexes — schema.index(), compound indexes, unique indexes
   ↓
8. ObjectId references — ref, populate()
   ↓
9. Middleware (hooks) — pre('save'), post('save')
   ↓
10. Error handling — ValidationError vs E11000 vs CastError
```

> For JobCaliber right now (Phase 1), you need steps 1–8. Steps 9–10 become important in Phase 2 when we write actual model files and controllers.
