#!/usr/bin/env python3
import os
import sys
import json
import time
import argparse
from datetime import datetime, timezone

# Try to import requests; fall back to urllib if unavailable
try:
    import requests
except Exception:
    requests = None
import urllib.request
import urllib.parse


def load_endpoints(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def http_get(url, headers=None, params=None, timeout=15):
    # Prefer requests if available for robust behavior
    if requests is not None:
        try:
            r = requests.get(url, headers=headers or {}, params=params or {}, timeout=timeout)
            status = r.status_code
            text = r.text
            try:
                data = r.json()
            except Exception:
                data = None
            return status, text, data
        except Exception as e:
            return 0, str(e), None
    # Fallback: urllib
    try:
        if params:
            query = urllib.parse.urlencode(params)
            sep = '&' if ('?' in url) else '?'
            url = f"{url}{sep}{query}"
        req = urllib.request.Request(url, headers=headers or {})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = resp.getcode()
            text = resp.read().decode('utf-8', errors='replace')
            try:
                data = json.loads(text)
            except Exception:
                data = None
            return status, text, data
    except Exception as e:
        return 0, str(e), None


def build_headers(cfg):
    api_key = os.getenv('COINGLASS_API_KEY')
    if not api_key:
        print("ERROR: COINGLASS_API_KEY env var not set.", file=sys.stderr)
        sys.exit(2)
    headers = {}
    # send both header names for compatibility
    for h in (cfg.get('headers', {}) or {}).get('api_key_headers', []):
        headers[h] = api_key
    # also ensure JSON
    headers.setdefault('Accept', 'application/json')
    return headers


def safe_get(cfg, section, key, params=None):
    base = cfg.get('base_url', '').rstrip('/')
    entry = ((cfg.get(section) or {}).get(key) or {})
    path = entry.get('path')
    if not base or not path:
        return None, { 'error': f'missing-endpoint:{section}.{key}' }
    url = f"{base}{path}"
    status, text, data = http_get(url, headers=build_headers(cfg), params=params)
    if status == 0:
        return None, { 'error': f'network-failure:{section}.{key}', 'detail': text }
    if status == 401 or status == 403:
        return None, { 'error': f'auth-failed:{section}.{key}', 'detail': text }
    if status == 404:
        return None, { 'error': f'not-found:{section}.{key}', 'detail': text }
    if status >= 400:
        # Plan restriction or other
        return None, { 'error': f'http-{status}:{section}.{key}', 'detail': text }
    if data is None:
        return None, { 'error': f'parse-failed:{section}.{key}', 'detail': text[:4000] }
    return data, None


def collect(args):
    cfg = load_endpoints(os.path.join(os.path.dirname(__file__), '..', 'references', 'endpoints.json'))
    symbols = [s.strip().upper() for s in (args.symbols.split(',') if args.symbols else ['BTC','ETH'])]
    now = datetime.now(timezone.utc).isoformat()

    out = {
        'timestamp': now,
        'symbols': symbols,
        'market_metadata': {},
        'market_data': { s: {} for s in symbols },
        'price_history': { s: {} for s in symbols },
        'open_interest': { s: {} for s in symbols },
        'funding': { s: {} for s in symbols },
        'long_short': { s: {} for s in symbols },
        'liquidations': { s: {} for s in symbols },
        'order_book': { s: {} for s in symbols },
        'taker': { s: {} for s in symbols },
        'spot': { s: {} for s in symbols },
        'options': { s: {} for s in symbols },
        'onchain': { s: {} for s in symbols },
        'etf': { s: {} for s in symbols },
        'grayscale': { s: {} for s in symbols },
        'indicators': {},
        'bitfinex': { s: {} for s in symbols },
        'errors': [],
    }

    def log_err(scope, endpoint, err):
        out['errors'].append({ 'scope': scope, 'endpoint': endpoint, **({} if not err else err) })

    # STEP 1 — MARKET METADATA
    data, err = safe_get(cfg, 'market_metadata', 'coins')
    out['market_metadata']['coins'] = data
    if err: log_err('market_metadata', 'coins', err)

    data, err = safe_get(cfg, 'market_metadata', 'exchanges')
    out['market_metadata']['exchanges'] = data
    if err: log_err('market_metadata', 'exchanges', err)

    data, err = safe_get(cfg, 'market_metadata', 'pairs', params={'exchange': 'Binance'})
    out['market_metadata']['pairs_binance'] = data
    if err: log_err('market_metadata', 'pairs', err)

    # Per-symbol sections
    def norm_interval(iv):
        m = {'h1':'1h','d1':'1d','h4':'4h','h12':'12h'}
        return m.get(iv, iv)

    for sym in symbols:
        # STEP 2 — REAL-TIME MARKET DATA
        data, err = safe_get(cfg, 'market_data', 'coins_summary', params={'symbol': sym})
        out['market_data'][sym]['coins_summary'] = data
        if err: log_err(f'market_data:{sym}', 'coins_summary', err)

        # Also include pairs/prices overview (no symbol param)
        data, err = safe_get(cfg, 'market_data', 'pairs_summary')
        out['market_data'][sym]['pairs_summary'] = data
        if err: log_err(f'market_data:{sym}', 'pairs_summary', err)

        data, err = safe_get(cfg, 'market_data', 'price_changes')
        out['market_data'][sym]['price_changes'] = data
        if err: log_err(f'market_data:{sym}', 'price_changes', err)

        # STEP 3 — PRICE HISTORY
        ex = 'Binance'
        pair = f"{sym}USDT"
        for interval in [args.h_interval, args.d_interval]:
            data, err = safe_get(cfg, 'price_history', 'candles', params={'exchange': ex, 'pair': pair, 'interval': norm_interval(interval)})
            out['price_history'][sym][interval] = data
            if err: log_err(f'price_history:{sym}', f'candles:{interval}', err)

        # STEP 4 — OPEN INTEREST
        data, err = safe_get(cfg, 'open_interest', 'aggregated', params={'symbol': sym, 'interval': norm_interval(args.h_interval)})
        out['open_interest'][sym]['aggregated'] = data
        if err: log_err(f'open_interest:{sym}', 'aggregated', err)

        data, err = safe_get(cfg, 'open_interest', 'pair', params={'exchange': 'Binance', 'pair': pair, 'interval': norm_interval(args.h_interval)})
        out['open_interest'][sym]['binance_ohlc'] = data
        if err: log_err(f'open_interest:{sym}', 'pair', err)

        data, err = safe_get(cfg, 'open_interest', 'distribution_by_exchange', params={'symbol': sym})
        out['open_interest'][sym]['aggregated'] = data
        if err: log_err(f'open_interest:{sym}', 'aggregated', err)

        data, err = safe_get(cfg, 'open_interest', 'pair', params={'exchange': 'Binance', 'pair': pair})
        out['open_interest'][sym]['binance_pair'] = data
        if err: log_err(f'open_interest:{sym}', 'pair', err)

        data, err = safe_get(cfg, 'open_interest', 'stablecoin', params={'symbol': sym})
        out['open_interest'][sym]['stablecoin'] = data
        if err: log_err(f'open_interest:{sym}', 'stablecoin', err)

        data, err = safe_get(cfg, 'open_interest', 'coin_margin', params={'symbol': sym})
        out['open_interest'][sym]['coin_margin'] = data
        if err: log_err(f'open_interest:{sym}', 'coin_margin', err)

        data, err = safe_get(cfg, 'open_interest', 'distribution_by_exchange', params={'symbol': sym})
        out['open_interest'][sym]['by_exchange'] = data
        if err: log_err(f'open_interest:{sym}', 'distribution_by_exchange', err)

        data, err = safe_get(cfg, 'open_interest', 'distribution_exchange_chart', params={'symbol': sym, 'range': '24h'})
        out['open_interest'][sym]['exchange_chart_24h'] = data
        if err: log_err(f'open_interest:{sym}', 'distribution_exchange_chart', err)

        # STEP 5 — FUNDING RATES
        data, err = safe_get(cfg, 'funding', 'oi_weighted', params={'symbol': sym, 'interval': norm_interval(args.h_interval)})
        out['funding'][sym]['oi_weighted'] = data
        if err: log_err(f'funding:{sym}', 'oi_weighted', err)

        data, err = safe_get(cfg, 'funding', 'vol_weighted', params={'symbol': sym, 'interval': norm_interval(args.h_interval)})
        out['funding'][sym]['vol_weighted'] = data
        if err: log_err(f'funding:{sym}', 'vol_weighted', err)

        data, err = safe_get(cfg, 'funding', 'pair', params={'exchange': 'Binance', 'pair': pair, 'interval': norm_interval(args.h_interval)})
        out['funding'][sym]['binance_pair'] = data
        if err: log_err(f'funding:{sym}', 'pair', err)

        data, err = safe_get(cfg, 'funding', 'current_rates', params={'symbol': sym})
        out['funding'][sym]['current_rates'] = data
        if err: log_err(f'funding:{sym}', 'current_rates', err)

        data, err = safe_get(cfg, 'funding', 'accumulated', params={'symbol': sym})
        out['funding'][sym]['accumulated'] = data
        if err: log_err(f'funding:{sym}', 'accumulated', err)

        data, err = safe_get(cfg, 'funding', 'arbitrage', params={'symbol': sym})
        out['funding'][sym]['arbitrage'] = data
        if err: log_err(f'funding:{sym}', 'arbitrage', err)

        # STEP 6 — LONG/SHORT RATIOS (Binance scope where applicable)
        data, err = safe_get(cfg, 'long_short', 'global_ratio', params={'exchange': 'Binance', 'pair': pair, 'interval': norm_interval(args.h_interval)})
        out['long_short'][sym]['global'] = data
        if err: log_err(f'long_short:{sym}', 'global_ratio', err)

        data, err = safe_get(cfg, 'long_short', 'top_accounts', params={'exchange': 'Binance', 'pair': pair, 'interval': norm_interval(args.h_interval)})
        out['long_short'][sym]['top_accounts'] = data
        if err: log_err(f'long_short:{sym}', 'top_accounts', err)

        data, err = safe_get(cfg, 'long_short', 'top_positions', params={'exchange': 'Binance', 'pair': pair, 'interval': norm_interval(args.h_interval)})
        out['long_short'][sym]['top_positions'] = data
        if err: log_err(f'long_short:{sym}', 'top_positions', err)

        data, err = safe_get(cfg, 'long_short', 'taker_ratio', params={'exchange': 'Binance', 'pair': pair, 'interval': norm_interval(args.h_interval)})
        out['long_short'][sym]['taker_ratio'] = data
        if err: log_err(f'long_short:{sym}', 'taker_ratio', err)

        # STEP 7 — LIQUIDATIONS
        data, err = safe_get(cfg, 'liquidations', 'aggregated', params={'symbol': sym, 'interval': norm_interval(args.h_interval), 'exchange_list': 'Binance,OKX,Bybit,Bitget,dYdX'})
        out['liquidations'][sym]['aggregated'] = data
        if err: log_err(f'liquidations:{sym}', 'aggregated', err)

        data, err = safe_get(cfg, 'liquidations', 'by_coin')
        out['liquidations'][sym]['by_coin'] = data
        if err: log_err(f'liquidations:{sym}', 'by_coin', err)

        data, err = safe_get(cfg, 'liquidations', 'by_exchange')
        out['liquidations'][sym]['by_exchange'] = data
        if err: log_err(f'liquidations:{sym}', 'by_exchange', err)

        # Orders / heatmap may be plan-restricted
        data, err = safe_get(cfg, 'liquidations', 'orders', params={'symbol': sym})
        out['liquidations'][sym]['orders'] = data
        if err: log_err(f'liquidations:{sym}', 'orders', err)

        data, err = safe_get(cfg, 'liquidations', 'heatmap', params={'symbol': sym, 'range': '7d'})
        out['liquidations'][sym]['heatmap_7d'] = data
        if err: log_err(f'liquidations:{sym}', 'heatmap', err)

        # STEP 8 — ORDER BOOK & WHALE ACTIVITY
        data, err = safe_get(cfg, 'order_book', 'pair_depth', params={'exchange': 'Binance', 'pair': pair})
        out['order_book'][sym]['pair_depth'] = data
        if err: log_err(f'order_book:{sym}', 'pair_depth', err)

        data, err = safe_get(cfg, 'order_book', 'coin_depth', params={'symbol': sym})
        out['order_book'][sym]['coin_depth'] = data
        if err: log_err(f'order_book:{sym}', 'coin_depth', err)

        data, err = safe_get(cfg, 'order_book', 'large_orders_current')
        out['order_book'][sym]['large_orders_current'] = data
        if err: log_err(f'order_book:{sym}', 'large_orders_current', err)

        data, err = safe_get(cfg, 'order_book', 'large_orders_history')
        out['order_book'][sym]['large_orders_history'] = data
        if err: log_err(f'order_book:{sym}', 'large_orders_history', err)

        data, err = safe_get(cfg, 'order_book', 'whale_alerts')
        out['order_book'][sym]['whale_alerts'] = data
        if err: log_err(f'order_book:{sym}', 'whale_alerts', err)

        data, err = safe_get(cfg, 'order_book', 'whale_positions', params={'symbol': sym})
        out['order_book'][sym]['whale_positions'] = data
        if err: log_err(f'order_book:{sym}', 'whale_positions', err)

        # STEP 9 — TAKER VOLUME
        data, err = safe_get(cfg, 'taker', 'coin_history', params={'symbol': sym})
        out['taker'][sym]['coin_history'] = data
        if err: log_err(f'taker:{sym}', 'coin_history', err)

        data, err = safe_get(cfg, 'taker', 'by_exchange', params={'symbol': sym})
        out['taker'][sym]['by_exchange'] = data
        if err: log_err(f'taker:{sym}', 'by_exchange', err)

        # STEP 10 — SPOT MARKET
        data, err = safe_get(cfg, 'spot', 'coins')
        out['spot'][sym]['coins'] = data
        if err: log_err(f'spot:{sym}', 'coins', err)

        data, err = safe_get(cfg, 'spot', 'coins_markets')
        out['spot'][sym]['coins_markets'] = data
        if err: log_err(f'spot:{sym}', 'coins_markets', err)

        data, err = safe_get(cfg, 'spot', 'price_history', params={'exchange':'Binance','pair':pair,'interval':args.h_interval})
        out['spot'][sym]['price_history_h'] = data
        if err: log_err(f'spot:{sym}', 'price_history_h', err)

        # STEP 11 — OPTIONS
        data, err = safe_get(cfg, 'options', 'info', params={'symbol': sym})
        out['options'][sym]['info'] = data
        if err: log_err(f'options:{sym}', 'info', err)

        data, err = safe_get(cfg, 'options', 'max_pain', params={'symbol': sym})
        out['options'][sym]['max_pain'] = data
        if err: log_err(f'options:{sym}', 'max_pain', err)

        # STEP 12 — ON-CHAIN EXCHANGE DATA
        data, err = safe_get(cfg, 'onchain', 'assets')
        out['onchain'][sym]['assets'] = data
        if err: log_err(f'onchain:{sym}', 'assets', err)

        data, err = safe_get(cfg, 'onchain', 'balance_list', params={'asset': sym})
        out['onchain'][sym]['balance_list'] = data
        if err: log_err(f'onchain:{sym}', 'balance_list', err)

        data, err = safe_get(cfg, 'onchain', 'balance_chart', params={'asset': sym, 'exchange': 'Binance'})
        out['onchain'][sym]['balance_chart_binance'] = data
        if err: log_err(f'onchain:{sym}', 'balance_chart', err)

        # STEP 13 — ETF DATA
        asset_name = 'bitcoin' if sym == 'BTC' else 'ethereum'
        data, err = safe_get(cfg, 'etf', 'list', params={'asset': asset_name})
        out['etf'][sym]['list'] = data
        if err: log_err(f'etf:{sym}', 'list', err)

        data, err = safe_get(cfg, 'etf', 'flows', params={'asset': asset_name})
        out['etf'][sym]['flows'] = data
        if err: log_err(f'etf:{sym}', 'flows', err)

        # Optional: a well-known ticker for premium check (e.g., IBIT for BTC) — non-fatal if missing
        ticker = 'IBIT' if sym == 'BTC' else None
        if ticker:
            data, err = safe_get(cfg, 'etf', 'premium', params={'ticker': ticker})
            out['etf'][sym]['premium_' + ticker] = data
            if err: log_err(f'etf:{sym}', 'premium', err)

        # STEP 14 — GRAYSCALE
        data, err = safe_get(cfg, 'grayscale', 'holdings')
        out['grayscale'][sym]['holdings'] = data
        if err: log_err(f'grayscale:{sym}', 'holdings', err)

        data, err = safe_get(cfg, 'grayscale', 'premium', params={'fund': 'GBTC' if sym=='BTC' else 'ETHE', 'range':'90d'})
        out['grayscale'][sym]['premium'] = data
        if err: log_err(f'grayscale:{sym}', 'premium', err)

        # STEP 15 — MARKET INDICATORS (global)
        # Fetch once; store on first sym only to avoid duplication
        if sym == symbols[0]:
            for ind_key in ['fear_greed', 'rsi', 'rainbow', 'pi_cycle']:
                data, err = safe_get(cfg, 'indicators', ind_key)
                out['indicators'][ind_key] = data
                if err: log_err('indicators', ind_key, err)

        # STEP 16 — BITFINEX MARGIN DATA
        data, err = safe_get(cfg, 'bitfinex', 'longs_shorts', params={'symbol': sym})
        out['bitfinex'][sym]['longs_shorts'] = data
        if err: log_err(f'bitfinex:{sym}', 'longs_shorts', err)

    return out


def summarize(payload):
    syms = payload.get('symbols', [])
    lines = []
    lines.append(f"Timestamp (UTC): {payload.get('timestamp','')}\n")

    def num(x):
        try:
            return float(x)
        except Exception:
            return None

    for sym in syms:
        cs = (((payload.get('market_data') or {}).get(sym) or {}).get('coins_summary') or {})
        price = None
        change24h = None
        oi = None
        funding = None

        # Heuristic extraction — actual fields depend on API response; best-effort
        if isinstance(cs, dict):
            price = cs.get('price') or cs.get('lastPrice') or cs.get('indexPrice')
            change24h = cs.get('change24h') or cs.get('priceChangePercent')
            oi = cs.get('openInterest') or cs.get('oi')
            funding = cs.get('fundingRate') or cs.get('funding')

        lines.append(f"{sym} Snapshot:")
        lines.append(f"  Price: {price if price is not None else 'n/a'}  |  24h: {change24h if change24h is not None else 'n/a'}  |  OI: {oi if oi is not None else 'n/a'}  |  Funding: {funding if funding is not None else 'n/a'}")

        # Funding tilt (best-effort)
        fr_now = (((payload.get('funding') or {}).get(sym) or {}).get('current_rates') or {})
        frv = None
        if isinstance(fr_now, dict):
            frv = fr_now.get('value') or fr_now.get('avg') or fr_now.get('current')
        if frv is not None:
            frv = num(frv)
            tilt = 'Positive (longs pay)' if (frv is not None and frv > 0) else ('Negative (shorts pay)' if (frv is not None and frv < 0) else 'Neutral')
            lines.append(f"  Funding Tilt: {tilt} (approx: {frv})")

        # Simple OI/price read (best-effort)
        agg_oi = (((payload.get('open_interest') or {}).get(sym) or {}).get('aggregated') or {})
        if agg_oi:
            lines.append("  OI Aggregated: available")

        # Liquidations
        liq = (((payload.get('liquidations') or {}).get(sym) or {}).get('aggregated') or {})
        if liq:
            lines.append("  Liquidations: recent data available")

        lines.append("")

    # Sentiment
    fg = (payload.get('indicators') or {}).get('fear_greed')
    if fg:
        # Try typical fields
        idx = None
        if isinstance(fg, dict):
            idx = fg.get('value') or fg.get('index')
        lines.append(f"Fear & Greed Index: {idx if idx is not None else 'n/a'}")

    # Key signals placeholder
    lines.append("Key Signals: best-effort highlights based on extremes will be added as endpoint fields stabilize.")

    return "\n".join(lines).strip() + "\n"


def main():
    p = argparse.ArgumentParser(description='CoinGlass BTC/ETH Collector')
    p.add_argument('--symbols', default='BTC,ETH', help='Comma-separated symbols (default: BTC,ETH)')
    p.add_argument('--h-interval', default='h1', help='Hourly interval key (default: h1)')
    p.add_argument('--d-interval', default='d1', help='Daily interval key (default: d1)')
    p.add_argument('--out', help='Write JSON to file (default: stdout)')
    p.add_argument('--summary', help='Write human-readable summary to file (default: print)')
    args = p.parse_args()

    payload = collect(args)

    js = json.dumps(payload, ensure_ascii=False, separators=(',', ':'), sort_keys=False)
    if args.out:
        os.makedirs(os.path.dirname(args.out), exist_ok=True)
        with open(args.out, 'w', encoding='utf-8') as f:
            f.write(js)
    else:
        print(js)

    summ = summarize(payload)
    if args.summary:
        os.makedirs(os.path.dirname(args.summary), exist_ok=True)
        with open(args.summary, 'w', encoding='utf-8') as f:
            f.write(summ)
    else:
        print("\n--- SUMMARY ---\n")
        print(summ)


if __name__ == '__main__':
    main()
