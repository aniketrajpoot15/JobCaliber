<!-- 📌 WHAT IS THIS FILE? This is the builder's blueprint. It lists every requirement (what to build), every user story (who needs it and why), and every acceptance criteria (how to know when it's done). A developer reads this to understand WHAT to code. -->

# JOBCALIBER — PRODUCT REQUIREMENTS DOCUMENT (PRD)

> **Version:** 1.0.0  
> **Status:** Approved for Architecture Phase  
> **Last Updated:** 2026-09-24  
> **Author:** Product Research Phase (Steps 0.1–0.5)  
> **Reference:** `PROJECT_MASTER_SPEC.md` for full context

---

## 1. Problem

Job seekers submit 100-300+ applications using brute-force volume. They fail because:

1. **Tracker Abandonment:** Existing tools require 10-25 fields per entry. Users stop tracking within 2-3 weeks.
2. **No Diagnostic Feedback:** Candidates never discover WHERE in the pipeline they fail (resume vs. interview) or WHICH topics keep tripping them up.

**Evidence:** ~75% of applications get no response. ~53% of seekers are ghosted. Trackers "die after a week" due to entry fatigue. See `docs/Research_And_Documentation/RESEARCH.md` for full evidence.

---

## 2. Users

| Priority | Segment | Volume | Core Need |
|---|---|---|---|
| 🥇 Primary | Students / freshers / new grads (SWE) | 100-300+ | Fast entry, OA tracking, debrief patterns |
| 🥈 Secondary | Self-taught / career switchers | 50-100 | Resume A/B testing, funnel diagnosis |
| 🥉 Tertiary | Mid-senior SWEs | 25-50 | Round management, JD snapshots |

---

## 3. Goals

| # | Goal | Success Metric |
|---|---|---|
| G1 | Effortless application capture | < 15 seconds per entry |
| G2 | Pipeline visibility | All apps/stages/stale flags visible at a glance |
| G3 | Structured self-reflection | Debriefs completed in ~90 seconds |
| G4 | Weakness discovery | Top topics surfaced after ≥ 5 debriefs |
| G5 | Funnel diagnostics | User can identify bottleneck stage |
| G6 | Resume iteration | Callback rates compared (N ≥ 15) |
| G7 | Daily actionability | Max 3 tasks on app open |
| G8 | Data sovereignty | 100% export anytime |
| G9 | Statistical honesty | No misleading metrics |

---

## 4. Non-Goals

| Non-Goal | Reason |
|---|---|
| Auto-apply bot | Counterproductive; causes ATS blacklisting |
| AI resume writer | ChatGPT is free and better |
| ATS score checker | Pseudo-scientific; distrusted |
| Networking CRM | Over-scoped for primary users |
| Calendar replacement | Users have Google Calendar |
| Gamification / streaks | Adds guilt to stressful process |

---

## 5. Requirements

### 5.1 Functional Requirements

#### FR-01: Authentication

| ID | Requirement | Priority |
|---|---|---|
| FR-01.1 | Users register with fullName, email, password | Must |
| FR-01.2 | Passwords hashed with bcrypt (salt=12) | Must |
| FR-01.3 | JWT stored in HttpOnly, SameSite=Lax cookie | Must |
| FR-01.4 | Login returns JWT cookie on success | Must |
| FR-01.5 | Login rate limited: 10 attempts per 15 minutes | Must |
| FR-01.6 | Logout clears auth cookie | Must |
| FR-01.7 | `GET /api/auth/me` returns current user | Must |
| FR-01.8 | User can edit: fullName, targetRole, staleThresholdDays | Should |
| FR-01.9 | staleThresholdDays: integer 7-45, default 14 | Must |

#### FR-02: Quick-Add Application

| ID | Requirement | Priority |
|---|---|---|
| FR-02.1 | Only 2 mandatory fields: companyName, roleTitle | Must |
| FR-02.2 | Default status: `Saved`. Default appliedDate: today | Must |
| FR-02.3 | Optional fields revealed via expandable "Add More Details" | Must |
| FR-02.4 | Optional fields: jobUrl, location, workMode, salaryRange, fullJobDescription, source, resumeVersionTag, appliedDate, notes | Must |
| FR-02.5 | workMode: enum (Remote, Hybrid, Onsite) | Must |
| FR-02.6 | source: dropdown (LinkedIn, Naukri, Referral, Company Website, Indeed, AngelList, Other) | Must |
| FR-02.7 | Duplicate detection: same companyName + roleTitle (case-insensitive) within 60 days → warning | Must |
| FR-02.8 | Duplicate warning is non-blocking (user can proceed) | Must |
| FR-02.9 | Quick-Add accessible from every page | Should |

