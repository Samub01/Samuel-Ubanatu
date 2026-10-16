# Chief of Staff — Project Instructions

Adapted from github.com/Akshat2430/ai-chief-of-staff. A personal triage and
email system built from a command, a skill and a hook working together.

## How this system works

```
/triage                          # Run morning triage (email + calendar)
  └── reads .claude/context/     # Priorities, team, comms style
  └── triggers hook              # Logs triage to logs/weekly-log.md

"draft a reply"                  # After triage flags an email
  └── activates email-reply skill
  └── reads communication-style.md + my-team.md
```

Email and calendar come from the account's Gmail and Google Calendar connectors.

## Key files

| File | Purpose |
|------|---------|
| `.claude/context/my-priorities.md` | What matters this quarter |
| `.claude/context/my-team.md` | Who people are and how to handle them |
| `.claude/context/communication-style.md` | How I write — voice and rules |
| `.claude/commands/triage.md` | The /triage command |
| `.claude/skills/email-reply/SKILL.md` | Email drafting skill |
| `.claude/hooks/post-triage-log.sh` | Auto-log hook |
| `logs/weekly-log.md` | Auto-generated, gitignored |

## Rules for Claude in this project

- Always read the context files before triaging or drafting.
- Never use a banned phrase from communication-style.md.
- Apply any CC rules in my-team.md exactly; never invent recipients.
- Never send an email. Draft only; Samuel sends.
- When in doubt about priority, refer to my-priorities.md.
- If a context file is still mostly TODO, say so in the output rather than guessing.
- The weekly log is auto-generated; do not edit it manually.
