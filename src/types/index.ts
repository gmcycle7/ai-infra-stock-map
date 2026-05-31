// 中文：AI 基礎建設股票地圖 — 核心型別定義

export type Market = "US" | "Taiwan" | "Private";
export type SupplyChainPosition = "Upstream" | "Midstream" | "Downstream";
export type ConfidenceLevel = "High" | "Medium" | "Low";

// 14 個分類的 slug（與導覽列一致）
export type CategorySlug =
  | "ai-compute"
  | "memory-hbm"
  | "foundry-equipment"
  | "advanced-packaging"
  | "network-chips"
  | "high-speed-interface"
  | "copper-interconnect"
  | "optical-communication"
  | "ai-server-odm"
  | "power-management"
  | "thermal-cooling"
  | "data-center-infra";

export interface Category {
  slug: CategorySlug;
  nameZh: string;
  nameEn: string;
  shortDesc: string;
  whyAiMatters: string;
  technicalKeywords: string[];
  position: SupplyChainPosition | "Mixed";
  domain: "Compute" | "Memory" | "Networking" | "Manufacturing" | "Server" | "Infrastructure";
  color: string; // tailwind color name
  serdesNote?: string; // 給 SerDes 工程師的補充
}

export type MoatDimension =
  | "process"        // 製程技術
  | "ipDesign"       // IP / 設計能力
  | "ecosystem"      // 生態系鎖定
  | "customer"       // 客戶關係
  | "manufacturing"  // 製造規模
  | "switching";     // 客戶轉換成本

export interface MoatScore {
  process: number;        // 0-5
  ipDesign: number;
  ecosystem: number;
  customer: number;
  manufacturing: number;
  switching: number;
}

export type RiskDimension =
  | "nvidiaDependency"   // Nvidia 依賴
  | "memoryCycle"        // 記憶體週期
  | "chinaExport"        // 中國出口管制
  | "customerConc"       // 客戶集中
  | "capexCycle"         // Capex 循環
  | "valuation"          // 估值風險
  | "techTransition";    // 技術轉換

export interface RiskScore {
  nvidiaDependency: number;   // 0-5（5 = 依賴最高 / 風險最大）
  memoryCycle: number;
  chinaExport: number;
  customerConc: number;
  capexCycle: number;
  valuation: number;
  techTransition: number;
}

// 估值敏感度（哪些循環會影響此公司）
export type ValuationSensitivity =
  | "capexCycle"
  | "nvidiaCycle"
  | "hyperscalerDemand"
  | "memoryCycle"
  | "serverDemand"
  | "smartphoneCycle"
  | "pcCycle"
  | "telecomCycle";

// 市場資料（佔位欄位 — requires live API）
export interface MarketDataPlaceholder {
  marketCap?: string;       // e.g. "requires live API"
  peRatio?: string;
  revenueGrowth?: string;
  grossMargin?: string;
  stockPrice?: string;
  ytdReturn?: string;
  currency?: "USD" | "TWD";
  note?: string;            // 一律標示 "requires live API"
}

// =====================================================================
// 掌權人 / 領導者評估
//
// 10 個維度，每個 0-5；加權合成 0-100 分（權重總和 = 100%）
//
//   1. strategicJudgement    戰略判斷力          15%
//   2. execution             執行力              15%
//   3. capitalAllocation     資本配置能力        15%
//   4. technicalProductInsight 技術 / 產品理解力 10%
//   5. talentOrganization    組織與人才能力      10%
//   6. integrityGovernance   正直與治理          10%
//   7. customerEcosystem     客戶與生態系經營     8%
//   8. resilience            逆風韌性             7%
//   9. financialDiscipline   財務紀律             5%
//  10. communication         溝通與市場信任       5%
//
// 嚴格原則：
//   - 評分高度主觀，僅供「相對比較」用，不可作為買賣依據
//   - 僅對任期長、公開資訊豐富的領導者打分
//   - 不確定者留空（不亂打 3 分濫竽充數）
//   - 信心 = 公開可驗證程度
// =====================================================================

