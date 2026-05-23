import { Link } from "react-router-dom";

interface RubricItem {
  score: number;
  label: string;
  description: string;
  example?: string;
}

interface RubricSection {
  key: string;
  title: string;
  desc: string;
  examples: string[];
  rubric: RubricItem[];
}

// ============ AI 重要性 ============
const AI_IMPORTANCE: RubricItem[] = [
  { score: 5, label: "核心引擎", description: "公司營收 / 成長與 AI 直接強連動，是 AI 供應鏈不可繞過的節點", example: "Nvidia、TSMC、SK Hynix、ASML" },
  { score: 4, label: "重要受惠", description: "AI 業務已成主要成長動能（25%+ 營收貢獻或預期）", example: "AMD、Broadcom、Marvell、欣興、緯穎、AVC、奇鋐、Astera、Credo" },
  { score: 3, label: "次要受惠", description: "AI 為新成長動能，但仍有非 AI 業務支撐", example: "MediaTek、Intel、Coherent、Lite-On、TI" },
  { score: 2, label: "周邊相關", description: "AI 是次要題材，主力仍在傳統市場", example: "南亞科、Parade（顯示介面）" },
  { score: 1, label: "幾乎無關", description: "與 AI 連結極為間接", example: "—（本站不收錄此類）" },
];

