<!-- 📌 WHAT IS THIS FILE? This file records every major decision we made and WHY we made it. If you ever wonder "why did we choose 7 pipeline stages?" or "why no AI in MVP?" — the answer is here, with the alternatives we considered and the trade-offs we accepted. -->

# JOBCALIBER — DECISION LOG

> **Living record of all significant product, architecture, and engineering decisions.**  
> **Format:** Architecture Decision Records (ADRs)  
> **Last Updated:** 2026-09-24  
> **Total Decisions:** 14

---

## How to Use This Document

Each decision follows the ADR format:

- **Context:** What situation prompted this decision?
- **Problem:** What specific question needed answering?
- **Options:** What alternatives were considered?
- **Decision:** What was chosen?
- **Reason:** Why this option over the others?
- **Trade-offs:** What are the downsides of this choice?
- **Status:** `ACCEPTED` | `SUPERSEDED` | `DEPRECATED`
- **Date:** When was this decided?

New decisions are appended at the bottom. Superseded decisions are marked but never deleted (history matters).

---

## ADR-001: Product Name

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** The project needed a distinctive name that wouldn't collide with existing products.

**Problem:** What should the product be called?

**Options:**
1. **JobPulse** — Collision: multiple unrelated bots, apps, and agencies use this name
2. **HireLoop** — Collision: existing HR/recruiting tools
3. **JobCaliber** — Clean namespace, zero competing products

**Decision:** JobCaliber

**Reason:**
- 100% clean namespace — no competing job tracking or career analytics product shares this name
- Dual meaning: "caliber" as precision measurement (funnel metrics) + "caliber" as quality/standard (interview improvement)
- Full branding: "Measure your pipeline. Elevate your interview caliber."
- Distinct from the hundreds of "Jobify" clones on GitHub

**Trade-offs:**
- None identified. Name is available and distinctive.

---

## ADR-002: Technology Stack

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** The developer knows MERN stack fundamentals and wants to deepen that knowledge through this project.

**Problem:** What technology stack should be used?

**Options:**
1. **MERN + Tailwind CSS** — MongoDB, Express, React (Vite), Node.js, Tailwind
2. **Next.js + Prisma + PostgreSQL** — Full-stack React framework with SQL
3. **MERN + plain CSS** — Same stack without Tailwind
4. **Django + React** — Python backend with React frontend

**Decision:** MERN + Tailwind CSS (Option 1)

**Reason:**
- Developer already knows these technologies — no learning curve for unfamiliar tools
- MERN is the most common full-stack JS combination — maximizes portfolio value
- Tailwind enables rapid dark-mode-first responsive UI
- MongoDB's document model fits the nested data (apps → rounds → questions → logs)
- AGENTS.md explicitly prohibits: Python, Docker, Next.js, GraphQL, microservices

**Trade-offs:**
- MongoDB lacks JOIN operations — aggregation pipelines needed for cross-collection queries
- No server-side rendering (React SPA only) — acceptable for a dashboard app
- Tailwind utility classes can be verbose — but readability is good with component extraction

---

## ADR-003: Pipeline Stages — Fixed 7-Stage Enum

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** Applications move through a hiring pipeline. The system needs a defined set of stages.

**Problem:** How many stages? Should they be fixed or customizable?

**Options:**
1. **7 fixed stages** — Saved, Applied, OA/Screening, Interviewing, Offer, Rejected, Ghosted
2. **11 stages** — Adding Viewed, Recruiter Contacted, Final Round, Withdrawn, No Response
3. **Custom stages** — Let users define their own
4. **5 stages** — Simplified: Applied, Screening, Interviewing, Offer, Closed

**Decision:** 7 fixed stages (Option 1)

**Reason:**
- Covers all real-world hiring workflows without unnecessary granularity
- Fixed enum enables consistent MongoDB aggregation pipelines (funnel analytics)
- Removed stages were either unreliable (`Viewed`), redundant (`No Response` = `Ghosted`), or too subjective (`Final Round`)
- Custom stages would fragment analytics — users with different stages can't be compared, and aggregation queries become unpredictable

