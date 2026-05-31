// =====================================================================
// 市場資料服務
//
// 目前實作：讀取 src/data/marketData.json（由 scripts/fetch-prices.ts
// 透過 GitHub Action 每日從 Yahoo Finance 抓取）。
//
// 若要改為即時 API，可在這個檔案內換掉 fetcher，UI 不需修改。
// =====================================================================

import type { Company } from "../types";
import rawMarketData from "../data/marketData.json";

export interface HistoryPoint {
  /** "YYYY-MM-DD" */
  d: string;
  /** 收盤價 */
  c: number;
}

export interface LiveQuote {
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
  /** 分析師目標價 */
  targetMean: number | null;
  targetHigh: number | null;
  targetLow: number | null;
  targetMedian: number | null;
  /** 平均建議：1 (Strong Buy) → 5 (Strong Sell) */
  recommendationMean: number | null;
  recommendationKey: string | null;
  numberOfAnalystOpinions: number | null;
  /** 財務面（小數，例如 0.25 = 25%） */
  profitMargin: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  revenueGrowthYoY: number | null;
  earningsGrowthYoY: number | null;
  returnOnEquity: number | null;
  returnOnAssets: number | null;
  totalDebt: number | null;
  totalCash: number | null;
  freeCashflow: number | null;
  pegRatio: number | null;
  priceToBook: number | null;
  beta: number | null;
  dividendYield: number | null;
  enterpriseValue: number | null;
  enterpriseToRevenue: number | null;
  enterpriseToEbitda: number | null;
  /** 持股結構與 Short Interest */
  heldPercentInsiders: number | null;
  heldPercentInstitutions: number | null;
  shortPercentOfFloat: number | null;
  shortRatio: number | null;
  sharesShort: number | null;
  insiderNetTxnCount: number | null;
  insiderNetShares: number | null;
  history: HistoryPoint[];
  error?: string;
}

interface MarketDataFile {
  fetchedAt: string;
  historyDays?: number;
  quotes: Record<string, LiveQuote>;
  benchmarks?: Record<string, LiveQuote>;
}

const market = rawMarketData as MarketDataFile;

/** 最近一次抓取時間（ISO 8601 字串） */
export const lastFetchedAt: string = market.fetchedAt;

/** 取得指定公司的最新報價（依 company id） */
export function getQuote(companyId: string): LiveQuote | null {
  return market.quotes[companyId] ?? null;
}

/** 取得對照基準（SOXX、SMH、SPX、0050、TWII） */
export function getBenchmark(id: "soxx" | "smh" | "spx" | "tw50" | "twii"): LiveQuote | null {
  return market.benchmarks?.[id] ?? null;
}

/** 列出所有對照基準 */
export const BENCHMARK_LABELS: Record<string, string> = {
  soxx: "SOXX 美國半導體",
  smh: "SMH 半導體 ETF",
  spx: "S&P 500",
  tw50: "0050 台灣 50",
  twii: "加權指數",
};

/** 為公司選擇預設對照基準（美股 → SOXX；台股 → 0050；其他 → SPX） */
export function defaultBenchmarkFor(market_: "US" | "Taiwan" | "Private"): string {
  if (market_ === "Taiwan") return "tw50";
  if (market_ === "US") return "soxx";
  return "spx";
}

/** 是否有有效報價（有價格） */
export function hasValidQuote(companyId: string): boolean {
  const q = market.quotes[companyId];
  return !!q && q.price != null && !q.error;
}

