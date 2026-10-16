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
