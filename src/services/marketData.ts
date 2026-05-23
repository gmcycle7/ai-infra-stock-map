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

export interface LiveQuote {
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
  quotes: Record<string, LiveQuote>;
}

const market = rawMarketData as MarketDataFile;

/** 最近一次抓取時間（ISO 8601 字串） */
export const lastFetchedAt: string = market.fetchedAt;

/** 取得指定公司的最新報價（依 company id） */
export function getQuote(companyId: string): LiveQuote | null {
  return market.quotes[companyId] ?? null;
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

/** 合併 Company 與最新報價（供 detail 頁使用） */
export function enrichWithQuote(company: Company): Company & { liveQuote: LiveQuote | null } {
  return { ...company, liveQuote: getQuote(company.id) };
}
