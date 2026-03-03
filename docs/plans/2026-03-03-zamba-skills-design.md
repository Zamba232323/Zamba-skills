# Zamba Skills — Design Document

**Date:** 2026-03-03
**Status:** Approved (Rev 2 — post ecosystem review)

## Problem

Working across multiple devices, accounts, and projects leads to repeating the same prompts. Vibe coding is more about orchestrating AI — giving direction — than writing code. There's no system to:
- Reuse prompts/commands across projects and PCs
- Define a clear pipeline of when to call what
- Visualize the workflow

## Solution

A monorepo `zamba-skills` containing:
1. **Custom Claude Code skills** — reusable `/commands` that work across all projects
2. **Pipeline definition** — structured workflow from session start to merge
3. **Next.js dashboard** — visual pipeline flow + skill catalog with editor

## Architecture

### Repository Structure

```
zamba-skills/
├── skills/                          # Custom skills (SKILL.md format)
│   ├── start-session/SKILL.md       # WRITE — unique scope control
│   ├── scope-check/SKILL.md         # WRITE — unique scope validation
│   ├── generate-tests/SKILL.md      # EXTEND — based on community test-harness
│   ├── progress-check/SKILL.md      # WRITE — unique progress checkpoint
│   ├── create-docs/SKILL.md         # ADOPT — from levnikolaevich docs-pipeline
│   ├── update-changelog/SKILL.md    # ADOPT — from ComposioHQ changelog-generator
│   ├── test-coverage/SKILL.md       # ADOPT — from levnikolaevich test-coverage-auditor
│   ├── create-pr/SKILL.md           # EXTEND — based on wshobson pr-enhance + branch logic
│   ├── setup-ci-tests/SKILL.md      # EXTEND — based on cc-devops-skills + manifest
│   └── pr-checklist/SKILL.md        # ADOPT — from wshobson deploy-checklist
│
├── pipeline/
│   └── pipeline.json                # Phase/step/condition definitions
│
├── frontend/                        # Next.js dashboard
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Redirect to /pipeline
│   │   ├── pipeline/page.tsx        # Tab 1: Pipeline flowchart
│   │   └── catalog/page.tsx         # Tab 2: Skill catalog + editor
│   ├── components/
│   │   ├── PipelineFlow.tsx         # Interactive flow diagram
│   │   ├── SkillCard.tsx            # Individual skill card
│   │   ├── SkillEditor.tsx          # Markdown editor for SKILL.md
│   │   └── Navigation.tsx           # Tabs: Pipeline | Catalog
│   ├── lib/
│   │   ├── skills.ts               # Read/write SKILL.md files from FS
│   │   └── pipeline.ts             # Read pipeline.json
│   └── api/
│       ├── skills/route.ts          # API: CRUD for skills
│       └── pipeline/route.ts        # API: read/update pipeline
│
├── scripts/
│   ├── install.sh                   # Linux/Mac: symlink to ~/.claude/skills/
│   └── install.ps1                  # Windows: symlink to ~/.claude/skills/
│
├── CLAUDE.md
├── package.json
└── README.md
```

### Cross-Device Sync

```
Device A (Windows)              GitHub               Device B (Mac)
┌──────────────┐              ┌──────────┐          ┌──────────────┐
│ zamba-skills/ │◄──push/pull─►│ repo     │◄──push──►│ zamba-skills/ │
│  skills/     │              └──────────┘          │  skills/     │
│  frontend/   │                                     │  frontend/   │
└──────┬───────┘                                     └──────┬───────┘
       │ install.ps1                                        │ install.sh
       ▼                                                    ▼
~/.claude/skills/ ─symlink─► zamba-skills/skills/   ~/.claude/skills/
```

### Context Window Impact

- Skill descriptions (~500 chars each) are always loaded in system prompt
- Full SKILL.md content loaded only when skill is invoked
- 20 skills = ~2,500 tokens = ~1.25% of 200K context = negligible

## Pipeline Definition

### Phases

