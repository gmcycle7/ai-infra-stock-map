#!/usr/bin/env tsx
/**
 * 從 Yahoo Finance 抓取所有公司的最新報價，寫入 src/data/marketData.json。
 *
 * 用法：
 *   npm run fetch:prices
 *
 * 排程：
 *   .github/workflows/update-prices.yml 每天台北時間 06:00 自動跑。
 *
 * 對 yfinance 來說，台股 ticker 加 ".TW"、上櫃加 ".TWO"、韓股 ".KS"、巴黎 ".PA"。
 */

import YahooFinance from "yahoo-finance2";
import fs from "node:fs/promises";

const yahooFinance = new YahooFinance();
import path from "node:path";
import { fileURLToPath } from "node:url";
import { companies } from "../src/data/companies";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.resolve(__dirname, "../src/data/marketData.json");

interface Quote {
  symbol: string;
  currency: string;
  price: number | null;
  previousClose: number | null;
  change: number | null;
  changePercent: number | null;
  marketCap: number | null;
  trailingPE: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  error?: string;
}

interface MarketDataFile {
  fetchedAt: string;
  quotes: Record<string, Quote>;
}

/** 把公司 ticker 欄位（例如 "TWSE: 2330 / NYSE: TSM"）轉成 yfinance symbol */
function toYahooSymbol(ticker: string): string | null {
  // 雙重上市優先 TWSE
  const twse = ticker.match(/TWSE:\s*(\d+)/);
  if (twse) return twse[1] + ".TW";

  const tpex = ticker.match(/TPEx:\s*(\d+)/);
  if (tpex) return tpex[1] + ".TWO";

  const krx = ticker.match(/KRX:\s*(\d+)/);
  if (krx) return krx[1].padStart(6, "0") + ".KS";

  const epa = ticker.match(/EPA:\s*(\S+)/);
  if (epa) return epa[1] + ".PA";

  // 美股
  const us = ticker.match(/(?:NASDAQ|NYSE|AMEX|NYSEARCA):\s*(\S+)/);
  if (us) return us[1];

  return null;
}

async function fetchOne(symbol: string): Promise<Quote> {
  try {
    const q = await yahooFinance.quote(symbol);
    return {
      symbol,
      currency: q.currency ?? "USD",
      price: q.regularMarketPrice ?? null,
      previousClose: q.regularMarketPreviousClose ?? null,
      change: q.regularMarketChange ?? null,
      changePercent: q.regularMarketChangePercent ?? null,
      marketCap: q.marketCap ?? null,
      trailingPE: q.trailingPE ?? null,
      fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      symbol,
      currency: "USD",
      price: null,
      previousClose: null,
      change: null,
      changePercent: null,
      marketCap: null,
      trailingPE: null,
      fiftyTwoWeekHigh: null,
      fiftyTwoWeekLow: null,
      error: msg,
    };
  }
}

async function main() {
  const targets = companies
    .map((c) => ({ id: c.id, name: c.name, ticker: c.ticker, symbol: toYahooSymbol(c.ticker) }))
    .filter((t): t is { id: string; name: string; ticker: string; symbol: string } => !!t.symbol);

  console.log(`[fetch-prices] 將抓取 ${targets.length} 個 ticker`);

  // 用淺顯的方式控制速率：每批 10 個並行
  const quotes: Record<string, Quote> = {};
  const errors: string[] = [];
  const BATCH = 10;
  for (let i = 0; i < targets.length; i += BATCH) {
    const batch = targets.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async (t) => ({ t, q: await fetchOne(t.symbol) })),
    );
    for (const { t, q } of results) {
      quotes[t.id] = q;
      const tag = q.error
        ? `❌ ${q.error.slice(0, 60)}`
        : `✓ ${q.price?.toFixed(2)} ${q.currency}  PE=${q.trailingPE?.toFixed(1) ?? "—"}`;
      console.log(`  ${t.symbol.padEnd(12)} ${t.name.padEnd(34)} ${tag}`);
      if (q.error) errors.push(`${t.id} (${t.symbol}): ${q.error}`);
    }
  }

  const out: MarketDataFile = {
    fetchedAt: new Date().toISOString(),
    quotes,
  };
  await fs.writeFile(OUTPUT, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`\n[fetch-prices] 已寫入 ${OUTPUT}`);
  console.log(`[fetch-prices] 成功 ${targets.length - errors.length} / ${targets.length}`);
  if (errors.length > 0) {
    console.log(`[fetch-prices] 失敗 ${errors.length} 個（不會中斷流程）：`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main().catch((e) => {
  console.error("[fetch-prices] 嚴重錯誤：", e);
  process.exit(1);
});
