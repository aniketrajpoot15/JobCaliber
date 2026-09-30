<!-- 📌 WHAT IS THIS FILE? This is the central progress tracker for JobCaliber. It shows at a glance: how much is done, what's currently active, what's next, and what's blocked. It is updated after EVERY completed step. -->

# JobCaliber — Project Progress

> **Last Updated:** 2026-09-30  
> **Reference:** `docs/shared/TASKS.md` for full step details  
> **Tech Learning Hub:** `tech-learning/README.md` for technology notes and internals

---

## Overall Progress

| Metric | Value |
|---|---|
| **Total Steps** | 147 |
| **Completed Steps** | 34 |
| **Remaining Steps** | 113 |
| **Overall Progress** | **23%** |
| **Current Phase** | Phase 2 — Foundation (In Progress: 8/36 steps) |
| **Current Step** | Step 2.8 — Create global error handler middleware (Complete) |
| **Current Status** | `READY` for Step 2.9 — Create server constants file |

```
Progress: [#####################···························] 23%
           34 / 147 steps
```

---

## Phase Progress

| Phase | Total Steps | Completed | Remaining | Progress | Status |
|---|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% | ✅ Complete |
| Phase 1: Architecture | 15 | 15 | 0 | 100% | ✅ Complete |
| Phase 2: Foundation | 36 | 8 | 28 | 22% | 🟡 In Progress |
| Phase 3: Core Data | 31 | 0 | 31 | 0% | ⬜ Not started |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% | ⬜ Not started |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% | ⬜ Not started |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% | ⬜ Not started |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% | ⬜ Not started |

---

## Next Step

### Step 2.9 — Create server constants file

| Field | Value |
|---|---|
| **Status** | `NOT_STARTED` (Ready to start) |
| **Phase** | Phase 2: Foundation |
| **Objective** | Create `server/utils/constants.js` with all enum values. |
| **Why** | Enums must be defined once and shared — no hardcoded strings anywhere. |
| **Files involved** | `server/utils/constants.js` (created) |
| **Expected result** | Exports: STATUS_ENUM, ROUND_TYPE_ENUM, WORK_MODE_ENUM, SOURCE_ENUM, MAX_ACTION_CENTER_ITEMS, DEFAULT_STALE_THRESHOLD_DAYS. |
| **Verification** | Code review — all 7 pipeline statuses present. All 5 round types present. |

---

## Latest Completed Step & Concepts Learned

### Step 2.8 — Create global error handler middleware
- **Date Completed:** 2026-09-30
- **Files Created/Modified:** `server/middleware/errorHandler.js` (created), `server/server.js` (modified — import + register as last middleware), `docs/shared/TASKS.md`, `docs/shared/PROJECT_PROGRESS.md`, `tech-learning/project-file-map.md`
- **Key Concepts Learned:**
  - **Error Middleware vs Normal Middleware:** Normal middleware has 3 params `(req, res, next)`. Error middleware has 4 params `(err, req, res, next)`. Express uses the parameter count to distinguish them — the 4th param tells Express "this is an error handler."
  - **Why Register LAST:** Error middleware must be the last `app.use()` call. Express routes errors to it only if no previous middleware handled them. If registered before routes, it never catches route errors.
  - **Mongoose Error Types:** Three specific error types get user-friendly messages:
    - `CastError` → invalid ObjectId format → 400
    - `code: 11000` → duplicate key violation → 409
    - `ValidationError` → schema validation failure → 400 with field-level errors
  - **Information Leakage Prevention:** Stack traces are ONLY included in development mode (`NODE_ENV=development`). In production, attackers would see file paths and internal structure.
  - **Conditional Spread:** `...(isDevelopment && { stack: err.stack })` — if condition is true, spreads the object; if false, spreads `false` (which adds nothing to the object).

---

## Recently Completed

| Step | Title | Date |
|---|---|---|
| 2.8 | Create global error handler middleware | 2026-09-30 |
| 2.7 | Connect the application to MongoDB | 2026-09-30 |
| 2.6 | Create MongoDB connection module | 2026-09-29 |
| 2.5 | Configure Express middleware | 2026-09-29 |
| 2.4 | Create Express application entry point | 2026-09-29 |
| 2.3 | Create .env.example and .env files | 2026-09-28 |
| 2.2 | Install server dependencies | 2026-09-28 |
| 2.1 | Create server directory and initialize package.json | 2026-09-28 |
| 1.15 | Architecture review & approval | 2026-09-27 |

---

## Blocked

None.

---

## Milestones

| Milestone | Steps Complete | Target | Status |
|---|---|---|---|
| 📄 Documentation complete | 11/11 | Phase 0 | ✅ Complete |
| 📐 Architecture complete | 15/15 | Phase 1 | ✅ Complete |
| 🔐 Auth working (end-to-end) | 8/36 | Phase 2 | 🟡 In Progress |
| 📋 Pipeline working (Kanban + Table) | 0/31 | Phase 3 | ⬜ |
| ⏰ Stale + Action Center working | 0/9 | Phase 4 | ⬜ |
| 🎤 Debrief flow working | 0/19 | Phase 5 | ⬜ |
| 📊 Analytics charts working | 0/13 | Phase 6 | ⬜ |
| ✅ MVP complete | 0/13 | Phase 7 | ⬜ |
