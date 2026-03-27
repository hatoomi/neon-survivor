# AltFins Strategy Prompt #3 — Golden Cross Breakout (Trend Reversal)

API Calls
1) screener_getAltinsScreenerData
   - crossAnalyticFilters: X_SMA50_CROSS_SMA200 = ABOVE
   - crossLookBackIntervals = 3 (within last 3 candles)
   - macdFilter = BUY
   - signalFilters:
     - SHORT_TERM_TREND = UP OR STRONG_UP
   - numericFilters:
     - VOLUME_RELATIVE >= 1.5
   - coinTypeFilter = REGULAR
   - displayTypes: SMA50, SMA200, RSI14, MACD, LONG_TERM_TREND, VOLUME_RELATIVE, PRICE_CHANGE_1M, ATH_PERCENT_DOWN

Output (per result)
- Ticker / Name / Exchange
- SMA50 / SMA200 values; Price distance vs SMA50 (% above)
- Trend state: short / medium / long; note transition if long‑term trend shifting
- RSI14, MACD state, Volume Relative
- Nearest resistance target(s)
- Highlight if short + medium + long trends are ALL UP (strongest signal)

Rules
- Do not filter by market cap — include all
- Cross must be recent (<= 3 candles)
- Require volume confirmation (>= 1.5x)
