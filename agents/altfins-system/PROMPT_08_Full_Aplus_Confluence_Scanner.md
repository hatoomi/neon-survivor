# AltFins Strategy Prompt #8 — Full A+ Confluence Scanner

API Calls
1) screener_getAltinsScreenerData (stack all filters)
   TREND LAYER
   - signalFilters:
     - SHORT_TERM_TREND = UP OR STRONG_UP
     - MEDIUM_TERM_TREND = UP OR STRONG_UP

   STRUCTURE LAYER
   - analyticsComparisonsFilters:
     - LAST_PRICE_VS_SMA50 = ABOVE
     - LAST_PRICE_VS_SMA200 = ABOVE

   MOMENTUM LAYER
   - macdFilter = BUY
   - macdHistogramFilter = H2_UP

   QUALITY LAYER
   - numericFilters:
     - RSI14: 48 to 66
     - VOLUME_RELATIVE: >= 1.2

   CROSS SIGNAL
   - crossAnalyticFilters: X_LAST_PRICE_CROSS_SMA50 = ABOVE
   - lookBack = 5

   OTHER SETTINGS
   - coinTypeFilter = REGULAR
   - minimumMarketCapValue = 50000000
   - displayTypes: RSI14, MACD, SHORT_TERM_TREND, MEDIUM_TERM_TREND, LONG_TERM_TREND, SMA50, SMA200, VOLUME_RELATIVE, SUPPORT, RESISTANCE, PRICE_CHANGE_1W, MARKET_CAP
   - sortField = MARKET_CAP
   - size = 10

2) technicalAnalysis_getTechnicalAnalysisData (per result)
   - Confirm analyst/pattern context

Scoring (1–8)
- Trend (short, medium) = 2 pts
- Structure (above SMA50/200) = 2 pts
- Momentum (MACD BUY + H2_UP) = 2 pts
- Quality (RSI band + Volume Rel) = 2 pts

Output
- Show only coins with score >= 6
- Ranked table with: ticker, entry/stop/target, confluence score (1–8), grade (A/B/C)
- Notes: pattern confirmation and any caveats

Rules
- Enforce all stacked filters; no partials in initial results
- If any critical field missing (e.g., support/resistance), compute conservative POIs or down‑grade confidence