// ============ Moat 維度 ============
const MOAT_SECTIONS: RubricSection[] = [
  {
    key: "process",
    title: "製程技術 process",
    desc: "自有或主導先進製程的能力（IDM 適用；fabless / EDA 通常 0-1）。",
    examples: ["TSMC / ASML = 5", "Intel / Samsung = 4", "Nvidia / AMD（fabless）= 0"],
    rubric: [
      { score: 5, label: "領先世代", description: "全球製程或設備領先 1-2 個世代", example: "TSMC、ASML、AMAT、Lam、KLA、TEL、Disco" },
      { score: 4, label: "前段班", description: "處於第一線製程梯隊", example: "Intel、Samsung Foundry、Advantest" },
      { score: 3, label: "成熟製程", description: "有自有產能但非最先進", example: "UMC、Powerchip、Globalfoundries" },
      { score: 2, label: "次級製程", description: "成熟特殊製程", example: "南亞科、Winbond（利基 DRAM）" },
      { score: 1, label: "代工外包", description: "純 fabless，但有自有 IP", example: "MediaTek、Synopsys、Cadence" },
      { score: 0, label: "無關", description: "純設計服務 / 軟體", example: "Alchip、GUC、Astera Labs" },
    ],
  },
  {
    key: "ipDesign",
    title: "IP / 設計能力 ipDesign",
    desc: "核心 IP（SerDes、架構、演算法）與晶片設計能力。",
    examples: ["Nvidia = 5（CUDA + GPU 架構）", "Synopsys / Cadence = 5（EDA + SerDes IP）", "Cisco = 4"],
    rubric: [
      { score: 5, label: "頂尖", description: "領先業界的核心架構或 IP，多家業者授權", example: "Nvidia、Synopsys、Cadence、Broadcom" },
      { score: 4, label: "前段", description: "完整自有 SoC / IP，具差異化", example: "AMD、MediaTek、Marvell、Astera、Credo" },
      { score: 3, label: "穩健", description: "成熟產品線，但難以單獨競爭", example: "Intel、Lite-On、AVC" },
      { score: 2, label: "標準化", description: "以製造或代工為主，設計差異化有限", example: "ODM 業者、傳統 DRAM" },
      { score: 1, label: "代工模式", description: "替客戶實作別人的設計", example: "Fabrinet、ASE EMS 部門" },
      { score: 0, label: "無", description: "純通路或硬體組裝", example: "—" },
    ],
  },
  {
    key: "ecosystem",
    title: "生態系鎖定 ecosystem",
    desc: "軟體 / 工具鏈 / 開發者社群 / 標準制定影響力。",
    examples: ["Nvidia = 5（CUDA）", "TSMC = 5（OIP 生態）", "ODM = 中等"],
    rubric: [
      { score: 5, label: "壟斷生態", description: "整個產業圍繞此公司轉", example: "Nvidia（CUDA）、TSMC（OIP）、ASML（EUV）、Synopsys/Cadence（EDA）" },
      { score: 4, label: "強生態", description: "客戶 / 標準依賴度高", example: "Arista（EOS）、Cisco、Broadcom（Tomahawk）、Aspeed（BMC）" },
      { score: 3, label: "中等", description: "有客戶基礎但替代性存在", example: "AMD、Coherent、Lumentum、Delta" },
      { score: 2, label: "弱", description: "標準化產品難以鎖定客戶", example: "傳統 DRAM、PCB、PSU" },
      { score: 1, label: "可替代", description: "純供應角色", example: "小型代工" },
    ],
  },
  {
    key: "customer",
    title: "客戶關係 customer",
    desc: "與 hyperscaler / 領先客戶的深度與長期合作。",
    examples: ["Nvidia / TSMC = 5（每家 hyperscaler 都離不開）"],
    rubric: [
      { score: 5, label: "深度綁定", description: "客戶廣 + 高黏著 + 多年合作", example: "Nvidia、TSMC、ASML、Synopsys、Arista" },
      { score: 4, label: "高黏著", description: "與少數大客戶深度合作", example: "Broadcom、Marvell、Wiwynn、世芯、Astera" },
      { score: 3, label: "中等", description: "客戶分散但替代性存在", example: "Amphenol、TE、Delta、Lite-On" },
      { score: 2, label: "通路型", description: "標準化產品、靠價格競爭", example: "中小型散熱 / 電源" },
    ],
  },
  {
    key: "manufacturing",
    title: "製造規模 manufacturing",
    desc: "自有或控制的產能、良率管理能力。Fabless / IP / EDA 通常 0。",
    examples: ["TSMC / Samsung = 5", "Synopsys = 0"],
    rubric: [
      { score: 5, label: "全球領先", description: "自有大規模產能 + 全球供應", example: "TSMC、Samsung、Foxconn、Quanta" },
      { score: 4, label: "重要規模", description: "有自有產能、規模顯著", example: "Intel、Micron、AMAT、Lam、ASE、緯創" },
      { score: 3, label: "中型製造", description: "有自有產能但規模較小", example: "Coherent、Lumentum、AVC、Auras、Delta" },
      { score: 2, label: "小型製造", description: "規模小、產能不為瓶頸", example: "Forcecon、Jentech" },
      { score: 0, label: "無自有產能", description: "純 fabless / 設計 / 軟體", example: "Nvidia、AMD、Synopsys、Cadence、Astera、Credo、Alchip、GUC" },
    ],
  },
  {
    key: "switching",
    title: "轉換成本 switching",
    desc: "客戶要更換供應商的痛苦程度（含 NRE、認證週期、軟體相容性）。",
    examples: ["Nvidia CUDA = 5", "BMC / EDA = 5", "標準化銅纜 = 2"],
    rubric: [
      { score: 5, label: "幾乎不可換", description: "軟體鎖定 / 數年認證 / 整個架構綁定", example: "Nvidia、TSMC、Synopsys、Cadence、ASML、Aspeed、Arista EOS" },
      { score: 4, label: "高轉換成本", description: "認證週期長 / 改設計成本高", example: "Broadcom、Marvell、Intel、Cisco、欣興" },
      { score: 3, label: "中等", description: "可換但需時間", example: "ODM、ASE、Delta" },
      { score: 2, label: "易替換", description: "標準化產品", example: "PSU、PCB、cable、commodity DRAM" },
    ],
  },
];

