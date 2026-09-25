<!-- 📌 WHAT IS THIS FILE? This file contains rules for AI coding assistants (like me) working on this project. It defines what to do, what NOT to do, the tech stack, coding standards, and security rules. You can also read it to understand the project's development guidelines. -->

# AGENTS.md — JobCaliber Development Directives

> **Single Source of Truth for AI coding agents working on JobCaliber.**  
> **Any agent entering this workspace MUST read this file before proposing or modifying any code.**  
> **Version:** 2.0.0 — Rebuilt from validated research (Steps 0.1–0.7)  
> **Last Updated:** 2026-09-24

---

## 1. Project Identity

* **Project Name:** JobCaliber
* **Tagline:** Measure your pipeline. Elevate your interview caliber.
* **Category:** Job Search Intelligence Platform
* **Repository:** Monorepo (`client/` + `server/`)

---

## 2. What is JobCaliber?

JobCaliber is a **closed-loop job search intelligence system** — NOT a CRUD job tracker.

The Core Product Loop:

```
CAPTURE (< 15s) → TRACK (pipeline) → DEBRIEF (90s) → LEARN (patterns) → ACT (improve)
```

**Every feature exists to serve one of these 5 loop stages.** If a proposed change does not serve the loop, it does not belong in the product.

**Key references (all in `docs/` folder):**
- `docs/PROJECT_MASTER_SPEC.md` — Complete product knowledge base
- `docs/PRD.md` — Requirements and user stories
- `docs/DECISIONS.md` — All architecture decisions with rationale
- `docs/RESEARCH.md` — Evidence and competitor analysis

---

## 3. Developer Profile & Pair-Programming Rules

### Who is the developer?

- B.Tech CSE student preparing for SWE internships/jobs
- Knows MERN stack fundamentals (~3 months experience)
- Wants to learn through a project-first, reverse-engineering approach
- Known technologies: MongoDB, Mongoose, Express, Node.js, React (Vite), Tailwind CSS, JWT + bcrypt

### CRITICAL Working Rules

1. **No Unfamiliar Stack Additions:** DO NOT introduce Python, Docker, Next.js, GraphQL, microservices, TypeScript, or complex third-party platforms. 100% pure MERN + Tailwind CSS.

2. **Step-by-Step Implementation:** Never generate hundreds of lines in one unreadable batch. Break work into small, understandable chunks.

3. **Code Explanation:** Explain *how* and *why* key pieces of code work (Mongoose schemas, aggregation pipelines, custom hooks, middleware patterns) so the developer learns.

4. **Human-in-the-Loop:** Follow the Inspect → Plan → Implement → Test → Review cycle. The developer is the architect; the agent is the implementation partner.

5. **NEVER BUILD AHEAD:** After completing ONE step, STOP. Do not automatically continue. Wait for explicit approval ("Proceed", "Next step", "Continue").

---

## 4. Technology Stack (Locked — ADR-002)

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast builds, SPA, industry standard |
| **Styling** | Tailwind CSS | Dark-mode first, glassmorphism, responsive |
| **Charts** | Recharts | Native React SVG, responsive (ADR-010) |
| **Drag & Drop** | @hello-pangea/dnd | Maintained fork of react-beautiful-dnd (ADR-009) |
| **Backend** | Node.js + Express.js | Non-blocking I/O, native JS end-to-end |
| **Database** | MongoDB + Mongoose | Document model fits nested data |
| **Auth** | JWT + bcryptjs | HttpOnly cookie transport (ADR-007) |
| **Date Utils** | date-fns | Lightweight, modular, immutable |
| **Validation** | express-validator | Server-side input validation |
| **Security** | express-mongo-sanitize, express-rate-limit | Injection defense, brute-force prevention |

**Every dependency must have a documented reason.** No "nice-to-have" packages.

---

## 5. Product Decisions (Locked)

These decisions are FINAL. Do not change without explicit developer approval and new evidence.

