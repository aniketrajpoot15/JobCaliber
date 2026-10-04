<!-- 📌 WHAT IS THIS FILE? This is a complete guide to every file and directory in the JobCaliber project. It explains what each file does, why it exists, and how all the pieces connect. Updated as new files are created. -->

# JobCaliber — Project File Map

> **Purpose:** Understand what every file and directory in the project does, why it exists, and how they all connect.  
> **Rule:** This file is updated after EVERY step that creates or modifies files.  
> **Last Updated:** 2026-09-29 — Step 2.6 (MongoDB connection module created)

---

## How to Read This File

Each entry follows this format:
- **Path** — where the file lives
- **What it is** — one-line description
- **Why it exists** — the reason we need it
- **What's inside** — detailed breakdown of contents
- **When it was created** — which step introduced it

Files marked with 🔒 should **never** be committed to Git.  
Files marked with 🤖 are auto-generated and should not be manually edited.  
Files marked with ⬜ don't exist yet — they're planned for future steps.

---

## Top-Level Overview

```
JobCaliber/                    ← PROJECT ROOT (monorepo)
│
├── server/                    ← BACKEND (Node.js + Express + MongoDB)
│   ├── config/                🟡 Database connection
│   │   └── db.js             ✅ Mongoose connection function
│   ├── controllers/           ⬜ Route handler logic
│   ├── middleware/             🟡 NoSQL sanitizer + error handler
│   │   ├── mongoSanitize.js   ✅ Custom NoSQL injection defense
│   │   └── errorHandler.js    ✅ Global error handler
│   ├── models/                ⬜ Mongoose schemas (data shapes)
│   ├── routes/                ⬜ Express route definitions
│   ├── utils/                 🟡 Server utilities & constants
│   │   └── constants.js       ✅ All enums & system constants
│   ├── server.js              ✅ Express entry point
│   ├── package.json           ✅ Backend dependencies & scripts
│   ├── package-lock.json      🤖 Exact dependency versions
│   ├── .env                   🔒 Local secrets (gitignored)
│   ├── .env.example           ✅ Template for .env
│   └── node_modules/          🤖 Installed npm packages
│
├── client/                    ⬜ FRONTEND (React + Vite + Tailwind)
│   └── (not created yet — Phase 2, Step ~2.19)
│
├── docs/                      ← PROJECT DOCUMENTATION
│   ├── Research_And_Documentation/  ← Phase 0 docs (product research)
│   ├── Architecture/               ← Phase 1 docs (technical specs)
│   └── shared/                     ← Progress tracking
│
├── tech-learning/             ← TECHNOLOGY LEARNING HUB
│   ├── README.md              ← Index & learning roadmap
│   ├── git.md                 ← Git version control
│   ├── mongodb.md             ← MongoDB database
│   ├── mongoose.md            ← Mongoose ODM
│   ├── rest-api.md            ← REST API design
│   ├── nodejs.md              ← Node.js runtime
│   ├── express.md             ← Express.js framework & .env
│   ├── project-file-map.md   ← THIS FILE
│   └── (more files added as tech is introduced)
│
├── AGENTS.md                  ← AI agent rules & project directives
├── README.md                  ← Project front page (for GitHub)
├── TECH_LEARNING.md           ← Redirect → tech-learning/ directory
├── .gitignore                 ← Files Git should never track
└── .git/                      🤖 Git internal data
```

---

## Server Directory (`server/`)

The backend. This is where all the API logic, database models, and security middleware live.

---

### `server/server.js` ✅

| Field | Detail |
|---|---|
| **What it is** | The application entry point — the first file Node.js executes |
| **Why it exists** | Every Node.js app needs a starting file. This is what `node server.js` runs. |
| **Created in** | Step 2.4 |

**What's inside:**

```
server.js does 5 things (currently):

1. Load environment variables     → dotenv.config()
2. Import Express                 → require('express')
3. Create the app object          → express()
4. Define PORT                    → process.env.PORT || 5000
5. Start listening                → app.listen(PORT)
```

**What will be added later (in future steps):**

