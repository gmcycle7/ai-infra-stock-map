// 「自上次造訪後變動了什麼」工具
// 把上次看到的價格 snapshot 存在 localStorage，下次比對

import { companies } from "../data/companies";
import { getQuote, lastFetchedAt } from "../services/marketData";
import { windowReturn } from "./priceWindow";

const KEY = "ai-infra-last-visit";

interface Snapshot {
  visitedAt: string;        // ISO
  fetchedAt: string;        // ISO (which marketData snapshot)
  prices: Record<string, number>;
  targets: Record<string, number>;
  recommendations: Record<string, string>;
}

interface VisitChange {
  visitedAt: string;
  fetchedAt: string;
  priceChanges: Array<{ id: string; name: string; from: number; to: number; pct: number; ticker: string }>;
  targetChanges: Array<{ id: string; name: string; from: number; to: number; pct: number; ticker: string }>;
  ratingChanges: Array<{ id: string; name: string; from: string; to: string; ticker: string }>;
}

function readSnapshot(): Snapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeSnapshot(s: Snapshot) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

/** 拍快照（呼叫時把目前所有公司價格、目標價、評等存起來） */
export function buildSnapshot(): Snapshot {
  const prices: Record<string, number> = {};
  const targets: Record<string, number> = {};
  const recommendations: Record<string, string> = {};
  for (const c of companies) {
    const q = getQuote(c.id);
    if (q?.price != null) prices[c.id] = q.price;
    if (q?.targetMean != null) targets[c.id] = q.targetMean;
    if (q?.recommendationKey) recommendations[c.id] = q.recommendationKey;
  }
  return {
    visitedAt: new Date().toISOString(),
    fetchedAt: lastFetchedAt,
    prices,
    targets,
    recommendations,
  };
}

/** 取得「自上次造訪後的變動」；若無上次紀錄則回傳 null */
export function getChangesSinceLastVisit(): VisitChange | null {
  const prev = readSnapshot();
  if (!prev) return null;

  const priceChanges: VisitChange["priceChanges"] = [];
  const targetChanges: VisitChange["targetChanges"] = [];
  const ratingChanges: VisitChange["ratingChanges"] = [];

  for (const c of companies) {
    const q = getQuote(c.id);
    if (!q) continue;
    // price
    const prevP = prev.prices[c.id];
    if (prevP != null && q.price != null && prevP > 0 && Math.abs(q.price - prevP) / prevP >= 0.005) {
      priceChanges.push({
        id: c.id,
        name: c.name,
        ticker: c.ticker,
        from: prevP,
        to: q.price,
        pct: ((q.price - prevP) / prevP) * 100,
      });
    }
    // target
    const prevT = prev.targets[c.id];
    if (prevT != null && q.targetMean != null && prevT > 0 && Math.abs(q.targetMean - prevT) / prevT >= 0.01) {
      targetChanges.push({
        id: c.id,
        name: c.name,
        ticker: c.ticker,
        from: prevT,
        to: q.targetMean,
        pct: ((q.targetMean - prevT) / prevT) * 100,
      });
    }
    // rating
    const prevR = prev.recommendations[c.id];
    if (prevR && q.recommendationKey && prevR !== q.recommendationKey) {
      ratingChanges.push({
        id: c.id,
        name: c.name,
        ticker: c.ticker,
        from: prevR,
        to: q.recommendationKey,
      });
    }
  }

  // 排序：絕對變動最大者在前
  priceChanges.sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
  targetChanges.sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));

  return {
    visitedAt: prev.visitedAt,
    fetchedAt: prev.fetchedAt,
    priceChanges,
    targetChanges,
    ratingChanges,
  };
}

/** 拍新快照（建議在 /changes 頁面看完後手動觸發） */
export function markVisited(): void {
  writeSnapshot(buildSnapshot());
}

/** 「短時間最大變動」 — 與 last visit 無關，是當前 marketData 中近 7 / 30 天最大移動 */
export function getRecentMovers(): {
  weekUp: Array<{ id: string; name: string; ticker: string; pct: number }>;
  weekDown: Array<{ id: string; name: string; ticker: string; pct: number }>;
  monthUp: Array<{ id: string; name: string; ticker: string; pct: number }>;
  monthDown: Array<{ id: string; name: string; ticker: string; pct: number }>;
} {
  const week: Array<{ id: string; name: string; ticker: string; pct: number }> = [];
  const month: Array<{ id: string; name: string; ticker: string; pct: number }> = [];
  for (const c of companies) {
    const q = getQuote(c.id);
    if (!q?.history) continue;
    const r7 = windowReturn(q.history, 5);
    const r30 = windowReturn(q.history, 22);
    if (r7 != null) week.push({ id: c.id, name: c.name, ticker: c.ticker, pct: r7 });
    if (r30 != null) month.push({ id: c.id, name: c.name, ticker: c.ticker, pct: r30 });
  }
  return {
    weekUp: [...week].sort((a, b) => b.pct - a.pct).slice(0, 10),
    weekDown: [...week].sort((a, b) => a.pct - b.pct).slice(0, 10),
    monthUp: [...month].sort((a, b) => b.pct - a.pct).slice(0, 10),
    monthDown: [...month].sort((a, b) => a.pct - b.pct).slice(0, 10),
  };
}
