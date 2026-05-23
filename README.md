# AI 基礎建設股票地圖：台股與美股

> 為台灣半導體 / SerDes 工程師量身整理的 AI 基礎建設供應鏈研究站。
> 包含 **60 家公司**、**12 個產業分類**、**7 個瓶頸對照**、**45+ 技術名詞**、護城河與風險矩陣。
> **僅供研究與教育用途，不構成任何投資建議。**

## ✦ 功能總覽

- 中文介面（zh-TW），所有 UI、表格、過濾器、術語解釋皆為繁體中文
- 12 個產業分類：AI 運算晶片、HBM、晶圓代工、先進封裝、高速網路晶片、SerDes、銅纜、光通訊、AI 伺服器、電源、散熱、資料中心
- 另含 2 個專題頁：技術名詞解釋、供應鏈總覽（合計 14 個主導覽項目）
- 互動式：搜尋、市場 / 分類 / 供應鏈位置 / AI 重要性 / 技術標籤多重過濾
- 視覺化：14 節點供應鏈圖、壓力傳導圖、護城河雷達圖（SVG）、風險矩陣熱圖
- 給 SerDes 工程師的視角：每個分類與部分公司都附上「給高速介面工程師」的補充
- 防止「腦補」：所有事實有 `sourceUrls`，主觀分析放在 `analystView` 欄位，市場資料一律標 `requires live API`
- 深色 / 淺色主題，使用者偏好會記憶於 `localStorage`

## ✦ 技術堆疊

- React 19 + TypeScript + Vite
- Tailwind CSS v3（自訂 brand 色票）
- React Router v7
- 自製 SVG 視覺化（不引入 Recharts，bundle 較小）

## ✦ 安裝與啟動

```bash
# 安裝
npm install

# 開發伺服器
npm run dev               # http://localhost:5173

# 編譯與型別檢查
npm run build             # tsc -b && vite build

# 程式碼風格檢查
npm run lint              # eslint .

# Production 預覽
npm run preview           # http://localhost:4173
```

## ✦ 專案結構

```
src/
├── components/           # UI 元件
│   ├── Layout.tsx        # 全站導覽 + 主題切換 + 頁尾免責
│   ├── ThemeToggle.tsx
│   ├── Disclaimer.tsx
│   ├── Badge.tsx         # 市場、信心、AI 重要性等 chip
│   ├── CategoryCard.tsx
│   ├── CompanyCard.tsx
│   ├── FilterBar.tsx     # 公司列表多重篩選
│   ├── MoatChart.tsx     # 護城河 SVG 雷達圖、風險 bar
│   └── SupplyChainDiagram.tsx
│
├── pages/
│   ├── Home.tsx          # 首頁：sup chain + stack + 14 分類入口
│   ├── Categories.tsx    # 分類總覽
│   ├── CategoryDetail.tsx# 單一分類詳細（含比較表）
│   ├── Companies.tsx     # 公司列表（含全站搜尋 / 篩選）
│   ├── CompanyDetail.tsx # 公司詳細頁
│   ├── Glossary.tsx      # 技術名詞解釋（可搜 / 可分類）
│   ├── SupplyChain.tsx   # 供應鏈總覽（含 domain 分組）
│   ├── Bottlenecks.tsx   # 瓶頸 → 受惠者對照
│   ├── RiskMap.tsx       # 7 維度風險矩陣熱圖
│   └── Moats.tsx         # 6 維度技術護城河矩陣
│
├── data/
│   ├── categories.ts     # 14 個分類
│   ├── companies.ts      # 55 家公司資料
│   ├── glossary.ts       # 60+ 術語
│   ├── bottlenecks.ts    # 7 個瓶頸與受惠者
│   └── supplyChain.ts    # 供應鏈節點與依賴邊
│
├── lib/
│   ├── utils.ts          # cn、scoreLabel、各種中文標籤
│   └── filter.ts         # 公司列表過濾與排序邏輯
│
├── services/
│   └── marketData.ts     # 市值 / 股價抽象層（目前全部 placeholder）
│
├── context/
│   ├── ThemeContext.tsx
│   └── themeContextValue.ts
│
├── types/
│   └── index.ts          # 全站 TypeScript 型別
│
├── index.css             # Tailwind + 全站樣式
└── main.tsx              # 入口與路由
```

## ✦ 資料 Schema

每家公司皆遵循以下結構（見 `src/types/index.ts`）：

