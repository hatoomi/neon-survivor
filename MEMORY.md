# MEMORY.md — Long-Term Curated Memory
**Last Updated:** 2026-03-27

---

## 🧬 IDENTITY & MISSION

**Name:** Hatoomi 👑  
**Role:** Market Oracle / Digital Strategist  
**Mission:** Help Mohammed Al Hatem dominate BTC markets and navigate global liquidity flows  
**Operating Principles:**
- No fluff — sharp, actionable insights only
- Crypto-native expertise (DeFi, BTC cycles, macro/micro correlations)
- Proactive research — dig deep without being asked
- Respect capital — careful with recommendations, flag risks clearly
- Own mistakes — no false confidence, admit uncertainty

**Boundaries:**
- Private keys stay private (never logged or shared)
- No trades without explicit confirmation
- Ask before external actions (emails, posts, public messages)

---

## 🎯 MOHAMMED'S PROFILE

**Name:** Mohammed Al Hatem  
**Location:** Dubai, UAE (GMT+4)  
**Focus:** BTC dominance, DeFi strategies, liquidity cycles, precision trading  
**Timezone:** Asia/Dubai  
**Expectation:** Sharp analysis, no fluff, actionable insights, probability-based thinking

---

## 🔧 TOOLS & INFRASTRUCTURE

### Channels Configured
- **Telegram:** Active (bot token configured, DM + group allowlist mode)
- **WhatsApp:** Configured but not linked (awaiting QR scan)
- **Discord:** Config present but no token (setup pending)
- **Google Chat, Slack, Nostr:** Enabled but not configured

### Security Posture (as of 2026-03-27)
- ✅ Disabled dangerous Control UI flags (device auth, host-header fallback, insecure auth)
- ⚠️ Containerized environment (no systemd, local gateway only)
- ✅ Exec approvals active (elevated commands require explicit approval)

### BTC DATA AGENT
**Location:** `/data/.openclaw/workspace/docs/BTC_DATA_AGENT.md`  
**Purpose:** Automated BTC metrics collection (OI, funding, liquidations, ETF flows, on-chain, L/S ratios)  
**Status:** v1.0 operational (2026-03-20)  
**Output:** `data/btc_latest.json` + `data/btc_latest.txt`  
**Sources:** Coinglass API, Binance public APIs, CoinGecko  
**Rule:** Never use "available on request" — concrete values or "UNAVAILABLE — reason"

**Key Metrics Collected:**
- Price, 24h high/low, volume (Binance)
- Open Interest (aggregated, 1h close + 24h delta)
- Funding Rate (OI-weighted, latest)
- Liquidations (24h shorts + longs)
- Long/Short Ratios (global, top accounts, top positions, 4h trend)
- ETF Flows (latest, top 3 breakdown: IBIT/GBTC/FBTC)
- On-Chain Balances (Binance/Coinbase 24h deltas)
- Options Max Pain (Deribit)
- Fear & Greed Index

**Outstanding:** RSI (compute from Binance klines), Pi Cycle/Rainbow (timeouts), Taker Buy/Sell (empty datasets), Deribit options totals aggregation

---

## 📈 TRADING & ANALYSIS FRAMEWORKS

### BTC Macro Cycle Framework
**Created:** 2026-03-06  
**Purpose:** Multi-layer BTC macro analysis framework  

**ELG (Enhanced Liquidity Gauge):**
```
ELG = 0.40 × (-Z(SOFR - Fed Funds)) + 0.30 × (-Z(ΔTGA)) + 0.30 × (-Z(ΔRRP))
```
- **Rising ELG** = liquidity improving = bullish
- **Falling ELG** = liquidity tightening = bearish
- **Scale:** 0-100 (60+ = expansion, 40-60 = recovery, <40 = contraction)

**Market Regimes:**
1. Accumulation
2. Early Bull
3. Bull Momentum
4. Late Cycle Euphoria
5. Distribution
6. Bear Contraction
7. High Volatility Transition

**Last ELG Calculation (2026-03-06):**
- ELG: 58/100 (EM4 Recovery)
- Regime: Early Bull

---

### SUPER MASTER PROMPT — BTC/USDT Execution Framework
**Created:** 2026-03-07  
**Purpose:** Comprehensive spot + futures analysis for intraday execution  

**Layers:**
1. **Market Structure** (HTF/MTF/LTF — trend, BOS, demand/supply zones)
2. **VWAP & Volume Profile** (anchored VWAP, POC, VAH/VAL)
3. **Order Flow & Liquidity** (delta, CVD, imbalances, stop clusters)
4. **Derivatives** (funding, OI, liquidations, options skew)
5. **On-Chain** (whale flows, exchange inflows/outflows)
6. **Macro Context** (ELG, Fed policy, equity correlation)
7. **Execution Playbook** (entry, SL, TP, risk sizing)

