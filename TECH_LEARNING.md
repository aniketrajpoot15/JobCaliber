<!-- 📌 WHAT IS THIS FILE? This is the developer's living technology study and reference guide for JobCaliber. It documents every technology actually used in completed project steps — covering beginner mental models, practical usage, internal workings, architecture tradeoffs, and interview-level depth. It is updated step-by-step as new technologies are introduced. -->

# JobCaliber — Technology Learning Guide

> **Personal Study & Engineering Reference Guide**  
> **Rule:** Only technologies from COMPLETED project steps are documented here. No premature documentation.  
> **Last Updated:** 2026-09-26 (Synchronized with Phase 1 — Step 1.2 complete)

---

## Current Learning Progress

| Metric | Value |
|---|---|
| **Technologies Encountered & In Use** | 2 |
| **Technologies Currently Being Learned** | 1 |
| **Active Focus** | Database Schema Design (MongoDB / Mongoose) |

### Technology Status Matrix

| Technology | Category | First Introduced In | Latest Active Step | Status |
|---|---|---|---|---|
| **Git (`.gitignore`)** | Developer Tooling / Version Control | Step 0.11 | Step 0.11 | `INTRODUCED / IN USE` |
| **MongoDB / Mongoose (Schema Design)** | Database / ODM | Step 1.1 | Step 1.2 | `LEARNING / DESIGNING` |

> [!NOTE]
> *Subsequent technologies (Node.js, Express, MongoDB, Mongoose, React, Vite, Tailwind CSS, JWT) are part of the planned architecture but have NOT yet been used in completed implementation steps. Per project rules, they will be documented only when their respective implementation steps are verified as complete.*

---

## Technology Relationships Map

Currently, the project is in the blueprint and architecture stage:

```
[ Developer Workspace ]
          │
          ▼
   [ Git Repository ] ◄─── Controlled by [.gitignore]
          │
          ├── (Tracked)   docs/, specifications, project rules
          └── (Ignored)   node_modules/, .env secrets, logs, build artifacts (future-proofed)
```

As implementation begins in Phase 2, this map will expand into the full request-response lifecycle:
`Client (React + Vite + Tailwind) ──► HTTP / JWT ──► Server (Node.js + Express) ──► Driver (Mongoose) ──► Database (MongoDB)`

---

# Git (`.gitignore` & Repository Hygiene)

## Status
`INTRODUCED / IN USE`

## Introduced By
**Step 0.11 — Granular task decomposition & project setup files**

## Used In Completed Steps

| Step | Phase | What Was Done | Technology Aspects Used |
|---|---|---|---|
| **Step 0.11** | Phase 0: Research & Documentation | Created project `.gitignore` and progress tracking system | Exclusion patterns, secret isolation, directory wildcard rules, tracking whitelists |

## Used In JobCaliber
In JobCaliber, Git is the distributed version control system tracking all project code and documentation. Specifically in Step 0.11, `.gitignore` was configured to establish strict repository hygiene and security boundaries:
1. **Preventing Secret Leaks:** Preventing accidental commits of `.env` files containing `JWT_SECRET`, database URIs, or API keys.
2. **Excluding Heavy Dependencies:** Preventing the massive `node_modules/` folder (tens of thousands of files) from entering version history.
3. **Excluding Ephemeral Artifacts:** Keeping build artifacts (`client/dist/`, `server/dist/`), debug logs (`*.log`), and OS metadata (`.DS_Store`, `Thumbs.db`) out of source control.
4. **Explicit Documentation Tracking:** Ensuring all project specs in `docs/` and configuration templates (`.env.example`) are reliably tracked.

## Official Documentation
- **Official Git Documentation:** https://git-scm.com/doc
- **Official `.gitignore` Reference:** https://git-scm.com/docs/gitignore
- **Pro Git Book (Free by Scott Chacon & Ben Straub):** https://git-scm.com/book/en/v2

---

## 1. What is Git & `.gitignore`?
- **Git** is a free and open-source **Distributed Version Control System (DVCS)** designed to handle everything from small to very large projects with speed and efficiency. Unlike older centralized systems (like SVN), every developer's local machine has a full-fledged copy of the entire project history.
- **`.gitignore`** is a plain text configuration file placed in a Git repository that specifies intentionally untracked files and directories that Git should ignore. Files already tracked by Git are not affected.

