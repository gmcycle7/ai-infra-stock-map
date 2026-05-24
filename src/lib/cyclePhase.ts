import type { Company } from "../types";
import { companies } from "../data/companies";
import { getQuote } from "../services/marketData";
import { windowReturn } from "./priceWindow";

export type CyclePhase = "底部" | "復甦" | "成熟" | "高峰" | "資料不足";

export interface CycleInfo {
  phase: CyclePhase;
  description: string;
  tone: string;
  avg12mReturn: number | null;
  avgForwardPE: number | null;
  avgRevenueGrowth: number | null;
  n: number;
}

const PHASE_DESC: Record<CyclePhase, { description: string; tone: string }> = {
  底部: {
    description: "報酬負、估值偏低、成長停滯 — 通常代表進場機會逐步浮現，但需有催化事件",
    tone: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  復甦: {
    description: "報酬轉正、估值合理、營收回升 — 通常是循環中段的甜蜜點，風險報酬比佳",
    tone: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  成熟: {
    description: "報酬持續、估值偏高、成長放緩 — 仍可參與但需注意估值風險",
    tone: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  高峰: {
    description: "報酬極端、估值溢價極高、預期飽和 — 注意 reversion 風險；新進場需審慎",
    tone: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  資料不足: {
    description: "公司樣本或財務資料不足以判斷循環階段",
    tone: "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
};

export function categoryCyclePhase(slug: string): CycleInfo {
  const list = companies.filter((c) => c.category.includes(slug as Company["category"][number]));

  const returns: number[] = [];
  const pes: number[] = [];
  const growths: number[] = [];

  for (const c of list) {
    const q = getQuote(c.id);
    if (!q) continue;
    if (q.history) {
      const r = windowReturn(q.history, 252);
      if (r != null) returns.push(r);
    }
    if (q.forwardPE != null && q.forwardPE > 0 && q.forwardPE < 500) pes.push(q.forwardPE);
    if (q.revenueGrowthYoY != null) growths.push(q.revenueGrowthYoY * 100);
  }

  if (returns.length < 3) {
    return {
      phase: "資料不足",
      ...PHASE_DESC["資料不足"],
      avg12mReturn: null,
      avgForwardPE: null,
      avgRevenueGrowth: null,
      n: list.length,
    };
  }

  const avgR = returns.reduce((s, v) => s + v, 0) / returns.length;
  const avgPE = pes.length > 0 ? pes.reduce((s, v) => s + v, 0) / pes.length : null;
  const avgG = growths.length > 0 ? growths.reduce((s, v) => s + v, 0) / growths.length : null;

  // 分類規則：
  let phase: CyclePhase;
  if (avgR < -5 && (avgPE == null || avgPE < 25)) {
    phase = "底部";
  } else if (avgR > 50 || (avgR > 30 && avgPE != null && avgPE > 60)) {
    phase = "高峰";
  } else if (avgR > 15 && (avgPE != null && avgPE > 35)) {
    phase = "成熟";
  } else {
    phase = "復甦";
  }

  return {
    phase,
    ...PHASE_DESC[phase],
    avg12mReturn: avgR,
    avgForwardPE: avgPE,
    avgRevenueGrowth: avgG,
    n: list.length,
  };
}
