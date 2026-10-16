#!/usr/bin/env bash
# Rebuild plugins/samuel-skills/skills from .claude/skills.
# Run after adding, removing or editing a skill in .claude/skills, then commit.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/plugins/samuel-skills/skills"
STAGE="$(mktemp -d)"
cp -R "$ROOT/.claude/skills/." "$STAGE/"
mkdir -p "$(dirname "$DEST")"
if [ -d "$DEST" ]; then mv "$DEST" "$STAGE.old"; fi
mv "$STAGE" "$DEST"
echo "Synced $(ls "$DEST" | wc -l | tr -d ' ') skills into plugins/samuel-skills/skills"
