<!-- 📌 WHAT IS THIS FILE? This is the project's front page. Read it first to understand what JobCaliber is, the tech stack, and how to set it up locally. -->

# JobCaliber

> **Measure your pipeline. Elevate your interview caliber.**

A closed-loop job search intelligence system that turns applications, interviews, and rejections into actionable personal improvement data.

---

## 🎯 What is JobCaliber?

JobCaliber is **not** another CRUD job tracker. It is a diagnostic feedback system built on this core loop:

```
CAPTURE (< 15s) → TRACK (pipeline) → DEBRIEF (90s) → LEARN (patterns) → ACT (improve)
```

**The problem:** Job seekers apply to 100-300+ jobs blindly. Trackers are abandoned in 2-3 weeks because they require too many fields. No tool helps users understand *where* they're failing or *which topics* keep tripping them up in interviews.

**The solution:**
- **15-Second Quick-Add** — Only 2 mandatory fields (Company + Role). Everything else is optional.
- **7-Stage Interactive Kanban** — Drag-and-drop pipeline with automatic stale detection (14 days).
- **90-Second Post-Interview Debrief** — Rapidly capture round type, self-rating, questions asked, and stumbled topics.
- **Weakness Frequency Heatmap** — Aggregates stumbled topics across all debriefs into a ranked study list (N ≥ 5 guardrail).
- **Funnel Drop-Off Analytics** — Shows WHERE in the pipeline you're losing (resume vs. interview problem).
- **Resume Cohort Tracker** — Compares callback rates across resume versions (N ≥ 15 guardrail).
- **Daily Action Center** — Top 3 prioritized tasks: upcoming interviews, pending debriefs, stale follow-ups.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | SPA with fast HMR builds |
| **Styling** | Tailwind CSS | Dark-mode first, glassmorphism, responsive |
| **Charts** | Recharts | Funnel bar chart, Weakness horizontal bar |
| **Drag & Drop** | @hello-pangea/dnd | Kanban board interactions |
| **Backend** | Node.js + Express.js | RESTful API server |
| **Database** | MongoDB + Mongoose | Document model with relational references |
| **Auth** | JWT + bcryptjs | HttpOnly cookie-based authentication |
| **Date Utils** | date-fns | Stale detection, interview countdowns |
| **Validation** | express-validator | Server-side input validation |
| **Security** | express-mongo-sanitize, express-rate-limit | Injection defense, brute-force prevention |

---

## 📐 Project Structure

```
JobCaliber/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API call functions
│   │   ├── constants/         # Enums, taxonomy, config
│   │   └── utils/             # Helper functions
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/                # DB connection, env config
│   ├── controllers/           # Route handler logic
│   ├── middleware/            # Auth, validation, error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Route definitions
│   └── package.json
│
├── docs/                      # Documentation
│   ├── RESEARCH.md            # Evidence & competitor analysis
│   ├── ARCHITECTURE.md        # System architecture (planned)
│   ├── DATABASE_SCHEMA.md     # Schema definitions (planned)
│   ├── API_SPEC.md            # Endpoint specifications (planned)
│   └── ...
│
├── PROJECT_MASTER_SPEC.md     # Complete product knowledge base
├── PRD.md                     # Product requirements & user stories
├── AGENTS.md                  # AI agent development directives
├── DECISIONS.md               # Architecture decision records
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **MongoDB** — local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/JobCaliber.git
cd JobCaliber

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobcaliber
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRE=30d
```

> ⚠️ **Never commit `.env` to Git.** Use `.env.example` as a template.

### Running Locally

```bash
# Start the backend (from server/)
cd server
npm run dev

# Start the frontend (from client/ in a new terminal)
cd client
npm run dev
```

The client runs on `http://localhost:5173` and the API on `http://localhost:5000`.

---

## 📊 Data Model

5 collections with relational references:

```
USER ──► APPLICATION ──► INTERVIEW_ROUND ──► INTERVIEW_QUESTION
                                          ──► PROBLEM_LOG
```

- **User** → owns many Applications
- **Application** → has many Interview Rounds
- **Interview Round** → has many Questions + Problem Logs
- **Problem Log** → aggregated across all rounds for weakness analysis

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds = 12)
- JWT stored in **HttpOnly**, **SameSite=Lax** cookies (not localStorage)
- **express-mongo-sanitize** prevents NoSQL injection
- **express-rate-limit** on auth endpoints (10 per 15 min)
- **Tenant isolation**: every query scoped to authenticated user

---

## 📈 What Makes This Different

| Dimension | Typical Job Tracker | JobCaliber |
|---|---|---|
| Data model | Flat (2 collections) | Relational (5 collections) |
| Interview handling | Status = "Interview" | Structured rounds + 90s debriefs |
| Analytics | Pie chart of totals | Funnel drop-off + weakness heatmap |
| Daily utility | Passive database | Action Center: top 3 tasks |
| Statistical rigor | None | N ≥ 5 / N ≥ 15 guardrails |

---

## 📋 Development Phases

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Research & Documentation | ✅ Complete |
| Phase 1 | Architecture (DB, API, UI specs) | ⬜ Next |
| Phase 2 | Foundation (scaffolding, DB, Auth) | ⬜ |
| Phase 3 | Core Data (Application model, Quick-Add, Pipeline) | ⬜ |
| Phase 4 | Pipeline Engine (Status updates, Stale, Action Center) | ⬜ |
| Phase 5 | Interview & Debrief (Rounds, Modal, Problem logs) | ⬜ |
| Phase 6 | Analytics (Heatmap, Funnel, Resume cohort) | ⬜ |
| Phase 7 | Polish & Hardening (Responsive, Errors, Security) | ⬜ |

---

## 📚 Documentation

| Document | Purpose |
|---|---|
| [PROJECT_MASTER_SPEC.md](docs/PROJECT_MASTER_SPEC.md) | Complete product knowledge base (65 sections) |
| [PRD.md](docs/PRD.md) | Requirements, user stories, acceptance criteria |
| [DECISIONS.md](docs/DECISIONS.md) | Architecture decision records (14 ADRs) |
| [TASKS.md](docs/TASKS.md) | Implementation roadmap (147 granular steps, 8 phases) |
| [PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md) | Central progress tracking dashboard |
| [TECH_LEARNING.md](TECH_LEARNING.md) | Living technology study & engineering reference guide |
| [AGENTS.md](AGENTS.md) | AI agent development rules |
| [docs/RESEARCH.md](docs/RESEARCH.md) | Research evidence & competitor analysis |

---

## 🤝 Development Workflow

This project follows a strict **Inspect → Plan → Implement → Test → Review** loop:

1. Read the relevant docs and existing code
2. Plan the smallest possible change
3. Implement only that change
4. Test with curl/Postman/browser
5. Review and verify before moving on

---

## 📜 License

This project is for educational and portfolio purposes.