**Trade-offs:**
- Some users may want a `Withdrawn` stage — mitigated by archiving with a note
- `OA / Screening` combines two concepts — acceptable because both represent "first filter after applying"
- No way to represent "waiting for OA results" vs "completed OA" — the status is the current stage, not a sub-status

---

## ADR-004: Stale Threshold Default — 14 Days

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** Applications sitting without updates need to be flagged so users follow up or move on.

**Problem:** How many days without activity before flagging an application as stale?

**Options:**
1. **21 days** — Conservative, fewer false alarms
2. **14 days** — Matches research data: most meaningful responses come within 2 weeks
3. **10 days** — Aggressive, catches ghosting faster
4. **7 days** — Too aggressive for many industries

**Decision:** 14 days (Option 2), customizable 7-45 days

**Reason:**
- Research data: 37% of candidates hear back within 1 week, 44% within 2 weeks
- After 45 days, response is statistically unlikely
- 14 days balances "early enough to follow up" with "not so early it creates noise"
- User can customize to their preference (7-45 range)

**Trade-offs:**
- Some industries (government, academia) may have longer cycles — mitigated by customizable threshold
- May generate more stale alerts than 21-day default — mitigated by dismiss/snooze actions

---

## ADR-005: Weakness Heatmap Guardrail — N ≥ 5

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** The weakness heatmap aggregates stumbled topics across debriefs. With too few debriefs, "patterns" are noise.

**Problem:** How many debriefs are needed before showing weakness patterns?

**Options:**
1. **N ≥ 3** — Faster value, but patterns may be coincidence
2. **N ≥ 5** — Balanced: enough data for basic patterns, achievable by active users
3. **N ≥ 7** — More reliable, but hard to reach for many users
4. **N ≥ 10** — Very reliable, but most users would never unlock the feature

**Decision:** N ≥ 5 debriefs (Option 2)

**Reason:**
- 5 debriefs is achievable for a user who interviews at 5 companies (reasonable over 2-3 months)
- With 5 data points, a topic appearing 3+ times is a meaningful signal (60%+ frequency)
- Higher thresholds would prevent most users from ever seeing the feature's value
- Below 5, patterns are too likely to be coincidence

**Trade-offs:**
- 5 is still a small sample — patterns could be noise
- Mitigated by never claiming causation ("recorded in X debriefs", not "you're weak at X")

---

## ADR-006: Resume Cohort Guardrail — N ≥ 15

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** Resume cohort tracking compares callback rates across resume versions. Small samples produce misleading percentages.

**Problem:** How many applications per resume version before showing conversion rates?

**Options:**
1. **N ≥ 8** — Fastest value, but highly unreliable
2. **N ≥ 10** — More accessible, slightly more reliable
3. **N ≥ 15** — Statistically safer for basic percentage comparison
4. **N ≥ 20** — Most reliable, but very hard to reach

**Decision:** N ≥ 15 per cohort (Option 3)

**Reason:**
- With 15 applications, a 20% vs 7% callback rate is a meaningful difference (3 vs 1 callbacks)
- Below 15, a single callback more or less changes the rate dramatically (e.g., 1/5 = 20%, 2/5 = 40%)
- 15 is achievable for primary persona (Arjun: 150-250 apps) if they use 2-3 resume versions
- Higher thresholds would make the feature inaccessible for secondary persona (Priya: 60-80 apps with 4 versions)

**Trade-offs:**
- Some users may never reach N=15 per version — mitigated by "Gathering Data (X/15)" progress display
- May not be reached by users with many resume iterations (4+ versions) — but those users should focus on fewer versions anyway

---

## ADR-007: Authentication — JWT in HttpOnly Cookies

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** The application needs user authentication. Token storage choice affects security.

**Problem:** Where should the JWT be stored?

**Options:**
1. **HttpOnly cookie** — Server sets cookie; inaccessible to client JS
2. **localStorage** — Client stores token; accessible to JS (XSS vulnerable)
3. **sessionStorage** — Same as localStorage but cleared on tab close
4. **In-memory (React state)** — Lost on page refresh

**Decision:** HttpOnly cookie with SameSite=Lax (Option 1)