| Future Addition | Step | What It Does |
|---|---|---|
| `express.json()` middleware | 2.5 | Parse JSON request bodies |
| `cors()` middleware | 2.5 | Allow cross-origin requests from React |
| `cookieParser()` middleware | 2.5 | Parse cookies (for JWT auth) |
| `helmet()` middleware | 2.5 | Set security HTTP headers |
| `connectDB()` call | 2.7 | Connect to MongoDB before accepting requests |
| `mongoSanitize()` middleware | 2.5 | Prevent NoSQL injection attacks |
| Auth routes | 2.14 | `/api/auth/*` endpoints |
| Application routes | Phase 3 | `/api/applications/*` endpoints |
| Error handler middleware | 2.8 | Catch errors and return formatted JSON |

**How it grows over time:**
```
Step 2.4:  dotenv → express → listen (NOW)
Step 2.5:  + middleware (json, cors, cookies, helmet, sanitize)
Step 2.7:  + database connection
Step 2.8:  + global error handler
Step 2.14: + route mounting (/api/auth, /api/applications, etc.)
```

---

### `server/package.json` ✅

| Field | Detail |
|---|---|
| **What it is** | The project manifest — defines the project identity, scripts, and dependencies |
| **Why it exists** | npm requires it. It tells Node.js what packages to install and how to run the project. |
| **Created in** | Step 2.1 |

**What's inside:**

| Section | Purpose | Example |
|---|---|---|
| `"name"` | Project identifier | `"jobcaliber-server"` |
| `"version"` | Semantic version | `"1.0.0"` |
| `"main"` | Entry point file | `"server.js"` |
| `"scripts"` | Command shortcuts | `"start": "node server.js"`, `"dev": "nodemon server.js"` |
| `"dependencies"` | Production packages (12) | express, mongoose, bcryptjs, jsonwebtoken, etc. |
| `"devDependencies"` | Development-only packages (1) | nodemon |

**Scripts explained:**

| Command | What It Does | When to Use |
|---|---|---|
| `npm start` | Runs `node server.js` | Production (runs once, no auto-restart) |
| `npm run dev` | Runs `nodemon server.js` | Development (auto-restarts on file changes) |

**All 12 production dependencies:**

| Package | Version | What It Does | Used For |
|---|---|---|---|
| `express` | ^5.2.1 | Web framework | Routes, middleware, HTTP handling |
| `mongoose` | ^9.10.2 | MongoDB ODM | Schema definitions, database queries |
| `bcryptjs` | ^3.0.3 | Password hashing | Securely storing user passwords |
| `jsonwebtoken` | ^9.0.3 | JWT creation/verification | User authentication tokens |
| `cookie-parser` | ^1.4.7 | Parse HTTP cookies | Reading JWT from cookies |
| `cors` | ^2.8.6 | Cross-Origin Resource Sharing | Allow React frontend to call our API |
| `dotenv` | ^18.0.4 | Load .env files | Environment variable management |
| `express-validator` | ^7.3.2 | Input validation | Validate request bodies (email format, required fields) |
| `express-mongo-sanitize` | ^2.2.0 | NoSQL injection prevention | Strip `$` and `.` from user input |
| `express-rate-limit` | ^8.7.0 | Rate limiting | Prevent brute-force login attacks |
| `helmet` | ^8.3.0 | Security HTTP headers | Protect against common web vulnerabilities |
| `date-fns` | ^4.4.0 | Date utilities | Stale application calculations, date formatting |

**1 dev dependency:**

| Package | What It Does |
|---|---|
| `nodemon` | Watches files and auto-restarts the server when you save changes. Only needed during development. |

---

### `server/package-lock.json` 🤖

| Field | Detail |
|---|---|
| **What it is** | Auto-generated lockfile recording the exact version of every installed package and sub-dependency |
| **Why it exists** | Ensures everyone gets identical dependency versions. Without it, `npm install` might install slightly different versions on different machines. |
| **Created in** | Step 2.2 (auto-generated by `npm install`) |

