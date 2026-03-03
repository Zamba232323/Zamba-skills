# Zamba Skills — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the zamba-skills monorepo — 10 custom skills, pipeline definition, install scripts, and a Next.js dashboard with Czech UI, skill catalog, pipeline visualization, and settings.

**Architecture:** Monorepo with `skills/` (SKILL.md files), `pipeline/` (pipeline.json + skills-catalog.json), `frontend/` (Next.js 14 App Router + React Flow + Monaco + Tailwind), and `scripts/` (cross-platform symlink installers). Frontend reads skills from filesystem via API routes. Czech descriptions stored in skills-catalog.json.

**Tech Stack:** Next.js 14 (App Router), React Flow, Monaco Editor (@monaco-editor/react), Tailwind CSS 3, TypeScript, Node.js fs API via Route Handlers.

---

## Part A: Foundation & Skills

### Task 1: Initialize repository and directory scaffold

**Files:**
- Create: `skills/` (empty dirs for each skill)
- Create: `pipeline/` directory
- Create: `frontend/` directory
- Create: `scripts/` directory
- Modify: `CLAUDE.md`

**Step 1: Initialize git repo**

Run: `cd "C:\cursor\Zamba skills" && git init`
Expected: Initialized empty Git repository

**Step 2: Create directory scaffold**

Run:
```bash
mkdir -p skills/{start-session,scope-check,progress-check,generate-tests,create-docs,update-changelog,test-coverage,create-pr,setup-ci-tests,pr-checklist}
mkdir -p pipeline
mkdir -p scripts
mkdir -p frontend
```

**Step 3: Create .gitkeep files for empty dirs**

Run:
```bash
touch frontend/.gitkeep scripts/.gitkeep
```

**Step 4: Write CLAUDE.md**

```markdown
# Zamba Skills

Monorepo for reusable Claude Code skills, pipeline definitions, and a visual dashboard.

## Structure

- `skills/` — Custom SKILL.md files (10 skills: 3 written, 4 adopted, 3 extended)
- `pipeline/` — Pipeline phase definitions (pipeline.json) + skill catalog (skills-catalog.json)
- `frontend/` — Next.js dashboard (pipeline flow + skill catalog + settings)
- `scripts/` — Cross-platform install scripts (symlink to ~/.claude/skills/)
- `docs/plans/` — Design documents and implementation plans

## Skills Format

Each skill lives in `skills/<name>/SKILL.md` with YAML frontmatter:
```yaml
---
name: skill-name
description: "Use when [condition] — [what it does]"
---
```

## Commands

- `npm run dev` — Start frontend dashboard (from frontend/)
- `./scripts/install.sh` — Linux/Mac: symlink skills to ~/.claude/skills/
- `./scripts/install.ps1` — Windows: symlink skills to ~/.claude/skills/
```

**Step 5: Create .gitignore**

