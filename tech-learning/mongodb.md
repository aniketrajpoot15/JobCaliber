<!-- 📌 WHAT IS THIS FILE? This is the learning guide for MongoDB, written for a student who is building JobCaliber. It explains what a document database is, how MongoDB stores data, and connects every concept to the actual project's database design. -->

# MongoDB

> **Status:** 🟡 `DESIGNING` — schema design started in Step 1.1  
> **Category:** Database  
> **Used in:** `docs/Architecture/DATABASE_SCHEMA.md` (schema specs), `server/models/` (future Mongoose models), `server/config/` (future DB connection)

---

## 1. What Is It?

**MongoDB** is a **database** — a program whose only job is to store, organize, and retrieve data reliably.

When you use a web app (like Instagram, Twitter, or our JobCaliber), every piece of data you see — your profile, your posts, your settings — is stored in a database somewhere. When you click "save," the app sends data to the database. When you open the app, it fetches data from the database.

MongoDB is specifically a **document database** (also called NoSQL). This means it stores data as **documents** — which look almost exactly like JavaScript objects:

```javascript
// This is what a MongoDB document looks like:
{
  "_id": "507f1f77bcf86cd799439011",
  "companyName": "Google",
  "roleTitle": "Backend Developer",
  "status": "Applied",
  "appliedDate": "2026-09-15T00:00:00Z",
  "isStale": false
}
```

Compare this with a **traditional SQL database** (like MySQL or PostgreSQL), where data is stored in rigid **tables** with fixed rows and columns — like a spreadsheet. MongoDB is more flexible because each document can have a different structure if needed.

---

## 2. Why Are We Using It?

### The Problem MongoDB Solves for JobCaliber

JobCaliber's data is **nested and hierarchical**:

```
User
 └── Application (many per user)
      └── InterviewRound (many per application)
           ├── InterviewQuestion (many per round)
           └── ProblemLog (many per round)
```

In a SQL database, this would require 5 separate tables with complex JOIN queries to reassemble the data. In MongoDB, the data structure naturally matches how we think about it — a user *has* applications, an application *has* interview rounds, etc.

### Why MongoDB Over SQL?

| Reason | Explanation |
|---|---|
| **JavaScript-native** | MongoDB documents are basically JSON objects. Since our server runs JavaScript (Node.js), there's no translation layer — what goes in is what comes out. |
| **Schema flexibility** | We can add fields later without migrating an entire table. If we want to add a `priority` field to applications in V2, we just... add it. |
| **Developer knows it** | You already have experience with MongoDB (AGENTS.md §3). Using familiar tools lets you focus on product logic, not learning a new database system. |
| **ADR-002** | The locked tech stack decision explicitly chose MongoDB for its document model (DECISIONS.md). |

### What Would Go Wrong Without MongoDB?

Without any database, all data would be lost when the server restarts. You could save data to a file (like `data.json`), but:
- Files don't support concurrent access (two users writing at the same time would corrupt the file)
- Files don't have indexes (searching through 10,000 applications would be slow)
- Files don't enforce structure (any garbage data could be written)
- Files don't support complex queries (like "show me all stale applications sorted by date")

---

## 3. Where Is It Used in Our Project?

### Current (Phase 1 — Designing):
| File | What It Does |
|---|---|
| `docs/Architecture/DATABASE_SCHEMA.md` | Defines the exact structure of all 5 MongoDB collections (the "blueprint") |
| `docs/Research_And_Documentation/DECISIONS.md` (ADR-002) | Documents why MongoDB was chosen over SQL alternatives |

### Future (Phase 2+ — Implementation):
| File/Folder | What It Will Do |
|---|---|
| `server/config/db.js` | Connect to MongoDB using a connection string from `.env` |
| `server/models/*.js` | Mongoose model files that tell MongoDB the structure of each collection |
| `.env` | Store `MONGO_URI=mongodb+srv://...` (the database connection address) |

