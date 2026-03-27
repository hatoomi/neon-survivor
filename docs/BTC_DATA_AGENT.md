BTC Full Report — Final Prompt v1.0

Run a complete BTC market report using the following endpoint mapping and fallback logic. For every section, fetch the data, extract the latest values, and populate the report. Do NOT leave any field as "n/a" if the endpoint returns data — parse it and display it.

1. BTC PRICE & MARKET DATA
Primary: Binance public API https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT (no key needed)
Extract: price, 24h change %, 24h high, 24h low, 24h volume

2. OPEN INTEREST
CoinGlass: /api/futures/open-interest/aggregated-history?symbol=BTC&interval=h1
Extract: latest close value, 24h change (compare current vs 24h ago), format in USD

3. FUNDING RATE
CoinGlass: /api/futures/funding-rate/oi-weight-history?symbol=BTC&interval=h1
Also try: /api/futures/funding-rate/vol-weight-history?symbol=BTC&interval=h1
Also try: /api/futures/funding-rate/exchange-list?symbol=BTC
Extract: latest close value, flag if > |0.03%|

4. LONG/SHORT RATIO
Primary: Binance public API https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=1h&limit=4 (no key needed)
Also try: https://fapi.binance.com/futures/data/topLongShortAccountRatio?symbol=BTCUSDT&period=1h&limit=4
Also try: https://fapi.binance.com/futures/data/topLongShortPositionRatio?symbol=BTCUSDT&period=1h&limit=4
Extract: latest ratio for each, 4h trend direction

5. LIQUIDATIONS
CoinGlass: /api/futures/liquidation/aggregated-history?symbol=BTC&interval=h1
Also: /api/futures/liquidation/coin-list
Extract: 1h, 4h, 12h, 24h totals with long/short split and percentages

6. TAKER BUY/SELL
CoinGlass: /api/futures/aggregated-taker-buy-sell-volume/history?symbol=BTC&interval=h1
Fallback: try pair=BTCUSDT&exchange=Binance if symbol returns empty
Extract: latest buy/sell ratio, 4h trend

7. ORDER BOOK
CoinGlass: /api/futures/orderbook/large-limit-order?symbol=BTC
Fallback: try pair=BTCUSDT&exchange=Binance
Extract: notable walls >= $1M, bid/ask imbalance

8. OPTIONS
CoinGlass: /api/option/max-pain?symbol=BTC&exchange=Deribit
Also: /api/option/info?symbol=BTC&exchange=Deribit
Extract: max pain price, total OI, put/call ratio, next major expiry

9. ON-CHAIN
CoinGlass: /api/exchange/balance/list?symbol=BTC
Fallback: try /api/exchange/assets
Extract: total BTC on exchanges, 24h net change, flow direction

10. ETF FLOWS
CoinGlass: /api/etf/bitcoin/flow-history
Extract: latest day net flow, top 3 ETF flows (IBIT, GBTC, FBTC)

11. SENTIMENT & INDICATORS
CoinGlass: /api/index/fear-greed-history
Also try: /api/index/pi-cycle-indicator, /api/index/bitcoin/rainbow-chart
RSI: calculate 14-period RSI from the OHLC price data you already have
Extract: Fear & Greed score + label, RSI value, Pi Cycle status, Rainbow band

12. KEY SIGNALS & ALERTS
Auto-generate alerts based on these thresholds:
- Fear & Greed < 20 or > 80
- Funding rate > |0.03%|
- 24h liquidations > $100M
- ETF daily flow > +$500M or < -$500M
- L/S ratio > 2.0 or < 0.5
- Max pain vs current price divergence > 5%
- On-chain net flow > ±2% in 24h

Rules:
- Wait 1 second between API calls to avoid rate limits
- For any endpoint returning 200 with null/empty data, try the fallback params before skipping
- For any endpoint returning 401 or 429, skip and note "plan restricted" or "rate limited"
- Format all dollar values with commas and appropriate units (M/B)
- Format all percentages to 2 decimal places
- Print the FULL completed report in chat AND save to data/btc_latest.json + data/btc_latest.txt
