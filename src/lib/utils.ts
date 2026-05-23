// 小型工具集（class name 合併、格式化等）
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

// 把 0-5 分數轉為文字描述
export function scoreLabel(n: number): string {
  if (n >= 4.5) return "極高";
  if (n >= 3.5) return "高";
  if (n >= 2.5) return "中";
  if (n >= 1.5) return "低";
  return "極低";
}

// 市場 → 中文標籤
export function marketLabel(m: "US" | "Taiwan" | "Private"): string {
  if (m === "US") return "美股";
  if (m === "Taiwan") return "台股";
  return "未上市 / 海外";
}

// 供應鏈位置 → 中文
export function positionLabel(p: "Upstream" | "Midstream" | "Downstream"): string {
  if (p === "Upstream") return "上游";
  if (p === "Midstream") return "中游";
  return "下游";
}

// 信心等級 → 中文
export function confidenceLabel(c: "High" | "Medium" | "Low"): string {
  if (c === "High") return "高";
  if (c === "Medium") return "中";
  return "低";
}

// 估值敏感度 → 中文
export const valuationLabels: Record<string, string> = {
  capexCycle: "Capex 循環",
  nvidiaCycle: "Nvidia 出貨循環",
  hyperscalerDemand: "Hyperscaler 需求",
  memoryCycle: "記憶體循環",
  serverDemand: "Server 需求",
  smartphoneCycle: "智慧型手機循環",
  pcCycle: "PC 循環",
  telecomCycle: "電信循環",
};

// 風險維度 → 中文
export const riskLabels: Record<string, string> = {
  nvidiaDependency: "Nvidia 依賴",
  memoryCycle: "記憶體循環",
  chinaExport: "中國出口管制",
  customerConc: "客戶集中",
  capexCycle: "Capex 循環",
  valuation: "估值風險",
  techTransition: "技術轉換",
};

// 護城河維度 → 中文
export const moatLabels: Record<string, string> = {
  process: "製程",
  ipDesign: "IP / 設計",
  ecosystem: "生態系",
  customer: "客戶關係",
  manufacturing: "製造規模",
  switching: "轉換成本",
};

// 分類顏色對應（Tailwind class string）
export const categoryColorClass: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
    ring: "ring-violet-200 dark:ring-violet-800",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    ring: "ring-amber-200 dark:ring-amber-800",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    ring: "ring-blue-200 dark:ring-blue-800",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800",
    ring: "ring-sky-200 dark:ring-sky-800",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    ring: "ring-emerald-200 dark:ring-emerald-800",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
    ring: "ring-indigo-200 dark:ring-indigo-800",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    ring: "ring-orange-200 dark:ring-orange-800",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-800",
    ring: "ring-cyan-200 dark:ring-cyan-800",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    ring: "ring-rose-200 dark:ring-rose-800",
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800",
    ring: "ring-yellow-200 dark:ring-yellow-800",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800",
    ring: "ring-teal-200 dark:ring-teal-800",
  },
  stone: {
    bg: "bg-stone-50 dark:bg-stone-900",
    text: "text-stone-700 dark:text-stone-300",
    border: "border-stone-200 dark:border-stone-800",
    ring: "ring-stone-200 dark:ring-stone-800",
  },
};

export function colorOf(colorName: string) {
  return categoryColorClass[colorName] ?? categoryColorClass.stone;
}

export function getStars(score: number, max = 5): string {
  return "★".repeat(score) + "☆".repeat(Math.max(0, max - score));
}
