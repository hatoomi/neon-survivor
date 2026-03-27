# AltFins Strategy Prompt #4 — ATH Breakout & Price Discovery (Momentum)

API Calls
1) screener_getAltinsScreenerData
   - percentDownFromAthFilter = PRICE_AT_LEAST_5_PERCENT_BELOW_ATH (within ~25% of ATH per spec)
   - macdFilter = BUY
   - macdHistogramFilter = H2_UP
   - signalFilters:
     - SHORT_TERM_TREND = STRONG_UP
     - MEDIUM_TERM_TREND = UP OR STRONG_UP
   - numericFilters:
     - RSI14: 55 to 75
     - VOLUME_RELATIVE: >= 1.5
   - coinTypeFilter = REGULAR
   - displayTypes: ATH, ATH_PERCENT_DOWN, RSI14, MACD, SHORT_TERM_TREND, MEDIUM_TERM_TREND, VOLUME_RELATIVE, PRICE_CHANGE_1W, MARKET_CAP
   - sortField = ATH_PERCENT_DOWN
   - sortDirection = ASC
   - athDateAfterFilter = last 30 days

2) news_getCryptoNewsMessages (per result) — check recent catalysts

Output (per result)
- Ticker / Name / Exchange
- % from ATH, ATH date (if recent)
- State: At/near ATH or broken ATH (price discovery = no overhead resistance)
- Support (nearest) for stop placement
- RSI/MACD/trend snapshot; Volume Relative
- Notable news/catalyst (if any)

Rules
- Prioritize closest to ATH first
- Flag true price discovery (no overhead resistance)
