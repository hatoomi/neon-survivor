# Galaxy System Data Runner — Pipeline Plan

Targets
- Prompt A (A–H): Liquidity (Stock/Flow, ELG), BTC Regime, Crypto Scorecard, EM Model, Options Overlay, Sentiment Gate, Decision, System State
- Prompt B (BTC/USDT Futures, Binance): Only if Allowed

Providers + Cadence
- Macro/Liquidity (FRED/Fed/Treasury): daily/weekly cache
- Options (Laevitas/Deribit): 5–15 min cache
- Sentiment (LunarCrush): 10–30 min cache
- Derivatives/Liq (Binance/Coinglass): near-real-time throttle + bursts pre-decision
- On‑chain/Flows (CryptoQuant): 1–4h cache

Rate‑Limit Strategy
- Staggered scheduling (avoid :00/:30)
- Exponential backoff; circuit breaker on persistent 429/5xx
- Batch endpoints where possible; coalesce similar reads
- WebSockets for Binance/Deribit when stable
- Priority resolution: Gate layers first (Liquidity, BTC Regime, Sentiment)
- Snapshots: Reuse last-good compute if upstream unchanged

Monitoring
- Write per‑provider stats to research_out/ratelimit-status.json
  - lastSuccessAt, lastErrorAt, lastStatus, requestCountWindow, backoffState
- Emit run summary to research_out/run-logs/YYYYMMDD_HHMM.json

Outputs
- Prompt A markdown: research_out/PromptA-YYYYMMDD-HHMM.md
- Prompt B markdown (if allowed): research_out/PromptB-YYYYMMDD-HHMM.md

Security
- Read keys from .env.research-keys only
- No trading/execution without explicit approval
