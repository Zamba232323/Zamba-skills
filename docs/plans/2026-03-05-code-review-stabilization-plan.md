# Code Review Stabilization — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all 13 issues from code review in a single commit.

**Architecture:** Targeted fixes across 15 files — security hardening, shared constants extraction, accessibility improvements, and minor UX fixes. No new features.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4

---

### Task 1: Path traversal protection + input validation (Critical #1, #2)

**Files:**
- Modify: `frontend/app/api/skills/[id]/content/route.ts`
- Modify: `frontend/app/api/skills/[id]/route.ts`

**Step 1: Add path validation helper and fix content/route.ts**

Replace `frontend/app/api/skills/[id]/content/route.ts` entirely:

```typescript
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SKILLS_DIR } from "@/lib/paths";

function resolveSkillPath(id: string): string | null {
  const resolved = path.resolve(SKILLS_DIR, id, "SKILL.md");
  if (!resolved.startsWith(path.resolve(SKILLS_DIR) + path.sep)) {
    return null;
  }
  return resolved;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skillPath = resolveSkillPath(id);

  if (!skillPath) {
    return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
  }

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
  const skillPath = resolveSkillPath(id);

  if (!skillPath) {
    return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof (body as any)?.content !== "string") {
    return NextResponse.json({ error: "content must be a string" }, { status: 400 });
  }

  try {
    await fs.mkdir(path.dirname(skillPath), { recursive: true });
    await fs.writeFile(skillPath, (body as any).content, "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
```

**Step 2: Add path validation to [id]/route.ts**

In `frontend/app/api/skills/[id]/route.ts`, add ID validation. The route uses catalog lookup (not filesystem path), but still validate the id doesn't contain path separators:

```typescript
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { CATALOG_JSON } from "@/lib/paths";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id.includes("..") || id.includes("/") || id.includes("\\")) {
    return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
  }

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

**Step 3: Verify build**

Run: `cd frontend && npm run build`
Expected: Build succeeds

---

### Task 2: Fix fragile paths.ts (Important #3)

**Files:**
- Modify: `frontend/lib/paths.ts`

**Step 1: Replace process.cwd() with __dirname**

```typescript
import path from "path";

// Use __dirname to resolve repo root regardless of cwd
export const REPO_ROOT = path.resolve(__dirname, "../..");
export const SKILLS_DIR = path.join(REPO_ROOT, "skills");
export const PIPELINE_DIR = path.join(REPO_ROOT, "pipeline");
export const PIPELINE_JSON = path.join(PIPELINE_DIR, "pipeline.json");
export const CATALOG_JSON = path.join(PIPELINE_DIR, "skills-catalog.json");
```

**Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build succeeds. If `__dirname` is not available in Next.js server components, fallback to:
```typescript
export const REPO_ROOT = process.env.REPO_ROOT || path.resolve(process.cwd(), "..");
```

---

### Task 3: Extract shared constants (Important #4)

**Files:**
- Create: `frontend/lib/constants.ts`
- Modify: `frontend/components/PipelineFlow.tsx` — remove local SOURCE_COLORS/LABELS, import from constants
- Modify: `frontend/components/SkillCard.tsx` — remove local SOURCE_COLORS/LABELS, import from constants
- Modify: `frontend/components/SkillDetail.tsx` — remove local SOURCE_LABELS, import from constants
- Modify: `frontend/app/pipeline/page.tsx` — remove local SOURCE_COLORS/LABELS, import from constants

**Step 1: Create constants file**

There are two different formats:
- PipelineFlow uses hex colors (for React Flow nodes): `"#22c55e"`
- SkillCard and pipeline/page use Tailwind classes: `"bg-green-500/20 text-green-400 border-green-500/30"`

Create `frontend/lib/constants.ts`:

```typescript
// Hex colors for React Flow nodes
export const SOURCE_HEX_COLORS: Record<string, string> = {
  write: "#22c55e",
  adopt: "#3b82f6",
  extend: "#f59e0b",
  superpowers: "#a855f7",
};

