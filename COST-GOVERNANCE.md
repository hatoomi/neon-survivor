# COST-GOVERNANCE.md — OpenClaw Cost Control v1.0
**Created:** 2026-03-31  
**Last Updated:** 2026-03-31

---

## MANDATORY COST GOVERNANCE RULES

### Model Routing (Strict)

**Haiku (claude-haiku-4-5-20251001):**
- ALL routine tasks
- Memory reads
- Status checks
- Heartbeat executions
- Tool routing decisions
- Simple data fetches

**Sonnet (claude-sonnet-4-6):**
- Analysis tasks
- Signal generation
- Multi-step reasoning
- ONYX ELITE commands

**Opus:**
- NEVER use autonomously
- Only on explicit user command

---

## Context Injection (Strict)

**Heartbeat / Health Check Calls:**
- Load HEARTBEAT.md ONLY
- No other identity files

**Routine Data Fetch Calls:**
- No identity files at all
- Task prompt only

**Analysis Calls:**
- SOUL.md + task context only
- Skip AGENTS/USER/IDENTITY unless needed

**Full System Context:**
- Only when user explicitly initiates a session

---

## Loop Throttling

**Polling Intervals:**
- Minimum 10 min interval between autonomous polling cycles

**Trade Setup Gating:**
- If no active trade setup detected in Prompt A gate → skip Prompt B entirely
- Do not call API unnecessarily

**Macro Regime Caching:**
- Cache macro regime result for 4 hours
- Do not re-run Prompt A within same session window

---

## Token Discipline

**System Prompt Limits:**
- Routine calls: 2,000 token max
- Analysis calls: 6,000 token max

**Memory Context:**
- Truncate to last 3 exchanges for routine calls

---

## Implementation Notes

- These rules override previous behavior to reduce API costs
- Hatoomi agent must enforce these rules automatically
- ONYX ELITE sub-agent inherits these constraints
- Any deviation requires explicit user approval

---

**Version:** 1.0  
**Status:** Active  
**Enforcement:** Mandatory
