# Handoff — Zamba Skills

**Datum:** 2026-03-05
**Stav:** MVP KOMPLETNI — vsech 19 implementacnich tasku hotovych, nepushnuto
**Branch:** master (22 commitu ahead of origin)
**Repo:** `C:\work\Zamba skills\Zamba-skills`

---

## Pro dalsiho agenta — rychly start

```bash
# 1. Overit stav
cd "C:\work\Zamba skills\Zamba-skills"
git log --oneline -5
cd frontend && npm run build   # musi projit bez chyb

# 2. Spustit dashboard
npm run dev                     # http://localhost:3000

# 3. Dulezite soubory
cat CLAUDE.md                   # project instructions
cat docs/HANDOFF.md             # tento soubor
```

### Co je v repu

| Slozka | Obsah |
|--------|-------|
| `skills/` | 10 SKILL.md souboru (3 written, 4 adopted, 3 extended) |
| `pipeline/` | pipeline.json (6 fazi), skills-catalog.json (17 skillu, CZ metadata) |
| `frontend/` | Next.js 16 dashboard — 3 stranky, 5 API routes, 5 komponent |
| `scripts/` | install.sh + install.ps1 (symlink skills do ~/.claude/skills/) |
| `docs/plans/` | Design doc + implementation plan (19 tasku) |

### Frontend stranky

| Route | Popis |
|-------|-------|
| `/pipeline` | React Flow vizualizace 6 fazi pipeline, kliknutelne nody s detailem |
| `/catalog` | Katalog 17 skillu — karty, search, filtry (faze/zdroj), detail modal, Monaco editor |
| `/settings` | Stav symlinku, systemove info, uzitecne prikazy |

