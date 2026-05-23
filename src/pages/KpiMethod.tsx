import { Link } from "react-router-dom";

interface Formula {
  key: string;
  weight: number;
  label: string;
  derivation: string;
}

const SHORT_TERM: Formula[] = [
  { key: "revenueMomentum", weight: 0.25, label: "營收動能 revenueMomentum", derivation: "AI 重要性 + 熱門類別 +1 / 溫熱類別 +0.5；信心低 -0.5" },
  { key: "earningsMomentum", weight: 0.2, label: "獲利動能 earningsMomentum", derivation: "營收動能 - 0.2 × capex 循環風險" },
  { key: "nearTermCatalyst", weight: 0.2, label: "近期催化 nearTermCatalyst", derivation: "熱門類別：min(AI+0.5, 5)；否則：AI" },
  { key: "marketSentiment", weight: 0.15, label: "市場情緒 marketSentiment", derivation: "(AI + 0.5 × 估值風險) / 1.5 — 高估值通常代表高關注" },
  { key: "valuationReratingPotential", weight: 0.1, label: "估值重評潛力 valuationReratingPotential", derivation: "3 + (AI - 估值風險) × 0.5 — 越便宜越有空間" },
  { key: "orderVisibility", weight: 0.1, label: "訂單能見度 orderVisibility", derivation: "ODM 標籤：4.5；高 AI：4；否則：AI" },
];

const THREE_YEAR: Formula[] = [
  { key: "aiRevenueExposure", weight: 0.25, label: "AI 營收曝險 aiRevenueExposure", derivation: "AI 重要性 × 20" },
  { key: "revenueGrowthPotential", weight: 0.2, label: "營收成長潛力 revenueGrowthPotential", derivation: "(營收動能 + AI) / 2" },
  { key: "marginExpansionPotential", weight: 0.15, label: "毛利率擴張潛力 marginExpansionPotential", derivation: "(IP 護城河 + 生態系) / 2 - 0.3 × 記憶體循環風險" },
  { key: "supplyChainBottleneckBenefit", weight: 0.15, label: "瓶頸受惠 supplyChainBottleneckBenefit", derivation: "瓶頸類別：min(AI+0.5, 5)；否則：AI-0.5" },
  { key: "customerPenetration", weight: 0.15, label: "客戶滲透 customerPenetration", derivation: "(AI + 客戶關係護城河) / 2" },
  { key: "executionQuality", weight: 0.1, label: "執行品質 executionQuality", derivation: "信心高：4；中：3.5；低：3" },
];

const FIVE_YEAR: Formula[] = [
  { key: "technologyMoat", weight: 0.25, label: "技術護城河 technologyMoat", derivation: "(製程 + IP 設計) / 2" },
  { key: "ecosystemLockIn", weight: 0.2, label: "生態系鎖定 ecosystemLockIn", derivation: "生態系護城河" },
  { key: "pricingPower", weight: 0.15, label: "定價力 pricingPower", derivation: "(IP + 生態系 + 轉換成本) / 3 - 0.2 × capex 循環風險" },
  { key: "marketShareExpansionPotential", weight: 0.15, label: "市占擴張潛力 marketShareExpansionPotential", derivation: "(AI + 客戶) / 2 - 0.3 × 技術替代風險" },
  { key: "supplyChainImportance", weight: 0.15, label: "供應鏈重要性 supplyChainImportance", derivation: "AI × 上游加成 1.2（中下游 ×1），上限 5" },
  { key: "managementExecution", weight: 0.1, label: "管理執行 managementExecution", derivation: "同 executionQuality" },
];

const TEN_YEAR: Formula[] = [
  { key: "structuralDemandExposure", weight: 0.25, label: "結構性需求曝險 structuralDemandExposure", derivation: "AI 重要性 × 20" },
  { key: "irreplaceability", weight: 0.2, label: "不可取代性 irreplaceability", derivation: "(製程 + 生態系 + 轉換成本) / 3" },
  { key: "platformValue", weight: 0.15, label: "平台價值 platformValue", derivation: "(生態系 + 轉換成本) / 2" },
  { key: "tamExpansion", weight: 0.15, label: "TAM 擴張潛力 tamExpansion", derivation: "AI + 熱門類別 +0.5 - 0.5" },
  { key: "rdStrength", weight: 0.1, label: "研發強度 rdStrength", derivation: "(製程 + IP) / 2" },
  { key: "balanceSheetResilience", weight: 0.1, label: "資產負債韌性 balanceSheetResilience", derivation: "(製造規模 + 3) / 2 — 規模大假設財務健康" },
  { key: "technologyTransitionSurvivability", weight: 0.05, label: "技術轉換存活 technologyTransitionSurvivability", derivation: "(製程 + IP + 3) / 3 - 0.3 × 技術替代風險" },
];

const RISK: Formula[] = [
  { key: "valuationRisk", weight: 0.2, label: "估值風險", derivation: "公司 risk.valuation × 20" },
  { key: "cyclicalityRisk", weight: 0.2, label: "景氣循環風險", derivation: "公司 risk.capexCycle × 20" },
  { key: "customerConcentrationRisk", weight: 0.15, label: "客戶集中度", derivation: "公司 risk.customerConc × 20" },
  { key: "geopoliticalRisk", weight: 0.15, label: "地緣政治（含中國出口管制）", derivation: "公司 risk.chinaExport × 20" },
  { key: "technologyDisruptionRisk", weight: 0.15, label: "技術替代風險", derivation: "公司 risk.techTransition × 20" },
  { key: "executionRisk", weight: 0.15, label: "執行風險", derivation: "(5 - 製造規模) × 20" },
];