#### FR-03: Application Pipeline

| ID | Requirement | Priority |
|---|---|---|
| FR-03.1 | 7 fixed statuses: Saved, Applied, OA / Screening, Interviewing, Offer, Rejected, Ghosted | Must |
| FR-03.2 | Kanban view: 7 columns with drag-and-drop cards | Must |
| FR-03.3 | Table view: sortable, paginated (20/page default) with inline status dropdown | Must |
| FR-03.4 | Toggle between Kanban and Table views | Must |
| FR-03.5 | Each Kanban card shows: company, role, days in stage, resume tag, stale badge | Must |
| FR-03.6 | Drag-and-drop updates status + lastStatusUpdate + recalculates isStale | Must |
| FR-03.7 | Failed drag reverts card to original position with error message | Must |
| FR-03.8 | Column headers show application count per stage | Should |
| FR-03.9 | Empty state: prompt to Quick-Add first application | Must |

#### FR-04: Stale Application Engine

| ID | Requirement | Priority |
|---|---|---|
| FR-04.1 | isStale = true when: status is Applied OR OA/Screening AND lastStatusUpdate ≥ 14 days ago | Must |
| FR-04.2 | Stale flag recalculated on-read (when list is fetched) and on-write (status change) | Must |
| FR-04.3 | Stale badge visible on Kanban cards and Table rows | Must |
| FR-04.4 | One-click actions for stale apps: "Mark Ghosted", "Archive" | Must |
| FR-04.5 | Stale threshold customizable per user (7-45 days) | Must |
| FR-04.6 | Applications in Saved, Interviewing, Offer, Rejected, Ghosted are NEVER stale | Must |

#### FR-05: Search & Filtering

| ID | Requirement | Priority |
|---|---|---|
| FR-05.1 | Text search across companyName and roleTitle (case-insensitive, partial match) | Must |
| FR-05.2 | Search results update on type (debounced ~300ms) | Should |
| FR-05.3 | Filter by status (multi-select) | Must |
| FR-05.4 | Filter by appliedDate range (start + end) | Should |
| FR-05.5 | Filter by stale flag (toggle) | Must |
| FR-05.6 | Filters combine with AND logic | Must |
| FR-05.7 | Active filters shown as removable chips | Should |
| FR-05.8 | "Clear All Filters" button | Must |

#### FR-06: Job Description Snapshot

| ID | Requirement | Priority |
|---|---|---|
| FR-06.1 | fullJobDescription field (text) available in Quick-Add "More Details" and Application Detail | Must |
| FR-06.2 | No character limit | Must |
| FR-06.3 | Expandable/collapsible display in Application Detail (collapsed by default) | Should |
| FR-06.4 | Empty state: "No JD saved" with option to add | Must |

#### FR-07: Interview Round Logger

| ID | Requirement | Priority |
|---|---|---|
| FR-07.1 | "Add Round" available on Application Detail (when status is OA/Screening or Interviewing) | Must |
| FR-07.2 | Fields: roundType (required, enum: Recruiter/Technical/System Design/HR/OA), scheduledDate (required), interviewerName (optional), notes (optional) | Must |
| FR-07.3 | Multiple rounds per application | Must |
| FR-07.4 | debriefCompleted defaults to false | Must |
| FR-07.5 | Timeline view: rounds in chronological order with debrief status indicator | Must |

#### FR-08: 90-Second Post-Interview Debrief ⭐

| ID | Requirement | Priority |
|---|---|---|
| FR-08.1 | If scheduledDate is past AND debriefCompleted is false → Action Center prompt within 24h | Must |
| FR-08.2 | 3-step modal with progress indicator | Must |
| FR-08.3 | Step 1: Round type (pre-filled) + Self-rating 1-5 stars (required) | Must |
| FR-08.4 | Step 2: Questions asked — free-text bullet list, add/remove. Optional (can skip). | Must |
| FR-08.5 | Step 3: Stumbled topics (tag input with taxonomy autocomplete) + Notes (optional) | Must |
| FR-08.6 | Submit saves ALL data in single API call: rating, questions, problem logs | Must |
| FR-08.7 | Submit sets debriefCompleted = true | Must |
| FR-08.8 | Completed debriefs viewable and editable from Application Detail | Must |
| FR-08.9 | Modal close without submit = no data saved, prompt remains | Must |

#### FR-09: Stumbled Topic Tagging

