# AltFins Strategy Prompt #6 — Swing Channel Trader (Range Plays)

API Calls
1) screener_getAltinsScreenerData
   - signalFilters:
     - MEDIUM_TERM_TREND = NEUTRAL
   - numericFilters:
     - RSI14: 30 to 45
     - STOCH <= 25
   - candlestickPatternFilters:
     - CD_HAMMER OR CD_BULLISH_ENGULFING (lookBack = 2)
   - coinTypeFilter = REGULAR
   - minimumMarketCapValue = 100000000
   - displayTypes: RSI14, STOCH, SUPPORT, RESISTANCE, SHORT_TERM_TREND, MEDIUM_TERM_TREND, PRICE_CHANGE_1W, VOLUME_RELATIVE

2) technicalAnalysis_getTechnicalAnalysisData (per result)
   - Confirm Sideways Channel pattern if available

Output (per result)
- Ticker / Name / Exchange
- Support / Resistance; Range width = (R − S)
- Entry: near support; Stop: 5% below support; Target: near resistance
- R/R to target (must be >= 1.5)
- RSI14, STOCH, short/medium trend, volume relative
- Pattern confirmation note

Rules
- Only show setups with R/R >= 1.5
- Neutral medium trend to confirm range state
- Use candlestick confirmation within last 2 candles