## 2. Why Does It Exist? What Problem Does It Solve?
Without a version control system:
- Changes overwrite each other with no undo history.
- Collaborators must email zip files or compare code manually.
- There is no audit trail of who changed what, when, or why.

Without `.gitignore`:
- **Repository Bloat:** Generated files (like compiler outputs, packaged bundles, and installed packages in `node_modules`) would be checked into history. A project of 5 MB of code could easily balloon into 500 MB of third-party binaries.
- **Merge Hell:** Machine-specific files (like IDE settings or local OS caches) cause constant merge conflicts between team members.
- **Catastrophic Security Leaks:** Plaintext passwords, database credentials, and cryptographic signing keys stored in `.env` would be committed to public or private remote repositories. Once committed, credentials remain in Git history forever unless rewritten using history-purging tools.

## 3. Why Does JobCaliber Use Git & `.gitignore`?
- **Rule Compliance:** ADR-007, ADR-014, and the Security Directives in `AGENTS.md` explicitly mandate that **no secrets, API keys, or `.env` files may ever be committed to Git**.
- **Monorepo Structure:** JobCaliber houses both `client/` and `server/` in a single monorepo. `.gitignore` ensures both client build outputs (`client/dist/`) and server logs (`server/logs/`) are cleanly managed from a unified root configuration.
- **Traceable Development:** Enables an atomic step-by-step history matching the JobCaliber Inspect → Plan → Implement → Test → Review loop.

## 4. Basic Mental Model
Think of Git as a **content-addressable snapshot camera**, not a delta recorder:
- Every time you commit, Git takes a photograph of what all your files look like at that exact moment and stores a reference to that snapshot.
- To be efficient, if a file has not changed, Git doesn’t store the file again—just a link to the previous identical file it already has stored.

Think of `.gitignore` as a **security guard at the door of the camera room**:
- When you run `git status` or `git add .`, Git scans your project folder.
- Before considering any file for tracking, Git checks the `.gitignore` rulebook.
- If the file matches an ignore pattern, Git looks the other way—it acts as if the file does not exist in the working directory.

---

## 5. How Git Works at a High Level

```
[ Working Directory ]  ──(git add)──►  [ Staging Area (Index) ]  ──(git commit)──►  [ Local Repository (.git) ]
   (Local files on                       (Snapshot prepared for                       (Permanent immutable
      your disk)                               commit)                                     snapshots)
        ▲
        │
   [.gitignore] filters out untracked files from ever entering the Staging Area
```

1. **Working Directory (Working Tree):** The sandbox on your filesystem where you actively write and edit files.
2. **Staging Area (Index):** A binary file (`.git/index`) that prepares the exact content that will go into your next commit. You curate this with `git add`.
3. **Repository (`.git` directory):** The permanent object database containing all historical commits, trees, blobs, and branch references.

---

## 6. Internal Working (Behind the Scenes)

### How Git Stores Data Internally
Git does not store diffs (changes line-by-line). Git is fundamentally a **Directed Acyclic Graph (DAG)** of cryptographic objects stored in `.git/objects/`.

There are four primary object types:
1. **Blob (Binary Large Object):** Stores the raw contents of a file (no filename, no permissions—just the compressed file data).
2. **Tree:** Represents a directory. It lists filenames, permissions, and points to the SHA hashes of Blobs (files) or other Trees (subdirectories).
3. **Commit:** A tiny text object containing:
   - The SHA hash of the top-level root Tree.
   - The SHA hash of the parent commit(s).
   - Author and committer metadata (name, email, timestamp).
   - The commit message.
4. **Annotated Tag:** A pointer to a specific commit, with a message and signature.

### How Git Identifies Content
Git hashes every object using SHA-1 (or SHA-256 in newer configurations) based on its header and content:
`hash = SHA1("blob " + size + "\0" + content)`
If two files in different directories have the exact same contents, Git stores only **one blob** in `.git/objects/`.