| ID | Requirement | Priority |
|---|---|---|
| FR-09.1 | Tag input with autocomplete from two-level taxonomy | Must |
| FR-09.2 | Taxonomy: TECHNICAL (DSA, System Design, Languages, DevOps) + BEHAVIORAL (STAR, Communication, etc.) | Must |
| FR-09.3 | Fuzzy matching on type | Should |
| FR-09.4 | Custom tags supported (stored as category: "Custom") | Must |
| FR-09.5 | No duplicate topics per single debrief | Must |
| FR-09.6 | Multiple topics selectable per debrief | Must |

#### FR-10: Weakness Frequency Heatmap ⭐

| ID | Requirement | Priority |
|---|---|---|
| FR-10.1 | Horizontal bar chart (Recharts): topics ranked by frequency, highest first | Must |
| FR-10.2 | Each bar shows: topic name + count ("Dynamic Programming — 5 debriefs") | Must |
| FR-10.3 | If total debriefs < 5: show "Complete 5 debriefs to reveal patterns (X/5)" instead of chart | Must |
| FR-10.4 | If debriefs ≥ 5 but 0 topics tagged: show "No stumbled topics logged yet" | Must |
| FR-10.5 | Displayed on Analytics page and as Dashboard snapshot | Should |

#### FR-11: Funnel Conversion Analytics

| ID | Requirement | Priority |
|---|---|---|
| FR-11.1 | Bar chart showing: Applied → OA/Screening → Interviewing → Offer (absolute counts) | Must |
| FR-11.2 | Drop-off labels between stages | Should |
| FR-11.3 | Interpretation hints based on biggest drop-off point | Should |
| FR-11.4 | Causal disclaimer: "Based on your self-reported application data" | Must |
| FR-11.5 | Saved, Rejected, Ghosted excluded from funnel (shown separately as context) | Must |

#### FR-12: Resume Version Cohort Tracker

| ID | Requirement | Priority |
|---|---|---|
| FR-12.1 | Table: Resume Version | Total Apps | Callbacks (≥ OA/Screening) | Callback Rate (%) | Must |
| FR-12.2 | Cohort N < 15: hide rate, show "Gathering Data (X/15)" | Must |
| FR-12.3 | Cohort N ≥ 15: display actual rate | Must |
| FR-12.4 | Untagged applications shown as "Untagged" cohort | Should |
| FR-12.5 | Empty state: "Tag applications with resume versions to compare" | Must |

#### FR-13: Daily Triage / Action Center ⭐

| ID | Requirement | Priority |
|---|---|---|
| FR-13.1 | Max 3 items displayed, priority-ordered | Must |
| FR-13.2 | Priority 1 (🔴): Interview in next 48h | Must |
| FR-13.3 | Priority 2 (🟡): Debrief pending > 24h post-interview | Must |
| FR-13.4 | Priority 3 (🔵): Application stale ≥ 14 days | Must |
| FR-13.5 | Priority 4 (🟣): Topic in ≥ 3 debriefs | Should |
| FR-13.6 | Each item has: primary action button, Dismiss, Snooze (7 days) | Must |
| FR-13.7 | Empty state: "You're all caught up!" | Must |

#### FR-14: Data Export

| ID | Requirement | Priority |
|---|---|---|
| FR-14.1 | Export button in Settings | Must |
| FR-14.2 | JSON format: full nested structure | Must |
| FR-14.3 | CSV format: flattened table | Must |
| FR-14.4 | Includes ALL user data | Must |
| FR-14.5 | Browser download, no server-side storage | Must |
| FR-14.6 | File naming: jobcaliber_export_YYYY-MM-DD.{json|csv} | Should |

#### FR-15: Security

| ID | Requirement | Priority |
|---|---|---|
| FR-15.1 | express-validator on all API endpoints | Must |
| FR-15.2 | express-mongo-sanitize globally | Must |
| FR-15.3 | express-rate-limit on auth endpoints (10/15min) | Must |
| FR-15.4 | Every query scoped to { userId: req.user._id } | Must |
| FR-15.5 | No endpoint allows cross-user data access | Must |

### 5.2 Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | API response time (standard queries) | < 500ms |
| NFR-02 | API response time (aggregation queries) | < 2s |
| NFR-03 | Frontend initial load | < 3s |
| NFR-04 | Kanban render performance | Smooth with 100+ cards |
| NFR-05 | Search input debounce | 300ms |
| NFR-06 | Quick-Add total interaction time | < 15 seconds |
| NFR-07 | Debrief completion time (median) | < 120 seconds |

---

## 6. User Stories

### Format

> **As a** [user type], **I want** [action], **so that** [value].

### By Feature (35 total)

#### Authentication (4 stories)