```
node_modules/
.next/
.env
.env.local
*.log
.DS_Store
Thumbs.db
```

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize repo scaffold with directory structure"
```

---

### Task 2: Create pipeline.json and skills-catalog.json

**Files:**
- Create: `pipeline/pipeline.json`
- Create: `pipeline/skills-catalog.json`

**Step 1: Write pipeline.json**

Create `pipeline/pipeline.json` with the exact content from the design doc (6 phases, skill mappings, sources, next pointers). Copy verbatim from design doc lines 128-198.

**Step 2: Write skills-catalog.json with Czech metadata**

Create `pipeline/skills-catalog.json`:

```json
{
  "skills": [
    {
      "id": "start-session",
      "command": "/start-session",
      "phase": "session-start",
      "source": "write",
      "tags": ["workflow", "session", "plánování"],
      "name": { "en": "Start Session", "cs": "Začátek relace" },
      "description": {
        "en": "Load plan, assess state, select achievable tasks",
        "cs": "Načte plán, zhodnotí stav, vybere splnitelné úkoly"
      },
      "whenToUse": {
        "cs": "Na začátku každé pracovní relace. Zajistí jasný přehled — co je hotové, co zbývá, a kolik toho zvládneš."
      },
      "detailedDescription": {
        "cs": "Automaticky načte implementační plán projektu, zhodnotí aktuální stav repozitáře (hotové úkoly, otevřené větve, nedokončená práce) a vybere úkoly, které lze v této relaci realisticky dokončit. Hlavní pravidlo: 'Vezmi si jen tolik úkolů, kolik zvládneš perfektně dokončit.' Chrání před přetížením a nedokončenou prací. Kontroluje docs/plans/ a stav gitu."
      }
    },
    {
      "id": "scope-check",
      "command": "/scope-check",
      "phase": "plan",
      "source": "write",
      "tags": ["validace", "scope", "kontrola"],
      "name": { "en": "Scope Check", "cs": "Kontrola rozsahu" },
      "description": {
        "en": "Analyze task count/complexity, warn if too much for one session",
        "cs": "Analyzuje počet a složitost úkolů, varuje pokud je toho moc"
      },
      "whenToUse": {
        "cs": "Po vytvoření plánu, před začátkem implementace. Ověří, že rozsah práce je realistický pro jednu relaci."
      },
      "detailedDescription": {
        "cs": "Projde implementační plán a spočítá úkoly, odhadne složitost každého (jednoduchý/střední/komplexní), sečte celkovou zátěž a porovná s kapacitou jedné relace. Pokud je rozsah příliš velký, navrhne rozdělení do více relací. Kontroluje: počet souborů k vytvoření/změně, počet testů, závislosti mezi úkoly, a zda nejsou skryté komplikace."
      }
    },
    {
      "id": "progress-check",
      "command": "/progress-check",
      "phase": "build",
      "source": "write",
      "tags": ["checkpoint", "průběh", "kontrola"],
      "name": { "en": "Progress Check", "cs": "Kontrola průběhu" },
      "description": {
        "en": "Compare current state to plan, flag drift",
        "cs": "Porovná aktuální stav s plánem, upozorní na odchylky"
      },
      "whenToUse": {
        "cs": "Uprostřed implementace, mezi úkoly. Zastaví se a ověří, že jsi stále na správné cestě podle plánu."
      },
      "detailedDescription": {
        "cs": "Mid-build checkpoint. Načte původní plán, porovná s aktuálním stavem gitu (commity, změněné soubory, stav testů). Identifikuje: dokončené úkoly, rozdělanou práci, odchylky od plánu (scope creep), a zbývající práci. Pokud detekuje drift — přidané úkoly, změněný přístup, nebo zpoždění — varuje a navrhne úpravu plánu."
      }
    },
    {
      "id": "generate-tests",
      "command": "/generate-tests",
      "phase": "build",
      "source": "extend",
      "sourceBase": "wshobson/test-harness",
      "tags": ["testy", "TDD", "automatizace"],
      "name": { "en": "Generate Tests", "cs": "Generování testů" },
      "description": {
        "en": "Analyze changes, decide test type, create tests, register in manifest",
        "cs": "Analyzuje změny, rozhodne typ testu, vytvoří testy, zaregistruje do manifestu"
      },
      "whenToUse": {
        "cs": "Při každé změně kódu v build fázi. Rozhodne, zda změna potřebuje testy a jaký typ (unit/integration/regression)."
      },
      "detailedDescription": {
        "cs": "Rozšíření wshobson/test-harness o rozhodovací logiku. Postup: 1) Analyzuje co se změnilo (nový kód/bugfix/refactor/docs), 2) Rozhodne zda potřebuje testy a jaký typ, 3) Vygeneruje testy s použitím správného frameworku (pytest/jest/go test), 4) Zaregistruje do .test-manifest.json pro CI. Podporuje: unit testy, integrační testy, regresní testy. Přeskočí testy pro čistý refactoring a dokumentaci."
      }
    },
    {
      "id": "create-docs",
      "command": "/create-docs",
      "phase": "quality",
      "source": "adopt",
      "sourceRepo": "levnikolaevich/ln-100-documents-pipeline",
      "tags": ["dokumentace", "CLAUDE.md", "architektura"],
      "name": { "en": "Create Docs", "cs": "Tvorba dokumentace" },
      "description": {
        "en": "Orchestrate documentation creation with 7 specialized workers",
        "cs": "Orchestrace tvorby dokumentace se 7 specializovanými workery"
      },
      "whenToUse": {
        "cs": "Po dokončení implementace, ve fázi kvality. Vytvoří nebo aktualizuje kompletní dokumentaci projektu."
      },
      "detailedDescription": {
        "cs": "Hierarchický systém dokumentace z levnikolaevich. Orchestrátor (L1) koordinuje 5 L2 workerů: koordinátor základních dokumentů → 5 L3 workerů (CLAUDE.md, requirements, architektura, API, DB schema, design, runbooky), referenční dokumentace, task dokumentace, test dokumentace, a prezentace. 7 fází: detekce legacy, extrakce obsahu, orchestrovaná tvorba, globální cleanup."
      }
    },
    {
      "id": "update-changelog",
      "command": "/update-changelog",
      "phase": "quality",
      "source": "adopt",
      "sourceRepo": "ComposioHQ/changelog-generator",
      "tags": ["changelog", "git", "vydání"],
      "name": { "en": "Update Changelog", "cs": "Aktualizace changelogu" },
      "description": {
        "en": "Generate changelog from git commits with categorization",
        "cs": "Vygeneruje changelog z git commitů s kategorizací"
      },
      "whenToUse": {
        "cs": "Po code review, před vytvořením PR. Automaticky vytvoří přehled změn z git historie."
      },
      "detailedDescription": {
        "cs": "Adoptovaný skill z ComposioHQ. Skenuje git historii, analyzuje commity a kategorizuje je: Features (nové funkce), Improvements (vylepšení), Bug Fixes (opravy), Breaking Changes (zpětně nekompatibilní), Security (bezpečnost). Filtruje šum (refactoring commity, merge commity). Překládá technický jazyk commitů do srozumitelného popisu pro uživatele. Formátuje podle Keep a Changelog standardu."
      }
    },
    {
      "id": "test-coverage",
      "command": "/test-coverage",
      "phase": "quality",
      "source": "adopt",
      "sourceRepo": "levnikolaevich/ln-634-test-coverage-auditor",
      "tags": ["testy", "pokrytí", "audit"],
      "name": { "en": "Test Coverage", "cs": "Pokrytí testy" },
      "description": {
        "en": "Identify missing tests for critical business logic paths",
        "cs": "Identifikuje chybějící testy pro kritické cesty business logiky"
      },
      "whenToUse": {
        "cs": "Ve fázi kvality, po code review. Ověří, že kritické cesty kódu mají dostatečné testové pokrytí."
      },
      "detailedDescription": {
        "cs": "Adoptovaný z levnikolaevich. Klasifikuje kritické cesty: Money Flows (platby, slevy, daně — priorita 20+), Security Flows (login, tokeny, hesla — priorita 20+), Data Integrity (CRUD, transakce, migrace — priorita 15+), Core Flows (hlavní workflow — priorita 15+). Výstup: markdown report s netestovanými kritickými cestami, zdůvodnění priority, compliance skóre (X/10). Podporuje doménově specifické skenování."
      }
    },
    {
      "id": "create-pr",
      "command": "/create-pr",
      "phase": "integration",
      "source": "extend",
      "sourceBase": "wshobson/pr-enhance + git-workflow",
      "tags": ["PR", "git", "integrace"],
      "name": { "en": "Create PR", "cs": "Vytvoření PR" },
      "description": {
        "en": "Branch strategy decision + comprehensive PR creation",
        "cs": "Rozhodnutí o strategii větve + vytvoření komplexního PR"
      },
      "whenToUse": {
        "cs": "Když je implementace hotová a otestovaná. Rozhodne o strategii větvení a vytvoří PR s kompletním popisem."
      },
      "detailedDescription": {
        "cs": "Rozšíření wshobson/pr-enhance o rozhodovací vrstvu pro strategii větví. Nejdřív rozhodne: 1) Push přímo do main (triviální hotfixy), 2) Vytvořit větev (feature work), 3) Větev + PR (standardní workflow). Pak vytvoří PR s: shrnutím změn, kategorizací souborů (source/test/config/docs), analýzou commitů, test coverage info, breaking changes, dependency změny, review checklist. Integruje git-workflow orchestrátor."
      }
    },
    {
      "id": "setup-ci-tests",
      "command": "/setup-ci-tests",
      "phase": "integration",
      "source": "extend",
      "sourceBase": "akin-ozer/cc-devops-skills",
      "tags": ["CI/CD", "GitHub Actions", "automatizace"],
      "name": { "en": "Setup CI Tests", "cs": "Nastavení CI testů" },
      "description": {
        "en": "Transform test manifest into GitHub Actions workflow",
        "cs": "Transformuje test manifest do GitHub Actions workflow"
      },
      "whenToUse": {
        "cs": "Po vytvoření PR, pro nastavení automatických testů. Čte .test-manifest.json a generuje CI workflow."
      },
      "detailedDescription": {
        "cs": "Rozšíření akin-ozer/cc-devops-skills o integraci s .test-manifest.json. Čte manifest z /generate-tests, transformuje typy testů na GitHub Actions joby (unit, integration, regression, e2e jako samostatné joby). Generuje workflow do .github/workflows/ s: security patterns (fork-safe PR handling), concurrency management, matrix strategies, caching, podmíněné spouštění podle změněných souborů. Validuje výstup pomocí actionlint."
      }
    },
    {
      "id": "pr-checklist",
      "command": "/pr-checklist",
      "phase": "integration",
      "source": "adopt",
      "sourceRepo": "wshobson/deploy-checklist",
      "tags": ["checklist", "deploy", "validace"],
      "name": { "en": "PR Checklist", "cs": "PR kontrolní seznam" },
      "description": {
        "en": "Pre-flight validation checks before merge",
        "cs": "Předletová kontrola před mergem"
      },
      "whenToUse": {
        "cs": "Jako poslední krok před mergem PR. Ověří, že je vše připraveno — konfigurace, bezpečnost, testy, monitoring."
      },
      "detailedDescription": {
        "cs": "Adoptovaný z wshobson/deploy-checklist (deployment-validation). Detekuje konfigurační soubory (JSON, YAML, TOML, INI, ENV), skenuje bezpečnost (hardcoded secrets, API klíče, tokeny), kontroluje konzistenci mezi prostředími, validuje schémata, vynucuje type safety, vlastní validátory (HTTPS URL, porty, durace). Funguje jako bezpečnostní brána před deployem."
      }
    },
    {
      "id": "brainstorming",
      "command": "/brainstorm",
      "phase": "plan",
      "source": "superpowers",
      "tags": ["design", "návrh", "průzkum"],
      "name": { "en": "Brainstorming", "cs": "Brainstorming" },
      "description": {
        "en": "Socratic dialogue for design exploration",
        "cs": "Sokratický dialog pro průzkum designu"
      },
      "whenToUse": {
        "cs": "Před jakoukoliv kreativní prací — nové funkce, komponenty, změny chování. Prozkoumá záměr a požadavky před implementací."
      },
      "detailedDescription": {
        "cs": "Superpowers skill. Vede strukturovaný dialog pro prozkoumání požadavků, omezení a možných přístupů. Používá sokratickou metodu — ptá se 'proč' a 'co když'. Výstup: jasné požadavky, zvolený přístup, identifikovaná rizika."
      }
    },
    {
      "id": "writing-plans",
      "command": "/write-plan",
      "phase": "plan",
      "source": "superpowers",
      "tags": ["plán", "implementace", "TDD"],
      "name": { "en": "Writing Plans", "cs": "Psaní plánů" },
      "description": {
        "en": "Create bite-sized implementation plans with TDD",
        "cs": "Vytváří detailní implementační plány s TDD přístupem"
      },
      "whenToUse": {
        "cs": "Po brainstormingu, když máš jasné požadavky. Vytvoří krok-za-krokem plán s přesnými soubory, kódem a testy."
      },
      "detailedDescription": {
        "cs": "Superpowers skill. Vytváří plány kde každý krok trvá 2-5 minut: napsat failing test → ověřit že selže → implementovat minimum → ověřit že projde → commit. Přesné cesty k souborům, kompletní kód, přesné příkazy s očekávaným výstupem. DRY, YAGNI, TDD, časté commity."
      }
    },
    {
      "id": "executing-plans",
      "command": "/execute-plan",
      "phase": "build",
      "source": "superpowers",
      "tags": ["implementace", "batch", "review"],
      "name": { "en": "Executing Plans", "cs": "Provádění plánů" },
      "description": {
        "en": "Batch task execution with review checkpoints",
        "cs": "Dávkové provádění úkolů s kontrolními body"
      },
      "whenToUse": {
        "cs": "Když máš hotový implementační plán a chceš ho provést. Spouští úkoly po dávkách s review mezi nimi."
      },
      "detailedDescription": {
        "cs": "Superpowers skill. Provádí implementační plán po dávkách — každá dávka = skupina souvisejících úkolů. Mezi dávkami: review checkpoint kde se kontroluje kvalita, testy, a soulad s plánem. Podporuje dva režimy: subagent-driven (tato relace) a parallel session (nová relace)."
      }
    },
    {
      "id": "test-driven-development",
      "command": "/tdd",
      "phase": "build",
      "source": "superpowers",
      "tags": ["TDD", "testy", "red-green-refactor"],
      "name": { "en": "Test-Driven Development", "cs": "Vývoj řízený testy" },
      "description": {
        "en": "RED-GREEN-REFACTOR cycle enforcement",
        "cs": "Vynucení cyklu RED-GREEN-REFACTOR"
      },
      "whenToUse": {
        "cs": "Při implementaci jakékoliv funkce nebo opravy bugu. Nejdřív napíšeš test, pak kód. Bez výjimek."
      },
      "detailedDescription": {
        "cs": "Superpowers skill. Striktní TDD cyklus: RED (napsat failing test) → GREEN (minimální implementace aby test prošel) → REFACTOR (vyčistit, ale testy musí stále procházet). Žádné výjimky, žádné zkratky. Test-first je povinný."
      }
    },
    {
      "id": "verification-before-completion",
      "command": "/verify",
      "phase": "build",
      "source": "superpowers",
      "tags": ["verifikace", "důkaz", "kontrola"],
      "name": { "en": "Verification Before Completion", "cs": "Ověření před dokončením" },
      "description": {
        "en": "Evidence before claims — verify before saying done",
        "cs": "Důkazy před tvrzeními — ověř než řekneš hotovo"
      },
      "whenToUse": {
        "cs": "Před jakýmkoliv tvrzením že je práce hotová. Spusť příkazy, zkontroluj výstup, teprve pak oznam dokončení."
      },
      "detailedDescription": {
        "cs": "Superpowers skill. Pravidlo: nikdy neříkej 'hotovo' bez důkazu. Spusť testy a zkontroluj výstup. Spusť build a ověř úspěch. Zkontroluj git stav. Teprve když máš důkaz že vše funguje, můžeš oznámit dokončení."
      }
    },
    {
      "id": "requesting-code-review",
      "command": "/code-review",
      "phase": "quality",
      "source": "superpowers",
      "tags": ["review", "kvalita", "subagent"],
      "name": { "en": "Requesting Code Review", "cs": "Žádost o code review" },
      "description": {
        "en": "Automated code review via specialized subagent",
        "cs": "Automatizované code review přes specializovaného subagenta"
      },
      "whenToUse": {
        "cs": "Po dokončení implementace, před dokumentací. Subagent zkontroluje kód a navrhne vylepšení."
      },
      "detailedDescription": {
        "cs": "Superpowers skill. Spouští code-reviewer subagenta který analyzuje: git SHA změn, kvalitu kódu, potenciální bugy, bezpečnostní problémy, výkonnostní problémy. Výstup: seznam issues s úrovní závažnosti (critical/warning/suggestion). Critical issues musí být opraveny."
      }
    },
    {
      "id": "finishing-a-development-branch",
      "command": "/finish-branch",
      "phase": "merge",
      "source": "superpowers",
      "tags": ["merge", "cleanup", "dokončení"],
      "name": { "en": "Finish Branch", "cs": "Dokončení větve" },
      "description": {
        "en": "Merge, cleanup, update plan",
        "cs": "Merge, úklid, aktualizace plánu"
      },
      "whenToUse": {
        "cs": "Když je vše hotové — testy procházejí, review je OK, PR je schválený. Provede merge a úklid."
      },
      "detailedDescription": {
        "cs": "Superpowers skill. Nejdřív ověří že testy procházejí (hard gate). Pak nabídne 4 možnosti: merge do main, squash merge, rebase, nebo ponechat branch. Po mergi: smaže branch, vyčistí worktree, aktualizuje implementační plán (označí dokončené úkoly)."
      }
    }
  ]
}
```

**Step 3: Commit**

```bash
git add pipeline/
git commit -m "feat: add pipeline definition and skills catalog with Czech metadata"
```

---

### Task 3: Write start-session skill

**Files:**
- Create: `skills/start-session/SKILL.md`

**Step 1: Write SKILL.md**

```markdown
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
```

**Step 2: Commit**

```bash
git add skills/start-session/
git commit -m "feat: add start-session skill"
```

---

### Task 4: Write scope-check skill

**Files:**
- Create: `skills/scope-check/SKILL.md`

**Step 1: Write SKILL.md**

```markdown
---
name: scope-check
description: "Use when validating plan scope — analyzes task count and complexity, warns if too much for one session"
---

