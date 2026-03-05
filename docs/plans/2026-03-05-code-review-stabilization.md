# Code Review Stabilization

**Datum:** 2026-03-05
**Cil:** Opravit vsech 13 issues z code review, jeden commit.

## Critical (2)

1. **Path traversal fix** — validace v `api/skills/[id]/content/route.ts` (GET i PUT) a `api/skills/[id]/route.ts` ze resolved path zacina `SKILLS_DIR`
2. **Input validace PUT body** — overit `typeof body?.content === "string"` pred zapisem

## Important (5)

3. **paths.ts** — pouzit `__dirname` misto `process.cwd() + ".."`
4. **Sdilene konstanty** — novy `frontend/lib/constants.ts` se `SOURCE_COLORS`, `SOURCE_LABELS`; odebrat duplicity ze 4 souboru
5. **Kontrola `r.ok` u fetch** — pridat status check v `pipeline/page.tsx`, `catalog/page.tsx`, `settings/page.tsx`
6. **Modal accessibility** — `role="dialog"`, `aria-modal`, `aria-label` na close button, Escape handler, backdrop click to close v `SkillDetail.tsx`
7. **Logovat error v catch** — pridat `console.error` v API route catch blocich

## Minor (6)

8. **Diakritika** — sjednotit CZ texty v komponentach
9. **Dead code Navigation** — odstranit nepouzivany `label`, nechat jen `labelCs` (nebo prejmenovat)
10. **Catalog loading state** — pridat "Nacitani..." pred dokoncenim fetch
11. **Unsaved changes warning** — v SkillEditor pridat confirm dialog pri zavreni s neulozenymi zmenami
12. **Install script trailing slash** — `"${skill_dir%/}"` v `install.sh`
13. **Neimplementovane lib moduly** — zadna akce, jen poznamka

## Soubory ktere se zmeni

| Soubor | Issues |
|--------|--------|
| `frontend/app/api/skills/[id]/content/route.ts` | #1, #2 |
| `frontend/app/api/skills/[id]/route.ts` | #1 |
| `frontend/lib/paths.ts` | #3 |
| `frontend/lib/constants.ts` (novy) | #4 |
| `frontend/components/PipelineFlow.tsx` | #4 |
| `frontend/components/SkillCard.tsx` | #4 |
| `frontend/components/SkillDetail.tsx` | #4, #6, #8 |
| `frontend/app/pipeline/page.tsx` | #4, #5, #8 |
| `frontend/app/catalog/page.tsx` | #5, #8, #10 |
| `frontend/app/settings/page.tsx` | #5 |
| `frontend/components/Navigation.tsx` | #9 |
| `frontend/components/SkillEditor.tsx` | #11 |
| `frontend/app/api/pipeline/route.ts` | #7 |
| `frontend/app/api/settings/route.ts` | #7 |
| `scripts/install.sh` | #12 |
