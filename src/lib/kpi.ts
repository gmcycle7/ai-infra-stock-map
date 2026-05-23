// =====================================================================
// 投資 KPI 評分引擎
//
// 設計原則：
//   1. 所有分數都從 src/data/companies.ts 既有欄位「公式化推導」，
//      不額外捏造財務數字（避免幻覺）。
//   2. 每個分項都有可解釋的權重，並在 src/pages/KpiMethod.tsx 完整公開。
//   3. 機會分數（短期 / 三年 / 五年 / 十年）與風險分數分開呈現。
//   4. 「需要資料驗證」的欄位（如即時 EPS、營收成長率）尚未串接 →
//       本檔僅做「產業邏輯評分」。
// =====================================================================

import type {
  Company,
  InvestmentKpi,
  InvestmentType,
  CategorySlug,
  KpiHorizon,
} from "../types";

// 將 0-5 分數轉成 1-100 分（保持線性，避免變形）
function s100(v: number): number {
  return Math.max(1, Math.min(100, Math.round(v * 20)));
}

function r100(v: number): number {
  return Math.max(1, Math.min(100, Math.round(v)));
}

// 「熱門」/「瓶頸」分類集合（用於修正係數）
const HOT_CATS: Set<CategorySlug> = new Set([
  "ai-compute",
  "memory-hbm",
  "network-chips",
  "optical-communication",
  "ai-server-odm",
]);

const WARM_CATS: Set<CategorySlug> = new Set([
  "advanced-packaging",
  "power-management",
  "thermal-cooling",
  "high-speed-interface",
  "copper-interconnect",
]);

const BOTTLENECK_CATS: Set<CategorySlug> = new Set([
  "memory-hbm",
  "advanced-packaging",
  "optical-communication",
  "power-management",
  "thermal-cooling",
]);

const UPGRADE_CATS: Set<CategorySlug> = new Set([
  "high-speed-interface",
  "copper-interconnect",
  "optical-communication",
  "network-chips",
]);

// =====================================================================
// 分類器：5 種投資型態
// =====================================================================
export function classifyInvestmentType(c: Company): InvestmentType {
  const moatSum =
    c.moat.process + c.moat.ipDesign + c.moat.ecosystem + c.moat.switching;
  const ai = c.aiImportanceScore;

  // 核心平台型：超高護城河 + 高 AI
  if (moatSum >= 16 && ai >= 4) return "核心平台型";

  // 關鍵瓶頸型：在瓶頸類別且 AI 重要性高
  if (c.category.some((cc) => BOTTLENECK_CATS.has(cc)) && ai >= 4) {
    return "關鍵瓶頸型";
  }

  // 技術升級受惠型：高速介面 / 光通訊 / 銅纜 / 網路 + AI ≥ 3
  if (c.category.some((cc) => UPGRADE_CATS.has(cc)) && ai >= 3) {
    return "技術升級受惠型";
  }

  // 題材波動型：信心低或 AI 重要性低
  if (c.confidenceLevel === "Low" || ai <= 2) return "題材波動型";

  // 預設：週期成長型（記憶體、ODM、設備）
  return "週期成長型";
}

