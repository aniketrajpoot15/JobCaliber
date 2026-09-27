<!-- 📌 WHAT IS THIS FILE? This is the Analytics Architecture Specification for JobCaliber. It defines the exact MongoDB aggregation pipelines, cumulative funnel mathematics, weakness frequency ranking, resume cohort comparison, and statistical guardrails. Any developer or agent implementing analytics controllers and backend aggregation queries must follow this document exactly. -->

# JOBCALIBER — ANALYTICS ARCHITECTURE SPECIFICATION

> **Version:** 1.0.0  
> **Status:** Phase 1 (Architecture) — In Progress  
> **Last Updated:** 2026-09-26  
> **Reference Documents:**  
> - `docs/Research_And_Documentation/PRD.md` (FR-10 Weakness Heatmap, FR-11 Funnel Analytics, FR-12 Resume Cohorts)  
> - `docs/Research_And_Documentation/DECISIONS.md` (ADR-005 Weakness Guardrail, ADR-006 Resume Guardrail)  
> - `docs/Architecture/DATABASE_SCHEMA.md` (Collections, Fields, and Indexes)  
> - `docs/Architecture/API_SPEC.md` (Section 7: Analytics API)  
> - `AGENTS.md` (Section 9: Security Rules, Section 10: Statistical Integrity Rules)

---

## Table of Contents