**Key Concepts:**
- **BOS (Break of Structure):** Price breaking key swing high/low
- **MS (Market Shift):** Trend change confirmation
- **OB (Order Block):** Institutional accumulation/distribution zone
- **FVG (Fair Value Gap):** Imbalance zone (retest target)
- **Strong vs Weak Levels:** Demand/supply zones with conviction vs. minor support/resistance

**Last Run (2026-03-07):**
- Price: $67,943
- Structure: Weekly bullish (HH/HL), Daily bearish (LH/LL), 4H bear flag
- Funding: Negative (shorts paying longs)
- Fear & Greed: 12 (Extreme Fear)
- Max Pain: $85K (June expiry)
- Bias: Oversold, seeking bounce to $68.2K-$69K before next leg

---

### ALTFINS SYSTEM — Altcoin Scanning Prompts
**Location:** `/data/.openclaw/workspace/agents/altfins-system/`  
**Purpose:** Systematic altcoin opportunity discovery  

**Prompts:**
1. Bullish Momentum Continuation
2. Oversold Reversal Hunter
3. Golden Cross Breakout
4. ATH Breakout
5. Sector Rotation Scanner
6. Swing Channel Trader
7. Event Catalyst Trader
8. Full A+ Confluence Scanner

**Status:** Framework defined, not yet operational (no live data feeds wired)

---

## 🧠 ONYX ELITE — Crypto Intelligence Terminal
**Created:** 2026-03-27  
**Location:** `/data/.openclaw/FOUNDATION.md`  
**Purpose:** Institutional crypto intelligence terminal (research, analytics, intelligence ONLY)  

**Core Beliefs:**
1. Liquidity drives everything
2. Leverage kills trends
3. On-chain does not lie
4. Macro context is non-negotiable
5. Signal over noise
6. Probability not prediction
7. Risk first
8. Facts over narrative (3-source minimum)

**Analysis Layers:**
A. Macro Liquidity (Fed balance sheet, TGA, RRP, SOFR, ELG gauge)  
B. Crypto Liquidity (stablecoins, ETF flows, exchange balances)  
C. Derivatives (OI, funding, liquidations, options skew)  
D. On-Chain (addresses, whale flows, exchange inflows/outflows)  
E. Technical (structure, S/R, RSI, MACD, volume profile, VWAP)  
F. Fundamentals (tokenomics, GitHub, revenue, TVL, governance)  
G. Narrative (sector rotation, attention flow, narrative strength)

**Scoring Engine (0-100):**
1. Liquidity Score
2. Leverage Score (inverse)
3. On-Chain Strength
4. Technical Trend
5. Fundamental Strength
6. Narrative Strength
7. Smart Money Score
8. Risk Score (inverse)
9. Composite Market Score

**Commands:**
- `/market` — full market scan
- `/dashboard` — all 9 scores
- `/btc` — bitcoin analysis
- `/eth` — ethereum analysis
- `/alts` — altcoin scan
- `/macro` — macro liquidity read
- `/elg` — ELG gauge
- `/derivatives BTC` — leverage and liquidations
- `/onchain BTC` — on-chain intelligence
- `/technical BTCUSDT 4H` — chart analysis
- `/fundamental [token]` — deep dive research
- `/stablecoins` — stablecoin liquidity
- `/etf` — ETF flows
- `/whales` — whale tracking
- `/discover` — token discovery
- `/liquidations` — cascade risk
- `/report daily` — morning brief
- `/report weekly` — weekly strategy note
- `/build [tool]` — data engineering

**Rules:**
- Never hype. Data first. Signal over noise.
- Always give Bull / Base / Bear scenarios
- Always state uncertainty when data is missing
- TL;DR first on every output
- Risk flags in CAPS

**Status:** Framework active, data pipelines pending (stablecoins, ETF flows, on-chain)

**First Dashboard Run (2026-03-29):**
- Composite Score: 42/100 (neutral-bearish with bullish divergences)
- Market Regime: High Volatility Transition (Distribution → Bear Contraction pivot point)
- Key Tension: Weekly bullish (HH/HL) vs daily bearish (LH/LL)
- Extreme Fear (9/100) at $66K support = potential capitulation zone
- Action Bias: WAIT for daily CHoCH or strong $65K-$66K defense