// =====================================================================
// 主推導函式
// =====================================================================
export function deriveKpi(c: Company): InvestmentKpi {
  const moat = c.moat;
  const risk = c.risk;
  const ai = c.aiImportanceScore;
  const isHot = c.category.some((cc) => HOT_CATS.has(cc));
  const isWarm = c.category.some((cc) => WARM_CATS.has(cc));
  const isBottleneck = c.category.some((cc) => BOTTLENECK_CATS.has(cc));

  // ---------------------------------------------------------------
  // 短期細項
  // ---------------------------------------------------------------
  const aiRevenueExposure = s100(ai);

  let rm = ai;
  if (isHot) rm += 1;
  else if (isWarm && ai >= 3) rm += 0.5;
  if (c.confidenceLevel === "Low") rm -= 0.5;
  const revenueMomentum = s100(rm);

  const earningsMomentum = s100(rm - risk.capexCycle * 0.2);

  const isODM = c.tags.includes("AI Server") || c.tags.includes("ODM Direct");
  const orderVisibility = s100(
    isODM ? 4.5 : ai >= 4 ? 4 : ai,
  );

  const nearTermCatalyst = s100(isHot ? Math.min(ai + 0.5, 5) : ai);

  // 市場情緒 ≈ AI 重要性 + 估值溢價（高估值 = 高關注）
  const marketSentiment = s100((ai + risk.valuation * 0.5) / 1.5);

  // 估值重評潛力 = 3 + (AI − 估值風險) / 2；估值越貴、潛力越低
  const valuationReratingPotential = s100(3 + (ai - risk.valuation) * 0.5);

  const shortTermScore = r100(
    0.25 * revenueMomentum +
      0.2 * earningsMomentum +
      0.2 * nearTermCatalyst +
      0.15 * marketSentiment +
      0.1 * valuationReratingPotential +
      0.1 * orderVisibility,
  );

  // ---------------------------------------------------------------
  // 3 年細項
  // ---------------------------------------------------------------
  const revenueGrowthPotential = s100((rm + ai) / 2);
  const marginExpansionPotential = s100(
    (moat.ipDesign + moat.ecosystem) / 2 - risk.memoryCycle * 0.3,
  );
  const supplyChainBottleneckBenefit = s100(
    isBottleneck ? Math.min(ai + 0.5, 5) : ai - 0.5,
  );
  const customerPenetration = s100((ai + moat.customer) / 2);
  const execRaw =
    c.confidenceLevel === "High" ? 4 : c.confidenceLevel === "Medium" ? 3.5 : 3;
  const executionQuality = s100(execRaw);

  const threeYearScore = r100(
    0.25 * aiRevenueExposure +
      0.2 * revenueGrowthPotential +
      0.15 * marginExpansionPotential +
      0.15 * supplyChainBottleneckBenefit +
      0.15 * customerPenetration +
      0.1 * executionQuality,
  );

  // ---------------------------------------------------------------
  // 5 年細項
  // ---------------------------------------------------------------
  const technologyMoat = s100((moat.process + moat.ipDesign) / 2);
  const ecosystemLockIn = s100(moat.ecosystem);
  const pricingPower = s100(
    (moat.ipDesign + moat.ecosystem + moat.switching) / 3 -
      risk.capexCycle * 0.2,
  );
  const marketShareExpansionPotential = s100(
    (ai + moat.customer) / 2 - risk.techTransition * 0.3,
  );
  const supplyChainImportance = s100(
    Math.min(ai * (c.supplyChainPosition === "Upstream" ? 1.2 : 1), 5),
  );
  const managementExecution = s100(execRaw);

  const fiveYearScore = r100(
    0.25 * technologyMoat +
      0.2 * ecosystemLockIn +
      0.15 * pricingPower +
      0.15 * marketShareExpansionPotential +
      0.15 * supplyChainImportance +
      0.1 * managementExecution,
  );

  // ---------------------------------------------------------------
  // 10 年細項
  // ---------------------------------------------------------------
  const structuralDemandExposure = s100(ai);
  const irreplaceability = s100(
    (moat.process + moat.ecosystem + moat.switching) / 3,
  );
  const platformValue = s100((moat.ecosystem + moat.switching) / 2);
  const tamExpansion = s100(ai + (isHot ? 0.5 : 0) - 0.5);
  const rdStrength = s100((moat.process + moat.ipDesign) / 2);
  const balanceSheetResilience = s100((moat.manufacturing + 3) / 2);
  const technologyTransitionSurvivability = s100(
    (moat.process + moat.ipDesign + 3) / 3 - risk.techTransition * 0.3,
  );

  const tenYearScore = r100(
    0.25 * structuralDemandExposure +
      0.2 * irreplaceability +
      0.15 * platformValue +
      0.15 * tamExpansion +
      0.1 * rdStrength +
      0.1 * balanceSheetResilience +
      0.05 * technologyTransitionSurvivability,
  );

  // ---------------------------------------------------------------
  // 風險細項
  // ---------------------------------------------------------------
  const valuationRisk = s100(risk.valuation);
  const cyclicalityRisk = s100(risk.capexCycle);
  const customerConcentrationRisk = s100(risk.customerConc);
  const geopoliticalRisk = s100(risk.chinaExport);
  const technologyDisruptionRisk = s100(risk.techTransition);
  // 製造規模越小、執行風險越高
  const executionRisk = s100(5 - moat.manufacturing);

  const riskScore = r100(
    0.2 * valuationRisk +
      0.2 * cyclicalityRisk +
      0.15 * customerConcentrationRisk +
      0.15 * geopoliticalRisk +
      0.15 * technologyDisruptionRisk +
      0.15 * executionRisk,
  );

  // ---------------------------------------------------------------
  // 雷達圖 10 維度（複用上面已算過的分數）
  // ---------------------------------------------------------------
  const radar = {
    aiRelevance: aiRevenueExposure,
    growthPotential: revenueGrowthPotential,
    technologyMoat,
    customerQuality: s100((moat.customer + moat.ecosystem) / 2),
    pricingPower,
    supplyChainImportance,
    financialResilience: balanceSheetResilience,
    valuationRisk,
    cyclicalityRisk,
    disruptionRisk: technologyDisruptionRisk,
  };

  // ---------------------------------------------------------------
  // 分類 + 摘要
  // ---------------------------------------------------------------
  const investmentType = classifyInvestmentType(c);
  const kpiCommentary = generateCommentary(c, {
    shortTermScore,
    threeYearScore,
    fiveYearScore,
    tenYearScore,
    riskScore,
    investmentType,
  });

  return {
    shortTermScore,
    threeYearScore,
    fiveYearScore,
    tenYearScore,
    aiRevenueExposure,
    revenueMomentum,
    earningsMomentum,
    orderVisibility,
    nearTermCatalyst,
    marketSentiment,
    valuationReratingPotential,
    revenueGrowthPotential,
    marginExpansionPotential,
    supplyChainBottleneckBenefit,
    customerPenetration,
    executionQuality,
    technologyMoat,
    ecosystemLockIn,
    pricingPower,
    marketShareExpansionPotential,
    supplyChainImportance,
    managementExecution,
    structuralDemandExposure,
    irreplaceability,
    platformValue,
    tamExpansion,
    rdStrength,
    balanceSheetResilience,
    technologyTransitionSurvivability,
    valuationRisk,
    cyclicalityRisk,
    customerConcentrationRisk,
    geopoliticalRisk,
    technologyDisruptionRisk,
    executionRisk,
    riskScore,
    radar,
    investmentType,
    kpiCommentary,
    kpiConfidenceLevel: c.confidenceLevel,
    kpiLastUpdated: c.lastUpdated,
    kpiSourceUrls: c.sourceUrls,
    needsFinancialVerification: true,
  };
}