1. [Analytics Philosophy & Statistical Integrity](#1-analytics-philosophy--statistical-integrity)
2. [Tenant Isolation & Aggregation Security](#2-tenant-isolation--aggregation-security)
3. [Pipeline 1: Application Funnel Conversion Pipeline](#3-pipeline-1-application-funnel-conversion-pipeline)
4. [Pipeline 2: Weakness Frequency Heatmap Pipeline](#4-pipeline-2-weakness-frequency-heatmap-pipeline)
5. [Pipeline 3: Resume Version Cohort Comparison Pipeline](#5-pipeline-3-resume-version-cohort-comparison-pipeline)
6. [Sample Size Guardrail Engine](#6-sample-size-guardrail-engine)
7. [Index Utilization & Query Performance Plan](#7-index-utilization--query-performance-plan)
8. [Backend Implementation Blueprint](#8-backend-implementation-blueprint)
9. [Action Center Triage Engine & Priority Logic](#9-action-center-triage-engine--priority-logic)

---

## 1. Analytics Philosophy & Statistical Integrity

JobCaliber is designed as a **closed-loop intelligence system** (`CAPTURE → TRACK → DEBRIEF → LEARN → ACT`). The `LEARN` stage exists to replace anxiety and guesswork with empirical signal. To prevent users from drawing flawed conclusions from small or skewed datasets, all analytics features are governed by non-negotiable statistical integrity rules.

### 1.1 Three-Tier Truth Classification

Every data point rendered on the client belongs to one of three truth classifications:

| Tier | Name | Definition | Example in JobCaliber |
|---|---|---|---|
| **Tier 1** | `[FACT]` | Concrete historical actions explicitly logged by the user. | "You submitted 45 applications." |
| **Tier 2** | `[USER LOG]` | Subjective, self-reported candidate evaluations captured during post-interview debriefs. | "You rated your confidence 2/5 and logged difficulties with Dynamic Programming." |
| **Tier 3** | `[SYSTEM PATTERN]` | Statistical aggregations derived across multiple records when and only when sample-size thresholds are met. | "Dynamic Programming was tagged in 6 of your last 10 debriefs." |

### 1.2 Absolute Prohibition on Causal Claims

The system **never** asserts causality between interview topics or resume versions and job search outcomes. 

- ❌ **Forbidden Causal Phrasing:**
  - "You were rejected because you failed Dynamic Programming."
  - "Resume v2 got you more interviews."
  - "Your weakness in Graphs is hurting your career."
- ✅ **Mandatory Empirical Phrasing:**
  - "Dynamic Programming was recorded as a struggle in 6 technical interview debriefs."
  - "Applications using Resume v2 recorded a higher advancement rate in your logged data."
  - "Most drop-offs occurred between Applied and OA/Screening."

---

## 2. Tenant Isolation & Aggregation Security

Every aggregation pipeline executed by the backend must strictly enforce tenant isolation:
1. **First Stage Rule:** The very first stage of every aggregation pipeline must be a `$match` stage specifying `{ userId: req.user._id }`.
2. **Type Safety:** The `userId` passed into `$match` must always be cast to a valid BSON `mongoose.Types.ObjectId` to ensure exact index matching.
3. **No Cross-Tenant Leaks:** Even if an aggregation uses `$lookup`, foreign documents must be joined with a correlation pipeline that also asserts matching `userId`.

```javascript
// Universal Tenant Isolation Anchor:
const baseMatch = {
  $match: {
    userId: new mongoose.Types.ObjectId(req.user._id),
    isArchived: false // Default filter for active application pipelines
  }
};
```

---

## 3. Pipeline 1: Application Funnel Conversion Pipeline

**API Route:** `GET /api/analytics/funnel`  
**Target Collection:** `applications`  
**Requirements:** FR-11.1 through FR-11.5  
**Index Used:** `{ userId: 1, status: 1 }`

### 3.1 Cumulative Funnel Mathematics

In JobCaliber, the progression funnel tracks the 4 forward stages of the pipeline:
1. `Applied`
2. `OA / Screening`
3. `Interviewing`
4. `Offer`

An application that reached `Offer` had to pass through `Applied`, `OA / Screening`, and `Interviewing`. Therefore, the funnel counts are **cumulative**:

$$\text{Count}(\text{Applied}) = N_{\text{Applied}} + N_{\text{OA / Screening}} + N_{\text{Interviewing}} + N_{\text{Offer}}$$
$$\text{Count}(\text{OA / Screening}) = N_{\text{OA / Screening}} + N_{\text{Interviewing}} + N_{\text{Offer}}$$
$$\text{Count}(\text{Interviewing}) = N_{\text{Interviewing}} + N_{\text{Offer}}$$
$$\text{Count}(\text{Offer}) = N_{\text{Offer}}$$

Non-progression statuses (`Saved`, `Rejected`, `Ghosted`) are excluded from the cumulative progression bars but reported in the contextual metadata object.

### 3.2 Conversion Rate & Dropoff Formulas

For consecutive funnel stages $S_i \rightarrow S_{i+1}$:

$$\text{Dropoff}(S_i \rightarrow S_{i+1}) = \text{Count}(S_i) - \text{Count}(S_{i+1})$$
$$\text{Conversion Rate}(S_i \rightarrow S_{i+1}) = \begin{cases} \left( \frac{\text{Count}(S_{i+1})}{\text{Count}(S_i)} \right) \times 100\% & \text{if } \text{Count}(S_i) > 0 \\ 0\% & \text{if } \text{Count}(S_i) = 0 \end{cases}$$

### 3.3 MongoDB Aggregation Pipeline Definition

```javascript
/**
 * Funnel Aggregation Pipeline
 * Collection: applications
 */
const getFunnelPipeline = (userId) => [
  // Stage 1: Tenant isolation & active applications filter
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      isArchived: false
    }
  },
  // Stage 2: Group by pipeline status and count documents
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
];
```

### 3.4 Controller Post-Processing & Dropoff Logic

The aggregation pipeline returns raw per-status counts. The controller transforms these into cumulative funnel bars, computes dropoffs, and identifies the biggest dropoff bottleneck:

```javascript
function processFunnelData(rawCounts) {
  // 1. Build map of status counts with defaults
  const counts = {
    'Saved': 0,
    'Applied': 0,
    'OA / Screening': 0,
    'Interviewing': 0,
    'Offer': 0,
    'Rejected': 0,
    'Ghosted': 0
  };

  rawCounts.forEach(item => {
    if (counts.hasOwnProperty(item._id)) {
      counts[item._id] = item.count;
    }
  });

  // 2. Compute cumulative funnel counts
  const offerTotal = counts['Offer'];
  const interviewTotal = counts['Interviewing'] + offerTotal;
  const oaTotal = counts['OA / Screening'] + interviewTotal;
  const appliedTotal = counts['Applied'] + oaTotal;

  const funnel = [
    { stage: 'Applied', count: appliedTotal },
    { stage: 'OA / Screening', count: oaTotal },
    { stage: 'Interviewing', count: interviewTotal },
    { stage: 'Offer', count: offerTotal }
  ];

  // 3. Compute dropoffs between stages
  const dropoffs = [
    {
      from: 'Applied',
      to: 'OA / Screening',
      dropped: Math.max(0, appliedTotal - oaTotal),
      conversionRate: appliedTotal > 0 ? Number(((oaTotal / appliedTotal) * 100).toFixed(1)) : 0
    },
    {
      from: 'OA / Screening',
      to: 'Interviewing',
      dropped: Math.max(0, oaTotal - interviewTotal),
      conversionRate: oaTotal > 0 ? Number(((interviewTotal / oaTotal) * 100).toFixed(1)) : 0
    },
    {
      from: 'Interviewing',
      to: 'Offer',
      dropped: Math.max(0, interviewTotal - offerTotal),
      conversionRate: interviewTotal > 0 ? Number(((offerTotal / interviewTotal) * 100).toFixed(1)) : 0
    }
  ];

  // 4. Identify largest absolute dropoff
  let biggestDropoff = null;
  let maxDrop = -1;

  dropoffs.forEach(drop => {
    if (drop.dropped > maxDrop && drop.dropped > 0) {
      maxDrop = drop.dropped;
      biggestDropoff = {
        from: drop.from,
        to: drop.to,
        dropped: drop.dropped,
        hint: getDropoffHint(drop.from, drop.to)
      };
    }
  });

  // 5. Assemble contextual metadata
  const totalApplications = Object.values(counts).reduce((a, b) => a + b, 0);

  return {
    funnel,
    dropoffs,
    biggestDropoff: biggestDropoff || {
      from: 'Applied',
      to: 'OA / Screening',
      dropped: 0,
      hint: 'Log more applications to identify your conversion pipeline patterns.'
    },
    context: {
      totalApplications,
      saved: counts['Saved'],
      rejected: counts['Rejected'],
      ghosted: counts['Ghosted']
    },
    truthClassification: 'FACT'
  };
}

function getDropoffHint(fromStage, toStage) {
  if (fromStage === 'Applied' && toStage === 'OA / Screening') {
    return "Most applications are filtered at the screening stage. Consider tailoring your resume to each role's keywords.";
  }
  if (fromStage === 'OA / Screening' && toStage === 'Interviewing') {
    return "Online assessments are a common filter. Practice timed coding problems to improve throughput.";
  }
  if (fromStage === 'Interviewing' && toStage === 'Offer') {
    return "Final-stage conversion is always competitive. Review your debrief patterns for recurring topics.";
  }
  return "Review logged interview debriefs to pinpoint friction points.";
}
```

---

## 4. Pipeline 2: Weakness Frequency Heatmap Pipeline

**API Route:** `GET /api/analytics/weaknesses?category=all`  
**Target Collection:** `problemlogs`  
**Requirements:** FR-10.1 through FR-10.5, ADR-005  
**Index Used:** `{ userId: 1, topicName: 1 }`, `{ userId: 1, category: 1 }`

### 4.1 Denormalization Rationale for High-Performance Analytics

In `DATABASE_SCHEMA.md` (Step 1.4 & Step 1.5), `userId` was explicitly denormalized onto each `ProblemLog` document.
- **Without denormalization:** Querying user weaknesses would require `$lookup` across `InterviewRound` and `Application`, incurring expensive join overhead on every analytics request.
- **With denormalization:** Problem logs are aggregated directly with a single indexed `$match: { userId }` stage. The query execution time remains $O(K)$ where $K$ is the number of stumble logs recorded by that user (typically $< 100$ records).

### 4.2 MongoDB Aggregation Pipeline Definition

```javascript
/**
 * Weakness Frequency Heatmap Pipeline
 * Collection: problemlogs
 * 
 * @param {ObjectId} userId 
 * @param {string} category - 'all' | 'Technical' | 'Behavioral' | 'System Design' | 'Custom'
 */
const getWeaknessPipeline = (userId, category = 'all') => {
  const matchCriteria = {
    userId: new mongoose.Types.ObjectId(userId)
  };

  if (category && category !== 'all') {
    matchCriteria.category = category;
  }

  return [
    // Stage 1: Tenant isolation & optional category filter
    { $match: matchCriteria },

    // Stage 2: Group by normalized topicName
    {
      $group: {
        _id: "$topicName",
        category: { $first: "$category" },
        frequency: { $sum: 1 },
        latestOccurrence: { $max: "$createdAt" },
        notesSample: { $push: { $cond: [{ $ne: ["$notes", ""] }, "$notes", "$$REMOVE"] } }
      }
    },

    // Stage 3: Sort by frequency descending, then recency descending
    {
      $sort: {
        frequency: -1,
        latestOccurrence: -1
      }
    },

    // Stage 4: Clean output shape
    {
      $project: {
        _id: 0,
        topicName: "$_id",
        category: 1,
        frequency: 1,
        latestOccurrence: 1,
        recentNote: { $arrayElemAt: ["$notesSample", 0] }
      }
    }
  ];
};
```

---

## 5. Pipeline 3: Resume Version Cohort Comparison Pipeline

**API Route:** `GET /api/analytics/resume-cohorts`  
**Target Collection:** `applications`  
**Requirements:** FR-12.1 through FR-12.5, ADR-006  
**Index Used:** `{ userId: 1, isArchived: 1 }`

### 5.1 Advancement Definition & Cohort Conversion

A resume version's purpose is to secure interview callbacks. In JobCaliber, **Advancement** is defined as an application progressing to any of the following stages:
- `OA / Screening`
- `Interviewing`
- `Offer`

$$\text{Conversion Rate} = \left( \frac{\text{Advanced Count}}{\text{Total Applications}} \right) \times 100\%$$

### 5.2 MongoDB Aggregation Pipeline Definition

```javascript
/**
 * Resume Cohort Comparison Pipeline
 * Collection: applications
 */
const getResumeCohortPipeline = (userId) => [
  // Stage 1: Tenant isolation, non-archived, non-empty resumeVersionTag
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      isArchived: false,
      resumeVersionTag: { $nin: [null, "", "undefined"] }
    }
  },

  // Stage 2: Group by resumeVersionTag and aggregate progression milestones
  {
    $group: {
      _id: "$resumeVersionTag",
      totalApplications: { $sum: 1 },
      appliedOnlyCount: {
        $sum: { $cond: [{ $eq: ["$status", "Applied"] }, 1, 0] }
      },
      advancedCount: {
        $sum: {
          $cond: [
            { $in: ["$status", ["OA / Screening", "Interviewing", "Offer"]] },
            1,
            0
          ]
        }
      },
      offerCount: {
        $sum: { $cond: [{ $eq: ["$status", "Offer"] }, 1, 0] }
      },
      rejectedCount: {
        $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] }
      },
      ghostedCount: {
        $sum: { $cond: [{ $eq: ["$status", "Ghosted"] }, 1, 0] }
      },
      firstUsed: { $min: "$createdAt" },
      lastUsed: { $max: "$createdAt" }
    }
  },

  // Stage 3: Project computed conversion metrics
  {
    $project: {
      _id: 0,
      resumeVersionTag: "$_id",
      totalApplications: 1,
      advancedCount: 1,
      offerCount: 1,
      rejectedCount: 1,
      ghostedCount: 1,
      firstUsed: 1,
      lastUsed: 1,
      conversionRate: {
        $cond: [
          { $gt: ["$totalApplications", 0] },
          {
            $round: [
              {
                $multiply: [
                  { $divide: ["$advancedCount", "$totalApplications"] },
                  100
                ]
              },
              1
            ]
          },
          0
        ]
      }
    }
  },

  // Stage 4: Sort by total volume descending
  {
    $sort: { totalApplications: -1 }
  }
];
```

---

## 6. Sample Size Guardrail Engine

Statistical insights derived from small samples are misleading and induce false confidence or unhelpful panic. JobCaliber enforces hard threshold guardrails (ADR-005, ADR-006).

### 6.1 Guardrail Specifications

| Metric | Minimum Threshold | Below-Threshold State | UI Behavior |
|---|---|---|---|
| **Weakness Patterns** | $N \ge 5$ completed debriefs | `hasEnoughData: false` | Mask rankings. Display progress ring: *"Complete 5 debriefs to reveal patterns (X/5)"*. |
| **Resume Cohort Rates** | $N \ge 15$ applications per cohort | `status: "gathering_data"` | Mask percentage. Display badge: *"Gathering Data (X/15)"*. |

### 6.2 Weakness Guardrail Computation (ADR-005)

Before returning heatmap data, the backend counts the user's total completed debriefs in `interviewrounds`:

```javascript
/**
 * Verifies debrief sample size threshold (N >= 5)
 */
async function checkDebriefGuardrail(userId) {
  const MIN_DEBRIEFS_REQUIRED = 5;

  const completedDebriefsCount = await InterviewRound.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    debriefCompleted: true
  });

  const hasEnoughData = completedDebriefsCount >= MIN_DEBRIEFS_REQUIRED;

  return {
    hasEnoughData,
    completedDebriefs: completedDebriefsCount,
    requiredDebriefs: MIN_DEBRIEFS_REQUIRED,
    guardrailMessage: hasEnoughData
      ? null
      : `Complete ${MIN_DEBRIEFS_REQUIRED} debriefs to reveal weakness patterns (${completedDebriefsCount}/${MIN_DEBRIEFS_REQUIRED})`
  };
}
```

### 6.3 Resume Cohort Guardrail Computation (ADR-006)

Each resume version cohort is independently evaluated against the $N \ge 15$ threshold:

```javascript
/**
 * Evaluates sample size status for each resume cohort
 */
function applyResumeGuardrails(cohorts) {
  const MIN_APPLICATIONS_PER_COHORT = 15;

  return cohorts.map(cohort => {
    const hasEnoughData = cohort.totalApplications >= MIN_APPLICATIONS_PER_COHORT;

    return {
      ...cohort,
      hasEnoughData,
      status: hasEnoughData ? 'active' : 'gathering_data',
      guardrail: {
        currentCount: cohort.totalApplications,
        requiredCount: MIN_APPLICATIONS_PER_COHORT,
        message: hasEnoughData
          ? 'Sufficient data'
          : `Gathering Data (${cohort.totalApplications}/${MIN_APPLICATIONS_PER_COHORT} applications)`
      },
      // When below threshold, conversion rate is suppressed to prevent premature bias
      displayConversionRate: hasEnoughData ? `${cohort.conversionRate}%` : 'N/A'
    };
  });
}
```

---

## 7. Index Utilization & Query Performance Plan

To satisfy Non-Functional Requirement **NFR-02** (all analytics endpoints must respond in $< 2000\text{ms}$), all three pipelines rely entirely on compound indexed fields.

### 7.1 Pipeline Execution Analysis

```
1. Funnel Pipeline:
   Query: applications.aggregate([...])
   Index: { userId: 1, status: 1 }
   Scan Type: IXSCAN (Index Scan on userId)
   Estimated Docs Examined: ≤ 500 applications per user
   Execution Time: < 15ms

2. Weakness Pipeline:
   Query: problemlogs.aggregate([...])
   Index: { userId: 1, topicName: 1 } or { userId: 1, category: 1 }
   Scan Type: IXSCAN
   Estimated Docs Examined: ≤ 100 problem logs per user
   Execution Time: < 10ms

3. Resume Cohort Pipeline:
   Query: applications.aggregate([...])
   Index: { userId: 1, isArchived: 1 }
   Scan Type: IXSCAN
   Estimated Docs Examined: ≤ 500 applications per user
   Execution Time: < 20ms
```

---

## 8. Backend Implementation Blueprint

This modular blueprint will be imported directly by `server/controllers/analyticsController.js` in Phase 6:

```javascript
// server/utils/analyticsPipelines.js (Blueprint for Phase 6)
const mongoose = require('mongoose');

exports.buildFunnelPipeline = (userId) => [
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      isArchived: false
    }
  },
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
];

exports.buildWeaknessPipeline = (userId, category) => {
  const match = { userId: new mongoose.Types.ObjectId(userId) };
  if (category && category !== 'all') {
    match.category = category;
  }
  return [
    { $match: match },
    {
      $group: {
        _id: "$topicName",
        category: { $first: "$category" },
        frequency: { $sum: 1 },
        latestOccurrence: { $max: "$createdAt" }
      }
    },
    { $sort: { frequency: -1, latestOccurrence: -1 } },
    {
      $project: {
        _id: 0,
        topicName: "$_id",
        category: 1,
        frequency: 1,
        latestOccurrence: 1
      }
    }
  ];
};

exports.buildResumeCohortPipeline = (userId) => [
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      isArchived: false,
      resumeVersionTag: { $nin: [null, "", "undefined"] }
    }
  },
  {
    $group: {
      _id: "$resumeVersionTag",
      totalApplications: { $sum: 1 },
      advancedCount: {
        $sum: {
          $cond: [
            { $in: ["$status", ["OA / Screening", "Interviewing", "Offer"]] },
            1,
            0
          ]
        }
      },
      offerCount: {
        $sum: { $cond: [{ $eq: ["$status", "Offer"] }, 1, 0] }
      }
    }
  },
  {
    $project: {
      _id: 0,
      resumeVersionTag: "$_id",
      totalApplications: 1,
      advancedCount: 1,
      offerCount: 1,
      conversionRate: {
        $cond: [
          { $gt: ["$totalApplications", 0] },
          {
            $round: [
              {
                $multiply: [
                  { $divide: ["$advancedCount", "$totalApplications"] },
                  100
                ]
              },
              1
            ]
          },
          0
        ]
      }
    }
  },
  { $sort: { totalApplications: -1 } }
];
```

---

## 9. Action Center Triage Engine & Priority Logic

**API Route:** `GET /api/analytics/triage`  
**Target Collections:** `interviewrounds`, `applications`, `problemlogs`  
**Requirements:** FR-13.1 through FR-13.7, Product Decision PD-07  
**Design Reference:** `docs/Architecture/API_SPEC.md` §7.4

### 9.1 Core Concept: The ACT Stage of the Loop

The Action Center is the culmination of JobCaliber's core product loop (`CAPTURE → TRACK → DEBRIEF → LEARN → ACT`). Rather than requiring the candidate to scan through lists of applications to figure out what needs attention, the triage engine automatically analyzes their entire pipeline and highlights the **top 3 highest-priority, time-sensitive actions**.

Key Architectural Constraints:
- **Maximum 3 Items (PD-07):** Strictly capped at 3 cards to eliminate cognitive overload and alert fatigue.
- **Priority Displacement:** Higher-urgency tasks automatically displace lower-urgency tasks.
- **All-Clear Zero State:** When no items meet any triage criteria, the engine returns an empty array with `isEmpty: true`, triggering the positive feedback UI: *"You're all caught up! 🎉"*.
- **No Background Cron Required:** Triage items are computed dynamically on-read in $< 20\text{ms}$ when the user loads the dashboard.

---

### 9.2 The 4 Priority Trigger Tiers

Triage items are evaluated across 4 priority tiers in strict numerical order ($1 \rightarrow 2 \rightarrow 3 \rightarrow 4$):

```
┌────────────────────────────────────────────────────────────────────────┐
│ PRIORITY 1: UPCOMING_INTERVIEW (🔴 Urgent Event — Next 48 Hours)       │
│ Condition: Scheduled interview within 48h, not completed               │
│ Action: Review notes, check company JD, prepare topics                 │
├────────────────────────────────────────────────────────────────────────┤
│ PRIORITY 2: PENDING_DEBRIEF (🟡 Memory Decay Critical — Past 24h)      │
│ Condition: Interview concluded > 2h ago, debrief not completed         │
│ Action: Complete 90-second debrief before memory fades                 │
├────────────────────────────────────────────────────────────────────────┤
│ PRIORITY 3: STALE_APPLICATION (🔵 Pipeline Inactivity — Exceeded Days) │
│ Condition: In Applied/Screening beyond personal threshold              │
│ Action: Send follow-up email, mark ghosted, or archive                 │
├────────────────────────────────────────────────────────────────────────┤
│ PRIORITY 4: RECURRING_TOPIC (🟣 Skill Friction — ≥ 3 Debrief Stumbles)  │
│ Condition: N ≥ 5 debriefs unlocked, topic stumbled in ≥ 3 interviews   │
│ Action: Targeted preparation for high-frequency weakness               │
└────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Trigger Specifications

| Tier | Type | Priority | Visual Icon | Trigger Criteria | Sort Order (Internal) | Title Format | Action CTA |
|---|---|---|---|---|---|---|---|
| **P1** | `UPCOMING_INTERVIEW` | `1` | 🔴 Crimson | `scheduledDate > now` AND `scheduledDate <= now + 48h` AND `debriefCompleted === false` | `scheduledDate ASC` (nearest first) | `"Interview at {company} in {hours}h"` | `"View Details"` |
| **P2** | `PENDING_DEBRIEF` | `2` | 🟡 Amber | `scheduledDate < now - 2h` AND `debriefCompleted === false` AND `scheduledDate >= now - 14d` | `scheduledDate ASC` (oldest first) | `"Debrief pending for {company} {roundType}"` | `"Start Debrief"` |
| **P3** | `STALE_APPLICATION` | `3` | 🔵 Steel Slate | `isStale === true` AND `isArchived === false` AND `status IN ['Applied', 'OA / Screening']` | `lastStatusUpdate ASC` (longest stale first) | `"No update from {company} in {days}d"` | `"Review Application"` |
| **P4** | `RECURRING_TOPIC` | `4` | 🟣 Indigo | Total completed debriefs $\ge 5$ AND topic tagged $\ge 3$ times in `problemlogs` | `frequency DESC` (highest stumble first) | `"{topic} recorded in {count} debriefs"` | `"Review Topic"` |

---

### 9.3 Top-3 Selection & Displacement Algorithm

The selection algorithm guarantees that the user never sees more than 3 items, with higher-priority items completely starving lower-priority items when capacity is reached.

```
ALGORITHM: SelectTopThreeTriageItems(userId)
Input: userId
Output: { items: Array[0..3], totalCandidates: Integer, isEmpty: Boolean }

1. Initialize candidates = []
2. now = CurrentDateTime()

3. // --- TIER 1: Fetch Upcoming Interviews ---
   p1Rounds = Query InterviewRound:
     WHERE userId == userId
       AND scheduledDate > now
       AND scheduledDate <= (now + 48 hours)
       AND debriefCompleted == false
     ORDER BY scheduledDate ASC
     POPULATE applicationId (companyName, roleTitle)

   FOR EACH round IN p1Rounds:
     hoursUntil = Round((round.scheduledDate - now) / 3600000)
     candidates.ADD({
       id: "triage-upcoming-" + round._id,
       type: "UPCOMING_INTERVIEW",
       priority: 1,
       icon: "🔴",
       title: "Interview at " + round.applicationId.companyName + " in " + hoursUntil + " hours",
       subtitle: round.roundType + " Round — " + FormatDate(round.scheduledDate),
       actionLabel: "View Details",
       actionLink: "/applications/" + round.applicationId._id,
       referenceId: round._id,
       referenceType: "interviewRound",
       meta: { hoursUntilInterview: hoursUntil, companyName: round.applicationId.companyName, roleTitle: round.applicationId.roleTitle, roundType: round.roundType }
     })

4. // --- TIER 2: Fetch Pending Debriefs ---
   // Exclude rounds that finished less than 2 hours ago (interview buffer)
   // Exclude rounds older than 14 days (abandoned debriefs)
   twoHoursAgo = now - 2 hours
   fourteenDaysAgo = now - 14 days
   p2Rounds = Query InterviewRound:
     WHERE userId == userId
       AND scheduledDate < twoHoursAgo
       AND scheduledDate >= fourteenDaysAgo
       AND debriefCompleted == false
     ORDER BY scheduledDate ASC
     POPULATE applicationId (companyName, roleTitle)

   FOR EACH round IN p2Rounds:
     hoursSince = Round((now - round.scheduledDate) / 3600000)
     candidates.ADD({
       id: "triage-debrief-" + round._id,
       type: "PENDING_DEBRIEF",
       priority: 2,
       icon: "🟡",
       title: "Debrief pending for " + round.applicationId.companyName + " " + round.roundType,
       subtitle: "Interview took place " + hoursSince + " hours ago — capture notes while fresh!",
       actionLabel: "Start Debrief",
       actionLink: "/applications/" + round.applicationId._id,
       referenceId: round._id,
       referenceType: "interviewRound",
       meta: { hoursSinceInterview: hoursSince, companyName: round.applicationId.companyName, roleTitle: round.applicationId.roleTitle, roundType: round.roundType }
     })

5. // --- TIER 3: Fetch Stale Applications ---
   // Check user's personal staleThresholdDays from User collection
   user = Query User: WHERE _id == userId
   thresholdDays = user.staleThresholdDays || 14
   thresholdDate = now - (thresholdDays * 24 hours)

   p3Apps = Query Application:
     WHERE userId == userId
       AND isArchived == false
       AND status IN ['Applied', 'OA / Screening']
       AND (lastStatusUpdate <= thresholdDate OR isStale == true)
     ORDER BY lastStatusUpdate ASC

   FOR EACH app IN p3Apps:
     daysSince = Round((now - app.lastStatusUpdate) / (24 * 3600000))
     candidates.ADD({
       id: "triage-stale-" + app._id,
       type: "STALE_APPLICATION",
       priority: 3,
       icon: "🔵",
       title: "No update from " + app.companyName + " in " + daysSince + " days",
       subtitle: "Applied for " + app.roleTitle + " — consider following up or archiving",
       actionLabel: "View Application",
       actionLink: "/applications/" + app._id,
       referenceId: app._id,
       referenceType: "application",
       meta: { daysSinceLastUpdate: daysSince, companyName: app.companyName, roleTitle: app.roleTitle, currentStatus: app.status }
     })

6. // --- TIER 4: Fetch Recurring Stumbled Topics ---
   // Check ADR-005 guardrail: only if completed debriefs >= 5
   completedDebriefs = Count InterviewRound WHERE userId == userId AND debriefCompleted == true
   IF completedDebriefs >= 5 THEN
     topRecurring = Aggregate ProblemLog:
       MATCH userId == userId
       GROUP BY topicName, count = Sum(1), category = First(category)
       MATCH count >= 3
       ORDER BY count DESC
       LIMIT 2

     FOR EACH topic IN topRecurring:
       candidates.ADD({
         id: "triage-topic-" + Hash(topic._id),
         type: "RECURRING_TOPIC",
         priority: 4,
         icon: "🟣",
         title: topic._id + " recorded in " + topic.count + " debriefs",
         subtitle: topic.category + " topic repeatedly logged as friction point",
         actionLabel: "Review Analytics",
         actionLink: "/analytics#weaknesses",
         referenceId: topic._id,
         referenceType: "topic",
         meta: { topicName: topic._id, count: topic.count, category: topic.category }
       })
   END IF

7. // --- Cap at Exactly 3 Items ---
   totalCandidates = candidates.Length
   finalItems = candidates.Slice(0, 3)

8. RETURN {
     items: finalItems,
     totalCandidates: totalCandidates,
     maxItems: 3,
     isEmpty: finalItems.Length == 0
   }
```

---

### 9.4 Client-Side Dismiss & Snooze Architecture

**Design Decision (ADR-013 / API_SPEC §7.4):** Dismiss and snooze actions are managed entirely **client-side** in browser `localStorage`.

#### Rationale:
1. **Zero Database Clutter:** Triage items are computed live on-the-fly. Storing dismissed IDs on the server would require creating an auxiliary collection with TTL expiration indexes, cleanup crons, and referential orphan checks.
2. **Ephemeral Nature:** An upcoming interview item naturally disappears after the interview passes; a pending debrief disappears once submitted; a stale item disappears once its status is updated. Client-side hiding is lightweight, instantaneous, and zero-latency.

#### LocalStorage Data Schema:
```json
// Key: "jc_triage_dismissed"
{
  "triage-stale-60f7b2a1e13e8c001f8e4b2c": "2026-09-26T14:30:00.000Z"
}

// Key: "jc_triage_snoozed"
{
  "triage-stale-60f7b2a1e13e8c001f8e4b2c": "2026-10-03T14:30:00.000Z" // Snoozed for 7 days
}
```

#### Filtering Rules:
- If `itemId` exists in `jc_triage_dismissed`: item is hidden.
- If `itemId` exists in `jc_triage_snoozed` AND `now < new Date(snoozedUntil)`: item is hidden.
- If `now >= new Date(snoozedUntil)`: the snooze expired; item resurfaces in the Action Center.

---

### 9.5 Edge Cases & Robustness Handlers

| Edge Case Scenario | Potential Failure | Engine Protection / Behavior |
|---|---|---|
| **Zero applications in account** | Pipeline queries fail on empty collections. | Queries return empty arrays cleanly; engine returns `isEmpty: true` with zero-state UI. |
| **Interview finished 15 minutes ago** | Candidate is walking out of interview; showing "Debrief pending" immediately causes stress. | 2-hour buffer enforced: `scheduledDate < (now - 2 hours)`. Debrief prompt appears only after buffer. |
| **Abandoned debrief from 6 months ago** | Ancient round permanently clogs Priority 2 forever. | 14-day cutoff enforced: `scheduledDate >= (now - 14 days)`. Rounds older than 14d do not trigger triage. |
| **Over 100 stale applications** | Huge database fetch on every dashboard page load. | Compound index `{ userId: 1, isStale: 1 }` with query limit ensures database scans $\le 10$ records. |
| **Candidate deletes application while round exists** | Orphaned round causes `applicationId` to populate as `null`. | Engine filters out any candidate where `round.applicationId === null`. |
| **User modified stale threshold from 14 to 30 days** | Stale status flag in DB might be out of sync. | Engine checks both `isStale: true` OR `lastStatusUpdate <= (now - thresholdDays)` to ensure dynamic accuracy. |

---

### 9.6 Controller Implementation Blueprint

This function represents the exact controller logic to be implemented in `server/controllers/analyticsController.js` during Phase 6:

```javascript
// server/controllers/analyticsController.js (Triage Handler Blueprint)
const InterviewRound = require('../models/InterviewRound');
const Application = require('../models/Application');
const ProblemLog = require('../models/ProblemLog');
const User = require('../models/User');

exports.getTriage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const candidates = [];

    // Fetch user stale threshold
    const user = await User.findById(userId).select('staleThresholdDays').lean();
    const staleDays = user?.staleThresholdDays || 14;

    // 1. PRIORITY 1: Upcoming Interviews (next 48h)
    const in48Hours = new Date(now.getTime() + 48 * 3600000);
    const upcomingRounds = await InterviewRound.find({
      userId,
      scheduledDate: { $gt: now, $lte: in48Hours },
      debriefCompleted: false
    })
      .sort({ scheduledDate: 1 })
      .populate('applicationId', 'companyName roleTitle')
      .lean();

    for (const round of upcomingRounds) {
      if (!round.applicationId) continue; // Skip orphaned rounds
      const hoursUntil = Math.round((new Date(round.scheduledDate) - now) / 3600000);
      candidates.push({
        id: `triage-upcoming-${round._id}`,
        type: 'UPCOMING_INTERVIEW',
        priority: 1,
        icon: '🔴',
        title: `Interview at ${round.applicationId.companyName} in ${hoursUntil} hours`,
        subtitle: `${round.roundType} Round — ${new Date(round.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        actionLabel: 'View Details',
        actionLink: `/applications/${round.applicationId._id}`,
        referenceId: round._id,
        referenceType: 'interviewRound',
        meta: {
          hoursUntilInterview: hoursUntil,
          companyName: round.applicationId.companyName,
          roleTitle: round.applicationId.roleTitle,
          roundType: round.roundType
        }
      });
    }

    // 2. PRIORITY 2: Pending Debriefs (ended > 2h ago, within last 14d)
    const twoHoursAgo = new Date(now.getTime() - 2 * 3600000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 3600000);
    const pendingRounds = await InterviewRound.find({
      userId,
      scheduledDate: { $lt: twoHoursAgo, $gte: fourteenDaysAgo },
      debriefCompleted: false
    })
      .sort({ scheduledDate: 1 })
      .populate('applicationId', 'companyName roleTitle')
      .lean();

    for (const round of pendingRounds) {
      if (!round.applicationId) continue;
      const hoursSince = Math.round((now - new Date(round.scheduledDate)) / 3600000);
      candidates.push({
        id: `triage-debrief-${round._id}`,
        type: 'PENDING_DEBRIEF',
        priority: 2,
        icon: '🟡',
        title: `Debrief pending for ${round.applicationId.companyName} ${round.roundType}`,
        subtitle: `Interview was ${hoursSince} hours ago — log topics while memories are fresh!`,
        actionLabel: 'Start Debrief',
        actionLink: `/applications/${round.applicationId._id}`,
        referenceId: round._id,
        referenceType: 'interviewRound',
        meta: {
          hoursSinceInterview: hoursSince,
          companyName: round.applicationId.companyName,
          roleTitle: round.applicationId.roleTitle,
          roundType: round.roundType
        }
      });
    }

    // 3. PRIORITY 3: Stale Applications
    const staleDate = new Date(now.getTime() - staleDays * 24 * 3600000);
    const staleApps = await Application.find({
      userId,
      isArchived: false,
      status: { $in: ['Applied', 'OA / Screening'] },
      $or: [{ isStale: true }, { lastStatusUpdate: { $lte: staleDate } }]
    })
      .sort({ lastStatusUpdate: 1 })
      .limit(5)
      .lean();

    for (const app of staleApps) {
      const daysSince = Math.round((now - new Date(app.lastStatusUpdate)) / (24 * 3600000));
      candidates.push({
        id: `triage-stale-${app._id}`,
        type: 'STALE_APPLICATION',
        priority: 3,
        icon: '🔵',
        title: `No update from ${app.companyName} in ${daysSince} days`,
        subtitle: `Applied for ${app.roleTitle} — consider sending a follow-up or archiving`,
        actionLabel: 'View Application',
        actionLink: `/applications/${app._id}`,
        referenceId: app._id,
        referenceType: 'application',
        meta: {
          daysSinceLastUpdate: daysSince,
          companyName: app.companyName,
          roleTitle: app.roleTitle,
          currentStatus: app.status
        }
      });
    }

    // 4. PRIORITY 4: Recurring Topics (Guardrail: >= 5 debriefs)
    const completedDebriefsCount = await InterviewRound.countDocuments({
      userId,
      debriefCompleted: true
    });

    if (completedDebriefsCount >= 5) {
      const recurringTopics = await ProblemLog.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: '$topicName',
            category: { $first: '$category' },
            count: { $sum: 1 }
          }
        },
        { $match: { count: { $gte: 3 } } },
        { $sort: { count: -1 } },
        { $limit: 2 }
      ]);

      for (const topic of recurringTopics) {
        candidates.push({
          id: `triage-topic-${encodeURIComponent(topic._id)}`,
          type: 'RECURRING_TOPIC',
          priority: 4,
          icon: '🟣',
          title: `${topic._id} recorded in ${topic.count} debriefs`,
          subtitle: `${topic.category} topic repeatedly logged as friction point`,
          actionLabel: 'Review Analytics',
          actionLink: '/analytics#weaknesses',
          referenceId: topic._id,
          referenceType: 'topic',
          meta: {
            topicName: topic._id,
            count: topic.count,
            category: topic.category
          }
        });
      }
    }

    const totalCandidates = candidates.length;
    const finalItems = candidates.slice(0, 3);

    return res.status(200).json({
      success: true,
      data: {
        items: finalItems,
        totalCandidates,
        maxItems: 3,
        isEmpty: finalItems.length === 0
      }
    });
  } catch (error) {
    next(error);
  }
};
```

