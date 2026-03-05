---
name: create-docs
description: "Use when creating/updating project documentation — orchestrates 7 specialized doc workers"
---

<!-- Adopted from: levnikolaevich/claude-code-skills (ln-100-documents-pipeline) -->
<!-- Source: https://github.com/levnikolaevich/claude-code-skills -->

# Create Docs

## Overview

Hierarchical documentation system. An orchestrator (L1) coordinates specialized workers to create comprehensive project documentation.

**Announce at start:** "Creating project documentation with orchestrated workers."

## Architecture

```
L1 Orchestrator
├── L2 Core Documents Coordinator
│   ├── L3 CLAUDE.md Generator
│   ├── L3 Requirements Doc
│   ├── L3 Architecture Doc
│   ├── L3 API Documentation
│   └── L3 DB Schema Doc
├── L2 Design Documentation
├── L2 Reference Documentation
├── L2 Task Documentation
├── L2 Test Documentation
└── L2 Presentation/Runbooks
```

## Process

### Phase 1: Legacy Detection

Scan for existing documentation:
```bash
find . -name "*.md" -not -path "*/node_modules/*" | head -50
find . -name "*.rst" -not -path "*/node_modules/*" | head -20
```

Identify: outdated docs, conflicting docs, missing docs.

### Phase 2: Content Extraction

From existing codebase, extract:
- Project structure and entry points
- Public APIs and interfaces
- Database schemas and migrations
- Configuration files and environment variables
- Test structure and coverage

### Phase 3: Orchestrated Creation

L1 Orchestrator dispatches workers based on what's needed:

**Core Documents (always created):**
- `CLAUDE.md` — Project instructions for Claude Code
- `docs/architecture.md` — System architecture and decisions
- `docs/api.md` — API reference (if applicable)

**Conditional Documents:**
- `docs/database.md` — Only if DB exists
- `docs/deployment.md` — Only if deploy config exists
- `docs/runbook.md` — Only for production services

### Phase 4: Cross-Reference

Ensure documents link to each other correctly. No orphaned docs, no broken references.

### Phase 5: Cleanup

- Remove duplicate information across documents
- Ensure consistent terminology
- Validate all code examples compile/run

## Output

```
## Documentation Report

**Documents created:** N
**Documents updated:** N
**Legacy docs archived:** N

### Created
- [list of new documents with paths]

### Updated
- [list of modified documents]
```

## Integration

- Called in Quality phase after implementation is complete
- Works with `/update-changelog` for release documentation
- Reads `.test-manifest.json` for test documentation