---

## 4. Prerequisites

Before learning MongoDB, you should understand:

- [ ] **JSON** — JavaScript Object Notation. MongoDB documents are stored in a format similar to JSON. If you can read `{ "key": "value" }`, you're ready.
- [ ] **JavaScript objects** — MongoDB documents look like JS objects: `{ name: "Arjun", age: 22 }`
- [ ] **What a database is conceptually** — a system that stores data permanently so it survives server restarts

You do NOT need to know SQL. MongoDB is a completely different approach.

---

## 5. Core Concepts I Need to Know

### Concept 1: Documents

A **document** is a single record — one user, one application, one interview round. It's a JSON-like object with key-value pairs.

```javascript
// One document in the "applications" collection:
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),  // unique ID, auto-generated
  "userId": ObjectId("507f1f77bcf86cd799439012"), // who owns this
  "companyName": "Google",
  "roleTitle": "Backend Developer",
  "status": "Applied",
  "appliedDate": ISODate("2026-09-15"),
  "isStale": false,
  "notes": "Referral from Priya",
  "isArchived": false
}
```

Every document automatically gets a unique `_id` field (an ObjectId) that MongoDB generates. You never need to create IDs yourself.

### Concept 2: Collections

A **collection** is a group of related documents — like a folder that holds similar documents. It's roughly equivalent to a "table" in SQL, but without a fixed structure.

JobCaliber has 5 collections:

| Collection | What It Stores | Example Document Count |
|---|---|---|
| `users` | User accounts and settings | 1 per registered user |
| `applications` | Job applications | ~50–200 per active user |
| `interviewrounds` | Interview rounds per application | ~1–5 per application |
| `interviewquestions` | Questions asked in each round | ~0–10 per round |
| `problemlogs` | Stumbled topics from debriefs | ~0–5 per round |

### Concept 3: Databases

A **database** is a container for collections. One MongoDB server can host many databases. JobCaliber will have one database (probably named `jobcaliber`) containing all 5 collections.

```
MongoDB Server
 └── Database: "jobcaliber"
      ├── Collection: "users"
      ├── Collection: "applications"
      ├── Collection: "interviewrounds"
      ├── Collection: "interviewquestions"
      └── Collection: "problemlogs"
```

### Concept 4: BSON (Binary JSON)

MongoDB doesn't actually store pure JSON. It stores **BSON** (Binary JSON) — a binary-encoded version that:
- Is faster to parse than text-based JSON
- Supports additional data types (like `Date`, `ObjectId`, `Decimal128`) that plain JSON doesn't have
- Allows MongoDB to efficiently traverse and query documents without parsing the entire thing

You don't interact with BSON directly — Mongoose and the MongoDB driver handle the conversion. But it's good to know it exists because it explains why MongoDB supports types like `ObjectId` and `Date` that don't exist in normal JSON.

### Concept 5: `_id` and ObjectId

Every document must have an `_id` field. If you don't provide one, MongoDB generates an **ObjectId** automatically.

An ObjectId is a 12-byte value that looks like: `507f1f77bcf86cd799439011`

It encodes:
- **4 bytes:** Unix timestamp (when it was created)
- **5 bytes:** Random value (unique to the machine/process)
- **3 bytes:** Incrementing counter

This means ObjectIds are:
- **Globally unique** — two different servers will never generate the same ID
- **Roughly time-ordered** — IDs created later have higher values
- **Self-contained** — no need for a central ID-generation service

### Concept 6: Indexes

An **index** is like the index at the back of a textbook. Without it, MongoDB has to read every single document in a collection to find what you're looking for (**collection scan**). With an index, it can jump directly to the matching documents.

```
WITHOUT index (collection scan):
Read document 1 → no match
Read document 2 → no match
Read document 3 → MATCH!
Read document 4 → no match
...read all 10,000 documents
Time: O(n) — slow with large collections

WITH index:
Look up "Google" in index → points to documents 3, 47, 892
Fetch only those 3 documents
Time: O(log n) — fast even with millions of documents
```

