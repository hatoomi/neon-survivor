# AltFins Strategy Prompt #7 — Event Catalyst Trader

Step 1 — Events
- getCryptoCalendarEvents
  - eventFrom = today
  - eventTo = +14 days
  - voteSignificant = true
  - category = EXCHANGE, RELEASE, FORK_SWAP, TOKENOMICS, AIRDROP
  - sortField = dateEvent
  - sortDirection = ASC
  - size = 15

Step 2 — Technicals
- screener_getAltinsScreenerData
  - symbols = [coins from Step 1]
  - displayTypes: RSI14, MACD, SHORT_TERM_TREND, MEDIUM_TERM_TREND, SUPPORT, RESISTANCE, VOLUME_RELATIVE

Step 3 — News Context
- news_getCryptoNewsMessages
  - assetsSymbolsKeywords = top coins
  - from = last 7 days

Scoring
- CATALYST_STRENGTH: (event type weight × significance vote)
- TECHNICAL_SCORE: (trend alignment + MACD BUY + volume support)
- Rank by CATALYST_STRENGTH × TECHNICAL_SCORE

Output (per top candidate)
- Ticker / Name / Exchange
- Event: date, type, significance
- Technical grade (trend/MACD/volume snapshot)
- Entry / Stop / Target
- Brief news/catalyst context

Rules
- Recommend only where fundamentals AND technicals align