// ============ Risk 維度 ============
const RISK_SECTIONS: RubricSection[] = [
  {
    key: "nvidiaDependency",
    title: "Nvidia 依賴 nvidiaDependency",
    desc: "公司營收與 Nvidia 出貨節奏的綁定程度（越高 = 風險越大）。",
    examples: ["Supermicro = 5", "TSMC = 3（多元客戶）", "Ibiden = 3"],
    rubric: [
      { score: 5, label: "幾乎全綁", description: "AI 業務 80%+ 都跟 Nvidia 走", example: "Supermicro" },
      { score: 4, label: "高依賴", description: "Nvidia 是最大單一客戶 / 50%+ AI 比重", example: "緯創、廣達（AI 部分）、KYEC、Fabrinet、AVC、奇鋐" },
      { score: 3, label: "重要依賴", description: "Nvidia 是重要但非唯一客戶", example: "TSMC、Ibiden、Delta、緯穎、欣興" },
      { score: 2, label: "中等", description: "Nvidia 是客戶之一，分散度高", example: "Amphenol、TE、AMAT、Lam" },
      { score: 0, label: "無關 / 競爭對手", description: "Nvidia 是競爭對手或無業務關聯", example: "AMD、Intel、HBM 廠（直接客戶不是 Nvidia）" },
    ],
  },
  {
    key: "memoryCycle",
    title: "記憶體循環 memoryCycle",
    desc: "受 DRAM / NAND 價格循環影響的程度。",
    examples: ["Micron / SK Hynix = 5", "Lam = 5（記憶體 capex 客戶）"],
    rubric: [
      { score: 5, label: "純記憶體 beta", description: "記憶體 IDM 或設備", example: "Micron、SK Hynix、Samsung、南亞科、Lam、AMAT、Advantest、Disco" },
      { score: 4, label: "高曝險", description: "記憶體 capex 大幅影響", example: "KLA、TEL、Camtek" },
      { score: 3, label: "中等", description: "部分業務受影響", example: "ASE、Phison" },
      { score: 1, label: "低", description: "幾乎不受記憶體週期影響", example: "Nvidia、Cisco、Arista、Delta" },
    ],
  },
  {
    key: "chinaExport",
    title: "中國出口管制 chinaExport",
    desc: "受美國出口管制影響的程度（高階半導體相關 = 高）。",
    examples: ["ASML / Lam / AMAT / KLA = 4-5", "Cisco / Delta = 2"],
    rubric: [
      { score: 5, label: "嚴重受限", description: "中國市場大幅萎縮、產品被禁", example: "ASML（特定 EUV）" },
      { score: 4, label: "明顯影響", description: "中國市場有限制，但仍有業務", example: "AMAT、Lam、KLA、Nvidia、TEL、Intel、Synopsys、Cadence" },
      { score: 3, label: "中等", description: "中國產線 / 中國客戶有部分風險", example: "AMD、Broadcom、Foxconn、Coherent、Lumentum" },
      { score: 2, label: "低", description: "中國業務不大或為 commodity", example: "Cisco、Arista、Delta、Vertiv" },
      { score: 0, label: "無關", description: "完全不受影響", example: "—" },
    ],
  },
  {
    key: "customerConc",
    title: "客戶集中度 customerConc",
    desc: "前 3 大客戶營收占比過高的風險。",
    examples: ["世芯、緯穎、Astera、Credo、AAOI = 4-5"],
    rubric: [
      { score: 5, label: "極度集中", description: "單一客戶 30%+ 或前 3 大占 70%+", example: "Supermicro、AAOI、Credo、世芯（特定專案）" },
      { score: 4, label: "高集中", description: "前 3 大客戶占大半", example: "緯穎、Astera、京元電（部分產線）、Jentech、Fabrinet" },
      { score: 3, label: "中等", description: "客戶結構偏向少數大廠", example: "GUC、緯創、廣達、AVC、奇鋐、AcBel" },
      { score: 2, label: "分散", description: "客戶廣泛", example: "Amphenol、TE、Delta、Cisco" },
    ],
  },
  {
    key: "capexCycle",
    title: "Capex 循環 capexCycle",
    desc: "受 hyperscaler / fab capex 週期影響的程度。",
    examples: ["設備廠 = 5", "緯穎 = 4"],
    rubric: [
      { score: 5, label: "高 capex beta", description: "業務直接綁 capex 波動", example: "AMAT、Lam、KLA、ASML、TEL、Disco、Advantest、Vertiv" },
      { score: 4, label: "高", description: "明顯受 capex 影響", example: "Nvidia、Broadcom、Marvell、ODM、欣興、Coherent、Lumentum、AVC、奇鋐" },
      { score: 3, label: "中等", description: "週期相對溫和", example: "TSMC、Cisco、Schneider、Eaton" },
      { score: 2, label: "低", description: "業務相對穩定", example: "Synopsys、Cadence（訂閱制）、Aspeed（市占穩定）" },
    ],
  },
  {
    key: "valuation",
    title: "估值風險 valuation",
    desc: "目前市場估值是否已反映多年成長預期。",
    examples: ["Astera P/E 208 = 5", "Delta P/E 90 = 3", "Foxconn P/E 19 = 1"],
    rubric: [
      { score: 5, label: "極高", description: "本益比 > 80 或極端估值溢價", example: "Astera、Vertiv、欣興（部分時點）、MPS" },
      { score: 4, label: "高", description: "本益比 40-80", example: "Nvidia、Broadcom、AVC、奇鋐、Credo、Cadence" },
      { score: 3, label: "中等", description: "本益比 20-40", example: "AMD、TSMC、Coherent、Eaton" },
      { score: 2, label: "合理", description: "本益比 10-20", example: "Quanta、Foxconn、緯穎、Inventec" },
      { score: 1, label: "便宜", description: "本益比 < 10 或負評", example: "（特定時點）" },
    ],
  },
  {
    key: "techTransition",
    title: "技術替代 techTransition",
    desc: "被新技術 / 新典範取代的風險（如 CPO 取代可插拔光、自研 ASIC 取代 GPU）。",
    examples: ["Coherent / Lumentum = 4（CPO 替代）", "Credo = 4（光通訊長期）"],
    rubric: [
      { score: 5, label: "極高", description: "技術典範可能短期內顛覆", example: "—" },
      { score: 4, label: "高", description: "明確的替代路線圖在發展中", example: "Coherent / Lumentum（CPO）、Credo（LPO/CPO）、AAOI、Intel（ARM / 自研 ASIC）" },
      { score: 3, label: "中等", description: "技術轉換有壓力但時程長", example: "Nvidia（自研 ASIC）、AMD、Cisco、Arista" },
      { score: 2, label: "低", description: "技術趨勢有利", example: "TSMC、ASML、Aspeed、Synopsys、Cadence" },
    ],
  },
];