/** 把市值（數字）格式化為易讀字串，依幣別 */
export function formatMarketCap(marketCap: number | null, currency: string): string {
  if (marketCap == null) return "—";
  if (currency === "TWD") {
    // 兆 / 億
    if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)} 兆 TWD`;
    if (marketCap >= 1e8) return `${(marketCap / 1e8).toFixed(0)} 億 TWD`;
    return `${marketCap.toLocaleString()} TWD`;
  }
  if (currency === "KRW") {
    if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T KRW`;
    if (marketCap >= 1e8) return `${(marketCap / 1e8).toFixed(1)}億 KRW`;
    return `${marketCap.toLocaleString()} KRW`;
  }
  // USD / EUR 等
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T ${currency}`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B ${currency}`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M ${currency}`;
  return `$${marketCap.toLocaleString()} ${currency}`;
}

/** 格式化股價 */
export function formatPrice(price: number | null, currency: string): string {
  if (price == null) return "—";
  if (currency === "KRW") return `${Math.round(price).toLocaleString()} ${currency}`;
  if (currency === "TWD") return `${price.toFixed(2)} TWD`;
  return `$${price.toFixed(2)} ${currency}`;
}

/** 格式化漲跌幅（百分比） */
export function formatChangePct(pct: number | null): string {
  if (pct == null) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

/** 格式化 P/E ratio */
export function formatPE(pe: number | null): string {
  if (pe == null) return "—";
  return pe.toFixed(1);
}

/** 把 ISO timestamp 轉成台灣讀者習慣的格式 */
export function formatFetchedAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

/** 相對時間：剛剛 / N 小時前 / N 天前 */
export function formatRelativeTime(iso: string): { label: string; tone: string; days: number } {
  try {
    const ms = Date.now() - new Date(iso).getTime();
    if (ms < 0) return { label: "未來", tone: "text-slate-500", days: 0 };
    const minutes = Math.floor(ms / (60 * 1000));
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    if (minutes < 60) return { label: minutes <= 1 ? "剛剛" : `${minutes} 分鐘前`, tone: "text-emerald-600 dark:text-emerald-400", days: 0 };
    if (hours < 24) return { label: `${hours} 小時前`, tone: "text-emerald-600 dark:text-emerald-400", days: 0 };
    if (days < 3) return { label: `${days} 天前`, tone: "text-sky-600 dark:text-sky-400", days };
    if (days < 7) return { label: `${days} 天前`, tone: "text-amber-600 dark:text-amber-400", days };
    return { label: `${days} 天前 ⚠️`, tone: "text-rose-600 dark:text-rose-400", days };
  } catch {
    return { label: "?", tone: "text-slate-500", days: 0 };
  }
}

/** 合併 Company 與最新報價（供 detail 頁使用） */
export function enrichWithQuote(company: Company): Company & { liveQuote: LiveQuote | null } {
  return { ...company, liveQuote: getQuote(company.id) };
}

// ---------- 分析師建議格式化 ----------
export const RECOMMENDATION_LABELS: Record<string, { zh: string; tone: string }> = {
  strong_buy: { zh: "強力買進", tone: "text-emerald-700 dark:text-emerald-300" },
  buy: { zh: "買進", tone: "text-emerald-600 dark:text-emerald-400" },
  hold: { zh: "持有", tone: "text-amber-600 dark:text-amber-400" },
  sell: { zh: "賣出", tone: "text-rose-600 dark:text-rose-400" },
  strong_sell: { zh: "強力賣出", tone: "text-rose-700 dark:text-rose-300" },
  none: { zh: "無評等", tone: "text-slate-500 dark:text-slate-400" },
};

export function formatRecommendation(key: string | null): { zh: string; tone: string } {
  if (!key) return RECOMMENDATION_LABELS.none;
  return RECOMMENDATION_LABELS[key] ?? RECOMMENDATION_LABELS.none;
}

/** 計算「目前價 → 目標價」的隱含上行空間（%） */
export function targetUpside(currentPrice: number | null, targetMean: number | null): number | null {
  if (currentPrice == null || targetMean == null || currentPrice <= 0) return null;
  return ((targetMean - currentPrice) / currentPrice) * 100;
}

// =====================================================================
// 財務指標格式化
// =====================================================================
export function formatPercent(v: number | null, digits = 1): string {
  if (v == null) return "—";
  return `${(v * 100).toFixed(digits)}%`;
}

export function formatRatio(v: number | null, digits = 2): string {
  if (v == null) return "—";
  return v.toFixed(digits);
}

export function formatLargeNumber(v: number | null, currency: string): string {
  if (v == null) return "—";
  return formatMarketCap(v, currency);
}