```
Phase 0: SESSION START ─── /start-session (WRITE)
    │    Load plan, assess state, select achievable tasks
    │    Rule: "Take only as many tasks as you can complete perfectly"
    ▼
Phase 1: PLAN ─── /brainstorm (superpowers) → /write-plan (superpowers)
    │    Design → Implementation plan → Approval
    │    Checkpoint: /scope-check (WRITE) — verify scope isn't too large
    ▼
Phase 2: BUILD (iterative loop) ─── /execute-plan (superpowers)
    │    For each task:
    │      /generate-tests (EXTEND):
    │        1. Analyze: what changed? (new code / bugfix / refactor / docs)
    │        2. Decide: needs tests? what type? (unit / integration / regression / none)
    │        3. Create: write tests if needed
    │        4. Register: add to .test-manifest.json for CI pickup
    │      → implement (TDD: superpowers) → /verify (superpowers)
    │    Checkpoint: /progress-check (WRITE) — still on track?
    ▼
Phase 3: QUALITY
    │    /requesting-code-review (superpowers) — automated code review
    │    /create-docs (ADOPT) — create/update documentation
    │    /update-changelog (ADOPT) — changelog from commits
    │    /test-coverage (ADOPT) — verify sufficient coverage
    ▼
Phase 4: INTEGRATION
    │    /create-pr (EXTEND) — branch decision + PR creation
    │    /setup-ci-tests (EXTEND) — manifest → GH Actions workflow
    │    /pr-checklist (ADOPT) — final pre-merge validation
    ▼
Phase 5: MERGE & CLOSE ─── /finish-branch (superpowers)
         Merge → Cleanup → Update plan
```

### pipeline.json Schema

```json
{
  "phases": [
    {
      "id": "session-start",
      "name": "Session Start",
      "description": "Load plan, assess state, select achievable tasks",
      "skills": ["start-session"],
      "skillSources": { "start-session": "write" },
      "next": "plan"
    },
    {
      "id": "plan",
      "name": "Plan",
      "description": "Design → Implementation plan → Approval",
      "skills": ["brainstorm", "write-plan", "scope-check"],
      "skillSources": {
        "brainstorm": "superpowers",
        "write-plan": "superpowers",
        "scope-check": "write"
      },
      "next": "build"
    },
    {
      "id": "build",
      "name": "Build",
      "description": "Iterative: test → implement → verify",
      "skills": ["execute-plan", "generate-tests", "progress-check"],
      "skillSources": {
        "execute-plan": "superpowers",
        "generate-tests": "extend:wshobson/test-harness",
        "progress-check": "write"
      },
      "loop": true,
      "next": "quality"
    },
    {
      "id": "quality",
      "name": "Quality",
      "description": "Review, documentation, changelog, coverage",
      "skills": ["requesting-code-review", "create-docs", "update-changelog", "test-coverage"],
      "skillSources": {
        "requesting-code-review": "superpowers",
        "create-docs": "adopt:levnikolaevich/ln-100-documents-pipeline",
        "update-changelog": "adopt:ComposioHQ/changelog-generator",
        "test-coverage": "adopt:levnikolaevich/ln-634-test-coverage-auditor"
      },
      "next": "integration"
    },
    {
      "id": "integration",
      "name": "Integration",
      "description": "Branch strategy + PR + CI tests + checklist",
      "skills": ["create-pr", "setup-ci-tests", "pr-checklist"],
      "skillSources": {
        "create-pr": "extend:wshobson/pr-enhance+git-workflow",
        "setup-ci-tests": "extend:akin-ozer/cc-devops-skills",
        "pr-checklist": "adopt:wshobson/deploy-checklist"
      },
      "next": "merge"
    },
    {
      "id": "merge",
      "name": "Merge & Close",
      "description": "Merge, cleanup, update plan",
      "skills": ["finish-branch"],
      "skillSources": { "finish-branch": "superpowers" },
      "next": null
    }
  ]
}
```

## Skills Inventory

### Skills to Write from Scratch (3)

| Skill | Phase | Purpose | Why custom |
|-------|-------|---------|------------|
| `start-session` | 0 | Load plan, select achievable tasks, enforce "only what you can finish perfectly" | Unique scope control logic — nothing like this exists |
| `scope-check` | 1 | Analyze task count/complexity, warn if too much for one session | Unique — no skill validates scope against capacity |
| `progress-check` | 2 | Checkpoint: compare current state to plan, flag drift | Unique mid-build checkpoint |

### Skills to Adopt from Community (4)

| Skill | Phase | Source | What we get |
|-------|-------|--------|-------------|
| `create-docs` | 3 | levnikolaevich/ln-100-documents-pipeline | 7 specialized workers (CLAUDE.md, requirements, architecture, API, DB, design, runbooks) |
| `update-changelog` | 3 | ComposioHQ/changelog-generator | Git commit analysis, categorization (Features/Fixes/Breaking/Security), noise filtering |
| `test-coverage` | 3 | levnikolaevich/ln-634-test-coverage-auditor | Identifies missing tests for critical paths |
| `pr-checklist` | 4 | wshobson/deploy-checklist | Pre-flight checks, monitoring setup |

### Skills to Extend (take base + add our logic) (3)

| Skill | Phase | Base | What we add |
|-------|-------|------|-------------|
| `generate-tests` | 2 | wshobson/test-harness | Decision logic ("needs tests?"), type selection, .test-manifest.json registration for CI |
| `create-pr` | 4 | wshobson/pr-enhance + git-workflow | Branch strategy decision (push direct / create branch / branch + PR) before PR creation |
| `setup-ci-tests` | 4 | akin-ozer/cc-devops-skills (GH Actions) | Read .test-manifest.json → create/update workflow → validate with actionlint |

