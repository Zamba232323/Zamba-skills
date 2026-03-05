---
name: update-changelog
description: "Use when generating changelog — analyzes git commits and categorizes changes"
---

<!-- Adopted from: ComposioHQ/awesome-claude-skills (changelog-generator) -->
<!-- Source: https://github.com/ComposioHQ/awesome-claude-skills -->

# Update Changelog

## Overview

Generate a structured changelog from git history. Scans commits, categorizes changes, and formats according to Keep a Changelog standard.

**Announce at start:** "Generating changelog from git history."

## Process

### Step 1: Determine Range

Find the last changelog entry or tag:
```bash
git describe --tags --abbrev=0 2>/dev/null || echo "no tags"
git log --oneline -1 -- CHANGELOG.md 2>/dev/null || echo "no changelog"
```

If no previous changelog: scan all commits.
If changelog exists: scan from last entry to HEAD.

### Step 2: Analyze Commits

```bash
git log --oneline --no-merges [range]
```

For each commit, classify:

| Category | Commit patterns |
|----------|----------------|
| Features | `feat:`, `add:`, new files, new functionality |
| Improvements | `improve:`, `enhance:`, `update:`, performance |
| Bug Fixes | `fix:`, `bugfix:`, `hotfix:`, error corrections |
| Breaking Changes | `BREAKING:`, API changes, removed features |
| Security | `security:`, vulnerability fixes, dependency updates |
| Documentation | `docs:`, README changes, comment updates |
| Internal | `chore:`, `refactor:`, `ci:`, `test:` |

### Step 3: Filter Noise

Skip these commits:
- Merge commits (`Merge branch...`, `Merge pull request...`)
- Pure refactoring with no behavior change
- CI/tooling-only changes (unless user-facing)
- WIP/fixup commits

### Step 4: Translate to User Language

Convert technical commit messages to human-readable descriptions:
- `feat: add JWT auth middleware` → "Added JWT-based authentication"
- `fix: null check in user service` → "Fixed crash when user profile is incomplete"

### Step 5: Format Output

Write to `CHANGELOG.md`:

```markdown
# Changelog

## [Unreleased] - YYYY-MM-DD

### Features
- Description of new feature (#PR)

### Improvements
- Description of improvement

### Bug Fixes
- Description of fix

### Breaking Changes
- Description of breaking change

### Security
- Description of security fix
```

## Integration

- Called in Quality phase after code review
- Pairs with `/create-pr` for PR description
- Reads git history — requires clean commit messages
