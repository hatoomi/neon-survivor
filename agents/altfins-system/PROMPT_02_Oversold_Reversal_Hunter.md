# AltFins Strategy Prompt #2 — Oversold Reversal Hunter

API Calls
1) screener_getAltinsScreenerData
   - numericFilters:
     - RSI14: <= 32
   - rsiDivergenceFilter = BULLISH
   - candlestickPatternFilters:
     - CD_HAMMER (lookBack = 1)
   - macdHistogramFilter = H1_UP
   - coinTypeFilter = REGULAR
   - minimumMarketCapValue = 50000000
   - displayTypes: RSI14, MACD, SHORT_TERM_TREND, SUPPORT, RESISTANCE, PRICE_CHANGE_1W, VOLUME_RELATIVE

2) technicalAnalysis_getTechnicalAnalysisData (for each result)
   - Pull analyst/pattern context

Output (per result)
- Ticker / Name / Exchange
- RSI14 (current), Divergence context, MACD state (histogram H1_UP)
- Nearest Support (as stop), Nearest Resistance (as T1)
- Entry zone near support; R/R to first resistance
- Risk flag: Long‑term trend = DOWN (higher risk reversal)
- Notes: Analyst/pattern check

Rules
- Only include genuinely oversold with bullish reversal evidence (RSI <= 32 + divergence or hammer)
- Exclude micro‑caps (<$50m) to reduce trap risk
- If long‑term trend DOWN, do not block — but flag as higher risk and lower confidence
