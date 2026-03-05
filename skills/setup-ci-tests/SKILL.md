---
name: setup-ci-tests
description: "Use when setting up CI — reads test manifest, generates GitHub Actions workflow, validates with actionlint"
---

<!-- Extended from: akin-ozer/cc-devops-skills (github-actions-generator) -->
<!-- Source: https://github.com/akin-ozer/cc-devops-skills -->
<!-- Zamba additions: .test-manifest.json integration, per-type job generation -->

# Setup CI Tests

## Overview

Bridge between test generation and CI/CD. Reads `.test-manifest.json` and produces a GitHub Actions workflow with separate jobs per test type.

## Process

### Step 1: Read Test Manifest

```bash
cat .test-manifest.json
```

Group tests by type: unit, integration, regression, e2e.

### Step 2: Generate Workflow

Create/update `.github/workflows/tests.yml`:

```yaml
name: Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  unit-tests:
    if: # has unit tests in manifest
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup [language]
        # detect from manifest framework
      - name: Install dependencies
        run: [install command]
      - name: Run unit tests
        run: [commands from manifest where type=unit]

  integration-tests:
    if: # has integration tests in manifest
    needs: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run integration tests
        run: [commands from manifest where type=integration]

  regression-tests:
    if: # has regression tests in manifest
    needs: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run regression tests
        run: [commands from manifest where type=regression]
```

### Step 3: Apply Best Practices (from akin-ozer base)

- Explicit permissions (`permissions: contents: read`)
- Fork-safe PR handling
- Caching (node_modules, pip cache, etc.)
- Matrix strategies for multi-version testing
- Conditional job execution based on changed files

### Step 4: Validate

```bash
actionlint .github/workflows/tests.yml
```

If actionlint is not installed, suggest:
```bash
# Install actionlint
go install github.com/rhysd/actionlint/cmd/actionlint@latest
# or
brew install actionlint
```

### Step 5: Commit Workflow

```bash
git add .github/workflows/tests.yml
git commit -m "ci: add/update test workflow from manifest"
```

## Output

```
## CI Setup Report

**Test manifest:** N entries (X unit, Y integration, Z regression)
**Workflow:** .github/workflows/tests.yml [created/updated]
**Jobs:** [list]
**Validation:** [actionlint result]
```