interface Scores {
  shortTermScore: number;
  threeYearScore: number;
  fiveYearScore: number;
  tenYearScore: number;
  riskScore: number;
  investmentType: InvestmentType;
}

function generateCommentary(c: Company, s: Scores): string {
  const parts: string[] = [];
  parts.push(`歸類：${s.investmentType}`);
  if (s.shortTermScore >= 70) parts.push("短期催化強");
  else if (s.shortTermScore < 45) parts.push("短期動能弱");
  if (s.fiveYearScore >= 70) parts.push("五年護城河深");
  if (s.tenYearScore >= 70) parts.push("十年結構性受惠");
  if (s.riskScore >= 65) parts.push("風險偏高");
  if (c.confidenceLevel !== "High") parts.push(`資料信心 ${c.confidenceLevel}`);
  return parts.join("，") + "。";
}

// =====================================================================
// 標籤對應
// =====================================================================
export const horizonLabels: Record<KpiHorizon, string> = {
  shortTerm: "短期催化分數",
  threeYear: "三年成長分數",
  fiveYear: "五年護城河分數",
  tenYear: "十年結構性價值分數",
};

export function horizonScore(kpi: InvestmentKpi, h: KpiHorizon): number {
  switch (h) {
    case "shortTerm":
      return kpi.shortTermScore;
    case "threeYear":
      return kpi.threeYearScore;
    case "fiveYear":
      return kpi.fiveYearScore;
    case "tenYear":
      return kpi.tenYearScore;
  }
}

export const horizonHints: Record<KpiHorizon, { high: string; mid: string; low: string }> = {
  shortTerm: {
    high: "短期催化強",
    mid: "短期催化中等",
    low: "短期催化弱",
  },
  threeYear: {
    high: "三年 AI 成長候選股",
    mid: "三年 AI 成長中等",
    low: "三年 AI 成長有限",
  },
  fiveYear: {
    high: "五年長期複利候選",
    mid: "五年護城河中等",
    low: "五年護城河有限",
  },
  tenYear: {
    high: "核心 AI 基礎建設公司",
    mid: "重要但有週期性",
    low: "AI 相關但相對投機",
  },
};

export function horizonLabel(score: number, h: KpiHorizon): string {
  if (score >= 70) return horizonHints[h].high;
  if (score >= 50) return horizonHints[h].mid;
  return horizonHints[h].low;
}

// 給雷達圖的中文標籤
export const radarLabels: Record<keyof InvestmentKpi["radar"], string> = {
  aiRelevance: "AI 相關性",
  growthPotential: "成長潛力",
  technologyMoat: "技術護城河",
  customerQuality: "客戶品質",
  pricingPower: "定價力",
  supplyChainImportance: "供應鏈重要性",
  financialResilience: "財務韌性",
  valuationRisk: "估值風險",
  cyclicalityRisk: "景氣循環風險",
  disruptionRisk: "技術替代風險",
};

// 給投資型態的顏色
export const investmentTypeColor: Record<InvestmentType, string> = {
  核心平台型: "violet",
  關鍵瓶頸型: "amber",
  週期成長型: "sky",
  技術升級受惠型: "emerald",
  題材波動型: "rose",
};

// =====================================================================
// 9 大儀表板問題的 helper：排序
// =====================================================================
import { companies } from "../data/companies";

const kpiCache = new Map<string, InvestmentKpi>();
export function getKpi(c: Company): InvestmentKpi {
  const cached = kpiCache.get(c.id);
  if (cached) return cached;
  const k = deriveKpi(c);
  kpiCache.set(c.id, k);
  return k;
}