# Scope Check

## Overview

Validate that the implementation plan is realistically achievable. Count tasks, estimate complexity, and warn before overcommitting.

**Announce at start:** "Running scope check on the current plan."

## The Process

### Step 1: Load the Plan

Read the active implementation plan from `docs/plans/`.

### Step 2: Count and Classify Tasks

For each task in the plan, classify:

| Complexity | Criteria | Time estimate |
|-----------|----------|---------------|
| Simple | Single file, < 20 lines, no dependencies | 2-5 min |
| Medium | 2-3 files, tests needed, clear approach | 10-20 min |
| Complex | 4+ files, new patterns, external deps, research needed | 30-60 min |

### Step 3: Calculate Total Load

```
Total load = (simple × 1) + (medium × 3) + (complex × 8)
```

| Load score | Verdict |
|-----------|---------|
| 1-10 | ✅ Good — fits in one session |
| 11-20 | ⚠️ Ambitious — consider splitting |
| 21+ | 🛑 Too much — must split into multiple sessions |

### Step 4: Check for Hidden Complexity

Flag these patterns:
- [ ] Tasks with vague descriptions ("improve X", "refactor Y")
- [ ] Tasks touching shared/core files (high blast radius)
- [ ] Tasks with external dependencies (API calls, new packages)
- [ ] Tasks that require research before implementation
- [ ] Circular dependencies between tasks

