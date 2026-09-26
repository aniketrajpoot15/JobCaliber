<!-- 📌 WHAT IS THIS FILE? This is the frontend UI architecture specification for JobCaliber. It defines every page in the application, its URL route, authentication requirements, the component hierarchy, and the shared layout structure. Any developer or agent building React components and pages must follow this specification exactly. -->

# JOBCALIBER — UI ARCHITECTURE SPECIFICATION

> **Version:** 1.0.0  
> **Status:** Phase 1 (Architecture) — In Progress  
> **Last Updated:** 2026-09-26  
> **Frontend Stack:** React 18 + Vite + Tailwind CSS  
> **Routing Library:** React Router v6  
> **Reference Documents:**  
> - `docs/Research_And_Documentation/PRD.md` (Functional Requirements)  
> - `docs/Research_And_Documentation/PRODUCT_SPEC.md` (Section 11: Frontend Architecture)  
> - `docs/Architecture/API_SPEC.md` (API contracts consumed by each page)  
> - `AGENTS.md` (Section 8: File Organization)

---

## Table of Contents

1. [Page Inventory](#1-page-inventory)
2. [Routing Architecture](#2-routing-architecture)
3. [Component Hierarchy & Layout Structure](#3-component-hierarchy--layout-structure)
4. [Design System & Visual Language](#4-design-system--visual-language)

---

## 1. Page Inventory

### 1.1 Complete Page List

JobCaliber has **7 distinct pages** + **1 global overlay (Quick-Add Modal)**. Every page maps to at least one feature from the PRD.

| # | Page Name | Route | Auth Required? | Primary Feature(s) | PRD Reference |
|---|---|---|---|---|---|
| 1 | **Login** | `/login` | ❌ No (Public) | User authentication | FR-01 |
| 2 | **Register** | `/register` | ❌ No (Public) | Account creation | FR-01 |
| 3 | **Dashboard** | `/dashboard` | ✅ Yes (Protected) | Action Center, Pipeline summary, Weakness snapshot, Funnel quick-view | FR-13, FR-10, FR-11 |
| 4 | **Pipeline** | `/pipeline` | ✅ Yes (Protected) | Kanban board, Table view, Search & filters, Drag-and-drop | FR-03, FR-04, FR-05 |
| 5 | **Application Detail** | `/applications/:id` | ✅ Yes (Protected) | Full application view, JD snapshot, Interview timeline, Debrief history | FR-02, FR-06, FR-07, FR-08, FR-09 |
| 6 | **Analytics** | `/analytics` | ✅ Yes (Protected) | Funnel chart, Weakness heatmap, Resume cohort comparison | FR-10, FR-11, FR-12 |
| 7 | **Settings** | `/settings` | ✅ Yes (Protected) | Profile editing, Stale threshold config, Data export | FR-01.8, FR-04.5, FR-14 |
| — | **Quick-Add Modal** | *(overlay, no route)* | ✅ Yes (Protected) | Application capture in < 15s | FR-02 |

### 1.2 Page Descriptions

#### Page 1: Login (`/login`)

**Purpose:** Authenticate returning users.

| Aspect | Detail |
|---|---|
| **Auth** | Public — redirect to `/dashboard` if already logged in |
| **API Consumed** | `POST /api/auth/login` |
| **Key UI Elements** | Email input, Password input, Submit button, "Don't have an account? Register" link |
| **Error States** | Invalid credentials (401), Rate limited (429), Network error |
| **User Stories** | US-02 |

#### Page 2: Register (`/register`)

**Purpose:** Create a new user account.

| Aspect | Detail |
|---|---|
| **Auth** | Public — redirect to `/dashboard` if already logged in |
| **API Consumed** | `POST /api/auth/register` |
| **Key UI Elements** | Full name input, Email input, Password input, Confirm password input, Submit button, "Already have an account? Login" link |
| **Validation** | Client-side: all fields required, email format, password minimum 8 chars (1 uppercase + 1 number), passwords match. Server is source of truth. |
| **Error States** | Email already exists (409), Validation errors (400), Network error |
| **User Stories** | US-01 |

#### Page 3: Dashboard (`/dashboard`)

**Purpose:** The user's home screen. Shows the most important information at a glance — actionable tasks, pipeline summary, and analytics snapshots. This is the page the user sees immediately after login.

| Aspect | Detail |
|---|---|
| **Auth** | Protected — redirect to `/login` if not authenticated |
| **APIs Consumed** | `GET /api/analytics/triage`, `GET /api/applications?limit=0` (for summary counts), `GET /api/analytics/funnel`, `GET /api/analytics/weaknesses` |
| **Layout Sections** | See §1.3 below |
| **Empty State** | First-time user with 0 applications: welcome message + prominent Quick-Add CTA |
| **User Stories** | US-30, US-31 (Action Center), US-24 (Weakness snapshot), US-26 (Funnel quick-view) |

**Dashboard Layout (3 rows):**

```
┌──────────────────────────────────────────────────┐
│  ROW 1: ACTION CENTER (max 3 cards)              │
│  Priority-ordered triage items with action buttons│
│  Empty state: "You're all caught up! 🎉"         │
├──────────────────────────────────────────────────┤
│  ROW 2: PIPELINE OVERVIEW                        │
│  7 stage summary with count badges               │
│  Clickable → navigates to /pipeline              │
├──────────────┬───────────────────────────────────┤
│  ROW 3a:     │  ROW 3b:                          │
│  WEAKNESS    │  FUNNEL                            │
│  SNAPSHOT    │  QUICK-VIEW                        │
│  (Top 3 or   │  (Mini bar chart or                │
│   guardrail) │   stage counts)                    │
└──────────────┴───────────────────────────────────┘
```

#### Page 4: Pipeline (`/pipeline`)

**Purpose:** The main workspace for managing all applications. Users spend most of their time here. Supports two views: Kanban (visual) and Table (dense data).

| Aspect | Detail |
|---|---|
| **Auth** | Protected |
| **APIs Consumed** | `GET /api/applications` (with filters/pagination), `PATCH /api/applications/:id/status` (drag-and-drop), `POST /api/applications` (Quick-Add) |
| **Key UI Elements** | View toggle (Kanban / Table), Filter bar (search + status + date range + stale toggle), Active filter chips, "Clear All Filters" button |
| **Kanban View** | 7 columns (one per status). Cards show: company, role, days in stage, resume tag, stale badge. Drag-and-drop between columns. Column headers show count. |
| **Table View** | Sortable columns (company, role, status, applied date, days in stage, stale). Inline status dropdown. Paginated (20/page default). |
| **Empty State** | "No applications yet. Add your first one!" + Quick-Add button |
| **User Stories** | US-08, US-09, US-10, US-11, US-12, US-13, US-14 |

#### Page 5: Application Detail (`/applications/:id`)

**Purpose:** Full detail view for a single application. This is where users view/edit application data, manage interview rounds, and access debriefs.

| Aspect | Detail |
|---|---|
| **Auth** | Protected |
| **Route Parameter** | `:id` = MongoDB ObjectId of the application |
| **APIs Consumed** | `GET /api/applications/:id`, `PATCH /api/applications/:id`, `PATCH /api/applications/:id/status`, `PATCH /api/applications/:id/archive`, `DELETE /api/applications/:id`, `GET /api/interviews/applications/:id`, `POST /api/interviews`, `POST /api/interviews/:id/debrief`, `PUT /api/interviews/:id/debrief` |
| **Key UI Sections** | Header (company, role, status, dates, stale badge), Job Description snapshot (collapsible), Interview Timeline (chronological rounds with debrief indicators), Notes area, Action buttons |
| **Error States** | Application not found (404), Application belongs to another user (404 — tenant isolation), Network error |
| **User Stories** | US-15, US-16, US-17, US-18, US-19, US-20, US-21, US-22, US-23 |

**Application Detail Layout:**

```
┌──────────────────────────────────────────────────┐
│  HEADER: [Company] — [Role]                       │
│  Status: [dropdown]  Applied: [date]  [Stale🔴]  │
│  Resume: [tag]  Work Mode: [badge]  Location      │
├──────────────────────────────────────────────────┤
│  JD SNAPSHOT (collapsed by default)              │
│  ▸ Click to expand full job description          │
├──────────────────────────────────────────────────┤
│  INTERVIEW TIMELINE                              │
│  ┌─ Round 1: Technical — Sep 20 — ✅ Debriefed  │
│  ├─ Round 2: System Design — Sep 25 — ⏳ Pending │
│  └─ [+ Add Round]                                │
├──────────────────────────────────────────────────┤
│  NOTES                                           │
│  Freeform text area                              │
├──────────────────────────────────────────────────┤
│  ACTIONS: [Archive] [Delete] [Mark Ghosted]      │
└──────────────────────────────────────────────────┘
```

#### Page 6: Analytics (`/analytics`)

**Purpose:** Full analytics page with detailed charts and data visualizations. Provides deeper insight than the Dashboard snapshots.

| Aspect | Detail |
|---|---|
| **Auth** | Protected |
| **APIs Consumed** | `GET /api/analytics/funnel`, `GET /api/analytics/weaknesses`, `GET /api/analytics/resume-cohorts` |
| **Key UI Sections** | Funnel conversion chart (full-size), Weakness frequency heatmap (full bar chart), Resume cohort comparison table |
| **Guardrail States** | Weakness: "Complete 5 debriefs to reveal patterns (X/5)" when locked. Resume: "Gathering Data (X/15 applications)" per cohort when insufficient. |
| **Empty State** | "Start tracking applications and completing debriefs to see your analytics here." |
| **User Stories** | US-24, US-25, US-26, US-27, US-28, US-29 |

**Analytics Layout:**

```
┌──────────────────────────────────────────────────┐
│  SECTION 1: FUNNEL CONVERSION                   │
│  Full-width bar chart                             │
│  Applied → OA/Screening → Interviewing → Offer   │
│  Drop-off labels + interpretation hints           │
│  Disclaimer: "Based on your self-reported data"   │
├──────────────────────────────────────────────────┤
│  SECTION 2: WEAKNESS FREQUENCY HEATMAP           │
│  Horizontal bar chart — topics ranked by count    │
│  OR guardrail progress message                    │
├──────────────────────────────────────────────────┤
│  SECTION 3: RESUME COHORT COMPARISON             │
│  Table: Version | Apps | Callbacks | Rate (%)     │
│  Per-cohort guardrail enforcement                 │
└──────────────────────────────────────────────────┘
```

#### Page 7: Settings (`/settings`)

**Purpose:** User profile management, preference configuration, and data export.

| Aspect | Detail |
|---|---|
| **Auth** | Protected |
| **APIs Consumed** | `GET /api/auth/me`, `PATCH /api/auth/me` (profile update — to be added in implementation), `POST /api/auth/logout` |
| **Key UI Sections** | Profile form (fullName, email [read-only], targetRole), Stale threshold slider/input (7–45 days, default 14), Data export buttons (JSON / CSV) |
| **Data Export** | Browser-side download — no server storage. File name: `jobcaliber_export_YYYY-MM-DD.{json|csv}` |
| **User Stories** | US-04, US-32 |

#### Quick-Add Modal (Global Overlay)

**Purpose:** Accessible from every page via a persistent "+" button in the navigation bar. Opens as a modal overlay — does NOT change the URL route.

| Aspect | Detail |
|---|---|
| **Auth** | Protected (button hidden when not authenticated) |
| **Trigger** | Click "+" button in Navbar, OR keyboard shortcut (future enhancement) |
| **API Consumed** | `POST /api/applications` |
| **Key UI Elements** | Company name input (required), Role title input (required), "Add More Details" expandable section (all optional fields), Submit button, Cancel button |
| **Duplicate Warning** | If server returns `warning.duplicateDetected`, show non-blocking warning: "Similar application found: [company] — [role] ([date]). Proceed?" |
| **Success Behavior** | Close modal, show success toast, refresh application list if on Pipeline page |
| **User Stories** | US-05, US-06, US-07 |

### 1.3 Feature-to-Page Mapping

Every feature in the MVP maps to at least one page:

| Feature | Primary Page | Secondary Page(s) |
|---|---|---|
| F1: Authentication | Login, Register | — |
| F2: Quick-Add Application | Quick-Add Modal (global) | Pipeline (empty state CTA) |
| F3: Kanban + Table View | Pipeline | — |
| F4: Stale Application Engine | Pipeline (badges) | Dashboard (triage), Application Detail (badge) |
| F5: Search & Filters | Pipeline | — |
| F6: JD Snapshot | Application Detail | Quick-Add Modal (optional field) |
| F7: Interview Round Logger | Application Detail | — |
| F8: 90-Second Debrief | Application Detail (Debrief Modal) | Dashboard (triage prompt) |
| F9: Stumbled Topic Tagging | Application Detail (Debrief Modal) | — |
| F10: Weakness Heatmap | Analytics | Dashboard (snapshot) |
| F11: Funnel Analytics | Analytics | Dashboard (quick-view) |
| F12: Resume Cohort Tracker | Analytics | — |
| F13: Action Center | Dashboard | — |
| F14: Data Export | Settings | — |
| F15: Security | *(cross-cutting — all pages)* | — |

### 1.4 Debrief Modal (Page Sub-Component)

The Debrief Modal is a critical sub-page experience within Application Detail. It's documented here because it's the most complex modal in the app and spans multiple features (FR-08, FR-09).

**Trigger:** Click "Log Debrief" next to an interview round that has `debriefCompleted: false` and `scheduledDate` is in the past.

**Structure: 3-Step Wizard with Progress Bar**

```
Step 1 of 3: Rating
┌──────────────────────────────────────────────────┐
│  Round Type: [pre-filled, read-only]             │
│  How did it go? ⭐⭐⭐⭐⭐ (1-5 stars, required)  │
│                                                  │
│  [Back] [Next]                                   │
└──────────────────────────────────────────────────┘

Step 2 of 3: Questions Asked
┌──────────────────────────────────────────────────┐
│  What questions were you asked?                  │
│  • [text input] [×]                              │
│  • [text input] [×]                              │
│  [+ Add Question]                                │
│  (Optional — you can skip this)                  │
│                                                  │
│  [Back] [Next / Skip]                            │
└──────────────────────────────────────────────────┘

Step 3 of 3: Stumbled Topics & Notes
┌──────────────────────────────────────────────────┐
│  What topics did you struggle with?              │
│  [tag input with autocomplete from taxonomy]     │
│  Selected: [Dynamic Programming ×] [SQL ×]       │
│                                                  │
│  Notes (optional):                               │
│  [textarea]                                      │
│                                                  │
│  [Back] [Submit Debrief]                         │
└──────────────────────────────────────────────────┘
```

**Behavior Rules:**
- Closing the modal without submitting = no data saved, debrief prompt remains
- Submitting calls `POST /api/interviews/:id/debrief` with all data in one request
- After submit: `debriefCompleted` flips to `true`, modal closes, timeline updates, success toast
- Edit existing debrief: opens same modal with pre-filled data, calls `PUT /api/interviews/:id/debrief`

---

## 2. Routing Architecture

### 2.1 Route Definitions

```javascript
// Route configuration (React Router v6)
// File: client/src/App.jsx

const routes = [
  // === PUBLIC ROUTES (no auth required) ===
  { path: '/login',           element: <LoginPage />,           auth: false },
  { path: '/register',        element: <RegisterPage />,        auth: false },

  // === PROTECTED ROUTES (auth required) ===
  { path: '/dashboard',       element: <DashboardPage />,       auth: true  },
  { path: '/pipeline',        element: <PipelinePage />,        auth: true  },
  { path: '/applications/:id', element: <ApplicationDetailPage />, auth: true },
  { path: '/analytics',       element: <AnalyticsPage />,       auth: true  },
  { path: '/settings',        element: <SettingsPage />,        auth: true  },

  // === CATCH-ALL ===
  { path: '*',                element: <Navigate to="/dashboard" />, auth: null }
];
```

### 2.2 Route Classification

| Category | Routes | Behavior |
|---|---|---|
| **Public** | `/login`, `/register` | Accessible without authentication. If user IS authenticated, redirect to `/dashboard`. |
| **Protected** | `/dashboard`, `/pipeline`, `/applications/:id`, `/analytics`, `/settings` | Require authentication. If user is NOT authenticated, redirect to `/login`. |
| **Catch-all** | `*` | Any unmatched URL redirects to `/dashboard` (if logged in) or `/login` (if not). |

### 2.3 Route Protection Pattern

```
                    User visits any route
                           │
                    ┌──────┴──────┐
                    │ Is the user  │
                    │ authenticated?│
                    └──────┬──────┘
                     Yes ┌─┴─┐ No
                         │   │
              ┌──────────┘   └──────────┐
              │                         │
     ┌────────┴────────┐      ┌────────┴────────┐
     │ Is the route    │      │ Is the route    │
     │ PUBLIC?         │      │ PROTECTED?      │
     └────────┬────────┘      └────────┬────────┘
        Yes ┌─┴─┐ No            Yes ┌─┴─┐ No
            │   │                    │   │
    Redirect  Render          Redirect  Render
    to        page            to        page
    /dashboard               /login
```

**Implementation: ProtectedRoute wrapper component**

```jsx
// client/src/components/common/ProtectedRoute.jsx
// Wraps protected routes — checks AuthContext for logged-in user

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;  // Don't flash login page
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

**Implementation: PublicRoute wrapper component**

```jsx
// client/src/components/common/PublicRoute.jsx
// Wraps public routes — redirects authenticated users away from login/register

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
```

### 2.4 Redirect Rules

| Scenario | From | To | Reason |
|---|---|---|---|
| Unauthenticated user visits protected route | `/dashboard`, `/pipeline`, etc. | `/login` | Must authenticate first |
| Authenticated user visits login/register | `/login`, `/register` | `/dashboard` | Already logged in |
| User visits root `/` | `/` | `/dashboard` (auth) or `/login` (no auth) | No dedicated landing page in MVP |
| User visits unknown route | `/anything-invalid` | `/dashboard` (auth) or `/login` (no auth) | Graceful catch-all |
| Successful login | `/login` | `/dashboard` | Post-login destination |
| Successful registration | `/register` | `/dashboard` | Post-register destination |
| Logout | Any page | `/login` | Session ended |
| Application not found (404) | `/applications/:id` | Error state on same page | Show "Application not found" message, not a redirect |
| Application belongs to other user | `/applications/:id` | Error state (same as 404) | Tenant isolation — don't reveal existence |

### 2.5 Route Parameters

| Route | Parameter | Type | Validation | Example |
|---|---|---|---|---|
| `/applications/:id` | `:id` | MongoDB ObjectId (24-char hex string) | Client: check format before API call. Server: validates and returns 400 if invalid. | `/applications/60f7b2a1e13e8c001f8e4b2a` |

### 2.6 Navigation Map

This shows how users navigate between pages:

```
                          ┌──────────┐
                     ┌───►│ Register │
                     │    └─────┬────┘
                     │          │ (success)
              ┌──────┴───┐     │
              │  Login   │◄────┘
              └─────┬────┘
                    │ (success)
                    ▼
              ┌──────────┐
         ┌───►│Dashboard │◄──────────────────────────────┐
         │    └─────┬────┘                                │
         │          │                                     │
         │    ┌─────┴───────────────────────────┐        │
         │    │                                  │        │
         │    ▼                                  ▼        │
         │  ┌──────────┐              ┌──────────────┐   │
         ├──│ Pipeline │──(click)───►│ App Detail   │   │
         │  └──────────┘              └──────┬───────┘   │
         │                                   │           │
         │                            (debrief/rounds    │
         │                             managed here)     │
         │                                               │
         │  ┌──────────┐              ┌──────────┐      │
         ├──│Analytics │              │ Settings │──────┘
         │  └──────────┘              └──────────┘
         │                                   │
         │                            (logout → /login)
         └──── [Navbar links connect all protected pages]

    [+] Quick-Add Modal accessible from ANY protected page via Navbar
```

### 2.7 Navigation Elements

| Element | Location | Purpose |
|---|---|---|
| **Navbar** | Top of every protected page | Primary navigation between pages. Contains: Logo, Dashboard link, Pipeline link, Analytics link, Settings link, Quick-Add "+" button, User avatar/logout |
| **Quick-Add Button** | Navbar (persistent) | Opens Quick-Add Modal from any page (FR-02.9) |
| **Card Click** | Pipeline (Kanban/Table) | Navigates to `/applications/:id` for the clicked application |
| **Action Center Links** | Dashboard triage cards | Deep-link to relevant page (e.g., "Prepare for interview" → `/applications/:id`) |
| **Pipeline Overview Click** | Dashboard | Navigates to `/pipeline` |
| **Back Navigation** | Application Detail | Browser back button or breadcrumb → returns to `/pipeline` |

### 2.8 URL Structure Summary

```
jobcaliber.com/
├── login                    ← Public
├── register                 ← Public
├── dashboard                ← Protected (default after login)
├── pipeline                 ← Protected
├── applications/
│   └── :id                  ← Protected (dynamic route)
├── analytics                ← Protected
└── settings                 ← Protected
```

### 2.9 File-to-Route Mapping

Each route maps to exactly one page component file:

| Route | File | Component |
|---|---|---|
| `/login` | `client/src/pages/LoginPage.jsx` | `<LoginPage />` |
| `/register` | `client/src/pages/RegisterPage.jsx` | `<RegisterPage />` |
| `/dashboard` | `client/src/pages/DashboardPage.jsx` | `<DashboardPage />` |
| `/pipeline` | `client/src/pages/PipelinePage.jsx` | `<PipelinePage />` |
| `/applications/:id` | `client/src/pages/ApplicationDetailPage.jsx` | `<ApplicationDetailPage />` |
| `/analytics` | `client/src/pages/AnalyticsPage.jsx` | `<AnalyticsPage />` |
| `/settings` | `client/src/pages/SettingsPage.jsx` | `<SettingsPage />` |

### 2.10 State Management Context

React Context providers that wrap the route tree:

| Context | Purpose | Available To |
|---|---|---|
| `AuthContext` | Current user, login/logout/register functions, loading state | All routes |
| `ApplicationContext` | Application list, filters, CRUD operations (created in Phase 3) | Protected routes |

```jsx
// Conceptual App.jsx structure (Phase 2)
<AuthProvider>
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected routes — wrapped in shared layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/applications/:id" element={<ApplicationDetailPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

> **Note:** The `<AppLayout />` component (Navbar + content area) wraps all protected routes using React Router's `<Outlet />` pattern. This is defined in Step 1.11.

---

---

## 3. Component Hierarchy & Layout Structure

### 3.1 Overview & Principles

The JobCaliber component architecture follows strict modular composition:
1. **Container / Presentational Separation:** Route pages (`pages/`) manage route state and coordinate API hooks. Presentational components (`components/`) receive props and handle visual rendering and micro-interactions.
2. **Atomic Common System:** High-frequency UI elements (`Button`, `Card`, `Badge`, `Modal`, `Input`) live in `components/common/` with built-in tactile feedback and 3D depth states.
3. **Domain Modules:** Features are cleanly scoped into `applications/`, `interviews/`, `analytics/`, and `layout/`.
4. **Accessible Overlays:** Modals render via React Portals to guarantee z-index layering above the physical card planes without overflow clipping.

### 3.2 Global Layout Tree

```
<App>
├── <AuthProvider>
│   └── <ApplicationProvider>
│       └── <BrowserRouter>
│           ├── <PublicRoute> (No sidebar/navbar shell)
│           │   ├── <LoginPage />
│           │   └── <RegisterPage />
│           │
│           └── <ProtectedRoute>
│               └── <AppLayout>
│                   ├── <Navbar /> (Sticky top telemetry header, search trigger, + Quick Add CTA, User profile menu)
│                   ├── <Sidebar /> (Collapsible navigation bar with pipeline counters & status badges)
│                   ├── <main className="content-viewport">
│                   │   └── <Outlet /> (Active page: Dashboard, Pipeline, Detail, Analytics, Settings)
│                   ├── <QuickAddModal /> (Global overlay triggered via ⌘K / Ctrl+K or button)
│                   └── <ToastContainer /> (Notification HUD for status changes & stale alerts)
```

### 3.3 Component Tree by Domain

#### Layout Components (`client/src/components/layout/`)
- `<AppLayout />` — Root container with responsive grid, background coordinate grid, and modal slot.
- `<Navbar />` — Command header with brand mark, global search modal trigger, Quick-Add physical button, and user dropdown.
- `<Sidebar />` — Navigation rail with active route indicator, pipeline stage counts, and collapse toggle.
- `<PageHeader />` — Consistent header for each view with breadcrumbs, action bar, and filter chips.
- `<MobileNav />` — Bottom navigation bar for mobile viewports (`< 768px`).

#### Common UI Library (`client/src/components/common/`)
- `<Button />` — Tactile 3D button with physical extruded lip (`box-shadow: 0 4px 0 ...`), active press downward (`translate-y-[2px]`), variant styling (`primary`, `secondary`, `destructive`, `ghost`), and loading spinner state.
- `<Card />` — Physical slab card with 1px top-edge bevel highlight, obsidian body (`bg-[#111622]`), and subtle elevation shadows.
- `<Modal />` — Portal-rendered dialog with backdrop blur, keyboard trap (`Escape` to close), and physical container frame.
- `<Badge />` — Compact stage indicator with semantic color tokens (`stale`, `offer`, `interview`, `ghosted`).
- `<Input />` — Form input with high-density borders (`border-[#1E293B]`), focus highlight ring, and helper error text.
- `<Select />` — Custom dropdown matching tactile dark aesthetic.
- `<EmptyState />` — Contextual empty state with custom iconography, encouraging copy, and primary action CTA.
- `<SkeletonLoader />` — Polished placeholder pulse matching dark card slabs during API loads.

#### Application Domain (`client/src/components/applications/`)
- `<KanbanBoard />` — 7-column horizontal drag-and-drop container powered by `@hello-pangea/dnd`.
- `<KanbanColumn />` — Droppable stage tray with header count badge, collapse option, and card list.
- `<ApplicationCard />` — Draggable card slab showing company, role, stage duration badge, stale alert tag, and quick menu.
- `<TableView />` — Alternative data-dense tabular view with sorting, bulk actions, and pagination.
- `<QuickAddModal />` — Streamlined 2-mandatory-field modal with 15-second timer indicator and keyboard submit.
- `<DuplicateWarningBanner />` — Inline warning if company + role match an application within the 60-day window.
- `<ApplicationFilterBar />` — Search input, tag filter pills, stale-only toggle, and view switcher.

#### Interview & Debrief Domain (`client/src/components/interviews/`)
- `<InterviewTimeline />` — Chronological timeline of rounds for an application.
- `<InterviewRoundCard />` — Card for a single round with date, type badge, interviewer names, and debrief status.
- `<DebriefModal />` — 90-second post-interview modal with 3-step rapid logging flow.
- `<DebriefStarRating />` — Interactive 1-5 tactile star rating component.
- `<TopicSelector />` — Multi-select chip cloud of 20 core topics + custom topic input with keyboard tags.
- `<InterviewRoundLogger />` — Modal for scheduling and logging new interview rounds.

#### Analytics Domain (`client/src/components/analytics/`)
- `<ActionCenterWidget />` — Priority-ordered triage container (max 3 items) with immediate action triggers.
- `<TriageCard />` — Individual action card (Debrief Pending, Stale Follow-up, or Upcoming Interview).
- `<PipelineFunnelChart />` — Recharts-powered stage conversion funnel with drop-off percentages.
- `<WeaknessHeatmap />` — Frequency-ranked topic bar chart with N ≥ 5 guardrail threshold message.
- `<ResumeCohortTable />` — Conversion comparison table by resume version with N ≥ 15 guardrail threshold.
- `<ThresholdGuardrail />` — Reusable statistical shield explaining sample size requirements.

---

## 4. Design System & Visual Language

### 4.1 Anti-Cliché Visual Principles

To prevent generic "AI SaaS" monotony, JobCaliber adopts a **Technical Precision & Basalt Spatial** visual language:
1. **No generic purple/blue gradients or glowing neon blobs.** Backgrounds are grounded in deep obsidian (`#0B0F17`) and graphite carbon (`#111622`).
2. **Engineered Coordinate Grid:** Subtle background grid (24px spacing, `#1E293B` at 15% opacity) evokes engineering precision and telemetry tools.
3. **Tactile 3D Depth over Flat Glassmorphism:** Components have physical weight, calibrated drop shadows, 1px micro-bevel highlights, and mechanical button push dynamics.
4. **Clear Color Semantics (Not Decorative Color):** Colors strictly represent pipeline states and statistical urgency, never arbitrary decoration.

### 4.2 Color Palette Tokens

| Token | Hex | Role | Example Usage |
|---|---|---|---|
| `bg-primary` | `#0B0F17` | Root background | Canvas, base viewport |
| `bg-surface` | `#111622` | Card & slab background | Application cards, modals |
| `bg-surface-raised` | `#182030` | Hover & elevated layer | Active dropdowns, table row hover |
| `border-subtle` | `#1E293B` | 1px boundary lines | Card outlines, dividers |
| `border-highlight`| `rgba(255,255,255,0.08)` | Top edge micro-bevel | Tactile card headers, button top rims |
| `accent-amber` | `#F59E0B` | Primary action & focus | `+ Quick Add`, Debrief triggers, active tabs |
| `accent-amber-lip` | `#B45309` | 3D mechanical button lip | Primary button bottom shadow |
| `status-emerald`| `#10B981` | Offer, advancement, positive | Offer stage, 4-5 star debriefs |
| `status-crimson`| `#EF4444` | Stale alert, urgent attention | Applications exceeding stale threshold, rejection |
| `status-blue` | `#3B82F6` | Interviewing, active movement | Screening & interview stages |
| `status-slate` | `#64748B` | Passive data & ghosted | Stored/archived apps, metadata stamps |
| `text-primary` | `#F8FAFC` | Main headings & titles | Company names, page titles |
| `text-muted` | `#94A3B8` | Secondary labels & telemetry | Timestamps, stage duration, cohort labels |

### 4.3 Typography Hierarchy

- **Primary UI Sans:** `Inter`, system `-apple-system`, `sans-serif` — clean, neutral, highly legible at small sizes.
- **Telemetry & Numbers Monospace:** `JetBrains Mono`, `Roboto Mono`, `monospace` — applied to stage counts, timestamps, durations, and conversion percentages.

```
Page Title:      24px (text-2xl), font-bold, tracking-tight, text-[#F8FAFC]
Section Heading: 16px (text-base), font-semibold, tracking-wide, uppercase, text-[#94A3B8]
Card Title:      15px (text-sm), font-semibold, text-[#F8FAFC]
Body / Inputs:   14px (text-sm), font-normal, text-[#CBD5E1]
Metadata / Caps: 12px (text-xs), font-mono, text-[#64748B]
```

### 4.4 3D Physical Button System (CSS Specification)

Every interactive button uses a 3-layer tactile physical press:
- **Resting state:** Upper bevel highlight + solid 3D extruded base (`box-shadow: 0 4px 0 [lipColor]`).
- **Hover state:** Subtle upward float (`translate-y-[-1px]`) with increased bottom lip shadow (`box-shadow: 0 5px 0 [lipColor]`).
- **Active / Pressed state:** Downward translation (`translate-y-[2px]`) with compressed shadow (`box-shadow: 0 2px 0 [lipColor]`).

```css
/* Primary Action Button (Tactile Amber) */
.btn-primary-tactile {
  background-color: #F59E0B;
  color: #000000;
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 16px;
  box-shadow: 0 4px 0 #B45309;
  transition: transform 100ms ease, box-shadow 100ms ease;
}
.btn-primary-tactile:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 0 #B45309;
}
.btn-primary-tactile:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #B45309;
}

/* Secondary Surface Button (Obsidian Slab) */
.btn-secondary-tactile {
  background-color: #182030;
  color: #F8FAFC;
  border: 1px solid #1E293B;
  border-radius: 8px;
  padding: 8px 16px;
  box-shadow: 0 3px 0 #0B0F17;
  transition: transform 100ms ease, box-shadow 100ms ease;
}
.btn-secondary-tactile:hover {
  background-color: #1F293D;
  transform: translateY(-1px);
}
.btn-secondary-tactile:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #0B0F17;
}
```

### 4.5 Responsive Breakpoints & Viewport Grid

- **Desktop (`>= 1024px`):** Full 7-column Kanban board horizontally scrollable, 3-row dashboard telemetry layout, sticky sidebar.
- **Tablet (`768px - 1023px`):** Collapsed icon sidebar, 3-column wrap or table view default, stacked dashboard widgets.
- **Mobile (`< 768px`):** Fixed bottom nav bar, single-column vertical swipe feed, top sticky status HUD, horizontal swipeable Action Center, and touch-optimized debrief sheet.