// ============ Confidence Level ============
const CONFIDENCE: RubricItem[] = [
  { score: 3, label: "High", description: "多家可靠來源、公司官方揭露明確、產業共識強", example: "Nvidia、TSMC、ASML、Foxconn、AMAT、Lam、KLA、Delta、Coherent、Advantest" },
  { score: 2, label: "Medium", description: "部分資訊依產業共識推論、官方未完整揭露", example: "Alchip、GUC、KYEC、智邦、Astera、欣興、AVC、奇鋐、Jentech、Lotes、BizLink、Aspeed、Ibiden、Disco" },
  { score: 1, label: "Low", description: "資料較少、客戶身份多為推測、近年變動大", example: "M31、Forcecon、Shinko（公開上市狀態變動）" },
];

function RubricTable({ items }: { items: RubricItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2 w-12 text-center">分數</th>
            <th className="px-3 py-2 w-24">標籤</th>
            <th className="px-3 py-2">判準</th>
            <th className="px-3 py-2">範例公司</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((r) => (
            <tr key={r.score + r.label}>
              <td className="px-3 py-2 text-center font-mono font-bold tabular-nums">{r.score}</td>
              <td className="px-3 py-2 font-semibold">{r.label}</td>
              <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{r.description}</td>
              <td className="px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">{r.example ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, desc, items, hint }: { title: string; desc: string; items: RubricItem[]; hint?: string }) {
  return (
    <section className="card p-5">
      <h2 className="section-title">{title}</h2>
      <p className="muted mt-1 text-sm">{desc}</p>
      {hint && <p className="muted mt-1 text-xs italic">{hint}</p>}
      <div className="mt-3"><RubricTable items={items} /></div>
    </section>
  );
}

export function ScoringRubricPage() {
  return (
    <div className="space-y-6">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">原始評分判準</h1>
        <p className="muted mt-2 text-sm">
          這頁說明的是 KPI <strong>輸入層</strong>的 0-5 分數是怎麼打的：
          每家公司在「AI 重要性、6 個 moat 維度、7 個 risk 維度、Confidence Level」上的分數判準。
          <Link to="/kpi-method" className="ml-1 text-brand-600 hover:underline dark:text-brand-400">
            KPI 公式（如何把這些 0-5 分數合成 1-100 投資 KPI）
          </Link>
          、
          <Link to="/kpi-validation" className="ml-1 text-brand-600 hover:underline dark:text-brand-400">
            驗證 KPI 是否預測得到實際報酬
          </Link>
          。
        </p>
        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>誠實提醒：</strong>這些原始分數是我（網站作者 / AI）依據產業共識主觀打的。
          目的是建立「跨公司一致」的相對基準，<strong>絕對分數不代表預測能力</strong>。
          如果你不同意某家公司的某個分數，可自行修改 <code>src/data/companies.ts</code> — 公式會自動重算。
        </div>
      </header>

      <Section
        title="AI 重要性 aiImportanceScore（1-5）"
        desc="公司業務與 AI 主軸的連動程度。"
        items={AI_IMPORTANCE}
      />

      <section className="card p-5">
        <h2 className="section-title">護城河 Moat（6 維度 × 0-5）</h2>
        <p className="muted mt-2 text-sm">
          護城河衡量公司「保護獲利不被競爭侵蝕」的能力。
          總分越高，越屬「核心平台型」投資型態。
        </p>
        <div className="mt-3 space-y-5">
          {MOAT_SECTIONS.map((s) => (
            <div key={s.key}>
              <h3 className="text-base font-semibold">{s.title}</h3>
              <p className="muted mt-1 text-xs">{s.desc}</p>
              <div className="mt-2"><RubricTable items={s.rubric} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="section-title">風險 Risk（7 維度 × 0-5）</h2>
        <p className="muted mt-2 text-sm">
          風險分數越高代表「下檔波動 / 不確定性越大」。請與護城河獨立判讀。
        </p>
        <div className="mt-3 space-y-5">
          {RISK_SECTIONS.map((s) => (
            <div key={s.key}>
              <h3 className="text-base font-semibold">{s.title}</h3>
              <p className="muted mt-1 text-xs">{s.desc}</p>
              <div className="mt-2"><RubricTable items={s.rubric} /></div>
            </div>
          ))}
        </div>
      </section>

      <Section
        title="Confidence Level（資料信心）"
        desc="此筆公司資料的可驗證程度。低信心 ≠ 公司不好；只是表示資料來源有限。"
        items={CONFIDENCE}
      />

      <section className="card p-5 text-xs">
        <h2 className="section-title text-base">我有哪些「不打分」的決定？</h2>
        <ul className="muted mt-2 list-disc space-y-1 pl-5">
          <li><strong>市占率</strong>：太容易過時、口徑不同 — 只在文字描述中提及概略量級，不入分</li>
          <li><strong>營收成長、毛利率、EPS</strong>：屬即時財務資料，標示「需要資料驗證」，不入 moat / risk</li>
          <li><strong>客戶名單</strong>：除非公開揭露否則不寫；推論為主的標 Medium 信心</li>
          <li><strong>掌權人風格 / 個人風險</strong>：太主觀；僅列職位與姓名（見公司詳細頁的「掌權人」欄）</li>
        </ul>
      </section>
    </div>
  );
}