| # | Decision | Value | ADR |
|---|---|---|---|
| PD-01 | Pipeline stages | 7 fixed: Saved → Applied → OA/Screening → Interviewing → Offer → Rejected → Ghosted | ADR-003 |
| PD-02 | Custom statuses | NO — fixed enum for analytics integrity | ADR-012 |
| PD-03 | Stale threshold default | 14 days (customizable 7-45) | ADR-004 |
| PD-04 | Weakness heatmap guardrail | N ≥ 5 debriefs before showing patterns | ADR-005 |
| PD-05 | Resume cohort guardrail | N ≥ 15 applications per cohort before showing rates | ADR-006 |
| PD-06 | Mandatory fields | 2 only: companyName + roleTitle | ADR-008 |
| PD-07 | Action Center max items | 3 | — |
| PD-08 | Duplicate detection window | 60 days (same company + role, case-insensitive) | ADR-013 |
| PD-09 | AI in MVP | NONE | ADR-011 |
| PD-10 | Auth token storage | HttpOnly, SameSite=Lax cookie | ADR-007 |
| PD-11 | Repository structure | Monorepo (client/ + server/) | ADR-014 |
| PD-12 | Target market | General (not India-specific) | — |

---

## 6. Data Model (5 Collections)

```
USER (1) ──── owns ────► (N) APPLICATION
APPLICATION (1) ── contains ──► (N) INTERVIEW_ROUND
INTERVIEW_ROUND (1) ── contains ──► (N) INTERVIEW_QUESTION
INTERVIEW_ROUND (1) ── records ──► (N) PROBLEM_LOG
USER (1) ── aggregates ──► (N) PROBLEM_LOG
```

### Key Schema Fields

| Collection | Required Fields | Key Indexes |
|---|---|---|
| `users` | fullName, email (unique), passwordHash, staleThresholdDays (default: 14) | email |
| `applications` | userId, companyName, roleTitle, status (enum), lastStatusUpdate, isStale, isArchived | { userId, status }, { userId, companyName, roleTitle }, { userId, appliedDate } |
| `interviewrounds` | applicationId, userId, roundType (enum), scheduledDate, debriefCompleted | { applicationId, scheduledDate } |
| `interviewquestions` | roundId, questionText | { roundId } |
| `problemlogs` | roundId, userId, topicName, category | { userId, topicName } |

**Full schema definitions:** See `docs/DATABASE_SCHEMA.md` (to be created in Architecture phase)

---

## 7. API Route Structure

| Prefix | Purpose | Endpoints |
|---|---|---|
| `/api/auth` | Auth | register, login, logout, me |
| `/api/applications` | CRUD + status + filters | list, create, get, update status, update, delete/archive |
| `/api/interviews` | Rounds + debriefs | create round, submit debrief, get upcoming |
| `/api/analytics` | Aggregations | funnel, weaknesses, resume-cohorts, triage |

**Full API specification:** See `docs/API_SPEC.md` (to be created in Architecture phase)

---

## 8. Coding Standards

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files (React components) | PascalCase | `KanbanBoard.jsx` |
| Files (utilities, hooks) | camelCase | `useAuth.js`, `dateUtils.js` |
| Files (backend) | camelCase | `applicationController.js`, `authRoutes.js` |
| React components | PascalCase | `<ApplicationCard />` |
| Functions | camelCase | `getApplications()`, `handleDragEnd()` |
| Constants | UPPER_SNAKE_CASE | `MAX_STALE_DAYS`, `STATUS_ENUM` |
| MongoDB collections | lowercase plural | `applications`, `interviewrounds` |
| Mongoose models | PascalCase singular | `Application`, `InterviewRound` |
| API routes | lowercase kebab-case | `/api/applications/:id/status` |
| CSS classes | Tailwind utilities | `bg-gray-900 text-white` |
| Environment variables | UPPER_SNAKE_CASE | `MONGO_URI`, `JWT_SECRET` |

### File Organization

```
JobCaliber/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Buttons, Modals, Cards, etc.
│   │   │   ├── layout/       # Navbar, Sidebar, Footer
│   │   │   ├── applications/ # Application-specific components
│   │   │   ├── interviews/   # Interview/debrief components
│   │   │   └── analytics/    # Charts, heatmap, funnel
│   │   ├── pages/            # Page-level components
│   │   ├── context/          # React Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions
│   │   ├── constants/        # Enums, taxonomy, config
│   │   ├── services/         # API call functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/               # DB connection, env config
│   ├── controllers/          # Route handler logic
│   ├── middleware/            # Auth, validation, error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express route definitions
│   ├── utils/                # Server utilities
│   ├── server.js             # Entry point
│   └── package.json
│
├── docs/                     # Project documentation
│   ├── RESEARCH.md
│   ├── PROJECT_MASTER_SPEC.md
│   ├── PRD.md
│   ├── DECISIONS.md
│   ├── TASKS.md
│   ├── PROJECT_PROGRESS.md
│   ├── ARCHITECTURE.md       # (to be created)
│   ├── DATABASE_SCHEMA.md    # (to be created)
│   ├── API_SPEC.md           # (to be created)
│   ├── UI_SPEC.md            # (to be created)
│   ├── ANALYTICS_SPEC.md     # (to be created)
│   ├── SECURITY.md           # (to be created)
│   ├── TESTING_STRATEGY.md   # (to be created)
│   └── USER_FLOWS.md         # (to be created)
│
├── AGENTS.md                 # This file (must stay at root)
├── TECH_LEARNING.md          # Technology learning guide (continuously updated)
├── README.md                 # Project front page (must stay at root)
├── CHANGELOG.md              # (to be created)
├── .gitignore
└── .env.example
```

