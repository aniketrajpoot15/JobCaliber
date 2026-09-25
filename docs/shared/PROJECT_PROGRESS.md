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
| **Completed Steps** | 15 |
| **Remaining Steps** | 132 |
| **Overall Progress** | **10%** |
| **Current Phase** | Phase 1 — Architecture (In Progress) |
| **Current Step** | Step 1.5 — Define database relationships and index strategy |
| **Current Status** | `READY` (Step 1.4 Complete; Awaiting approval for Step 1.5) |

```
Progress: [##########······································] 10%
           15 / 147 steps
```

---

## Phase Progress

| Phase | Total Steps | Completed | Remaining | Progress | Status |
|---|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% | ✅ Complete |
| Phase 1: Architecture | 15 | 4 | 11 | 27% | 🟡 In Progress |
| Phase 2: Foundation | 36 | 0 | 36 | 0% | ⬜ Not started |
| Phase 3: Core Data | 31 | 0 | 31 | 0% | ⬜ Not started |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% | ⬜ Not started |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% | ⬜ Not started |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% | ⬜ Not started |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% | ⬜ Not started |

---

## Next Step

### Step 1.5 — Define database relationships and index strategy

| Field | Value |
|---|---|
| **Status** | `NOT_STARTED` (Ready to start) |
| **Phase** | Phase 1: Architecture |
| **Objective** | Document the entity relationships and explain why each index exists. |
| **Why** | Indexes determine query performance. Wrong indexes = slow analytics. |
| **Files involved** | `docs/Architecture/DATABASE_SCHEMA.md` (to be updated) |
| **Expected result** | ER diagram (text-based), compound index list with query justification. |
| **Verification** | Every index maps to a specific query pattern (search, filter, aggregation). |

---

## Latest Completed Step & Concepts Learned

### Step 1.4 — Define InterviewQuestion and ProblemLog schemas
- **Date Completed:** 2026-09-26
- **Files Created/Modified:** `docs/Architecture/DATABASE_SCHEMA.md` (updated — Sections 5 & 6), `docs/shared/TASKS.md`, `docs/shared/PROJECT_PROGRESS.md`, `tech-learning/mongoose.md`
- **Key Concepts Specified:**
  - **Direct `userId` Anchor for Aggregations:** Why `ProblemLog` includes `userId` directly rather than relying on `roundId` joins. The Weakness Frequency Heatmap executes `$match: { userId }` followed by `$group: { _id: "$topicName", count: { $sum: 1 } }` in a single covered index scan without `$lookup` overhead.
  - **Compound Unique Constraints for Deduplication:** Using `{ roundId: 1, topicName: 1 }` with `{ unique: true }` to enforce FR-09.5 at the database storage layer, preventing duplicate topic tags from skewing candidate statistics.
  - **Two-Level Taxonomy Architecture:** Standardizing technical, behavioral, and system design topics while seamlessly accommodating custom candidate tags (`category: 'Custom'`).
  - **Sample Size Guardrails (ADR-005):** Backend protection requiring N ≥ 5 completed debriefs before revealing ranked weakness patterns to prevent misleading analytics from tiny samples.

---

## Recently Completed

| Step | Title | Date |
|---|---|---|
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
| 1.5 | Define database relationships and index strategy | Phase 1: Architecture |
| 1.6 | Define Auth API endpoints | Phase 1: Architecture |
| 1.7 | Define Application CRUD API endpoints | Phase 1: Architecture |

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