export function allKpis(): Array<{ company: Company; kpi: InvestmentKpi }> {
  return companies.map((c) => ({ company: c, kpi: getKpi(c) }));
}

export type DashboardQuestion =
  | "shortTermCatalyst"
  | "threeYearGrowth"
  | "fiveYearMoat"
  | "tenYearStructural"
  | "highestRisk"
  | "nvidiaExposure"
  | "networkUpgrade"
  | "hbmCowos"
  | "powerCooling"
  | "cpoExposure";

export const dashboardQuestions: Record<DashboardQuestion, { zh: string; en: string }> = {
  shortTermCatalyst: { zh: "哪些公司短期催化最強？", en: "Highest short-term catalyst" },
  threeYearGrowth: { zh: "哪些公司三年 AI 成長性最高？", en: "Best 3-year AI growth" },
  fiveYearMoat: { zh: "哪些公司五年技術護城河最強？", en: "Strongest 5-year moat" },
  tenYearStructural: { zh: "哪些公司十年結構性價值最高？", en: "Highest 10-year structural value" },
  highestRisk: { zh: "哪些公司風險最高？", en: "Highest risk" },
  nvidiaExposure: { zh: "哪些公司最受惠於 Nvidia cycle？", en: "Most exposed to Nvidia cycle" },
  networkUpgrade: { zh: "哪些公司最受惠於 800G / 1.6T networking？", en: "Most exposed to 800G/1.6T networking" },
  hbmCowos: { zh: "哪些公司最受惠於 HBM / CoWoS bottleneck？", en: "Most exposed to HBM / CoWoS bottleneck" },
  powerCooling: { zh: "哪些公司最受惠於 AI server power & cooling？", en: "Most exposed to AI server power & cooling" },
  cpoExposure: { zh: "哪些公司最受惠於 CPO 共同封裝光學轉換？", en: "Most exposed to CPO transition" },
};

function sortByKpi(
  pred: (item: { company: Company; kpi: InvestmentKpi }) => boolean,
  scoreFn: (item: { company: Company; kpi: InvestmentKpi }) => number,
  limit = 10,
) {
  return allKpis()
    .filter(pred)
    .sort((a, b) => scoreFn(b) - scoreFn(a))
    .slice(0, limit);
}

export function answerQuestion(q: DashboardQuestion, limit = 10) {
  switch (q) {
    case "shortTermCatalyst":
      return sortByKpi(() => true, ({ kpi }) => kpi.shortTermScore, limit);
    case "threeYearGrowth":
      return sortByKpi(() => true, ({ kpi }) => kpi.threeYearScore, limit);
    case "fiveYearMoat":
      return sortByKpi(() => true, ({ kpi }) => kpi.fiveYearScore, limit);
    case "tenYearStructural":
      return sortByKpi(() => true, ({ kpi }) => kpi.tenYearScore, limit);
    case "highestRisk":
      return sortByKpi(() => true, ({ kpi }) => kpi.riskScore, limit);
    case "nvidiaExposure":
      return sortByKpi(
        ({ company }) =>
          company.valuationSensitivity.includes("nvidiaCycle") ||
          company.risk.nvidiaDependency >= 3,
        ({ company, kpi }) =>
          company.risk.nvidiaDependency * 20 + kpi.threeYearScore * 0.5,
        limit,
      );
    case "networkUpgrade":
      return sortByKpi(
        ({ company }) =>
          company.tags.some((t) =>
            ["Switch ASIC", "SerDes", "Optical Module", "AEC", "Retimer", "Optical DSP"].includes(t),
          ),
        ({ kpi }) => kpi.threeYearScore + kpi.fiveYearScore * 0.5,
        limit,
      );
    case "hbmCowos":
      return sortByKpi(
        ({ company }) =>
          company.tags.some((t) => ["HBM", "CoWoS", "ABF", "SoIC"].includes(t)) ||
          company.category.some((cc) =>
            ["memory-hbm", "advanced-packaging"].includes(cc),
          ),
        ({ kpi }) => kpi.threeYearScore + kpi.tenYearScore * 0.5,
        limit,
      );
    case "powerCooling":
      return sortByKpi(
        ({ company }) =>
          company.category.some((cc) =>
            ["power-management", "thermal-cooling"].includes(cc),
          ),
        ({ kpi }) => kpi.threeYearScore + kpi.fiveYearScore * 0.3,
        limit,
      );
    case "cpoExposure":
      return sortByKpi(
        ({ company }) =>
          company.tags.some((t) =>
            ["CPO", "Silicon Photonics", "Optical DSP", "Optical Module"].includes(t),
          ),
        ({ kpi }) => kpi.threeYearScore + kpi.tenYearScore * 0.5,
        limit,
      );
  }
}
