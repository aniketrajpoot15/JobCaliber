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
| **Completed Steps** | 13 |
| **Remaining Steps** | 134 |
| **Overall Progress** | **9%** |
| **Current Phase** | Phase 1 — Architecture (In Progress) |
| **Current Step** | Step 1.3 — Define InterviewRound collection schema |
| **Current Status** | `READY` (Step 1.2 Complete; Awaiting approval for Step 1.3) |

```
Progress: [#########·······································] 9%
           13 / 147 steps
```

---

## Phase Progress

| Phase | Total Steps | Completed | Remaining | Progress | Status |
|---|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% | ✅ Complete |
| Phase 1: Architecture | 15 | 2 | 13 | 13% | 🟡 In Progress |
| Phase 2: Foundation | 36 | 0 | 36 | 0% | ⬜ Not started |
| Phase 3: Core Data | 31 | 0 | 31 | 0% | ⬜ Not started |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% | ⬜ Not started |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% | ⬜ Not started |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% | ⬜ Not started |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% | ⬜ Not started |

---

## Next Step

### Step 1.3 — Define InterviewRound collection schema

| Field | Value |
|---|---|
| **Status** | `NOT_STARTED` (Ready to start) |
| **Phase** | Phase 1: Architecture |
| **Objective** | Write the Mongoose schema for `interviewrounds` collection. |
| **Why** | Links applications to their interview rounds. Tracks debrief completion status. |
| **Files involved** | `docs/Architecture/DATABASE_SCHEMA.md` (to be updated) |
| **Expected result** | Schema with roundType enum, scheduledDate, selfRating, debriefCompleted flag. |
| **Verification** | Schema covers FR-07 and FR-08 requirements. roundType enum has all 5 types. |

---

## Latest Completed Step & Concepts Learned

### Step 1.2 — Define Application collection schema
- **Date Completed:** 2026-09-26
- **Files Created/Modified:** `docs/Architecture/DATABASE_SCHEMA.md` (updated — Section 3), `docs/shared/TASKS.md`, `docs/shared/PROJECT_PROGRESS.md`, `tech-learning/mongoose.md`
- **Key Concepts Specified:**
  - **Enum Validation in Mongoose:** How `enum: { values: [...], message: '...' }` enforces a fixed set of allowed values at the database layer. The 7-stage pipeline status and `workMode`/`source` dropdowns all use enums to prevent invalid data from entering the system.
  - **Compound Indexes & Left-Prefix Rule:** How MongoDB compound indexes work left-to-right, why `userId` must be the first key in every compound index for tenant isolation, and how each index maps to a specific query pattern (pipeline view, duplicate detection, date filtering, archive filtering, text search).
  - **Persisted Computed Fields vs Virtuals:** The design decision to persist `isStale` as a real field rather than computing it on-the-fly as a Mongoose virtual. Trade-off: slightly stale data that needs recalculation triggers, but enables efficient filtering and batch operations.
  - **Soft Delete Pattern (`isArchived`):** Why archiving is preferred over hard-deleting documents — preserving analytics integrity (funnel conversion rates would be corrupted by missing documents).
  - **Empty String vs `null` for Optional Enums:** Using `''` as the "not specified" default for optional enum fields (`workMode`, `source`) to avoid `null` checks throughout the codebase while still passing Mongoose enum validation.

---

## Recently Completed

| Step | Title | Date |
|---|---|---|
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
| 1.3 | Define InterviewRound collection schema | Phase 1: Architecture |
| 1.4 | Define InterviewQuestion and ProblemLog schemas | Phase 1: Architecture |
| 1.5 | Define database relationships and index strategy | Phase 1: Architecture |

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
