import type { InvestmentType } from "../types";

export const investmentTypeDescriptions: Record<InvestmentType, string> = {
  核心平台型: "巨大護城河 + 高 AI 相關性；估值通常偏高，例：Nvidia、TSMC、ASML。",
  關鍵瓶頸型: "供給緊張時受惠最深；HBM、CoWoS、光通訊、散熱、電源屬之。",
  週期成長型: "AI capex 高 beta 受惠者；記憶體、ODM、設備 — 也承擔較高週期性風險。",
  技術升級受惠型: "受惠於 800G/1.6T、PCIe Gen6、CPO 等技術轉換；SerDes、retimer、AEC、光模組。",
  題材波動型: "AI 概念但相關性 / 訂單能見度待確認；題材敏感度高、需獨立查證。",
};

export const investmentTypePalette: Record<InvestmentType, string> = {
  核心平台型:
    "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300",
  關鍵瓶頸型:
    "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  週期成長型:
    "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300",
  技術升級受惠型:
    "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  題材波動型:
    "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300",
};