**US-01:** As a new user, I want to create an account with name/email/password, so that I have a private space to track my search.

**US-02:** As a returning user, I want to log in with email/password, so that I can access my data.

**US-03:** As a logged-in user, I want to log out, so that my session is securely terminated.

**US-04:** As a logged-in user, I want to update my profile settings (name, target role, stale threshold), so that I can customize my experience.

#### Quick-Add (3 stories)

**US-05:** As a job seeker, I want to log an application with just company + role, so that tracking doesn't interrupt my flow.

**US-06:** As a user wanting more detail, I want to expand "Add More Details" for optional fields, so that I can add context without being forced to.

**US-07:** As a user applying to many companies, I want a duplicate warning if same company+role exists within 60 days, so that I don't apply twice.

#### Pipeline (3 stories)

**US-08:** As a user, I want a Kanban board with 7 columns, so that I can visually see where each application stands.

**US-09:** As a user whose status changed, I want to drag a card to update its status, so that I can manage the pipeline quickly.

**US-10:** As a user with 100+ apps, I want a Table view toggle, so that I can see dense, sortable data.

#### Stale Engine (2 stories)

**US-11:** As a user who applied weeks ago, I want stale apps auto-flagged after 14 days, so that I know which need follow-up.

**US-12:** As a user seeing a stale app, I want one-click "Mark Ghosted" or "Archive", so that I can resolve stale items fast.

#### Search & Filtering (2 stories)

**US-13:** As a user, I want to search by company/role name, so that I can find specific applications.

**US-14:** As a user, I want to filter by status, date, and stale flag, so that I can focus on subsets.

#### JD Snapshot (2 stories)

**US-15:** As a user, I want to paste the full JD text, so that I have a copy when the posting is deleted.

**US-16:** As a user preparing for an interview, I want to view the cached JD, so that I can review requirements.

#### Interview Logger (2 stories)

**US-17:** As a user with an interview, I want to log round details (type, date, interviewer), so that I track my progress.

**US-18:** As a user, I want to see all rounds in a chronological timeline, so that I have a complete picture.

#### Debrief ⭐ (3 stories)

**US-19:** As a user who just interviewed, I want the system to prompt me to debrief, so that I capture experience while fresh.

**US-20:** As a user debriefing, I want a 3-step guided modal (rating → questions → topics), so that it takes ~90 seconds.

**US-21:** As a user, I want to view and edit past debriefs, so that I can add forgotten details.

#### Topic Tagging (2 stories)

**US-22:** As a user tagging topics, I want autocomplete from a taxonomy, so that I use consistent names.

**US-23:** As a user with an unlisted difficulty, I want to type custom tags, so that I can track any topic.

#### Weakness Heatmap ⭐ (2 stories)

**US-24:** As a user with debriefs, I want a ranked chart of my most frequent stumbled topics, so that I know what to study.

**US-25:** As a user with < 5 debriefs, I want a clear message that more data is needed, so that I'm not misled.

#### Funnel Analytics (2 stories)

**US-26:** As a user, I want a funnel chart showing drop-offs between stages, so that I identify my bottleneck.

**US-27:** As a user viewing the funnel, I want interpretation hints, so that I know what action to take.

#### Resume Cohort (2 stories)

**US-28:** As a user iterating resumes, I want callback rate comparison per version, so that I know which performs better.

**US-29:** As a user with < 15 apps per version, I want "Gathering Data" instead of a rate, so that I'm not misled.

#### Action Center ⭐ (2 stories)

**US-30:** As a user opening JobCaliber, I want my top 3 tasks displayed, so that I take immediate action.

**US-31:** As a user, I want to dismiss or snooze action items, so that I manage my task list.

#### Data Export (1 story)

**US-32:** As a user, I want to download all my data as JSON or CSV, so that I own my data.

#### Security (3 stories)

**US-33:** As a user, I want input validation on all submissions, so that bad data doesn't corrupt my records.

**US-34:** As a user, I want NoSQL injection prevention, so that my data is secure.

**US-35:** As a user, I want my data completely isolated from other users, so that privacy is guaranteed.

---

## 7. MVP Scope

### Included (15 features, 35 stories)