### How `.gitignore` Works Internally During Directory Traversal
When Git inspects your working directory (e.g., during `git status` or `git add .`):
1. **File Tree Walk:** Git traverses the directory tree using filesystem calls.
2. **Pattern Matching Engine (fnmatch):** For each path encountered, Git tests it against the rules in `.gitignore` from top to bottom.
3. **Short-Circuit Optimization:** If a directory matches an ignore rule (e.g., `node_modules/`), Git **prunes the traversal immediately**. It will not even open or scan the contents of that directory, dramatically saving CPU cycles and disk I/O.
4. **Precedence Rules:** Later patterns override earlier patterns. A negation pattern `!` re-includes a file that was previously excluded, *provided its parent directory was not pruned*.

---

## 7. Important Concepts & Terminology

### Working Tree vs. Index vs. HEAD
- **Working Tree:** The actual unpacked files you see in VS Code / File Explorer.
- **Index (Staging Area):** The proposed next commit. When you run `git add`, file contents are compressed into blobs in `.git/objects` and their SHA hashes are recorded in `.git/index`.
- **HEAD:** A symbolic reference pointing to the currently checked-out commit or branch (usually `ref: refs/heads/main`).

### Untracked vs. Tracked
- **Tracked:** Any file that was in the last snapshot (HEAD) or is currently in the Staging Area.
- **Untracked:** Any file in the working directory that is neither in the last snapshot nor in the staging area.
- **Ignored:** An untracked file that matches a `.gitignore` pattern. Git refuses to track it unless forced (`git add -f`).

### Glob Pattern Syntax in `.gitignore`
- `*`: Matches zero or more characters (e.g., `*.log` matches `app.log`, `debug.log`).
- `?`: Matches any single character.
- `[abc]`: Matches any character inside the brackets.
- `**`: Matches directories recursively (e.g., `**/logs/` matches `logs/` anywhere in the tree).
- Leading slash `/`: Anchors the match to the directory where `.gitignore` lives (e.g., `/dist` matches `dist` at root, but not `client/dist`).
- Trailing slash `/`: Specifies that the pattern must match a **directory**, not a regular file (e.g., `node_modules/`).
- Exclamation mark `!`: Negates an earlier pattern, re-including a file (e.g., `!README.md`).

---

## 8. How We Use `.gitignore` in JobCaliber

Here is the exact structure established in Step 0.11:

```gitignore
# 1. Dependency Directories
node_modules/

# 2. Secret and Environment Files (CRITICAL SECURITY)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 3. Build Outputs (Generated code)
client/dist/
client/build/
server/dist/

# 4. Logs and Diagnostic Outputs
logs/
*.log

# 5. OS and Editor Files
.DS_Store
Thumbs.db
.vscode/
.idea/

# 6. Explicitly Tracked Whitelist
# - .env.example (Safe template with dummy keys)
# - README.md, AGENTS.md, TECH_LEARNING.md
# - docs/ (All documentation)
```

---

## 9. Request / Execution Lifecycle: What Happens When You Run Git?

```
User runs: `git add .`
   │
   ▼
1. Git reads `.git/index` and `.gitignore` into memory.
   │
   ▼
2. Git iterates through the Working Directory.
   │
   ├── File matches `.gitignore`?
   │     ├── YES ──► SKIP file immediately (do not inspect or hash).
   │     └── NO  ──► Inspect file timestamp/hash.
   │
   ▼
3. For modified or new untracked files:
   ├── Compress file contents into zlib stream.
   ├── Calculate SHA-1 hash.
   ├── Write object to `.git/objects/xx/yyyy...` (Blob).
   └── Record filename, mode, and SHA in `.git/index`.
```

---

## 10. Important Features & Commands Relevant to JobCaliber

| Command | Purpose | When to Use |
|---|---|---|
| `git status` | Displays untracked, modified, and staged files | Before staging or committing anything |
| `git add <file>` | Moves changes from Working Directory to Staging Area | When a discrete, logical change is ready |
| `git diff` | Shows differences between Working Directory and Index | Review code changes before staging |
| `git diff --staged` | Shows differences between Staging Area and HEAD | Final sanity check before committing |
| `git check-ignore -v <path>` | Debugs which rule in `.gitignore` matches a file | When a file is unexpectedly ignored or tracked |

---

## 11. Common Mistakes & Pitfalls

