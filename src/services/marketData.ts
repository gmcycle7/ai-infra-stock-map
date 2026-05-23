// =====================================================================
// 市場資料服務抽象層
//
// 目的：日後若要串接即時股價、市值、本益比等資料，
//      只需在這個檔案內換掉 fetcher，UI 不需改動。
//
// 目前所有實作皆為「placeholder」，回傳 "requires live API"。
// =====================================================================

import type { Company, MarketDataPlaceholder } from "../types";

export interface MarketDataFetcher {
  /** 取得單一公司的市值、股價等資料 */
  fetch(ticker: string): Promise<MarketDataPlaceholder>;
  /** 批次取得（之後可改用 batch API） */
  fetchMany(tickers: string[]): Promise<Record<string, MarketDataPlaceholder>>;
}

/**
 * 預設 placeholder：永遠回傳 "requires live API"
 * — 不會誤導使用者覺得這是真實即時數字。
 */
class PlaceholderFetcher implements MarketDataFetcher {
  async fetch(ticker: string): Promise<MarketDataPlaceholder> {
    return {
      marketCap: "requires live API",
      peRatio: "requires live API",
      revenueGrowth: "requires live API",
      grossMargin: "requires live API",
      stockPrice: "requires live API",
      ytdReturn: "requires live API",
      currency: ticker.startsWith("TWSE") || ticker.startsWith("TPEx") ? "TWD" : "USD",
      note: "尚未串接即時 API",
    };
  }

  async fetchMany(tickers: string[]): Promise<Record<string, MarketDataPlaceholder>> {
    const result: Record<string, MarketDataPlaceholder> = {};
    for (const t of tickers) {
      result[t] = await this.fetch(t);
    }
    return result;
  }
}

// 預設使用 placeholder；要改成真實 API，把這行換掉即可。
export const marketDataService: MarketDataFetcher = new PlaceholderFetcher();

/**
 * 合併公司靜態資料與市場資料（若沒有即時資料則回傳 placeholder）
 */
export async function enrichWithMarketData(company: Company): Promise<Company> {
  const live = await marketDataService.fetch(company.ticker);
  return { ...company, marketData: { ...company.marketData, ...live } };
}
