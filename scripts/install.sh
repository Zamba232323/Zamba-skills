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
