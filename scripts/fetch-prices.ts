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

// 歷史價回看的天數（含週末）；2 年資料足以涵蓋 1M/3M/6M/1Y/2Y 區間
const HISTORY_DAYS = 730;

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
  /** 分析師目標價（中位數 / 高 / 低 / 均值） */
  targetMean: number | null;
  targetHigh: number | null;
  targetLow: number | null;
  targetMedian: number | null;
  /** 平均建議：1 Strong Buy → 5 Strong Sell */
  recommendationMean: number | null;
  recommendationKey: string | null;
  numberOfAnalystOpinions: number | null;
  /** 財務面（來自 financialData + defaultKeyStatistics + summaryDetail） */
  profitMargin: number | null;          // 淨利率
  grossMargin: number | null;           // 毛利率
  operatingMargin: number | null;       // 營業利益率
  revenueGrowthYoY: number | null;      // 營收 YoY 成長率（最新季）
  earningsGrowthYoY: number | null;     // EPS YoY 成長率（最新季）
  returnOnEquity: number | null;        // ROE
  returnOnAssets: number | null;        // ROA
  totalDebt: number | null;             // 總負債（原幣）
  totalCash: number | null;             // 現金 + 短期投資（原幣）
  freeCashflow: number | null;          // 自由現金流（原幣）
  pegRatio: number | null;              // PEG
  priceToBook: number | null;           // P/B
  beta: number | null;                  // 對市場波動
  dividendYield: number | null;         // 股息殖利率
  enterpriseValue: number | null;
  enterpriseToRevenue: number | null;   // EV / Revenue
  enterpriseToEbitda: number | null;    // EV / EBITDA
  /** 日線收盤；空陣列代表無資料 */
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

  // 日股 (TYO / TSE)
  const tyo = ticker.match(/(?:TYO|TSE):\s*(\S+)/);
  if (tyo) return tyo[1] + ".T";

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

async function fetchAnalystAndFinancials(symbol: string) {
  // 一次抓 financialData + defaultKeyStatistics + summaryDetail（3 模組合 1 call）
  try {
    const qs = await yahooFinance.quoteSummary(symbol, {
      modules: ["financialData", "defaultKeyStatistics", "summaryDetail"],
    });
    const f = qs.financialData;
    const k = qs.defaultKeyStatistics;
    const s = qs.summaryDetail;
    return {
      // 分析師
      targetMean: f?.targetMeanPrice ?? null,
      targetHigh: f?.targetHighPrice ?? null,
      targetLow: f?.targetLowPrice ?? null,
      targetMedian: f?.targetMedianPrice ?? null,
      recommendationMean: f?.recommendationMean ?? null,
      recommendationKey: f?.recommendationKey ?? null,
      numberOfAnalystOpinions: f?.numberOfAnalystOpinions ?? null,
      // 財務面（多為小數，0.25 = 25%）
      profitMargin: f?.profitMargins ?? null,
      grossMargin: f?.grossMargins ?? null,
      operatingMargin: f?.operatingMargins ?? null,
      revenueGrowthYoY: f?.revenueGrowth ?? null,
      earningsGrowthYoY: f?.earningsGrowth ?? null,
      returnOnEquity: f?.returnOnEquity ?? null,
      returnOnAssets: f?.returnOnAssets ?? null,
      totalDebt: f?.totalDebt ?? null,
      totalCash: f?.totalCash ?? null,
      freeCashflow: f?.freeCashflow ?? null,
      // 比率
      pegRatio: k?.pegRatio ?? null,
      priceToBook: k?.priceToBook ?? null,
      beta: k?.beta ?? s?.beta ?? null,
      dividendYield: s?.dividendYield ?? null,
      enterpriseValue: k?.enterpriseValue ?? null,
      enterpriseToRevenue: k?.enterpriseToRevenue ?? null,
      enterpriseToEbitda: k?.enterpriseToEbitda ?? null,
    };
  } catch {
    return {
      targetMean: null,
      targetHigh: null,
      targetLow: null,
      targetMedian: null,
      recommendationMean: null,
      recommendationKey: null,
      numberOfAnalystOpinions: null,
      profitMargin: null,
      grossMargin: null,
      operatingMargin: null,
      revenueGrowthYoY: null,
      earningsGrowthYoY: null,
      returnOnEquity: null,
      returnOnAssets: null,
      totalDebt: null,
      totalCash: null,
      freeCashflow: null,
      pegRatio: null,
      priceToBook: null,
      beta: null,
      dividendYield: null,
      enterpriseValue: null,
      enterpriseToRevenue: null,
      enterpriseToEbitda: null,
    };
  }
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
  const baseAnalyst = await fetchAnalystAndFinancials(symbol);
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
    ...baseAnalyst,
    history: [],
  };

  let q: Awaited<ReturnType<typeof fetchQuoteOnly>> | null = null;
  try {
    q = await fetchQuoteOnly(symbol);
  } catch (err) {
    fallback.error = err instanceof Error ? err.message : String(err);
  }

  let history: HistoryPoint[] = [];
  try {
    history = await fetchChart(symbol);
  } catch (err) {
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
    ...baseAnalyst,
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
      const gm = q.grossMargin != null ? (q.grossMargin * 100).toFixed(0) + "%" : "—";
      const rg = q.revenueGrowthYoY != null ? (q.revenueGrowthYoY * 100).toFixed(0) + "%" : "—";
      const rec = q.recommendationKey ?? "—";
      const hist = q.history.length;
      const tag = q.error
        ? `⚠ ${q.error.slice(0, 50)}`
        : `✓ ${priceTxt}  fPE=${fpe}  GM=${gm}  RevYoY=${rg}  ${rec}  hist=${hist}`;
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
