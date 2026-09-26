<!-- 📌 WHAT IS THIS FILE? This is a learning reference for REST API design — the architectural pattern used for all communication between JobCaliber's frontend (React) and backend (Express.js). Read this to understand what REST is, why we use it, how HTTP methods and status codes work, and how our specific API is structured. -->

# REST API Design

> **Technology:** REST (Representational State Transfer)  
> **Category:** Architecture Pattern  
> **Status:** 🟡 `DESIGNING` — API contracts being specified in Phase 1  
> **Introduced In:** Step 1.6 (Auth API specification)  
> **Last Updated:** 2026-09-26  
> **Project File:** `docs/Architecture/API_SPEC.md`

---

## 1. What Is It?

REST (Representational State Transfer) is an **architectural style** for designing APIs over HTTP. It's not a library you install — it's a set of conventions for how clients (browsers, mobile apps) communicate with servers.

In REST:
- Every piece of data (a user, an application, an interview) is a **resource**
- Each resource has a **URL** (e.g., `/api/applications/123`)
- You perform **actions** on resources using HTTP methods (GET, POST, PUT, DELETE)
- The server responds with **status codes** (200, 404, 500) and **JSON data**

Think of it like a library:
- The **URL** is the book's call number (identifies *which* book)
- The **HTTP method** is *what you're doing* (reading it, borrowing it, returning it)
- The **status code** is the librarian's response ("Here you go" / "We don't have that book" / "Library is closed")

---

## 2. Why Are We Using It?

| Reason | Explanation |
|---|---|
| **Industry standard** | Nearly every web API uses REST. Learning it once applies everywhere. |
| **Simple mental model** | URL = resource, Method = action, Status code = result |
| **Stateless** | Each request is independent — the server doesn't need to remember previous requests. Authentication is handled via JWT cookie sent with each request. |
| **Works with any frontend** | React, mobile apps, Postman, curl — anything that speaks HTTP can use a REST API |
| **Matches Express.js** | Express was designed for REST: `app.get()`, `app.post()`, `app.put()`, `app.delete()` map directly to HTTP methods |

---

## 3. Where Is It Used in Our Project?

```
┌──────────────┐      REST API (HTTP + JSON)      ┌──────────────┐
│              │  ──────────────────────────────►  │              │
│   React App  │                                   │  Express.js  │
│  (Frontend)  │  ◄──────────────────────────────  │  (Backend)   │
│              │                                   │              │
└──────────────┘                                   └──────────────┘

Every user action in the browser → HTTP request to the API → JSON response back
```

**Project file:** All endpoints are specified in `docs/Architecture/API_SPEC.md`

**4 API route groups:**

| Prefix | Purpose | Defined In |
|---|---|---|
| `/api/auth` | Registration, login, logout, session check | Step 1.6 (✅ Done) |
| `/api/applications` | CRUD operations on job applications | Step 1.7 (✅ Done) |
| `/api/interviews` | Interview rounds and debriefs | Step 1.8 (✅ Done) |
| `/api/analytics` | Aggregated stats and insights | Step 1.9 |

---

## 4. Prerequisites

Before reading this file, you should understand:
- **HTTP basics** — What a URL is, what a browser does when you visit a page
- **JSON** — JavaScript Object Notation (`{ "key": "value" }`)
- **Client-server model** — Frontend sends requests, backend processes them and responds

---

## 5. Core Concepts

### 5.1 Resources

A **resource** is any piece of data the API manages. In JobCaliber:

| Resource | URL Pattern | Example |
|---|---|---|
| User (self) | `/api/auth/me` | The currently logged-in user |
| Application | `/api/applications/:id` | A specific job application |
| Application list | `/api/applications` | All of the user's applications |
| Interview round | `/api/interviews/:id` | A specific interview round |

The `:id` is a **path parameter** — it gets replaced with an actual MongoDB ObjectId like `60f7b2a1e13e8c001f8e4b2a`.