### Code Quality Rules

1. **No magic numbers.** Use named constants: `const MAX_ACTION_CENTER_ITEMS = 3;`
2. **No hardcoded strings for enums.** Use constants file: `STATUS_ENUM`, `ROUND_TYPE_ENUM`
3. **No business logic in routes.** Routes call controllers. Controllers contain logic.
4. **No duplicated validation.** Server validates. Frontend validates for UX. Server is the source of truth.
5. **All async operations use try/catch** with meaningful error responses.
6. **Comments explain WHY, not WHAT.** The code tells you what. Comments tell you why.

---

## 9. Security Rules (Non-Negotiable)

1. **Passwords:** bcrypt with salt rounds = 12. NEVER store plaintext.
2. **JWT transport:** HttpOnly, SameSite=Lax cookies. NEVER localStorage.
3. **Tenant isolation:** EVERY database query includes `{ userId: req.user._id }`. NO EXCEPTIONS.
4. **Input validation:** express-validator on ALL payload endpoints.
5. **NoSQL injection:** express-mongo-sanitize strips `$` and `.` operators from input.
6. **Rate limiting:** express-rate-limit on auth endpoints (10 per 15 minutes).
7. **Secrets:** NEVER hardcode. ALWAYS use environment variables.
8. **Git:** NEVER commit `.env` files, API keys, or passwords.

---

## 10. Statistical Integrity Rules (Non-Negotiable)

These rules protect users from misleading analytics:

### Three-Tier Truth Classification

1. **`[FACT]`** — What the user explicitly recorded (e.g., "14 applications submitted")
2. **`[USER LOG]`** — What the user self-reported (e.g., "Struggled with Graphs in 3 rounds")
3. **`[SYSTEM PATTERN]`** — What the data shows when aggregated

### Sample Size Protection

| Metric | Minimum N | Below Threshold Display |
|---|---|---|
| Weakness Pattern Ranking | 5 total debriefs | *"Complete 5 debriefs to reveal patterns (X/5)"* |
| Resume Cohort Conversion | 15 per cohort | *"Gathering Data (X/15 applications)"* |
| Source Conversion (V2) | 20 per source | *"Not enough data yet (X/20)"* |

### Causal Claims Prohibition

- **NEVER:** "You were rejected because you are bad at Graphs."
- **ALWAYS:** "Graph-related difficulties were recorded in 4 technical interview debriefs."
- **NEVER:** "Resume v2 is better than v1."
- **ALWAYS:** "Applications using Resume v2 had a higher callback rate in your recorded data."

---

## 11. MVP Feature Checklist

| # | Feature | Loop Stage | Status |
|---|---|---|---|
| F1 | Authentication (JWT + bcrypt + HttpOnly cookies) | Foundation | ⬜ Not started |
| F2 | Quick-Add Application (2 mandatory fields) | CAPTURE | ⬜ Not started |
| F3 | 7-Stage Kanban + Table View (drag-and-drop) | TRACK | ⬜ Not started |
| F4 | Stale Application Engine (14-day default) | TRACK | ⬜ Not started |
| F5 | Search & Combined Filters | TRACK | ⬜ Not started |
| F6 | Job Description Snapshot | TRACK | ⬜ Not started |
| F7 | Interview Round Logger | TRACK→DEBRIEF | ⬜ Not started |
| F8 | 90-Second Post-Interview Debrief ⭐ | DEBRIEF | ⬜ Not started |
| F9 | Stumbled Topic Tagging (taxonomy + custom) | DEBRIEF | ⬜ Not started |
| F10 | Weakness Frequency Heatmap (N ≥ 5) ⭐ | LEARN | ⬜ Not started |
| F11 | Funnel Conversion Analytics | LEARN | ⬜ Not started |
| F12 | Resume Version Cohort Tracker (N ≥ 15) | LEARN | ⬜ Not started |
| F13 | Daily Triage / Action Center (max 3) ⭐ | ACT | ⬜ Not started |
| F14 | Data Export (JSON/CSV) | Cross-cutting | ⬜ Not started |
| F15 | Security Hardening | Foundation | ⬜ Not started |

