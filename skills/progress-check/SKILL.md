---
name: progress-check
description: "Use when mid-build — compares current state to plan, flags drift and scope creep"
---

# Progress Check

## Overview

Mid-build checkpoint. Stop, breathe, compare reality to the plan. Are you still on track?

**Announce at start:** "Running progress check — comparing state to plan."

## The Process

### Step 1: Load Plan and Count Expected Tasks

Read the plan. List all tasks with expected status.

### Step 2: Check Actual State

Run in parallel:
1. `git log --oneline` — what commits exist since session start
2. `git diff --stat` — any uncommitted work
3. `git stash list` — anything stashed and forgotten
4. Run tests — are they passing?

### Step 3: Compare Plan vs Reality

Build a comparison table:

```
| Task | Plan Status | Actual Status | Notes |
|------|------------|---------------|-------|
| Task 1 | Should be done | Done (commit abc123) | — |
| Task 2 | In progress | Not started | Behind schedule |
| Task 3 | Not started | Partially done | Scope creep? |
```

### Step 4: Detect Drift

Flag these issues:
- **Scope creep:** Work done that's NOT in the plan
- **Behind schedule:** Tasks expected done that aren't
- **Changed approach:** Implementation differs from plan
- **Blocked:** Tasks that can't proceed (missing deps, unclear requirements)
- **Quality debt:** Tests skipped, TODOs added, hacks introduced

### Step 5: Decision

| Situation | Action |
|-----------|--------|
| On track | Continue to next task |
| Minor drift | Note it, adjust remaining estimates |
| Major drift | Stop. Re-assess. Update plan or descope |
| Blocked | Flag to user immediately |

### Step 6: Output Report

```
## Progress Check — [timestamp]

**Session tasks:** X/Y completed
**Tests:** [passing/failing count]
**Drift detected:** [yes/no]

### Status
[comparison table]

### Issues
[list or "none — on track"]

### Recommendation
[continue / adjust plan / stop and re-plan]
```

## When to Run

- After completing every 2-3 tasks
- When something feels "off"
- When you've been working > 30 minutes without checking
- Before starting any complex task
