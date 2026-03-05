---
name: generate-tests
description: "Use when code changes need tests — analyzes changes, decides test type, generates tests, registers in manifest"
---

<!-- Extended from: wshobson/agents (unit-testing/test-generate) -->
<!-- Source: https://github.com/wshobson/agents -->
<!-- Zamba additions: decision logic, type selection, .test-manifest.json registration -->

# Generate Tests

## Overview

Smart test generation that first DECIDES whether tests are needed, then WHAT TYPE, then generates and registers them for CI.

## The Decision Tree

```
Code changed
├── New feature code → YES, needs tests
│   ├── Isolated logic → unit test
│   ├── Multi-component → integration test
│   └── User-facing flow → e2e test
├── Bug fix → YES, regression test
│   └── Write test that reproduces the bug FIRST
├── Refactoring (no behavior change) → NO new tests
│   └── Existing tests must still pass
├── Documentation only → NO tests
├── Config/build changes → MAYBE
│   └── If affects runtime behavior → integration test
└── Test-only changes → NO (already tests)
```

## Process

### Step 1: Analyze What Changed

```bash
git diff --name-only HEAD~1
```

Classify each changed file:
- `src/` → production code (likely needs tests)
- `tests/` → test code (no new tests needed)
- `docs/` → documentation (no tests)
- `config/` → config (maybe tests)
- `*.md` → docs (no tests)

### Step 2: Apply Decision Tree

For each production code change, decide:
1. **Needs tests?** (yes/no/maybe)
2. **Test type?** (unit/integration/regression/e2e)
3. **Framework?** (detect from project: pytest/jest/vitest/go test)

### Step 3: Generate Tests

Use the base test generation from wshobson/test-harness:
- Analyze code structure
- Generate test suite with proper framework patterns
- Include edge cases, error handling, mocks/fixtures
- Follow project's existing test patterns

### Step 4: Register in Test Manifest

Append to `.test-manifest.json` in project root:

```json
{
  "tests": [
    {
      "file": "tests/unit/test_feature.py",
      "type": "unit",
      "framework": "pytest",
      "command": "pytest tests/unit/test_feature.py -v",
      "addedAt": "2026-03-04T10:00:00Z",
      "relatedSource": "src/feature.py"
    }
  ]
}
```

Create the file if it doesn't exist. Append new entries, never overwrite existing.

### Step 5: Verify

Run the generated tests:
```bash
[test command from manifest]
```

Expected: Tests should FAIL (TDD — red phase) if implementation isn't done yet, or PASS if this is a post-implementation run.

## Output

```
## Test Generation Report

**Changes analyzed:** N files
**Decision:** [X need tests, Y skipped]
**Tests created:** [list with types]
**Manifest updated:** .test-manifest.json (+N entries)
```