### Step 5: Report

```
## Scope Check Report

**Tasks:** X total (Y simple, Z medium, W complex)
**Load score:** N — [verdict]
**Hidden complexity flags:** [list or "none"]

### Recommendation
[Keep as-is / Split into N sessions / Remove tasks X,Y]

### Suggested session split (if needed)
- Session 1: Tasks 1-3 (load: 8) — [theme]
- Session 2: Tasks 4-7 (load: 12) — [theme]
```

## Integration

- Called after `/write-plan` in Phase 1
- If load > 20, block progression to Phase 2
- Re-run after any plan modifications
```

**Step 2: Commit**

```bash
git add skills/scope-check/
git commit -m "feat: add scope-check skill"
```

---

### Task 5: Write progress-check skill

**Files:**
- Create: `skills/progress-check/SKILL.md`

**Step 1: Write SKILL.md**

```markdown
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
| Task 1 | Should be done | ✅ Done (commit abc123) | — |
| Task 2 | In progress | ⚠️ Not started | Behind schedule |
| Task 3 | Not started | 🛑 Partially done | Scope creep? |
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
```

**Step 2: Commit**

```bash
git add skills/progress-check/
git commit -m "feat: add progress-check skill"
```

---

### Task 6: Adopt 4 community skills

**Files:**
- Create: `skills/create-docs/SKILL.md`
- Create: `skills/update-changelog/SKILL.md`
- Create: `skills/test-coverage/SKILL.md`
- Create: `skills/pr-checklist/SKILL.md`

**Step 1: Fetch and adapt create-docs**

Fetch the SKILL.md from `levnikolaevich/claude-code-skills` (ln-100-documents-pipeline). Save as `skills/create-docs/SKILL.md`. Add attribution header:

```markdown
---
name: create-docs
description: "Use when creating/updating project documentation — orchestrates 7 specialized doc workers"
---

<!-- Adopted from: levnikolaevich/claude-code-skills (ln-100-documents-pipeline) -->
<!-- Source: https://github.com/levnikolaevich/claude-code-skills -->
```

Then include the full original SKILL.md content below the attribution.

**Step 2: Fetch and adapt update-changelog**

Fetch from `ComposioHQ/awesome-claude-skills` (changelog-generator). Save as `skills/update-changelog/SKILL.md` with attribution.

**Step 3: Fetch and adapt test-coverage**

Fetch from `levnikolaevich/claude-code-skills` (ln-634-test-coverage-auditor). Save as `skills/test-coverage/SKILL.md` with attribution.

**Step 4: Fetch and adapt pr-checklist**

Fetch from `wshobson/agents` (deployment-validation/config-validate). Save as `skills/pr-checklist/SKILL.md` with attribution. Note: the design references "deploy-checklist" but the actual community skill is "deployment-validation" (config-validate.md). Adopt this as the pr-checklist base.

**Step 5: Commit**

```bash
git add skills/create-docs/ skills/update-changelog/ skills/test-coverage/ skills/pr-checklist/
git commit -m "feat: adopt 4 community skills (docs, changelog, coverage, checklist)"
```

---

### Task 7: Extend generate-tests skill

**Files:**
- Create: `skills/generate-tests/SKILL.md`

**Step 1: Write extended SKILL.md**

```markdown
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
```

**Step 2: Commit**

```bash
git add skills/generate-tests/
git commit -m "feat: add generate-tests skill (extended from wshobson/test-harness)"
```

---

### Task 8: Extend create-pr skill

**Files:**
- Create: `skills/create-pr/SKILL.md`

**Step 1: Write extended SKILL.md**

```markdown
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
```

**Step 2: Commit**

```bash
git add skills/create-pr/
git commit -m "feat: add create-pr skill (extended from wshobson/pr-enhance)"
```

---

### Task 9: Extend setup-ci-tests skill

**Files:**
- Create: `skills/setup-ci-tests/SKILL.md`

**Step 1: Write extended SKILL.md**

```markdown
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
```

**Step 2: Commit**

```bash
git add skills/setup-ci-tests/
git commit -m "feat: add setup-ci-tests skill (extended from akin-ozer/cc-devops-skills)"
```

---

### Task 10: Create install scripts

**Files:**
- Create: `scripts/install.sh`
- Create: `scripts/install.ps1`

**Step 1: Write install.sh (Linux/Mac)**

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$(dirname "$SCRIPT_DIR")/skills"
TARGET_DIR="$HOME/.claude/skills"

echo "=== Zamba Skills Installer ==="
echo "Source: $SKILLS_DIR"
echo "Target: $TARGET_DIR"

# Create target directory if needed
mkdir -p "$TARGET_DIR"

# Symlink each skill
for skill_dir in "$SKILLS_DIR"/*/; do
    skill_name=$(basename "$skill_dir")
    target="$TARGET_DIR/$skill_name"

    if [ -L "$target" ]; then
        echo "  ↻ $skill_name (updating symlink)"
        rm "$target"
    elif [ -d "$target" ]; then
        echo "  ⚠ $skill_name (directory exists, skipping — remove manually to update)"
        continue
    else
        echo "  + $skill_name"
    fi

    ln -s "$skill_dir" "$target"
done

echo ""
echo "✓ Done. $(ls -1d "$TARGET_DIR"/*/ 2>/dev/null | wc -l) skills linked."
echo "  Restart Claude Code to pick up changes."
```

**Step 2: Write install.ps1 (Windows)**

```powershell
#Requires -RunAsAdministrator
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillsDir = Join-Path (Split-Path -Parent $scriptDir) "skills"
$targetDir = Join-Path $env:USERPROFILE ".claude\skills"

Write-Host "=== Zamba Skills Installer ===" -ForegroundColor Cyan
Write-Host "Source: $skillsDir"
Write-Host "Target: $targetDir"

# Create target directory if needed
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# Symlink each skill
Get-ChildItem -Path $skillsDir -Directory | ForEach-Object {
    $skillName = $_.Name
    $target = Join-Path $targetDir $skillName

    if (Test-Path $target) {
        if ((Get-Item $target).Attributes -band [IO.FileAttributes]::ReparsePoint) {
            Write-Host "  ↻ $skillName (updating symlink)" -ForegroundColor Yellow
            Remove-Item $target -Force
        } else {
            Write-Host "  ⚠ $skillName (directory exists, skipping)" -ForegroundColor Red
            return
        }
    } else {
        Write-Host "  + $skillName" -ForegroundColor Green
    }

    New-Item -ItemType SymbolicLink -Path $target -Target $_.FullName | Out-Null
}

$count = (Get-ChildItem -Path $targetDir -Directory).Count
Write-Host ""
Write-Host "✓ Done. $count skills linked." -ForegroundColor Green
Write-Host "  Restart Claude Code to pick up changes."
```

