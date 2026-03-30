# COST-GOVERNANCE.md
# OpenClaw Operational Cost Rules — v1.0
# Authority: Mohammed Al Hatem | Galaxy Institutional Trading System
# Created: 2026-03-30
# Override priority: HIGHEST — these rules supersede all other operational defaults

---

## 1. MODEL ROUTING

| Call Type | Model | Condition |
|---|---|---|
| Heartbeat / health check | `claude-haiku-4-5-20251001` | Always |
| Memory read / write | `claude-haiku-4-5-20251001` | Always |
| Status check | `claude-haiku-4-5-20251001` | Always |
| Tool routing decision | `claude-haiku-4-5-20251001` | Always |
| Simple data fetch | `claude-haiku-4-5-20251001` | Always |
| Prompt A — macro gate | `claude-sonnet-4-6` | Active session only |
| Prompt B — execution engine | `claude-sonnet-4-6` | Only if Prompt A = TRADE ALLOWED |
| Signal generation | `claude-sonnet-4-6` | Active session only |
| Multi-step reasoning | `claude-sonnet-4-6` | Active session only |
| Any Opus call | `claude-opus-4-6` | EXPLICIT USER COMMAND ONLY — never autonomous |

**Default fallback: if call type is ambiguous → route to Haiku.**

---

## 2. CONTEXT INJECTION

### Heartbeat calls
- Load: `HEARTBEAT.md` only
- Skip: SOUL.md, AGENTS.md, USER.md, IDENTITY.md
- Max system prompt: 500 tokens

### Routine data fetch calls
- Load: task prompt only — no identity files
- Max system prompt: 500 tokens

### Analysis calls (Prompt A / Prompt B / signal gen)
- Load: `SOUL.md` + task context
- Skip: AGENTS.md, USER.md, IDENTITY.md unless explicitly required by task
- Max system prompt: 6,000 tokens

### Full context (user-initiated session only)
- Load: all five core files — SOUL.md, AGENTS.md, USER.md, IDENTITY.md, HEARTBEAT.md
- Triggered by: explicit user message starting a session
- Max system prompt: 8,000 tokens

---

## 3. LOOP THROTTLING

- Minimum autonomous poll interval: **10 minutes**
- If Prompt A gate returns NO TRADE SETUP → skip Prompt B entirely, no API call
- Macro regime result cache TTL: **4 hours** — do not re-run Prompt A within same window
- If three consecutive Prompt A calls return NO TRADE SETUP → extend poll interval to 30 minutes automatically
- No autonomous calls between 00:00–05:00 Dubai time (UTC+4) unless user has active open position

---

## 4. TOKEN DISCIPLINE

| Call Type | Max System Prompt | Memory Context |
|---|---|---|
| Routine / heartbeat | 2,000 tokens | Last 1 exchange only |
| Data fetch | 500 tokens | None |
| Analysis | 6,000 tokens | Last 3 exchanges |
| Full session | 8,000 tokens | Last 5 exchanges |

- Truncate all memory injections to the limits above — never inject full conversation history
- Strip whitespace, comments, and markdown decorators from injected files before token counting
- If system prompt exceeds limit → truncate injected memory first, then task context, never core identity

---

## 5. ONYX ELITE SUB-AGENT RULES

- ONYX runs on Haiku for all monitoring and scanning tasks
- ONYX escalates to Sonnet only when: confidence score ≥ 80 AND liquidity regime = EM3+
- ONYX never loads full identity stack — SOUL.md only, max 3,000 tokens
- ONYX result cache TTL: 2 hours for screener outputs, 30 minutes for sentiment outputs

---

## 6. AUDIT

- Log model used + token count for every API call to `/data/.openclaw/workspace/cost_log.jsonl`
- Weekly cost summary auto-generated every Monday 08:00 Dubai time
- Alert via Telegram if daily API spend exceeds $5.00

---

## ENFORCEMENT NOTE

These rules are operational constraints, not suggestions. Any autonomous loop, scheduled task, or sub-agent call that violates model routing or context injection rules is considered a misconfiguration and must be corrected before the next cycle. Mohammed reviews this file on a monthly basis or after any major architecture change.

---

**Version:** 1.0 (Authoritative)  
**Authority:** Mohammed Al Hatem  
**Override Priority:** HIGHEST  
**Last Updated:** 2026-03-31 03:03 GMT+8  
**Status:** Active & Enforced
