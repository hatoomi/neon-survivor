# AltFins Strategy Prompt #1 — Bullish Momentum Continuation (Trend Following)

API Calls
1) screener_getAltinsScreenerData
   - macdFilter = BUY
   - macdHistogramFilter = H2_UP
   - signalFilters:
     - SHORT_TERM_TREND = STRONG_UP
     - MEDIUM_TERM_TREND = UP OR STRONG_UP
   - numericFilters:
     - RSI14: 50 to 65
     - VOLUME_RELATIVE: >= 1.2
   - coinTypeFilter = REGULAR
   - sortField = MARKET_CAP
   - displayTypes: RSI14, MACD, SHORT_TERM_TREND, MEDIUM_TERM_TREND, VOLUME_RELATIVE, SUPPORT, RESISTANCE, PRICE_CHANGE_1W

2) technicalAnalysis_getTechnicalAnalysisData (for top 3)
   - Pull analyst/chart pattern context

Output (for each of top 3)
- Ticker / Name / Exchange
- Signals snapshot: RSI14, MACD, STR_TREND, MED_TREND, VOL_REL, 1W %
- Entry Zone: <price range near support/POI>
- Stop Loss: <below support/invalid level>
- Targets: <resistance levels>
- R/R: <computed from entry/stop/targets>
- Confidence Grade: <A+ / A / B+>
- Notes: <pattern/context from TA call>

Rules
- Only surface results meeting all filters
- Prefer liquid coins (by market cap)
- Compute R/R from mid‑entry vs stop to T1/T2
- If SUPPORT/RESISTANCE is ambiguous, flag and lower confidence