**MODULE 10 — Signal Engine (Added 2026-03-29):**
- Optional post-report execution layer
- Converts ONYX bias into trade-ready setup ONLY after liquidation heatmap screenshots provided
- Two-stage system: ONYX report → heatmap screenshots → Signal Engine analysis → trade setup (if valid)
- Allowed verdicts: LONG SETUP VALID / SHORT SETUP VALID / WAIT FOR SWEEP THEN CONFIRM / NO TRADE
- Operating rule: No heatmap = no final trade setup
- New commands: /signal, /execute, /heatmap
- Status: v1.1 active, Signal Engine inactive until screenshots provided

---

## 🔑 KEY LEARNINGS & PATTERNS

### Trading Discipline
- **Probability not prediction:** Never say "price will go to X" — always Bull/Base/Bear scenarios
- **Risk first:** Protect capital before growing it
- **Leverage kills trends:** Low leverage moves are durable
- **Facts over narrative:** Cross-reference 3 sources minimum before acting

### BTC Market Structure (Historical Observations)
- **Weekly HH/HL intact:** Bullish macro trend since 2023
- **Daily LH/LL patterns:** Bearish intraday corrections within bull trend
- **Strong support zones:** $65K-$65.5K (demand), $66K-$66.5K (swing low)
- **Strong resistance zones:** $70K-$72K (prior consolidation), $75K (ATH breakout level)
- **Fear & Greed extremes:** <20 = oversold bounce candidates, >80 = euphoria distribution risk

### Macro Liquidity Context (2026-03-06 baseline)
- **Fed Policy:** 4.25-4.50% (no hikes expected, neutral stance)
- **RRP Drain:** ~$300B remaining (liquidity additive as it drains)
- **TGA:** Stable-to-declining (debt ceiling resolved, spending ongoing)
- **ELG Trend:** Rising (supportive for risk assets)
- **Equity Correlation:** BTC following SPX/NDQ (risk-on trades together)

### Derivatives Intelligence
- **Negative funding:** Shorts paying longs = bullish sentiment, contrarian buy signal if structure holds
- **Positive funding:** Longs paying shorts = overleveraged, cascade risk if support breaks
- **OI rising + price rising:** New long positions opening (bullish if healthy, risky if parabolic)
- **OI falling + price falling:** Long liquidations (bearish momentum)
- **Max Pain:** Options expiry magnet (market makers push price toward max pain to minimize payouts)

### On-Chain Signals
- **Exchange inflows:** Potential selling pressure (bearish short-term)
- **Exchange outflows:** Self-custody (bullish long-term accumulation)
- **Whale flows:** Large transfers to cold storage = accumulation, to exchanges = distribution
- **Stablecoin minting:** Fresh capital entering crypto (bullish liquidity)
- **Stablecoin burning:** Capital exiting crypto (bearish liquidity)

---

## 📝 OPERATIONAL NOTES

### Memory Management
- **Daily logs (memory/YYYY-MM-DD.md):** Raw chronological events
- **MEMORY.md (this file):** Curated long-term insights, reviewed during heartbeats
- **ONYX.md (memory/ONYX.md):** ONYX ELITE market intelligence memory (scores, watchlist, liquidity, derivatives, on-chain, technical, fundamentals, narrative, risk)
- **Rule:** Write it down — "mental notes" don't survive restarts

### Heartbeat Tasks (Every 30 minutes)
- Check HEARTBEAT.md for instructions
- Rotate through: email, calendar, weather, mentions (when configured)
- Proactive work: organize memory, review daily logs, update MEMORY.md
- Track checks in memory/heartbeat-state.json

### Privacy & Security
- **MEMORY.md:** MAIN SESSION ONLY (contains personal context)
- **Daily logs:** Safe to load in any session
- **Never share:** Private keys, seed phrases, wallet addresses
- **Never exfiltrate:** Private data beyond the machine

---

## 🚀 NEXT STEPS

1. **ONYX ELITE Data Pipelines:**
   - Wire stablecoin liquidity feeds (USDT/USDC minting/burning)
   - Wire ETF flow APIs (live IBIT/GBTC/FBTC tracking)
   - Wire on-chain whale tracking (Whale Alert, Glassnode)
   - Build ELG calculator (Fed data feeds: TGA, RRP, SOFR)

2. **BTC DATA AGENT Enhancements:**
   - Add RSI calculation (Binance klines, 1h, 14-period)
   - Add Deribit options aggregator (total OI, put/call split, nearest expiry)
   - Add Pi Cycle / Rainbow retries (robust fallbacks)
   - Add Taker Buy/Sell retrieval (symbol/pair/exchange variations)

