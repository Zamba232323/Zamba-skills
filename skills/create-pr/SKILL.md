---
name: create-pr
description: "Use when ready to integrate work — decides branch strategy, then creates comprehensive PR"
---

<!-- Extended from: wshobson/agents (git-pr-workflows/pr-enhance + git-workflow) -->
<!-- Source: https://github.com/wshobson/agents -->
<!-- Zamba additions: branch strategy decision layer before PR creation -->

# Create PR

## Overview

Two-phase skill: first DECIDE the integration strategy, then EXECUTE it with a comprehensive PR.

## Phase 1: Branch Strategy Decision

Before creating any PR, decide the strategy:

```
Changes ready to integrate
├── Trivial hotfix (1-2 lines, obvious fix)
│   └── Option 1: Push directly to main
├── Feature work (new functionality, multi-file)
│   ├── Option 2: Create branch only (for continued work)
│   └── Option 3: Create branch + PR (standard)
└── Large change (breaking, needs review)
    └── Option 3: Create branch + PR (mandatory)
```

### Decision Factors

| Factor | Direct push | Branch only | Branch + PR |
|--------|------------|-------------|-------------|
| Lines changed | < 5 | Any | Any |
| Files changed | 1 | Any | Any |
| Has tests | Optional | Should | Must |
| Breaking change | Never | Never | Required |
| Needs review | No | Later | Now |

### Ask the User

Present the recommendation and let the user decide:

```
## Integration Strategy

**Changes:** [summary]
**Recommendation:** [option N] because [reason]

1. Push directly to main
2. Create branch `feature/[name]`
3. Create branch + PR

Which approach?
```

## Phase 2: PR Creation (if Option 3)

Use the wshobson/pr-enhance base to create a comprehensive PR:

### PR Body Template

```markdown
## Summary
[2-3 bullet points of what changed and why]

## Changes
| Category | Files |
|----------|-------|
| Source | [list] |
| Tests | [list] |
| Config | [list] |
| Docs | [list] |

## Test Coverage
- [ ] Unit tests: [status]
- [ ] Integration tests: [status]
- [ ] All tests passing: [yes/no]

## Breaking Changes
[None / list]

## Review Checklist
- [ ] Code follows project conventions
- [ ] Tests cover new functionality
- [ ] No hardcoded secrets or credentials
- [ ] Documentation updated
```

### Commands

```bash
# Create branch
git checkout -b feature/[name]

# Push
git push -u origin feature/[name]

# Create PR
gh pr create --title "[title]" --body "[body from template]"
```