function Block({ title, list }: { title: string; list: Formula[] }) {
  return (
    <section className="card p-5">
      <h2 className="section-title">{title}</h2>
      <div className="muted mt-1 text-xs">
        合成分數 = Σ 權重 × 子項分數；每子項皆 1-100 分。
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">子項</th>
              <th className="px-3 py-2 text-right">權重</th>
              <th className="px-3 py-2">推導公式</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((f) => (
              <tr key={f.key}>
                <td className="px-3 py-2 font-medium">{f.label}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums">
                  {(f.weight * 100).toFixed(0)}%
                </td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{f.derivation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function KpiMethodPage() {
  return (
    <div className="space-y-6">
      <header className="card p-6">
        <h1 className="text-2xl font-bold tracking-tight">投資 KPI 評分方法</h1>
        <p className="muted mt-2 text-sm">
          所有 KPI 分數皆從 <code>src/data/companies.ts</code> 的既有欄位
          （aiImportanceScore、moat、risk、category、tags、valuationSensitivity、confidenceLevel）
          以可解釋的權重公式推導而成（程式碼在 <code>src/lib/kpi.ts</code>）。
          公開公式有兩個目的：(1) 避免讀者誤以為這是黑箱財報模型；(2) 你可以自己改權重，
          看不同假設下排名怎麼變。
        </p>
        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>反幻覺原則：</strong>
          本網站不捏造營收成長率、EPS、毛利率、市占率、客戶名單、訂單規模。
          若有財務假設未串接最新財報資料，皆標示<span className="font-semibold">「需要資料驗證」</span>。
          詳見<Link className="ml-1 text-brand-600 hover:underline dark:text-brand-400" to="/kpi-dashboard">投資 KPI 儀表板</Link>。
        </div>
      </header>

      <section className="card p-5">
        <h2 className="section-title">為什麼分四個時間維度？</h2>
        <div className="muted mt-2 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">短期（3-12 個月）</div>
            評估「近期是否有股價催化」。重點是訂單能見度、產品週期、市場情緒、估值是否
            還有重評空間。
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">三年</div>
            評估「AI capex 循環的受惠程度」。Hyperscaler capex、瓶頸受惠、毛利率擴張潛力
            是主軸。
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">五年</div>
            評估「護城河與市占擴張」。技術領先、生態系鎖定、客戶轉換成本是重點。
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">十年</div>
            評估「結構性重要性與不可取代性」。即使技術典範轉移，這家公司是否仍是
            AI 基礎建設的核心？
          </div>
        </div>
      </section>

      <Block title="短期催化分數 shortTermScore（3-12 月）" list={SHORT_TERM} />
      <Block title="三年成長分數 threeYearScore" list={THREE_YEAR} />
      <Block title="五年護城河分數 fiveYearScore" list={FIVE_YEAR} />
      <Block title="十年結構性價值分數 tenYearScore" list={TEN_YEAR} />
      <Block title="整體風險分數 riskScore（獨立呈現，不混進機會分數）" list={RISK} />

      <section className="card p-5">
        <h2 className="section-title">5 種投資型態定義</h2>
        <dl className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="font-semibold text-violet-700 dark:text-violet-300">核心平台型</dt>
            <dd className="muted">巨大護城河 + 高 AI 相關性，估值通常偏高。例：Nvidia、TSMC、ASML、Broadcom。</dd>
          </div>
          <div>
            <dt className="font-semibold text-amber-700 dark:text-amber-300">關鍵瓶頸型</dt>
            <dd className="muted">供給緊張時受惠最深。例：HBM 三廠、欣興/南電（ABF）、京元電（測試）、AVC/奇鋐（液冷）、台達電（電源）。</dd>
          </div>
          <div>
            <dt className="font-semibold text-sky-700 dark:text-sky-300">週期成長型</dt>
            <dd className="muted">AI capex 高 beta 受惠，但承擔較高週期風險。例：Micron、廣達、緯創、英業達、ASML（設備循環）。</dd>
          </div>
          <div>
            <dt className="font-semibold text-emerald-700 dark:text-emerald-300">技術升級受惠型</dt>
            <dd className="muted">800G/1.6T、PCIe Gen6、CPO 等技術轉換受惠。例：Astera、Credo、Coherent、Lumentum、Marvell、智邦。</dd>
          </div>
          <div>
            <dt className="font-semibold text-rose-700 dark:text-rose-300">題材波動型</dt>
            <dd className="muted">AI 概念但訂單能見度待確認。需特別注意信心等級與題材敏感度。</dd>
          </div>
        </dl>
      </section>

      <section className="card p-5">
        <h2 className="section-title">需要哪些資料才能升級評分？</h2>
        <p className="muted mt-2 text-sm">
          若日後串接以下資料，可將分數從「產業邏輯推導」升級為「混合財務與產業」：
        </p>
        <ul className="muted mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>最近 4 季營收 YoY / 季 QoQ — 可取代 revenueMomentum / earningsMomentum 的推導</li>
          <li>下季財測（公司提供） — 可加權 orderVisibility</li>
          <li>毛利率 / 營業利益率走勢 — 可實證 marginExpansionPotential</li>
          <li>Forward P/E vs. 5 年中位 — 可實證 valuationReratingPotential</li>
          <li>研發費用占營收比 — 可實證 rdStrength</li>
          <li>淨負債 / EBITDA、自由現金流 — 可實證 balanceSheetResilience</li>
        </ul>
        <p className="muted mt-3 text-xs">
          目前股價、市值、本益比、52 週區間 已透過 GitHub Action 每日自動從 Yahoo Finance 抓取，
          下一步可串接公司 IR 公告 RSS 與財報 API（如 SimplyWall.st、Stockanalysis API）。
        </p>
      </section>
    </div>
  );
}