### 5.2 HTTP Methods (Verbs)

HTTP methods tell the server what **action** to perform on the resource:

| Method | Purpose | Analogy | Example |
|---|---|---|---|
| `GET` | **Read** a resource | Looking at a book | `GET /api/applications` → List all applications |
| `POST` | **Create** a new resource | Adding a new book to the shelf | `POST /api/applications` → Create a new application |
| `PUT` | **Replace** a resource entirely | Swapping a book for a new edition | Rarely used in our API |
| `PATCH` | **Update** part of a resource | Editing one chapter of a book | `PATCH /api/applications/:id` → Update some fields |
| `DELETE` | **Remove** a resource | Removing a book from the shelf | `DELETE /api/applications/:id` → Archive an application |

**Key insight:** The URL identifies *which resource*, the method identifies *what action*. Same URL, different methods, different actions:
- `GET /api/applications` → **List** applications
- `POST /api/applications` → **Create** an application

### 5.3 HTTP Status Codes

Status codes are 3-digit numbers the server sends back to indicate what happened:

#### Success Codes (2xx) — "It worked"

| Code | Name | When Used | JobCaliber Example |
|---|---|---|---|
| `200` | OK | Request succeeded | `GET /api/auth/me` → returns user data |
| `201` | Created | New resource created | `POST /api/auth/register` → new user created |
| `204` | No Content | Success, but nothing to return | (not used in our MVP) |

#### Client Error Codes (4xx) — "You did something wrong"

| Code | Name | When Used | JobCaliber Example |
|---|---|---|---|
| `400` | Bad Request | Invalid input / validation failed | Missing email in registration |
| `401` | Unauthorized | Not logged in / invalid token | Accessing `/api/applications` without a JWT cookie |
| `403` | Forbidden | Logged in but not allowed | Trying to access another user's data |
| `404` | Not Found | Resource doesn't exist | `GET /api/applications/invalidId` |
| `409` | Conflict | Duplicate resource | Registering with an email that already exists |
| `429` | Too Many Requests | Rate limit exceeded | More than 10 login attempts in 15 minutes |

#### Server Error Codes (5xx) — "Something broke on our end"

| Code | Name | When Used | JobCaliber Example |
|---|---|---|---|
| `500` | Internal Server Error | Unexpected crash | Database connection lost |

**Memory aid:** 
- **2xx** = ✅ Success
- **4xx** = ❌ Client's fault (fix your request)
- **5xx** = 💥 Server's fault (try again later)

### 5.4 Request / Response Cycle

Every API interaction follows this cycle:

```
CLIENT (React app)                           SERVER (Express.js)
─────────────────                           ───────────────────
1. User clicks "Register"
2. Build request object:
   - Method: POST
   - URL: /api/auth/register
   - Headers: Content-Type: application/json
   - Body: { fullName, email, password }
3. Send HTTP request ─────────────────────► 4. Receive request
                                             5. Validate input
                                             6. Hash password
                                             7. Save to MongoDB
                                             8. Generate JWT
                                             9. Set cookie
                                             10. Build response:
                                                 - Status: 201
                                                 - Body: { success, data }
11. Receive response ◄───────────────────── 12. Send response
13. Read response.data.success
14. If true → redirect to dashboard
    If false → show error message
```

### 5.5 JSON Request and Response Bodies

All data is sent as JSON (JavaScript Object Notation):

**Request body** (what the client sends):
```json
{
  "fullName": "Aniket Rajpoot",
  "email": "aniket@example.com",
  "password": "MySecure1"
}
```

