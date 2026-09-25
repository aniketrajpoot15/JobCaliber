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
| **Completed Steps** | 16 |
| **Remaining Steps** | 131 |
| **Overall Progress** | **11%** |
| **Current Phase** | Phase 1 — Architecture (In Progress) |
| **Current Step** | Step 1.6 — Define Auth API endpoints |
| **Current Status** | `READY` (Step 1.5 Complete; Awaiting approval for Step 1.6) |

```
Progress: [###########·····································] 11%
           16 / 147 steps
```

---

## Phase Progress

| Phase | Total Steps | Completed | Remaining | Progress | Status |
|---|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% | ✅ Complete |
| Phase 1: Architecture | 15 | 5 | 10 | 33% | 🟡 In Progress |
| Phase 2: Foundation | 36 | 0 | 36 | 0% | ⬜ Not started |
| Phase 3: Core Data | 31 | 0 | 31 | 0% | ⬜ Not started |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% | ⬜ Not started |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% | ⬜ Not started |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% | ⬜ Not started |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% | ⬜ Not started |

---

## Next Step

### Step 1.6 — Define Auth API endpoints

| Field | Value |
|---|---|
| **Status** | `NOT_STARTED` (Ready to start) |
| **Phase** | Phase 1: Architecture |
| **Objective** | Specify the exact request/response contract for `/api/auth/*` endpoints. |
| **Why** | API contracts prevent ambiguity during implementation — both sides agree on shapes. |
| **Files involved** | `docs/Architecture/API_SPEC.md` (to be created — Auth section) |
| **Expected result** | 4 endpoints fully specified: register, login, logout, me. Each with method, path, request body, response shape, error responses. |
| **Verification** | Covers FR-01.1 through FR-01.7. Rate limit rules documented. |

---

## Latest Completed Step & Concepts Learned

### Step 1.5 — Define database relationships and index strategy
- **Date Completed:** 2026-09-26
- **Files Created/Modified:** `docs/Architecture/DATABASE_SCHEMA.md` (updated — Sections 7 & 8), `docs/shared/TASKS.md`, `docs/shared/PROJECT_PROGRESS.md`, `tech-learning/mongodb.md`
- **Key Concepts Specified:**
  - **Entity Relationship Model & Cardinalities:** Formulated a complete text-based ER diagram detailing 1:N cardinalities across all 5 collections, identifying primary keys, foreign references, and virtual populate paths.
  - **Referential Integrity & Cascade Lifecycle Management:** Specified soft delete preservation (`isArchived: true` for applications to protect funnel conversion metrics) versus cascading hard deletes on account data purge.
  - **Master Index Inventory (20 Indexes):** Consolidated all single, compound, text, and unique indexes across the system, verifying that every major API query maps to a sub-5ms index scan (`IXSCAN`).
  - **The ESR Rule (Equality, Sort, Range):** Documented how compound index field ordering prevents expensive in-memory sorts (`SORT_KEY_GENERATOR`).
  - **The Left-Prefix Rule:** Leveraged left prefixes of compound indexes starting with `userId` to eliminate redundant single-field indexes, saving storage and write overhead.

---

## Recently Completed

| Step | Title | Date |
|---|---|---|
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
| 1.6 | Define Auth API endpoints | Phase 1: Architecture |
| 1.7 | Define Application CRUD API endpoints | Phase 1: Architecture |
| 1.8 | Define Interview & Debrief API endpoints | Phase 1: Architecture |

---

## Milestones

| Milestone | Steps Complete | Target | Status |
|---|---|---|---|
| 📄 Documentation complete | 11/11 | Phase 0 | ✅ Complete |
| 📐 Architecture complete | 2/15 | Phase 1 | 🟡 In Progress |
| 🔐 Auth working (end-to-end) | 0/36 | Phase 2 | ⬜ |
| 📋 Pipeline working (Kanban + Table) | 0/31 | Phase 3 | ⬜ |
| ⏰ Stale + Action Center working | 0/9 | Phase 4 | ⬜ |
| 🎤 Debrief flow working | 0/19 | Phase 5 | ⬜ |
| 📊 Analytics charts working | 0/13 | Phase 6 | ⬜ |
| ✅ MVP complete | 0/13 | Phase 7 | ⬜ |