// Tailwind class variants for badges
export const SOURCE_BADGE_STYLES: Record<string, string> = {
  write: "bg-green-500/20 text-green-400 border-green-500/30",
  adopt: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  extend: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  superpowers: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// Short labels
export const SOURCE_LABELS: Record<string, string> = {
  write: "Vlastní",
  adopt: "Adoptovaný",
  extend: "Rozšířený",
  superpowers: "Superpowers",
};

// Long labels for detail view
export const SOURCE_LABELS_LONG: Record<string, string> = {
  write: "Vlastní (napsaný od nuly)",
  adopt: "Adoptovaný z komunity",
  extend: "Rozšířený (komunita + vlastní logika)",
  superpowers: "Superpowers (obra/superpowers)",
};
```

**Step 2: Update PipelineFlow.tsx**

Remove lines 18-30 (local SOURCE_COLORS/SOURCE_LABELS). Add import:
```typescript
import { SOURCE_HEX_COLORS, SOURCE_LABELS } from "@/lib/constants";
```
Replace `SOURCE_COLORS[skill.source]` with `SOURCE_HEX_COLORS[skill.source]` on line 50.

**Step 3: Update SkillCard.tsx**

Remove lines 5-17. Add import:
```typescript
import { SOURCE_BADGE_STYLES, SOURCE_LABELS } from "@/lib/constants";
```
Replace `SOURCE_COLORS[skill.source]` with `SOURCE_BADGE_STYLES[skill.source]` on line 32.

**Step 4: Update SkillDetail.tsx**

Remove lines 6-11. Add import:
```typescript
import { SOURCE_LABELS_LONG } from "@/lib/constants";
```
Replace `SOURCE_LABELS[skill.source]` with `SOURCE_LABELS_LONG[skill.source]` on line 45.

**Step 5: Update pipeline/page.tsx**

Remove lines 7-19. Add import:
```typescript
import { SOURCE_BADGE_STYLES, SOURCE_LABELS } from "@/lib/constants";
```
Replace `SOURCE_COLORS[key]` with `SOURCE_BADGE_STYLES[key]` on lines 57, 83.

**Step 6: Verify build**

Run: `cd frontend && npm run build`
Expected: Build succeeds

---

### Task 4: Add fetch response status checks (Important #5)

**Files:**
- Modify: `frontend/app/pipeline/page.tsx`
- Modify: `frontend/app/catalog/page.tsx`
- Modify: `frontend/app/settings/page.tsx`

**Step 1: Fix pipeline/page.tsx fetch (line 28-29)**

```typescript
fetch("/api/pipeline")
  .then((r) => {
    if (!r.ok) throw new Error("Server error");
    return r.json();
  })
```

**Step 2: Fix catalog/page.tsx fetch (line 36-37)**

```typescript
fetch("/api/skills")
  .then((r) => {
    if (!r.ok) throw new Error("Server error");
    return r.json();
  })
```

**Step 3: Fix settings/page.tsx fetch (line 37-38)**

```typescript
fetch("/api/settings")
  .then((r) => {
    if (!r.ok) throw new Error("Server error");
    return r.json();
  })
```

Settings page also needs error state. Add `const [error, setError] = useState<string | null>(null);` and a `.catch(() => setError("Nepodařilo se načíst nastavení"))` and error rendering before the loading check.

**Step 4: Verify build**

Run: `cd frontend && npm run build`

---

### Task 5: Modal accessibility (Important #6)

**Files:**
- Modify: `frontend/components/SkillDetail.tsx`

**Step 1: Add dialog attributes, Escape handler, backdrop click**

On the outer overlay div (line 33), add `onClick={onClose}`:
```tsx
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
  onClick={onClose}
>
```

On the inner dialog div (line 34), add role and stop propagation:
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-label={skill.name.cs}
  className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-6"
  onClick={(e) => e.stopPropagation()}
>
```

**Step 2: Add Escape key handler**

Add `useEffect` for keyboard:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [onClose]);
```

**Step 3: Fix close button accessibility (line 50-54)**

```tsx
<button
  onClick={onClose}
  aria-label="Zavřít"
  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
>
  ✕
