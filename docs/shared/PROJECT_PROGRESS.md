<!-- 📌 WHAT IS THIS FILE? This is the central progress tracker for JobCaliber. It shows at a glance: how much is done, what's currently active, what's next, and what's blocked. It is updated after EVERY completed step. -->

# JobCaliber — Project Progress

> **Last Updated:** 2026-09-26  
> **Reference:** `docs/shared/TASKS.md` for full step details  
> **Tech Learning Hub:** `tech-learning/README.md` for technology notes and internals

---

## Overall Progress

| Metric | Value |
|---|---|
| **Total Steps** | 147 |
| **Completed Steps** | 19 |
| **Remaining Steps** | 128 |
| **Overall Progress** | **13%** |
| **Current Phase** | Phase 1 — Architecture (In Progress) |
| **Current Step** | Step 1.9 — Define Analytics API endpoints |
| **Current Status** | `READY` (Step 1.8 Complete; Awaiting approval for Step 1.9) |

```
Progress: [#############···································] 13%
           19 / 147 steps
```

---

## Phase Progress

| Phase | Total Steps | Completed | Remaining | Progress | Status |
|---|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% | ✅ Complete |
| Phase 1: Architecture | 15 | 8 | 7 | 53% | 🟡 In Progress |
| Phase 2: Foundation | 36 | 0 | 36 | 0% | ⬜ Not started |
| Phase 3: Core Data | 31 | 0 | 31 | 0% | ⬜ Not started |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% | ⬜ Not started |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% | ⬜ Not started |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% | ⬜ Not started |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% | ⬜ Not started |

---

## Next Step

### Step 1.9 — Define Analytics API endpoints

| Field | Value |
|---|---|
| **Status** | `NOT_STARTED` (Ready to start) |
| **Phase** | Phase 1: Architecture |
| **Objective** | Specify the request/response contract for `/api/analytics/*` endpoints. |
| **Why** | Analytics endpoints return aggregated data — their response shapes must be clearly defined for the frontend. |
| **Files involved** | `docs/Architecture/API_SPEC.md` (update — Analytics section) |
| **Expected result** | 4 endpoints: funnel, weaknesses, resume-cohorts, triage. Response shapes include guardrail metadata. |
| **Verification** | Triage endpoint priority rules documented. Guardrail thresholds included in response. |

---

## Latest Completed Step & Concepts Learned

### Step 1.8 — Define Interview & Debrief API endpoints
- **Date Completed:** 2026-09-26
- **Files Created/Modified:** `docs/Architecture/API_SPEC.md` (updated — Section 6), `docs/shared/TASKS.md`, `docs/shared/PROJECT_PROGRESS.md`, `tech-learning/rest-api.md`
- **Key Concepts Specified:**
  - **Transactional Debrief Endpoint (FR-08, FR-09):** Specified atomic multi-collection persistence inside a MongoDB session transaction for `POST /api/interviews/:id/debrief` — saving round rating/notes, inserting questions, and logging stumbled topics simultaneously without partial failure risk.
  - **Cross-Entity Status Synchronization:** When scheduling an interview round (`POST /api/interviews`), the parent application is automatically advanced from `Saved`, `Applied`, or `OA / Screening` to `Interviewing`, resetting the stale timer.
  - **Lookahead Window & Countdown Computation (FR-07.4, FR-13.1):** Designed `GET /api/interviews/upcoming` with a lookahead filter (`?days=7`) and computed `hoursUntilInterview` field to power Dashboard cards and Action Center Nudge #1 (< 48 hours).
  - **Guardrail Metadata in Response (ADR-005):** Included `analyticsGuardrailStatus` (tracking progress toward 5 debriefs) in the debrief response so the client UI can celebrate progress and explain why the heatmap is still locked.
  - **Full Replacement Semantics with PUT:** Designed `PUT /api/interviews/:id/debrief` to replace child questions and problem logs atomically rather than executing complex diffing.
  - **Cascade Deletion:** Specified cascade removal of child questions and problem logs when an interview round is deleted.

---

## Recently Completed

| Step | Title | Date |
|---|---|---|
| 1.8 | Define Interview & Debrief API endpoints | 2026-09-26 |
| 1.7 | Define Application CRUD API endpoints | 2026-09-26 |
| 1.6 | Define Auth API endpoints | 2026-09-26 |
| 1.5 | Define database relationships and index strategy | 2026-09-26 |
| 1.4 | Define InterviewQuestion and ProblemLog schemas | 2026-09-26 |
| 1.3 | Define InterviewRound collection schema | 2026-09-26 |
| 1.2 | Define Application collection schema | 2026-09-26 |
| 1.1 | Define User collection schema | 2026-09-26 |
| 0.11 | Granular task decomposition & project setup files | 2026-09-24 |
| 0.10 | Create TASKS.md | 2026-09-24 |
| 0.9 | Rebuild README.md | 2026-09-24 |
| 0.8 | Rebuild AGENTS.md | 2026-09-24 |
| 0.7 | Create DECISIONS.md | 2026-09-24 |
| 0.6 | Create PRD.md | 2026-09-24 |
| 0.5 | Create PROJECT_MASTER_SPEC.md | 2026-09-24 |
| 0.4 | Create docs/RESEARCH.md | 2026-09-24 |
| 0.3 | Feature Specification & User Stories | 2026-09-24 |
| 0.2 | Product Direction & Positioning | 2026-09-24 |
| 0.1 | Product Discovery & Validation Research | 2026-09-24 |

---

## Blocked

None.

---

## Next Steps

| Step | Title | Phase |
|---|---|---|
| 1.8 | Define Interview & Debrief API endpoints | Phase 1: Architecture |
| 1.9 | Define Analytics API endpoints | Phase 1: Architecture |
| 1.10 | Define page inventory and routing structure | Phase 1: Architecture |

---

## Milestones

| Milestone | Steps Complete | Target | Status |
|---|---|---|---|
| 📄 Documentation complete | 11/11 | Phase 0 | ✅ Complete |
| 📐 Architecture complete | 7/15 | Phase 1 | 🟡 In Progress |
| 🔐 Auth working (end-to-end) | 0/36 | Phase 2 | ⬜ |
| 📋 Pipeline working (Kanban + Table) | 0/31 | Phase 3 | ⬜ |
| ⏰ Stale + Action Center working | 0/9 | Phase 4 | ⬜ |
| 🎤 Debrief flow working | 0/19 | Phase 5 | ⬜ |
| 📊 Analytics charts working | 0/13 | Phase 6 | ⬜ |
| ✅ MVP complete | 0/13 | Phase 7 | ⬜ |
