---
name: scope-check
description: "Use when validating plan scope — analyzes task count and complexity, warns if too much for one session"
---

# Scope Check

## Overview

Validate that the implementation plan is realistically achievable. Count tasks, estimate complexity, and warn before overcommitting.

**Announce at start:** "Running scope check on the current plan."

## The Process

### Step 1: Load the Plan

Read the active implementation plan from `docs/plans/`.

### Step 2: Count and Classify Tasks

For each task in the plan, classify:

| Complexity | Criteria | Time estimate |
|-----------|----------|---------------|
| Simple | Single file, < 20 lines, no dependencies | 2-5 min |
| Medium | 2-3 files, tests needed, clear approach | 10-20 min |
| Complex | 4+ files, new patterns, external deps, research needed | 30-60 min |

### Step 3: Calculate Total Load

```
Total load = (simple x 1) + (medium x 3) + (complex x 8)
```

| Load score | Verdict |
|-----------|---------|
| 1-10 | Good — fits in one session |
| 11-20 | Ambitious — consider splitting |
| 21+ | Too much — must split into multiple sessions |

### Step 4: Check for Hidden Complexity

Flag these patterns:
- [ ] Tasks with vague descriptions ("improve X", "refactor Y")
- [ ] Tasks touching shared/core files (high blast radius)
- [ ] Tasks with external dependencies (API calls, new packages)
- [ ] Tasks that require research before implementation
- [ ] Circular dependencies between tasks

### Step 5: Report

```
## Scope Check Report

**Tasks:** X total (Y simple, Z medium, W complex)
**Load score:** N — [verdict]
**Hidden complexity flags:** [list or "none"]

### Recommendation
[Keep as-is / Split into N sessions / Remove tasks X,Y]

### Suggested session split (if needed)
- Session 1: Tasks 1-3 (load: 8) — [theme]
- Session 2: Tasks 4-7 (load: 12) — [theme]
```

## Integration

- Called after `/write-plan` in Phase 1
- If load > 20, block progression to Phase 2
- Re-run after any plan modifications