### Mistake 1: Adding a file to `.gitignore` AFTER it was already committed
- **The Issue:** `.gitignore` only prevents *untracked* files from becoming tracked. If `server/.env` was already committed, adding `.env` to `.gitignore` will **NOT** stop Git from tracking changes to it!
- **How to Fix:** Untrack the file from Git without deleting it from your local disk:
  ```bash
  git rm --cached server/.env
  git commit -m "fix: stop tracking local .env file"
  ```

### Mistake 2: Forgetting to commit `.env.example`
- **The Issue:** Developers ignore `.env` but forget to provide a template. When a teammate or CI/CD clones the repository, the app crashes because nobody knows which environment variable keys are required.
- **The Solution:** Always commit `.env.example` with empty/dummy placeholder values, never real secrets.

### Mistake 3: Trying to re-include a file inside an ignored parent directory
- **The Issue:**
  ```gitignore
  logs/
  !logs/important.log   <-- DOES NOT WORK!
  ```
  Git will not inspect files inside `logs/` because the entire directory was pruned during traversal.
- **The Solution:**
  ```gitignore
  logs/*
  !logs/important.log
  ```

---

## 12. Security Considerations

1. **Leaked Credentials Are Forever:** If an API secret or database password is committed to Git, it remains in the commit history even if you delete the file in the very next commit. Anyone with access to the repo can run `git log -p` or checkout past commits.
2. **Revocation over Deletion:** If a secret is ever pushed to a remote repository, assume it is compromised immediately. **Rotate/revoke the credential first**, then clean up repository history using tools like `git-filter-repo` or BFG Repo-Cleaner.
3. **The `.gitignore` Defense in Depth:** `.gitignore` is the first line of defense, but should be complemented by pre-commit hooks (like `git-secrets` or `gitleaks`) that scan for credentials before commits are finalized.

---

## 13. Performance Considerations
- **Index Size & File Tree Walking:** `node_modules/` often contains 50,000+ files. If Git had to calculate the SHA hash and stat every file in `node_modules` on every `git status`, Git commands would take seconds or minutes instead of milliseconds.
- Ignoring third-party dependency directories keeps Git operations sub-second and keeps repository clones lean.

---

## 14. Alternatives & Trade-offs

| System | Model | Pros | Cons | Why JobCaliber Chose Git |
|---|---|---|---|---|
| **Git** | Distributed | Fast, local-first, cryptographic integrity, industry standard | Steep learning curve for advanced operations | Universal industry standard; required for modern software engineering careers |
| **SVN (Subversion)** | Centralized | Simple mental model, fine-grained access control | Requires network for almost every command; single point of failure | Outdated for modern web development |
| **Mercurial (Hg)** | Distributed | Cleaner CLI syntax | Smaller ecosystem, fewer hosting platforms | Git dominates web ecosystem |

---

## 15. Interview-Level Understanding

### Questions You Should Be Able to Answer in an Interview:

#### Q1: "Explain what happens internally when you commit a file in Git."
> **Model Answer:**  
> When `git add` is executed, Git reads the file content, prepends a header containing the object type (`blob`) and byte length, and computes its SHA-1 hash. It compresses the content using zlib and writes the blob into `.git/objects/` under the first two characters of the hash as the folder name. It then updates the staging index (`.git/index`) mapping the file path to that blob hash.  
> When `git commit` is executed, Git creates a `tree` object representing the directory structure, pointing to the blobs and subtree hashes. It then creates a `commit` object containing the root tree hash, parent commit hash, author/committer metadata, timestamp, and commit message, writes it to the object database, and advances the current branch pointer (HEAD) to this new commit hash.

#### Q2: "Why doesn't `.gitignore` ignore a file I just added to it?"
> **Model Answer:**  
> `.gitignore` only instructs Git to ignore *untracked* files during directory traversal. If a file is already tracked in the index (staging area) or has been previously committed, Git continues tracking changes to it. To ignore it, you must remove it from the index using `git rm --cached <file>` and commit that removal.

#### Q3: "What is the difference between Git and GitHub?"
> **Model Answer:**  
> Git is the local distributed version control command-line tool that manages file snapshots and history on your machine. GitHub is a cloud hosting service and collaboration platform built on top of Git that provides remote repository hosting, pull requests, issue tracking, and CI/CD pipelines.

