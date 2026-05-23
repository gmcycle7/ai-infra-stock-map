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
    key: "resilience",
    title: "韌性 resilience",
    weight: 0.2,
    desc: "在產業低谷、巨變或公司危機中堅持並調整的能力。長期任期 + 經歷過至少一次大循環者得高分。",
    rows: [
      { score: 5, description: "經歷多次大循環仍領先（10+ 年任期 + 至少一次危機翻身）", example: "Jensen Huang、張忠謀、林百里、Lisa Su、Bruce Cheng" },
      { score: 4, description: "經歷一次以上週期 + 穩定執行", example: "Hock Tan、Gary Dickerson、Matt Murphy" },
      { score: 3, description: "穩定但任期尚未經歷大循環", example: "Sassine Ghazi（新任）、Anirudh Devgan" },
      { score: 2, description: "任期短或經歷過危機但反應不佳" },
      { score: 1, description: "公司面臨危機時無明確策略" },
    ],
  },
  {
    key: "execution",
    title: "執行力 execution",
    weight: 0.2,
    desc: "把策略落地的紀律與速度。承諾兌現率、產品時程、營運效率是關鍵指標。",
    rows: [
      { score: 5, description: "公開承諾大致兌現、產品時程穩定", example: "Lisa Su（AMD Zen 路線圖）、CC Wei（TSMC 製程節奏）、Jayshree Ullal" },
      { score: 4, description: "執行穩健，偶有延誤但能補救", example: "Hock Tan、Sanjay Mehrotra、Charles Liang" },
      { score: 3, description: "中等執行力" },
      { score: 2, description: "頻繁延誤或產品 / 財報失準" },
    ],
  },
  {
    key: "integrity",
    title: "正直 integrity",
    weight: 0.2,
    desc: "揭露透明、信譽、無重大爭議。會計爭議、揭露遲延、突然撤回財測等都是減分項。",
    rows: [
      { score: 5, description: "無爭議紀錄、揭露主動且誠實", example: "張忠謀、林百里、Bruce Cheng、CC Wei、Lisa Su" },
      { score: 4, description: "標準合規、無重大事件", example: "多數穩健經營者" },
      { score: 3, description: "有過小型爭議但已處理" },
      { score: 2, description: "有重大會計 / 揭露爭議", example: "Charles Liang（SMCI 2024 揭露事件）" },
      { score: 1, description: "曾被監管處分或司法調查", example: "Jay Y. Lee（賄賂案，已特赦）" },
    ],
  },
  {
    key: "vision",
    title: "願景 vision",
    weight: 0.15,
    desc: "對產業長期方向的判斷力與提前布局。CUDA、純晶圓代工這類「顛覆性下注」是 5 分。",
    rows: [
      { score: 5, description: "提前 5-10 年看到趨勢並重押資源", example: "Jensen Huang（CUDA）、張忠謀（純代工）、Bruce Cheng（節能）、Michael Hsing（BCD 製程）" },
      { score: 4, description: "策略前瞻、布局明確", example: "Hock Tan、Lisa Su、林百里、蔡明介、Jayshree Ullal" },
      { score: 3, description: "跟得上產業主軸" },
      { score: 2, description: "策略偏被動" },
    ],
  },
  {
    key: "capitalAllocation",
    title: "資本配置 capitalAllocation",
    weight: 0.15,
    desc: "併購 / R&D / 買回 / 配息的取捨品質。並非「多」就好，而是 ROIC 與長期股東報酬。",
    rows: [
      { score: 5, description: "連續多筆有價值的併購 + 紀律性買回", example: "Hock Tan（Broadcom 系列併購）、Adam Norwitt（Amphenol）、Bruce Cheng" },
      { score: 4, description: "資本配置紀律佳", example: "Lisa Su、Matt Murphy、Gary Dickerson、Eaton" },
      { score: 3, description: "中等，無明顯失誤" },
      { score: 2, description: "有過昂貴失敗併購或 R&D 浪費" },
    ],
  },
  {
    key: "communication",
    title: "溝通透明 communication",
    weight: 0.1,
    desc: "法說會、IR、媒體溝通質量。對股東是否可預期？面對壞消息是否誠實揭露？",
    rows: [
      { score: 5, description: "法說會清楚、訊息一致、可預期性高", example: "Jensen Huang、Lisa Su、Jayshree Ullal" },
      { score: 4, description: "穩健溝通", example: "多數穩健經營者" },
      { score: 3, description: "中等" },
      { score: 2, description: "訊息不一致或迴避壞消息" },
      { score: 1, description: "重大溝通失誤", example: "—" },
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
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">領導力評分判準</h1>
        <p className="muted mt-2 text-sm">
          每位 CEO / Chairman / Founder 在 6 個維度上打 0-5 分，加權合成為 0-100 領導力綜合分數。
          公司層級則對所有有打分的領導者取平均。
        </p>
        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>必看的限制：</strong>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>這是<strong>最主觀</strong>的部分 — 基於公開報導、長期紀錄與產業共識</li>
            <li>任期短或資訊有限者不打分（避免亂猜）</li>
            <li>正直 / 韌性權重各 20%，反映「下檔保護」對長期投資更重要</li>
            <li>領導力對 KPI 的影響「有限」（3y/5y/10y 各 ±3-6 分），避免主觀過度主導整體評分</li>
          </ol>
        </div>
      </header>

      <section className="card p-5">
        <h2 className="section-title">合成公式</h2>
        <div className="muted mt-2 text-sm">
          <code>
            綜合分數 = (韌性 × 0.2) + (執行力 × 0.2) + (正直 × 0.2) + (願景 × 0.15) + (資本配置 × 0.15) + (溝通 × 0.1) × 20
          </code>
        </div>
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
              <th className="px-3 py-2">3 年 KPI 調整</th>
              <th className="px-3 py-2">5 年 KPI 調整</th>
              <th className="px-3 py-2">10 年 KPI 調整</th>
              <th className="px-3 py-2">風險調整</th>
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
