# Handoff — Zamba Skills Implementation

**Datum:** 2026-03-05
**Stav:** Batch 1+2 dokončen (Tasks 1-6 z 19)
**Branch:** master
**Poslední commit:** `7e4a204` feat: adopt 4 community skills (docs, changelog, coverage, checklist)

---

## Co je hotové

| Task | Popis | Commit |
|------|-------|--------|
| 1 | Directory scaffold (skills/, pipeline/, scripts/, frontend/, CLAUDE.md, .gitignore) | `0ce5d8a` |
| 2 | pipeline.json (6 fází) + skills-catalog.json (17 skillů s CZ metadata) | `3ce82da` |
| 3 | skills/start-session/SKILL.md | `8933dfc` |
| 4 | skills/scope-check/SKILL.md | `8002a5d` |
| 5 | skills/progress-check/SKILL.md | `9ceeea8` |
| 6 | Adopt 4 community skills (create-docs, update-changelog, test-coverage, pr-checklist) | `7e4a204` |

## Co zbývá

### Batch 3: Tasks 7-10 (Skills — extend + install scripts)
- **Task 7:** Extend `skills/generate-tests/SKILL.md` (based on wshobson/test-harness + decision logic)
- **Task 8:** Extend `skills/create-pr/SKILL.md` (based on wshobson/pr-enhance + git-workflow)
- **Task 9:** Extend `skills/setup-ci-tests/SKILL.md` (based on akin-ozer/cc-devops-skills)
- **Task 10:** Create `scripts/install.sh` + `scripts/install.ps1` (symlink skills to ~/.claude/skills/)

### Batch 4: Tasks 11-13 (Frontend — základ)
- **Task 11:** Initialize Next.js project (`npx create-next-app@latest`)
- **Task 12:** Layout, Navigation, shared types
- **Task 13:** API routes (pipeline, skills CRUD)

### Batch 5: Tasks 14-16 (Frontend — stránky)
- **Task 14:** Pipeline view s React Flow
- **Task 15:** Skill Catalog (karty, search, detail modal)
- **Task 16:** Skill Editor s Monaco

### Batch 6: Tasks 17-19 (Frontend — dokončení)
- **Task 17:** Settings page (symlink status, system info)
- **Task 18:** Tailwind dark theme + global styles
- **Task 19:** End-to-end smoke test

---

## Jak pokračovat

```
/superpowers:execute-plan
```

Implementační plán je v `docs/plans/2026-03-04-zamba-skills-implementation.md`. Obsahuje kompletní kód pro každý task — stačí ho sledovat krok za krokem.

### Důležité poznámky

1. **Cesty:** Plán obsahuje staré cesty `C:\cursor\Zamba skills` — správná cesta je `C:\work\Zamba skills\Zamba-skills`
2. **Task 6 (adopt skills):** Už hotovo — obsah napsán podle popisu, ne stažen z GitHubu
3. **Task 7-9 (extend skills):** Plán obsahuje kompletní SKILL.md obsah — stačí zapsat do souborů
4. **Task 10 (install scripts):** Plán má kód pro bash i PowerShell — vytvořit oba
5. **Task 11 (Next.js):** Vyžaduje `npx create-next-app@latest` + `npm install @xyflow/react @monaco-editor/react`
6. **Commity:** Každý task má svůj commit s přesnou zprávou definovanou v plánu

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
│   └── .gitkeep
└── skills/
    ├── start-session/SKILL.md  ← hotovo (Task 3)
    ├── scope-check/SKILL.md    ← hotovo (Task 4)
    ├── progress-check/SKILL.md ← hotovo (Task 5)
    ├── create-docs/SKILL.md    ← hotovo (Task 6)
    ├── update-changelog/SKILL.md ← hotovo (Task 6)
    ├── test-coverage/SKILL.md  ← hotovo (Task 6)
    ├── pr-checklist/SKILL.md   ← hotovo (Task 6)
    ├── generate-tests/         ← prázdný (Task 7)
    ├── create-pr/              ← prázdný (Task 8)
    └── setup-ci-tests/         ← prázdný (Task 9)
```

### Tech stack (pro frontend)

- Next.js 14 (App Router)
- React Flow (@xyflow/react)
- Monaco Editor (@monaco-editor/react)
- Tailwind CSS 3
- TypeScript
- Dark theme (zinc palette)
- Czech UI
