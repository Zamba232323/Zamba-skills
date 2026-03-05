---
name: test-coverage
description: "Use when auditing test coverage — identifies missing tests for critical business logic paths"
---

<!-- Adopted from: levnikolaevich/claude-code-skills (ln-634-test-coverage-auditor) -->
<!-- Source: https://github.com/levnikolaevich/claude-code-skills -->

# Test Coverage

## Overview

Audit test coverage by identifying critical business logic paths that lack tests. Prioritizes by risk — money flows and security paths first.

**Announce at start:** "Auditing test coverage for critical paths."

## Process

### Step 1: Discover Code Structure

Map the project:
```bash
find src/ lib/ app/ -name "*.ts" -o -name "*.py" -o -name "*.js" -o -name "*.go" 2>/dev/null | head -100
find tests/ test/ __tests__/ spec/ -name "*.test.*" -o -name "*.spec.*" -o -name "test_*" 2>/dev/null | head -100
```

### Step 2: Classify Critical Paths

| Category | Examples | Priority |
|----------|----------|----------|
| Money Flows | Payments, billing, discounts, taxes, subscriptions | 20+ |
| Security Flows | Authentication, authorization, tokens, passwords, encryption | 20+ |
| Data Integrity | CRUD operations, transactions, migrations, validation | 15+ |
| Core Flows | Main user workflows, business rules, state machines | 15+ |
| Integration Points | External APIs, webhooks, message queues | 10+ |
| Edge Cases | Error handling, boundary conditions, race conditions | 5+ |

### Step 3: Match Tests to Paths

For each critical path:
1. Find the source file(s)
2. Search for corresponding test file(s)
3. Check if tests cover the critical scenarios (not just happy path)

### Step 4: Identify Gaps

Build a gap report:

```
| Critical Path | Source | Test File | Coverage | Gap |
|--------------|--------|-----------|----------|-----|
| User login | auth/login.ts | tests/auth.test.ts | Partial | Missing: brute force, expired token |
| Payment | billing/charge.ts | — | None | No test file exists |
| Data export | export/csv.ts | tests/export.test.ts | Good | — |
```

### Step 5: Score and Report

Calculate compliance score:
```
Score = (tested critical paths / total critical paths) * 10
```

```
## Test Coverage Audit

**Critical paths found:** N
**Tested:** X/N
**Compliance score:** Y/10

### Untested Critical Paths (by priority)

1. **[Money Flow]** billing/charge.ts — No tests
   - Needs: unit test for charge calculation, integration test for payment gateway

2. **[Security]** auth/token.ts — Partial coverage
   - Missing: token expiry, refresh flow, revocation

### Recommendations
- [prioritized list of tests to write]
```

## Domain-Specific Scanning

Adapt categories to the project domain:
- **E-commerce:** Add inventory, shipping, returns
- **Healthcare:** Add HIPAA compliance, patient data access
- **Finance:** Add regulatory compliance, audit trails

## Integration

- Called in Quality phase after code review
- Feeds into `/generate-tests` for test creation
- Reads `.test-manifest.json` if available
