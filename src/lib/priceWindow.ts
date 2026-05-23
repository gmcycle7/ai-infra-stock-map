import type { HistoryPoint } from "../services/marketData";

/** 取最後 windowSize 個點的漲跌幅（%） */
export function windowReturn(data: HistoryPoint[], windowSize = 90): number | null {
  if (!data || data.length < 2) return null;
  const view = data.slice(-windowSize);
  if (view.length < 2) return null;
  const first = view[0].c;
  const last = view[view.length - 1].c;
  if (first <= 0) return null;
  return ((last - first) / first) * 100;
}
