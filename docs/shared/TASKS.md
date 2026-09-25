<!-- 📌 WHAT IS THIS FILE? This is the development roadmap — a step-by-step checklist of every task needed to build JobCaliber from zero to MVP. Tasks are grouped into 8 phases and must be done in order. Each step has ONE clear objective. Check off steps as you complete them. -->

# JOBCALIBER — IMPLEMENTATION TASKS

> **Granular step-by-step execution plan for building JobCaliber.**  
> **Last Updated:** 2026-09-26  
> **Status:** Phase 0 Complete (11/11 steps) | Phase 1 in progress (2/15 steps)  
> **Total Steps:** 147  
> **Reference:** `docs/phase-0/PRD.md` for requirements, `docs/phase-0/DECISIONS.md` for rationale  
> **Progress Tracker:** `docs/shared/PROJECT_PROGRESS.md`

---

## How to Use This File

- Steps are grouped by **Phase** (sequential — don't skip phases)
- Within each phase, steps are **ordered** (do them in this sequence)
- **ONE STEP = ONE APPROVAL.** Complete a step, stop, wait for review.
- Status values: `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED` | `BLOCKED` | `SKIPPED`
- After each step: update this file + `PROJECT_PROGRESS.md`

---

## Phase 0: Research & Documentation

**Goal:** Research, validate, and document the product before writing any code.
**Status:** ✅ Complete (11/11 done)

### Step 0.1 — Product Discovery & Validation Research
- **Objective:** Research real-world job seeker pain points, competitors, and market gaps.
- **Why:** Every product decision must be backed by evidence, not assumptions.
- **Files:** Artifact: `product_discovery_research.md`
- **Prerequisites:** None
- **Expected Result:** Comprehensive research document covering competitors, pain points, and market gaps.
- **Verification:** Research document reviewed and approved by developer.
- **Learn/Review:** Product research methodology, evidence classification, competitor analysis frameworks.
- **Status:** `COMPLETED`

### Step 0.2 — Product Direction & Positioning
- **Objective:** Define the product vision, mission, target users, personas, and core product loop.
- **Why:** Turns raw research into product strategy — who we're building for and why.
- **Files:** Artifact: `product_direction.md`
- **Prerequisites:** Step 0.1
- **Expected Result:** Approved product direction with 3 personas, 7 principles, and locked decisions.
- **Verification:** Developer reviewed and approved the direction document.
- **Learn/Review:** How to write user personas, vision vs. feature list, product positioning.
- **Status:** `COMPLETED`

### Step 0.3 — Feature Specification & User Stories
- **Objective:** Write detailed specs for all 15 MVP features with acceptance criteria.
- **Why:** Without precise requirements, developers make assumptions. User stories define "done."
- **Files:** Artifact: `feature_specification.md`
- **Prerequisites:** Step 0.2
- **Expected Result:** 35 user stories with testable acceptance criteria across 15 features.
- **Verification:** Developer reviewed and approved all feature specifications.
- **Learn/Review:** User story format (As a / I want / So that), acceptance criteria, scope control.
- **Status:** `COMPLETED`

### Step 0.4 — Create docs/RESEARCH.md
- **Objective:** Formalize research into the project's permanent documentation.
- **Why:** Moving validated research from working artifact into the official project directory.
- **Files:** `docs/RESEARCH.md` (created)
- **Prerequisites:** Step 0.1 approved
- **Expected Result:** 13-section research document with evidence classifications.
- **Verification:** File exists in docs/ with correct content.
- **Learn/Review:** How to formalize working research into permanent project documentation.
- **Status:** `COMPLETED`

### Step 0.5 — Create PROJECT_MASTER_SPEC.md
- **Objective:** Create the comprehensive product knowledge base (65 sections).
- **Why:** Another developer should understand the entire product from this single file.
- **Files:** `docs/PROJECT_MASTER_SPEC.md` (created)
- **Prerequisites:** Steps 0.1–0.4
- **Expected Result:** 65-section master specification covering everything from vision to decisions.
- **Verification:** File exists with all sections.
- **Learn/Review:** How all pieces (research → direction → features → architecture) connect.
- **Status:** `COMPLETED`

### Step 0.6 — Create PRD.md
- **Objective:** Create the developer-facing Product Requirements Document.
- **Why:** The PRD is the builder's blueprint — focused on requirements, not research.
- **Files:** `docs/PRD.md` (created)
- **Prerequisites:** Steps 0.1–0.5
- **Expected Result:** 68 functional requirements with IDs, 35 user stories, acceptance criteria.
- **Verification:** All FR-01 through FR-15 requirements present with Must/Should priorities.
- **Learn/Review:** Difference between master spec (knowledge) and PRD (blueprint), requirement IDs.
- **Status:** `COMPLETED`

### Step 0.7 — Create DECISIONS.md
- **Objective:** Create the Architecture Decision Record log.
- **Why:** Records WHY decisions were made, not just what was decided.
- **Files:** `docs/DECISIONS.md` (created)
- **Prerequisites:** Steps 0.1–0.6
- **Expected Result:** 14 ADRs with context, options, decision, reason, and trade-offs.
- **Verification:** All 14 decisions present with traceable ADR numbers.
- **Learn/Review:** ADR format, documenting trade-offs, why "options NOT chosen" matters.
- **Status:** `COMPLETED`

### Step 0.8 — Rebuild AGENTS.md
- **Objective:** Replace the draft AGENTS.md with a validated version.
- **Why:** Agent instructions must reflect validated decisions, not pre-research assumptions.
- **Files:** `AGENTS.md` (overwritten)
- **Prerequisites:** Steps 0.1–0.7
- **Expected Result:** 16-section agent directive with ADR references.
- **Verification:** All 12 locked decisions present with correct ADR references.
- **Learn/Review:** How AGENTS.md serves as a contract for AI development partners.
- **Status:** `COMPLETED`

### Step 0.9 — Rebuild README.md
- **Objective:** Replace the draft README with a validated project overview.
- **Why:** README is the first thing anyone reads — must accurately reflect the product.
- **Files:** `README.md` (overwritten)
- **Prerequisites:** Steps 0.1–0.8
- **Expected Result:** Clean README with tech stack, setup instructions, and documentation links.
- **Verification:** All links point to correct file locations.
- **Learn/Review:** What makes a good project README for a portfolio project.
- **Status:** `COMPLETED`

### Step 0.10 — Create TASKS.md
- **Objective:** Create the implementation task breakdown (this file).
- **Why:** Developers need a roadmap, not just requirements.
- **Files:** `docs/TASKS.md` (created)
- **Prerequisites:** Steps 0.1–0.9
- **Expected Result:** Phased task breakdown covering all MVP features.
- **Verification:** All 15 features have corresponding tasks.
- **Learn/Review:** How to break a large product into phased, sequential tasks.
- **Status:** `COMPLETED`

### Step 0.11 — Granular task decomposition & project setup files
- **Objective:** Decompose the 8 high-level phases into atomic steps. Create PROJECT_PROGRESS.md and .gitignore.
- **Why:** Atomic steps enable the one-approval-per-step workflow. Progress file tracks state.
- **Files:** `docs/TASKS.md` (rewritten), `docs/PROJECT_PROGRESS.md` (created), `.gitignore` (created)
- **Prerequisites:** Step 0.10
- **Expected Result:** Each phase decomposed into small, meaningful, verifiable steps.
- **Verification:** Every step has one primary objective, verification method, and learning component.
- **Learn/Review:** Granular project planning, progress tracking methodology.
- **Status:** `COMPLETED`

---

## Phase 1: Architecture

**Goal:** Define the complete technical blueprint before writing any application code. No code is written in this phase — only specification documents.

### Step 1.1 — Define User collection schema
- **Objective:** Write the complete Mongoose schema definition for the `users` collection.
- **Why:** The User model is the foundation — auth, tenant isolation, and settings all depend on it.
- **Files:** `docs/phase-1/DATABASE_SCHEMA.md` (created — User section)
- **Prerequisites:** Phase 0 complete
- **Expected Result:** Field-by-field schema definition: field name, type, required, default, validation, index.
- **Verification:** Schema covers all FR-01 requirements (fullName, email, passwordHash, staleThresholdDays).
- **Learn/Review:** Mongoose schema design, field types, validation rules, indexing basics.
- **Status:** `COMPLETED`

### Step 1.2 — Define Application collection schema
- **Objective:** Write the complete Mongoose schema definition for the `applications` collection.
- **Why:** The most complex collection — 15+ fields, enum validation, computed virtuals, multiple indexes.
- **Files:** `docs/phase-1/DATABASE_SCHEMA.md` (updated — Application section)
- **Prerequisites:** Step 1.1
- **Expected Result:** Full schema with status enum, optional fields, timestamps, indexes for search/filter.
- **Verification:** Schema covers FR-02 through FR-06 requirements. All 7 statuses present in enum.
- **Learn/Review:** Mongoose enums, compound indexes, virtual fields, timestamps option.
- **Status:** `COMPLETED`

### Step 1.3 — Define InterviewRound collection schema
- **Objective:** Write the Mongoose schema for `interviewrounds` collection.
- **Why:** Links applications to their interview rounds. Tracks debrief completion status.
- **Files:** `docs/phase-1/DATABASE_SCHEMA.md` (updated — InterviewRound section)
- **Prerequisites:** Step 1.2
- **Expected Result:** Schema with roundType enum, scheduledDate, selfRating, debriefCompleted flag.
- **Verification:** Schema covers FR-07 and FR-08 requirements. roundType enum has all 5 types.
- **Learn/Review:** Mongoose ObjectId references, referential relationships between collections.
- **Status:** `NOT_STARTED`

### Step 1.4 — Define InterviewQuestion and ProblemLog schemas
- **Objective:** Write Mongoose schemas for `interviewquestions` and `problemlogs` collections.
- **Why:** These store the debrief output — questions asked and topics struggled with.
- **Files:** `docs/phase-1/DATABASE_SCHEMA.md` (updated — InterviewQuestion + ProblemLog sections)
- **Prerequisites:** Step 1.3
- **Expected Result:** Both schemas defined with correct references (roundId, userId).
- **Verification:** ProblemLog includes userId for direct aggregation queries (weakness heatmap).
- **Learn/Review:** Why ProblemLog has userId directly (denormalization for aggregation performance).
- **Status:** `NOT_STARTED`

### Step 1.5 — Define database relationships and index strategy
- **Objective:** Document the entity relationships and explain why each index exists.
- **Why:** Indexes determine query performance. Wrong indexes = slow analytics.
- **Files:** `docs/phase-1/DATABASE_SCHEMA.md` (updated — Relationships + Indexes section)
- **Prerequisites:** Steps 1.1–1.4
- **Expected Result:** ER diagram (text-based), compound index list with query justification.
- **Verification:** Every index maps to a specific query pattern (search, filter, aggregation).
- **Learn/Review:** MongoDB index strategy, compound indexes, how indexes speed up queries.
- **Status:** `NOT_STARTED`

### Step 1.6 — Define Auth API endpoints
- **Objective:** Specify the exact request/response contract for `/api/auth/*` endpoints.
- **Why:** API contracts prevent ambiguity during implementation — both sides agree on shapes.
- **Files:** `docs/phase-1/API_SPEC.md` (created — Auth section)
- **Prerequisites:** Step 1.1
- **Expected Result:** 4 endpoints fully specified: register, login, logout, me. Each with method, path, request body, response shape, error responses.
- **Verification:** Covers FR-01.1 through FR-01.7. Rate limit rules documented.
- **Learn/Review:** REST API design conventions, HTTP status codes, error response patterns.
- **Status:** `NOT_STARTED`

### Step 1.7 — Define Application CRUD API endpoints
- **Objective:** Specify the request/response contract for `/api/applications/*` endpoints.
- **Why:** The most complex API surface — create, list (with filters), get, update, status change, archive.
- **Files:** `docs/phase-1/API_SPEC.md` (updated — Applications section)
- **Prerequisites:** Steps 1.2, 1.6
- **Expected Result:** 6+ endpoints specified with query param filters, pagination, and duplicate detection.
- **Verification:** Covers FR-02, FR-03, FR-04, FR-05. Tenant isolation documented on every endpoint.
- **Learn/Review:** Query parameter design, pagination patterns, RESTful status update patterns.
- **Status:** `NOT_STARTED`

### Step 1.8 — Define Interview & Debrief API endpoints
- **Objective:** Specify the request/response contract for `/api/interviews/*` endpoints.
- **Why:** The debrief endpoint is the most complex single request — saves rating, questions, and problem logs in one call.
- **Files:** `docs/phase-1/API_SPEC.md` (updated — Interviews section)
- **Prerequisites:** Steps 1.3, 1.4
- **Expected Result:** 5+ endpoints: create round, get rounds, submit debrief, update debrief, upcoming.
- **Verification:** Debrief endpoint specifies the nested request body structure clearly.
- **Learn/Review:** Transactional API design (saving multiple related documents in one request).
- **Status:** `NOT_STARTED`

### Step 1.9 — Define Analytics API endpoints
- **Objective:** Specify the request/response contract for `/api/analytics/*` endpoints.
- **Why:** Analytics endpoints return aggregated data — their response shapes must be clearly defined for the frontend.
- **Files:** `docs/phase-1/API_SPEC.md` (updated — Analytics section)
- **Prerequisites:** Steps 1.2, 1.4
- **Expected Result:** 4 endpoints: funnel, weaknesses, resume-cohorts, triage. Response shapes include guardrail metadata.
- **Verification:** Triage endpoint priority rules documented. Guardrail thresholds included in response.
- **Learn/Review:** API design for aggregated data, including metadata alongside results.
- **Status:** `NOT_STARTED`

### Step 1.10 — Define page inventory and routing structure
- **Objective:** List every page in the app, its URL route, and whether it requires authentication.
- **Why:** Before building UI, we need to know how many pages exist and how they connect.
- **Files:** `docs/phase-1/UI_SPEC.md` (created — Pages section)
- **Prerequisites:** Steps 1.6–1.9
- **Expected Result:** Page list: Login, Register, Dashboard, Pipeline, Application Detail, Analytics, Settings.
- **Verification:** Every page maps to at least one feature from the PRD.
- **Learn/Review:** React Router route planning, protected vs. public routes.
- **Status:** `NOT_STARTED`

### Step 1.11 — Define component hierarchy and layout structure
- **Objective:** Define the shared layout (Navbar, Sidebar, Content area) and reusable component tree.
- **Why:** Component planning prevents ad-hoc duplication and ensures consistency.
- **Files:** `docs/phase-1/UI_SPEC.md` (updated — Components section)
- **Prerequisites:** Step 1.10
- **Expected Result:** Component tree: Layout → {Navbar, Sidebar, Content}. Reusable: Button, Modal, Card, Badge, etc.
- **Verification:** Quick-Add Modal, Debrief Modal, and Action Center widget identified as key components.
- **Learn/Review:** React component composition, layout patterns, reusability principles.
- **Status:** `NOT_STARTED`

### Step 1.12 — Define MongoDB aggregation pipelines for analytics
- **Objective:** Write the exact aggregation pipeline stages for funnel, weakness heatmap, and resume cohort.
- **Why:** Aggregation pipelines are the most complex backend logic — defining them upfront prevents guesswork.
- **Files:** `docs/phase-1/ANALYTICS_SPEC.md` (created)
- **Prerequisites:** Steps 1.2, 1.4, 1.5
- **Expected Result:** 3 pipeline definitions with $match, $group, $sort stages. Guardrail logic documented.
- **Verification:** Funnel counts match the 4 progression stages. Weakness pipeline groups by topicName.
- **Learn/Review:** MongoDB aggregation framework, $group, $match, $sort, $lookup operators.
- **Status:** `NOT_STARTED`

### Step 1.13 — Define Action Center triage logic
- **Objective:** Document the exact algorithm for computing the top 3 action items.
- **Why:** The Action Center has 4 trigger types with priority ordering — the logic must be unambiguous.
- **Files:** `docs/phase-1/ANALYTICS_SPEC.md` (updated — Triage section)
- **Prerequisites:** Steps 1.2, 1.3
- **Expected Result:** Priority algorithm: interview in 48h > pending debrief > stale app > recurring topic.
- **Verification:** Max 3 items. Dismiss/snooze behavior documented. Edge cases covered.
- **Learn/Review:** Priority queue logic, time-based trigger computation.
- **Status:** `NOT_STARTED`

### Step 1.14 — Define security architecture
- **Objective:** Document the middleware chain, validation rules, and rate limit configuration.
- **Why:** Security is non-negotiable. Every middleware, its order, and its purpose must be documented.
- **Files:** `docs/phase-1/SECURITY.md` (created)
- **Prerequisites:** Steps 1.6–1.9
- **Expected Result:** Middleware chain order, rate limit config, NoSQL sanitization config, tenant isolation pattern.
- **Verification:** Every API endpoint has documented auth requirement and validation rules.
- **Learn/Review:** Express middleware chain ordering, defense-in-depth, OWASP basics.
- **Status:** `NOT_STARTED`

### Step 1.15 — Architecture review & approval
- **Objective:** Developer reviews all 5 architecture documents before implementation begins.
- **Why:** Architecture errors found during implementation are 10x more expensive to fix.
- **Files:** Review: `docs/phase-1/DATABASE_SCHEMA.md`, `docs/phase-1/API_SPEC.md`, `docs/phase-1/UI_SPEC.md`, `docs/phase-1/ANALYTICS_SPEC.md`, `docs/phase-1/SECURITY.md`
- **Prerequisites:** Steps 1.1–1.14
- **Expected Result:** Developer approves all architecture documents.
- **Verification:** Explicit "approved" from developer for each document.
- **Learn/Review:** How to review technical architecture, what to look for in schemas and API contracts.
- **Status:** `NOT_STARTED`

---

## Phase 2: Foundation

**Goal:** Set up the project skeleton, database connection, and complete authentication system.

### Step 2.1 — Create server directory and initialize package.json
- **Objective:** Create the `server/` directory and initialize it with `npm init`.
- **Why:** The backend project needs a package.json before installing any dependencies.
- **Files:** `server/package.json` (created)
- **Prerequisites:** Phase 1 complete
- **Expected Result:** `server/` directory exists with a valid `package.json` (name: jobcaliber-server).
- **Verification:** `cd server && cat package.json` shows valid JSON.
- **Learn/Review:** npm init, package.json structure, semantic versioning.
- **Status:** `NOT_STARTED`

### Step 2.2 — Install server dependencies
- **Objective:** Install all approved backend packages.
- **Why:** Dependencies must be installed before writing any code that imports them.
- **Files:** `server/package.json` (updated), `server/package-lock.json` (created), `server/node_modules/` (created)
- **Prerequisites:** Step 2.1
- **Expected Result:** All 10 production dependencies installed: express, mongoose, bcryptjs, jsonwebtoken, cookie-parser, cors, dotenv, express-validator, express-mongo-sanitize, express-rate-limit, date-fns. Dev dependency: nodemon.
- **Verification:** `npm ls --depth=0` shows all packages. No extraneous packages.
- **Learn/Review:** npm install, production vs. dev dependencies, why each package is needed.
- **Status:** `NOT_STARTED`

### Step 2.3 — Create .env.example and .env files
- **Objective:** Create the environment variable template and local config.
- **Why:** Secrets must be in .env (gitignored). .env.example documents required variables.
- **Files:** `server/.env.example` (created), `server/.env` (created, gitignored)
- **Prerequisites:** Step 2.2
- **Expected Result:** .env.example has: NODE_ENV, PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRE. .env has actual values.
- **Verification:** .env.example has no real secrets. .env has working local values.
- **Learn/Review:** Environment variables, why secrets must never be committed, .env patterns.
- **Status:** `NOT_STARTED`

### Step 2.4 — Create Express application entry point
- **Objective:** Create `server/server.js` with basic Express setup (listening on PORT).
- **Why:** The entry point must exist before adding middleware or routes.
- **Files:** `server/server.js` (created)
- **Prerequisites:** Step 2.2
- **Expected Result:** Express app that starts and logs "Server running on port 5000."
- **Verification:** Run `node server.js` — see the startup log message. No errors.
- **Learn/Review:** Express app creation, app.listen(), process.env usage.
- **Status:** `NOT_STARTED`

### Step 2.5 — Configure Express middleware
- **Objective:** Add JSON parsing, CORS, and cookie-parser middleware to the Express app.
- **Why:** These middleware are required before any route can receive or respond to requests.
- **Files:** `server/server.js` (modified)
- **Prerequisites:** Step 2.4
- **Expected Result:** Express app has: express.json(), cors({ credentials: true }), cookieParser().
- **Verification:** Send a POST request with JSON body — server parses it without error.
- **Learn/Review:** Express middleware concept, middleware ordering, CORS basics, what cookie-parser does.
- **Status:** `NOT_STARTED`

### Step 2.6 — Create MongoDB connection module
- **Objective:** Create `server/config/db.js` with Mongoose connection logic.
- **Why:** Database connection is separated from server.js for clean architecture.
- **Files:** `server/config/db.js` (created)
- **Prerequisites:** Step 2.3
- **Expected Result:** Module exports a `connectDB` function that connects to MONGO_URI with error handling.
- **Verification:** Code review — connection function uses try/catch, logs success/failure.
- **Learn/Review:** Mongoose.connect(), connection options, async/await, graceful error handling.
- **Status:** `NOT_STARTED`

### Step 2.7 — Connect the application to MongoDB
- **Objective:** Call `connectDB()` from `server.js` and verify database connection.
- **Why:** The server should connect to the database before accepting requests.
- **Files:** `server/server.js` (modified)
- **Prerequisites:** Steps 2.4, 2.6
- **Expected Result:** Server starts, connects to MongoDB, logs "MongoDB Connected: [host]".
- **Verification:** Run `node server.js` with a valid MONGO_URI — see both server and DB connection logs.
- **Learn/Review:** Async startup patterns, connecting to MongoDB Atlas vs. local MongoDB.
- **Status:** `NOT_STARTED`

### Step 2.8 — Create global error handler middleware
- **Objective:** Create `server/middleware/errorHandler.js` — centralized error response formatting.
- **Why:** Without a global error handler, unhandled errors crash the server or leak stack traces.
- **Files:** `server/middleware/errorHandler.js` (created), `server/server.js` (modified)
- **Prerequisites:** Step 2.5
- **Expected Result:** Middleware catches errors and returns consistent JSON: { success: false, message, stack (dev only) }.
- **Verification:** Throw an error in a test route — error handler returns formatted JSON, not raw stack.
- **Learn/Review:** Express error-handling middleware (4 params), NODE_ENV conditional logic.
- **Status:** `NOT_STARTED`

### Step 2.9 — Create server constants file
- **Objective:** Create `server/utils/constants.js` with all enum values.
- **Why:** Enums must be defined once and shared — no hardcoded strings anywhere.
- **Files:** `server/utils/constants.js` (created)
- **Prerequisites:** None (can be done anytime)
- **Expected Result:** Exports: STATUS_ENUM, ROUND_TYPE_ENUM, WORK_MODE_ENUM, SOURCE_ENUM, MAX_ACTION_CENTER_ITEMS, DEFAULT_STALE_THRESHOLD_DAYS.
- **Verification:** Code review — all 7 pipeline statuses present. All 5 round types present.
- **Learn/Review:** Named constants vs. magic strings, freezing objects with Object.freeze().
- **Status:** `NOT_STARTED`

### Step 2.10 — Create User Mongoose schema
- **Objective:** Create `server/models/User.js` with the schema definition (no hooks yet).
- **Why:** The schema defines the shape of user documents — fields, types, validation.
- **Files:** `server/models/User.js` (created)
- **Prerequisites:** Step 2.9
- **Expected Result:** Schema with: fullName (required), email (unique, lowercase), password (required, minlength 8, select:false), staleThresholdDays (default 14, min 7, max 45), targetRole, timestamps.
- **Verification:** Code review — all fields match DATABASE_SCHEMA.md. Password has select:false.
- **Learn/Review:** Mongoose Schema constructor, field options (required, unique, default, select), timestamps.
- **Status:** `NOT_STARTED`

### Step 2.11 — Add password hashing pre-save hook to User model
- **Objective:** Add a Mongoose pre-save middleware that hashes the password with bcrypt.
- **Why:** Passwords must be hashed before storage — this hook ensures it happens automatically.
- **Files:** `server/models/User.js` (modified)
- **Prerequisites:** Step 2.10
- **Expected Result:** Pre-save hook: if password is modified, hash it with bcrypt (salt rounds = 12).
- **Verification:** Code review — hook checks `this.isModified('password')`, uses await bcrypt.hash().
- **Learn/Review:** Mongoose pre-save middleware, bcrypt hashing, salt rounds, why 12 rounds.
- **Status:** `NOT_STARTED`

### Step 2.12 — Add password comparison method to User model
- **Objective:** Add a `matchPassword` instance method to the User schema.
- **Why:** Login needs to compare plaintext input against stored hash — this method encapsulates it.
- **Files:** `server/models/User.js` (modified)
- **Prerequisites:** Step 2.11
- **Expected Result:** Method: `userSchema.methods.matchPassword = async function(enteredPassword)` using bcrypt.compare().
- **Verification:** Code review — method returns boolean, uses await.
- **Learn/Review:** Mongoose instance methods, bcrypt.compare(), why timing-safe comparison matters.
- **Status:** `NOT_STARTED`

### Step 2.13 — Create JWT utility functions
- **Objective:** Create `server/utils/jwtUtils.js` with token generation and cookie-setting helpers.
- **Why:** JWT logic is reused across register, login, and middleware — extract into a utility.
- **Files:** `server/utils/jwtUtils.js` (created)
- **Prerequisites:** Step 2.3
- **Expected Result:** Two functions: `generateToken(userId)` and `sendTokenResponse(user, statusCode, res)`. Token uses JWT_SECRET and JWT_EXPIRE from env.
- **Verification:** Code review — HttpOnly cookie options: httpOnly=true, sameSite='Lax', secure=(NODE_ENV==='production').
- **Learn/Review:** JWT structure (header.payload.signature), jwt.sign() options, cookie options.
- **Status:** `NOT_STARTED`

### Step 2.14 — Create auth route file
- **Objective:** Create `server/routes/authRoutes.js` with route stubs.
- **Why:** Routes must exist before controllers can be connected — this creates the wiring.
- **Files:** `server/routes/authRoutes.js` (created), `server/server.js` (modified to mount routes)
- **Prerequisites:** Step 2.5
- **Expected Result:** 4 route stubs: POST /register, POST /login, POST /logout, GET /me. Mounted at /api/auth.
- **Verification:** Server starts without errors. Routes are mounted (visible in startup log or test request).
- **Learn/Review:** Express Router, route mounting with app.use(), RESTful route naming.
- **Status:** `NOT_STARTED`

### Step 2.15 — Create registration controller
- **Objective:** Implement `POST /api/auth/register` — validate, create user, return JWT cookie.
- **Why:** Registration is the entry point for new users — it creates the account and logs them in.
- **Files:** `server/controllers/authController.js` (created), `server/routes/authRoutes.js` (connected)
- **Prerequisites:** Steps 2.10–2.14
- **Expected Result:** Validates fullName/email/password, checks duplicate email, creates user, sends JWT cookie.
- **Verification:** curl POST with valid data → 201 + Set-Cookie header. Duplicate email → 400 error.
- **Learn/Review:** Express request handling, Mongoose create(), response status codes, Set-Cookie.
- **Status:** `NOT_STARTED`

### Step 2.16 — Add input validation to registration
- **Objective:** Add express-validator rules to the register endpoint.
- **Why:** Server-side validation prevents bad data — frontend validation is for UX only.
- **Files:** `server/middleware/validators.js` (created), `server/routes/authRoutes.js` (modified)
- **Prerequisites:** Step 2.15
- **Expected Result:** Validation: email is valid format, password ≥ 8 chars, fullName is not empty. Errors return 400 with field-level messages.
- **Verification:** curl with invalid email → 400 + specific error. Empty password → 400 + specific error.
- **Learn/Review:** express-validator (body, validationResult), middleware chaining, field-level errors.
- **Status:** `NOT_STARTED`

### Step 2.17 — Create login controller
- **Objective:** Implement `POST /api/auth/login` — validate, compare password, return JWT cookie.
- **Why:** Returning users need to authenticate with their existing credentials.
- **Files:** `server/controllers/authController.js` (modified)
- **Prerequisites:** Step 2.15
- **Expected Result:** Validates email/password, finds user (including password), compares hash, sends JWT cookie.
- **Verification:** curl with valid credentials → 200 + cookie. Wrong password → 401 "Invalid email or password."
- **Learn/Review:** User.findOne().select('+password'), why error doesn't reveal which field is wrong.
- **Status:** `NOT_STARTED`

### Step 2.18 — Create logout controller
- **Objective:** Implement `POST /api/auth/logout` — clear the auth cookie.
- **Why:** Users need to securely terminate their session.
- **Files:** `server/controllers/authController.js` (modified)
- **Prerequisites:** Step 2.14
- **Expected Result:** Clears the JWT cookie by setting it to empty string with immediate expiry.
- **Verification:** curl POST to /logout → 200 + cookie cleared.
- **Learn/Review:** res.cookie() with expires: new Date(0), how cookie clearing works.
- **Status:** `NOT_STARTED`

### Step 2.19 — Create auth protection middleware
- **Objective:** Create `server/middleware/auth.js` — extract JWT from cookie, verify, attach req.user.
- **Why:** Protected routes need to identify the authenticated user — this middleware does that.
- **Files:** `server/middleware/auth.js` (created)
- **Prerequisites:** Step 2.13
- **Expected Result:** Middleware reads cookie, verifies JWT, fetches user from DB, attaches to req.user. Returns 401 if no token or invalid.
- **Verification:** Request without cookie → 401. Request with valid cookie → req.user populated.
- **Learn/Review:** jwt.verify(), req.cookies, middleware next() pattern, 401 vs. 403.
- **Status:** `NOT_STARTED`

### Step 2.20 — Create "Get Me" controller
- **Objective:** Implement `GET /api/auth/me` — return current authenticated user's profile.
- **Why:** Frontend needs to check if the user is logged in and get their profile data.
- **Files:** `server/controllers/authController.js` (modified), `server/routes/authRoutes.js` (add protect middleware)
- **Prerequisites:** Step 2.19
- **Expected Result:** Protected endpoint returns user data (excluding password).
- **Verification:** curl with valid cookie → 200 + user JSON. Without cookie → 401.
- **Learn/Review:** Using protect middleware on specific routes, response shaping (excluding sensitive fields).
- **Status:** `NOT_STARTED`

### Step 2.21 — Add security middleware
- **Objective:** Add express-mongo-sanitize and express-rate-limit to the Express app.
- **Why:** NoSQL injection prevention and brute-force protection are non-negotiable.
- **Files:** `server/server.js` (modified)
- **Prerequisites:** Step 2.5
- **Expected Result:** mongoSanitize() applied globally. Rate limiter on /api/auth routes: 10 requests per 15 min.
- **Verification:** Code review — middleware ordering is correct (sanitize before routes, rate limit on auth).
- **Learn/Review:** NoSQL injection attacks ($gt, $ne), how rate limiting works, middleware ordering.
- **Status:** `NOT_STARTED`

### Step 2.22 — Test all auth endpoints
- **Objective:** Verify register, login, logout, and me endpoints work correctly together.
- **Why:** Auth must be bulletproof before building anything on top of it.
- **Files:** No new files. Testing existing endpoints.
- **Prerequisites:** Steps 2.15–2.21
- **Expected Result:** Full flow works: register → auto-login → me returns user → logout → me returns 401.
- **Verification:** curl sequence: register (201) → me (200) → logout (200) → me (401). Duplicate email (400). Wrong password (401).
- **Learn/Review:** API testing with curl, cookie handling in curl (-b, -c flags), testing error cases.
- **Status:** `NOT_STARTED`

### Step 2.23 — Create client directory with Vite + React
- **Objective:** Scaffold the React app using Vite in the `client/` directory.
- **Why:** The frontend project needs to be initialized with the correct build tooling.
- **Files:** `client/` directory (created with Vite scaffold)
- **Prerequisites:** None (independent of backend)
- **Expected Result:** `client/` contains: package.json, vite.config.js, src/App.jsx, src/main.jsx, index.html.
- **Verification:** `cd client && npm run dev` starts the Vite dev server.
- **Learn/Review:** Vite project creation, how Vite differs from CRA, HMR (Hot Module Replacement).
- **Status:** `NOT_STARTED`

### Step 2.24 — Install client dependencies
- **Objective:** Install all approved frontend packages.
- **Why:** React Router, Tailwind, and other dependencies must be available before building UI.
- **Files:** `client/package.json` (updated)
- **Prerequisites:** Step 2.23
- **Expected Result:** Installed: react-router-dom, axios, recharts, @hello-pangea/dnd, date-fns. Dev: tailwindcss, postcss, autoprefixer.
- **Verification:** `npm ls --depth=0` shows all packages.
- **Learn/Review:** Client-side dependencies vs. server-side, why Tailwind is a dev dependency.
- **Status:** `NOT_STARTED`

### Step 2.25 — Configure Tailwind CSS
- **Objective:** Set up Tailwind CSS with dark mode, custom colors, and base styles.
- **Why:** Tailwind must be configured before any UI component can use utility classes.
- **Files:** `client/tailwind.config.js` (created/modified), `client/postcss.config.js` (created), `client/src/index.css` (modified)
- **Prerequisites:** Step 2.24
- **Expected Result:** Tailwind directives in index.css (@tailwind base/components/utilities). Dark mode: 'class'. Custom color palette defined.
- **Verification:** Add `className="text-blue-500 dark:text-blue-300"` to App.jsx — styling applies.
- **Learn/Review:** Tailwind configuration, dark mode strategy, @apply directive, PostCSS pipeline.
- **Status:** `NOT_STARTED`

### Step 2.26 — Configure Vite proxy for API requests
- **Objective:** Set up Vite dev server proxy to forward `/api/*` requests to the Express backend.
- **Why:** Without a proxy, the frontend can't reach the backend during development (different ports).
- **Files:** `client/vite.config.js` (modified)
- **Prerequisites:** Step 2.23
- **Expected Result:** Requests to `/api/*` are proxied to `http://localhost:5000`.
- **Verification:** Frontend fetch to `/api/auth/me` reaches the Express server (check server logs).
- **Learn/Review:** Dev server proxy, why it's needed (same-origin policy), vite.config.js server option.
- **Status:** `NOT_STARTED`

### Step 2.27 — Create API service layer
- **Objective:** Create `client/src/services/api.js` — centralized HTTP client with credentials.
- **Why:** All API calls should go through one configured client, not scattered fetch() calls.
- **Files:** `client/src/services/api.js` (created)
- **Prerequisites:** Step 2.26
- **Expected Result:** Axios instance with baseURL, withCredentials: true, and response error interceptor.
- **Verification:** Code review — credentials enabled (for cookies), 401 errors handled.
- **Learn/Review:** Axios instances, withCredentials for cookies, interceptors, centralized error handling.
- **Status:** `NOT_STARTED`

### Step 2.28 — Create AuthContext provider
- **Objective:** Create `client/src/context/AuthContext.jsx` with login, register, logout, and user state.
- **Why:** Auth state must be accessible throughout the app — Context provides this.
- **Files:** `client/src/context/AuthContext.jsx` (created)
- **Prerequisites:** Step 2.27
- **Expected Result:** Context provides: user, loading, login(), register(), logout(), checkAuth(). Wraps app in provider.
- **Verification:** Code review — checkAuth() calls /api/auth/me on mount.
- **Learn/Review:** React Context API, createContext, useContext, Provider pattern, useEffect for auth check.
- **Status:** `NOT_STARTED`

### Step 2.29 — Create Login page
- **Objective:** Build the Login page component with email/password form.
- **Why:** Users need a way to log into the application.
- **Files:** `client/src/pages/LoginPage.jsx` (created)
- **Prerequisites:** Steps 2.25, 2.28
- **Expected Result:** Dark-themed login form with email + password inputs, submit button, link to register page. Calls AuthContext.login() on submit.
- **Verification:** Form renders. Tailwind dark mode styling applies. Form submits to the API.
- **Learn/Review:** Controlled form inputs in React (useState), form submission handling, basic Tailwind form styling.
- **Status:** `NOT_STARTED`

### Step 2.30 — Create Register page
- **Objective:** Build the Register page component with name/email/password form.
- **Why:** New users need to create an account.
- **Files:** `client/src/pages/RegisterPage.jsx` (created)
- **Prerequisites:** Step 2.29 (similar pattern)
- **Expected Result:** Registration form with fullName + email + password + confirm password. Client-side validation. Calls AuthContext.register().
- **Verification:** Form renders. Password mismatch shows error. Successful register redirects to dashboard.
- **Learn/Review:** Client-side form validation, password confirmation pattern, navigation after auth.
- **Status:** `NOT_STARTED`

### Step 2.31 — Create ProtectedRoute component
- **Objective:** Create a route wrapper that redirects unauthenticated users to login.
- **Why:** Dashboard, Pipeline, and other pages must only be accessible when logged in.
- **Files:** `client/src/components/common/ProtectedRoute.jsx` (created)
- **Prerequisites:** Step 2.28
- **Expected Result:** Component checks AuthContext.user — if null, redirects to /login. Otherwise renders children.
- **Verification:** Navigate to /dashboard without login → redirected to /login. With login → page renders.
- **Learn/Review:** React Router Navigate component, conditional rendering, auth guard pattern.
- **Status:** `NOT_STARTED`

### Step 2.32 — Set up React Router with route definitions
- **Objective:** Configure React Router in App.jsx with all page routes.
- **Why:** The app needs client-side routing to navigate between pages.
- **Files:** `client/src/App.jsx` (modified)
- **Prerequisites:** Steps 2.29–2.31
- **Expected Result:** Routes: /login, /register (public). /dashboard, /pipeline, /analytics, /settings (protected). Wrapped in AuthProvider.
- **Verification:** Navigate between login and register. Protected routes redirect when not logged in.
- **Learn/Review:** React Router v6 (BrowserRouter, Routes, Route), nested routes, route organization.
- **Status:** `NOT_STARTED`

### Step 2.33 — Create application layout shell
- **Objective:** Create the shared layout component with Navbar and main content area.
- **Why:** All authenticated pages share the same Navbar and layout structure.
- **Files:** `client/src/components/layout/Layout.jsx` (created), `client/src/components/layout/Navbar.jsx` (created)
- **Prerequisites:** Steps 2.25, 2.28
- **Expected Result:** Layout with dark sidebar/navbar, navigation links, user name display, logout button. Content area renders child pages.
- **Verification:** Login → see Navbar with links and logout button. Click logout → redirected to login.
- **Learn/Review:** React layout patterns, Outlet component, component composition, responsive Navbar.
- **Status:** `NOT_STARTED`

### Step 2.34 — Create placeholder Dashboard page
- **Objective:** Create a basic Dashboard page that shows "Welcome, [name]" and placeholder content.
- **Why:** Users need a landing page after login — even a placeholder confirms the full auth flow works.
- **Files:** `client/src/pages/DashboardPage.jsx` (created)
- **Prerequisites:** Steps 2.32, 2.33
- **Expected Result:** Page shows user's name from AuthContext. Layout wraps it with Navbar.
- **Verification:** Login → see "Welcome, [name]" on Dashboard page with working Navbar.
- **Learn/Review:** Using AuthContext in page components, useContext hook.
- **Status:** `NOT_STARTED`

### Step 2.35 — End-to-end auth flow test
- **Objective:** Test the complete authentication flow: register → login → dashboard → logout.
- **Why:** Everything built in Phase 2 must work together before moving forward.
- **Files:** No new files. Testing existing code.
- **Prerequisites:** Steps 2.22, 2.34
- **Expected Result:** Register (new user) → auto-redirect to Dashboard → see name → Logout → redirect to Login → Login (existing user) → Dashboard → verify.
- **Verification:** Complete the flow in the browser. Check for: cookie set, cookie cleared, protected routes work, error messages display.
- **Learn/Review:** End-to-end testing, how frontend and backend communicate, cookie flow in the browser.
- **Status:** `NOT_STARTED`

### Step 2.36 — Git initialization and first commit
- **Objective:** Initialize Git repository and make the first commit with all documentation + foundation code.
- **Why:** Version control should start with the first working code — not retroactively.
- **Files:** `.git/` (created), all existing files committed
- **Prerequisites:** Step 2.35
- **Expected Result:** Git repo initialized. First commit includes: docs/, AGENTS.md, README.md, .gitignore, client/, server/. Excludes: node_modules/, .env.
- **Verification:** `git log` shows first commit. `git status` shows clean working tree. .env is NOT in the commit.
- **Learn/Review:** git init, git add, git commit, .gitignore enforcement, meaningful commit messages.
- **Status:** `NOT_STARTED`

---

## Phase 3: Core Data

**Goal:** Application model, Quick-Add, and pipeline views (Kanban + Table).

### Step 3.1 — Create Application Mongoose schema
- **Objective:** Create `server/models/Application.js` with the full schema definition.
- **Why:** The Application model is the central data entity — everything connects to it.
- **Files:** `server/models/Application.js` (created)
- **Prerequisites:** Phase 2 complete, Step 2.9 (constants)
- **Expected Result:** Schema with all fields from DATABASE_SCHEMA.md: companyName, roleTitle, status (enum), jobUrl, location, workMode, salaryRange, fullJobDescription, source, resumeVersionTag, appliedDate, notes, lastStatusUpdate, isStale, isArchived, userId (ref). Timestamps enabled.
- **Verification:** Code review — status enum uses STATUS_ENUM constant. userId is required. All optional fields have no required:true.
- **Learn/Review:** Complex Mongoose schemas, enum validation, ObjectId references, field defaults.
- **Status:** `NOT_STARTED`

### Step 3.2 — Add Application schema indexes
- **Objective:** Add compound indexes to the Application schema for query performance.
- **Why:** Without indexes, list/search/filter queries will be slow at scale.
- **Files:** `server/models/Application.js` (modified)
- **Prerequisites:** Step 3.1
- **Expected Result:** Indexes: { userId, status }, { userId, companyName, roleTitle } (duplicate detection), { userId, appliedDate }.
- **Verification:** Code review — index definitions match DATABASE_SCHEMA.md.
- **Learn/Review:** Mongoose schema.index(), compound indexes, why userId is always the first field.
- **Status:** `NOT_STARTED`

### Step 3.3 — Add stale calculation helper to Application model
- **Objective:** Add a static method or utility function that computes isStale for an application.
- **Why:** Stale calculation is reused in list and status-update operations — extract once.
- **Files:** `server/models/Application.js` (modified) or `server/utils/staleUtils.js` (created)
- **Prerequisites:** Steps 3.1, 2.9
- **Expected Result:** Function takes an application and user's staleThresholdDays, returns boolean. Only applies to "Applied" and "OA / Screening" statuses.
- **Verification:** Code review — correctly checks status, calculates day difference using date-fns, returns boolean.
- **Learn/Review:** date-fns differenceInDays(), static methods vs. utility functions, business logic extraction.
- **Status:** `NOT_STARTED`

### Step 3.4 — Create application routes file
- **Objective:** Create `server/routes/applicationRoutes.js` with route stubs.
- **Why:** Routes must be defined and mounted before controllers can be tested.
- **Files:** `server/routes/applicationRoutes.js` (created), `server/server.js` (modified to mount)
- **Prerequisites:** Step 2.14 (pattern established)
- **Expected Result:** Route stubs for: POST /, GET /, GET /:id, PUT /:id, PATCH /:id/status, PATCH /:id/archive. All protected with auth middleware. Mounted at /api/applications.
- **Verification:** Server starts without errors. Routes are mounted.
- **Learn/Review:** Router pattern reuse, applying protect middleware to all routes in a group.
- **Status:** `NOT_STARTED`

### Step 3.5 — Create application controller: Create endpoint
- **Objective:** Implement `POST /api/applications` — validate, check duplicates, create application.
- **Why:** The Quick-Add feature depends on this endpoint.
- **Files:** `server/controllers/applicationController.js` (created)
- **Prerequisites:** Steps 3.1, 3.4, 2.16 (validation pattern)
- **Expected Result:** Validates companyName + roleTitle (required). Checks for duplicate within 60 days (case-insensitive). Creates with userId from req.user. Returns 201 + application.
- **Verification:** curl: create (201), duplicate warning (200 with warning flag), missing fields (400).
- **Learn/Review:** Mongoose findOne for duplicate check, case-insensitive regex, default field values.
- **Status:** `NOT_STARTED`

### Step 3.6 — Create application controller: List endpoint with search
- **Objective:** Implement `GET /api/applications` — tenant-scoped list with text search.
- **Why:** The Kanban and Table views both fetch from this endpoint.
- **Files:** `server/controllers/applicationController.js` (modified)
- **Prerequisites:** Step 3.5
- **Expected Result:** Returns all applications for userId. Supports ?search= query param (partial match on companyName/roleTitle). Excludes archived by default.
- **Verification:** curl: list all (200), search "Google" (returns matching), search "xyz" (returns empty array).
- **Learn/Review:** Mongoose find() with query filters, regex search, tenant isolation pattern.
- **Status:** `NOT_STARTED`

### Step 3.7 — Add filtering to List endpoint
- **Objective:** Add status, date range, and stale filters to the list endpoint.
- **Why:** Users need to narrow down 100+ applications by status, date, and stale flag.
- **Files:** `server/controllers/applicationController.js` (modified)
- **Prerequisites:** Step 3.6
- **Expected Result:** Supports: ?status=Applied,Interviewing (multi), ?dateFrom=&dateTo= (range), ?staleOnly=true. Filters combine with AND.
- **Verification:** curl: filter by status (returns subset), filter by date range (returns subset), combine filters.
- **Learn/Review:** Building dynamic MongoDB query objects, query parameter parsing, AND filter composition.
- **Status:** `NOT_STARTED`

### Step 3.8 — Add stale recalculation to List endpoint
- **Objective:** Recalculate isStale for each application before returning the list.
- **Why:** Stale status changes with time — must be recalculated on every read.
- **Files:** `server/controllers/applicationController.js` (modified)
- **Prerequisites:** Steps 3.3, 3.6
- **Expected Result:** Before returning, each application's isStale is recomputed. If changed, updated in DB.
- **Verification:** Create an app, manually set lastStatusUpdate to 15 days ago, fetch list — isStale=true.
- **Learn/Review:** On-read recalculation pattern, bulk update considerations, Model.updateMany().
- **Status:** `NOT_STARTED`

### Step 3.9 — Create application controller: Get One endpoint
- **Objective:** Implement `GET /api/applications/:id` — fetch single application with full details.
- **Why:** The Application Detail page needs to fetch one application by ID.
- **Files:** `server/controllers/applicationController.js` (modified)
- **Prerequisites:** Step 3.5
- **Expected Result:** Returns the application if it belongs to the authenticated user. Returns 404 if not found or wrong user.
- **Verification:** curl: get by valid ID (200), wrong user's ID (404), invalid ID format (400).
- **Learn/Review:** Mongoose findById(), tenant isolation on single-document queries, ObjectId validation.
- **Status:** `NOT_STARTED`

### Step 3.10 — Create application controller: Update endpoint
- **Objective:** Implement `PUT /api/applications/:id` — update application fields.
- **Why:** Users need to edit application details (add JD, change notes, etc.).
- **Files:** `server/controllers/applicationController.js` (modified)
- **Prerequisites:** Step 3.9
- **Expected Result:** Updates only allowed fields (not status — that has its own endpoint). Tenant-scoped.
- **Verification:** curl: update roleTitle (200), attempt to update userId (ignored/rejected).
- **Learn/Review:** Mongoose findByIdAndUpdate(), { new: true, runValidators: true } options, field whitelisting.
- **Status:** `NOT_STARTED`

### Step 3.11 — Create application controller: Update Status endpoint
- **Objective:** Implement `PATCH /api/applications/:id/status` — update status and recalculate stale.
- **Why:** Drag-and-drop on Kanban and inline dropdown on Table both call this endpoint.
- **Files:** `server/controllers/applicationController.js` (modified)
- **Prerequisites:** Steps 3.3, 3.9
- **Expected Result:** Updates status (validated against enum), sets lastStatusUpdate to now, recalculates isStale.
- **Verification:** curl: change status to "Interviewing" (200), invalid status "FinalRound" (400).
- **Learn/Review:** PATCH vs. PUT semantics, enum validation, timestamp updates.
- **Status:** `NOT_STARTED`

### Step 3.12 — Create application controller: Archive endpoint
- **Objective:** Implement `PATCH /api/applications/:id/archive` — set isArchived = true.
- **Why:** Stale applications can be archived to declutter the pipeline view.
- **Files:** `server/controllers/applicationController.js` (modified)
- **Prerequisites:** Step 3.9
- **Expected Result:** Sets isArchived = true. Archived apps excluded from default list query.
- **Verification:** curl: archive (200) → list (archived app not shown) → list with ?includeArchived=true (shown).
- **Learn/Review:** Soft delete pattern (archive vs. hard delete), default query filters.
- **Status:** `NOT_STARTED`

### Step 3.13 — Test all application CRUD endpoints
- **Objective:** Verify the complete application API works end-to-end.
- **Why:** All CRUD operations must work correctly before building the frontend views.
- **Files:** No new files.
- **Prerequisites:** Steps 3.5–3.12
- **Expected Result:** Full CRUD flow: create (with duplicate check) → list (with search + filter + stale) → get → update → status change → archive.
- **Verification:** curl sequence covering all endpoints. Test tenant isolation (user A can't see user B's data).
- **Learn/Review:** API testing methodology, testing error cases and edge cases.
- **Status:** `NOT_STARTED`

### Step 3.14 — Create client-side constants file
- **Objective:** Create `client/src/constants/enums.js` mirroring server-side enums.
- **Why:** Frontend needs the same enum values for rendering status options, dropdowns, etc.
- **Files:** `client/src/constants/enums.js` (created)
- **Prerequisites:** Step 2.9 (server constants exist)
- **Expected Result:** Exports: STATUS_ENUM, STATUS_OPTIONS (for dropdowns), ROUND_TYPE_OPTIONS, WORK_MODE_OPTIONS, SOURCE_OPTIONS.
- **Verification:** Code review — values match server-side constants exactly.
- **Learn/Review:** Keeping client and server in sync, DRY principle across the stack.
- **Status:** `NOT_STARTED`

### Step 3.15 — Create ApplicationContext provider
- **Objective:** Create context for managing application state (list, create, update, filter).
- **Why:** Multiple components (Kanban, Table, Quick-Add) need shared access to application data.
- **Files:** `client/src/context/ApplicationContext.jsx` (created)
- **Prerequisites:** Steps 2.27, 2.28
- **Expected Result:** Context provides: applications[], loading, fetchApplications(), createApplication(), updateStatus(), filters.
- **Verification:** Code review — all API calls go through the api service layer with proper error handling.
- **Learn/Review:** Complex Context with useReducer, managing list state, optimistic vs. pessimistic updates.
- **Status:** `NOT_STARTED`

### Step 3.16 — Build Quick-Add modal: basic form (2 fields)
- **Objective:** Create the Quick-Add modal with only the 2 mandatory fields.
- **Why:** This is the MVP of the MVP — the most critical UI for tracker survival.
- **Files:** `client/src/components/applications/QuickAddModal.jsx` (created)
- **Prerequisites:** Steps 2.25, 3.15
- **Expected Result:** Modal with companyName + roleTitle inputs. Submit creates application via context. Closes on success.
- **Verification:** Open modal → type "Google" + "SDE Intern" → submit → application appears in state.
- **Learn/Review:** React modal pattern, controlled inputs, form submission, calling context methods.
- **Status:** `NOT_STARTED`

### Step 3.17 — Add "More Details" expandable section to Quick-Add
- **Objective:** Add the collapsible section with all optional fields.
- **Why:** Progressive disclosure — users CAN add detail, but aren't forced to.
- **Files:** `client/src/components/applications/QuickAddModal.jsx` (modified)
- **Prerequisites:** Step 3.16
- **Expected Result:** Collapsed by default. Expands to show: jobUrl, location, workMode, salaryRange, fullJobDescription, source, resumeVersionTag, appliedDate, notes.
- **Verification:** Click "Add More Details" → fields appear. Collapse → fields stay filled. Submit with partial fields works.
- **Learn/Review:** Collapsible UI pattern, managing many form fields, select/dropdown components.
- **Status:** `NOT_STARTED`

### Step 3.18 — Add duplicate detection warning to Quick-Add
- **Objective:** Show a warning when the API detects a duplicate application.
- **Why:** Prevents users from accidentally applying to the same company+role twice.
- **Files:** `client/src/components/applications/QuickAddModal.jsx` (modified)
- **Prerequisites:** Steps 3.5, 3.16
- **Expected Result:** If API returns duplicate warning → show alert with existing app's status and date. "Apply Anyway" and "Cancel" buttons.
- **Verification:** Create "Google SDE Intern" → try creating same → warning shows → click "Apply Anyway" → created.
- **Learn/Review:** Handling non-error API responses (warnings), conditional UI rendering.
- **Status:** `NOT_STARTED`

### Step 3.19 — Build Kanban board: column layout
- **Objective:** Create the KanbanBoard component with 7 empty columns.
- **Why:** The visual structure must exist before adding cards or drag-and-drop.
- **Files:** `client/src/components/applications/KanbanBoard.jsx` (created)
- **Prerequisites:** Steps 2.25, 3.14
- **Expected Result:** 7 columns rendered: Saved, Applied, OA/Screening, Interviewing, Offer, Rejected, Ghosted. Column headers show count (0). Horizontally scrollable.
- **Verification:** Navigate to Pipeline page → see 7 labeled columns with counts.
- **Learn/Review:** Tailwind flexbox/grid layout, horizontal scrolling, responsive design.
- **Status:** `NOT_STARTED`

### Step 3.20 — Build application card component
- **Objective:** Create the ApplicationCard component shown inside Kanban columns.
- **Why:** Each application is rendered as a card — it needs a consistent, information-dense design.
- **Files:** `client/src/components/applications/ApplicationCard.jsx` (created)
- **Prerequisites:** Step 3.19
- **Expected Result:** Card shows: companyName (bold), roleTitle, days in current stage, resumeVersionTag (if set), stale badge (if stale). Dark theme, rounded, subtle shadow.
- **Verification:** Render a card with sample data — all fields display correctly. Stale badge appears when isStale=true.
- **Learn/Review:** Presentational component design, conditional rendering, Tailwind card styling.
- **Status:** `NOT_STARTED`

### Step 3.21 — Populate Kanban columns with application cards
- **Objective:** Connect KanbanBoard to ApplicationContext and render cards in correct columns.
- **Why:** The board needs real data — grouped by status and sorted by lastStatusUpdate.
- **Files:** `client/src/components/applications/KanbanBoard.jsx` (modified)
- **Prerequisites:** Steps 3.15, 3.19, 3.20
- **Expected Result:** Applications from context are grouped by status into 7 columns. Each column renders ApplicationCards. Column counts update.
- **Verification:** Quick-Add 3 apps → see them in "Saved" column. Change status via API → refresh → cards move.
- **Learn/Review:** Array grouping (reduce/filter by status), component mapping, key prop.
- **Status:** `NOT_STARTED`

### Step 3.22 — Add drag-and-drop to Kanban board
- **Objective:** Integrate @hello-pangea/dnd for dragging cards between columns.
- **Why:** Drag-and-drop is the primary way users update application status.
- **Files:** `client/src/components/applications/KanbanBoard.jsx` (modified)
- **Prerequisites:** Steps 2.24, 3.21
- **Expected Result:** DragDropContext wraps board. Each column is a Droppable. Each card is a Draggable. onDragEnd calls updateStatus via context.
- **Verification:** Drag a card from "Saved" to "Applied" → card moves → API called → status updated in DB.
- **Learn/Review:** @hello-pangea/dnd API (DragDropContext, Droppable, Draggable), onDragEnd handler, optimistic updates.
- **Status:** `NOT_STARTED`

### Step 3.23 — Handle drag-and-drop error rollback
- **Objective:** If the status update API call fails, revert the card to its original position.
- **Why:** Optimistic UI must handle failures gracefully — user sees the card snap back.
- **Files:** `client/src/components/applications/KanbanBoard.jsx` (modified)
- **Prerequisites:** Step 3.22
- **Expected Result:** On API failure: card returns to original column, error toast/message shows.
- **Verification:** Simulate API failure (disconnect server) → drag card → card snaps back → error message.
- **Learn/Review:** Optimistic update + rollback pattern, error handling in async UI operations.
- **Status:** `NOT_STARTED`

### Step 3.24 — Build Table/List view component
- **Objective:** Create the TableView component with sortable columns and pagination.
- **Why:** Table view is essential for users with 100+ applications who need dense, sortable data.
- **Files:** `client/src/components/applications/TableView.jsx` (created)
- **Prerequisites:** Steps 3.14, 3.15
- **Expected Result:** Table with columns: Company, Role, Status, Applied Date, Days in Stage, Resume Tag, Stale. Sortable by column header clicks. 20 rows per page.
- **Verification:** Add 25+ apps → see first 20 in table → click "next page" → see remaining. Click "Company" header → sorts A-Z.
- **Learn/Review:** HTML table styling with Tailwind, client-side sorting, pagination logic.
- **Status:** `NOT_STARTED`

### Step 3.25 — Add inline status dropdown to Table view
- **Objective:** Add a dropdown in the Status column that updates status without opening a detail page.
- **Why:** Quick status changes are essential for table power-users.
- **Files:** `client/src/components/applications/TableView.jsx` (modified)
- **Prerequisites:** Step 3.24
- **Expected Result:** Status column shows a dropdown. Selecting a new status calls updateStatus via context.
- **Verification:** Change status from dropdown → row updates → API called → status persisted.
- **Learn/Review:** Inline editing pattern, select element handling, immediate vs. batched saves.
- **Status:** `NOT_STARTED`

### Step 3.26 — Create view toggle (Kanban ↔ Table)
- **Objective:** Add a toggle button to switch between Kanban and Table views.
- **Why:** Users should choose their preferred view and switch freely.
- **Files:** `client/src/pages/PipelinePage.jsx` (created or modified)
- **Prerequisites:** Steps 3.22, 3.24
- **Expected Result:** Toggle button: "Kanban" | "Table". Active view highlighted. View preference persisted in localStorage.
- **Verification:** Toggle between views → data is consistent. Refresh → last selected view persists.
- **Learn/Review:** Toggle UI pattern, localStorage for preferences, conditional component rendering.
- **Status:** `NOT_STARTED`

### Step 3.27 — Build search bar component
- **Objective:** Create the search input with debounced API calls.
- **Why:** Users with many applications need to find specific ones quickly.
- **Files:** `client/src/components/applications/SearchBar.jsx` (created)
- **Prerequisites:** Steps 3.6, 3.15
- **Expected Result:** Text input with search icon. Typing triggers debounced search (300ms). Results update in Kanban/Table.
- **Verification:** Type "Goo" → after 300ms, only applications matching "Google" etc. appear.
- **Learn/Review:** Debouncing (setTimeout pattern or custom hook), controlled search input, UX of search.
- **Status:** `NOT_STARTED`

### Step 3.28 — Build filter controls
- **Objective:** Create filter dropdowns for status, date range, and stale toggle.
- **Why:** Filters let users focus on specific subsets of their pipeline.
- **Files:** `client/src/components/applications/FilterControls.jsx` (created)
- **Prerequisites:** Steps 3.7, 3.14
- **Expected Result:** Multi-select status dropdown, date range pickers, stale toggle. Active filters shown as removable chips. "Clear All" button.
- **Verification:** Filter by "Applied" → only Applied apps shown. Add "stale only" → further filtered. Clear all → all shown.
- **Learn/Review:** Multi-select dropdown, date picker, filter chip UI pattern, composing query parameters.
- **Status:** `NOT_STARTED`

### Step 3.29 — Build Application Detail page
- **Objective:** Create the full detail view for a single application.
- **Why:** Users need to see/edit all application data, including the JD snapshot.
- **Files:** `client/src/pages/ApplicationDetailPage.jsx` (created)
- **Prerequisites:** Steps 3.9, 3.10
- **Expected Result:** Shows all fields. Editable fields with save button. JD in expandable section. Status display. Link back to pipeline.
- **Verification:** Click an application → see full details → edit a field → save → verify change persisted.
- **Learn/Review:** Detail page pattern, form editing with save, useParams() for route params.
- **Status:** `NOT_STARTED`

### Step 3.30 — Add empty states to Pipeline views
- **Objective:** Show helpful empty states when the user has no applications.
- **Why:** First-time users see an empty board — the message should guide them to Quick-Add.
- **Files:** `client/src/components/applications/KanbanBoard.jsx`, `TableView.jsx` (modified)
- **Prerequisites:** Steps 3.21, 3.24
- **Expected Result:** Empty Kanban: "No applications yet. Click + to add your first one." Empty table: similar message. Empty search: "No applications match your search."
- **Verification:** New user → see empty state. Search with no results → see search empty state.
- **Learn/Review:** Empty state UX design, why empty states matter for first-time user experience.
- **Status:** `NOT_STARTED`

### Step 3.31 — End-to-end pipeline test
- **Objective:** Test the complete flow: Quick-Add → Kanban → drag → Table → search → filter → detail.
- **Why:** All of Phase 3 must work together before moving forward.
- **Files:** No new files.
- **Prerequisites:** Steps 3.5–3.30
- **Expected Result:** Full flow works in the browser: add apps, view on Kanban, drag to change status, switch to Table, search, filter, open detail, edit, save.
- **Verification:** Manual browser testing of all flows. Verify data persists across page refreshes.
- **Learn/Review:** End-to-end testing of a feature-complete module, identifying integration bugs.
- **Status:** `NOT_STARTED`

---

## Phase 4: Pipeline Engine

**Goal:** Stale detection system, user settings, Action Center widget, and Dashboard page.

### Step 4.1 — Implement stale badge on Kanban cards
- **Objective:** Show a visual "Stale" badge on ApplicationCards where isStale = true.
- **Why:** Users need to see at a glance which applications need follow-up.
- **Files:** `client/src/components/applications/ApplicationCard.jsx` (modified)
- **Prerequisites:** Steps 3.8, 3.20
- **Expected Result:** Orange/amber "Stale" badge appears on cards with isStale=true. Badge shows "X days" since last update.
- **Verification:** Create app, set lastStatusUpdate to 15 days ago → card shows stale badge with "15 days."
- **Learn/Review:** Conditional badge rendering, date-fns for relative time calculation.
- **Status:** `NOT_STARTED`

### Step 4.2 — Implement stale badge on Table rows
- **Objective:** Show the stale indicator in the Table view.
- **Why:** Both views must show stale status consistently.
- **Files:** `client/src/components/applications/TableView.jsx` (modified)
- **Prerequisites:** Steps 3.24, 4.1
- **Expected Result:** Stale column or badge in the Days in Stage column for stale applications.
- **Verification:** Same stale app shows badge in both Kanban and Table views.
- **Learn/Review:** Consistent state display across views, DRY component logic.
- **Status:** `NOT_STARTED`

### Step 4.3 — Add stale quick-action buttons
- **Objective:** Add "Mark Ghosted" and "Archive" buttons to stale application cards/rows.
- **Why:** Users need one-click resolution for stale items without opening the detail page.
- **Files:** `ApplicationCard.jsx`, `TableView.jsx` (modified)
- **Prerequisites:** Steps 3.11, 3.12, 4.1
- **Expected Result:** Stale cards show action buttons. "Mark Ghosted" → status changes to Ghosted. "Archive" → app disappears from default view.
- **Verification:** Click "Mark Ghosted" → card moves to Ghosted column. Click "Archive" → card disappears.
- **Learn/Review:** Contextual action buttons, confirmation patterns, optimistic UI updates.
- **Status:** `NOT_STARTED`

### Step 4.4 — Create user profile update endpoint
- **Objective:** Implement `PUT /api/auth/profile` — update name, target role, stale threshold.
- **Why:** Users need to customize their stale threshold and profile settings.
- **Files:** `server/controllers/authController.js` (modified), `server/routes/authRoutes.js` (modified)
- **Prerequisites:** Step 2.20
- **Expected Result:** Updates allowed fields (fullName, targetRole, staleThresholdDays). Validates staleThresholdDays 7-45.
- **Verification:** curl: update staleThresholdDays to 21 (200), update to 50 (400 — out of range).
- **Learn/Review:** Partial update patterns, field-level validation, whitelist approach for allowed updates.
- **Status:** `NOT_STARTED`

### Step 4.5 — Build Settings page
- **Objective:** Create the Settings page with profile editing and stale threshold control.
- **Why:** Users need a UI to customize their preferences.
- **Files:** `client/src/pages/SettingsPage.jsx` (created)
- **Prerequisites:** Steps 2.25, 4.4
- **Expected Result:** Form with: fullName, targetRole, staleThresholdDays (slider 7-45). Save button. Success feedback.
- **Verification:** Change stale threshold to 21 → save → refresh → value persists. Invalid value → error.
- **Learn/Review:** Form with range slider, API integration for settings, user feedback patterns.
- **Status:** `NOT_STARTED`

### Step 4.6 — Create Action Center triage endpoint
- **Objective:** Implement `GET /api/analytics/triage` — compute top 3 action items.
- **Why:** The Action Center is the Dashboard's primary widget — it needs server-computed data.
- **Files:** `server/controllers/analyticsController.js` (created), `server/routes/analyticsRoutes.js` (created)
- **Prerequisites:** Steps 3.1, 5.1 (InterviewRound model — may need to stub)
- **Expected Result:** Returns max 3 items in priority order: upcoming interviews > pending debriefs > stale apps > recurring topics. Each item has: type, priority, message, applicationId.
- **Verification:** curl: with stale apps → returns stale items. With no triggers → returns empty array.
- **Learn/Review:** Multi-source data aggregation, priority sorting, limiting result sets.
- **Status:** `NOT_STARTED`

### Step 4.7 — Build Action Center widget
- **Objective:** Create the Action Center component for the Dashboard.
- **Why:** "What should I do right now?" is more useful than vanity statistics.
- **Files:** `client/src/components/common/ActionCenter.jsx` (created)
- **Prerequisites:** Steps 2.25, 4.6
- **Expected Result:** Max 3 cards. Priority-colored borders (red/yellow/blue/purple). Each has: message, primary action button, Dismiss, Snooze (7 days).
- **Verification:** With stale apps → cards appear. Click "Dismiss" → card removed. Empty state: "You're all caught up!"
- **Learn/Review:** Card-based widget design, priority-based coloring, dismiss/snooze state management.
- **Status:** `NOT_STARTED`

### Step 4.8 — Build Dashboard page with Action Center
- **Objective:** Create the Dashboard page composing the Action Center and pipeline summary stats.
- **Why:** The Dashboard is the user's landing page — it should answer "what needs my attention?"
- **Files:** `client/src/pages/DashboardPage.jsx` (rewritten from placeholder)
- **Prerequisites:** Steps 3.15, 4.7
- **Expected Result:** Dashboard shows: Action Center (top), Pipeline summary (counts per stage), recent activity. Welcoming, dark-themed design.
- **Verification:** Login → Dashboard shows action items + pipeline summary. New user sees empty states.
- **Learn/Review:** Dashboard composition, summary statistics, responsive grid layout.
- **Status:** `NOT_STARTED`

### Step 4.9 — End-to-end stale + Action Center test
- **Objective:** Test the complete stale detection → Action Center → resolution flow.
- **Why:** Stale engine and Action Center must work together seamlessly.
- **Files:** No new files.
- **Prerequisites:** Steps 4.1–4.8
- **Expected Result:** Create app → fake 14+ days → stale badge appears → Action Center shows item → "Mark Ghosted" → card moves → Action Center updates.
- **Verification:** Complete flow in browser. Verify stale threshold customization affects detection.
- **Learn/Review:** Integration testing of time-based features, testing with mock dates.
- **Status:** `NOT_STARTED`

---

## Phase 5: Interview & Debrief

**Goal:** Interview round logging, 90-second debrief modal, and problem log system.

### Step 5.1 — Create InterviewRound Mongoose model
- **Objective:** Create the InterviewRound schema with round type, date, and debrief tracking.
- **Files:** `server/models/InterviewRound.js` (created)
- **Prerequisites:** Phase 2 complete, Step 2.9
- **Expected Result:** Schema: applicationId (ref), userId (ref), roundType (enum), scheduledDate, interviewerName, notes, selfRating (1-5), debriefCompleted (default false), timestamps. Index on { applicationId, scheduledDate }.
- **Verification:** Code review — enum uses ROUND_TYPE_ENUM constant. userId included for direct queries.
- **Learn/Review:** Mongoose schema with multiple ObjectId references, enum from constants.
- **Status:** `NOT_STARTED`

### Step 5.2 — Create InterviewQuestion Mongoose model
- **Objective:** Create the schema for questions captured during debriefs.
- **Files:** `server/models/InterviewQuestion.js` (created)
- **Prerequisites:** Step 5.1
- **Expected Result:** Schema: roundId (ref), questionText (required), category (optional). Index on { roundId }.
- **Verification:** Code review — minimal schema, correct reference to InterviewRound.
- **Learn/Review:** Simple child document schemas, one-to-many relationships in MongoDB.
- **Status:** `NOT_STARTED`

### Step 5.3 — Create ProblemLog Mongoose model
- **Objective:** Create the schema for stumbled topics captured during debriefs.
- **Files:** `server/models/ProblemLog.js` (created)
- **Prerequisites:** Step 5.1
- **Expected Result:** Schema: roundId (ref), userId (ref — denormalized for aggregation), topicName (required), category. Index on { userId, topicName }.
- **Verification:** Code review — userId is denormalized (exists here AND on InterviewRound). Index supports weakness aggregation.
- **Learn/Review:** Strategic denormalization for query performance, aggregation index design.
- **Status:** `NOT_STARTED`

### Step 5.4 — Create interview routes file
- **Objective:** Create route stubs for all interview/debrief endpoints.
- **Files:** `server/routes/interviewRoutes.js` (created), `server/server.js` (modified)
- **Prerequisites:** Step 2.14 (pattern established)
- **Expected Result:** Routes: POST / (create round), GET /application/:appId (get rounds), POST /:roundId/debrief (submit), PUT /:roundId/debrief (edit), GET /upcoming. Mounted at /api/interviews.
- **Verification:** Server starts. Routes mounted.
- **Learn/Review:** Route organization for related but distinct operations.
- **Status:** `NOT_STARTED`

### Step 5.5 — Create interview controller: Create Round
- **Objective:** Implement `POST /api/interviews` — create an interview round for an application.
- **Files:** `server/controllers/interviewController.js` (created)
- **Prerequisites:** Steps 5.1, 5.4, 3.1
- **Expected Result:** Validates roundType + scheduledDate. Verifies the application belongs to the user. Creates round with userId.
- **Verification:** curl: create round (201), invalid roundType (400), wrong user's application (404).
- **Learn/Review:** Cross-document validation (verifying parent ownership), nested resource creation.
- **Status:** `NOT_STARTED`

### Step 5.6 — Create interview controller: Get Rounds for Application
- **Objective:** Implement `GET /api/interviews/application/:appId` — list all rounds for an application.
- **Files:** `server/controllers/interviewController.js` (modified)
- **Prerequisites:** Step 5.5
- **Expected Result:** Returns rounds sorted by scheduledDate ascending. Includes debrief status for each.
- **Verification:** curl: get rounds for app with 3 rounds → returns in date order with debriefCompleted flags.
- **Learn/Review:** Mongoose sort(), query by reference ID, ordering results.
- **Status:** `NOT_STARTED`

### Step 5.7 — Create interview controller: Submit Debrief
- **Objective:** Implement `POST /api/interviews/:roundId/debrief` — save rating, questions, and problem logs.
- **Why:** This is the most complex single endpoint — it creates documents across 3 collections in one request.
- **Files:** `server/controllers/interviewController.js` (modified)
- **Prerequisites:** Steps 5.1, 5.2, 5.3
- **Expected Result:** Request body: { selfRating, questions: [{text}], stumpledTopics: [{topicName, category}], notes }. Creates InterviewQuestion docs. Creates ProblemLog docs. Updates InterviewRound: selfRating, debriefCompleted=true, notes.
- **Verification:** curl: submit full debrief → round updated + questions created + problem logs created. Verify counts.
- **Learn/Review:** Transactional-style API (saving to multiple collections), Promise.all for bulk creates, error handling across multi-step operations.
- **Status:** `NOT_STARTED`

### Step 5.8 — Create interview controller: Update Debrief
- **Objective:** Implement `PUT /api/interviews/:roundId/debrief` — edit an existing debrief.
- **Files:** `server/controllers/interviewController.js` (modified)
- **Prerequisites:** Step 5.7
- **Expected Result:** Updates rating, replaces questions (delete old + create new), replaces problem logs, updates notes.
- **Verification:** curl: edit debrief → old questions removed, new ones created. Rating updated.
- **Learn/Review:** Replace strategy (delete + recreate) vs. merge strategy, when each is appropriate.
- **Status:** `NOT_STARTED`

### Step 5.9 — Create interview controller: Upcoming Interviews
- **Objective:** Implement `GET /api/interviews/upcoming` — rounds scheduled within next 48 hours.
- **Files:** `server/controllers/interviewController.js` (modified)
- **Prerequisites:** Step 5.1
- **Expected Result:** Returns rounds where scheduledDate is between now and now+48h. Includes application companyName and roleTitle.
- **Verification:** curl: with a round scheduled for tomorrow → returns it. Round scheduled next week → not returned.
- **Learn/Review:** Date range queries in MongoDB, $gte/$lte operators, populating related fields.
- **Status:** `NOT_STARTED`

### Step 5.10 — Test all interview and debrief endpoints
- **Objective:** Verify the complete interview/debrief API works end-to-end.
- **Files:** No new files.
- **Prerequisites:** Steps 5.5–5.9
- **Expected Result:** Full flow: create round → submit debrief → get rounds (shows debrief complete) → edit debrief → upcoming query works.
- **Verification:** curl sequence covering all endpoints. Verify ProblemLogs have correct userId.
- **Learn/Review:** Testing multi-collection operations, verifying data consistency.
- **Status:** `NOT_STARTED`

### Step 5.11 — Create topic taxonomy constant
- **Objective:** Create the two-level topic taxonomy for debrief tag autocomplete.
- **Files:** `client/src/constants/topicTaxonomy.js` (created)
- **Prerequisites:** None
- **Expected Result:** Two-level hierarchy: TECHNICAL (DSA → subtopics, System Design → subtopics, Languages → subtopics) + BEHAVIORAL (STAR, Communication, etc.). Flat list for autocomplete matching.
- **Verification:** Code review — all topics from PRD FR-09.2 are present. Export includes flat list for search.
- **Learn/Review:** Hierarchical data structures, flattening for autocomplete, topic taxonomy design.
- **Status:** `NOT_STARTED`

### Step 5.12 — Build "Add Interview Round" form
- **Objective:** Create the form for adding an interview round on the Application Detail page.
- **Files:** `client/src/components/interviews/AddRoundForm.jsx` (created)
- **Prerequisites:** Steps 3.29, 5.5
- **Expected Result:** Form with: roundType dropdown, scheduledDate date-time picker, interviewerName (optional), notes (optional). Submit creates round via API.
- **Verification:** Open app detail → add round → submit → round appears in timeline.
- **Learn/Review:** Date-time picker implementation, form with dropdown + date inputs.
- **Status:** `NOT_STARTED`

### Step 5.13 — Build interview timeline component
- **Objective:** Create the chronological timeline of interview rounds.
- **Files:** `client/src/components/interviews/InterviewTimeline.jsx` (created)
- **Prerequisites:** Steps 5.6, 5.12
- **Expected Result:** Vertical timeline showing rounds in date order. Each entry: type, date, interviewer, debrief status (✅ or ⏳). Click to expand details/debrief.
- **Verification:** App with 3 rounds → timeline shows all 3 in date order with correct debrief indicators.
- **Learn/Review:** Timeline UI pattern, vertical timeline design with Tailwind, conditional status icons.
- **Status:** `NOT_STARTED`

### Step 5.14 — Build Debrief modal: Step 1 (Rating)
- **Objective:** Create the first step of the 3-step debrief modal — round type and self-rating.
- **Files:** `client/src/components/interviews/DebriefModal.jsx` (created)
- **Prerequisites:** Step 2.25
- **Expected Result:** Modal with progress indicator (1/3). Pre-filled round type. 1-5 star rating (clickable). "Next" button (disabled until rating selected).
- **Verification:** Open modal → see step 1 → click 3 stars → "Next" enables → click Next → moves to step 2.
- **Learn/Review:** Multi-step modal pattern, progress indicators, star rating component.
- **Status:** `NOT_STARTED`

### Step 5.15 — Build Debrief modal: Step 2 (Questions)
- **Objective:** Create the second step — capturing questions asked during the interview.
- **Files:** `client/src/components/interviews/DebriefModal.jsx` (modified)
- **Prerequisites:** Step 5.14
- **Expected Result:** Text input + "Add" button (or Enter). Questions appear as a removable bullet list. "Back" and "Next" buttons. Can skip (0 questions allowed).
- **Verification:** Add 3 questions → see list → remove one → 2 remain. Click "Next" with 0 questions → allowed.
- **Learn/Review:** Dynamic list management in React (add/remove items), Enter key handling.
- **Status:** `NOT_STARTED`

### Step 5.16 — Build Debrief modal: Step 3 (Topics + Notes)
- **Objective:** Create the third step — stumbled topics with taxonomy autocomplete and optional notes.
- **Files:** `client/src/components/interviews/DebriefModal.jsx` (modified)
- **Prerequisites:** Steps 5.11, 5.14
- **Expected Result:** Tag input with autocomplete dropdown from taxonomy. Custom tags via Enter. Selected topics as removable chips. Notes textarea. "Back" and "Submit" buttons.
- **Verification:** Type "Dyn" → autocomplete shows "Dynamic Programming" → select → chip appears. Type custom "Concurrency" → Enter → chip appears.
- **Learn/Review:** Autocomplete/typeahead implementation, fuzzy matching, tag/chip UI pattern.
- **Status:** `NOT_STARTED`

### Step 5.17 — Connect Debrief modal to API
- **Objective:** Wire the Submit button to send all debrief data in a single API call.
- **Files:** `client/src/components/interviews/DebriefModal.jsx` (modified)
- **Prerequisites:** Steps 5.7, 5.14–5.16
- **Expected Result:** Submit collects: selfRating, questions array, topics array, notes. Sends to POST /api/interviews/:roundId/debrief. On success: modal closes, timeline updates, Action Center prompt dismissed.
- **Verification:** Complete all 3 steps → submit → round shows ✅ in timeline → API created questions + problem logs.
- **Learn/Review:** Aggregating multi-step form data, single API call for complex operations, success/error handling.
- **Status:** `NOT_STARTED`

### Step 5.18 — Build debrief view/edit mode
- **Objective:** Allow viewing and editing a previously submitted debrief.
- **Files:** `client/src/components/interviews/DebriefModal.jsx` or separate `DebriefView.jsx` (created)
- **Prerequisites:** Steps 5.8, 5.17
- **Expected Result:** Clicking a completed debrief in the timeline shows: rating, questions, topics, notes. Edit button switches to edit mode. Save calls PUT endpoint.
- **Verification:** View completed debrief → all data shown. Edit → change rating → save → verify change persisted.
- **Learn/Review:** View vs. edit modes in UI, pre-populating forms with existing data, PUT vs. POST.
- **Status:** `NOT_STARTED`

### Step 5.19 — End-to-end debrief test
- **Objective:** Test the complete interview + debrief flow from application to weakness data.
- **Files:** No new files.
- **Prerequisites:** Steps 5.5–5.18
- **Expected Result:** Create app → drag to "Interviewing" → add round → complete debrief → verify: round marked complete, questions saved, problem logs saved, timeline accurate.
- **Verification:** Full browser test. Check database directly to verify ProblemLog documents exist with correct userId and topicName.
- **Learn/Review:** Testing the signature feature, verifying data flows through the entire pipeline.
- **Status:** `NOT_STARTED`

---

## Phase 6: Analytics & Insights

**Goal:** Funnel chart, weakness heatmap, resume cohort tracker — with statistical guardrails.

### Step 6.1 — Create funnel analytics endpoint
- **Objective:** Implement `GET /api/analytics/funnel` — count applications per pipeline stage.
- **Files:** `server/controllers/analyticsController.js` (modified), `server/routes/analyticsRoutes.js` (modified)
- **Prerequisites:** Step 3.1
- **Expected Result:** MongoDB aggregation: $match (userId, not archived) → $group by status → count. Returns: { Applied: 20, "OA / Screening": 8, Interviewing: 5, Offer: 1 }.
- **Verification:** curl with known data → counts match manual count.
- **Learn/Review:** MongoDB $group aggregation, $match for filtering, aggregation pipeline stages.
- **Status:** `NOT_STARTED`

### Step 6.2 — Create weakness analytics endpoint
- **Objective:** Implement `GET /api/analytics/weaknesses` — aggregate ProblemLogs by topic.
- **Files:** `server/controllers/analyticsController.js` (modified)
- **Prerequisites:** Step 5.3
- **Expected Result:** Aggregation: $match (userId) → $group by topicName → $sort by count descending. Also returns total completed debriefs count (for N ≥ 5 guardrail).
- **Verification:** curl with 3 debriefs → returns topics with counts + totalDebriefs: 3.
- **Learn/Review:** $group with $sum for counting, $sort descending, including metadata in response.
- **Status:** `NOT_STARTED`

### Step 6.3 — Create resume cohort analytics endpoint
- **Objective:** Implement `GET /api/analytics/resume-cohorts` — group by resumeVersionTag.
- **Files:** `server/controllers/analyticsController.js` (modified)
- **Prerequisites:** Step 3.1
- **Expected Result:** Aggregation: $match (userId, has resumeVersionTag) → $group by tag → count total + count where status ≥ "OA / Screening". Returns array of { tag, total, callbacks, rate (only if N ≥ 15) }.
- **Verification:** curl with known data → cohort counts match. Rate hidden when N < 15.
- **Learn/Review:** Conditional aggregation ($cond), comparing enum values, computing rates server-side.
- **Status:** `NOT_STARTED`

### Step 6.4 — Test all analytics endpoints
- **Objective:** Verify aggregation results with known test data.
- **Files:** No new files.
- **Prerequisites:** Steps 6.1–6.3
- **Expected Result:** All 3 endpoints return correct aggregated data. Guardrail metadata included.
- **Verification:** Create specific test data → query each endpoint → verify counts manually.
- **Learn/Review:** Testing aggregation pipelines, creating representative test data.
- **Status:** `NOT_STARTED`

### Step 6.5 — Build Analytics page layout
- **Objective:** Create the Analytics page with sections for all 3 charts.
- **Files:** `client/src/pages/AnalyticsPage.jsx` (created)
- **Prerequisites:** Step 2.25
- **Expected Result:** Page with 3 sections: Funnel Conversion, Weakness Patterns, Resume Cohorts. Each section has a title and placeholder.
- **Verification:** Navigate to /analytics → see 3 labeled sections.
- **Learn/Review:** Page layout with multiple chart sections, responsive grid for charts.
- **Status:** `NOT_STARTED`

### Step 6.6 — Build funnel conversion chart
- **Objective:** Create the Recharts vertical bar chart showing stage-by-stage counts.
- **Files:** `client/src/components/analytics/FunnelChart.jsx` (created)
- **Prerequisites:** Steps 2.24, 6.1, 6.5
- **Expected Result:** Bar chart: Applied → OA/Screening → Interviewing → Offer (absolute counts). Drop-off labels between bars. "Based on your self-reported data" disclaimer.
- **Verification:** With known data → chart bars match API response counts.
- **Learn/Review:** Recharts BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, custom labels.
- **Status:** `NOT_STARTED`

### Step 6.7 — Add funnel interpretation hints
- **Objective:** Show context-based suggestions below the funnel chart.
- **Files:** `client/src/components/analytics/FunnelChart.jsx` (modified)
- **Prerequisites:** Step 6.6
- **Expected Result:** Below chart: "Based on your data: Most applications drop off at [stage]. Consider [suggestion]." Logic identifies biggest drop-off.
- **Verification:** With biggest drop at Applied→Screening → see resume-related suggestion.
- **Learn/Review:** Data-driven conditional text, computing drop-off from counts.
- **Status:** `NOT_STARTED`

### Step 6.8 — Build weakness frequency heatmap chart
- **Objective:** Create the Recharts horizontal bar chart showing ranked topic frequencies.
- **Files:** `client/src/components/analytics/WeaknessHeatmap.jsx` (created)
- **Prerequisites:** Steps 2.24, 6.2, 6.5
- **Expected Result:** Horizontal bars: topics ranked by frequency (highest first). Each bar: "Dynamic Programming — 5 debriefs."
- **Verification:** With known ProblemLog data → chart shows correct ranking and counts.
- **Learn/Review:** Recharts horizontal BarChart (layout="vertical"), custom bar labels.
- **Status:** `NOT_STARTED`

### Step 6.9 — Add weakness N ≥ 5 guardrail
- **Objective:** If total debriefs < 5, show progress message instead of the chart.
- **Files:** `client/src/components/analytics/WeaknessHeatmap.jsx` (modified)
- **Prerequisites:** Step 6.8
- **Expected Result:** Below 5 debriefs: "Complete 5 debriefs to reveal recurring patterns (X/5 done)" with progress dots/bar. At 5+: chart displays normally. At 5+ but 0 topics: "No stumbled topics logged yet."
- **Verification:** With 3 debriefs → see progress message. With 5+ → see chart or "no topics" message.
- **Learn/Review:** Statistical guardrails in UI, conditional rendering with threshold logic, progress indicators.
- **Status:** `NOT_STARTED`

### Step 6.10 — Build resume cohort comparison table
- **Objective:** Create the table showing callback rates per resume version.
- **Files:** `client/src/components/analytics/ResumeCohortTable.jsx` (created)
- **Prerequisites:** Steps 6.3, 6.5
- **Expected Result:** Table: Resume Version | Total Apps | Callbacks | Callback Rate. Untagged apps shown as "Untagged."
- **Verification:** With known cohort data → table shows correct totals and callback counts.
- **Learn/Review:** Data table rendering, formatting percentages, column alignment.
- **Status:** `NOT_STARTED`

### Step 6.11 — Add resume N ≥ 15 guardrail
- **Objective:** Hide callback rate if cohort has fewer than 15 applications.
- **Files:** `client/src/components/analytics/ResumeCohortTable.jsx` (modified)
- **Prerequisites:** Step 6.10
- **Expected Result:** N < 15: rate column shows "Gathering Data (X/15)." N ≥ 15: shows actual percentage. Empty state: "Tag applications with resume versions to compare."
- **Verification:** Cohort with 8 apps → "Gathering Data (8/15)." Cohort with 20 apps → "15.0%."
- **Learn/Review:** Conditional cell rendering in tables, protecting users from small-sample misleading stats.
- **Status:** `NOT_STARTED`

### Step 6.12 — Add analytics snapshots to Dashboard
- **Objective:** Show mini-versions of key analytics on the Dashboard page.
- **Files:** `client/src/pages/DashboardPage.jsx` (modified)
- **Prerequisites:** Steps 6.6, 6.8, 4.8
- **Expected Result:** Dashboard shows: Action Center (primary), Mini funnel summary, Mini weakness top 3 (if N ≥ 5). Link to full Analytics page.
- **Verification:** Dashboard shows summary data. "View Details" links navigate to Analytics page.
- **Learn/Review:** Dashboard widget design, summary vs. detail views, "view more" navigation pattern.
- **Status:** `NOT_STARTED`

### Step 6.13 — End-to-end analytics test
- **Objective:** Test all 3 analytics features with realistic data and guardrail scenarios.
- **Files:** No new files.
- **Prerequisites:** Steps 6.1–6.12
- **Expected Result:** Funnel shows accurate counts. Heatmap shows correct ranking. Cohort table shows correct rates. Guardrails activate/deactivate at correct thresholds.
- **Verification:** Create apps + debriefs + resume tags → verify all 3 charts. Test below and above guardrail thresholds.
- **Learn/Review:** Testing data-driven visualizations, verifying statistical guardrails.
- **Status:** `NOT_STARTED`

---

## Phase 7: Polish & Hardening

**Goal:** Data export, responsive design, error/loading/empty states, security audit, final QA.

### Step 7.1 — Create data export endpoint
- **Objective:** Implement `GET /api/applications/export?format=json|csv` — full data download.
- **Files:** `server/controllers/applicationController.js` (modified), routes updated
- **Prerequisites:** Steps 3.1, 5.1, 5.2, 5.3
- **Expected Result:** JSON: full nested structure. CSV: flattened one-row-per-application. Includes all applications, rounds, questions, problem logs.
- **Verification:** curl: JSON export contains all data. CSV has correct headers and rows.
- **Learn/Review:** JSON serialization, CSV generation, content-disposition headers, streaming responses.
- **Status:** `NOT_STARTED`

### Step 7.2 — Build export UI in Settings
- **Objective:** Add export button with format selector to the Settings page.
- **Files:** `client/src/pages/SettingsPage.jsx` (modified)
- **Prerequisites:** Steps 4.5, 7.1
- **Expected Result:** "Export Data" section with JSON/CSV radio buttons and "Download" button. File downloads immediately with correct naming (jobcaliber_export_YYYY-MM-DD.json).
- **Verification:** Click download → file saves to computer with correct format and data.
- **Learn/Review:** Browser file download via Blob/URL, content type handling, date-based filenames.
- **Status:** `NOT_STARTED`

### Step 7.3 — Add loading states to all pages
- **Objective:** Show loading spinners/skeletons during async data fetching.
- **Files:** Multiple page/component files (modified)
- **Prerequisites:** All Phase 3-6 UI complete
- **Expected Result:** Every page that fetches data shows a loading indicator while waiting. No blank flashes.
- **Verification:** Throttle network → see loading spinners. Remove throttle → spinners disappear, data shows.
- **Learn/Review:** Loading state patterns, skeleton screens vs. spinners, UX of perceived performance.
- **Status:** `NOT_STARTED`

### Step 7.4 — Add error states to all pages
- **Objective:** Show user-friendly error messages when API calls fail.
- **Files:** Multiple page/component files (modified)
- **Prerequisites:** All Phase 3-6 UI complete
- **Expected Result:** API failures show friendly messages (not raw JSON or stack traces). Retry button where appropriate.
- **Verification:** Disconnect server → navigate to pages → see error messages, not blank screens.
- **Learn/Review:** Error boundary concept, user-friendly error messages, retry patterns.
- **Status:** `NOT_STARTED`

### Step 7.5 — Verify all empty states
- **Objective:** Ensure every page/component has a meaningful empty state.
- **Files:** Multiple files (reviewed/modified)
- **Prerequisites:** All Phase 3-6 UI complete
- **Expected Result:** New user experience is guided, not blank. Every empty list/chart has a helpful message.
- **Verification:** Create new account → navigate all pages → verify meaningful empty states on each.
- **Learn/Review:** First-time user experience, empty state design, call-to-action in empty states.
- **Status:** `NOT_STARTED`

### Step 7.6 — Responsive design QA
- **Objective:** Test and fix layout issues at mobile, tablet, and desktop breakpoints.
- **Files:** Multiple files (modified as needed)
- **Prerequisites:** All UI complete
- **Expected Result:** All pages usable at 320px (mobile), 768px (tablet), 1024px+ (desktop). Kanban scrolls horizontally on mobile.
- **Verification:** Browser dev tools → resize to each breakpoint → verify all pages.
- **Learn/Review:** Responsive design with Tailwind (sm:, md:, lg:), mobile-first approach, overflow handling.
- **Status:** `NOT_STARTED`

### Step 7.7 — Security audit: tenant isolation
- **Objective:** Verify every API endpoint scopes queries to the authenticated user.
- **Files:** No new files (review all controllers).
- **Prerequisites:** All API endpoints complete
- **Expected Result:** Every Mongoose query includes { userId: req.user._id }. No endpoint allows cross-user data access.
- **Verification:** Register 2 users. User A creates data. User B queries → cannot see User A's data.
- **Learn/Review:** Tenant isolation testing, horizontal privilege escalation prevention.
- **Status:** `NOT_STARTED`

### Step 7.8 — Security audit: input validation
- **Objective:** Verify all API endpoints validate input and reject bad data.
- **Files:** No new files (review all validators).
- **Prerequisites:** All API endpoints complete
- **Expected Result:** Every POST/PUT/PATCH endpoint validates required fields, types, and ranges. Invalid input returns 400 with field-level errors.
- **Verification:** Send invalid data to each endpoint → verify 400 responses with specific messages.
- **Learn/Review:** Comprehensive validation testing, edge cases (empty strings, extreme values, special chars).
- **Status:** `NOT_STARTED`

### Step 7.9 — Security audit: NoSQL injection and rate limiting
- **Objective:** Verify NoSQL sanitization and rate limiting are working.
- **Files:** No new files.
- **Prerequisites:** Step 2.21
- **Expected Result:** Requests with $gt, $ne operators are sanitized. 11th login attempt within 15 min returns 429.
- **Verification:** Send { email: { "$gt": "" } } to login → sanitized (not a bypass). Rapid-fire 11 login attempts → 429.
- **Learn/Review:** NoSQL injection attack patterns, rate limit testing, defense verification.
- **Status:** `NOT_STARTED`

### Step 7.10 — Performance check
- **Objective:** Verify API response times meet targets.
- **Files:** No new files.
- **Prerequisites:** All API endpoints + indexes
- **Expected Result:** Standard queries < 500ms. Aggregation queries < 2s. Frontend initial load < 3s.
- **Verification:** Measure response times with curl timing or browser dev tools. With ~100 applications.
- **Learn/Review:** Performance benchmarking, identifying slow queries, MongoDB explain().
- **Status:** `NOT_STARTED`

### Step 7.11 — Cross-browser testing
- **Objective:** Verify the application works in Chrome, Firefox, and Edge.
- **Files:** No new files.
- **Prerequisites:** All UI complete
- **Expected Result:** All functionality works. No visual regressions across browsers.
- **Verification:** Test core flows (auth, Kanban drag, debrief modal, charts) in each browser.
- **Learn/Review:** Cross-browser compatibility, CSS prefixing (handled by PostCSS/autoprefixer).
- **Status:** `NOT_STARTED`

### Step 7.12 — Final README update
- **Objective:** Update README with actual screenshots, finalized setup instructions, and feature list.
- **Files:** `README.md` (modified)
- **Prerequisites:** All features complete
- **Expected Result:** README has: real screenshots, working setup instructions, accurate feature descriptions.
- **Verification:** Follow the README instructions from scratch → project runs successfully.
- **Learn/Review:** Writing documentation that actually works, screenshot capture.
- **Status:** `NOT_STARTED`

### Step 7.13 — Final commit and version tag
- **Objective:** Clean up commit history and tag the release as v1.0.0-mvp.
- **Files:** Git operations only.
- **Prerequisites:** Step 7.12
- **Expected Result:** Clean git log. Tag: v1.0.0-mvp. No secrets in any commit. .env not committed.
- **Verification:** `git log --oneline` shows meaningful commits. `git tag` shows v1.0.0-mvp. `git show v1.0.0-mvp` exists.
- **Learn/Review:** Git tagging, semantic versioning, release management basics.
- **Status:** `NOT_STARTED`

---

## Step Count Summary

| Phase | Steps | Completed | Remaining | Progress |
|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% |
| Phase 1: Architecture | 15 | 0 | 15 | 0% |
| Phase 2: Foundation | 36 | 0 | 36 | 0% |
| Phase 3: Core Data | 31 | 0 | 31 | 0% |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% |
| **TOTAL** | **147** | **11** | **136** | **7%** |

---

## Rules

1. **Sequential within phases.** Do steps in order. Don't skip.
2. **Sequential across phases.** Don't start Phase 3 before Phase 2 is complete.
3. **One step = one approval.** Complete a step, stop, wait for review.
4. **End-to-end tests close each phase.** The final step in each phase is integration testing.
5. **Architecture before code.** Phase 1 must be complete before Phase 2 begins.
6. **This file is updated after every step.** Change status to `COMPLETED` as steps are done.
7. **PROJECT_PROGRESS.md is updated after every step.** Keep progress in sync.
8. **TECH_LEARNING.md is updated after every step.** Document technologies used in completed steps.