**JobCaliber's indexes** (from DATABASE_SCHEMA.md §3.3):
- `{ userId: 1, status: 1 }` → Fast pipeline view loading
- `{ userId: 1, companyName: 1, roleTitle: 1 }` → Fast duplicate detection
- `{ userId: 1, appliedDate: -1 }` → Fast date sorting
- `{ companyName: 'text', roleTitle: 'text' }` → Full-text search

### Concept 7: Queries

A **query** is how you ask MongoDB for data. Queries are JavaScript objects that describe what you're looking for:

```javascript
// "Find all applications where userId matches AND status is 'Applied'"
db.applications.find({
  userId: ObjectId("507f..."),
  status: "Applied"
})

// "Find one user with this email"
db.users.findOne({
  email: "arjun@example.com"
})

// "Count applications in each status for this user"
db.applications.aggregate([
  { $match: { userId: ObjectId("507f...") } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

---

## 6. How It Works

### The Request Flow (How Data Gets to/from MongoDB)

```
User clicks "Save Application" in browser
       │
       ▼
React sends HTTP POST request to /api/applications
       │
       ▼
Express receives the request, runs middleware (auth, validation)
       │
       ▼
Controller calls Mongoose: Application.create({ companyName: "Google", ... })
       │
       ▼
Mongoose validates data against schema (type checks, enums, required fields)
       │
       ▼
Mongoose converts JavaScript object to BSON and sends to MongoDB driver
       │
       ▼
MongoDB driver sends BSON over TCP/IP to MongoDB server
       │
       ▼
MongoDB server writes the document to the "applications" collection on disk
       │
       ▼
MongoDB returns the created document (with _id) back up the chain
       │
       ▼
User sees "Application saved!" in the browser
```

### How MongoDB Stores Data on Disk

MongoDB organizes data into:
- **Databases** → stored as separate directories
- **Collections** → stored as data files within the database directory
- **Documents** → stored as BSON records within collection files
- **Indexes** → stored as B-tree data structures alongside collection files

You don't manage these files yourself — MongoDB handles all storage internally. You interact with MongoDB through queries.

### Read vs Write Path

**Write (Create/Update/Delete):**
1. MongoDB receives the write operation
2. It writes to an in-memory cache (the **WiredTiger cache**)
3. It records the change in a write-ahead log (**journal**) for crash recovery
4. Periodically, it flushes the cache to disk (**checkpoint**)

**Read (Find/Query):**
1. MongoDB receives the query
2. If an index exists for the queried fields, it uses the index (B-tree lookup)
3. If no index exists, it performs a **collection scan** (reads every document)
4. Returns matching documents

---

## 7. Project-Specific Implementation

### How JobCaliber's Collections Are Designed

All 5 collections follow a consistent pattern defined in `DATABASE_SCHEMA.md`:

**Tenant Isolation:** Every collection that stores user data has a `userId` field. Every query must include `{ userId: req.user._id }` so that User A can never see User B's data.

**The Collection Hierarchy:**
```
users (1)
  │
  └──► applications (N per user)
         │
         └──► interviewrounds (N per application)
                │
                ├──► interviewquestions (N per round)
                └──► problemlogs (N per round)