| # | Feature | Signature? |
|---|---|---|
| F1 | Authentication (JWT + bcrypt + HttpOnly cookies) | |
| F2 | Quick-Add Application (2 fields, progressive disclosure) | |
| F3 | 7-Stage Kanban + Table View (drag-and-drop) | |
| F4 | Stale Application Engine (14-day default) | |
| F5 | Search & Combined Filters | |
| F6 | Job Description Snapshot | |
| F7 | Interview Round Logger | |
| F8 | 90-Second Post-Interview Debrief | ⭐ |
| F9 | Stumbled Topic Tagging (taxonomy + custom) | |
| F10 | Weakness Frequency Heatmap (N ≥ 5) | ⭐ |
| F11 | Funnel Conversion Analytics | |
| F12 | Resume Version Cohort Tracker (N ≥ 15) | |
| F13 | Daily Triage / Action Center (max 3) | ⭐ |
| F14 | Data Export (JSON / CSV) | |
| F15 | Security & Data Protection | |

### Excluded from MVP

- Password reset, OAuth, email verification (V2)
- JD keyword aggregation, source analytics, role analytics (V2)
- Chrome extension, AI debrief assistant (V3)
- All rejected features (see Section 4)

---

## 8. Acceptance Criteria Summary

### Critical Acceptance Tests

| Test | Pass Condition |
|---|---|
| Quick-Add speed | User creates an application in < 15 seconds |
| Duplicate detection | Warning shown for same company+role within 60 days |
| Drag-and-drop | Card moves to new column, status updates in DB, stale recalculates |
| Stale detection | App in "Applied" for 14+ days shows stale badge |
| Debrief flow | 3-step modal saves rating + questions + topics in one API call |
| Weakness guardrail | Chart hidden below 5 debriefs. Progress message shown instead. |
| Resume guardrail | Rate hidden below 15 apps. "Gathering Data (X/15)" shown instead. |
| Action Center | Max 3 items. Priority order: interview > debrief > stale > weakness |
| Tenant isolation | User A cannot read/write User B's data via any API endpoint |
| Rate limiting | 11th login attempt within 15 min returns 429 Too Many Requests |
| NoSQL injection | Request with `{ "$gt": "" }` in email field is sanitized |
| Data export | Downloaded JSON contains ALL user applications, rounds, questions, logs |

---

## 9. Constraints

| Constraint | Detail |
|---|---|
| **Tech stack** | Pure MERN (MongoDB, Express, React, Node) + Tailwind CSS. No Python, Docker, Next.js, GraphQL. |
| **No new frameworks** | Only technologies the developer already knows |
| **No AI in MVP** | No LLM APIs, no AI features |
| **No paid dependencies** | Free/open-source only |
| **Monorepo** | `client/` and `server/` in single repository |
| **Desktop-first** | Responsive but optimized for desktop browsers |

---

## 10. Dependencies

| Dependency | Purpose | Version Policy |
|---|---|---|
| react | Frontend framework | ^18.x |
| vite | Build tool | Latest stable |
| tailwindcss | Styling | Latest stable |
| recharts | Charts/visualizations | Latest stable |
| @hello-pangea/dnd | Drag-and-drop | Latest stable |
| express | Backend framework | ^4.x |
| mongoose | MongoDB ODM | ^7.x or ^8.x |
| bcryptjs | Password hashing | Latest stable |
| jsonwebtoken | JWT creation/verification | Latest stable |
| express-validator | Input validation | Latest stable |
| express-mongo-sanitize | NoSQL injection prevention | Latest stable |
| express-rate-limit | Rate limiting | Latest stable |
| date-fns | Date utilities | Latest stable |
| cookie-parser | Cookie handling | Latest stable |
| cors | Cross-origin requests | Latest stable |
| dotenv | Environment variables | Latest stable |

**Rule:** Every dependency must have a reason. No "nice-to-have" packages.

---

## 11. Glossary

| Term | Definition |
|---|---|
| **Application** | A single job application tracked by the user |
| **Pipeline** | The 7-stage progression: Saved → Applied → OA/Screening → Interviewing → Offer → Rejected → Ghosted |
| **Stale** | An application in Applied or OA/Screening with no status change for ≥ 14 days |
| **Interview Round** | A single interview event within an application (e.g., Technical Round 2) |
| **Debrief** | A structured post-interview self-reflection capturing rating, questions, and stumbled topics |
| **Stumbled Topic** | A topic the user self-reports as a difficulty during a debrief |
| **Problem Log** | A database record of a single stumbled topic instance |
| **Weakness Heatmap** | Aggregated view of all stumbled topics ranked by frequency |
| **Funnel** | Visualization showing how many applications pass through each pipeline stage |
| **Resume Cohort** | A group of applications tagged with the same resume version label |
| **Action Center** | Dashboard widget showing max 3 prioritized, actionable tasks |
| **Tenant Isolation** | Security pattern ensuring users can only access their own data |
| **Guardrail** | Minimum sample size threshold preventing misleading statistical displays |
