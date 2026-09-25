<!-- 📌 WHAT IS THIS FILE? This is the COMPLETE product knowledge base — everything about JobCaliber in one place. It covers the vision, every feature, the data model, architecture decisions, user personas, and more. If you only read ONE document, read this one. -->

# JOBCALIBER — PROJECT MASTER SPECIFICATION

> **Version:** 1.0.0  
> **Status:** Foundation Complete — Awaiting Architecture Phase  
> **Last Updated:** 2026-09-24  
> **Classification:** Definitive Product Knowledge Base  
> **Target Platform:** Web (Desktop-first Responsive)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Product Name](#2-product-name)
3. [Product Category](#3-product-category)
4. [Product Vision](#4-product-vision)
5. [Mission](#5-mission)
6. [Problem Statement](#6-problem-statement)
7. [Real-World Problem](#7-real-world-problem)
8. [Why This Problem Matters](#8-why-this-problem-matters)
9. [Target Users](#9-target-users)
10. [User Personas](#10-user-personas)
11. [User Pain Points](#11-user-pain-points)
12. [Current User Workflows](#12-current-user-workflows)
13. [Existing Solutions](#13-existing-solutions)
14. [Market Landscape](#14-market-landscape)
15. [Competitor Analysis](#15-competitor-analysis)
16. [Market Gaps](#16-market-gaps)
17. [Product Opportunity](#17-product-opportunity)
18. [Product Philosophy](#18-product-philosophy)
19. [Core Value Proposition](#19-core-value-proposition)
20. [Product Differentiation](#20-product-differentiation)
21. [Product Goals](#21-product-goals)
22. [Product Non-Goals](#22-product-non-goals)
23. [Complete Feature Inventory](#23-complete-feature-inventory)
24. [MVP Features](#24-mvp-features)
25. [V2 Features](#25-v2-features)
26. [V3 Features](#26-v3-features)
27. [Deferred Features](#27-deferred-features)
28. [Rejected Features](#28-rejected-features)
29. [User Journeys](#29-user-journeys)
30. [User Stories](#30-user-stories)
31. [Use Cases](#31-use-cases)
32. [Application Lifecycle](#32-application-lifecycle)
33. [Interview Lifecycle](#33-interview-lifecycle)
34. [Debrief Lifecycle](#34-debrief-lifecycle)
35. [Outcome Lifecycle](#35-outcome-lifecycle)
36. [Problem / Weakness Tracking](#36-problem--weakness-tracking)
37. [Analytics System](#37-analytics-system)
38. [Insight Engine](#38-insight-engine)
39. [Action Center](#39-action-center)
40. [Follow-Up System](#40-follow-up-system)
41. [Resume Version Tracking](#41-resume-version-tracking)
42. [Job Description Storage](#42-job-description-storage)
43. [Data Model Overview](#43-data-model-overview)
44. [Technical Architecture](#44-technical-architecture)
45. [Frontend Architecture](#45-frontend-architecture)
46. [Backend Architecture](#46-backend-architecture)
47. [Database Architecture](#47-database-architecture)
48. [API Architecture](#48-api-architecture)
49. [Authentication](#49-authentication)
50. [Authorization](#50-authorization)
51. [Security](#51-security)
52. [Privacy](#52-privacy)
53. [Performance](#53-performance)
54. [Scalability](#54-scalability)
55. [Testing](#55-testing)
56. [Deployment](#56-deployment)
57. [Future AI Features](#57-future-ai-features)
58. [Future Integrations](#58-future-integrations)
59. [Risks](#59-risks)
60. [Assumptions](#60-assumptions)
61. [Open Questions](#61-open-questions)
62. [Research Evidence](#62-research-evidence)
63. [Sources](#63-sources)
64. [Product Decisions](#64-product-decisions)
65. [Decision History](#65-decision-history)

---

## 1. Project Overview

**JobCaliber** is a closed-loop job search intelligence system built on the pure MERN stack (MongoDB, Express.js, React, Node.js) with Tailwind CSS.

It replaces the broken cycle of passive job tracking with an active personal improvement engine:

```
Apply (fast) → Track pipeline → Interview → Debrief (90s) → Surface patterns → Study weaknesses → Interview better → Convert more
```

JobCaliber was conceived and designed through a rigorous research-first process:
1. Real-world problem validation across Reddit, industry surveys, and developer communities
2. Deep competitor analysis (Teal, Huntr, Simplify, Jobscan, JibberJobber, Notion)
3. Evidence-based feature selection with explicit KEEP / V2 / REMOVE classifications
4. Statistical guardrail design to prevent misleading analytics
5. User persona development grounded in documented pain points

Full research documentation: See `docs/Research_And_Documentation/RESEARCH.md`

---

## 2. Product Name

**JobCaliber**

- **Full branding:** JobCaliber — Measure your pipeline. Elevate your interview caliber.
- **Dual meaning:** Precision measurement of conversion metrics + elevating user interview standards
- **Namespace:** 100% clean. Zero competing job tracking or career analytics products share this name.
- **Decision date:** 2026-09-24

---

## 3. Product Category

**Job Search Intelligence Platform**

Not "job tracker." Not "career management tool." Not "ATS optimizer."

A diagnostic, self-improving platform that turns application, interview, and rejection data into actionable personal insights.

---

## 4. Product Vision

> **Turn every application, interview, and rejection into data that makes you measurably better at your next one.**

JobCaliber exists because job seekers currently operate blind. They apply to hundreds of jobs without understanding where in the funnel they're failing, which topics keep tripping them up in interviews, or which resume version actually gets callbacks. The vision is to make the job search process deliberate and data-informed instead of random and reactive.

---

## 5. Mission

> **Help job seekers — especially students and new grads — move from "spray-and-pray" application volume to deliberate, data-informed job search improvement, through low-friction tracking, structured self-reflection, and honest personal analytics.**

---

## 6. Problem Statement

Traditional job trackers suffer from two fatal failures:

1. **Tracker Abandonment:** Users are asked to fill 10-25 fields per application. When applying to 100-300+ jobs, this becomes an hours-long bookkeeping chore. They stop tracking within 2-3 weeks.

2. **The Hamster Wheel Trap:** Candidates apply using brute-force volume without ever diagnosing *where* in the funnel they are failing — is it the resume? the OA? the interview? And if it's the interview, *which specific topics* keep appearing?

**No existing tool solves both problems simultaneously.**

---

## 7. Real-World Problem

### Evidence Summary

| Evidence | Classification |
|---|---|
| ~75% of job applications never receive a formal response | `[RESEARCH FINDING]` |
| ~53% of job seekers reported being ghosted (3-year peak) | `[RESEARCH FINDING]` |
| 61% experience ghosting *after* the interview stage | `[RESEARCH FINDING]` |
| Trackers are abandoned when logging feels like "a second job" | `[USER REPORT]` |
| Candidates realize companies keep asking the same topic — but they never tracked it | `[USER REPORT]` |
| Complex Notion templates create "maintenance debt" — abandoned after 3 weeks | `[USER REPORT]` |
| Dashboards filled with red "Rejected" tags feel demoralizing | `[USER REPORT]` |
| Job postings get deleted. Candidates can't remember what the role was about. | `[USER REPORT]` |

**Verdict:** The problem is real, well-documented, and currently underserved.

Full research: `docs/Research_And_Documentation/RESEARCH.md` → Section 2

---

## 8. Why This Problem Matters

The typical application → hire conversion rate is **< 1%**. Candidates submit 100-300+ applications. Application volume has tripled since 2021.

Without diagnostic tools, candidates:
- Don't know if the problem is their resume or their interview skills
- Don't realize they struggle with the same topics repeatedly
- Don't follow up on stale applications at the right time
- Lose context (deleted JDs) needed for interview preparation
- Feel demoralized by tracking failure without understanding *why*

The cost is measurable: wasted time, repeated mistakes, extended unemployment, and unnecessary stress.

---

## 9. Target Users

| Priority | Segment | Volume | Core Need |
|---|---|---|---|
| 🥇 Primary | College students / freshers / new grads (SWE) | 100-300+ apps | Fast entry, OA tracking, debrief patterns |
| 🥈 Secondary | Self-taught developers / career switchers | 50-100 apps | Resume A/B testing, funnel diagnosis |
| 🥉 Tertiary | Mid-senior SWEs | 25-50 apps | Round management, JD snapshots, interviewer notes |

**Market scope:** General audience. No market-specific features (Indian OA workflows are naturally served by the `OA / Screening` pipeline stage).

---

## 10. User Personas

### Persona 1: Arjun — The Fresher

| Attribute | Detail |
|---|---|
| **Age** | 21 |
| **Background** | B.Tech CSE final year, India |
| **Volume** | 150-250 applications over 4-5 months |
| **Current workflow** | Google Sheet with 8 columns. Stopped updating after 60 entries. |
| **Key pain** | Applies to same company twice. Forgets which resume was sent. After failing 3 screens, realizes "every company asked about Graphs" — never tracked it. |
| **Needs** | Fast entry. Round logging. Pattern recognition from debriefs. |
| **Success** | Completes debriefs for ≥ 50% of interviews. Weakness heatmap shows top 3 weak topics. |

### Persona 2: Priya — The Career Switcher

| Attribute | Detail |
|---|---|
| **Age** | 27 |
| **Background** | Self-taught developer, previously marketing |
| **Volume** | 60-80 targeted applications over 3 months |
| **Current workflow** | Notion template with 20+ properties. Abandoned after 3 weeks — "felt like administrating my failure." |
| **Key pain** | Iterated resume 4 times but doesn't know which works. Gets interviews but fails on same topics (React state, async/await). |
| **Needs** | Resume cohort comparison. Funnel diagnostics. Debrief patterns. |
| **Success** | Can see Resume v3 has 12% callback rate vs v2 at 5%. Focuses on React after 4 debrief flags. |

### Persona 3: Rahul — The Mid-Senior Engineer

| Attribute | Detail |
|---|---|
| **Age** | 30 |
| **Background** | 5 years SWE experience, Bangalore |
| **Volume** | 30-40 selective applications over 2 months |
| **Current workflow** | Tracks nothing. Forgets company called about a role applied 3 weeks ago. JD deleted. |
| **Key pain** | Loses context. 4-5 round processes blur together. System Design weakness is a pattern he doesn't see. |
| **Needs** | JD snapshot. Interview timeline per app. System Design flagged as recurring difficulty. |
| **Success** | Opens app detail, sees cached JD, reviews 3 rounds, prepares for System Design based on patterns. |

---

## 11. User Pain Points

### Strong Evidence (Build For)

- Tracking applications at scale (100-300+)
- Losing job descriptions after postings deleted
- Losing track of multi-round interview stages
- Forgetting interview questions and performance issues
- Missing follow-ups / uncertain timing
- Repeating the same interview mistakes
- Ghosting uncertainty
- Application overload / mental fatigue

### Moderate Evidence (Address But Don't Over-Invest)

- Forgetting which resume version was sent
- Not knowing response rates
- Forgetting application dates

### Weak Evidence (Defer)

- Source performance comparison (LinkedIn vs Naukri)
- Recruiter CRM
- Skill extraction from JDs

Full details: `docs/Research_And_Documentation/RESEARCH.md` → Section 3

---

## 12. Current User Workflows

### How users track today (before JobCaliber)

| Method | Adoption | Why It Fails |
|---|---|---|
| **Google Sheets / Excel** | Very high | High manual friction. No relational data. No analytics. No stale detection. |
| **Notion templates** | High (younger users) | Over-engineered templates create "maintenance debt." Sluggish with many entries. |
| **Nothing (memory only)** | Medium | Complete information loss. Duplicates. Missed follow-ups. |
| **Teal / Huntr (paid)** | Low-Medium | Expensive ($29-$40/mo). Bloated AI features. No diagnostic depth. |
| **Ad-hoc notes** | Medium | Scattered across docs, texts, emails. No aggregation possible. |

---

## 13. Existing Solutions

| Tool | Type | Free Tier | Interview Analysis | Weakness Tracking |
|---|---|---|---|---|
| Teal | SaaS tracker + AI | Limited | ❌ | ❌ |
| Huntr | Kanban tracker + AI | 40 job limit | ❌ | ❌ |
| Simplify | Browser autofill | Yes | ❌ | ❌ |
| Jobscan | ATS keyword matcher | Limited | ❌ | ❌ |
| JibberJobber | Career CRM | Yes | ❌ | ❌ |
| Notion | General-purpose | Yes | ❌ | ❌ |
| Google Sheets | Spreadsheet | Yes | ❌ | ❌ |
| Jobify clones | Open-source CRUD | Yes | ❌ | ❌ |

**Key finding:** Zero existing tools provide post-interview debrief → weakness aggregation → study recommendations.

---

## 14. Market Landscape

The 2024-2026 market has shifted from simple trackers to AI-driven "career copilots." However:

- AI features in Teal/Huntr are widely criticized as "underwhelming" and "generic"
- Users say ChatGPT provides comparable or superior AI assistance for free
- The community is shifting back toward high-signal, manual-heavy strategies
- Privacy concerns around browser extensions and inbox-scanning tools are rising
- There is a clear demand for tools that prioritize quality over quantity

**The opportunity:** Build in the unserved diagnostic/analytical layer, not in the crowded AI-writing layer.

---

## 15. Competitor Analysis

### Summary Matrix

| Competitor | Core Offering | Price | Fatal Flaw |
|---|---|---|---|
| **Teal** | Beautiful UI + Chrome extension + AI resume | $29/mo | Bloated; AI underdelivers; aggressive paywall |
| **Huntr** | Clean Kanban + AI tools | $40/mo | Expensive for what it is; no diagnostic value |
| **Simplify** | Browser autofill extension | Free/Paid | Privacy concerns; zero analytics |
| **Jobscan** | ATS keyword matching | $50/mo | Pseudo-scientific scores; universally distrusted |
| **JibberJobber** | Career CRM | Free/Paid | Dated UI; wrong product category |
| **Notion** | General-purpose workspace | Free | Maintenance debt; no built-in analytics |
| **GitHub clones** | Basic CRUD trackers | Free | Flat data model; zero differentiation |

Full competitor analysis: `docs/Research_And_Documentation/RESEARCH.md` → Section 4

---

## 16. Market Gaps

1. **Post-Interview Diagnostic Feedback** — No tool structures or aggregates interview debrief data
2. **Honest, Guardrailed Analytics** — No tool uses sample-size thresholds to prevent misleading statistics
3. **Low-Friction Capture for High-Volume** — Competitors require 10-25 fields per entry
4. **Funnel-Level Pipeline Diagnostics** — No consumer tool shows stage-by-stage conversion drop-off
5. **Privacy-Respecting, Free Option** — Users want tools that don't require inbox/browser access

---

## 17. Product Opportunity

JobCaliber occupies a unique position:

```
COMPETITORS:  Track → [STOP]
JOBCALIBER:   Track → Debrief → Pattern → Action → Improve
```

The differentiation is NOT in better tracking (Teal's UI is already good). It's in what happens AFTER tracking: structured self-reflection, pattern aggregation, and targeted action recommendations.

---

## 18. Product Philosophy

### 7 Non-Negotiable Principles

1. **Friction Kills Tracking** — Application capture must take < 15 seconds. Only 2 mandatory fields.
2. **No Vanity Dashboards** — Every metric must answer: "What specific action should I take?"
3. **Statistical Honesty** — No percentages below sample-size thresholds. No causal claims from self-reported data.
4. **Rejections = Data, Not Failures** — The system must never make users feel bad. Rejections feed constructive analytics.
5. **Progressive Detail** — Capture the minimum first. Add detail later when it matters.
6. **Personal Intelligence** — Insights come from the user's own data. No extrapolation.
7. **Action Over Accumulation** — The goal is to convert better, not to apply more.

---

## 19. Core Value Proposition

> **Track your applications. Understand your search. Improve your outcomes.**

The Core Product Loop:

```
CAPTURE (< 15s) → TRACK (pipeline) → DEBRIEF (90s) → LEARN (patterns) → ACT (improve)
```

Every feature serves one of these 5 stages. If a feature doesn't serve the loop, it doesn't belong.

---

## 20. Product Differentiation

| Dimension | Typical Tracker | JobCaliber |
|---|---|---|
| Data model | Flat (User → Job, 2 models) | Relational (User → App → Round → Question → ProblemLog, 5 models) |
| Interview handling | Status changes to "Interview." Nothing else. | Structured rounds, ratings, question capture, topic tagging |
| Analytics | Simple bar chart of totals | Funnel drop-off, weakness heatmap, resume cohort comparison |
| Daily utility | Passive database | Action Center: "Your top 3 tasks today" |
| Statistical rigor | None (or fake ATS %) | N ≥ 5 / N ≥ 15 guardrails |
| Engineering depth | Basic CRUD routes | MongoDB aggregation pipelines, complex $group/$match/$lookup |

---

## 21. Product Goals

| Goal | Measure |
|---|---|
| Effortless application capture | < 15 seconds per entry |
| Pipeline visibility | All apps, stages, stale flags at a glance |
| Structured self-reflection | Debrief within 90 seconds |
| Recurring weakness discovery | Top stumbled topics after ≥ 5 debriefs |
| Funnel diagnostics | Identify bottleneck stage |
| Resume iteration support | Callback rates per version (N ≥ 15) |
| Daily actionability | Max 3 specific tasks on open |
| Data sovereignty | 100% export anytime (JSON/CSV) |
| Statistical honesty | No metric displayed below sample threshold |

---

## 22. Product Non-Goals

| Non-Goal | Reason |
|---|---|
| Auto-apply bot | Community consensus: counterproductive. Causes ATS blacklisting. |
| AI resume writer | ChatGPT/Claude do it better and free |
| ATS score checker | Pseudo-scientific. Universally distrusted. |
| Networking CRM | Over-scoped for students |
| Calendar replacement | Users live in Google Calendar |
| Company research database | Glassdoor exists. Massive scope creep. |
| Gamification (streaks) | Adds guilt to stressful process |
| Mobile-native app (MVP) | Desktop-first responsive web app |

---

## 23. Complete Feature Inventory

| ID | Feature | Version | Status |
|---|---|---|---|
| F1 | Authentication & User Management | MVP | Specified |
| F2 | Quick-Add Application (< 15s) | MVP | Specified |
| F3 | Application Pipeline (7-Stage Kanban) | MVP | Specified |
| F4 | Stale Application Engine | MVP | Specified |
| F5 | Search & Filtering | MVP | Specified |
| F6 | Job Description Snapshot | MVP | Specified |
| F7 | Interview Round Logger | MVP | Specified |
| F8 | 90-Second Post-Interview Debrief ⭐ | MVP | Specified |
| F9 | Stumbled Topic Tagging Engine | MVP | Specified |
| F10 | Weakness Frequency Heatmap ⭐ | MVP | Specified |
| F11 | Funnel Conversion Analytics | MVP | Specified |
| F12 | Resume Version Cohort Tracker | MVP | Specified |
| F13 | Daily Triage / Action Center ⭐ | MVP | Specified |
| F14 | Data Export (JSON/CSV) | MVP | Specified |
| F15 | Security & Data Protection | MVP | Specified |
| F16 | JD Skill Keyword Aggregator | V2 | Planned |
| F17 | Application Source Analytics | V2 | Planned |
| F18 | Role Conversion Analytics | V2 | Planned |
| F19 | Global Interview Question Bank | V2 | Planned |
| F20 | Calendar Export (.ics) | V2 | Planned |
| F21 | Offer Tracking | V2 | Planned |
| F22 | Skill-Gap Profile Comparator | V2 | Planned |
| F23 | Chrome Web Clipper Extension | V3 | Planned |
| F24 | LLM Debrief Assistant | V3 | Planned |
| F25 | Mock Interview Study Generator | V3 | Planned |
| F26 | Email Status Detection | V3 | Planned |

---

## 24. MVP Features

15 features. 35 user stories. Full specification in the Feature Spec artifact.

### Feature Summary

| # | Feature | Loop Stage | Signature? |
|---|---|---|---|
| F1 | Auth (JWT + bcrypt + HttpOnly cookies) | Foundation | |
| F2 | Quick-Add (2 mandatory fields, progressive disclosure) | CAPTURE | |
| F3 | 7-Stage Kanban + Table View with drag-and-drop | TRACK | |
| F4 | Stale Engine (14-day default, customizable 7-45) | TRACK | |
| F5 | Search & Combined Filters | TRACK | |
| F6 | JD Snapshot (raw text cache) | TRACK | |
| F7 | Interview Round Logger (multi-round timeline) | TRACK → DEBRIEF | |
| F8 | 90-Second Post-Interview Debrief Modal | DEBRIEF | ⭐ |
| F9 | Stumbled Topic Tagging (taxonomy + custom) | DEBRIEF | |
| F10 | Weakness Frequency Heatmap (N ≥ 5 guard) | LEARN | ⭐ |
| F11 | Funnel Conversion & Drop-Off Analytics | LEARN | |
| F12 | Resume Version Cohort Tracker (N ≥ 15 guard) | LEARN | |
| F13 | Daily Triage / Action Center (max 3 items) | ACT | ⭐ |
| F14 | Data Export (JSON/CSV) | Cross-cutting | |
| F15 | Security (sanitize, rate-limit, tenant isolation) | Foundation | |

---

## 25. V2 Features

| Feature | Description | Why Deferred |
|---|---|---|
| **JD Skill Keyword Aggregator** | Parse pasted JDs against 400+ tech term dictionary | Complex NLP. Not core loop. |
| **Application Source Analytics** | Compare callback rates: LinkedIn vs Naukri vs Referral | Requires N ≥ 20 per source. Most users won't reach this in MVP. |
| **Role Conversion Analytics** | Compare funnel by role type (Frontend vs Backend) | Requires sufficient volume per role type. |
| **Global Interview Question Bank** | Searchable archive of all logged questions | Nice-to-have. Not core diagnostic. |
| **Calendar Export (.ics)** | Download interview schedule for Google Calendar | Users already have calendar. Low priority. |
| **Offer Tracking** | Salary, compensation, deadline, benefits | Only relevant for offer-stage users (small %). |
| **Skill-Gap Profile Comparator** | Self-select skills; show "frequently demanded skills you may want to learn" | Requires JD parsing (F16) as prerequisite. |

---

## 26. V3 Features

| Feature | Description |
|---|---|
| **Chrome Web Clipper Extension** | One-click JD + application capture from LinkedIn/Indeed |
| **LLM Debrief Assistant** | AI parses freeform notes into structured topic tags |
| **Mock Interview Study Generator** | Generates practice questions from top weakness topics |
| **Email Status Detection** | Opt-in IMAP/OAuth scan for recruiter response keywords |

---

## 27. Deferred Features

Features that may be added based on user feedback but have no timeline:

- Password reset / forgot password (requires email service)
- OAuth social login (Google, GitHub)
- Email verification
- Two-factor authentication
- Saved filter presets
- Bulk status updates
- Full-text JD search
- Push/browser notifications
- Mobile-native app
- Weakness trend over time
- Partial data export (date range / status filter)

---

## 28. Rejected Features

These will **NEVER** be built:

| Feature | Reason |
|---|---|
| Automated mass-application bot | Causes ATS blacklisting; violates ToS; floods market |
| Full networking / recruiter CRM | Over-engineered for students |
| Calendar replacement | Don't rebuild Google Calendar |
| 0-100% "ATS Compatibility Score" | Pseudo-scientific; universally distrusted |
| Daily streak gamification | Adds guilt; counterproductive |
| AI Cover Letter Generator | ChatGPT does it better; adds API cost |
| Company intelligence database | Glassdoor exists; massive scope creep |
| LinkedIn scraping | Violates ToS; fragile; privacy nightmare |

---

## 29. User Journeys

### Primary Journey (All Personas)

```
Sign Up
  → First Quick-Add (< 15s)
    → Build pipeline (10-20+ apps over days)
      → Stale detection triggers (14 days)
        → Interview scheduled
          → Action Center: "Prepare for interview"
            → Interview happens
              → Action Center: "Log debrief"
                → 90-second debrief modal
                  → Weakness heatmap unlocks (after ≥ 5 debriefs)
                    → Action Center: "Review [Topic]"
                      → User studies → Interviews better → Loop continues
```

### Empty State Journey (First-Time User)

```
Register → Empty Dashboard
  → Onboarding: "Add your first application"
  → User clicks "+" → Quick-Add modal
  → First application created
  → Dashboard shows pipeline with 1 card
  → User continues adding applications naturally
```

---

## 30. User Stories

35 user stories across 15 features. Organized by feature:

| Feature | Stories | Key Acceptance Criteria |
|---|---|---|
| F1: Auth | 4 stories | bcrypt salt=12, HttpOnly cookie, rate limit 10/15min |
| F2: Quick-Add | 3 stories | 2 mandatory fields, progressive disclosure, duplicate warning at 60 days |
| F3: Pipeline | 3 stories | 7-column Kanban, drag-and-drop, Table toggle with pagination |
| F4: Stale Engine | 2 stories | Auto-flag at 14 days, one-click Ghost/Archive actions |
| F5: Search | 2 stories | Text search + combined filters (status, date, stale) |
| F6: JD Snapshot | 2 stories | Raw text storage, expandable view in app detail |
| F7: Interview Logger | 2 stories | 5 round types, chronological timeline, debrief status indicator |
| F8: Debrief ⭐ | 3 stories | 3-step modal, Action Center prompt, editable after submission |
| F9: Topic Tagging | 2 stories | Two-level taxonomy autocomplete, custom tags supported |
| F10: Weakness Heatmap ⭐ | 2 stories | Horizontal bar chart, N ≥ 5 guardrail |
| F11: Funnel Analytics | 2 stories | Stage conversion counts, interpretation hints, causal disclaimer |
| F12: Resume Cohort | 2 stories | Callback rate table, N ≥ 15 guardrail |
| F13: Action Center ⭐ | 2 stories | Max 3 items, priority ordering, dismiss/snooze |
| F14: Data Export | 1 story | JSON + CSV, full data, browser download |
| F15: Security | 3 stories | express-validator, express-mongo-sanitize, tenant isolation |

Full specification with acceptance criteria: See Feature Specification artifact

---

## 31. Use Cases

### UC-1: Quick Application Logging

**Actor:** Any user  
**Trigger:** User finds a job posting  
**Steps:** Click "+" → Type company + role → Submit  
**Result:** Application created in `Saved` status  
**Time:** < 15 seconds

### UC-2: Pipeline Management

**Actor:** Any user  
**Trigger:** Application status changes  
**Steps:** Drag card to new column (or use inline dropdown in Table view)  
**Result:** Status updated, `lastStatusUpdate` refreshed, stale flag recalculated

### UC-3: Post-Interview Debrief

**Actor:** User who completed an interview  
**Trigger:** Action Center prompt (or manual)  
**Steps:** Open modal → Rate (1-5) → Log questions → Tag stumbled topics → Submit  
**Result:** InterviewRound marked debriefed. Questions and ProblemLogs created.  
**Time:** ~90 seconds

### UC-4: Weakness Discovery

**Actor:** User with ≥ 5 completed debriefs  
**Trigger:** Navigating to Analytics page  
**Steps:** View weakness heatmap → See ranked topic frequencies  
**Result:** User identifies top recurring weak areas to study

### UC-5: Resume A/B Testing

**Actor:** User with ≥ 15 apps per resume version  
**Trigger:** Navigating to Analytics page  
**Steps:** View resume cohort table → Compare callback rates  
**Result:** User identifies which resume version gets more callbacks

---

## 32. Application Lifecycle

```
                    ┌──────────────────────────┐
                    │       CREATED (Saved)      │
                    │  Default state on add      │
                    └────────────┬───────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │        APPLIED             │
                    │  User submitted the app    │
                    │  Clock starts for stale    │
                    └────────────┬───────────────┘
                                 │
                    ┌────────────┴───────────────┐
                    │                            │
                    ▼                            ▼
        ┌───────────────────┐       ┌──────────────────┐
        │  OA / SCREENING   │       │  STALE (14 days)  │
        │  Got an assessment │       │  Auto-flagged     │
        └─────────┬─────────┘       │  → Ghost / Archive│
                  │                 └──────────────────┘
                  ▼
        ┌───────────────────┐
        │   INTERVIEWING    │
        │  Active rounds    │
        │  Debriefs logged  │
        └─────────┬─────────┘
                  │
        ┌─────────┴──────────────┐
        │                        │
        ▼                        ▼
  ┌───────────┐          ┌────────────┐
  │   OFFER   │          │  REJECTED  │
  │  Got it!  │          │  Explicit  │
  └───────────┘          └────────────┘
```

---

## 33. Interview Lifecycle

```
Application enters "Interviewing" status
  │
  ├── Round 1: OA (HackerRank)
  │     └── Debrief: Rating 3/5, Stumbled: "Dynamic Programming"
  │
  ├── Round 2: Technical
  │     └── Debrief: Rating 2/5, Stumbled: "Graphs BFS", "System Design"
  │
  ├── Round 3: System Design
  │     └── Debrief: Rating 4/5, Stumbled: "Caching"
  │
  └── Round 4: HR
        └── Debrief: Rating 4/5, Stumbled: "STAR Method"
```

Each round is an `InterviewRound` document. Each debrief creates `InterviewQuestion` and `ProblemLog` documents.

---

## 34. Debrief Lifecycle

```
Interview happens
  │
  ▼
Action Center prompts debrief (within 24h)
  │
  ▼
User opens 3-step modal:
  Step 1: Round type + Self-rating (1-5 stars)
  Step 2: Questions asked (free-text bullet list)
  Step 3: Stumbled topics (taxonomy autocomplete) + Notes
  │
  ▼
Single API call saves:
  • InterviewRound.selfRating, debriefCompleted = true
  • InterviewQuestion documents (one per question)
  • ProblemLog documents (one per stumbled topic)
  │
  ▼
Weakness Heatmap recalculates
Action Center prompt dismissed
```

---

## 35. Outcome Lifecycle

Applications end in one of three terminal states:

| Terminal State | How It Happens |
|---|---|
| **Offer** | User drags to Offer column (or updates via detail page) |
| **Rejected** | User receives explicit rejection → drags to Rejected |
| **Ghosted** | System flags as stale after 14 days → user confirms "Mark Ghosted" |

Archived applications are hidden from default views but retained in the database for analytics.

---

## 36. Problem / Weakness Tracking

### How It Works

1. During debrief, user tags topics they struggled with
2. Each tag creates a `ProblemLog` document: `{ userId, roundId, topicName, category, recordedAt }`
3. The system aggregates ProblemLogs across ALL debriefs using MongoDB `$group` by `topicName`
4. Ranked list is displayed as the Weakness Frequency Heatmap

### Topic Taxonomy

Two-level hierarchy (see Feature 9 in the Feature Specification):
- **TECHNICAL:** DSA, System Design, Language Fundamentals, DevOps
- **BEHAVIORAL:** STAR Method, Conflict Resolution, Leadership, Communication

Custom tags are also supported.

### Language Rules (CRITICAL)

The system **NEVER** says:
- ❌ "You were rejected because you are bad at Graphs."
- ❌ "Your weakness is Dynamic Programming."

The system **ALWAYS** says:
- ✅ "Graph-related difficulties were recorded in 4 technical interview debriefs."
- ✅ "Dynamic Programming appeared as a stumbled topic in 5 of your debriefs."

---

## 37. Analytics System

### Three Analytics Features

| Feature | What It Shows | Guardrail |
|---|---|---|
| **Weakness Heatmap** | Topic frequency across debriefs | N ≥ 5 debriefs |
| **Funnel Analytics** | Stage-by-stage drop-off | None (uses absolute counts) |
| **Resume Cohort** | Callback rate per resume version | N ≥ 15 per cohort |

### Three-Tier Truth Classification

Every insight must be labeled:
1. **`[FACT]`** — What the user explicitly recorded (e.g., "14 applications submitted")
2. **`[USER LOG]`** — What the user self-reported (e.g., "Struggled with Graphs in 3 rounds")
3. **`[SYSTEM PATTERN]`** — What the data shows when aggregated

### Statistical Guardrails

| Metric | Minimum N | Below Threshold Display |
|---|---|---|
| Weakness Pattern Ranking | 5 total debriefs | *"Complete 5 debriefs to reveal patterns (X/5)"* |
| Resume Cohort Conversion | 15 applications per cohort | *"Gathering Data (X/15 applications)"* |
| Source Conversion (V2) | 20 per source | *"Not enough data yet (X/20)"* |

---

## 38. Insight Engine

The Insight Engine is not a separate feature — it is the combination of:

1. **Weakness Heatmap** — answers "What topics keep tripping me up?"
2. **Funnel Analytics** — answers "Where in the pipeline am I failing?"
3. **Resume Cohort** — answers "Which resume gets more callbacks?"

Together, they answer the meta-question: **"What should I change to get better outcomes?"**

### Interpretation Logic

| Biggest Drop-off | Suggested Interpretation |
|---|---|
| Applied → Screening | Resume or application targeting issue |
| Screening → Interviewing | OA/screening performance issue |
| Interviewing → Offer | Interview skills issue → check weakness heatmap |

All interpretations are prefixed: *"Based on your data:"*

---

## 39. Action Center

### Priority-Ordered Triggers

| Priority | Trigger | Action | Severity |
|---|---|---|---|
| 1 | Interview in next 48h | "Prepare for [Company] [Round] tomorrow" | 🔴 High |
| 2 | Debrief pending > 24h | "Log 90s debrief for [Company]" | 🟡 Medium |
| 3 | Application stale ≥ 14 days | "[Company] — no activity for X days" | 🔵 Medium |
| 4 | Topic in ≥ 3 debriefs | "Review [Topic] — flagged in X debriefs" | 🟣 Low |

### Rules

- Maximum 3 items displayed at a time
- If > 3 triggers: show highest-priority 3
- If 0 triggers: "You're all caught up!"
- Each item has: primary action, Dismiss, Snooze (7 days)

---

## 40. Follow-Up System

The follow-up system is powered by the **Stale Application Engine** (Feature 4):

1. Applications in `Applied` or `OA / Screening` are monitored
2. After 14 days (customizable 7-45) with no status change: `isStale = true`
3. Stale badge appears on Kanban card and Table row
4. Action Center surfaces stale apps as actionable items
5. User can: Mark Ghosted, Archive, or take manual action

This replaces a dedicated "follow-up reminder" system. The stale engine IS the follow-up system.

---

## 41. Resume Version Tracking

### How It Works

1. User sets `resumeVersionTag` on each application (optional text label, e.g., "Backend_v2")
2. System groups applications by tag
3. "Callback" defined as: application reached `OA / Screening` status or beyond
4. Callback rate = (callbacks / total applications) per cohort

### Guardrails

- N < 15: Hide percentage. Show "Gathering Data (X/15)"
- N ≥ 15: Display actual callback rate
- Untagged applications shown as "Untagged" cohort

### Language

- ✅ "Applications using Resume v2 had a higher callback rate in your recorded data."
- ❌ "Resume v2 is better than Resume v1."

---

## 42. Job Description Storage

### How It Works

1. During Quick-Add or later editing, user pastes raw JD text
2. Stored as a `string` field (`fullJobDescription`) on the Application document
3. Viewable in Application Detail as an expandable section

### Why It Matters

`[USER REPORT]` Job postings get deleted after positions are filled. Weeks later when a recruiter calls, users have no idea what the role was about. The snapshot ensures the user always has a cached copy.

---

## 43. Data Model Overview

### Entity Relationship

```
USER (1) ──── owns ────► (N) APPLICATION
APPLICATION (1) ── contains ──► (N) INTERVIEW_ROUND
INTERVIEW_ROUND (1) ── contains ──► (N) INTERVIEW_QUESTION
INTERVIEW_ROUND (1) ── records ──► (N) PROBLEM_LOG
USER (1) ── aggregates ──► (N) PROBLEM_LOG
```

### Collections

| Collection | Purpose | Key Fields |
|---|---|---|
| `users` | Account data | fullName, email, passwordHash, staleThresholdDays |
| `applications` | Job applications | companyName, roleTitle, status, resumeVersionTag, isStale |
| `interviewrounds` | Interview rounds | applicationId, roundType, scheduledDate, selfRating, debriefCompleted |
| `interviewquestions` | Questions asked | roundId, questionText, category |
| `problemlogs` | Stumbled topics | roundId, userId, topicName, category |

> **Note:** Detailed schema definitions (fields, types, validation, indexes) will be specified in `docs/Architecture/DATABASE_SCHEMA.md` during the Architecture phase.

---

## 44. Technical Architecture

### Overview

Monorepo structure:

```
JobCaliber/
├── client/          # React 18 + Vite frontend
├── server/          # Express.js backend
├── docs/            # Project documentation
└── shared/          # Shared constants (if needed)
```

> **Note:** Detailed architecture decisions will be specified in `docs/Architecture/ARCHITECTURE.md` during the Architecture phase.

---

## 45. Frontend Architecture

| Aspect | Technology | Rationale |
|---|---|---|
| **Framework** | React 18 + Vite | Fast build times, SPA architecture, industry standard |
| **Routing** | React Router v6 | Protected route wrapper for authenticated pages |
| **State** | React Context API + Hooks | AuthContext, ApplicationContext. No Redux needed for MVP scope. |
| **Styling** | Tailwind CSS | Dark-mode first, glassmorphism, responsive, rapid prototyping |
| **Charts** | Recharts | Native React SVG, responsive containers |
| **Drag-and-Drop** | @hello-pangea/dnd | Maintained, accessible fork of react-beautiful-dnd |

> **Note:** Component hierarchy and page architecture will be specified in `docs/Architecture/UI_SPEC.md` during the Architecture phase.

---

## 46. Backend Architecture

| Aspect | Technology | Rationale |
|---|---|---|
| **Runtime** | Node.js | Non-blocking I/O, native JS end-to-end |
| **Framework** | Express.js | Minimal, flexible, well-documented |
| **Validation** | express-validator | Server-side input validation on all endpoints |
| **Security** | express-mongo-sanitize, express-rate-limit | NoSQL injection defense, brute-force prevention |
| **Date Utils** | date-fns | Lightweight, modular, immutable date math |

> **Note:** Route structure and middleware chain will be specified in `docs/Architecture/ARCHITECTURE.md` and `docs/Architecture/API_SPEC.md`.

---

## 47. Database Architecture

| Aspect | Technology | Rationale |
|---|---|---|
| **Database** | MongoDB | Document model fits nested interview/question data |
| **ODM** | Mongoose | Schema definitions, validation, timestamps |
| **Hosting** | MongoDB Atlas (cloud) | Free tier for development. Easy scaling later. |

### Key Indexes (Planned)

- `applications: { userId: 1, status: 1 }`
- `applications: { userId: 1, companyName: 1, roleTitle: 1 }` (duplicate detection)
- `applications: { userId: 1, appliedDate: -1 }`
- `problemlogs: { userId: 1, topicName: 1 }` (weakness aggregation)
- `interviewrounds: { applicationId: 1, scheduledDate: 1 }`

> **Note:** Full schema definitions will be in `docs/Architecture/DATABASE_SCHEMA.md`.

---

## 48. API Architecture

### Route Groups

| Prefix | Purpose |
|---|---|
| `/api/auth` | Registration, login, logout, current user |
| `/api/applications` | CRUD + status updates + filtering |
| `/api/interviews` | Round creation + debrief submission |
| `/api/analytics` | Funnel, weakness, resume cohort, triage |

> **Note:** Full endpoint specifications will be in `docs/Architecture/API_SPEC.md`.

---

## 49. Authentication

- **Method:** JWT (JSON Web Token)
- **Storage:** `HttpOnly`, `SameSite=Lax`, `Secure` (production) cookies
- **Hashing:** bcryptjs with salt rounds = 12
- **Token access:** Inaccessible to client-side JavaScript (XSS protection)
- **Logout:** Cookie cleared server-side

---

## 50. Authorization

- **Model:** Simple tenant isolation (no roles in MVP)
- **Rule:** Every database query includes `{ userId: req.user._id }`
- **Middleware:** `protect` middleware extracts user from JWT and attaches to `req.user`
- **Enforcement:** No API endpoint allows accessing another user's data

---

## 51. Security

| Measure | Implementation |
|---|---|
| Password hashing | bcrypt, salt rounds = 12 |
| Token transport | HttpOnly, SameSite=Lax, Secure cookies |
| NoSQL injection | express-mongo-sanitize strips $ and . operators |
| Input validation | express-validator on all payload endpoints |
| Rate limiting | express-rate-limit: 10 login attempts per 15 minutes |
| Tenant isolation | Every query scoped to authenticated userId |
| XSS | Input sanitization + HttpOnly cookies |

---

## 52. Privacy

- All data scoped to individual users (tenant isolation)
- No data sharing between users
- Full data export (JSON/CSV) available at any time
- No browser extension required (no browser access)
- No email/inbox scanning
- No third-party analytics tracking in MVP

---

## 53. Performance

### MVP Performance Targets

| Metric | Target |
|---|---|
| API response time | < 500ms for standard queries |
| Aggregation queries | < 2s for analytics pipelines |
| Frontend initial load | < 3s on broadband |
| Kanban render | Smooth with 100+ cards |
| Search debounce | 300ms delay |

### Optimization Strategy

- Database indexes on high-query fields
- Pagination for list/table views (20 items default)
- Debounced search input
- Lazy-loaded analytics (only computed on page visit)

---

## 54. Scalability

### MVP Scale Target

- Single user: up to 500 applications, 100 interview rounds, 50 debriefs
- Multi-user: up to 100 concurrent users (typical for portfolio project)
- Database: MongoDB Atlas free tier (512MB storage)

### If Scale Becomes Relevant (Post-Launch)

- MongoDB Atlas paid tier for more storage
- Application-level caching for aggregation results
- Consider indexing strategy review

JobCaliber is a personal tool, not a SaaS platform. Scalability beyond 100 concurrent users is a V3+ concern.

---

## 55. Testing

> **Note:** Full testing strategy will be specified in `docs/Architecture/TESTING_STRATEGY.md` during the Architecture phase.

### Planned Testing Approach

| Type | Scope |
|---|---|
| **API Testing** | Supertest / Postman for all endpoints |
| **Frontend Testing** | Manual + component testing as needed |
| **Integration Testing** | End-to-end user flows |
| **Security Testing** | Verify tenant isolation, injection prevention |

---

## 56. Deployment

> **Note:** Deployment strategy will be decided in Phase 6 (Polish).

### Candidates

| Platform | Pros | Cons |
|---|---|---|
| **Render** | Free tier, easy MERN deployment | Cold starts on free tier |
| **Railway** | Simple, generous free tier | Usage limits |
| **Vercel + separate backend** | Great React hosting | Requires separate API hosting |

Decision deferred to implementation phase.

---

## 57. Future AI Features

These are V3+ explorations. NOT in scope for MVP or V2.

| Feature | Potential Value | Risk |
|---|---|---|
| LLM Debrief Assistant | Parse freeform notes into structured tags | API cost, accuracy, dependency |
| Mock Interview Generator | Create practice questions from weakness data | Requires AI API integration |
| JD-Resume Comparator | Highlight skill gaps between JD and resume | Complexity, misleading results |

**Rule:** AI must solve a real problem. Do not add AI merely because the project "should have AI."

---

## 58. Future Integrations

| Integration | Version | Value |
|---|---|---|
| Chrome extension (JD clipper) | V3 | Reduce manual JD pasting |
| Calendar .ics export | V2 | Interview schedule portability |
| Email status detection | V3 | Auto-detect recruiter responses |
| GitHub Pages portfolio | V3 | Public-facing application stats |

---

## 59. Risks

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| Debrief abandonment | 🔴 High | Medium | Ultra-fast UX. Gentle prompts. Never nag. |
| Insufficient data for analytics | 🟡 Medium | High | Guardrails prevent misleading outputs |
| "Dashboard of depression" effect | 🟡 Medium | Medium | Action Center over rejection counts |
| Feature creep into AI territory | 🔴 High | High | Strict REMOVED features list |
| Competition from funded SaaS | 🟡 Medium | Low | Our niche is unserved |
| Self-reported data bias | 🟡 Medium | High | No causal claims. "User Log" labeling. |

---

## 60. Assumptions

| Assumption | Risk if Wrong | Mitigation |
|---|---|---|
| Users will complete debriefs | Diagnostic loop breaks | 90-second UX + Action Center prompts |
| Users apply enough per resume version (N ≥ 15) | Resume analytics never activate | Progress indicators |
| 7-stage pipeline covers all workflows | Users may need custom stages | Monitor feedback for V2 |
| Students/freshers are primary audience | UX priorities may be wrong | Design for students first, expandable |
| Users tag topics consistently | Garbage-in, garbage-out | Autocomplete taxonomy reduces ambiguity |

---

## 61. Open Questions

### Resolved

| Question | Decision | Date |
|---|---|---|
| Pipeline stage count | 7 fixed stages | 2026-09-24 |
| Custom statuses | No | 2026-09-24 |
| Stale threshold default | 14 days (7-45 customizable) | 2026-09-24 |
| Weakness heatmap guardrail | N ≥ 5 debriefs | 2026-09-24 |
| Resume cohort guardrail | N ≥ 15 per cohort | 2026-09-24 |
| Target market | General (not India-specific) | 2026-09-24 |
| Product name | JobCaliber | 2026-09-24 |
| Existing docs treatment | Drafts — rebuild via research process | 2026-09-24 |

### Open (For Future Phases)

| Question | Phase |
|---|---|
| Stale engine: on-read recalculation vs. scheduled cron? | Architecture |
| Custom topic tag merging (e.g., "DP" → "Dynamic Programming")? | V2 |
| Lower resume cohort threshold to N ≥ 10? | Post-Launch |
| Deployment platform? | Phase 6 |

---

## 62. Research Evidence

All research evidence is documented with full classification and sourcing in `docs/Research_And_Documentation/RESEARCH.md`.

Key evidence types used:
- `[FACT]` — Objectively verifiable
- `[USER REPORT]` — Qualitative from real users
- `[RESEARCH FINDING]` — Aggregated from surveys/reports
- `[PRODUCT INTERPRETATION]` — Our analysis of observed facts
- `[HYPOTHESIS]` — Untested assumptions
- `[RECOMMENDATION]` — Decisions based on accumulated evidence

---

## 63. Sources

| Source Type | Specific Sources |
|---|---|
| Reddit | r/cscareerquestions, r/jobs, r/jobsearchhacks, r/recruitinghell, r/developersIndia |
| Competitors | Teal, Huntr, Simplify, Jobscan, JibberJobber |
| Platforms | Notion templates, Google Sheets workflows |
| Open source | GitHub MERN job tracker repositories |
| Community | Hacker News, Product Hunt, dev.to |
| Industry | Hiring funnel statistics, ghosting rate surveys (2024-2026) |
| Reviews | Trustpilot |

---

## 64. Product Decisions

| # | Decision | Rationale | Date |
|---|---|---|---|
| PD-01 | Product name: JobCaliber | Clean namespace, dual meaning, zero competitors | 2026-09-24 |
| PD-02 | 7 fixed pipeline stages | Covers real workflows; enables consistent aggregation | 2026-09-24 |
| PD-03 | No custom statuses | Analytics integrity requires stable stage definitions | 2026-09-24 |
| PD-04 | 14-day stale threshold (default) | Research: most responses come within 2 weeks | 2026-09-24 |
| PD-05 | N ≥ 5 weakness guardrail | Balanced: enough data for patterns, achievable | 2026-09-24 |
| PD-06 | N ≥ 15 resume guardrail | Statistically safer for conversion comparisons | 2026-09-24 |
| PD-07 | 2 mandatory fields only | Directly targets #1 cause of tracker abandonment | 2026-09-24 |
| PD-08 | Max 3 Action Center items | Prevents decision fatigue | 2026-09-24 |
| PD-09 | No AI in MVP | Community skepticism of AI tools; ChatGPT is free | 2026-09-24 |
| PD-10 | No ATS scoring | Universally distrusted; pseudo-scientific | 2026-09-24 |
| PD-11 | No gamification/streaks | Adds guilt to stressful process | 2026-09-24 |
| PD-12 | General market (not India-specific) | OA/Screening stage naturally serves Indian workflows | 2026-09-24 |
| PD-13 | Duplicate detection at 60 days | Prevent accidental re-applications | 2026-09-24 |
| PD-14 | MERN + Tailwind stack | User's known technologies; no unfamiliar additions | 2026-09-24 |

---

## 65. Decision History

All decisions documented above were made through a structured process:

1. **Step 0.1:** Product Discovery & Validation Research — Research across Reddit, competitors, industry data
2. **Step 0.2:** Product Direction & Positioning — Q&A session to lock 8 key decisions
3. **Step 0.3:** Feature Specification & User Stories — 35 user stories with acceptance criteria

Each decision is traceable to specific evidence in `docs/Research_And_Documentation/RESEARCH.md`.

Future decisions will be documented in `DECISIONS.md` (to be created in a subsequent step).
