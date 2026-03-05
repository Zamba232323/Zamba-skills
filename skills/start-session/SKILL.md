---
name: start-session
description: "Use when starting a new coding session — loads plan, assesses state, selects achievable tasks"
---

# Start Session

## Overview

Initialize a coding session with clarity. Load the implementation plan, assess repository state, and select only the tasks you can complete perfectly in this session.

**Core rule:** "Take only as many tasks as you can complete perfectly."

**Announce at start:** "Starting session — loading plan and assessing state."

## The Process

### Step 1: Find the Active Plan

Search for implementation plans:

```bash
ls docs/plans/*.md
```

If multiple plans exist, pick the most recent. If no plan exists, inform the user and suggest running `/brainstorm` → `/write-plan`.

### Step 2: Assess Repository State

Run these checks in parallel:

1. **Git status** — uncommitted changes, current branch, stashes
2. **Recent commits** — what was done in last session (`git log --oneline -10`)
3. **Open branches** — work in progress (`git branch -a`)
4. **Test state** — do existing tests pass? (run project test command)

### Step 3: Cross-Reference Plan vs State

Read the plan and determine:

- [ ] Which tasks are DONE (have commits, tests passing)
- [ ] Which tasks are IN PROGRESS (partial commits, failing tests)
- [ ] Which tasks are NOT STARTED
- [ ] Any tasks that were ADDED outside the plan (scope creep)

### Step 4: Select Tasks for This Session

Apply the capacity rule:

| Session type | Max tasks |
|-------------|-----------|
| Quick fix (< 30 min) | 1-2 simple tasks |
| Standard session | 3-5 tasks |
| Deep work session | 5-8 tasks |

**Selection criteria:**
1. Finish IN PROGRESS tasks first
2. Pick next NOT STARTED tasks in order
3. Never skip ahead — dependencies matter
4. If a task seems too large, flag it for splitting

### Step 5: Announce the Plan

Output a summary:

```
## Session Plan

**Continuing from:** [last completed task]
**Tasks this session:** [N tasks]

1. [ ] Task X — [brief description]
2. [ ] Task Y — [brief description]
3. [ ] Task Z — [brief description]

**Estimated scope:** [simple/medium/ambitious]
```

## Red Flags

| Thought | Reality |
|---------|---------|
| "I'll just do everything" | No. Pick what you can finish. |
| "This task is almost done" | Verify with git, don't assume. |
| "I can skip the plan check" | The plan IS the source of truth. |
| "Let me start coding first" | Assess first, code second. |
