---
name: coinglass-collector
description: Collect BTC/ETH derivatives, spot, on-chain, and sentiment data from CoinGlass via API and output both structured JSON and a concise human-readable summary. Use when Mohammed asks for a CoinGlass-powered snapshot, derivatives deep-dive (OI, funding, long/short, liquidations), on-chain exchange balances, ETF/Grayscale flows, or sentiment. On-demand only; reads COINGLASS_API_KEY from environment.
---

# CoinGlass Data Collector (BTC & ETH)

This skill provides an on-demand Python collector that pulls a comprehensive BTC/ETH dataset from CoinGlass and returns both:
- machine-readable JSON (for storage/post-processing)
- a human-readable summary (for quick consumption)

Security: Never hardcode API keys. Set the environment variable `COINGLASS_API_KEY` before running.

## What it Collects (by domain)
- Market metadata (coins, pairs, exchanges)
- Real-time market data (prices, OI, volume, funding summaries)
- Price history (h1, d1, configurable)
- Open interest (aggregated, per exchange/pair, margin type)
- Funding rates (OI-weighted, volume-weighted, per pair, current)
- Long/short ratios (global, top traders, taker ratio)
- Liquidations (aggregated, by coin/exchange)
- Order book & whale activity (depth, large orders) [skips gracefully if plan-restricted]
- Taker volume (history, by exchange)
- Spot market (coins, markets, spot OHLCV)
- Options (OI, max pain)
- On-chain exchange data (holdings, balances, balance charts)
- ETF data (lists, flows, premiums)
- Grayscale (holdings, premiums)
- Market indicators (fear & greed, RSI, rainbow, pi-cycle)
- Bitfinex margin data (BTC/ETH longs/shorts)

Plan-restricted endpoints are skipped with a clear note.

## How It Works
- The collector reads endpoint mappings from `references/endpoints.yml`.
- It executes a curated set of requests for BTC and ETH, handling retries and timeouts.
- It writes a consolidated JSON payload to stdout (or a file if `--out` is provided), and prints a short, opinionated summary (or writes to `--summary`).

## Setup
1) Export your API key (shell example):
   - macOS/Linux: `export COINGLASS_API_KEY="<your_key>"`
   - Windows (PowerShell): `$env:COINGLASS_API_KEY = "<your_key>"`

2) Review and, if needed, update `references/endpoints.yml` to match your CoinGlass API plan and base URL.

## Usage
- Full run (stdout JSON + summary to console):
  - `python3 scripts/collect.py --symbols BTC,ETH`

- Save artifacts:
  - `python3 scripts/collect.py --symbols BTC,ETH --out data/latest.json --summary data/latest.txt`

- Control history intervals (default h1/d1):
  - `python3 scripts/collect.py --h-interval h1 --d-interval d1`

The script exits non-fatal on individual request failures (logs and continues) and marks missing/plan-blocked data in the JSON under `errors`.

## Outputs
- JSON root fields (representative):
  - `timestamp`
  - `symbols: ["BTC","ETH"]`
  - `market_metadata`, `market_data`, `price_history`, `open_interest`, `funding`, `long_short`, `liquidations`, `order_book`, `taker`, `spot`, `options`, `onchain`, `etf`, `grayscale`, `indicators`, `bitfinex`
  - `errors` (array of {scope, endpoint, message})

- Summary (plain text):
  - Market Snapshot (price, 24h, OI delta, funding)
  - Derivatives Overview (OI, funding, L/S)
  - Liquidations (last 24h, notable clusters if available)
  - Whale & Order Book (if available)
  - On-chain (exchange balances/flows)
  - Institutional (ETF flows, Grayscale premiums)
  - Sentiment (Fear & Greed, RSI/taker)
  - Key Signals (extremes/divergences)

## Notes
- Endpoints differ by plan; `references/endpoints.yml` centralizes URLs/paths so you can adjust without editing code.
- If a given endpoint requires a higher plan, the runner logs and moves on.
- Headers: the client sends both `coinglassSecret` and `X-API-KEY` with the same value to maximize compatibility.

## Files
- `scripts/collect.py` — main runner
- `references/endpoints.yml` — endpoint map (edit to match your plan)
