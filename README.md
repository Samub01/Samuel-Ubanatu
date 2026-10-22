# Samuel-Ubanatu
All about data and AI ETHICS

## Skills plugin

All skills in `.claude/skills` are also packaged as one plugin, `samuel-skills`,
so they can be installed in other projects and other Claude surfaces.

Install in Claude Code:

```
/plugin install samuel-skills --marketplace Samub01/Samuel-Ubanatu
```

Or in two steps:

```
/plugin marketplace add Samub01/Samuel-Ubanatu
/plugin install samuel-skills@samuel-ubanatu
```

After adding, removing or editing a skill in `.claude/skills`, run
`scripts/build-skills-plugin.sh` and commit the result.

### Focused plugins

Smaller plugins for Cowork and day-to-day use, built by
`scripts/build-focused-plugins.sh`:

| Plugin | Skills |
|---|---|
| `samuel-grc` | Governance, risk and compliance frameworks (36) |
| `samuel-research` | Academic research, scientific writing and statistics (67) |
| `samuel-linkedin` | LinkedIn and email writing in Samuel's voice (12) |
| `samuel-data-engineering` | dbt, Snowflake, Databricks and SQL databases (17) |

Install any of them the same way, e.g.
`/plugin install samuel-grc --marketplace Samub01/Samuel-Ubanatu`.
