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
  // Stage 1: Tenant isolation, non-archived, non-empty resumeVersion
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      isArchived: false,
      resumeVersion: { $nin: [null, "", "undefined"] }
    }
  },

  // Stage 2: Group by resumeVersion and aggregate progression milestones
  {
    $group: {
      _id: "$resumeVersion",
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
      resumeVersion: "$_id",
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
      resumeVersion: { $nin: [null, "", "undefined"] }
    }
  },
  {
    $group: {
      _id: "$resumeVersion",
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
      resumeVersion: "$_id",
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

*End of Analytics Architecture Specification (Step 1.12).*  
*Section 9 (Action Center Triage Logic) will be added in Step 1.13.*
