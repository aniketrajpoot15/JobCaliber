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
| **Completed Steps** | 14 |
| **Remaining Steps** | 133 |
| **Overall Progress** | **10%** |
| **Current Phase** | Phase 1 — Architecture (In Progress) |
| **Current Step** | Step 1.4 — Define InterviewQuestion and ProblemLog schemas |
| **Current Status** | `READY` (Step 1.3 Complete; Awaiting approval for Step 1.4) |

```
Progress: [##########······································] 10%
           14 / 147 steps
```

---

## Phase Progress

| Phase | Total Steps | Completed | Remaining | Progress | Status |
|---|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% | ✅ Complete |
| Phase 1: Architecture | 15 | 3 | 12 | 20% | 🟡 In Progress |
| Phase 2: Foundation | 36 | 0 | 36 | 0% | ⬜ Not started |
| Phase 3: Core Data | 31 | 0 | 31 | 0% | ⬜ Not started |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% | ⬜ Not started |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% | ⬜ Not started |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% | ⬜ Not started |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% | ⬜ Not started |

---

## Next Step

### Step 1.4 — Define InterviewQuestion and ProblemLog schemas

| Field | Value |
|---|---|
| **Status** | `NOT_STARTED` (Ready to start) |
| **Phase** | Phase 1: Architecture |
| **Objective** | Write Mongoose schemas for `interviewquestions` and `problemlogs` collections. |
| **Why** | These store the debrief output — questions asked and topics struggled with. |
| **Files involved** | `docs/Architecture/DATABASE_SCHEMA.md` (to be updated) |
| **Expected result** | Both schemas defined with correct references (roundId, userId). |
| **Verification** | ProblemLog includes userId for direct aggregation queries (weakness heatmap). |

---

## Latest Completed Step & Concepts Learned

### Step 1.3 — Define InterviewRound collection schema
- **Date Completed:** 2026-09-26
- **Files Created/Modified:** `docs/Architecture/DATABASE_SCHEMA.md` (updated — Section 4), `docs/shared/TASKS.md`, `docs/shared/PROJECT_PROGRESS.md`, `tech-learning/mongoose.md`
- **Key Concepts Specified:**
  - **Separate Collection vs. Embedded Array:** Why `interviewrounds` is kept as a dedicated collection rather than embedded in `applications`. A dedicated collection enables fast O(log N) index scans for Action Center triage queries (finding overdue debriefs across all applications) and provides stable `_id` references for child entities.
  - **Denormalization for Tenant Isolation (Security Rule 9):** Adding `userId` directly on `InterviewRound` documents even though `applicationId` already points to the application. This allows every round and triage query to enforce tenant isolation at the index level without expensive `$lookup` joins.
  - **Debrief Lifecycle & Nullable Ratings:** Designing `selfRating` (1 to 5) as nullable until the 90-second debrief is completed (`debriefCompleted: true`), ensuring clear state separation between scheduled upcoming rounds and debriefed past rounds.
  - **Virtual Populate (`localField` / `foreignField`):** Defining virtual relationships (`questions`, `problemLogs`) on `InterviewRound` so related child documents can be populated on demand without storing fragile array-of-IDs in the parent document.
  - **Compound Temporal Indexes:** Indexing `{ applicationId: 1, scheduledDate: 1 }` for timeline rendering and `{ userId: 1, debriefCompleted: 1, scheduledDate: 1 }` for Action Center triage prompts.

---

## Recently Completed

| Step | Title | Date |
|---|---|---|
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
| 1.4 | Define InterviewQuestion and ProblemLog schemas | Phase 1: Architecture |
| 1.5 | Define database relationships and index strategy | Phase 1: Architecture |
| 1.6 | Define Auth API endpoints | Phase 1: Architecture |

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