**Response body** (what the server returns):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "fullName": "Aniket Rajpoot",
      "email": "aniket@example.com",
      "staleThresholdDays": 14
    }
  }
}
```

---

## 6. How It Works — Key Patterns

### 6.1 Consistent Response Shape

Every JobCaliber API response follows the same structure. This means the frontend can use the same parsing logic everywhere:

**Success shape:**
```json
{
  "success": true,
  "message": "optional human-readable message",
  "data": { /* the actual resource data */ }
}
```

**Error shape:**
```json
{
  "success": false,
  "message": "What went wrong (shown to user)",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

**Why this matters:**
- The frontend can always check `response.data.success` first
- `message` is always safe to show in a toast notification
- `errors[]` (only on validation failures) maps to specific form fields

### 6.2 Error Message Normalization (Security Pattern)

On login, two different failures return the **same** error message:

| Scenario | Status | Message |
|---|---|---|
| Email doesn't exist | `401` | `"Invalid email or password"` |
| Email exists, wrong password | `401` | `"Invalid email or password"` |

**Why?** If the messages were different ("User not found" vs "Wrong password"), an attacker could:
1. Try random emails until they get "Wrong password"
2. Now they know that email is registered
3. Focus brute-force on that known email

This technique is called **user enumeration prevention** — the API reveals nothing about which emails exist.

### 6.3 Cookie-Based Authentication

Unlike many tutorials that use `localStorage` for JWT tokens, JobCaliber uses **HttpOnly cookies**:

```
                    Traditional (INSECURE)                Our Approach (SECURE)
                    ─────────────────────                 ─────────────────────
Token storage:      localStorage                          HttpOnly cookie
JS can read it:     ✅ Yes (XSS vulnerable!)              ❌ No (immune to XSS)
Sent automatically: ❌ No (must add header manually)      ✅ Yes (browser sends it)
Cleared on logout:  Must call localStorage.removeItem()   Server sets maxAge=0
```

**How it works in practice:**

```
LOGIN:
1. Client sends { email, password }
2. Server validates credentials
3. Server creates JWT
4. Server calls res.cookie('token', jwt, { httpOnly: true, ... })
5. Browser automatically stores the cookie (invisible to JS)

SUBSEQUENT REQUESTS:
1. Client sends GET /api/applications
2. Browser automatically attaches Cookie: token=<jwt>
3. Server reads req.cookies.token
4. Server verifies JWT
5. Server returns data

LOGOUT:
1. Client sends POST /api/auth/logout
2. Server calls res.cookie('token', '', { maxAge: 0 })
3. Browser deletes the cookie
```

### 6.4 Rate Limiting

Rate limiting prevents brute-force attacks by capping how many requests a client can make:

```
Auth endpoints: 10 requests per 15 minutes per IP address

Attempt 1:  ✅ Allowed  (9 remaining)
Attempt 2:  ✅ Allowed  (8 remaining)
...
Attempt 10: ✅ Allowed  (0 remaining)
Attempt 11: ❌ 429 Too Many Requests — wait 15 minutes
```

**Math:** To try 10,000 passwords, an attacker would need:
- 10,000 ÷ 10 = 1,000 windows × 15 minutes = **250 hours (10+ days)**
- With a strong password, brute force becomes impractical

### 6.5 Validation Layers

Input validation happens at **multiple layers** — defense in depth:

```
Layer 1: Frontend (React)
  └── Form validation for UX — shows errors instantly, before network request
       Example: Red border on email field if format is wrong

Layer 2: Express-Validator (route middleware)
  └── Server-side validation — the REAL gate. Never trust client input.
       Example: body('email').isEmail().normalizeEmail()

Layer 3: Mongoose Schema
  └── Database-level safety — catches anything layers 1 & 2 missed
       Example: email unique index prevents duplicate registrations
```

**Why three layers?** Because Layer 1 can be bypassed (anyone can send raw HTTP requests with curl/Postman). Layer 2 is the actual security boundary. Layer 3 is the safety net.

### 6.6 Query Parameters for Filtering & Pagination (Step 1.7)

When an API endpoint returns a list of resources, query parameters control what subset is returned:

```
GET /api/applications?status=Applied&search=google&page=1&limit=20&sort=-appliedDate
                      └─── filters ───┘ └─ search ─┘ └── pagination ──┘ └── sorting ──┘
```

**Key patterns:**

| Pattern | Example | Purpose |
|---|---|---|
| **Multi-value filter** | `?status=Applied,Interviewing` | Comma-separated list for OR within one field |
| **Date range filter** | `?startDate=2026-01-01&endDate=2026-09-30` | Two params define a range |
| **Boolean toggle** | `?stale=true` | Simple on/off filter |
| **Text search** | `?search=google` | Partial, case-insensitive match |
| **Pagination** | `?page=2&limit=20` | `skip = (page-1) * limit` |
| **Sorting** | `?sort=-appliedDate` | `-` prefix = descending order |
| **View mode** | `?view=kanban` | Same data, different response shape |

**Filters combine with AND logic:** All active filters must match for a result to be included.

### 6.7 Dual Response Shapes from One Endpoint (Step 1.7)

The `GET /api/applications` endpoint returns two different JSON structures based on `?view=kanban|table`:

- **Kanban view:** Groups applications into columns by status (no pagination — need all cards for drag-and-drop)
- **Table view:** Flat array with pagination metadata (`page`, `totalPages`, `hasNextPage`, `hasPrevPage`)

**Why not two separate endpoints?** The same data, filters, and query logic apply to both views. The only difference is how the results are structured in the response. One endpoint avoids duplicating all the filter/search/validation logic.

### 6.8 Endpoint Separation for Side Effects (Step 1.7)

Sometimes updating different fields on the same resource requires different behavior:

```
PATCH /api/applications/:id         → Updates general fields (location, notes, etc.)
PATCH /api/applications/:id/status  → Updates status + RESETS lastStatusUpdate + RECALCULATES isStale
PATCH /api/applications/:id/archive → Toggles isArchived flag
```

**Why not one PATCH endpoint?** Status changes trigger side effects (resetting timestamps, recalculating staleness). If status were mixed with general field updates, the controller couldn't tell whether side effects should fire.

### 6.9 Computed Fields in Responses (Step 1.7)

Some response fields aren't stored in the database — they're calculated in the controller and added to the response:

```
daysInStage = Math.floor((Date.now() - lastStatusUpdate) / 86400000)
```

**Why compute server-side?** If the frontend calculated `daysInStage`, every client would need the same date math logic. Computing it server-side ensures consistency and keeps the frontend simple.

### 6.10 404 vs 403 for Tenant Isolation (Step 1.7)

When User A tries to access User B's resource:

| Response | What attacker learns |
|---|---|
| `403 Forbidden` | "This resource EXISTS but I can't access it" |
| `404 Not Found` | "I don't know if it exists or not" |

JobCaliber always returns **404** for tenant mismatches. This prevents information leakage about which resource IDs exist in the system.

### 6.11 Transactional API Design (Step 1.8)

In real-world applications, a single user action often needs to modify multiple collections simultaneously. In JobCaliber, completing the **90-Second Post-Interview Debrief** (`POST /api/interviews/:id/debrief`) must atomically:
1. Update the `interviewrounds` document (set `rating`, `overallNotes`, `debriefCompleted: true`, `debriefCompletedAt: now`).
2. Insert multiple `interviewquestions` documents.
3. Insert multiple `problemlogs` documents.

```
                    ┌───────────────────────────┐
                    │ POST /:id/debrief (Atomic)│
                    └─────────────┬─────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐
│ Update Round     │    │ Insert Questions  │    │ Insert Problems  │
│ (rating, notes)  │    │ (InterviewQuestion│    │ (ProblemLog      │
│                  │    │  collection)      │    │  collection)     │
└──────────────────┘    └───────────────────┘    └──────────────────┘
```

**Why not 3 separate API calls from the frontend?**
- **Risk of partial failure:** If the round update succeeds but the network drops before problem logs are sent, data becomes permanently corrupted/incomplete.
- **Network overhead:** 3 round-trips over mobile networks creates noticeable lag.
- **Transactional guarantees:** Using a MongoDB session transaction (`session.startTransaction()`) ensures that either ALL records are saved, or NONE are saved.

### 6.12 Cross-Entity Status Synchronization (Step 1.8)

When creating or updating a child resource, the parent resource often needs a state transition:
- When a user schedules an interview round (`POST /api/interviews`), the parent application's status is automatically transitioned from `Saved`, `Applied`, or `OA / Screening` to `Interviewing`.
- It also resets `lastStatusUpdate = new Date()` and `isStale = false`.

This keeps the Kanban board and pipeline in sync without requiring the user to manually drag cards around or make two separate requests.

### 6.13 Guardrail Metadata in API Responses (Step 1.8)

Rather than just returning the saved record, intelligent APIs return **guardrail progress** to help the frontend render actionable, reassuring UI:

```json
{
  "analyticsGuardrailStatus": {
    "totalCompletedDebriefs": 3,
    "minimumRequiredForHeatmap": 5,
    "heatmapUnlocked": false
  }
}
```

The frontend immediately knows to show: *"Complete 2 more debriefs to reveal your weakness heatmap (3/5)"* without having to make a separate query.

### 6.14 Full Replacement Semantics with PUT (Step 1.8)

While `PATCH` applies partial field updates, `PUT` is used for **full resource replacement**.
When revising a debrief (`PUT /api/interviews/:id/debrief`):
- Instead of diffing which questions were added, changed, or removed, the controller deletes the existing questions/problem logs for that round and inserts the new array.
- This is much simpler, deterministic, and avoids race conditions when questions are re-ordered or deleted.

---

## 7. Project-Specific Implementation

### 7.1 Our 4 Auth Endpoints

| Method | Path | Auth? | Rate Limited? | Purpose |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | No | Yes | Create account + set cookie |
| `POST` | `/api/auth/login` | No | Yes | Authenticate + set cookie |
| `POST` | `/api/auth/logout` | No | Yes | Clear cookie |
| `GET` | `/api/auth/me` | Yes | No | Return current user |

### 7.2 Why POST for Logout?

Logout changes state (destroys the session). HTTP convention:
- **GET** = read-only, safe, no side effects
- **POST** = state-changing action

If logout were `GET /api/auth/logout`, then:
- A browser prefetching links could accidentally log you out
- An `<img src="/api/auth/logout">` tag in a malicious email would log you out
- Search engine crawlers hitting the URL would log you out

### 7.3 JWT Payload — Minimal by Design

Our JWT contains only:
```json
{ "id": "60f7b2a1e13e8c001f8e4b2a" }
```

**Not** this (tempting but wrong):
```json
{ "id": "...", "fullName": "Aniket", "email": "aniket@example.com", "role": "user" }
```

**Why?** 
1. **Stale data:** If the user changes their name, the JWT still says "Aniket" until it expires
2. **Cookie size:** Cookies are sent with *every* request. Bigger payload = more bandwidth
3. **Security:** Less data in the token = less data exposed if compromised

Instead, `GET /api/auth/me` always fetches fresh data from the database.

### 7.4 Our 7 Application Endpoints (Step 1.7)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/applications` | List with filters, search, pagination, stale recalc |
| `POST` | `/api/applications` | Create application (Quick-Add) + duplicate detection |
| `GET` | `/api/applications/:id` | Get single application (full detail with JD) |
| `PATCH` | `/api/applications/:id` | Update application fields |
| `PATCH` | `/api/applications/:id/status` | Change pipeline status + side effects |
| `PATCH` | `/api/applications/:id/archive` | Toggle archive (soft delete / restore) |
| `DELETE` | `/api/applications/:id` | Permanently delete + cascade children |

**Key design decisions:**
- **Quick-Add returns duplicate warnings (non-blocking):** If `companyName + roleTitle` matches within 60 days, the application is still created but includes a `warning` object
- **List endpoint recalculates stale flags on every fetch:** Catches time-based staleness transitions without a background job
- **Delete cascades to children:** When an application is deleted, all its interview rounds, questions, and problem logs are also deleted

### 7.5 Our 8 Interview & Debrief Endpoints (Step 1.8)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/interviews/upcoming` | List upcoming interviews (lookahead window, countdown) |
| `GET` | `/api/interviews/applications/:applicationId` | Get all rounds for an application (with child questions & problem logs) |
| `POST` | `/api/interviews` | Schedule round + sync application status to Interviewing |
| `GET` | `/api/interviews/:id` | Get single round detail with questions and problem logs |
| `PATCH` | `/api/interviews/:id` | Update round metadata (reschedule, interviewer, notes) |
| `POST` | `/api/interviews/:id/debrief` | Submit 90s debrief (rating + questions + problem logs in one transaction) |
| `PUT` | `/api/interviews/:id/debrief` | Edit / replace existing debrief |
| `DELETE` | `/api/interviews/:id` | Delete round + cascade delete child data |

**Key design decisions:**
- **Debrief is transactional:** Modifies `interviewrounds`, `interviewquestions`, and `problemlogs` in a single MongoDB transaction.
- **Auto status transition:** Scheduling a round automatically moves the application to `'Interviewing'` and resets the stale timer.
- **Embedded guardrail metrics:** Debrief submission returns the current count toward the N ≥ 5 heatmap unlock threshold.

---

## 8. Small Examples

### 8.1 A Complete Request/Response Example (Register)

**Request:**
```
POST /api/auth/register HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "fullName": "Aniket Rajpoot",
  "email": "aniket@example.com",
  "password": "MySecure1"
}
```

**Successful Response:**
```
HTTP/1.1 201 Created
Set-Cookie: token=eyJhbGciOiJIUzI...; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800
Content-Type: application/json

{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "60f7b2a1e13e8c001f8e4b2a",
      "fullName": "Aniket Rajpoot",
      "email": "aniket@example.com",
      "targetRole": "",
      "staleThresholdDays": 14,
      "createdAt": "2026-09-26T10:00:00.000Z",
      "updatedAt": "2026-09-26T10:00:00.000Z"
    }
  }
}
```

**Failed Response (validation error):**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address" },
    { "field": "password", "message": "Password must be 8-128 characters" }
  ]
}
```

### 8.2 How the Frontend Will Call the API

```javascript
// Sending a login request from React (Phase 2)
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // ← CRITICAL: tells browser to send/receive cookies
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // Login worked! The cookie was set automatically by the browser.
      // We don't need to manually store anything — the browser handles the cookie.
      setUser(data.data.user);
      navigate('/dashboard');
    } else {
      // Show error to user
      setError(data.message);
    }
  } catch (err) {
    setError('Network error. Please try again.');
  }
};
```

**Key line:** `credentials: 'include'` — Without this, the browser will NOT send or receive HttpOnly cookies. This is the most common mistake when using cookie-based auth with `fetch`.

---

## 9. Important Terminology

| Term | Definition |
|---|---|
| **REST** | Representational State Transfer — an architectural style for APIs over HTTP |
| **Endpoint** | A specific URL + method combination (e.g., `POST /api/auth/login`) |
| **Resource** | A piece of data the API manages (user, application, interview) |
| **Route** | The Express.js code that maps a URL pattern to a handler function |
| **Controller** | The function that contains the business logic for an endpoint |
| **Middleware** | A function that runs BEFORE the controller (validation, auth checks) |
| **Status code** | 3-digit number indicating the result (200 OK, 404 Not Found, etc.) |
| **Request body** | JSON data sent from client to server (in POST/PUT/PATCH requests) |
| **Response body** | JSON data sent from server to client |
| **Path parameter** | Variable in the URL path (`:id` in `/api/applications/:id`) |
| **Query parameter** | Key-value pair after `?` in the URL (`/api/applications?status=Applied`) |
| **Rate limiting** | Capping how many requests a client can make per time window |
| **Idempotent** | An operation that produces the same result no matter how many times you call it (GET, PUT, DELETE are idempotent; POST is not) |
| **User enumeration** | An attack where the attacker discovers which emails/usernames exist |
| **CORS** | Cross-Origin Resource Sharing — controls which domains can call your API |

---

## 10. Common Mistakes

| # | Mistake | Why It's Wrong | Correct Approach |
|---|---|---|---|
| 1 | Using GET for logout | GET is for reading, not state changes; prefetching can trigger accidental logout | Use `POST /api/auth/logout` |
| 2 | Different error messages for "email not found" vs "wrong password" | Enables user enumeration attacks | Same message: `"Invalid email or password"` |
| 3 | Storing JWT in localStorage | Accessible to JavaScript → vulnerable to XSS attacks | HttpOnly cookie (ADR-007) |
| 4 | Forgetting `credentials: 'include'` on fetch | Browser won't send/receive cookies → auth breaks silently | Always include it for authenticated requests |
| 5 | Putting full user data in JWT payload | Stale data, bigger cookies, more exposure | Only `{ id }` — fetch fresh data via `/api/auth/me` |
| 6 | Validating only on the frontend | Anyone can send raw requests with curl/Postman | Always validate server-side with express-validator |
| 7 | Returning stack traces in production errors | Leaks internal code structure to attackers | Generic message: `"An unexpected error occurred"` |
| 8 | Hardcoding JWT_SECRET in code | Anyone reading the code can forge tokens | Use environment variables (`process.env.JWT_SECRET`) |
| 9 | Skipping rate limiting on auth endpoints | Brute-force password attacks become trivial | 10 requests per 15 minutes on `/api/auth/*` |
| 10 | Using `200` for everything | Client can't distinguish success from error without reading body | Use semantic status codes (201, 400, 401, etc.) |

---

## 11. Understanding Checklist

Before moving on, make sure you can answer these questions:

- [ ] What does REST stand for and what problem does it solve?
- [ ] What's the difference between GET, POST, PUT, PATCH, and DELETE?
- [ ] Why do we use different status codes instead of always returning 200?
- [ ] What does a `400` error mean vs a `401` vs a `404`?
- [ ] Why does our API always return `{ success, message, data }` or `{ success, message, errors }`?
- [ ] Why does login return the same error for "email not found" and "wrong password"?
- [ ] Why do we use HttpOnly cookies instead of localStorage for JWT?
- [ ] What does `credentials: 'include'` do and why is it required?
- [ ] Why is logout a POST request instead of GET?
- [ ] Why does our JWT only contain `{ id }` instead of the full user object?
- [ ] What is rate limiting and why is it important for auth endpoints?
- [ ] What's the difference between frontend validation and server-side validation?

---

## 12. Official Documentation

| Resource | URL | What To Read |
|---|---|---|
| MDN: HTTP Methods | https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods | GET, POST, PUT, DELETE reference |
| MDN: HTTP Status Codes | https://developer.mozilla.org/en-US/docs/Web/HTTP/Status | Complete status code reference |
| MDN: HTTP Cookies | https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies | How cookies work, HttpOnly, SameSite |
| MDN: Fetch API | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API | How to make HTTP requests from JavaScript |
| REST API Design Best Practices | https://restfulapi.net/ | REST conventions and patterns |
| Express.js Routing | https://expressjs.com/en/guide/routing.html | How Express maps URLs to handlers |

---

## 13. Learning Order

```
YOU JUST LEARNED: REST API Design (this file)

WHAT'S NEXT IN THE LEARNING PATH:
  → Node.js (nodejs.md)       — The runtime that executes our server code
  → Express.js (express.md)   — The framework that implements these REST endpoints
  → bcryptjs (bcrypt.md)      — How the password hashing in /api/auth/register works
  → JWT (jwt.md)              — How the token in the cookie is created and verified

These will be created when their respective implementation steps begin in Phase 2.
```