```

**Example: The `applications` collection document structure:**
```javascript
{
  // System fields
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),        // WHO owns this (tenant isolation)

  // Mandatory fields (Quick-Add)
  "companyName": "Google",           // Required
  "roleTitle": "Backend Developer",  // Required

  // Pipeline status
  "status": "Applied",              // Enum: 7 fixed values
  "lastStatusUpdate": ISODate("2026-09-15"),
  "isStale": false,                 // Computed: has this gone silent?

  // Optional fields (More Details)
  "jobUrl": "https://careers.google.com/...",
  "location": "Mountain View, CA",
  "workMode": "Hybrid",             // Enum: Remote/Hybrid/Onsite/""
  "salaryRange": "$150k-$180k",
  "source": "LinkedIn",             // Enum: 7 sources + ""
  "resumeVersionTag": "Backend_v2",
  "appliedDate": ISODate("2026-09-15"),
  "notes": "Referral from Priya",
  "fullJobDescription": "We are looking for...",

  // Lifecycle
  "isArchived": false,              // Soft delete flag
  "createdAt": ISODate("2026-09-15"),
  "updatedAt": ISODate("2026-09-20")
}
```

---

## 8. Small Examples

### Example 1: Creating a document
```javascript
// Insert one application
db.applications.insertOne({
  userId: ObjectId("507f1f77bcf86cd799439012"),
  companyName: "Google",
  roleTitle: "Backend Developer",
  status: "Saved",
  lastStatusUpdate: new Date(),
  isStale: false,
  appliedDate: new Date(),
  isArchived: false
});
```

### Example 2: Finding documents
```javascript
// Find all applications for a specific user that are in "Applied" status
db.applications.find({
  userId: ObjectId("507f1f77bcf86cd799439012"),
  status: "Applied",
  isArchived: false
});
```

### Example 3: Updating a document
```javascript
// Update status from "Applied" to "Interviewing"
db.applications.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      status: "Interviewing",
      lastStatusUpdate: new Date(),
      isStale: false
    }
  }
);
```

### Example 4: Counting documents per status (aggregation)
```javascript
// Count applications in each pipeline stage for a user
db.applications.aggregate([
  { $match: { userId: ObjectId("507f..."), isArchived: false } },
  { $group: { _id: "$status", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
// Result: [{ _id: "Applied", count: 12 }, { _id: "Saved", count: 8 }, ...]
```

### Example 5: Text search
```javascript
// Search for "google" across companyName and roleTitle
db.applications.find({
  userId: ObjectId("507f..."),
  $text: { $search: "google" }
});
```

---

## 9. Important Terminology

| Term | Definition |
|---|---|
| **Document** | A single record (like one row in SQL). A JSON-like object with key-value pairs. |
| **Collection** | A group of related documents (like a table in SQL). |
| **Database** | A container for collections. One MongoDB server can have many databases. |
| **BSON** | Binary JSON — MongoDB's internal storage format. Faster than JSON, supports more types. |
| **ObjectId** | A 12-byte unique identifier automatically generated for each document's `_id`. |
| **Index** | A data structure (B-tree) that speeds up queries by avoiding full collection scans. |
| **Collection Scan** | Reading every document in a collection to find matches. Slow. Indexes prevent this. |
| **Query** | A request to find, create, update, or delete documents. Written as JavaScript objects. |
| **Aggregation Pipeline** | A series of stages that process and transform documents (like SQL GROUP BY, but more powerful). |
| **Compound Index** | An index on multiple fields (e.g., `{ userId: 1, status: 1 }`). |
| **Text Index** | A special index for full-text search across string fields. |
| **Tenant Isolation** | Ensuring each user can only access their own data (via `userId` filtering). |
| **Schema** | The defined structure and rules for documents in a collection (enforced by Mongoose, not MongoDB itself). |
| **NoSQL** | "Not Only SQL" — databases that don't use traditional table-based SQL structures. |
| **WiredTiger** | MongoDB's default storage engine — handles how data is stored on disk. |

---

## 10. Common Mistakes

### Mistake 1: Forgetting `userId` in queries (tenant isolation breach)
```javascript
// BAD — returns ALL users' applications!
db.applications.find({ status: "Applied" });

// GOOD — only returns THIS user's applications
db.applications.find({ userId: req.user._id, status: "Applied" });
```
This is a security violation. AGENTS.md §9 says every query MUST include `{ userId: req.user._id }`.

### Mistake 2: Not creating indexes for frequent queries
If you query `{ userId: 1, status: 1 }` on every page load but don't create an index for it, MongoDB scans the entire collection every time. With 10,000 documents, this is slow. With 1,000,000 documents, it's unusable.

### Mistake 3: Confusing MongoDB shell syntax with Mongoose syntax
```javascript
// MongoDB shell syntax:
db.applications.find({ status: "Applied" })

// Mongoose syntax (what we'll use in our code):
Application.find({ status: "Applied" })
```
They look similar but are different APIs. In JobCaliber, we always use Mongoose (covered in the next learning file).

### Mistake 4: Storing passwords in plain text
```javascript
// NEVER do this:
{ email: "arjun@test.com", password: "mypassword123" }

// ALWAYS hash first:
{ email: "arjun@test.com", passwordHash: "$2b$12$LJ3..." }
```

### Mistake 5: Hard-deleting documents instead of soft-deleting
```javascript
// BAD — data is gone forever, analytics are corrupted
db.applications.deleteOne({ _id: ObjectId("...") });

// GOOD — data is hidden but preserved for analytics
db.applications.updateOne(
  { _id: ObjectId("...") },
  { $set: { isArchived: true } }
);
```

---

## 11. Things I Should Understand Before Moving Forward

- [ ] I understand that MongoDB stores data as documents (JSON-like objects), not as tables with rows and columns
- [ ] I can explain the hierarchy: Database → Collection → Document
- [ ] I know what `_id` and `ObjectId` are and that they're auto-generated
- [ ] I understand why indexes exist and what a "collection scan" is
- [ ] I can explain why JobCaliber chose MongoDB over SQL (document model fits nested data)
- [ ] I understand tenant isolation — every query must include `userId`
- [ ] I know what BSON is and why MongoDB uses it instead of plain JSON
- [ ] I can read a basic MongoDB query like `db.applications.find({ status: "Applied" })`
- [ ] I understand the difference between `find()` (many results) and `findOne()` (one result)
- [ ] I know what an aggregation pipeline is at a high level
- [ ] I understand soft delete (`isArchived: true`) vs hard delete (`deleteOne`)

---

## 12. Official Documentation

### Primary (authoritative) sources:
- [MongoDB Official Documentation](https://www.mongodb.com/docs/manual/) — the complete reference
- [MongoDB CRUD Operations](https://www.mongodb.com/docs/manual/crud/) — create, read, update, delete
- [MongoDB Indexes](https://www.mongodb.com/docs/manual/indexes/) — how indexes work
- [MongoDB Aggregation](https://www.mongodb.com/docs/manual/aggregation/) — pipelines for analytics
- [MongoDB University (free courses)](https://learn.mongodb.com/) — official free learning platform

### Secondary (high-quality learning) resources:
- [MongoDB Getting Started Guide](https://www.mongodb.com/docs/manual/tutorial/getting-started/) — official beginner tutorial
- [MongoDB vs SQL Comparison](https://www.mongodb.com/docs/manual/reference/sql-comparison/) — if you know SQL, this maps SQL concepts to MongoDB

---

## 13. Learning Order

Learn MongoDB concepts in this order:

```
1. What a document database is (documents, collections, databases)
   ↓
2. Document structure — _id, ObjectId, BSON types
   ↓
3. Basic CRUD — insertOne, find, findOne, updateOne, deleteOne
   ↓
4. Query operators — $eq, $gt, $lt, $in, $regex, $text
   ↓
5. Indexes — why they matter, compound indexes, text indexes
   ↓
6. Aggregation pipelines — $match, $group, $sort, $project
   ↓
7. Data modeling — embedding vs referencing, one-to-many relationships
   ↓
8. Connection management — connection strings, connection pooling
```

> For JobCaliber right now (Phase 1), you need steps 1–5. Steps 6–8 become important in Phase 2 when we start writing actual queries.