### Existing Superpowers Skills (reused as-is) (7)

| Skill | Phase | Maps to |
|-------|-------|---------|
| `brainstorming` | 1 | Design exploration |
| `writing-plans` | 1 | Implementation plan creation |
| `executing-plans` | 2 | Batch task execution with review checkpoints |
| `test-driven-development` | 2 | RED-GREEN-REFACTOR cycle |
| `verification-before-completion` | 2-3 | Verify before claiming done |
| `requesting-code-review` | 3 | Automated code review via subagent |
| `finishing-a-development-branch` | 5 | Merge/PR decision + worktree cleanup |

### Totals

| Category | Count |
|----------|-------|
| Write from scratch | 3 |
| Adopt from community | 4 |
| Extend (base + custom) | 3 |
| Reuse superpowers as-is | 7 |
| **Total skills in pipeline** | **17** |

## Community Source References

| Repository | What we use | URL |
|------------|-------------|-----|
| obra/superpowers | 7 skills (already installed) | github.com/obra/superpowers |
| wshobson/commands | test-harness, pr-enhance, git-workflow, deploy-checklist | github.com/wshobson/commands |
| levnikolaevich/claude-code-skills | docs-pipeline, test-coverage-auditor | github.com/levnikolaevich/claude-code-skills |
| ComposioHQ/awesome-claude-skills | changelog-generator | github.com/ComposioHQ/awesome-claude-skills |
| akin-ozer/cc-devops-skills | GH Actions scaffolding | github.com/akin-ozer/cc-devops-skills |

## Two-Level Skill System

### Global Skills (this repo)
- Workflow/process skills that apply to ALL projects
- Tech-stack agnostic
- Synced via git + symlinks

### Per-Project Overrides (CLAUDE.md in each project)
- Project-specific conventions (e.g., "use pytest", "use Tailwind")
- Project-specific test commands
- Team conventions
- Lives in project repo, not in zamba-skills

## Frontend Design

### Tech Stack
- **Next.js 14+** with App Router
- **React Flow** for pipeline visualization
- **Monaco Editor** (or CodeMirror) for skill editing
- **Tailwind CSS** for styling
- **File system API** via Next.js API routes (reads/writes skills/ directory)

### Tab 1: Pipeline View
- Interactive flowchart showing all 6 phases
- Each phase node is clickable, color-coded by source (write/adopt/extend/superpowers)
- Clicking a phase shows its skills, descriptions, and source
- Visual indicator of current position in pipeline

### Tab 2: Skill Catalog
- Grid/list of all skills (custom + adopted + superpowers)
- Each skill = card with name, description, source badge, "Use when..."
- Click opens Monaco editor with SKILL.md content
- Save button writes directly to file system
- "Create New Skill" button with template
- Search/filter by phase, name, source type

### Hosting
- Localhost only (npm run dev)
- No deployment needed
- Reads directly from file system (same monorepo)

## Install Process (New Device)

```bash
# 1. Clone
git clone git@github.com:user/zamba-skills.git

# 2. Install dependencies
cd zamba-skills/frontend && npm install

# 3. Symlink skills to Claude Code
# Linux/Mac:
./scripts/install.sh
# Windows:
./scripts/install.ps1

# 4. Run dashboard
npm run dev
```

## Design Decisions

1. **Monorepo over separate repos** — One git pull updates everything, frontend reads files directly, simpler maintenance
2. **Symlinks over copying** — Edit once, available everywhere, no sync issues
3. **pipeline.json over hardcoded** — Frontend reads it dynamically, easy to modify phases
4. **Monaco editor over custom** — Proven, syntax highlighting, familiar to developers
5. **Localhost over hosted** — Simpler, no auth needed, direct FS access, privacy
6. **Global + per-project over global-only** — Flexibility for different tech stacks and teams
7. **Adopt > Write when possible** — Use battle-tested community skills, only write what's truly unique (3 skills)
8. **Extend > Fork** — Take community base, add our specific logic on top (3 skills)
9. **self-review removed** — superpowers `requesting-code-review` already covers this with code-reviewer agent

## Kent Beck Discipline Alignment

> "Follow the Kent Beck discipline: never guess, never skip steps."

This pipeline enforces it:
- **RED (understand)**: Phase 1 (brainstorm + plan) + generate-tests (write failing test first)
- **GREEN (implement)**: Phase 2 (execute-plan with TDD cycle)
- **REFACTOR (verify & clean)**: Phase 3 (review + docs + coverage) + Phase 4 (PR + CI)
- **Small steps**: scope-check + progress-check prevent overreach
- **Each step trivially correct**: verification-before-completion at every boundary