export interface LeadershipScores {
  strategicJudgement: number;
  execution: number;
  capitalAllocation: number;
  technicalProductInsight: number;
  talentOrganization: number;
  integrityGovernance: number;
  customerEcosystem: number;
  resilience: number;
  financialDiscipline: number;
  communication: number;
}

/** 領導力 10 維度權重（總和 1.0） */
export const LEADERSHIP_WEIGHTS: Record<keyof LeadershipScores, number> = {
  strategicJudgement: 0.15,
  execution: 0.15,
  capitalAllocation: 0.15,
  technicalProductInsight: 0.10,
  talentOrganization: 0.10,
  integrityGovernance: 0.10,
  customerEcosystem: 0.08,
  resilience: 0.07,
  financialDiscipline: 0.05,
  communication: 0.05,
};

/** 中文標籤對應 */
export const LEADERSHIP_LABELS: Record<keyof LeadershipScores, string> = {
  strategicJudgement: "戰略判斷力",
  execution: "執行力",
  capitalAllocation: "資本配置能力",
  technicalProductInsight: "技術 / 產品理解力",
  talentOrganization: "組織與人才能力",
  integrityGovernance: "正直與治理",
  customerEcosystem: "客戶與生態系經營",
  resilience: "逆風韌性",
  financialDiscipline: "財務紀律",
  communication: "溝通與市場信任",
};

export interface KeyPerson {
  role: string;   // "CEO" | "Chairman" | "Founder" | "President" | "CTO" 等
  name: string;   // 英文姓名
  nameZh?: string; // 中文姓名（如有）
  since?: number;  // 上任年份
  note?: string;   // 例如「創辦人」、「TSMC 前任 CEO」
  /** 一兩句簡介（公開事實為主） */
  bio?: string;
  /** 6 維度評分（0-5）；不確定者整個欄位省略 */
  leadership?: LeadershipScores;
  /** 信心：對此筆評分的可驗證程度 */
  leadershipConfidence?: "High" | "Medium" | "Low";
}

export interface Company {
  id: string;
  name: string;             // 公司名稱（中英）
  nameEn: string;
  ticker: string;           // 含交易所，例如 "NASDAQ: NVDA" 或 "TWSE: 2330"
  market: Market;
  category: CategorySlug[]; // 可跨類別
  /** 主要掌權者 / 創辦人（如可公開查證） */
  keyPeople?: KeyPerson[];
  aiImportanceScore: 1 | 2 | 3 | 4 | 5;
  supplyChainPosition: SupplyChainPosition;
  coreProducts: string[];   // 主要產品
  whatTheyDo: string;       // 這家公司在做什麼（事實描述）
  aiRelevance: string;      // 為什麼跟 AI 有關
  competitiveAdvantage: string; // 相對競爭對手的最大優勢
  competitors: string[];    // 主要競爭對手
  risks: string[];          // 主要風險
  keyCustomersOrEcosystem: string; // 主要客戶 / 生態系
  technicalKeywords: string[]; // 技術標籤
  tags: string[];           // 例如 GPU、HBM、CoWoS、SerDes、Optical
  valuationSensitivity: ValuationSensitivity[];
  moat: MoatScore;
  risk: RiskScore;
  analystView?: string;     // 主觀分析（與事實清楚分開）
  serdesAngle?: string;     // 給 SerDes 工程師的視角
  sourceUrls: string[];
  confidenceLevel: ConfidenceLevel;
  lastUpdated: string;      // YYYY-MM-DD
  marketData?: MarketDataPlaceholder;
}

// 瓶頸 → 受惠者對照
export interface BottleneckMapping {
  id: string;
  nameZh: string;
  nameEn: string;
  description: string;       // 瓶頸現況與成因
  beneficiaries: Array<{
    companyId: string;
    reason: string;
  }>;
  sourceUrls: string[];
  confidenceLevel: ConfidenceLevel;
  lastUpdated: string;
}

export interface GlossaryTerm {
  term: string;             // 英文 / 縮寫
  termZh: string;           // 中文翻譯
  category: CategorySlug | "general";
  shortDef: string;         // 一句話定義
  longDef: string;          // 詳細說明（含 SerDes 視角）
  related: string[];        // 相關詞
}