**Rules:**
- ✅ Commit to Git (ensures reproducible builds)
- ❌ Never edit manually
- 🤖 Automatically updated whenever you run `npm install`

---

### `server/.env` 🔒

| Field | Detail |
|---|---|
| **What it is** | Local environment configuration file containing real secrets |
| **Why it exists** | Stores database URLs, cryptographic keys, and configuration that must never be in source code |
| **Created in** | Step 2.3 |

**What's inside:**

| Variable | Example Value | Purpose |
|---|---|---|
| `NODE_ENV` | `development` | Which mode the app runs in (affects error detail, CORS, etc.) |
| `PORT` | `5000` | TCP port for the Express server |
| `MONGO_URI` | `mongodb://localhost:27017/jobcaliber` | MongoDB connection string |
| `JWT_SECRET` | `713b72a549ac...` (128 chars) | Key for signing/verifying JWT auth tokens |
| `JWT_EXPIRE` | `7d` | How long JWT tokens remain valid |
| `COOKIE_SECRET` | `fe979f9e40f5...` (128 chars) | Key for signing HTTP cookies |
| `CLIENT_URL` | `http://localhost:5173` | React app URL (for CORS whitelist) |

**Critical rules:**
- 🔒 NEVER commit to Git (it's in `.gitignore`)
- 🔒 NEVER share the JWT_SECRET or COOKIE_SECRET
- Each developer creates their own `.env` from `.env.example`

---

### `server/.env.example` ✅

| Field | Detail |
|---|---|
| **What it is** | A template that shows which environment variables the project needs, with placeholder values |
| **Why it exists** | Documentation for new developers. They copy this to `.env` and fill in real values. |
| **Created in** | Step 2.3 |

**What's inside:** Same keys as `.env`, but with placeholder values like `your_jwt_secret_here_replace_with_64_byte_hex` instead of real secrets.

**How to use it:**
```bash
cp .env.example .env    # Create your local .env from the template
# Then edit .env and fill in your actual values
```

---

### `server/node_modules/` 🤖

| Field | Detail |
|---|---|
| **What it is** | Directory containing all installed npm packages (the actual code for express, mongoose, etc.) |
| **Why it exists** | `npm install` downloads packages here. Node.js `require()` looks here when you import a package. |
| **Created in** | Step 2.2 (auto-generated by `npm install`) |

**Rules:**
- ❌ NEVER commit to Git (it's in `.gitignore`)
- ❌ NEVER edit files inside it
- 🤖 Regenerated by running `npm install` (reads `package-lock.json`)
- Can be safely deleted — `npm install` recreates it

---

### `server/config/` ⬜ (Not yet created — Step 2.6)

| What will go here | Purpose |
|---|---|
| `db.js` ✅ | MongoDB connection function using Mongoose. Exports `connectDB()` which reads `MONGO_URI`, connects with try/catch, logs success with host, or crashes the process on failure (`process.exit(1)`). Created in Step 2.6. |

---

### `server/models/` 🟡 (Partially created — Step 2.10)

#### `User.js` ✅ (Created in Step 2.10)

| Field | Detail |
|---|---|
| **What it is** | Mongoose schema defining the shape of user documents in MongoDB |
| **Why it exists** | The User model is the tenant boundary — every child record belongs to a user. Auth, settings, and data isolation all depend on this model. |
| **What's inside** | 5 user-defined fields: `fullName`, `email`, `passwordHash`, `targetRole`, `staleThresholdDays`. Plus auto-managed `createdAt`, `updatedAt`, `_id`, `__v`. |
| **Security features** | `select: false` on passwordHash (excluded from queries by default). `toJSON` transform strips passwordHash and __v from all API responses. |
| **Created in** | Step 2.10 (schema only — hooks in 2.11, methods in 2.12) |

#### Planned files (not yet created):

| File | Purpose | Created in |
|---|---|---|
| `Application.js` | Schema for job applications — companyName, roleTitle, status, dates | Phase 3 |
| `InterviewRound.js` | Schema for interview rounds — roundType, scheduledDate, debrief data | Phase 5 |
| `InterviewQuestion.js` | Schema for specific questions asked during an interview | Phase 5 |
| `ProblemLog.js` | Schema for logged weaknesses/stumble topics | Phase 5 |

---

### `server/routes/` ⬜ (Not yet created — Step 2.14)

| What will go here | Purpose |
|---|---|
| `authRoutes.js` | `/api/auth/*` — register, login, logout, me |
| `applicationRoutes.js` | `/api/applications/*` — CRUD, status changes, filters |
| `interviewRoutes.js` | `/api/interviews/*` — rounds, debriefs |
| `analyticsRoutes.js` | `/api/analytics/*` — funnel, weaknesses, cohorts, triage |

**Routes only define WHAT URLs exist. They delegate all logic to controllers.**

---

### `server/controllers/` ⬜ (Not yet created — Step 2.13)

| What will go here | Purpose |
|---|---|
| `authController.js` | Logic for register, login, logout, getMe |
| `applicationController.js` | Logic for CRUD operations on applications |
| `interviewController.js` | Logic for interview rounds and debriefs |
| `analyticsController.js` | Logic for aggregation queries (funnel, heatmap, etc.) |

**Controllers contain the actual business logic — database queries, validation, response formatting.**

---

### `server/middleware/` 🟡 (Partially created — Step 2.5)

#### `mongoSanitize.js` ✅ (Created in Step 2.5)

| Field | Detail |
|---|---|
| **What it is** | Custom NoSQL injection defense middleware |
| **Why it exists** | The popular `express-mongo-sanitize` package (v2.2.0) is abandoned and crashes on Express 5 because `req.query` is read-only. We wrote our own. |
| **What it does** | Recursively scans `req.body` and `req.params` for keys starting with `$` or containing `.` (MongoDB operators). Replaces them with `_`. |
| **Why not req.query?** | In Express 5, `req.query` is a read-only getter. Query params are validated per-route using `express-validator` instead (more secure). |
| **How to use** | `app.use(mongoSanitize())` — it's a factory function that returns middleware. |

#### Planned files (not yet created):

| File | Purpose | Created in |
|---|---|---|
| `auth.js` | JWT verification middleware — checks the cookie, extracts userId | Step 2.12 |
| `validate.js` | Validation middleware using express-validator | Step 2.14 |

#### `errorHandler.js` ✅ (Created in Step 2.8)

| Field | Detail |
|---|---|
| **What it is** | Global error handler middleware (Stage 10 of the pipeline) |
| **Why it exists** | Without it, unhandled errors crash the server or leak stack traces to attackers |
| **What it does** | Catches ALL errors and returns consistent JSON: `{ success: false, message, stack (dev only) }` |
| **Special handling** | Mongoose CastError → 400, Duplicate key (11000) → 409, ValidationError → 400 with field-level errors |
| **Security** | Stack traces only included when `NODE_ENV=development`. In production, attackers see no internal details. |
| **Key rule** | Must be registered LAST in server.js (after all routes). Express recognizes error middleware by its 4-param signature `(err, req, res, next)`. |

---

### `server/utils/` 🟡 (Partially created — Step 2.9)

#### `constants.js` ✅ (Created in Step 2.9)

| Field | Detail |
|---|---|
| **What it is** | Single source of truth for all enum values and system constants |
| **Why it exists** | Eliminates magic strings. Every part of the codebase imports enums from here instead of hardcoding values like `'Applied'` or `'OA / Screening'`. One typo in a hardcoded string causes a silent bug; one import from this file guarantees consistency. |
| **What it exports** | 15 named exports (7 enum arrays + 8 numeric constants) |

**Enum arrays (frozen with `Object.freeze()`):**

| Export | Count | Values |
|---|---|---|
| `STATUS_ENUM` | 7 | Saved, Applied, OA / Screening, Interviewing, Offer, Rejected, Ghosted |
| `STALEABLE_STATUSES` | 2 | Applied, OA / Screening (subset that can be flagged stale) |
| `ROUND_TYPE_ENUM` | 5 | Recruiter, Technical, System Design, HR, OA |
| `WORK_MODE_ENUM` | 4 | '' (not specified), Remote, Hybrid, Onsite |
| `SOURCE_ENUM` | 8 | '' (not specified), LinkedIn, Naukri, Referral, Company Website, Indeed, AngelList, Other |
| `QUESTION_CATEGORY_ENUM` | 5 | Technical, System Design, Behavioral, Resume, Other |
| `PROBLEM_CATEGORY_ENUM` | 4 | Technical, Behavioral, System Design, Custom |

**Numeric constants:**

| Export | Value | Purpose |
|---|---|---|
| `MAX_ACTION_CENTER_ITEMS` | 3 | Max triage items shown (PD-07) |
| `DEFAULT_STALE_THRESHOLD_DAYS` | 14 | Default inactivity threshold (ADR-004) |
| `MIN_STALE_THRESHOLD_DAYS` | 7 | Minimum configurable threshold |
| `MAX_STALE_THRESHOLD_DAYS` | 45 | Maximum configurable threshold |
| `DUPLICATE_DETECTION_WINDOW_DAYS` | 60 | Duplicate check window (ADR-013) |
| `MIN_DEBRIEFS_FOR_WEAKNESS_PATTERN` | 5 | Guardrail: weakness heatmap (ADR-005) |
| `MIN_APPS_FOR_RESUME_COHORT` | 15 | Guardrail: resume cohort (ADR-006) |
| `MIN_APPS_FOR_SOURCE_CONVERSION` | 20 | Guardrail: source analytics (V2) |

**How to use:**
```javascript
const { STATUS_ENUM, ROUND_TYPE_ENUM } = require('../utils/constants');
// Use in Mongoose schema: enum: { values: STATUS_ENUM, message: '...' }
```

#### Planned files (not yet created):

| File | Purpose | Created in |
|---|---|---|
| `jwtUtils.js` | Token generation and cookie-setting helpers | Step 2.13 |

---

## Client Directory (`client/`) ⬜

The frontend. Does not exist yet — will be created around Step 2.19.

| What will go here | Purpose |
|---|---|
| `src/components/` | Reusable UI components (Button, Modal, Card, KanbanBoard, etc.) |
| `src/pages/` | Page-level components (Dashboard, Pipeline, Analytics, Settings) |
| `src/context/` | React Context providers (AuthContext for login state) |
| `src/hooks/` | Custom React hooks (useAuth, useApplications) |
| `src/services/` | API call functions (axios/fetch wrappers) |
| `src/utils/` | Frontend helper functions |
| `src/constants/` | Frontend enums and configuration |
| `src/App.jsx` | Root React component with routing |
| `src/main.jsx` | React app entry point (mounts App into the DOM) |
| `src/index.css` | Global styles and Tailwind directives |
| `tailwind.config.js` | Tailwind CSS configuration (colors, dark mode, etc.) |
| `vite.config.js` | Vite build tool configuration |
| `package.json` | Frontend dependencies & scripts |

---

## Docs Directory (`docs/`)

All project documentation. Organized by phase.

---

### `docs/Research_And_Documentation/` — Phase 0

| File | What It Contains | Created In |
|---|---|---|
| `RESEARCH.md` | Competitor analysis, user pain points, market gaps, evidence base | Step 0.4 |
| `PROJECT_MASTER_SPEC.md` | Complete product knowledge base — vision, personas, product loop, all decisions | Step 0.5 |
| `PRD.md` | Product Requirements Document — user stories, acceptance criteria for all 15 features | Step 0.6 |
| `DECISIONS.md` | Architecture Decision Records (ADRs) — every decision with rationale and alternatives considered | Step 0.7 |
| `PRODUCT_SPEC.md` | Feature specifications with detailed behavior descriptions | Step 0.3 |
| `PLAYBOOK.md` | Development playbook — workflows, processes, quality standards | Step 0.3 |

---

### `docs/Architecture/` — Phase 1

| File | What It Contains | Created In |
|---|---|---|
| `DATABASE_SCHEMA.md` | All 5 Mongoose schemas with field types, validations, indexes, relationships | Steps 1.1–1.5 |
| `API_SPEC.md` | Every API endpoint — URL, method, request body, response shape, error codes | Steps 1.6–1.9 |
| `UI_SPEC.md` | Page inventory, routing, component hierarchy, layout structure, design system | Steps 1.10–1.11 |
| `ANALYTICS_SPEC.md` | MongoDB aggregation pipelines, triage algorithm, guardrail logic | Steps 1.12–1.13 |
| `SECURITY.md` | Middleware chain order, rate limiting config, authentication flow, threat model | Step 1.14 |

---

### `docs/shared/` — Progress Tracking

| File | What It Contains | Updated |
|---|---|---|
| `TASKS.md` | Step-by-step implementation checklist (147 steps across 8 phases) | Every step |
| `PROJECT_PROGRESS.md` | At-a-glance progress dashboard — overall %, current step, recent completions | Every step |

---

## Root-Level Files

### `AGENTS.md` ✅

| Field | Detail |
|---|---|
| **What it is** | Rules and directives for AI coding agents working on this project |
| **Why it exists** | Ensures any AI agent entering the workspace follows the project's conventions, tech stack, security rules, and step-by-step workflow |
| **Key contents** | Tech stack (locked), product decisions (locked), coding standards, security rules, prohibited features, development phases |

---

### `README.md` ✅

| Field | Detail |
|---|---|
| **What it is** | The project's front page — what appears on GitHub when someone visits the repository |
| **Why it exists** | First thing anyone sees. Describes what JobCaliber is, how to run it, and what tech it uses. |

---

### `.gitignore` ✅

| Field | Detail |
|---|---|
| **What it is** | Tells Git which files and directories to NEVER track |
| **Why it exists** | Prevents secrets (`.env`), generated files (`node_modules/`), and OS junk (`.DS_Store`, `Thumbs.db`) from being committed |

**Key entries:**
```
node_modules/     ← installed packages (regenerated by npm install)
.env              ← secrets (each developer creates their own)
*.log             ← log files
.DS_Store         ← macOS junk
Thumbs.db         ← Windows junk
```

---

### `TECH_LEARNING.md` ✅

| Field | Detail |
|---|---|
| **What it is** | A redirect file pointing to the `tech-learning/` directory |
| **Why it exists** | Originally held all tech learning content. Now redirects to the organized directory structure. |

---

### `.git/` 🤖

| Field | Detail |
|---|---|
| **What it is** | Git's internal data directory — commit history, branches, config |
| **Why it exists** | Created by `git init`. Contains the entire version history of the project. |
| **Rules** | Never edit manually. Never delete (you'd lose all history). |

---

## How Everything Connects

```
When you run `npm run dev` (or `node server.js`):

1. Node.js executes server/server.js
2. server.js calls dotenv.config() → reads server/.env → populates process.env
3. server.js creates an Express app
4. (Future) server.js calls connectDB() → server/config/db.js → connects to MongoDB
5. (Future) server.js registers middleware (json, cors, cookies, helmet, etc.)
6. (Future) server.js mounts routes:
     /api/auth/*          → server/routes/authRoutes.js         → server/controllers/authController.js
     /api/applications/*  → server/routes/applicationRoutes.js  → server/controllers/applicationController.js
     /api/interviews/*    → server/routes/interviewRoutes.js    → server/controllers/interviewController.js
     /api/analytics/*     → server/routes/analyticsRoutes.js    → server/controllers/analyticsController.js
7. (Future) server.js registers error handler middleware (must be LAST)
8. server.js calls app.listen(5000) → server is ready!

When a request arrives:
  HTTP Request → middleware chain → route match → controller → Mongoose → MongoDB → response
```

```
When you run `npm run dev` in client/ (future):

1. Vite starts a dev server on port 5173
2. Vite serves the React app (src/main.jsx → src/App.jsx → pages & components)
3. React components call server/api/* endpoints using fetch/axios
4. Cookies (with JWT) are automatically sent with each request
5. The server authenticates the user and returns data
6. React updates the UI
```
