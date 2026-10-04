// server/utils/constants.js
// Single Source of Truth: docs/Architecture/DATABASE_SCHEMA.md
// All enums and magic numbers live here. Import from this file — NEVER hardcode strings.

// =========================================================================
// APPLICATION PIPELINE STATUSES (ADR-003, ADR-012)
// =========================================================================
// Fixed 7-stage pipeline. No custom statuses allowed — this protects
// funnel analytics integrity. Any status can transition to any other
// (no enforced state machine in MVP).

const STATUS_ENUM = Object.freeze([
  'Saved',
  'Applied',
  'OA / Screening',
  'Interviewing',
  'Offer',
  'Rejected',
  'Ghosted'
]);

// Only these two statuses can be flagged as "stale" (FR-04.6).
// Saved = not yet submitted, Interviewing/Offer/Rejected/Ghosted = resolved.
const STALEABLE_STATUSES = Object.freeze([
  'Applied',
  'OA / Screening'
]);

// =========================================================================
// INTERVIEW ROUND TYPES
// =========================================================================
// 5 canonical round types covering the full interview lifecycle.
// Defined in DATABASE_SCHEMA.md §4.2 and §4.4.

const ROUND_TYPE_ENUM = Object.freeze([
  'Recruiter',
  'Technical',
  'System Design',
  'HR',
  'OA'
]);

// =========================================================================
// WORK MODE (Optional field on Application)
// =========================================================================
// Empty string '' means "not specified" — avoids null checks throughout
// the codebase. Mongoose enum validation includes '' in the allowed values.

const WORK_MODE_ENUM = Object.freeze([
  '',
  'Remote',
  'Hybrid',
  'Onsite'
]);

// =========================================================================
// APPLICATION SOURCE (Optional field on Application)
// =========================================================================
// Where the user discovered the job listing. Empty string = not specified.
// V2 will calculate conversion rates per source (ADR-011 future scope).

const SOURCE_ENUM = Object.freeze([
  '',
  'LinkedIn',
  'Naukri',
  'Referral',
  'Company Website',
  'Indeed',
  'AngelList',
  'Other'
]);

// =========================================================================
// INTERVIEW QUESTION CATEGORIES
// =========================================================================
// High-level categorization for the candidate's personal question bank.
// Defined in DATABASE_SCHEMA.md §5.2.

const QUESTION_CATEGORY_ENUM = Object.freeze([
  'Technical',
  'System Design',
  'Behavioral',
  'Resume',
  'Other'
]);

// =========================================================================
// PROBLEM LOG CATEGORIES (Weakness Taxonomy)
// =========================================================================
// Two-level taxonomy for stumble topic classification (FR-09.2, FR-09.4).
// 'Custom' is for user-created topics not in the standard taxonomy.

const PROBLEM_CATEGORY_ENUM = Object.freeze([
  'Technical',
  'Behavioral',
  'System Design',
  'Custom'
]);

// =========================================================================
// SYSTEM CONSTANTS (Magic Numbers → Named Constants)
// =========================================================================

// Action Center: maximum items shown at once (PD-07)
const MAX_ACTION_CENTER_ITEMS = 3;

// Stale threshold: default days before an application is flagged (ADR-004)
// 81% of recruiter callbacks occur within 14 days per research.
// User-configurable range: 7–45 days.
const DEFAULT_STALE_THRESHOLD_DAYS = 14;
const MIN_STALE_THRESHOLD_DAYS = 7;
const MAX_STALE_THRESHOLD_DAYS = 45;

// Duplicate detection: window in days (ADR-013)
// Re-applying after 60+ days = new hiring cycle, not a duplicate.
const DUPLICATE_DETECTION_WINDOW_DAYS = 60;

// Analytics guardrails — minimum sample sizes before showing patterns
// (ADR-005, ADR-006). Below these thresholds, UI shows "Gathering Data (X/N)".
const MIN_DEBRIEFS_FOR_WEAKNESS_PATTERN = 5;   // FR-10: Weakness heatmap
const MIN_APPS_FOR_RESUME_COHORT = 15;          // FR-12: Resume cohort tracker
const MIN_APPS_FOR_SOURCE_CONVERSION = 20;      // V2: Source conversion analytics

// =========================================================================
// EXPORTS
// =========================================================================

module.exports = {
  // Enums
  STATUS_ENUM,
  STALEABLE_STATUSES,
  ROUND_TYPE_ENUM,
  WORK_MODE_ENUM,
  SOURCE_ENUM,
  QUESTION_CATEGORY_ENUM,
  PROBLEM_CATEGORY_ENUM,

  // System constants
  MAX_ACTION_CENTER_ITEMS,
  DEFAULT_STALE_THRESHOLD_DAYS,
  MIN_STALE_THRESHOLD_DAYS,
  MAX_STALE_THRESHOLD_DAYS,
  DUPLICATE_DETECTION_WINDOW_DAYS,
  MIN_DEBRIEFS_FOR_WEAKNESS_PATTERN,
  MIN_APPS_FOR_RESUME_COHORT,
  MIN_APPS_FOR_SOURCE_CONVERSION
};
