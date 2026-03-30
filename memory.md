# Memory Log — Operational State

## CoinGlass V4 Integration (2026-03-31 05:16 GMT+8)

**Status:** COMPLETE  
**Base URL:** https://open-api-v4.coinglass.com  
**Version:** v4  
**API Key:** 4f662defa2ee433aa4d9e7091c3938b3  

**Endpoints Verified:**
- ✅ Funding Rate — `/api/futures/funding-rate/exchange-list?symbol=BTC`
- ✅ Open Interest — `/api/futures/open-interest/exchange-list?symbol=BTC`
- ✅ Liquidations — `/api/futures/liquidation/coin-list?symbol=BTC`
- ✅ Fear & Greed Index — `/api/index/fear-greed-history?limit=1`
- ✅ Long/Short Ratio — `/api/futures/global-long-short-account-ratio/history?symbol=BTCUSDT&interval=h4&limit=1&exchange=Binance`

**Config File:** `.env.coinglass`  
**Endpoint Reference:** `COINGLASS_ENDPOINTS.md`  

**Notes:**
- Auth header uses `CG-API-KEY` (not `coinglassSecret`)
- Symbol format: `BTC` for global, `BTCUSDT` for exchange-specific
- All data validated via live API calls
- Response format: `{"code":"0","data":[...]}`
- Ready for ONYX ELITE data pipeline integration

**Testing Date:** 2026-03-31 05:00-05:09 GMT+8  
**Verification Method:** curl direct API testing  
**Status:** Production-ready
