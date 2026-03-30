# CoinGlass V4 API Endpoints Reference

**Base URL:** `https://open-api-v4.coinglass.com`  
**Authentication:** Header `CG-API-KEY: <api_key>`  
**Status:** ✅ All core endpoints verified (2026-03-31 05:03 GMT+8)

---

## Verified Working Endpoints

### 1. Funding Rate (by Exchange)
**Endpoint:** `/api/futures/funding-rate/exchange-list?symbol=BTC`  
**Status:** ✅ **WORKING**  
**Response:** Real-time funding rates from all exchanges (Binance, OKX, etc.)  
**Sample:** `{"code":"0","data":[{"exchange":"Binance","funding_rate":0.00065700,...}]}`

### 2. Open Interest (Aggregated)
**Endpoint:** `/api/futures/open-interest/exchange-list?symbol=BTC`  
**Status:** ✅ **WORKING**  
**Response:** Total OI, by margin type (coin/stablecoin), and per exchange  
**Sample:** `{"code":"0","data":[{"exchange":"All","open_interest_usd":49.3B,...}]}`

### 3. Liquidations (24h, 12h, 4h, 1h)
**Endpoint:** `/api/futures/liquidation/coin-list?symbol=BTC`  
**Status:** ✅ **WORKING**  
**Response:** Liquidation cascade data (long + short) across time windows  
**Sample:** `{"code":"0","data":[{"symbol":"BTC","liquidation_usd_24h":173.4M,"long_liquidation_usd_24h":116.6M,...}]}`

### 4. Fear & Greed Index (with Historical Data)
**Endpoint:** `/api/index/fear-greed-history?limit=1`  
**Status:** ✅ **WORKING**  
**Response:** 1000+ historical FGI values with BTC price correlation  
**Sample:** `{"code":"0","data":{"data_list":[...9,8,11,...],"price_list":[...],"time_list":[...]}}`

### 5. Long/Short Account Ratio (Binance)
**Endpoint:** `/api/futures/global-long-short-account-ratio/history?symbol=BTCUSDT&interval=h4&limit=1&exchange=Binance`  
**Status:** ✅ **WORKING**  
**Response:** Global long/short account ratio with timestamp  
**Sample:** `{"code":"0","data":[{"time":1774900800000,"global_account_long_percent":65.9,"global_account_short_percent":34.1,"global_account_long_short_ratio":1.93}]}`

---

## Additional Endpoints (Not Yet Tested)

### 6. ETF Flows (Bitcoin)
**Endpoint:** `/api/etf/bitcoin/flow-history`  
**Expected Response:** Daily ETF inflows/outflows (Grayscale, iShares, etc.)

### 7. Bull Market Peak Indicator
**Endpoint:** `/api/bull-market-peak-indicator`  
**Expected Response:** Current cycle position relative to historical peaks

### 8. Bitcoin Bubble Index
**Endpoint:** `/api/index/bitcoin/bubble-index`  
**Expected Response:** Current valuation bubble indicator

---

## Configuration

**Location:** `/data/.openclaw/workspace/.env.coinglass` (or openclaw.json)

```
COINGLASS_BASE_URL=https://open-api-v4.coinglass.com
COINGLASS_API_VERSION=v4
COINGLASS_API_KEY=4f662defa2ee433aa4d9e7091c3938b3
COINGLASS_AUTH_HEADER=CG-API-KEY
```

---

## Usage Notes

1. **Symbol Format:** Use `BTC` for global endpoints, `BTCUSDT` for exchange-specific endpoints
2. **Time Intervals:** Supported intervals include `h1`, `h4`, `d1` (hourly, 4-hourly, daily)
3. **Exchanges:** `Binance`, `OKX`, `Bybit`, `Deribit`, `All` (aggregated)
4. **Rate Limits:** Respect CoinGlass rate limits (typically 100-1000 req/min depending on plan)

---

**Last Verified:** 2026-03-31 05:03 GMT+8  
**Verification Method:** curl + direct API testing  
**Next Action:** Wire into ONYX ELITE data pipelines
