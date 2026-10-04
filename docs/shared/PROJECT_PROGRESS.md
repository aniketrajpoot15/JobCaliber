<!-- 📌 WHAT IS THIS FILE? This is the central progress tracker for JobCaliber. It shows at a glance: how much is done, what's currently active, what's next, and what's blocked. It is updated after EVERY completed step. -->

# JobCaliber — Project Progress

> **Last Updated:** 2026-10-04  
> **Reference:** `docs/shared/TASKS.md` for full step details  
> **Tech Learning Hub:** `tech-learning/README.md` for technology notes and internals

---

## Overall Progress

| Metric | Value |
|---|---|
| **Total Steps** | 147 |
| **Completed Steps** | 38 |
| **Remaining Steps** | 109 |
| **Overall Progress** | **26%** |
| **Current Phase** | Phase 2 — Foundation (In Progress: 12/36 steps) |
| **Current Step** | Step 2.12 — Add password comparison method to User model (Complete) |
| **Current Status** | `READY` for Step 2.13 — Create JWT utility functions |

```
Progress: [########################························] 26%
           38 / 147 steps
```

---

## Phase Progress

| Phase | Total Steps | Completed | Remaining | Progress | Status |
|---|---|---|---|---|---|
| Phase 0: Research & Documentation | 11 | 11 | 0 | 100% | ✅ Complete |
| Phase 1: Architecture | 15 | 15 | 0 | 100% | ✅ Complete |
| Phase 2: Foundation | 36 | 12 | 24 | 33% | 🟡 In Progress |
| Phase 3: Core Data | 31 | 0 | 31 | 0% | ⬜ Not started |
| Phase 4: Pipeline Engine | 9 | 0 | 9 | 0% | ⬜ Not started |
| Phase 5: Interview & Debrief | 19 | 0 | 19 | 0% | ⬜ Not started |
| Phase 6: Analytics & Insights | 13 | 0 | 13 | 0% | ⬜ Not started |
| Phase 7: Polish & Hardening | 13 | 0 | 13 | 0% | ⬜ Not started |

---

## Next Step

### Step 2.13 — Create JWT utility functions

| Field | Value |
|---|---|
| **Status** | `NOT_STARTED` (Ready to start) |
| **Phase** | Phase 2: Foundation |
| **Objective** | Create `server/utils/jwtUtils.js` with token generation and cookie-setting helpers. |
| **Why** | JWT logic is reused across register, login, and middleware — extract into a utility. |
| **Files involved** | `server/utils/jwtUtils.js` (created) |
| **Expected result** | Two functions: `generateToken(userId)` and `sendTokenResponse(user, statusCode, res)`. Token uses JWT_SECRET and JWT_EXPIRE from env. |
| **Verification** | Code review — HttpOnly cookie options: httpOnly=true, sameSite='Lax', secure=(NODE_ENV==='production'). |

---

## Latest Completed Step & Concepts Learned

### Step 2.12 — Add password comparison method to User model
- **Date Completed:** 2026-10-04
- **Files Created/Modified:** `server/models/User.js` (modified — added `userSchema.methods.matchPassword`)
- **Key Concepts Learned:**
  - **Mongoose Instance Methods (`schema.methods`):** Methods added to `schema.methods` become callable on document instances (e.g. `user.matchPassword(pwd)`). This encapsulates document-specific business logic right on the model where the data lives.
  - **Function Scope vs Arrow Function:** Must use regular `function (enteredPassword)` syntax so Mongoose correctly binds `this` to the document instance. In arrow functions `() => {}`, `this` would point to the module scope and be `undefined`.
  - **Constant-Time Comparison & Timing Attacks:** `bcrypt.compare` doesn't do a simple string equality check (`===`). It computes the hash using the embedded salt/cost and compares bytes in constant time. This prevents attackers from measuring microsecond differences in response times to guess passwords character-by-character.
  - **`select: false` Interaction:** Since `passwordHash` is excluded by default queries, controllers calling `matchPassword` must explicitly include `.select('+passwordHash')` on their find queries (e.g., `User.findOne({ email }).select('+passwordHash')`).
  - **Encapsulation & DRY:** Controllers don't need to know the password hashing algorithm, salt rounds, or library used. They just call `await user.matchPassword(enteredPassword)`.

---

## Recently Completed

| Step | Title | Date |
|---|---|---|
| 2.12 | Add password comparison method to User model | 2026-10-04 |
| 2.11 | Add password hashing pre-save hook | 2026-10-04 |
| 2.10 | Create User Mongoose schema | 2026-10-04 |
| 2.9 | Create server constants file | 2026-10-04 |
| 2.8 | Create global error handler middleware | 2026-09-30 |
| 2.7 | Connect the application to MongoDB | 2026-09-30 |
| 2.6 | Create MongoDB connection module | 2026-09-29 |
| 2.5 | Configure Express middleware | 2026-09-29 |
| 2.4 | Create Express application entry point | 2026-09-29 |
| 2.3 | Create .env.example and .env files | 2026-09-28 |

---

## Blocked

None.

---

## Milestones

| Milestone | Steps Complete | Target | Status |
|---|---|---|---|
| 📄 Documentation complete | 11/11 | Phase 0 | ✅ Complete |
| 📐 Architecture complete | 15/15 | Phase 1 | ✅ Complete |
| 🔐 Auth working (end-to-end) | 11/36 | Phase 2 | 🟡 In Progress |
| 📋 Pipeline working (Kanban + Table) | 0/31 | Phase 3 | ⬜ |
| ⏰ Stale + Action Center working | 0/9 | Phase 4 | ⬜ |
| 🎤 Debrief flow working | 0/19 | Phase 5 | ⬜ |
| 📊 Analytics charts working | 0/13 | Phase 6 | ⬜ |
| ✅ MVP complete | 0/13 | Phase 7 | ⬜ |
