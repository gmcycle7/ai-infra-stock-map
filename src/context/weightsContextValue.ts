import { createContext, useContext } from "react";

export interface KpiWeights {
  shortTerm: number;
  threeYear: number;
  fiveYear: number;
  tenYear: number;
  /** 0-1：從 composite 扣多少 risk × ratio */
  riskDiscount: number;
}

export const DEFAULT_WEIGHTS: KpiWeights = {
  shortTerm: 25,
  threeYear: 25,
  fiveYear: 25,
  tenYear: 25,
  riskDiscount: 30,
};

export const PRESETS: Array<{ key: string; label: string; w: KpiWeights }> = [
  { key: "balanced", label: "平衡型", w: { shortTerm: 25, threeYear: 25, fiveYear: 25, tenYear: 25, riskDiscount: 30 } },
  { key: "shortTrader", label: "短期投機", w: { shortTerm: 70, threeYear: 20, fiveYear: 5, tenYear: 5, riskDiscount: 10 } },
  { key: "growth", label: "成長型（3 年）", w: { shortTerm: 15, threeYear: 55, fiveYear: 25, tenYear: 5, riskDiscount: 25 } },
  { key: "moat", label: "護城河派（5 年）", w: { shortTerm: 5, threeYear: 25, fiveYear: 50, tenYear: 20, riskDiscount: 40 } },
  { key: "compounder", label: "長期複利（10 年）", w: { shortTerm: 5, threeYear: 15, fiveYear: 30, tenYear: 50, riskDiscount: 50 } },
  { key: "deepValue", label: "深度價值（嚴格避險）", w: { shortTerm: 10, threeYear: 25, fiveYear: 30, tenYear: 35, riskDiscount: 70 } },
];

export interface WeightsContextValue {
  weights: KpiWeights;
  setWeights: (w: KpiWeights) => void;
  reset: () => void;
  isCustom: boolean;
}

export const WeightsContext = createContext<WeightsContextValue | null>(null);

export function useWeights(): WeightsContextValue {
  const ctx = useContext(WeightsContext);
  if (!ctx) throw new Error("useWeights must be used inside WeightsProvider");
  return ctx;
}

/** 依權重計算自訂合成分數 */
export function customComposite(kpi: import("../types").InvestmentKpi, w: KpiWeights): number {
  const totalH = w.shortTerm + w.threeYear + w.fiveYear + w.tenYear;
  if (totalH <= 0) return 0;
  const raw =
    (w.shortTerm * kpi.shortTermScore +
      w.threeYear * kpi.threeYearScore +
      w.fiveYear * kpi.fiveYearScore +
      w.tenYear * kpi.tenYearScore) /
    totalH;
  const discounted = raw - (w.riskDiscount / 100) * kpi.riskScore;
  return Math.max(1, Math.min(100, Math.round(discounted + (w.riskDiscount / 100) * 50))); // 加回 50 中位風險，避免全部變負
}
