<!-- 📌 WHAT IS THIS FILE? This is the central progress tracker for JobCaliber. It shows at a glance: how much is done, what's currently active, what's next, and what's blocked. It is updated after EVERY completed step. -->

# JobCaliber — Project Progress

> **Last Updated:** 2026-09-26  
> **Reference:** `docs/TASKS.md` for full step details  
> **Tech Learning Guide:** `TECH_LEARNING.md` for technology notes and internals

---

## Overall Progress

| Metric | Value |
|---|---|
| **Total Steps** | 147 |
| **Completed Steps** | 12 |
| **Remaining Steps** | 135 |
| **Overall Progress** | **8%** |
| **Current Phase** | Phase 1 — Architecture (In Progress) |
| **Current Step** | Step 1.2 — Define Application collection schema |
| **Current Status** | `READY` (Step 1.1 Complete; Awaiting approval for Step 1.2) |

```
Progress: [########········································] 8%
           12 / 147 steps
```

---

## Phase Progress

| Phase | Total Steps | Completed | Remaining | Progress | Status |
|---|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% | ✅ Complete |
| Phase 1: Architecture | 15 | 1 | 14 | 7% | 🟡 In Progress |
| Phase 2: Foundation | 36 | 0 | 36 | 0% | ⬜ Not started |
| Phase 3: Core Data | 31 | 0 | 31 | 0% | ⬜ Not started |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% | ⬜ Not started |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% | ⬜ Not started |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% | ⬜ Not started |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% | ⬜ Not started |

---

## Next Step

### Step 1.2 — Define Application collection schema

| Field | Value |
|---|---|
| **Status** | `NOT_STARTED` (Ready to start) |
| **Phase** | Phase 1: Architecture |
| **Objective** | Write the complete Mongoose schema definition for the `applications` collection. |
| **Why** | The most complex collection — 15+ fields, enum validation, computed virtuals, multiple indexes. |
| **Files involved** | `docs/DATABASE_SCHEMA.md` (to be updated) |
| **Expected result** | Full schema with status enum, optional fields, timestamps, indexes for search/filter. |
| **Verification** | Schema covers FR-02 through FR-06 requirements. All 7 statuses present in enum. |

---

## Latest Completed Step & Concepts Learned

### Step 1.1 — Define User collection schema
- **Date Completed:** 2026-09-26
- **Files Created/Modified:** `docs/DATABASE_SCHEMA.md` (created), `docs/TASKS.md`, `docs/PROJECT_PROGRESS.md`
- **Key Concepts Specified:**
  - Multi-tier defense strategy: Client-side validation → express-validator payload sanitization → Mongoose schema constraints → MongoDB unique index.
  - User model structure: `fullName`, sanitized `email`, `passwordHash` (`select: false`), optional `targetRole`, and configurable `staleThresholdDays` (default 14, range 7-45).
  - Security boundaries: `select: false` on `passwordHash` with custom `toJSON` serialization transform to guarantee credentials never leak to API consumers.
  - Tenant isolation anchoring: `User._id` serves as the tenant boundary for all downstream collections (`userId: req.user._id`).

---

## Recently Completed

| Step | Title | Date |
|---|---|---|
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
| 1.2 | Define Application collection schema | Phase 1: Architecture |
| 1.3 | Define InterviewRound collection schema | Phase 1: Architecture |
| 1.4 | Define InterviewQuestion and ProblemLog schemas | Phase 1: Architecture |

---

## Milestones

| Milestone | Steps Complete | Target | Status |
|---|---|---|---|
| 📄 Documentation complete | 11/11 | Phase 0 | ✅ Complete |
| 📐 Architecture complete | 1/15 | Phase 1 | 🟡 In Progress |
| 🔐 Auth working (end-to-end) | 0/36 | Phase 2 | ⬜ |
| 📋 Pipeline working (Kanban + Table) | 0/31 | Phase 3 | ⬜ |
| ⏰ Stale + Action Center working | 0/9 | Phase 4 | ⬜ |
| 🎤 Debrief flow working | 0/19 | Phase 5 | ⬜ |
| 📊 Analytics charts working | 0/13 | Phase 6 | ⬜ |
| ✅ MVP complete | 0/13 | Phase 7 | ⬜ |
