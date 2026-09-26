<!-- 📌 WHAT IS THIS FILE? This is the index and learning roadmap for all technology documentation in JobCaliber. It tells you what technologies the project uses, what order to learn them in, and links to each technology's dedicated learning file. Start here. -->

# JobCaliber — Technology Learning Hub

> **Purpose:** Learn every technology used in JobCaliber, one at a time, in the right order.  
> **Rule:** A technology file is only created when that technology is actively used or being designed in the project. No premature documentation.  
> **Last Updated:** 2026-09-26  
> **Current Phase:** Phase 1 — Architecture (Steps 1.1–1.12 complete)

---

## How This Directory Works

```
YOUR LEARNING WORKFLOW:

1. Identify a technology being introduced
2. Read its learning file in this directory
3. Understand the concepts
4. See how it's used in the project's actual code/docs
5. Understand it line by line
6. Only THEN continue with implementation
```

Each file follows a consistent 13-section structure:
1. What is it?
2. Why are we using it?
3. Where is it used in our project?
4. Prerequisites
5. Core concepts
6. How it works
7. Project-specific implementation
8. Small examples
9. Important terminology
10. Common mistakes
11. Understanding checklist
12. Official documentation
13. Learning order

---

## Learning Status Matrix

| # | Technology | File | Category | Status | Introduced In |
|---|---|---|---|---|---|
| 1 | **Git** | [git.md](./git.md) | Version Control | ✅ `ACTIVE` | Step 0.11 |
| 2 | **MongoDB** | [mongodb.md](./mongodb.md) | Database | 🟡 `DESIGNING` | Step 1.1 |
| 3 | **Mongoose** | [mongoose.md](./mongoose.md) | ODM (Object Data Modeling) | 🟡 `DESIGNING` | Step 1.1 |
| 4 | **REST API Design** | [rest-api.md](./rest-api.md) | Architecture Pattern | 🟡 `DESIGNING` | Step 1.6 |
| 5 | Node.js | `nodejs.md` | Runtime | ⬜ `PLANNED` — Step 2.1 | — |
| 6 | Express.js | `express.md` | Backend Framework | ⬜ `PLANNED` — Step 2.3 | — |
| 7 | bcryptjs | `bcrypt.md` | Password Hashing | ⬜ `PLANNED` — Step 2.7 | — |
| 8 | JWT | `jwt.md` | Auth Tokens | ⬜ `PLANNED` — Step 2.8 | — |
| 9 | React 18 | `react.md` | Frontend Framework | ⬜ `PLANNED` — Step 2.19 | — |
| 10 | Vite | `vite.md` | Build Tool | ⬜ `PLANNED` — Step 2.19 | — |
| 11 | Tailwind CSS | `tailwind.md` | Styling | ⬜ `PLANNED` — Step 2.20 | — |
| 12 | @hello-pangea/dnd | `dnd.md` | Drag & Drop | ⬜ `PLANNED` — Phase 3 | — |
| 13 | Recharts | `recharts.md` | Charts | ⬜ `PLANNED` — Phase 6 | — |

> **Smaller libraries** (dotenv, cors, cookie-parser, express-validator, express-mongo-sanitize, express-rate-limit, date-fns, nodemon) are documented as subsections inside their parent technology files (e.g., `express.md`), not as standalone files.

---

## Recommended Learning Order

### Phase 1 — Architecture (YOU ARE HERE)

```
Step 1: Git           → How version control works, .gitignore, commits
Step 2: MongoDB       → What a document database is, collections, documents, indexes
Step 3: Mongoose      → What an ODM is, schemas, validation, enums, references
Step 4: REST API      → What REST is, HTTP methods, status codes, endpoint design
```

> You should understand these four BEFORE moving to Phase 2.

### Phase 2 — Foundation (when you get here)

```
Step 5: Node.js       → What a runtime is, event loop, npm, package.json
Step 6: Express.js    → What a framework is, routes, middleware, request/response
Step 7: bcryptjs      → How password hashing works, salt rounds, why not plaintext
Step 8: JWT           → What tokens are, how auth works, cookies vs localStorage
```

### Phase 3+ — Frontend & Features (later)

```
Step 9:  React        → Components, state, props, hooks, JSX
Step 10: Vite         → What a build tool does, dev server, hot module replacement
Step 11: Tailwind CSS → Utility-first CSS, responsive design, dark mode
Step 12: Drag & Drop  → @hello-pangea/dnd, draggable/droppable patterns
Step 13: Recharts     → SVG charts in React, responsive containers
```

---

## How Technologies Connect in JobCaliber

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                          │
│                                                                 │
│   React 18 ──► Components ──► Tailwind CSS (styling)           │
│      │              │                                           │
│      │         @hello-pangea/dnd (Kanban drag)                 │
│      │         Recharts (analytics charts)                     │
│      │                                                          │
│      ▼                                                          │
│   Vite (builds & serves the React app)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP requests (REST API)
                           │ JWT token in HttpOnly cookie
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Node.js)                         │
│                                                                 │
│   Express.js ──► Routes ──► Controllers ──► Mongoose ──► MongoDB│
│      │                                                          │
│      ├── cookie-parser (reads JWT from cookies)                │
│      ├── cors (allows cross-origin requests)                   │
│      ├── express-validator (validates input)                   │
│      ├── express-mongo-sanitize (prevents NoSQL injection)     │
│      ├── express-rate-limit (prevents brute force)             │
│      ├── bcryptjs (hashes passwords)                           │
│      ├── jsonwebtoken (creates/verifies JWT tokens)            │
│      ├── date-fns (date calculations)                          │
│      └── dotenv (loads .env variables)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Mongoose queries
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                           │
│                                                                 │
│   Collections: users, applications, interviewrounds,           │
│                interviewquestions, problemlogs                  │
└─────────────────────────────────────────────────────────────────┘

All of the above is version-controlled by Git.
```

---

## File Structure

```
tech-learning/
├── README.md        ← You are here (index & learning roadmap)
├── git.md           ← ✅ Active
├── mongodb.md       ← 🟡 Designing
├── mongoose.md      ← 🟡 Designing
├── rest-api.md      ← 🟡 Designing (NEW — Step 1.6)
└── (future files created when technologies are introduced)
```