**Step 3: Make install.sh executable**

```bash
chmod +x scripts/install.sh
```

**Step 4: Commit**

```bash
git add scripts/
git commit -m "feat: add cross-platform install scripts"
```

---

## Part B: Frontend

### Task 11: Initialize Next.js project

**Files:**
- Create: `frontend/` — full Next.js project

**Step 1: Create Next.js project**

```bash
cd "C:\cursor\Zamba skills"
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-git
```

Answer prompts: Yes to all defaults.

**Step 2: Install additional dependencies**

```bash
cd "C:\cursor\Zamba skills/frontend"
npm install @xyflow/react @monaco-editor/react
```

**Step 3: Verify it runs**

```bash
npm run dev
```

Expected: Next.js dev server starts on http://localhost:3000

**Step 4: Commit**

```bash
cd "C:\cursor\Zamba skills"
git add frontend/
git commit -m "feat: initialize Next.js frontend with deps"
```

---

### Task 12: Create layout, navigation, and shared types

**Files:**
- Modify: `frontend/app/layout.tsx`
- Create: `frontend/app/page.tsx` (redirect)
- Create: `frontend/components/Navigation.tsx`
- Create: `frontend/lib/types.ts`

**Step 1: Define shared types in `frontend/lib/types.ts`**

```typescript
export interface LocalizedString {
  en: string;
  cs: string;
}

export interface SkillCatalogEntry {
  id: string;
  command: string;
  phase: string;
  source: "write" | "adopt" | "extend" | "superpowers";
  sourceBase?: string;
  sourceRepo?: string;
  tags: string[];
  name: LocalizedString;
  description: LocalizedString;
  whenToUse: { cs: string };
  detailedDescription: { cs: string };
}

export interface SkillCatalog {
  skills: SkillCatalogEntry[];
}

export interface PipelinePhase {
  id: string;
  name: string;
  description: string;
  skills: string[];
  skillSources: Record<string, string>;
  loop?: boolean;
  next: string | null;
}

export interface Pipeline {
  phases: PipelinePhase[];
}

export interface SkillContent {
  id: string;
  content: string;       // raw SKILL.md markdown
  frontmatter: {
    name: string;
    description: string;
  };
}
```

**Step 2: Create Navigation component in `frontend/components/Navigation.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/pipeline", label: "Pipeline", labelCs: "Pipeline" },
  { href: "/catalog", label: "Katalog skillů", labelCs: "Katalog skillů" },
  { href: "/settings", label: "Nastavení", labelCs: "Nastavení" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center gap-8">
          <span className="text-lg font-bold text-white">⚡ Zamba Skills</span>
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {tab.labelCs}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Step 3: Update `frontend/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zamba Skills — Dashboard",
  description: "Pipeline visualization and skill catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100`}>
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
```

**Step 4: Create redirect page `frontend/app/page.tsx`**

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/pipeline");
}
```

**Step 5: Commit**

```bash
git add frontend/app/ frontend/components/ frontend/lib/
git commit -m "feat: add layout, navigation, and shared types"
```

---

### Task 13: Create API routes for skills and pipeline

**Files:**
- Create: `frontend/app/api/pipeline/route.ts`
- Create: `frontend/app/api/skills/route.ts`
- Create: `frontend/app/api/skills/[id]/route.ts`
- Create: `frontend/app/api/skills/[id]/content/route.ts`
- Create: `frontend/lib/paths.ts`

**Step 1: Create path helper `frontend/lib/paths.ts`**

```typescript
import path from "path";

// Monorepo root is one level above frontend/
export const REPO_ROOT = path.resolve(process.cwd(), "..");
export const SKILLS_DIR = path.join(REPO_ROOT, "skills");
export const PIPELINE_DIR = path.join(REPO_ROOT, "pipeline");
export const PIPELINE_JSON = path.join(PIPELINE_DIR, "pipeline.json");
export const CATALOG_JSON = path.join(PIPELINE_DIR, "skills-catalog.json");
```

**Step 2: Create pipeline API `frontend/app/api/pipeline/route.ts`**

```typescript
import { NextResponse } from "next/server";
import fs from "fs/promises";
import { PIPELINE_JSON, CATALOG_JSON } from "@/lib/paths";

export async function GET() {
  try {
    const [pipelineRaw, catalogRaw] = await Promise.all([
      fs.readFile(PIPELINE_JSON, "utf-8"),
      fs.readFile(CATALOG_JSON, "utf-8"),
    ]);
    return NextResponse.json({
      pipeline: JSON.parse(pipelineRaw),
      catalog: JSON.parse(catalogRaw),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load pipeline data" },
      { status: 500 }
    );
  }
}
```

**Step 3: Create skills list API `frontend/app/api/skills/route.ts`**

```typescript
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SKILLS_DIR, CATALOG_JSON } from "@/lib/paths";

export async function GET() {
  try {
    const catalogRaw = await fs.readFile(CATALOG_JSON, "utf-8");
    const catalog = JSON.parse(catalogRaw);

    // Enrich with actual file existence
    const skills = await Promise.all(
      catalog.skills.map(async (skill: any) => {
        const skillPath = path.join(SKILLS_DIR, skill.id, "SKILL.md");
        let exists = false;
        try {
          await fs.access(skillPath);
          exists = true;
        } catch {}
        return { ...skill, fileExists: exists };
      })
    );

    return NextResponse.json({ skills });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load skills" },
      { status: 500 }
    );
  }
}
```

**Step 4: Create single skill content API `frontend/app/api/skills/[id]/content/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SKILLS_DIR } from "@/lib/paths";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skillPath = path.join(SKILLS_DIR, id, "SKILL.md");

  try {
    const content = await fs.readFile(skillPath, "utf-8");

    // Parse frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter: Record<string, string> = {};
    if (fmMatch) {
      fmMatch[1].split("\n").forEach((line) => {
        const [key, ...rest] = line.split(":");
        if (key && rest.length) {
          frontmatter[key.trim()] = rest.join(":").trim().replace(/^["']|["']$/g, "");
        }
      });
    }

    return NextResponse.json({ id, content, frontmatter });
  } catch {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skillPath = path.join(SKILLS_DIR, id, "SKILL.md");
  const { content } = await request.json();

  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(skillPath), { recursive: true });
    await fs.writeFile(skillPath, content, "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
```

**Step 5: Create skill metadata API `frontend/app/api/skills/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { CATALOG_JSON } from "@/lib/paths";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const catalogRaw = await fs.readFile(CATALOG_JSON, "utf-8");
    const catalog = JSON.parse(catalogRaw);
    const skill = catalog.skills.find((s: any) => s.id === id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: "Failed to load skill" }, { status: 500 });
  }
}
```

**Step 6: Commit**

```bash
git add frontend/app/api/ frontend/lib/paths.ts
git commit -m "feat: add API routes for pipeline and skills CRUD"
```

---

### Task 14: Build Pipeline view page with React Flow

**Files:**
- Create: `frontend/app/pipeline/page.tsx`
- Create: `frontend/components/PipelineFlow.tsx`

**Step 1: Create PipelineFlow component `frontend/components/PipelineFlow.tsx`**

