# Handoff — Zamba Skills Implementation

**Datum:** 2026-03-05
**Stav:** Batch 1-3 dokončen (Tasks 1-10 z 19) — všechny skills hotové, install skripty hotové
**Branch:** master
**Poslední commit:** `ba54435` feat: add cross-platform install scripts

---

## Co je hotové

### Part A: Foundation & Skills (Tasks 1-10) — KOMPLETNÍ

| Task | Popis | Commit |
|------|-------|--------|
| 1 | Directory scaffold (skills/, pipeline/, scripts/, frontend/, CLAUDE.md, .gitignore) | `0ce5d8a` |
| 2 | pipeline.json (6 fází) + skills-catalog.json (17 skillů s CZ metadata) | `3ce82da` |
| 3 | skills/start-session/SKILL.md | `8933dfc` |
| 4 | skills/scope-check/SKILL.md | `8002a5d` |
| 5 | skills/progress-check/SKILL.md | `9ceeea8` |
| 6 | Adopt 4 community skills (create-docs, update-changelog, test-coverage, pr-checklist) | `7e4a204` |
| 7 | skills/generate-tests/SKILL.md (extended from wshobson/test-harness) | `2b96b0d` |
| 8 | skills/create-pr/SKILL.md (extended from wshobson/pr-enhance) | `cfd2d94` |
| 9 | skills/setup-ci-tests/SKILL.md (extended from akin-ozer/cc-devops-skills) | `83b091e` |
| 10 | scripts/install.sh + scripts/install.ps1 (symlink installers) | `ba54435` |

### Shrnutí hotového

- **10 skills** v `skills/` — 3 written (start-session, scope-check, progress-check), 4 adopted (create-docs, update-changelog, test-coverage, pr-checklist), 3 extended (generate-tests, create-pr, setup-ci-tests)
- **Pipeline definice** v `pipeline/` — pipeline.json (6 fází) + skills-catalog.json (17 skillů s CZ popisky)
- **Install skripty** v `scripts/` — install.sh (Linux/Mac) + install.ps1 (Windows, requires admin)

## Co zbývá — Part B: Frontend (Tasks 11-19)

### Batch 4: Tasks 11-13 (Frontend — základ)
- **Task 11:** Initialize Next.js project (`npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-git`) + install `@xyflow/react @monaco-editor/react`
- **Task 12:** Layout, Navigation, shared types (app/layout.tsx, components/Navigation.tsx, lib/types.ts)
- **Task 13:** API routes (app/api/pipeline/route.ts, app/api/skills/route.ts, app/api/skills/[name]/route.ts)

### Batch 5: Tasks 14-16 (Frontend — stránky)
- **Task 14:** Pipeline view s React Flow (app/pipeline/page.tsx)
- **Task 15:** Skill Catalog — karty, search, detail modal (app/skills/page.tsx)
- **Task 16:** Skill Editor s Monaco (app/skills/[name]/edit/page.tsx)

### Batch 6: Tasks 17-19 (Frontend — dokončení)
- **Task 17:** Settings page — symlink status, system info (app/settings/page.tsx)
- **Task 18:** Tailwind dark theme + global styles (tailwind.config.ts, app/globals.css)
- **Task 19:** End-to-end smoke test (npm run build + dev server check)

---

## Jak pokračovat

```
1. Přečíst tento soubor — přehled stavu
2. Spustit /superpowers:execute-plan — pokračuje od Task 11
3. Sledovat docs/plans/2026-03-04-zamba-skills-implementation.md — kompletní kód pro každý task
```

Implementační plán je v `docs/plans/2026-03-04-zamba-skills-implementation.md`. Obsahuje kompletní kód pro každý task — stačí ho sledovat krok za krokem.

### Důležité poznámky

1. **Cesty:** Plán obsahuje staré cesty `C:\cursor\Zamba skills` — správná cesta je `C:\work\Zamba skills\Zamba-skills`
2. **Task 11 (Next.js):** Vyžaduje `npx create-next-app@latest` + `npm install @xyflow/react @monaco-editor/react`
3. **Commity:** Každý task má svůj commit s přesnou zprávou definovanou v plánu
4. **Task 18 (theme):** Aplikovat PŘED Task 14-16 stránkami, nebo refactorovat po — plán má Task 18 na konci ale dark theme je potřeba pro konzistentní UI

### Repo struktura (aktuální)

```
zamba-skills/
├── .gitignore
├── CLAUDE.md
├── docs/
│   ├── HANDOFF.md              ← tento soubor
│   └── plans/
│       ├── 2026-03-03-zamba-skills-design.md
│       └── 2026-03-04-zamba-skills-implementation.md
├── frontend/
│   └── .gitkeep
├── pipeline/
│   ├── pipeline.json           ← 6 fází pipeline
│   └── skills-catalog.json     ← 17 skillů s CZ popisky
├── scripts/
│   ├── install.sh              ← Linux/Mac symlink installer
│   └── install.ps1             ← Windows symlink installer (admin)
└── skills/
    ├── start-session/SKILL.md  ← written (Task 3)
    ├── scope-check/SKILL.md    ← written (Task 4)
    ├── progress-check/SKILL.md ← written (Task 5)
    ├── create-docs/SKILL.md    ← adopted (Task 6)
    ├── update-changelog/SKILL.md ← adopted (Task 6)
    ├── test-coverage/SKILL.md  ← adopted (Task 6)
    ├── pr-checklist/SKILL.md   ← adopted (Task 6)
    ├── generate-tests/SKILL.md ← extended (Task 7)
    ├── create-pr/SKILL.md      ← extended (Task 8)
    └── setup-ci-tests/SKILL.md ← extended (Task 9)
```

### Tech stack (pro frontend)

- Next.js 14 (App Router)
- React Flow (@xyflow/react)
- Monaco Editor (@monaco-editor/react)
- Tailwind CSS 3
- TypeScript
- Dark theme (zinc palette)
- Czech UI
