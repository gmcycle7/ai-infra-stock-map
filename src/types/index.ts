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

export interface Company {
  id: string;
  name: string;             // 公司名稱（中英）
  nameEn: string;
  ticker: string;           // 含交易所，例如 "NASDAQ: NVDA" 或 "TWSE: 2330"
  market: Market;
  category: CategorySlug[]; // 可跨類別
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
