#!/usr/bin/env tsx
/**
 * 從 Yahoo Finance 抓取所有公司的最新報價與 6 個月日線歷史價，
 * 寫入 src/data/marketData.json。
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
import path from "node:path";
import { fileURLToPath } from "node:url";
import { companies } from "../src/data/companies";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey", "ripHistorical"] });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.resolve(__dirname, "../src/data/marketData.json");

// 歷史價回看的天數（含週末，每年約 252 個交易日；6 個月約 130 個交易日）
const HISTORY_DAYS = 180;

interface HistoryPoint {
  /** ISO date 字串（"YYYY-MM-DD"） */
  d: string;
  /** 當日收盤價 */
  c: number;
}

interface Quote {
  symbol: string;
  currency: string;
  price: number | null;
  previousClose: number | null;
  change: number | null;
  changePercent: number | null;
  marketCap: number | null;
  trailingPE: number | null;
  forwardPE: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  /** 6 個月日線收盤；空陣列代表無資料 */
  history: HistoryPoint[];
  error?: string;
}

interface MarketDataFile {
  fetchedAt: string;
  historyDays: number;
  quotes: Record<string, Quote>;
}

/** 把公司 ticker 欄位（例如 "TWSE: 2330 / NYSE: TSM"）轉成 yfinance symbol */
function toYahooSymbol(ticker: string): string | null {
  const twse = ticker.match(/TWSE:\s*(\d+)/);
  if (twse) return twse[1] + ".TW";

  const tpex = ticker.match(/TPEx:\s*(\d+)/);
  if (tpex) return tpex[1] + ".TWO";

  const krx = ticker.match(/KRX:\s*(\d+)/);
  if (krx) return krx[1].padStart(6, "0") + ".KS";

  const epa = ticker.match(/EPA:\s*(\S+)/);
  if (epa) return epa[1] + ".PA";

  const us = ticker.match(/(?:NASDAQ|NYSE|AMEX|NYSEARCA):\s*(\S+)/);
  if (us) return us[1];

  return null;
}

function toIsoDate(d: Date | string | number | null | undefined): string | null {
  if (d == null) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

async function fetchQuoteOnly(symbol: string) {
  const q = await yahooFinance.quote(symbol);
  return {
    currency: q.currency ?? "USD",
    price: q.regularMarketPrice ?? null,
    previousClose: q.regularMarketPreviousClose ?? null,
    change: q.regularMarketChange ?? null,
    changePercent: q.regularMarketChangePercent ?? null,
    marketCap: q.marketCap ?? null,
    trailingPE: q.trailingPE ?? null,
    forwardPE: q.forwardPE ?? null,
    fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? null,
  };
}

async function fetchChart(symbol: string): Promise<HistoryPoint[]> {
  const period1 = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000);
  const res = await yahooFinance.chart(symbol, {
    period1,
    interval: "1d",
  });
  const out: HistoryPoint[] = [];
  for (const row of res.quotes ?? []) {
    const iso = toIsoDate(row.date);
    if (iso && typeof row.close === "number") {
      out.push({ d: iso, c: Number(row.close.toFixed(4)) });
    }
  }
  return out;
}

async function fetchOne(symbol: string): Promise<Quote> {
  // 預設失敗時的回傳值
  const fallback: Quote = {
    symbol,
    currency: "USD",
    price: null,
    previousClose: null,
    change: null,
    changePercent: null,
    marketCap: null,
    trailingPE: null,
    forwardPE: null,
    fiftyTwoWeekHigh: null,
    fiftyTwoWeekLow: null,
    history: [],
  };

  let q: Awaited<ReturnType<typeof fetchQuoteOnly>> | null = null;
  try {
    q = await fetchQuoteOnly(symbol);
  } catch (err) {
    fallback.error = err instanceof Error ? err.message : String(err);
    // 即便 quote 失敗，仍嘗試抓 chart（部分台股 small-cap 會這樣）
  }

  let history: HistoryPoint[] = [];
  try {
    history = await fetchChart(symbol);
  } catch (err) {
    // history 失敗不算嚴重錯誤；只記在 error 欄位
    if (!fallback.error) {
      fallback.error = "chart: " + (err instanceof Error ? err.message : String(err));
    }
  }

  return {
    symbol,
    currency: q?.currency ?? fallback.currency,
    price: q?.price ?? null,
    previousClose: q?.previousClose ?? null,
    change: q?.change ?? null,
    changePercent: q?.changePercent ?? null,
    marketCap: q?.marketCap ?? null,
    trailingPE: q?.trailingPE ?? null,
    forwardPE: q?.forwardPE ?? null,
    fiftyTwoWeekHigh: q?.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: q?.fiftyTwoWeekLow ?? null,
    history,
    error: fallback.error,
  };
}

async function main() {
  const targets = companies
    .map((c) => ({ id: c.id, name: c.name, ticker: c.ticker, symbol: toYahooSymbol(c.ticker) }))
    .filter((t): t is { id: string; name: string; ticker: string; symbol: string } => !!t.symbol);

  console.log(`[fetch-prices] 將抓取 ${targets.length} 個 ticker，每個含 quote + ${HISTORY_DAYS} 天日線`);

  const quotes: Record<string, Quote> = {};
  const errors: string[] = [];
  const BATCH = 8; // chart 比較重，調小批次避免被限速
  for (let i = 0; i < targets.length; i += BATCH) {
    const batch = targets.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async (t) => ({ t, q: await fetchOne(t.symbol) })),
    );
    for (const { t, q } of results) {
      quotes[t.id] = q;
      const priceTxt = q.price != null ? `${q.price.toFixed(2)} ${q.currency}` : "—";
      const fpe = q.forwardPE != null ? q.forwardPE.toFixed(1) : "—";
      const hist = q.history.length;
      const tag = q.error
        ? `⚠ ${q.error.slice(0, 50)}`
        : `✓ ${priceTxt}  fPE=${fpe}  hist=${hist}`;
      console.log(`  ${t.symbol.padEnd(12)} ${t.name.padEnd(34)} ${tag}`);
      if (q.error) errors.push(`${t.id} (${t.symbol}): ${q.error}`);
    }
  }

  const out: MarketDataFile = {
    fetchedAt: new Date().toISOString(),
    historyDays: HISTORY_DAYS,
    quotes,
  };
  await fs.writeFile(OUTPUT, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`\n[fetch-prices] 已寫入 ${OUTPUT}`);
  const successCount = targets.length - errors.length;
  console.log(`[fetch-prices] 完整成功 ${successCount} / ${targets.length}`);
  if (errors.length > 0) {
    console.log(`[fetch-prices] 部分失敗（${errors.length} 個，不會中斷流程）：`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main().catch((e) => {
  console.error("[fetch-prices] 嚴重錯誤：", e);
  process.exit(1);
});
