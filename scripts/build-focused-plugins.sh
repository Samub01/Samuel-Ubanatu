#!/usr/bin/env bash
# Build the four focused plugins (GRC, research, LinkedIn, data engineering)
# from .claude/skills. Run after changing any of those skills, then commit.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/.claude/skills"

GRC="ccpa cis-controls cmmc csrd cyber-essentials dora dpdpa ear eu-ai-act eu-cra fedramp gdpr-compliance hipaa-compliance-grc ism iso27001 iso27701 iso42001 itar lgpd nis2 nist-800-53 nist-ai-rmf nist-csf nzism pci-compliance saudi-arabia-grc section-508 soc2 sox-itgc swift-csp tisax tprm tsa-compliance uae-grc vn-pdpl wcag"
RESEARCH="citation-formatter data-analysis ethics-committee grant-writer literature-review manuscript-drafter methodology-advisor peer-review qualitative-coding replication-designer research-brainstorm reviewer-response survey-design talk-builder vault deep-research market-research scientific-thinking-literature-review scientific-thinking-scholar-evaluation scientific-db-pubmed-database last30days"
LINKEDIN="li-audit li-carousel li-comment li-dm li-human li-inbox li-plan li-post li-profile li-reply li-repurpose email-reply"
DATA="creating-dbt-models debugging-dbt-errors developing-incremental-models documenting-dbt-models migrating-sql-to-dbt refactoring-dbt-models testing-dbt-models finding-expensive-queries optimizing-query-by-id optimizing-query-text snowflake-dbt-model-refactoring optimizing-databricks-sql altimate-code postgres-patterns mysql-patterns clickhouse-io database-migrations"

build() { # name, description, skill list
  local name="$1" desc="$2" skills="$3" dir="$ROOT/plugins/$1"
  local stage; stage="$(mktemp -d)"
  mkdir -p "$stage/.claude-plugin" "$stage/skills"
  for s in $skills; do
    [ -d "$SRC/$s" ] || { echo "missing skill: $s" >&2; exit 1; }
    cp -R "$SRC/$s" "$stage/skills/"
  done
  printf '{\n  "name": "%s",\n  "version": "1.0.0",\n  "description": "%s",\n  "author": { "name": "Samuel Ubanatu" },\n  "repository": "https://github.com/Samub01/Samuel-Ubanatu"\n}\n' "$name" "$desc" > "$stage/.claude-plugin/plugin.json"
  if [ -d "$dir" ]; then mv "$dir" "$stage.old"; fi
  mkdir -p "$ROOT/plugins" && mv "$stage" "$dir"
  echo "$name: $(ls "$dir/skills" | wc -l | tr -d ' ') skills"
}

build samuel-grc "Governance, risk and compliance advisors: GDPR, ISO 27001/27701/42001, NIST CSF/800-53/AI RMF, EU AI Act, SOC 2, DORA, NIS2, HIPAA, PCI DSS and more." "$GRC"
build samuel-research "Academic and market research: literature reviews, methodology, ethics review, grant writing, manuscript drafting, peer review, citations and recent-discussion research." "$RESEARCH"
build samuel-linkedin "LinkedIn posts, comments, replies, DMs, profile scoring and planning in Samuel's voice, plus email replies." "$LINKEDIN"
build samuel-data-engineering "dbt, Snowflake, Databricks, Postgres, MySQL and ClickHouse skills for building, testing, debugging and optimising data pipelines." "$DATA"

# LinkedIn: ship the voice profile inside the plugin, and keep plan/log in the user's working folder
LI="$ROOT/plugins/samuel-linkedin/skills"
for s in li-post li-plan; do
  mkdir -p "$LI/$s/references" && cp "$ROOT/.claude/linkedin/voice.md" "$LI/$s/references/voice.md"
done
sed -i 's#`\.claude/linkedin/voice\.md`#`references/voice.md` (in this skill folder)#g' "$LI/li-post/SKILL.md" "$LI/li-plan/SKILL.md"
sed -i 's#`\.claude/linkedin/\(log\|plan\)\.md`#`linkedin/\1.md` in the current working folder#g' "$LI"/li-*/SKILL.md

# email-reply: ship the context files inside the skill
ER="$LI/email-reply"
mkdir -p "$ER/references" && cp "$ROOT"/.claude/context/*.md "$ER/references/"
sed -i 's#\.claude/context/#references/#g' "$ER/SKILL.md"
