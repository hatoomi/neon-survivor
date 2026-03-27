# AltFins Strategy Prompt #5 — Sector Rotation Scanner

API Calls (run 4 scans)
Common filters:
- macdFilter = BUY
- signalFilters: SHORT_TERM_TREND = UP OR STRONG_UP
- displayTypes: RSI14, SHORT_TERM_TREND, PRICE_CHANGE_1W, VOLUME_RELATIVE, MARKET_CAP
- size = 5
- sortField = PRICE_CHANGE_1W

Scan 1 — AI sector
- coinCategoryFilter = [AI_BIG_DATA, AI_AGENTS]

Scan 2 — DeFi sector
- coinCategoryFilter = [DEFI, DECENTRALIZED_EXCHANGE_DEX_TOKEN]

Scan 3 — Solana Ecosystem
- coinCategoryFilter = [SOLANA_ECOSYSTEM]

Scan 4 — RWA / Real World Assets
- coinCategoryFilter = [REAL_WORLD_ASSETS_PROTOCOLS]

Post‑processing
- Rank sectors by:
  - Average PRICE_CHANGE_1W
  - Count of UP/STRONG_UP short‑term trend coins
- Identify top sector
- news_getCryptoNewsMessages for the top coin in the winning sector

Output
- Sector leaderboard (avg 1W perf, UP counts)
- Best trade candidate from winning sector (ticker, entry/stop/target sketch, key signals, catalyst note)
