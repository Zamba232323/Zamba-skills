---
name: pr-checklist
description: "Use before merging PR — pre-flight validation checks for config, security, and deployment readiness"
---

<!-- Adopted from: wshobson/agents (deployment-validation/config-validate) -->
<!-- Source: https://github.com/wshobson/agents -->

# PR Checklist

## Overview

Pre-flight validation before merge. Acts as a safety gate — checks configuration, security, test status, and deployment readiness.

**Announce at start:** "Running pre-merge checklist validation."

## Process

### Step 1: Configuration Validation

Detect and validate config files:
```bash
find . -maxdepth 3 \( -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.toml" -o -name "*.ini" -o -name ".env*" \) -not -path "*/node_modules/*" -not -path "*/.next/*"
```

For each config file:
- [ ] Valid syntax (parseable)
- [ ] No hardcoded secrets
- [ ] Consistent between environments (dev/staging/prod)
- [ ] Required fields present
- [ ] Type safety (ports are numbers, URLs are valid, durations parse correctly)

### Step 2: Security Scan

Check for common security issues:

```bash
# Search for potential secrets
grep -rn "password\|secret\|api_key\|token\|private_key" --include="*.ts" --include="*.js" --include="*.py" --include="*.go" -l
# Check for .env files that shouldn't be committed
git ls-files | grep -i "\.env"
```

Flag:
- [ ] Hardcoded passwords or API keys
- [ ] `.env` files in git
- [ ] HTTP URLs where HTTPS is expected
- [ ] Disabled security features (CORS *, auth bypass)
- [ ] SQL queries with string concatenation

### Step 3: Test Validation

- [ ] All tests pass (`npm test` / `pytest` / project test command)
- [ ] No skipped tests without justification
- [ ] Test coverage meets threshold (if configured)
- [ ] No `console.log` / `print` debugging left in test files

### Step 4: Code Quality

- [ ] No TODO/FIXME/HACK comments in new code
- [ ] No commented-out code blocks
- [ ] No unused imports or variables
- [ ] Consistent formatting (linter passes)
- [ ] No large files added (> 1MB)

### Step 5: Deployment Readiness

- [ ] Database migrations are reversible (if applicable)
- [ ] Environment variables documented
- [ ] Breaking changes noted in PR description
- [ ] Monitoring/alerting updated (if applicable)
- [ ] Feature flags set correctly (if applicable)

## Output

```
## Pre-Merge Checklist

### Configuration
- [x] All config files valid
- [ ] ISSUE: staging.env missing DATABASE_URL

### Security
- [x] No hardcoded secrets
- [x] No .env in git

### Tests
- [x] All tests pass (42/42)
- [x] Coverage: 87%

### Code Quality
- [x] Linter passes
- [ ] WARNING: 2 TODO comments in new code

### Deployment
- [x] Migrations reversible
- [x] Env vars documented

**Verdict:** READY / BLOCKED (fix N issues)
```

## Verdicts

| Issues | Verdict |
|--------|---------|
| No issues | READY — safe to merge |
| Warnings only | READY WITH WARNINGS — review before merge |
| Any security issue | BLOCKED — must fix before merge |
| Failing tests | BLOCKED — must fix before merge |
| Missing config | BLOCKED — must fix before merge |

## Integration

- Called as final gate in Integration phase
- Runs after `/create-pr` and before merge
- Pairs with `/test-coverage` for coverage check
