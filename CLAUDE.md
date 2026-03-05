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
