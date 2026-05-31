import { Link } from "react-router-dom";

interface RubricRow {
  score: number;
  description: string;
  example?: string;
}

interface Section {
  key: string;
  title: string;
  weight: number;
  desc: string;
  rows: RubricRow[];
}

const SECTIONS: Section[] = [
  {
    key: "strategicJudgement",
    title: "戰略判斷力 strategicJudgement",
    weight: 0.15,
    desc: "對產業長期方向的判斷與選擇能力。能在不確定中做關鍵決策、避免戰略誤判。CUDA、純晶圓代工這類「顛覆性下注」是 5 分。",
    rows: [
      { score: 5, description: "提前 5-10 年看到趨勢並重押資源", example: "黃仁勳（CUDA）、張忠謀（純代工）、林百里（AI server）、Larry Ellison（OCI）" },
      { score: 4, description: "策略前瞻、布局明確", example: "蘇姿丰、Hock Tan、CC Wei、Adam Norwitt" },
      { score: 3, description: "跟得上產業主軸" },
      { score: 2, description: "策略偏被動" },
    ],
  },
  {
    key: "execution",
    title: "執行力 execution",
    weight: 0.15,
    desc: "把策略落地的紀律與速度。承諾兌現率、產品時程、營運效率是關鍵指標。",
    rows: [
      { score: 5, description: "公開承諾大致兌現、產品時程穩定", example: "蘇姿丰（AMD Zen 路線圖）、CC Wei（TSMC 製程節奏）、Jayshree Ullal、Andy Jassy" },
      { score: 4, description: "執行穩健，偶有延誤但能補救", example: "Hock Tan、Sanjay Mehrotra、Charles Liang" },
      { score: 3, description: "中等執行力" },
      { score: 2, description: "頻繁延誤或產品 / 財報失準" },
    ],
  },
  {
    key: "capitalAllocation",
    title: "資本配置能力 capitalAllocation",
    weight: 0.15,
    desc: "併購 / R&D / 買回 / 配息的取捨品質。不是「投越多」越好，而是 ROIC 與長期股東報酬。",
    rows: [
      { score: 5, description: "連續多筆有價值的併購 + 紀律性買回", example: "Hock Tan（Broadcom 系列併購）、Adam Norwitt（Amphenol）、Bruce Cheng、Tony Guzzi（EMCOR）" },
      { score: 4, description: "資本配置紀律佳", example: "蘇姿丰、Matt Murphy、Gary Dickerson、Eaton" },
      { score: 3, description: "中等，無明顯失誤" },
      { score: 2, description: "有過昂貴失敗併購或 R&D 浪費" },
    ],
  },
  {
    key: "technicalProductInsight",
    title: "技術 / 產品理解力 technicalProductInsight",
    weight: 0.10,
    desc: "對自家技術與產品有深度理解能力。能在技術細節 + 商業決策間做精準權衡。Engineer-CEO 通常較高。",
    rows: [
      { score: 5, description: "engineering 背景 + 對核心技術有深度理解", example: "黃仁勳、蘇姿丰、CC Wei、Michael Hsing、Anirudh Devgan、Olivier Pomel" },
      { score: 4, description: "工程出身但部分業務需仰賴技術長", example: "Hock Tan、Andy Jassy、Sanjay Mehrotra" },
      { score: 3, description: "商業背景但理解技術" },
      { score: 2, description: "純商業背景，依賴 CTO" },
    ],
  },
  {
    key: "talentOrganization",
    title: "組織與人才能力 talentOrganization",
    weight: 0.10,
    desc: "建構文化 + 吸引並留住一流人才的能力。在科技業這是長期決定勝負的因素之一。",
    rows: [
      { score: 5, description: "能聚集頂尖人才、文化清晰", example: "蘇姿丰（重建 AMD）、林百里、張忠謀、Bruce Cheng、Satya Nadella、Larry Ellison" },
      { score: 4, description: "穩定文化、留任率高", example: "黃仁勳、CC Wei、Craig Arnold、Adam Norwitt" },
      { score: 3, description: "中等" },
      { score: 2, description: "高壓 / 高 turnover 風格", example: "Hock Tan（公開以裁員聞名）" },
    ],
  },
  {
    key: "integrityGovernance",
    title: "正直與治理 integrityGovernance",
    weight: 0.10,
    desc: "揭露透明、信譽、無重大爭議、治理結構健全。會計爭議、揭露遲延、突然撤回財測都是減分。",
    rows: [
      { score: 5, description: "無爭議紀錄、揭露主動且誠實", example: "張忠謀、林百里、Bruce Cheng、CC Wei、蘇姿丰" },
      { score: 4, description: "標準合規、無重大事件", example: "多數穩健經營者" },
      { score: 3, description: "有過小型爭議但已處理" },
      { score: 2, description: "有重大會計 / 揭露爭議", example: "Charles Liang（SMCI 2024 揭露事件）、Elon Musk（SEC 多次糾紛）" },
      { score: 1, description: "曾被監管處分或司法調查", example: "Jay Y. Lee（賄賂案，已特赦）" },
    ],
  },
  {
    key: "customerEcosystem",
    title: "客戶與生態系經營 customerEcosystem",
    weight: 0.08,
    desc: "與大客戶 / 生態系夥伴的關係深度。標準 / 工具 / 開發者社群的影響力。",
    rows: [
      { score: 5, description: "壟斷生態 / 整個產業圍著他轉", example: "黃仁勳（CUDA）、張忠謀（OIP）、Larry Ellison（OCI + Oracle DB）、Wendell Weeks（Corning）、Jayshree Ullal" },
      { score: 4, description: "深度大客戶綁定", example: "蘇姿丰、Hock Tan、Chris Lin（Aspeed BMC）、Andy Jassy" },
      { score: 3, description: "客戶分散但替代性存在" },
      { score: 2, description: "商品化產品難建生態" },
    ],
  },
  {
    key: "resilience",
    title: "逆風韌性 resilience",
    weight: 0.07,
    desc: "在產業低谷、公司危機中堅持並轉型的能力。長期任期 + 經歷過至少一次大循環者得高分。",
    rows: [
      { score: 5, description: "經歷多次大循環仍領先（10+ 年任期 + 至少一次危機翻身）", example: "黃仁勳、張忠謀、林百里、蘇姿丰、Bruce Cheng、Michael Hsing" },
      { score: 4, description: "經歷一次以上週期 + 穩定執行", example: "Hock Tan、Gary Dickerson、Matt Murphy、Andy Jassy" },
      { score: 3, description: "穩定但任期尚未經歷大循環" },
      { score: 2, description: "任期短或經歷過危機但反應不佳" },
    ],
  },
  {
    key: "financialDiscipline",
    title: "財務紀律 financialDiscipline",
    weight: 0.05,
    desc: "成本控制、毛利率、自由現金流、不過度燒錢。「不為成長犧牲獲利」的紀律。",
    rows: [
      { score: 5, description: "業界財務紀律典範（高毛利、穩健現金流）", example: "Hock Tan、林百里、Adam Norwitt、CC Wei、Safra Catz、Bruce Cheng" },
      { score: 4, description: "穩健紀律" },
      { score: 3, description: "中等" },
      { score: 2, description: "燒錢 / 弱現金流", example: "Charles Liang（毛利率波動大）、Thompson Lin（AAOI 歷史財務波動）、Elon Musk（特斯拉早期）" },
    ],
  },
  {
    key: "communication",
    title: "溝通與市場信任 communication",
    weight: 0.05,
    desc: "法說會、IR、媒體溝通質量。對股東是否可預期？面對壞消息是否誠實揭露？",
    rows: [
      { score: 5, description: "法說會清楚、訊息一致、可預期性高", example: "黃仁勳、蘇姿丰、Jayshree Ullal、Satya Nadella、Nikesh Arora" },
      { score: 4, description: "穩健溝通", example: "多數穩健經營者" },
      { score: 3, description: "中等" },
      { score: 2, description: "訊息不一致或迴避壞消息", example: "Charles Liang（撤回財報事件）、Jay Y. Lee" },
    ],
  },
];