**Reason:**
- HttpOnly: Token cannot be read by client-side JavaScript → immune to XSS token theft
- SameSite=Lax: Prevents CSRF for non-GET requests while allowing normal navigation
- Secure flag (production): Cookie only sent over HTTPS
- This is the production-grade standard for SPAs with API backends

**Trade-offs:**
- Cookies are automatically sent with every request (including non-API requests) — mitigated by SameSite=Lax
- Requires cookie-parser middleware on the backend
- Cannot easily share token with third-party services — not needed for MVP

---

## ADR-008: Mandatory Fields — Only 2

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** Tracker abandonment is the #1 product risk. Research shows users quit when entry takes too long.

**Problem:** How many fields should be required when adding an application?

**Options:**
1. **2 fields:** companyName + roleTitle
2. **4 fields:** + status + appliedDate
3. **6 fields:** + source + jobUrl
4. **10+ fields:** Traditional tracker approach

**Decision:** 2 mandatory fields (Option 1)

**Reason:**
- Community consensus: "If a property isn't being used to make a decision, delete it"
- Status defaults to `Saved`, appliedDate defaults to today — no need to ask
- Every additional mandatory field adds ~3-5 seconds of friction and reduces tracker survival
- Progressive disclosure lets users add detail later if they want

**Trade-offs:**
- Minimal data on initial entry — some applications will have only company+role forever
- Analytics features (funnel, resume cohort) require optional fields — they only activate when enough data is present
- No source tracking by default — user must actively choose to fill this in

---

## ADR-009: Drag-and-Drop Library — @hello-pangea/dnd

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** The Kanban board requires drag-and-drop for status updates.

**Problem:** Which drag-and-drop library should be used?

**Options:**
1. **@hello-pangea/dnd** — Maintained, accessible fork of react-beautiful-dnd
2. **react-beautiful-dnd** — Original library (no longer maintained by Atlassian)
3. **dnd-kit** — Modern, flexible, but steeper learning curve
4. **react-dnd** — Powerful but complex; lower-level API
5. **Native HTML Drag and Drop** — No library; custom implementation

**Decision:** @hello-pangea/dnd (Option 1)

**Reason:**
- Fork of react-beautiful-dnd with active maintenance and bug fixes
- Excellent accessibility support (keyboard drag-and-drop)
- Simple API: `<DragDropContext>`, `<Droppable>`, `<Draggable>` — easy to learn
- Large community, abundant tutorials and examples
- Built specifically for list/board reordering (exactly our use case)

**Trade-offs:**
- Less flexible than dnd-kit for non-list drag scenarios — but we only need list/board
- Slightly larger bundle than native implementation — acceptable for the DX improvement

---

## ADR-010: Chart Library — Recharts

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** Analytics features need bar charts (weakness heatmap, funnel).

**Problem:** Which chart library should be used?

**Options:**
1. **Recharts** — Declarative React SVG charts
2. **Chart.js + react-chartjs-2** — Canvas-based, wrapper for React
3. **Nivo** — Feature-rich, D3-based React charts
4. **D3.js directly** — Maximum flexibility, maximum complexity
5. **Victory** — React components for data visualization

**Decision:** Recharts (Option 1)

**Reason:**
- Native React components — `<BarChart>`, `<Bar>`, `<XAxis>` feel natural in JSX
- SVG-based rendering — crisp at any resolution, easily styled
- Built-in responsive container — charts resize with viewport
- Sufficient for our needs: horizontal bar chart (weakness) + vertical bar chart (funnel)
- Good documentation, widely used in the React ecosystem

**Trade-offs:**
- Less customizable than D3 for exotic visualizations — but we only need standard bar charts
- Bundle size is moderate (~200KB) — acceptable for a dashboard app

---

## ADR-011: No AI Features in MVP

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** Many competitors market AI features (resume optimization, cover letter generation). The temptation to add AI is high.

**Problem:** Should JobCaliber include AI-powered features in MVP?

**Options:**
1. **No AI in MVP** — Focus on the diagnostic loop
2. **AI resume optimizer** — Parse JD and suggest resume changes
3. **AI debrief assistant** — Auto-tag topics from freeform notes
4. **AI cover letter generator** — Generate tailored letters