### API routes

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/pipeline` | GET | pipeline.json + skills-catalog.json |
| `/api/skills` | GET | vsechny skills s file existence check |
| `/api/skills/[id]` | GET | metadata jednoho skillu z katalogu |
| `/api/skills/[id]/content` | GET | SKILL.md obsah + parsed frontmatter |
| `/api/skills/[id]/content` | PUT | ulozit SKILL.md (`{ content: string }`) |
| `/api/settings` | GET | symlink status + system info |

---

## Tech stack — POZOR: lisi se od planu

Implementacni plan (`docs/plans/2026-03-04-zamba-skills-implementation.md`) pocita s Next.js 14 a Tailwind 3. **Skutecnost:**

| Plan rikal | Skutecnost |
|------------|-----------|
| Next.js 14 | **Next.js 16.1.6** (Turbopack) |
| React 18 | **React 19.2.3** |
| Tailwind CSS 3 (`@tailwind base`) | **Tailwind CSS 4** (`@import "tailwindcss"`) |
| tailwind.config.ts | **Neexistuje** — v4 auto-detekce |
| Inter font z next/font/google | Pouzit Inter z next/font/google |

### Klicove odlisnosti pro budouci praci

1. **Tailwind v4** — zadny `tailwind.config.ts`, zadne `@tailwind` direktivy. Konfigurace pres `@theme inline {}` v globals.css
2. **Next.js 16** — route params jsou `Promise<{ id: string }>` (musi `await params`), `NodeProps` z @xyflow/react nema generika
3. **Cesty v planu** — plan ma `C:\cursor\Zamba skills`, spravna cesta je `C:\work\Zamba skills\Zamba-skills`

---

## Commit historie (vsech 19 tasku)

### Part A: Foundation & Skills (Tasks 1-10)

| Task | Commit | Popis |
|------|--------|-------|
| 1 | `0ce5d8a` | Directory scaffold |
| 2 | `3ce82da` | pipeline.json + skills-catalog.json |
| 3 | `8933dfc` | start-session skill |
| 4 | `8002a5d` | scope-check skill |
| 5 | `9ceeea8` | progress-check skill |
| 6 | `7e4a204` | 4 adopted community skills |
| 7 | `2b96b0d` | generate-tests (extended) |
| 8 | `cfd2d94` | create-pr (extended) |
| 9 | `83b091e` | setup-ci-tests (extended) |
| 10 | `ba54435` | install scripts |

### Part B: Frontend (Tasks 11-19)

| Task | Commit | Popis |
|------|--------|-------|
| 11 | `a5fe233` | Next.js init + deps |
| 12 | `d8e969d` | Layout, Navigation, types |
| 13 | `181d23a` | API routes (pipeline, skills CRUD) |
| 14 | `2fddb40` | Pipeline view (React Flow) |
| 15 | `2c63c15` | Skill Catalog (cards, search, filters, detail) |
| 16 | `1877448` | Skill Editor (Monaco) |
| 17 | `fa309e9` | Settings page |
| 18 | `8ad357a` | Dark theme globals.css |
| 19 | — | Smoke test (verified, no code changes) |

---

## Repo struktura

```
zamba-skills/
├── CLAUDE.md
├── .gitignore
├── docs/
│   ├── HANDOFF.md                    ← tento soubor
│   └── plans/
│       ├── 2026-03-03-zamba-skills-design.md
│       └── 2026-03-04-zamba-skills-implementation.md
├── frontend/                          ← Next.js 16 app
│   ├── package.json                   ← next 16.1.6, react 19, tailwind 4
│   ├── app/
│   │   ├── layout.tsx                 ← Inter font, dark body, Navigation
│   │   ├── page.tsx                   ← redirect → /pipeline
│   │   ├── globals.css                ← zinc dark theme, custom scrollbar
│   │   ├── pipeline/page.tsx          ← React Flow + phase detail panel
│   │   ├── catalog/page.tsx           ← skill grid + search + filters + modals
│   │   ├── settings/page.tsx          ← symlink status + system info
│   │   └── api/
│   │       ├── pipeline/route.ts      ← GET pipeline+catalog
│   │       ├── settings/route.ts      ← GET symlink status
│   │       └── skills/
│   │           ├── route.ts           ← GET all skills
│   │           └── [id]/
│   │               ├── route.ts       ← GET skill metadata
│   │               └── content/route.ts ← GET/PUT SKILL.md
│   ├── components/
│   │   ├── Navigation.tsx             ← top nav, 3 tabs (CZ labels)
│   │   ├── PipelineFlow.tsx           ← React Flow wrapper, PhaseNode
│   │   ├── SkillCard.tsx              ← catalog card
│   │   ├── SkillDetail.tsx            ← full detail modal
│   │   └── SkillEditor.tsx            ← Monaco fullscreen editor
│   └── lib/
│       ├── types.ts                   ← Pipeline, SkillCatalog, etc.
│       └── paths.ts                   ← REPO_ROOT, SKILLS_DIR, etc.
├── pipeline/
│   ├── pipeline.json                  ← 6 fazi s skill mappings
│   └── skills-catalog.json            ← 17 skillu s CZ popisky
├── scripts/
│   ├── install.sh                     ← Linux/Mac symlink installer
│   └── install.ps1                    ← Windows symlink installer
└── skills/                            ← 10 SKILL.md souboru
    ├── start-session/SKILL.md         ← written
    ├── scope-check/SKILL.md           ← written
    ├── progress-check/SKILL.md        ← written
    ├── create-docs/SKILL.md           ← adopted
    ├── update-changelog/SKILL.md      ← adopted
    ├── test-coverage/SKILL.md         ← adopted
    ├── pr-checklist/SKILL.md          ← adopted
    ├── generate-tests/SKILL.md        ← extended
    ├── create-pr/SKILL.md             ← extended
    └── setup-ci-tests/SKILL.md        ← extended
```

---

## Zname problemy a mozna vylepseni

### Nepushnuto
Branch je 22 commitu ahead of origin. Je potreba `git push`.

### Mozna vylepseni (neimplementovano)
1. **Testy** — zadne unit/integration testy pro frontend
2. **i18n** — CZ texty jsou hardcoded v komponentach, ne centralizovane
3. **Error boundaries** — chybi React error boundaries
4. **Loading states** — jednoduche textove "Nacitani...", bez skeleton UI
5. **Responsive** — zakladni grid layout, netestovano na mobilu
6. **Accessibility** — zakladni semanticke HTML, ale bez ARIA labelu na modalech
7. **paths.ts** — `REPO_ROOT = path.resolve(process.cwd(), "..")` funguje jen kdyz se `npm run dev` spousti z `frontend/`
8. **Security** — PUT endpoint na `/api/skills/[id]/content` nema autentizaci (OK pro lokalni dev, ne pro produkci)
9. **SOURCE_COLORS/LABELS** — duplicitni definice ve 4 souborech (PipelineFlow, pipeline/page, SkillCard, SkillDetail)

### Architekturni rozhodnuti
- **Filesystem-based API** — skills se ctou/zapisuji primo z disku pres Node fs, zadna databaze
- **skills-catalog.json jako zdroj pravdy** — CZ metadata, faze, tagy jsou v JSON, ne v SKILL.md frontmatter
- **Client-side rendering** — vsechny stranky jsou "use client", data se fetchuji pres API routes
- **Zadny state management** — kazda stranka ma vlastni useState, zadny global store