function RubricTable({ rows }: { rows: RubricRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th className="w-12 px-3 py-2 text-center">分數</th>
            <th className="px-3 py-2">判準</th>
            <th className="px-3 py-2">範例</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((r) => (
            <tr key={r.score}>
              <td className="px-3 py-2 text-center font-mono font-bold tabular-nums">{r.score}</td>
              <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{r.description}</td>
              <td className="px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">{r.example ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LeadershipRubricPage() {
  return (
    <div className="space-y-6">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">領導力評分判準（10 維度）</h1>
        <p className="muted mt-2 text-sm">
          每位 CEO / Chairman / Founder 在 10 個維度上打 0-5 分，加權合成為 0-100 領導力綜合分數。
          公司層級則對所有有打分的領導者取平均。
        </p>
        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>必看的限制：</strong>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>這是<strong>最主觀</strong>的部分 — 基於公開報導、長期紀錄與產業共識</li>
            <li>任期短或資訊有限者不打分（避免亂猜）</li>
            <li>戰略 / 執行 / 資本配置權重各 15%，反映「商業核心三能力」</li>
            <li>領導力對 KPI 的影響「有限」（3y/5y/10y 各 ±3-6 分），避免主觀過度主導整體評分</li>
          </ol>
        </div>
      </header>

      <section className="card p-5">
        <h2 className="section-title">合成公式</h2>
        <pre className="muted mt-2 overflow-x-auto whitespace-pre-wrap text-xs">
{`綜合分數 = (戰略判斷力 × 15% + 執行力 × 15% + 資本配置能力 × 15%
        + 技術/產品理解力 × 10% + 組織與人才能力 × 10% + 正直與治理 × 10%
        + 客戶與生態系經營 × 8% + 逆風韌性 × 7%
        + 財務紀律 × 5% + 溝通與市場信任 × 5%)  × 20
              （0-5 分原始分 × 20 → 0-100 分綜合分）`}
        </pre>
        <div className="muted mt-2 text-xs">
          公司層級 = 所有打分的領導者綜合分數平均（多人公司如鴻海有 Terry Gou + Young Liu）。
        </div>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.key} className="card p-5">
          <h2 className="section-title">
            {s.title}
            <span className="muted ml-2 text-xs font-normal">權重 {(s.weight * 100).toFixed(0)}%</span>
          </h2>
          <p className="muted mt-1 text-sm">{s.desc}</p>
          <div className="mt-3"><RubricTable rows={s.rows} /></div>
        </section>
      ))}

      <section className="card p-5 text-xs">
        <h2 className="section-title text-base">領導力如何影響 KPI</h2>
        <table className="mt-3 min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">領導力分數</th>
              <th className="px-3 py-2">3 年 KPI</th>
              <th className="px-3 py-2">5 年 KPI</th>
              <th className="px-3 py-2">10 年 KPI</th>
              <th className="px-3 py-2">風險</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <tr><td className="px-3 py-2 font-mono">90+</td><td className="px-3 py-2 text-emerald-600">+2</td><td className="px-3 py-2 text-emerald-600">+3</td><td className="px-3 py-2 text-emerald-600">+3</td><td className="px-3 py-2 text-emerald-600">-2</td></tr>
            <tr><td className="px-3 py-2 font-mono">80-89</td><td className="px-3 py-2 text-emerald-500">+1~2</td><td className="px-3 py-2 text-emerald-500">+2</td><td className="px-3 py-2 text-emerald-500">+2~3</td><td className="px-3 py-2 text-emerald-500">-1</td></tr>
            <tr><td className="px-3 py-2 font-mono">70-79</td><td className="px-3 py-2 text-emerald-400">+0~1</td><td className="px-3 py-2 text-emerald-400">+1</td><td className="px-3 py-2 text-emerald-400">+1</td><td className="px-3 py-2 text-emerald-400">~0</td></tr>
            <tr><td className="px-3 py-2 font-mono">60-69</td><td className="px-3 py-2 text-slate-500">~0</td><td className="px-3 py-2 text-slate-500">~0</td><td className="px-3 py-2 text-slate-500">-1</td><td className="px-3 py-2 text-slate-500">+1</td></tr>
            <tr><td className="px-3 py-2 font-mono">50-59</td><td className="px-3 py-2 text-amber-500">-1</td><td className="px-3 py-2 text-amber-500">-1</td><td className="px-3 py-2 text-amber-500">-2</td><td className="px-3 py-2 text-amber-500">+1~2</td></tr>
            <tr><td className="px-3 py-2 font-mono">&lt; 50</td><td className="px-3 py-2 text-rose-500">-2~3</td><td className="px-3 py-2 text-rose-500">-3</td><td className="px-3 py-2 text-rose-500">-3</td><td className="px-3 py-2 text-rose-500">+2~3</td></tr>
          </tbody>
        </table>
        <p className="muted mt-3">
          看公式：<Link to="/kpi-method" className="text-brand-600 hover:underline dark:text-brand-400">KPI 公式說明</Link>
          ｜
          <Link to="/scoring-rubric" className="ml-1 text-brand-600 hover:underline dark:text-brand-400">原始評分判準</Link>
        </p>
      </section>
    </div>
  );
}