---

## 16. Recommended Study Order for Version Control

1. The Three Trees: Working Directory, Staging Area (Index), Repository.
2. Basic Commands: `init`, `status`, `add`, `commit`, `log`, `diff`.
3. Repository Hygiene: `.gitignore` syntax, pattern precedence, untracking files with `git rm --cached`.
4. Git Internals: Blobs, Trees, Commits, Annotated Tags, and SHA content-addressable storage.
5. Branching & Merging: Pointers, fast-forward merges, three-way merges, and conflict resolution.
6. Remote Operations: `clone`, `fetch`, `pull`, `push`, and upstream tracking.

---

## 17. After Step 0.11, I Should Be Able To Explain:

- [x] What Git is and why it is a distributed version control system.
- [x] The difference between the Working Directory, the Staging Area, and the Git Repository.
- [x] What `.gitignore` does and why it is critical for security and repository performance.
- [x] Why committing `.env` files is a severe security vulnerability.
- [x] How to fix a file that was accidentally committed before being added to `.gitignore`.
- [x] How Git stores data internally using Blobs, Trees, and Commits identified by SHA hashes.
- [x] Why `.env.example` must be tracked even when `.env` is ignored.

---

## 18. Official Resources & References
- [Git SCM Official Documentation](https://git-scm.com/doc)
- [Git SCM - .gitignore Man Page](https://git-scm.com/docs/gitignore)
- [Pro Git Book — Chapter 10: Git Internals](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)
- [GitHub Documentation on Ignoring Files](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files)

---
---

# MongoDB / Mongoose (Schema Design)

## Status
`LEARNING / DESIGNING`

## Introduced By
**Step 1.1 — Define User collection schema**

## Used In Completed Steps

| Step | Phase | What Was Done | Technology Aspects Used |
|---|---|---|---|
| **Step 1.1** | Phase 1: Architecture | Designed the `users` collection schema | Schema field types, `required`, `trim`, `select: false`, `toJSON` transform, unique indexes, email regex validation |
| **Step 1.2** | Phase 1: Architecture | Designed the `applications` collection schema | Enums, compound indexes, left-prefix rule, ObjectId references, computed persisted fields (`isStale`), soft delete (`isArchived`), text indexes |

## Used In JobCaliber
In JobCaliber, MongoDB is our database and Mongoose is the ODM (Object Data Modeling) library that sits between our Express server and MongoDB. In Steps 1.1–1.2, we're not writing actual code yet — we're *designing* the schemas that will become our Mongoose models in Phase 2. Think of this like drawing the blueprint before building the house.

---

## What Even Is a Schema? (The Mental Model)

Imagine a spreadsheet. Each *row* is a document (like a single job application). Each *column* is a field (like `companyName`, `status`, `appliedDate`). A **schema** is like the column headers + the rules for each column:

- Column "companyName" → must be a String, must not be empty, max 200 characters
- Column "status" → must be one of exactly 7 values (Saved, Applied, etc.)
- Column "appliedDate" → must be a Date, defaults to today

Without a schema, MongoDB would let you store *anything* in any shape — a document could have `company_name` in one row and `companyName` in another, with no error. Mongoose schemas prevent that chaos.

```javascript
// This is what a basic Mongoose schema looks like:
const applicationSchema = new mongoose.Schema({
  companyName: {
    type: String,       // What kind of data
    required: true,     // Can't be missing
    trim: true,         // Removes whitespace from edges
    maxlength: 200      // Maximum 200 characters
  }
});
```

---

## Concept 1: Enums — Restricting a Field to a Fixed Set of Values

### What's the Problem?
If `status` is a free-text String, users (or bugs) could set it to anything: `"applied"`, `"APPLIED"`, `"applieed"`, `"In Progress"`, `"rejected probably"`. This would destroy analytics — how do you count applications in the "Applied" stage if it's spelled 10 different ways?

### The Solution: `enum`
Mongoose `enum` restricts a String field to an explicit whitelist of allowed values:

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

### What Happens If You Try to Save an Invalid Value?
Mongoose throws a **ValidationError** before the document ever reaches MongoDB:
```
ValidationError: `"In Progress" is not a valid application status`
```
The save is rejected. The invalid data never enters the database.

### Why Is This Important for JobCaliber?
Our funnel analytics count applications per stage using MongoDB's `$group` aggregation. If statuses aren't consistent, the funnel breaks. Enums guarantee consistency.

---

## Concept 2: ObjectId References — How Collections Talk to Each Other

### The Problem
MongoDB is a *document* database — there are no JOINs like in SQL. So how does an `Application` document know which `User` it belongs to?

### The Solution: ObjectId Foreign Keys
Every MongoDB document has a unique `_id` (a 12-byte ObjectId). We store the user's `_id` inside the application document:

```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,  // Stores a reference to another document
  ref: 'User',                           // Points to the User model
  required: true
}
```

### How It Works
When User "Arjun" (with `_id: 507f1f77bcf86cd799439011`) creates an application, the application document stores:
```json
{ "userId": "507f1f77bcf86cd799439011", "companyName": "Google", ... }
```

Now, to get all of Arjun's applications:
```javascript
Application.find({ userId: '507f1f77bcf86cd799439011' })
```

### The `ref: 'User'` Part
The `ref` tells Mongoose which model this ObjectId points to. This enables `.populate()` — a Mongoose feature that replaces the ObjectId with the actual User document:
```javascript
// Without populate: { userId: '507f1f...' }
// With populate:    { userId: { fullName: 'Arjun', email: 'arjun@...' } }
const app = await Application.findById(id).populate('userId');
```
We probably won't use `.populate()` often in JobCaliber because the logged-in user's info is already available from `req.user` (set by the auth middleware). But it's good to understand.

---

## Concept 3: Compound Indexes — Making Queries Fast

### The Problem
Imagine you have 10,000 application documents in MongoDB. When you run:
```javascript
Application.find({ userId: '507f...', status: 'Applied' })
```
Without an index, MongoDB performs a **collection scan** — it reads ALL 10,000 documents one by one to check which ones match. That's slow.

### The Solution: Indexes
An index is like the index at the back of a textbook. Instead of reading every page to find "Graphs", you look up "Graphs" in the index and jump directly to page 142.

A **compound index** indexes multiple fields together:
```javascript
applicationSchema.index({ userId: 1, status: 1 });
```

### The Left-Prefix Rule (CRITICAL to understand)
A compound index `{ userId: 1, status: 1 }` can efficiently answer:
- ✅ Queries on `userId` alone → `find({ userId: '...' })`
- ✅ Queries on `userId` AND `status` → `find({ userId: '...', status: 'Applied' })`
- ❌ Queries on `status` alone → `find({ status: 'Applied' })` ← **cannot use this index!**

Why? Think of it like a phone book sorted by `LastName, FirstName`. You can quickly find all people named "Patel" (last name). You can also find "Patel, Arjun" (both). But you **cannot** efficiently find all people named "Arjun" (first name only) because the book is organized by last name first.

### Why `userId` Is Always First in Our Indexes
JobCaliber enforces **tenant isolation** — every query must include `userId`. So `userId` is always present. Putting it first in the compound index means every query benefits from the index.

---

## Concept 4: Persisted Computed Fields vs Virtual Fields

### The Scenario
The `isStale` field tells us whether an application has been sitting in `Applied` or `OA / Screening` for too long. We *could* compute this on-the-fly every time:

```javascript
// Virtual approach (NOT what we chose):
applicationSchema.virtual('isStale').get(function () {
  const days = (Date.now() - this.lastStatusUpdate) / 86400000;
  return ['Applied', 'OA / Screening'].includes(this.status) && days >= 14;
});
```

### Problem with Virtuals
- **Can't filter on them:** `Application.find({ isStale: true })` won't work because virtual fields don't exist in MongoDB — they're calculated in JavaScript after the data is fetched.
- **Can't display them in bulk efficiently:** For a Kanban board showing 100+ cards, every card would need to recalculate staleness.

### Our Decision: Persist It
We store `isStale` as a real Boolean field in MongoDB. This means:
- ✅ We CAN filter: `Application.find({ isStale: true })` works and is fast
- ✅ We CAN display in bulk: just read the field, no calculation needed
- ⚠️ But it can become stale itself (ironic!) — an application might turn stale overnight, but the field still says `false` until we recalculate it

### How We Handle the Staleness of Staleness
Two recalculation triggers:
1. **On-write:** When a status changes, recalculate `isStale` immediately
2. **On-read:** When the application list is fetched, recalculate `isStale` for all returned documents (catches overnight staleness)

This is a common pattern called **"lazy evaluation with eager refresh"** — you persist the value for fast reads, but refresh it whenever someone looks at the data.

---

## Concept 5: Soft Delete with `isArchived`

### The Problem
When a user "deletes" an application, should we actually remove it from MongoDB?

### Why Hard Delete Is Dangerous
Imagine a user applies to 50 companies. 20 reject them. If they delete the rejected ones, their funnel analytics now show:
- Applied: 50
- Rejected: 0 ❌ (misleading!)

The data is gone forever. The funnel is corrupted.

### The Soft Delete Pattern
Instead of deleting, we set `isArchived: true`. The application disappears from the Kanban board, but it's still in the database for analytics.

Every default list query includes:
```javascript
Application.find({ userId: req.user._id, isArchived: false })
```

And to view archived applications:
```javascript
Application.find({ userId: req.user._id, isArchived: true })
```

---

## Concept 6: Empty String `''` vs `null` for Optional Fields

### The Dilemma
The `workMode` field is optional. If a user doesn't specify it, what should the value be?

Option A: `null` (no value at all)
Option B: `''` (empty string)

### Why We Chose Empty String
With `null`, every place in the code that uses `workMode` needs a null check:
```javascript
// With null — annoying, error-prone:
if (app.workMode !== null && app.workMode !== undefined) {
  display(app.workMode);
}
```

With `''`, it's simpler:
```javascript
// With '' — clean:
if (app.workMode) {
  display(app.workMode);
}
```

In JavaScript, empty string `''` is falsy, so `if (app.workMode)` naturally skips "not specified" values. And Mongoose enum validation includes `''` in the allowed values, so it passes validation cleanly.

---

## Concept 7: Text Indexes — How MongoDB Search Works

For the search bar (typing "google" to find applications at Google), we use a MongoDB **text index**:

```javascript
applicationSchema.index({ companyName: 'text', roleTitle: 'text' });
```

### What a Text Index Does
MongoDB tokenizes (splits into words) and stems (reduces to root form) the indexed fields. Then when you search:
```javascript
Application.find({ $text: { $search: 'google backend' } })
```
It finds documents where `companyName` OR `roleTitle` contains "google" or "backend" (case-insensitive, partial word matching).

### Important Limitation
You can only have **ONE text index per collection**. That's a MongoDB rule. So we combine `companyName` and `roleTitle` into a single text index rather than creating separate ones.

---

## Self-Assessment Checklist (Step 1.1 + Step 1.2)

- [x] I understand what a Mongoose schema is and why it matters.
- [x] I can explain why `enum` is used for the `status` field instead of free-text.
- [x] I understand how ObjectId references link collections (like SQL foreign keys).
- [x] I can explain the left-prefix rule for compound indexes.
- [x] I know why `userId` must be the first key in every compound index.
- [x] I understand the difference between a virtual field and a persisted computed field.
- [x] I can explain why we persist `isStale` instead of computing it on-the-fly.
- [x] I understand the soft delete pattern and why hard deletes corrupt analytics.
- [x] I know why empty string `''` is preferred over `null` for optional enum fields.
- [x] I understand what a text index does and the one-per-collection limitation.
- [x] I can explain `select: false` on `passwordHash` and why it matters for security.
- [x] I understand multi-layer validation: client → express-validator → Mongoose → MongoDB.

---

## Official Resources & References
- [Mongoose Schema Documentation](https://mongoosejs.com/docs/guide.html)
- [Mongoose SchemaTypes](https://mongoosejs.com/docs/schematypes.html)
- [Mongoose Validation](https://mongoosejs.com/docs/validation.html)
- [MongoDB Indexes](https://www.mongodb.com/docs/manual/indexes/)
- [MongoDB Compound Indexes](https://www.mongodb.com/docs/manual/core/index-compound/)
- [MongoDB Text Indexes](https://www.mongodb.com/docs/manual/core/index-text/)
