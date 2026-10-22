# Regenerate docs/skills-catalog.md: python3 scripts/build-skills-catalog.py . docs/skills-catalog.md
import os, re, sys, yaml
root = sys.argv[1]; out = sys.argv[2]
S = os.path.join(root, ".claude/skills")
GRC = "ccpa cis-controls cmmc csrd cyber-essentials dora dpdpa ear eu-ai-act eu-cra fedramp gdpr-compliance hipaa-compliance-grc ism iso27001 iso27701 iso42001 itar lgpd nis2 nist-800-53 nist-ai-rmf nist-csf nzism pci-compliance saudi-arabia-grc section-508 soc2 sox-itgc swift-csp tisax tprm tsa-compliance uae-grc vn-pdpl wcag".split()
RES = "citation-formatter data-analysis ethics-committee grant-writer literature-review manuscript-drafter methodology-advisor peer-review qualitative-coding replication-designer research-brainstorm reviewer-response survey-design talk-builder vault last30days".split()
DATA = "creating-dbt-models debugging-dbt-errors developing-incremental-models documenting-dbt-models migrating-sql-to-dbt refactoring-dbt-models testing-dbt-models finding-expensive-queries optimizing-query-by-id optimizing-query-text snowflake-dbt-model-refactoring optimizing-databricks-sql altimate-code".split()
OBS = "obsidian-bases obsidian-cli obsidian-markdown json-canvas defuddle knap".split()
GROUPS = [
 ("GRC & compliance frameworks", lambda n: n in GRC),
 ("Research & academic writing", lambda n: n in RES),
 ("LinkedIn & email (your voice)", lambda n: n.startswith("li-") or n == "email-reply"),
 ("Data engineering (dbt, Snowflake, Databricks)", lambda n: n in DATA),
 ("Obsidian & notes", lambda n: n in OBS),
 ("Marketing psychology", lambda n: n == "marketing-psychology"),
 ("Diagrams (anatomy)", lambda n: n == "anatomy"),
 ("OmniRoute AI gateway (needs an OmniRoute server)", lambda n: n.startswith("omni-") or n.startswith("cli-") or n == "config-codex-cli"),
 ("ECC — engineering, agents, business & operations", lambda n: True),
]
def desc(n):
    t = open(os.path.join(S, n, "SKILL.md"), encoding="utf-8").read()
    m = re.match(r"^---\s*\n(.*?)\n---", t, re.S)
    d = ""
    if m:
        try: d = (yaml.safe_load(m.group(1)) or {}).get("description", "") or ""
        except Exception: d = ""
    d = " ".join(str(d).split())
    if not d:  # fall back to first prose line
        body = t[m.end():] if m else t
        d = next((l.strip() for l in body.splitlines() if l.strip() and not l.startswith("#")), "")
    parts = re.split(r"(?<=[.!?])\s", d, maxsplit=1)
    s = parts[1].split(". ")[0] + "." if parts[0].startswith("External agent skill") and len(parts) > 1 else parts[0]
    return (s[:237] + "…") if len(s) > 240 else s
names = sorted(d for d in os.listdir(S) if os.path.isfile(os.path.join(S, d, "SKILL.md")))
buckets = {g: [] for g, _ in GROUPS}
for n in names:
    for g, f in GROUPS:
        if f(n): buckets[g].append(n); break
L = ["# Samuel Ubanatu — Skills Catalog", "",
 f"Reference list of the {len(names)} skills installed in github.com/Samub01/Samuel-Ubanatu (generated 2026-10-21).", "",
 "## How to use this in Claude chat", "",
 "- These skills run natively in Claude Code (and Cowork, via the samuel-* plugins). In chat, this file tells Claude what methods and playbooks exist.",
 "- Ask by name or topic, e.g. *\"Use the approach of the `iso42001` skill to gap-assess our AI management system\"* or *\"Which of my skills fits a DPIA?\"*",
 "- Claude in chat sees only the one-line summaries below, not each skill's full instructions. For full fidelity, upload the specific skill (Customize → Skills) or use Claude Code / Cowork.",
 "- Skills marked *(CLI)* rely on command-line tools or network access and won't run in chat.", "",
 "## Contents", ""]
for g, _ in GROUPS:
    if buckets[g]: L.append(f"- {g} ({len(buckets[g])})")
CLI = set("anatomy last30days altimate-code obsidian-cli defuddle knap li-human".split())
for g, _ in GROUPS:
    if not buckets[g]: continue
    L += ["", f"## {g} ({len(buckets[g])})", ""]
    for n in buckets[g]:
        tag = " *(CLI)*" if n in CLI or g.startswith("OmniRoute") else ""
        L.append(f"- **{n}**{tag} — {desc(n)}")
L += ["", "## Also on your account (claude.ai plugins)", "",
 "Installed account-wide, so they work in chat, Cowork and Claude Code without this file: Claude for Legal plugins you enabled (e.g. ai-governance-legal), plus any of Superpowers, caveman, claude-code-setup and claude-security you installed from the plugin card."]
open(out, "w", encoding="utf-8").write("\n".join(L) + "\n")
print(len(names), {g: len(v) for g, v in buckets.items()})