**Decision:** No AI in MVP (Option 1)

**Reason:**
- Community research: Teal and Huntr's AI features are criticized as "underwhelming" and "generic"
- Users say ChatGPT provides comparable or better results for free
- AI adds: API costs, rate limits, dependency on external services, and maintenance burden
- JobCaliber's differentiation is the diagnostic feedback loop, NOT AI writing tools
- Adding AI dilutes the product's focus and creates scope creep risk

**Trade-offs:**
- Some users may expect AI features given market trends
- May seem "less modern" compared to competitors — but competitors' AI is their weakness, not strength
- V3 can add targeted AI (debrief parsing, study recommendations) once the core loop is validated

---

## ADR-012: No Custom Statuses

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** Some users might want custom pipeline stages (e.g., "Background Check", "Reference Call").

**Problem:** Should users be able to define custom statuses?

**Options:**
1. **Fixed enum (7 stages)** — All users share the same pipeline
2. **Custom statuses** — Users define their own stages
3. **Fixed + one custom stage** — Hybrid approach

**Decision:** Fixed enum only (Option 1)

**Reason:**
- Fixed stages enable consistent MongoDB aggregation pipelines
- Funnel analytics require stable, known stage definitions to calculate drop-off
- Custom stages create data fragmentation — "Phone Screen" vs "Screening Call" vs "Initial Call" all mean the same thing
- The 7 stages cover > 95% of real hiring workflows based on research

**Trade-offs:**
- Cannot represent niche stages like "Background Check" — user can add as a note
- Some enterprise processes have 10+ stages — these users are not our primary audience
- If strongly demanded, consider for V2 with aggregation mapping (custom stages map to standard stages for analytics)

---

## ADR-013: Duplicate Detection — 60-Day Window

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** Users applying to 100-300+ jobs may accidentally apply to the same company + role twice.

**Problem:** How should duplicate applications be handled?

**Options:**
1. **Hard block** — Prevent creation entirely
2. **Soft warning (60 days)** — Warn but allow user to proceed
3. **No detection** — Allow duplicates silently
4. **Soft warning (30 days)** — Shorter window

**Decision:** Soft warning within 60-day window (Option 2)

**Reason:**
- Re-applying to the same role after 60+ days is legitimate (new headcount, new cycle)
- Hard blocking would frustrate users with valid reasons to re-apply
- No detection would let users appear disorganized to recruiters
- 60 days covers a typical hiring cycle — most roles fill or close within this window

**Trade-offs:**
- Comparison is case-insensitive string match on companyName + roleTitle — "Google" and "Alphabet/Google" would not trigger a warning
- Window may be too short for some users, too long for others — but 60 days is a reasonable default

---

## ADR-014: Monorepo Structure

**Date:** 2026-09-24  
**Status:** `ACCEPTED`

**Context:** The project has both a frontend (React) and backend (Express) component.

**Problem:** Should client and server be in one repo or separate repos?

**Options:**
1. **Monorepo** — `client/` and `server/` in single repository
2. **Split repos** — Separate `jobcaliber-client` and `jobcaliber-server` repos
3. **Full monorepo tooling** — Using Turborepo, Nx, or Lerna

**Decision:** Simple monorepo (Option 1)

**Reason:**
- Single repo simplifies development — one `git clone`, one set of issues, one PR for full-stack changes
- No need for monorepo tooling (Turborepo/Nx) at this project's scale
- Deployment is simpler when both projects live together
- Standard pattern for portfolio MERN projects

**Trade-offs:**
- Cannot independently version/deploy client and server — not needed at MVP scale
- Repo may grow large over time — acceptable for a single-developer project

---

## Future Decisions (Pending)

| Decision Needed | Phase | Current Status |
|---|---|---|
| Stale engine recalculation: on-read vs. cron | Architecture | Open |
| State management: Context API vs. useReducer patterns | Architecture | Open |
| API error response format standardization | Architecture | Open |
| Deployment platform (Render vs. Railway vs. Vercel) | Phase 6 | Open |
| Custom topic tag deduplication strategy | V2 | Open |