```tsx
"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { PipelinePhase, SkillCatalogEntry } from "@/lib/types";

const SOURCE_COLORS: Record<string, string> = {
  write: "#22c55e",       // green
  adopt: "#3b82f6",       // blue
  extend: "#f59e0b",      // amber
  superpowers: "#a855f7", // purple
};

const SOURCE_LABELS: Record<string, string> = {
  write: "Vlastní",
  adopt: "Adoptovaný",
  extend: "Rozšířený",
  superpowers: "Superpowers",
};

function PhaseNode({ data }: NodeProps) {
  const phase = data.phase as PipelinePhase;
  const skills = data.skills as SkillCatalogEntry[];
  const onSelectPhase = data.onSelectPhase as (id: string) => void;

  return (
    <div
      className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-lg cursor-pointer hover:border-zinc-500 transition-colors min-w-[220px]"
      onClick={() => onSelectPhase(phase.id)}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-500" />
      <div className="mb-2 text-sm font-bold text-white">{phase.name}</div>
      <div className="mb-3 text-xs text-zinc-400">{phase.description}</div>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
            style={{ backgroundColor: SOURCE_COLORS[skill.source] + "cc" }}
            title={`${skill.name.cs} (${SOURCE_LABELS[skill.source]})`}
          >
            {skill.command}
          </span>
        ))}
      </div>
      {phase.loop && (
        <div className="mt-2 text-[10px] text-amber-400">↻ Iterativní smyčka</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500" />
    </div>
  );
}

interface PipelineFlowProps {
  phases: PipelinePhase[];
  skills: SkillCatalogEntry[];
  onSelectPhase: (phaseId: string) => void;
}

export default function PipelineFlow({
  phases,
  skills,
  onSelectPhase,
}: PipelineFlowProps) {
  const nodeTypes = useMemo(() => ({ phase: PhaseNode }), []);

  const nodes: Node[] = phases.map((phase, i) => ({
    id: phase.id,
    type: "phase",
    position: { x: 250, y: i * 200 },
    data: {
      phase,
      skills: skills.filter((s) => s.phase === phase.id),
      onSelectPhase,
    },
  }));

  const edges: Edge[] = phases
    .filter((p) => p.next)
    .map((phase) => ({
      id: `${phase.id}-${phase.next}`,
      source: phase.id,
      target: phase.next!,
      animated: true,
      style: { stroke: "#52525b" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#52525b" },
    }));

  // Add loop edge for build phase
  const loopPhase = phases.find((p) => p.loop);
  if (loopPhase) {
    edges.push({
      id: `${loopPhase.id}-loop`,
      source: loopPhase.id,
      target: loopPhase.id,
      animated: true,
      style: { stroke: "#f59e0b" },
      type: "smoothstep",
    });
  }

  return (
    <div className="h-[700px] rounded-xl border border-zinc-800 bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#27272a" gap={20} />
        <Controls className="!bg-zinc-800 !border-zinc-700 !text-white" />
      </ReactFlow>
    </div>
  );
}
```

**Step 2: Create pipeline page `frontend/app/pipeline/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import PipelineFlow from "@/components/PipelineFlow";
import type { Pipeline, SkillCatalog, SkillCatalogEntry, PipelinePhase } from "@/lib/types";

const SOURCE_COLORS: Record<string, string> = {
  write: "bg-green-500/20 text-green-400 border-green-500/30",
  adopt: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  extend: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  superpowers: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const SOURCE_LABELS: Record<string, string> = {
  write: "Vlastní",
  adopt: "Adoptovaný",
  extend: "Rozšířený",
  superpowers: "Superpowers",
};

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [catalog, setCatalog] = useState<SkillCatalog | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pipeline")
      .then((r) => r.json())
      .then((data) => {
        setPipeline(data.pipeline);
        setCatalog(data.catalog);
      })
      .catch(() => setError("Nepodařilo se načíst pipeline data"));
  }, []);

  if (error) return <div className="text-red-400 p-8">{error}</div>;
  if (!pipeline || !catalog) return <div className="text-zinc-400 p-8">Načítání...</div>;

  const selectedPhaseData = pipeline.phases.find((p) => p.id === selectedPhase);
  const phaseSkills = selectedPhaseData
    ? catalog.skills.filter((s) => s.phase === selectedPhaseData.id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Vizualizace workflow — od začátku relace po merge. Klikni na fázi pro detaily.
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs">
        {Object.entries(SOURCE_LABELS).map(([key, label]) => (
          <span key={key} className={`rounded-full border px-2 py-1 ${SOURCE_COLORS[key]}`}>
            {label}
          </span>
        ))}
      </div>

      <PipelineFlow
        phases={pipeline.phases}
        skills={catalog.skills}
        onSelectPhase={setSelectedPhase}
      />

      {/* Phase detail panel */}
      {selectedPhaseData && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-bold mb-1">{selectedPhaseData.name}</h2>
          <p className="text-zinc-400 text-sm mb-4">{selectedPhaseData.description}</p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {phaseSkills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-lg border border-zinc-700 bg-zinc-800 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-sm font-mono text-white">{skill.command}</code>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${SOURCE_COLORS[skill.source]}`}>
                    {SOURCE_LABELS[skill.source]}
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-200 mb-1">
                  {skill.name.cs}
                </div>
                <div className="text-xs text-zinc-400 mb-2">
                  {skill.description.cs}
                </div>
                <div className="flex flex-wrap gap-1">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add frontend/app/pipeline/ frontend/components/PipelineFlow.tsx
git commit -m "feat: add pipeline view with React Flow visualization"
```

---

### Task 15: Build Skill Catalog page with cards, search, and detail view

**Files:**
- Create: `frontend/app/catalog/page.tsx`
- Create: `frontend/components/SkillCard.tsx`
- Create: `frontend/components/SkillDetail.tsx`

**Step 1: Create SkillCard `frontend/components/SkillCard.tsx`**

```tsx
"use client";

import type { SkillCatalogEntry } from "@/lib/types";