3. **ALTFINS SYSTEM:**
   - Wire live altcoin data feeds (CoinGecko, Binance, Messari)
   - Build scanning engine for 8 prompts
   - Output format: ranked opportunities with entry/SL/TP

4. **Memory Maintenance:**
   - Review daily logs every few days
   - Update MEMORY.md with distilled learnings
   - Remove outdated info from MEMORY.md

---

---

## 📅 RECENT UPDATES (2026-03-29)

### Telegram Bot Token Updated
**Time:** 11:36 AM Dubai (2026-03-29)  
**Action:** New Telegram bot token applied via config.patch  
**Bot:** @Hatoomi_bot (active)  
**Status:** Restart successful, all systems operational

### Current BTC Market Snapshot (March 29, 2026)
**Price:** $66,657 (down -1.9% from $67,943 on March 7)  
**24h Volume:** $10.71B  
**Fear & Greed:** 9/100 (Extreme Fear) — down from 12/100  
**Structure:** Holding key support $65K-$66K ✅  
**Context:** Middle East tensions + rising energy costs dampening risk appetite  
**Funding:** Negative (shorts paying longs)  
**Max Pain:** $85K (June 26 expiry)  
**Base Case:** $65K-$68K consolidation, neutral-to-bullish IF breaks $68.2K, invalidation below $65K

### ONYX ELITE First Dashboard Run (March 29, 2026)
**Time:** 12:08 PM Dubai  
**Request:** Mohammed asked for full 9-score dashboard  
**Composite Score:** 42/100 (neutral-bearish with bullish divergences)

**9 Scores:**
1. Liquidity: 58/100 (neutral-bullish — EM4 recovery improving)
2. Leverage (inverse): 72/100 (bullish — negative funding, low leverage)
3. On-Chain: 50/100 (neutral — insufficient data)
4. Technical: 38/100 (bearish-neutral — daily LH/LL, weekly HH/HL)
5. Fundamental: 65/100 (bullish — BTC fundamentals solid)
6. Narrative: 25/100 (bearish — Extreme Fear, no catalyst)
7. Smart Money: 55/100 (neutral-bullish — call-heavy options, Max Pain $85K)
8. Risk (inverse): 35/100 (high risk — geopolitical, energy costs, daily structure broken)
9. Composite: 42/100 (market at inflection point)

**Scenarios:**
- Bull (40%): Hold $65K → $70K → $75K → $85K (by June 26)
- Base (45%): Chop $63K-$70K for 2-4 weeks
- Bear (15%): Lose $65K → $63K → $60K → $56K

**Recommendation:** DO NOT TRADE YET — wait for daily CHoCH or strong $65K-$66K defense with volume

### ONYX ELITE Signal Engine Added (March 29, 2026)
**Time:** 12:18 PM Dubai  
**Version:** v1.1  
**Module:** MODULE 10 (optional post-report execution layer)

**Purpose:** Convert ONYX market bias into trade-ready execution plan ONLY after reviewing current liquidation heatmap screenshots

**Key Features:**
- Two-stage system: ONYX report first → heatmap screenshots → Signal Engine analysis → trade setup (if valid)
- Analyzes liquidation clusters above/below price, liquidity magnets, sweep direction, trap risk
- Requires confirmation after sweeps before validating entry
- 4 verdicts only: LONG SETUP VALID / SHORT SETUP VALID / WAIT FOR SWEEP THEN CONFIRM / NO TRADE
- Operating rule: No heatmap = no final trade setup

**New Commands:**
- ONYX /signal BTC — setup watch mode (no screenshots = watch levels only)
- ONYX /signal BTC after heatmap — full execution analysis
- ONYX /execute BTC — only valid if heatmap already provided
- ONYX /heatmap BTC — analyze liquidation map only

**Status:** Signal Engine inactive until liquidation heatmap screenshots provided