</button>
```

**Step 4: Verify build**

Run: `cd frontend && npm run build`

---

### Task 6: Log errors in API catch blocks (Important #7)

**Files:**
- Modify: `frontend/app/api/pipeline/route.ts`
- Modify: `frontend/app/api/settings/route.ts`
- Modify: `frontend/app/api/skills/route.ts`

**Step 1: Add console.error in each catch block**

pipeline/route.ts line 15:
```typescript
} catch (error) {
    console.error("Failed to load pipeline data:", error);
```

settings/route.ts line 46:
```typescript
} catch (error) {
    console.error("Failed to load settings:", error);
```

skills/route.ts line 25:
```typescript
} catch (error) {
    console.error("Failed to load skills:", error);
```

---

### Task 7: Fix Czech diacritics (Minor #8)

**Files:**
- Modify: `frontend/app/pipeline/page.tsx` — CZ text in JSX
- Modify: `frontend/app/catalog/page.tsx` — CZ text in JSX + PHASE_LABELS + SOURCE_OPTIONS
- Modify: `frontend/app/settings/page.tsx` — CZ text in JSX
- Modify: `frontend/components/SkillCard.tsx` — "Kdy pouzit" label
- Modify: `frontend/components/SkillEditor.tsx` — button labels
- Modify: `frontend/components/PipelineFlow.tsx` — "Iterativni smycka"

Apply diacritics to all hardcoded Czech strings. Key replacements:

- "Nacitani" → "Načítání"
- "Nepodarilo se nacist" → "Nepodařilo se načíst"
- "Vlastni" → "Vlastní"
- "Adoptovany" / "Adoptovane" → "Adoptovaný" / "Adoptované"
- "Rozsireny" / "Rozsirene" → "Rozšířený" / "Rozšířené"
- "Kdy pouzit" → "Kdy použít"
- "Vsechny" → "Všechny"
- "Zadne shody" → "Žádné shody"
- "Zobrazeno" → "Zobrazeno" (OK)
- "Iterativni smycka" → "Iterativní smyčka"
- "Zacatek relace" → "Začátek relace"
- "Planovani" → "Plánování"
- "Kvalita" → "Kvalita" (OK)
- "Integrace" → "Integrace" (OK)
- "Ulozit" → "Uložit"
- "Ukladam" → "Ukládám"
- "Neulozene zmeny" → "Neuložené změny"
- "Ulozeno" → "Uloženo"
- "Zpet" → "Zpět"
- "Zavrit" → "Zavřít"
- "Popis" → "Popis" (OK)
- "Detailni popis" → "Detailní popis"
- "Faze pipeline" → "Fáze pipeline"
- "Stitky" → "Štítky"
- "SKILL.md obsah" → "SKILL.md obsah" (OK)
- "Upravit v editoru" → "Upravit v editoru" (OK)
- "Soubor SKILL.md zatim neexistuje" → "Soubor SKILL.md zatím neexistuje"
- "Hledat skill" → "Hledat skill" (OK)
- "Vsechny faze" → "Všechny fáze"
- "Vsechny zdroje" → "Všechny zdroje"
- "Stav symlinku" → "Stav symlinků"
- "Nastaveni" → "Nastavení"
- "Propojeno" → "Propojeno" (OK)
- "Chybi symlink" → "Chybí symlink"
- "Konflikt — jiny cil" → "Konflikt — jiný cíl"
- "Nektere symlinky chybi" → "Některé symlinky chybí"
- "Uzitecne prikazy" → "Užitečné příkazy"
- "Nacitani editoru" → "Načítání editoru"
- "skillu v pipeline" → "skillů v pipeline"
- "zadane filtry" → "zadané filtry"

---

### Task 8: Clean up Navigation dead code (Minor #9)

**Files:**
- Modify: `frontend/components/Navigation.tsx`

**Step 1: Remove redundant `label` field, rename `labelCs` to `label`**

```typescript
const tabs = [
  { href: "/pipeline", label: "Pipeline" },
  { href: "/catalog", label: "Katalog skillů" },
  { href: "/settings", label: "Nastavení" },
];
```

And change `{tab.labelCs}` to `{tab.label}` on line 33.

---

### Task 9: Add catalog loading state (Minor #10)

**Files:**
- Modify: `frontend/app/catalog/page.tsx`

**Step 1: Add loading state**

Add `const [loading, setLoading] = useState(true);` and `.finally(() => setLoading(false))` to the fetch chain.

After the error check, add:
```typescript
if (loading) return <div className="text-zinc-400 p-8">Načítání...</div>;
```

---

### Task 10: Unsaved changes warning in SkillEditor (Minor #11)

**Files:**
- Modify: `frontend/components/SkillEditor.tsx`

**Step 1: Add confirm dialog on close with unsaved changes**

Replace the "Zpět" button onClick (line 84):

```tsx
<button
  onClick={() => {
    if (hasChanges && !confirm("Máte neuložené změny. Opravdu zavřít?")) return;
    onClose();
  }}
  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
>
  Zpět
</button>
```

---

### Task 11: Fix install script trailing slash (Minor #12)

**Files:**
- Modify: `scripts/install.sh`

**Step 1: Strip trailing slash on line 30**

Change:
```bash
ln -s "$skill_dir" "$target"
```
To:
```bash
ln -s "${skill_dir%/}" "$target"
```

---

### Task 12: Build verification + commit

**Step 1: Run full build**

Run: `cd frontend && npm run build`
Expected: Build succeeds with no errors

**Step 2: Commit all changes**

```bash
git add -A
git commit -m "fix: address all code review findings

- Security: path traversal protection + input validation on PUT
- Fix fragile paths.ts (use __dirname instead of process.cwd)
- Extract shared SOURCE_COLORS/LABELS to lib/constants.ts
- Add fetch response status checks on client pages
- Modal accessibility (role=dialog, Escape, backdrop click, aria-label)
- Log errors in API catch blocks
- Fix Czech diacritics across all components
- Clean up Navigation dead code
- Add catalog loading state
- Unsaved changes warning in SkillEditor
- Fix install.sh trailing slash in symlink"
```

**Step 3: Verify clean state**

Run: `git status`
Expected: Clean working tree