// 供應鏈節點（依賴關係）
export interface SupplyChainNode {
  id: string;
  labelZh: string;
  labelEn: string;
  category: CategorySlug | "demand";
  domain: "Compute" | "Memory" | "Networking" | "Manufacturing" | "Server" | "Infrastructure" | "Demand";
}

export interface SupplyChainEdge {
  from: string;
  to: string;
  label?: string; // 例如「驅動 HBM 需求」
}

// =====================================================================
// 投資 KPI
//
// 嚴格原則：
//  - 所有分數皆「從現有公司欄位（moat、risk、aiImportanceScore、
//    valuationSensitivity、category）推導」，不額外捏造財務數字。
//  - 每個分數 1-100，並提供可解釋的權重公式（見 src/lib/kpi.ts）。
//  - 機會分數（4 個 horizons）與風險分數「分開呈現」，不合併為單一誤導性數字。
//  - 本評分僅供研究與技術產業分析參考，不構成投資建議。
// =====================================================================

export type InvestmentType =
  | "核心平台型"   // 巨大護城河 + 高 AI 相關性，通常估值偏高
  | "關鍵瓶頸型"   // HBM / CoWoS / 光通訊 / 散熱 / 電源 — 供給緊張時受惠最深
  | "週期成長型"   // 記憶體、ODM、設備 — Capex 循環高槓桿
  | "技術升級受惠型" // 800G/1.6T、SerDes、retimer、AEC — 技術轉換受惠
  | "題材波動型";  // AI 概念但相關性不確定，題材敏感度高

export type KpiHorizon = "shortTerm" | "threeYear" | "fiveYear" | "tenYear";

export interface InvestmentKpi {
  // ---- 4 個時間維度的合成分數 (1-100) ----
  shortTermScore: number;
  threeYearScore: number;
  fiveYearScore: number;
  tenYearScore: number;

  // ---- 短期細項 (1-100) ----
  aiRevenueExposure: number;
  revenueMomentum: number;
  earningsMomentum: number;
  orderVisibility: number;
  nearTermCatalyst: number;
  marketSentiment: number;
  valuationReratingPotential: number;

  // ---- 3 年細項 ----
  revenueGrowthPotential: number;
  marginExpansionPotential: number;
  supplyChainBottleneckBenefit: number;
  customerPenetration: number;
  executionQuality: number;

  // ---- 5 年細項 ----
  technologyMoat: number;
  ecosystemLockIn: number;
  pricingPower: number;
  marketShareExpansionPotential: number;
  supplyChainImportance: number;
  managementExecution: number;

  // ---- 10 年細項 ----
  structuralDemandExposure: number;
  irreplaceability: number;
  platformValue: number;
  tamExpansion: number;
  rdStrength: number;
  balanceSheetResilience: number;
  technologyTransitionSurvivability: number;

  // ---- 風險細項 ----
  valuationRisk: number;
  cyclicalityRisk: number;
  customerConcentrationRisk: number;
  geopoliticalRisk: number;
  technologyDisruptionRisk: number;
  executionRisk: number;

  // ---- 合成風險分數 (1-100，越高代表風險越大) ----
  riskScore: number;

  // ---- 領導力分數 (1-100；若無資料則為 null，UI 顯示「資料不足」) ----
  leadershipScore: number | null;
  /** 領導力是否影響 KPI 整體調整 */
  leadershipAdjustmentApplied: boolean;
  leadershipNote?: string;

  // ---- 雷達圖 10 維度（從上面欄位重新組合而成）----
  radar: {
    aiRelevance: number;
    growthPotential: number;
    technologyMoat: number;
    customerQuality: number;
    pricingPower: number;
    supplyChainImportance: number;
    financialResilience: number;
    valuationRisk: number;
    cyclicalityRisk: number;
    disruptionRisk: number;
  };

  // ---- 分類與說明 ----
  investmentType: InvestmentType;
  kpiCommentary: string;
  kpiConfidenceLevel: ConfidenceLevel;
  kpiLastUpdated: string;
  kpiSourceUrls: string[];

  /** 此筆 KPI 是否含未經驗證的財務假設（永遠 true 至串接即時財報前） */
  needsFinancialVerification: boolean;
}