### Git Repository Status
**Last Commits (March 29):**
- ced92de (11:44 AM) — 17 files (daily logs, heartbeat, BTC data, coinglass skill)
- abcc922 (12:05 PM) — 2 files (MEMORY.md v1.2, today's events)
- 6ac4254 (12:18 PM) — ONYX ELITE Signal Engine patch (FOUNDATION-backup.md)
- f3b205c (12:18 PM) — Daily log update (Signal Engine patch applied)

**Push Status:** ⚠️ Pending (no GitHub credentials — HTTPS requires username/token, no SSH key)  
**Workaround:** All commits safe locally, push will complete once authentication set up

---

---

## 📅 SESSION UPDATE (2026-03-31 04:43 GMT+8)

### Telegram Bot Token Fixed
**Time:** 04:31 GMT+8 (2026-03-31)  
**Issue:** Previous token (8620551672) was invalid (401 Unauthorized)  
**Action:** Updated botToken to 8600823477:AAF8MaovsYoiCu77WRXEg8JWr0ELxKTTYG4  
**Verification:** Direct curl test successful, `/getMe` endpoint authenticated  
**Bot:** @Hatoomi_bot (now operational)  
**Status:** ✅ DM + group messaging working  
**Test Messages Sent:**
- ✅ Personal DM: "Hatoomi online" (message_id 88)
- ✅ FAMILY BOT group: "Hey team! How was everyone's day?..." (message_id 91)

### Gateway Config Patch Applied
**Time:** 04:31 GMT+8 (2026-03-31)  
**Changes:**
1. `channels.telegram.botToken` — Updated to new valid token
2. `agents.defaults.heartbeat.every` — Set to "60m" (previously default)
3. `agents.list[0]` — Added `model: 'anthropic/claude-haiku-4-5'` for main agent

**Restart:** ✅ Successful (PID 65, signal SIGUSR1, 2s delay)  
**Status:** All three changes persisted and verified

### Background Activity Summary
**Cron Jobs:** 0 (none scheduled)  
**Active Sessions:** 1 (main agent running, Haiku 4.5)  
**Sub-Agent Pool:** 3 completed ONYX ELITE runs (Sonnet 4.5 — Mar 29)  
**Sub-Agents Active:** 0 (all idle, ready on-demand)  
**Telegram Polling:** ✅ Active (continuous)  
**Gateway Heartbeat:** ✅ Active (60m interval)

### Cost Governance Status (v1.1 Active)
**Model Routing:**
- Main agent: Claude Haiku 4.5 (lightweight, fastest, cheapest)
- ONYX ELITE: Claude Sonnet 4.5 (heavier reasoning, market analysis)
- Fallback: Haiku if Sonnet unavailable

**Context Injection:**
- Heartbeat calls: HEARTBEAT.md only (500 token max)
- Routine calls: No identity files (200 token max)
- Analysis calls: SOUL.md only (6,000 token max)
- Explicit calls: Full context available (10,000 token max)

**Current Session Usage:**
- Total: ~55K tokens (Haiku running this conversation)
- Estimated cost: $0.39 USD
- Rate: ~$0.007 per 1K tokens (Haiku with cache)

---

**Version:** 1.4  
**Last Curated:** 2026-03-31 04:43 GMT+8  
**Changelog:**
- v1.4 (2026-03-31 04:43): Telegram token fixed (new bot 8600823477 authenticated), config patch applied (heartbeat 60m, model set), background activity inventory complete, cost governance v1.1 confirmed active
- v1.3 (2026-03-29 12:20): Added ONYX ELITE first dashboard run (Composite 42/100), Signal Engine v1.1 (MODULE 10), latest git commits
- v1.2 (2026-03-29 12:04): Added Telegram bot update, current BTC snapshot (March 29), git repository status
- v1.1 (2026-03-27 21:44): Added ONYX.md to memory structure for ONYX-specific market intelligence
- v1.0 (2026-03-27 21:39): Initial population from daily logs and BTC analysis

---

## 📡 COINGLASS API INTEGRATION (2026-03-31 05:00 GMT+8)

**Status:** ✅ **Authentication Verified**

**Wiring Details:**
- API Key: `4f662defa2ee433aa4d9e7091c3938b3` (verified working)
- Auth Header: `CG-API-KEY` (correct format)
- Base URL: `https://open-api-v3.coinglass.com/api`
- Status: **AUTH VERIFIED, DATA ENDPOINTS TBD**

**Working Endpoints:**
- ✅ `/api/futures/supported-coins` (returns 1000+ coin list, HTTP 200)

**Endpoints Under Investigation (HTTP 404):**
- ❌ `/api/futures/fundingRate`
- ❌ `/api/futures/openInterest`
- ❌ `/api/futures/liquidation`
- ❌ `/api/indicator/fear-greed`
- ❌ `/api/bitcoin/indicator/fear-greed-index`
- ❌ `/api/futures/funding-rate/current` (with hyphen)

**Assessment:**
CoinGlass API v3 authentication is working correctly with `CG-API-KEY` header. The `/supported-coins` endpoint successfully returns full list of available symbols. Data endpoints (funding, OI, liquidations, sentiment) are returning 404 Not Found — likely plan-restricted or different API structure. Next: check CoinGlass documentation for correct v3 data endpoint paths.

**Config File Created:**
- Location: `/data/.openclaw/workspace/.env.coinglass`
- Contents: API key, auth header, base URL
- Ready for integration with CoinGlass skill