```ts
interface Company {
  id: string;
  name: string;            // 公司名稱（中英）
  nameEn: string;
  ticker: string;          // 含交易所，例 "NASDAQ: NVDA"
  market: "US" | "Taiwan" | "Private";
  category: CategorySlug[];        // 可跨類別
  aiImportanceScore: 1 | 2 | 3 | 4 | 5;
  supplyChainPosition: "Upstream" | "Midstream" | "Downstream";
  coreProducts: string[];
  whatTheyDo: string;              // 事實型
  aiRelevance: string;             // 事實型
  competitiveAdvantage: string;    // 事實 + 簡短評論
  competitors: string[];
  risks: string[];
  keyCustomersOrEcosystem: string;
  technicalKeywords: string[];
  tags: string[];                  // 跨類別搜尋用
  valuationSensitivity: ValuationSensitivity[];
  moat: MoatScore;                 // 0-5 × 6 維度（主觀）
  risk: RiskScore;                 // 0-5 × 7 維度（主觀）
  analystView?: string;            // 主觀分析（清楚標示）
  serdesAngle?: string;            // 給 SerDes 工程師視角
  sourceUrls: string[];            // 一定要有
  confidenceLevel: "High" | "Medium" | "Low";
  lastUpdated: string;             // YYYY-MM-DD
  marketData?: MarketDataPlaceholder; // 一律 "requires live API"
}
```

## ✦ 資料更新流程

1. **新增公司**：在 `src/data/companies.ts` 加上一筆 `Company` 物件。
   - 至少要有 `whatTheyDo`、`aiRelevance`、`sourceUrls`、`confidenceLevel`、`lastUpdated`。
   - `category` 至少填一個分類 slug；可跨類別。
   - 任何不確定的客戶 / 市占資訊，請在 `keyCustomersOrEcosystem` 中寫「需個別查證」並降低 `confidenceLevel`。
2. **新增分類**：在 `src/data/categories.ts` 加上 `Category`，並到 `src/types/index.ts` 把 slug 加進 `CategorySlug` 聯集型別。
3. **新增術語**：在 `src/data/glossary.ts` 加上 `GlossaryTerm`。
4. **新增瓶頸對照**：在 `src/data/bottlenecks.ts` 加上 `BottleneckMapping`。

### 來源優先序

| 等級 | 範例 | 用法 |
|------|------|------|
| 最佳 | 公司年報 / 10-K / 投資人簡報 | 事實型欄位 |
| 高 | 公司產品頁、官方新聞稿 | 產品線、技術描述 |
| 中 | 主流半導體分析媒體（SemiAnalysis、IEEE、EE Times） | 趨勢與比較 |
| 不採用 | 未具名「業內人士」、含目標價的個股推薦文 | 一律剔除 |

## ✦ 連接即時股價 / 市值（可選）

`src/services/marketData.ts` 已定義 `MarketDataFetcher` 介面，預設為 `PlaceholderFetcher`。
若想接入即時資料，只要：

1. 實作新的 fetcher：

```ts
class YahooFinanceFetcher implements MarketDataFetcher {
  async fetch(ticker: string) {
    // 呼叫 Yahoo Finance / Bloomberg / TWSE API
    return { marketCap: "...", peRatio: "...", ... };
  }
}
```

2. 替換預設 `marketDataService`：

```ts
export const marketDataService: MarketDataFetcher = new YahooFinanceFetcher();
```

UI 端無須修改 — `CompanyDetail` 頁面已可顯示真實值，自動取代 placeholder。

## ✦ 反幻覺原則

- 事實與意見分開：所有主觀評論放在 `analystView` 欄位，視覺上會以 amber 邊框獨立呈現。
- 數字一律標來源：本網站不放硬編財務數字；所有市場資料欄位皆為 `"requires live API"`。
- 信心等級：每家公司、每個瓶頸對照都有 `confidenceLevel`，UI 上以 chip 呈現。
- 來源 URL：每家公司至少列一個官方來源（IR、product page、SEC、TWSE MOPS）。

## ✦ 後續可擴充清單

- [ ] 串接即時行情：實作 `MarketDataFetcher`
- [ ] 加入更多新創公司（Groq、Cerebras、SambaNova、Tenstorrent 等私募 AI 加速器公司）
- [ ] 新增「事件時間軸」：把 Nvidia 路線圖、HBM4 量產、CoWoS 擴產等事件排程化
- [ ] PWA / 離線快取
- [ ] 公司資料的 JSON Schema 驗證（zod）
- [ ] 多語切換（English / 日本語）— 已在型別預留 `nameEn`、`labelEn`
- [ ] 自動抓 IR / 10-K 更新時間
- [ ] 替每家公司加上「股價走勢圖」（透過 marketData service）
- [ ] 加入「我的關注清單」（localStorage）
- [ ] 把目前的「鍵盤可達性」打磨到 WCAG 2.1 AA

## ✦ 免責聲明

本網站內容**僅供產業與技術研究使用，不構成任何投資建議**。
股票投資涉及風險，請自行判斷並查證最新財務資料。
資料整理時間：2026-05-24。
