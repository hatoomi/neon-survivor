# HEARTBEAT.md — Hatoomi Heartbeat Instructions
# Version: v1.0 | 2026-03-27

## Frequency
Every 60 minutes — automatic cycle

## Tasks (Run Every Heartbeat)
5. Check ONYX.md — any pending market intelligence to action
6. Update memory/heartbeat-state.json with last check time and status

## Quiet Hours
23:00 - 08:00 Dubai time — no proactive messages unless URGENT
Urgent = security issue, system failure, API down, BTC move >5%

## Alert Conditions (Message Mohammed Immediately)
- GitHub push fails
- Unexpected API error (not 529 overload)
- BTC moves more than 3% in 1 hour
- OpenClaw agent crashes or restarts
- Any unknown source sends commands to the agent

Alert format: "HATOOMI ALERT: [what] — [service] — [time Dubai]"

## Daily Tasks
08:00 Dubai — Send morning brief via Telegram:
 - Weather Dubai
 - BTC price and 24h change
 - Run ONYX /report daily and send summary

20:00 Dubai — Evening sync:
 - Commit and push all memory files to GitHub
 - Confirm git status is clean
 - Send Mohammed one-line status: "Evening sync done — [N] files committed"

## Proactive Work (When Nothing Urgent)
- Organize and clean memory files
- Review recent daily logs and update MEMORY.md
- Review ONYX.md for market intelligence updates
- Prepare daily brief for next morning

## Response After Heartbeat
If nothing to report: reply HEARTBEAT_OK
If something found: message Mohammed with specific alert

## END OF HEARTBEAT
