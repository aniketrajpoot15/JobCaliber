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
| **Completed Steps** | 23 |
| **Remaining Steps** | 124 |
| **Overall Progress** | **16%** |
| **Current Phase** | Phase 1 — Architecture (In Progress) |
| **Current Step** | Step 1.13 — Define Action Center triage logic |
| **Current Status** | `READY` (Step 1.12 Complete; Awaiting approval for Step 1.13) |

```
Progress: [################································] 16%
           23 / 147 steps
```

---

## Phase Progress

| Phase | Total Steps | Completed | Remaining | Progress | Status |
|---|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% | ✅ Complete |
| Phase 1: Architecture | 15 | 12 | 3 | 80% | 🟡 In Progress |
| Phase 2: Foundation | 36 | 0 | 36 | 0% | ⬜ Not started |
| Phase 3: Core Data | 31 | 0 | 31 | 0% | ⬜ Not started |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% | ⬜ Not started |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% | ⬜ Not started |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% | ⬜ Not started |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% | ⬜ Not started |

---

## Next Step

### Step 1.13 — Define Action Center triage logic

| Field | Value |
|---|---|
| **Status** | `NOT_STARTED` (Ready to start) |
| **Phase** | Phase 1: Architecture |
| **Objective** | Document the exact algorithm for computing the top 3 action items. |
| **Why** | The Action Center has 4 trigger types with priority ordering — the logic must be unambiguous. |
| **Files involved** | `docs/Architecture/ANALYTICS_SPEC.md` (updated — Triage section) |
| **Expected result** | Priority algorithm: interview in 48h > pending debrief > stale app > recurring topic. |
| **Verification** | Max 3 items. Dismiss/snooze behavior documented. Edge cases covered. |

---

## Latest Completed Step & Concepts Learned

### Step 1.12 — Define MongoDB aggregation pipelines for analytics
- **Date Completed:** 2026-09-26
- **Files Created/Modified:** `docs/Architecture/ANALYTICS_SPEC.md` (created), `docs/shared/TASKS.md`, `docs/shared/PROJECT_PROGRESS.md`, `tech-learning/README.md`
- **Key Concepts Specified:**
  - **Funnel Progression Aggregation:** Cumulative funnel calculation logic ensuring applications at late stages (`Offer`) are correctly counted in earlier stages (`Applied`, `OA / Screening`, `Interviewing`). Designed drop-off formula, conversion rate math, and automatic bottleneck identification with non-causal feedback lookup.
  - **Weakness Heatmap Aggregation:** Single-collection aggregation on `problemlogs` leveraging denormalized `userId` index (`{ userId: 1, topicName: 1 }`) avoiding costly `$lookup` joins. Supports optional category filtering (`Technical`, `Behavioral`, `System Design`, `Custom`).
  - **Resume Cohort Comparison Aggregation:** Grouping applications by `resumeVersion` and evaluating advancement milestones (`OA / Screening`, `Interviewing`, `Offer`) to derive empirical conversion percentages.
  - **Sample-Size Guardrails (ADR-005 & ADR-006):** Enforced hard statistical thresholds — masking weakness pattern rankings when debriefs $N < 5$ (`"Complete 5 debriefs to reveal patterns (X/5)"`), and masking resume conversion rates when applications $N < 15$ (`"Gathering Data (X/15)"`).
  - **Three-Tier Truth Classification & Anti-Causal Rules:** Strict separation between `[FACT]`, `[USER LOG]`, and `[SYSTEM PATTERN]` data, prohibiting causal attribution.

---

## Recently Completed

| Step | Title | Date |
|---|---|---|
| 1.12 | Define MongoDB aggregation pipelines for analytics | 2026-09-26 |
| 1.11 | Define component hierarchy, layout structure & design system | 2026-09-26 |
| 1.10 | Define page inventory and routing structure | 2026-09-26 |
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
| 1.11 | Define component hierarchy and layout structure | Phase 1: Architecture |
| 1.12 | Define MongoDB aggregation pipelines for analytics | Phase 1: Architecture |
| 1.13 | Define Action Center triage logic | Phase 1: Architecture |

---

## Milestones

| Milestone | Steps Complete | Target | Status |
|---|---|---|---|
| 📄 Documentation complete | 11/11 | Phase 0 | ✅ Complete |
| 📐 Architecture complete | 10/15 | Phase 1 | 🟡 In Progress |
| 🔐 Auth working (end-to-end) | 0/36 | Phase 2 | ⬜ |
| 📋 Pipeline working (Kanban + Table) | 0/31 | Phase 3 | ⬜ |
| ⏰ Stale + Action Center working | 0/9 | Phase 4 | ⬜ |
| 🎤 Debrief flow working | 0/19 | Phase 5 | ⬜ |
| 📊 Analytics charts working | 0/13 | Phase 6 | ⬜ |
| ✅ MVP complete | 0/13 | Phase 7 | ⬜ |