---

## 12. Features Explicitly REMOVED — Do NOT Build

| Feature | Reason | ADR |
|---|---|---|
| Automated application bot | ATS blacklisting; violates ToS | ADR-011 |
| Full networking / recruiter CRM | Over-scoped for target users | — |
| Calendar replacement | Users have Google Calendar | — |
| 0-100% "ATS Score" | Pseudo-scientific; distrusted | ADR-011 |
| Streak gamification | Adds guilt; counterproductive | — |
| AI Cover Letter Generator | ChatGPT is free and better | ADR-011 |
| Company intelligence database | Massive scope creep | — |
| LinkedIn scraping | Violates ToS; fragile | — |

---

## 13. Development Workflow

### The Inspect → Plan → Implement → Test → Review Loop

```
INSPECT  → Read the relevant existing code and docs
PLAN     → Identify the smallest change needed
IMPLEMENT → Write ONLY that change
TEST     → Verify with curl/Postman/browser
REVIEW   → Developer reviews and approves
STOP     → Wait for explicit approval before next step
```

### Step Completion Format

After EVERY step, write:

```
----------------------------------------
STEP COMPLETED
----------------------------------------

Step: <number and name>
What was done: <explanation>
Files created/modified: <list>
What to review: <list>
What was learned: <concepts>
Verification: <how it was tested>
Potential issues: <any concerns>
Next step: <name only — DO NOT PERFORM IT>
STATUS: WAITING FOR EXPLICIT APPROVAL.
```

### Rules

- **One approval = one step.** "Proceed" means the NEXT step only.
- **Never auto-continue.** Never assume approval.
- **Never build future features.** Only what was explicitly requested.
- **Break large tasks down.** If a task modifies many areas or introduces multiple concepts, split it.
- **Update tracking & learning files after EVERY step:** Update `TASKS.md`, `PROJECT_PROGRESS.md`, and `TECH_LEARNING.md` (only for technologies actually used in completed steps).

---

## 14. Git Rules

1. **Initialize Git from the beginning.**
2. **Meaningful commits:** Describe what changed and why. No "fix stuff" or "update code."
3. **Small commits:** One logical change per commit.
4. **Never commit:** `.env`, `node_modules/`, API keys, passwords, secrets.
5. **Commit message format:** `<type>: <description>` (e.g., `feat: add application model`, `fix: stale calculation off-by-one`)

---

## 15. Agent Prohibitions

The AI coding agent must NEVER:

- ❌ Invent APIs or endpoints not in the spec
- ❌ Add dependencies not in the approved list without explicit approval
- ❌ Modify unrelated files
- ❌ Rewrite working code unnecessarily
- ❌ Hide errors or swallow exceptions
- ❌ Delete tests to make tests pass
- ❌ Disable validation for convenience
- ❌ Hardcode secrets or credentials
- ❌ Commit secrets to Git
- ❌ Claim success without verification
- ❌ Build features not yet approved
- ❌ Use localStorage for JWT tokens
- ❌ Skip tenant isolation on any query
- ❌ Display statistics below sample-size thresholds
- ❌ Use causal language in analytics ("because", "your weakness is")
- ❌ Introduce TypeScript, Python, Docker, Next.js, or GraphQL

---

## 16. Development Phases

```
Phase 0: Research & Documentation  ──► ✅ COMPLETE (Steps 0.1–0.11)
Phase 1: Architecture              ──► ⬜ NEXT (DB schema, API spec, UI spec)
Phase 2: Foundation                ──► ⬜ (Project scaffolding, DB connection, Auth)
Phase 3: Core Data                 ──► ⬜ (Application model, Quick-Add, Pipeline views)
Phase 4: Pipeline Engine           ──► ⬜ (Status updates, Stale engine, Action Center)
Phase 5: Interview & Debrief       ──► ⬜ (Rounds, Debrief modal, Problem logging)
Phase 6: Analytics & Insights      ──► ⬜ (Aggregations, Weakness heatmap, Funnel, Resume cohort)
Phase 7: Polish & Hardening        ──► ⬜ (Responsive QA, Error states, Security audit)
```