const SOURCE_COLORS: Record<string, string> = {
  write: "bg-green-500/20 text-green-400 border-green-500/30",
  adopt: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  extend: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  superpowers: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const SOURCE_LABELS: Record<string, string> = {
  write: "Vlastní",
  adopt: "Adoptovaný",
  extend: "Rozšířený",
  superpowers: "Superpowers",
};

interface SkillCardProps {
  skill: SkillCatalogEntry;
  onClick: () => void;
}

export default function SkillCard({ skill, onClick }: SkillCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-600 hover:bg-zinc-800/80"
    >
      <div className="flex items-start justify-between mb-3">
        <code className="text-sm font-mono text-white">{skill.command}</code>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${SOURCE_COLORS[skill.source]}`}>
          {SOURCE_LABELS[skill.source]}
        </span>
      </div>

      <h3 className="text-base font-semibold text-zinc-100 mb-1">{skill.name.cs}</h3>
      <p className="text-sm text-zinc-400 mb-3">{skill.description.cs}</p>

      <div className="text-xs text-zinc-500 mb-3">
        <span className="font-medium text-zinc-400">Kdy použít: </span>
        {skill.whenToUse.cs}
      </div>

      <div className="flex flex-wrap gap-1">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 border border-zinc-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Create SkillDetail `frontend/components/SkillDetail.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import type { SkillCatalogEntry, SkillContent } from "@/lib/types";

const SOURCE_LABELS: Record<string, string> = {
  write: "Vlastní (napsaný od nuly)",
  adopt: "Adoptovaný z komunity",
  extend: "Rozšířený (komunita + vlastní logika)",
  superpowers: "Superpowers (obra/superpowers)",
};

interface SkillDetailProps {
  skill: SkillCatalogEntry;
  onClose: () => void;
  onEdit: () => void;
}

export default function SkillDetail({ skill, onClose, onEdit }: SkillDetailProps) {
  const [content, setContent] = useState<SkillContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/skills/${skill.id}/content`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setContent)
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [skill.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{skill.name.cs}</h2>
              <code className="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-300">
                {skill.command}
              </code>
            </div>
            <p className="text-sm text-zinc-500">
              {SOURCE_LABELS[skill.source]}
              {skill.sourceRepo && ` — ${skill.sourceRepo}`}
              {skill.sourceBase && ` — základ: ${skill.sourceBase}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Metadata sections */}
        <div className="space-y-4 mb-6">
          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Popis</h3>
            <p className="text-sm text-zinc-400">{skill.description.cs}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Kdy použít</h3>
            <p className="text-sm text-zinc-400">{skill.whenToUse.cs}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Detailní popis</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {skill.detailedDescription.cs}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Fáze pipeline</h3>
            <span className="inline-block rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
              {skill.phase}
            </span>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-1">Štítky</h3>
            <div className="flex flex-wrap gap-1">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 border border-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* SKILL.md content preview */}
        <section className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-zinc-300">SKILL.md obsah</h3>
            <button
              onClick={onEdit}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              Upravit v editoru
            </button>
          </div>
          {loading ? (
            <div className="text-sm text-zinc-500">Načítání...</div>
          ) : content ? (
            <pre className="max-h-[400px] overflow-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-400 border border-zinc-800">
              {content.content}
            </pre>
          ) : (
            <div className="text-sm text-zinc-500">
              Soubor SKILL.md zatím neexistuje.
            </div>
          )}
        </section>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Zavřít
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Create catalog page `frontend/app/catalog/page.tsx`**

```tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import SkillCard from "@/components/SkillCard";
import SkillDetail from "@/components/SkillDetail";
import SkillEditor from "@/components/SkillEditor";
import type { SkillCatalogEntry } from "@/lib/types";

const PHASE_LABELS: Record<string, string> = {
  "session-start": "Začátek relace",
  plan: "Plánování",
  build: "Build",
  quality: "Kvalita",
  integration: "Integrace",
  merge: "Merge",
};

const SOURCE_OPTIONS = [
  { value: "all", label: "Všechny zdroje" },
  { value: "write", label: "Vlastní" },
  { value: "adopt", label: "Adoptované" },
  { value: "extend", label: "Rozšířené" },
  { value: "superpowers", label: "Superpowers" },
];

export default function CatalogPage() {
  const [skills, setSkills] = useState<SkillCatalogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState<SkillCatalogEntry | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillCatalogEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((data) => setSkills(data.skills))
      .catch(() => setError("Nepodařilo se načíst skills"));
  }, []);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.cs.toLowerCase().includes(search.toLowerCase()) ||
        s.command.toLowerCase().includes(search.toLowerCase()) ||
        s.description.cs.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesPhase = phaseFilter === "all" || s.phase === phaseFilter;
      const matchesSource = sourceFilter === "all" || s.source === sourceFilter;
      return matchesSearch && matchesPhase && matchesSource;
    });
  }, [skills, search, phaseFilter, sourceFilter]);

  if (error) return <div className="text-red-400 p-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Katalog skillů</h1>
        <p className="text-zinc-400 text-sm mt-1">
          {skills.length} skillů v pipeline — klikni pro detaily a úpravu.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Hledat skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
        />
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none"
        >
          <option value="all">Všechny fáze</option>
          {Object.entries(PHASE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none"
        >
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-zinc-500">
        <span>Zobrazeno: {filtered.length}/{skills.length}</span>
        <span>Vlastní: {skills.filter((s) => s.source === "write").length}</span>
        <span>Adoptované: {skills.filter((s) => s.source === "adopt").length}</span>
        <span>Rozšířené: {skills.filter((s) => s.source === "extend").length}</span>
        <span>Superpowers: {skills.filter((s) => s.source === "superpowers").length}</span>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onClick={() => setSelectedSkill(skill)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-zinc-500 py-12">
          Žádné shody pro zadané filtry.
        </div>
      )}

      {/* Detail modal */}
      {selectedSkill && !editingSkill && (
        <SkillDetail
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onEdit={() => {
            setEditingSkill(selectedSkill);
            setSelectedSkill(null);
          }}
        />
      )}

      {/* Editor modal */}
      {editingSkill && (
        <SkillEditor
          skillId={editingSkill.id}
          skillName={editingSkill.name.cs}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add frontend/app/catalog/ frontend/components/SkillCard.tsx frontend/components/SkillDetail.tsx
git commit -m "feat: add skill catalog with cards, search, filters, and detail view"
```

---

### Task 16: Build Skill Editor with Monaco

**Files:**
- Create: `frontend/components/SkillEditor.tsx`

**Step 1: Create SkillEditor `frontend/components/SkillEditor.tsx`**

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";

interface SkillEditorProps {
  skillId: string;
  skillName: string;
  onClose: () => void;
}

export default function SkillEditor({ skillId, skillName, onClose }: SkillEditorProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/skills/${skillId}/content`)
      .then((r) => (r.ok ? r.json() : { content: getTemplate(skillId) }))
      .then((data) => {
        setContent(data.content);
        setOriginalContent(data.content);
      })
      .catch(() => {
        const tpl = getTemplate(skillId);
        setContent(tpl);
        setOriginalContent(tpl);
      })
      .finally(() => setLoading(false));
  }, [skillId]);

  const hasChanges = content !== originalContent;

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/skills/${skillId}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setOriginalContent(content);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            ← Zpět
          </button>
          <span className="text-sm font-medium text-white">
            {skillName} — <code className="text-zinc-400">skills/{skillId}/SKILL.md</code>
          </span>
          {hasChanges && (
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400">
              Neuložené změny
            </span>
          )}
          {saved && (
            <span className="rounded bg-green-500/20 px-2 py-0.5 text-[10px] text-green-400">
              Uloženo ✓
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Ukládám..." : "Uložit"}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            Načítání editoru...
          </div>
        ) : (
          <Editor
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => setContent(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              lineHeight: 22,
              minimap: { enabled: false },
              wordWrap: "on",
              padding: { top: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        )}
      </div>
    </div>
  );
}

function getTemplate(skillId: string): string {
  return `---
name: ${skillId}
description: "Use when [condition] — [what it does]"
---

# ${skillId.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}

## Overview

[What this skill does and when to use it]

## Process

### Step 1: [First step]

[Details]

### Step 2: [Second step]

[Details]
`;
}
```

**Step 2: Commit**

```bash
git add frontend/components/SkillEditor.tsx
git commit -m "feat: add Monaco-based skill editor with save"
```

---

### Task 17: Build Settings page

**Files:**
- Create: `frontend/app/settings/page.tsx`
- Create: `frontend/app/api/settings/route.ts`

**Step 1: Create settings API `frontend/app/api/settings/route.ts`**

```typescript
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { SKILLS_DIR, REPO_ROOT } from "@/lib/paths";

export async function GET() {
  try {
    const claudeSkillsDir = path.join(os.homedir(), ".claude", "skills");

    // Check symlink status for each skill
    const skillDirs = await fs.readdir(SKILLS_DIR).catch(() => []);
    const symlinks = await Promise.all(
      skillDirs.map(async (name) => {
        const target = path.join(claudeSkillsDir, name);
        let status: "linked" | "missing" | "conflict" = "missing";
        try {
          const stat = await fs.lstat(target);
          if (stat.isSymbolicLink()) {
            const linkTarget = await fs.readlink(target);
            const expected = path.join(SKILLS_DIR, name);
            status = linkTarget === expected || linkTarget === expected.replace(/\\/g, "/")
              ? "linked"
              : "conflict";
          } else {
            status = "conflict";
          }
        } catch {
          status = "missing";
        }
        return { name, status };
      })
    );

    // System info
    const info = {
      repoRoot: REPO_ROOT,
      skillsDir: SKILLS_DIR,
      claudeSkillsDir,
      platform: process.platform,
      nodeVersion: process.version,
      skillCount: skillDirs.length,
    };

    return NextResponse.json({ symlinks, info });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}
```

**Step 2: Create settings page `frontend/app/settings/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

interface SymlinkStatus {
  name: string;
  status: "linked" | "missing" | "conflict";
}

interface SystemInfo {
  repoRoot: string;
  skillsDir: string;
  claudeSkillsDir: string;
  platform: string;
  nodeVersion: string;
  skillCount: number;
}

const STATUS_STYLES: Record<string, string> = {
  linked: "bg-green-500/20 text-green-400",
  missing: "bg-red-500/20 text-red-400",
  conflict: "bg-amber-500/20 text-amber-400",
};

const STATUS_LABELS: Record<string, string> = {
  linked: "Propojeno ✓",
  missing: "Chybí symlink",
  conflict: "Konflikt — jiný cíl",
};

export default function SettingsPage() {
  const [symlinks, setSymlinks] = useState<SymlinkStatus[]>([]);
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSymlinks(data.symlinks);
        setInfo(data.info);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-zinc-400 p-8">Načítání...</div>;

  const linked = symlinks.filter((s) => s.status === "linked").length;
  const missing = symlinks.filter((s) => s.status === "missing").length;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Nastavení</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Stav instalace, symlinky, systémové informace.
        </p>
      </div>

      {/* System info */}
      {info && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold mb-4">Systém</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-zinc-500">Platforma</dt>
            <dd className="text-zinc-300 font-mono">{info.platform}</dd>
            <dt className="text-zinc-500">Node.js</dt>
            <dd className="text-zinc-300 font-mono">{info.nodeVersion}</dd>
            <dt className="text-zinc-500">Repo root</dt>
            <dd className="text-zinc-300 font-mono text-xs">{info.repoRoot}</dd>
            <dt className="text-zinc-500">Skills adresář</dt>
            <dd className="text-zinc-300 font-mono text-xs">{info.skillsDir}</dd>
            <dt className="text-zinc-500">Claude skills</dt>
            <dd className="text-zinc-300 font-mono text-xs">{info.claudeSkillsDir}</dd>
            <dt className="text-zinc-500">Počet skillů</dt>
            <dd className="text-zinc-300">{info.skillCount}</dd>
          </dl>
        </section>
      )}

      {/* Symlink status */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Stav symlinků</h2>
          <div className="text-xs text-zinc-500">
            {linked}/{symlinks.length} propojeno
            {missing > 0 && (
              <span className="text-red-400 ml-2">({missing} chybí)</span>
            )}
          </div>
        </div>

        {missing > 0 && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
            Některé symlinky chybí. Spusť instalační skript:
            <code className="block mt-1 text-xs font-mono text-amber-400">
              {info?.platform === "win32"
                ? "powershell -ExecutionPolicy Bypass ./scripts/install.ps1"
                : "./scripts/install.sh"}
            </code>
          </div>
        )}

        <div className="space-y-2">
          {symlinks.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-lg bg-zinc-800 px-4 py-2.5"
            >
              <span className="text-sm font-mono text-zinc-300">{s.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[s.status]}`}>
                {STATUS_LABELS[s.status]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold mb-4">Užitečné příkazy</h2>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-zinc-400 mb-1">Nainstalovat/aktualizovat symlinky:</div>
            <code className="block rounded bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
              {info?.platform === "win32"
                ? "powershell -ExecutionPolicy Bypass .\\scripts\\install.ps1"
                : "./scripts/install.sh"}
            </code>
          </div>
          <div>
            <div className="text-zinc-400 mb-1">Spustit dashboard:</div>
            <code className="block rounded bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
              cd frontend && npm run dev
            </code>
          </div>
          <div>
            <div className="text-zinc-400 mb-1">Synchronizovat s GitHub:</div>
            <code className="block rounded bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
              git pull && git push
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add frontend/app/settings/ frontend/app/api/settings/
git commit -m "feat: add settings page with symlink status and system info"
```

---

### Task 18: Update Tailwind config and global styles for dark theme

**Files:**
- Modify: `frontend/tailwind.config.ts`
- Modify: `frontend/app/globals.css`

**Step 1: Ensure Tailwind config includes all component paths**

Verify `frontend/tailwind.config.ts` has:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

**Step 2: Update globals.css for dark base**

Ensure `frontend/app/globals.css` contains:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-zinc-950 text-zinc-100;
}

/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-zinc-900;
}

::-webkit-scrollbar-thumb {
  @apply bg-zinc-700 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-zinc-600;
}
```

**Step 3: Commit**

```bash
git add frontend/tailwind.config.ts frontend/app/globals.css
git commit -m "style: configure dark theme and global styles"
```

---

### Task 19: End-to-end smoke test

**Step 1: Verify all files exist**

```bash
cd "C:\cursor\Zamba skills"
ls skills/*/SKILL.md
ls pipeline/pipeline.json pipeline/skills-catalog.json
ls scripts/install.sh scripts/install.ps1
ls frontend/app/pipeline/page.tsx frontend/app/catalog/page.tsx frontend/app/settings/page.tsx
```

Expected: All files present.

**Step 2: Start frontend**

```bash
cd "C:\cursor\Zamba skills/frontend"
npm run dev
```

Expected: Compiles without errors, serves on localhost:3000.

**Step 3: Test each page**

1. Open http://localhost:3000 → should redirect to /pipeline
2. /pipeline → should show React Flow diagram with 6 phases
3. Click a phase → should show skill cards below
4. /catalog → should show 17 skill cards with Czech descriptions
5. Search "testy" → should filter relevant skills
6. Click a skill → should open detail modal with all Czech info
7. Click "Upravit v editoru" → should open Monaco editor
8. /settings → should show symlink status and system info

**Step 4: Final commit**

```bash
cd "C:\cursor\Zamba skills"
git add -A
git commit -m "feat: complete zamba-skills monorepo — skills, pipeline, frontend dashboard"
```

---

## Summary

| Part | Tasks | What it delivers |
|------|-------|-----------------|
| A: Foundation | 1-10 | Git repo, 10 skills, pipeline.json, catalog with Czech metadata, install scripts |
| B: Frontend | 11-19 | Next.js dashboard with pipeline view, skill catalog (Czech), editor, settings |

**Total tasks:** 19
**Total skills:** 10 custom (3 write + 4 adopt + 3 extend) + 7 superpowers reused
**Frontend pages:** 3 (Pipeline, Katalog, Nastavení)

---

Plan complete and saved to `docs/plans/2026-03-04-zamba-skills-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** — I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** — Open new session with executing-plans, batch execution with checkpoints

Which approach?
