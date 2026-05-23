import { Link } from "react-router-dom";
import { allKpis } from "../lib/kpi";
import {
  PRESETS,
  customComposite,
  useWeights,
  type KpiWeights,
} from "../context/weightsContextValue";
import { Sparkline } from "../components/Sparkline";
import { getQuote } from "../services/marketData";
import { InvestmentTypeBadge } from "../components/InvestmentTypeBadge";

function tone(v: number) {
  if (v >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (v >= 55) return "text-sky-600 dark:text-sky-400";
  if (v >= 35) return "text-amber-600 dark:text-amber-400";
  return "text-slate-500 dark:text-slate-400";
}

function Slider({
  label,
  value,
  onChange,
  max = 100,
  color = "brand",
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
  color?: string;
  hint?: string;
}) {
  const colorMap: Record<string, string> = {
    brand: "accent-brand-600",
    rose: "accent-rose-600",
  };
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-mono tabular-nums text-base font-bold text-brand-700 dark:text-brand-300">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={"w-full " + colorMap[color]}
      />
      {hint && <div className="muted text-[10px]">{hint}</div>}
    </div>
  );
}

export function KpiTuningPage() {
  const { weights, setWeights, reset, isCustom } = useWeights();

  function update<K extends keyof KpiWeights>(key: K, value: number) {
    setWeights({ ...weights, [key]: value });
  }

  // 計算所有公司的自訂分數，取 top 15
  const ranked = allKpis()
    .map((item) => ({
      ...item,
      custom: customComposite(item.kpi, weights),
    }))
    .sort((a, b) => b.custom - a.custom)
    .slice(0, 15);

  // 對照：依預設權重的排序
  const defaultRanked = allKpis()
    .map((item) => ({
      ...item,
      custom: customComposite(item.kpi, PRESETS[0].w),
    }))
    .sort((a, b) => b.custom - a.custom)
    .slice(0, 15);

  const totalH = weights.shortTerm + weights.threeYear + weights.fiveYear + weights.tenYear;

  return (
    <div className="space-y-6">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">KPI 權重自訂</h1>
        <p className="muted mt-2 text-sm">
          調整 4 個時間維度的權重 + 風險折扣，馬上看排名怎麼變。
          設定會存在你的瀏覽器（localStorage），下次回來自動套用。
        </p>
        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>為什麼能自訂權重？</strong>
          KPI 的「絕對分數」是我打的，但「你比較重視短期還是長期」、
          「能承擔多少風險」是你的事。
          這頁就是讓你把你的偏好顯性化 — 你會看到自己的排名跟我預設的有何不同。
        </div>
      </header>

      <section className="card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="section-title">投資人類型預設</h2>
          {isCustom && (
            <button type="button" className="btn" onClick={reset}>
              重設為預設權重
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setWeights(p.w)}
              className={
                "rounded-md border px-3 py-1.5 text-xs transition " +
                (JSON.stringify(weights) === JSON.stringify(p.w)
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800")
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Sliders */}
        <section className="card space-y-5 p-5">
          <h2 className="section-title">調整權重</h2>

          <div className="space-y-4">
            <Slider
              label="短期催化（3-12 月）"
              value={weights.shortTerm}
              onChange={(v) => update("shortTerm", v)}
              hint="近期事件、訂單能見度、市場情緒"
            />
            <Slider
              label="三年成長"
              value={weights.threeYear}
              onChange={(v) => update("threeYear", v)}
              hint="AI capex 循環受惠、營收 CAGR"
            />
            <Slider
              label="五年護城河"
              value={weights.fiveYear}
              onChange={(v) => update("fiveYear", v)}
              hint="技術領先、生態系鎖定、客戶轉換成本"
            />
            <Slider
              label="十年結構性"
              value={weights.tenYear}
              onChange={(v) => update("tenYear", v)}
              hint="不可取代性、TAM 擴張"
            />
          </div>

          <div className="muted text-[10px]">
            4 個時間權重會被自動正規化（總和 = {totalH}）；以相對比例為準。
          </div>

          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <Slider
              label="風險折扣"
              value={weights.riskDiscount}
              onChange={(v) => update("riskDiscount", v)}
              max={100}
              color="rose"
              hint="從合成分數扣多少 × 風險分數（0 = 完全不扣，100 = 嚴重避險）"
            />
          </div>

          <div className="rounded-lg bg-slate-50 p-3 text-[11px] dark:bg-slate-900">
            <div className="font-semibold">公式</div>
            <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-[10px] text-slate-600 dark:text-slate-300">
{`custom = (
  ${weights.shortTerm} × shortTerm +
  ${weights.threeYear} × threeYear +
  ${weights.fiveYear} × fiveYear +
  ${weights.tenYear} × tenYear
) / ${totalH}  -  ${weights.riskDiscount}/100 × (risk - 50)`}
            </pre>
          </div>
        </section>

        {/* Live preview: side-by-side rankings */}
        <section className="card p-5">
          <h2 className="section-title">即時排行對照</h2>
          <p className="muted mt-1 text-xs">左 = 你的權重，右 = 預設權重</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="muted mb-1 text-[11px] font-semibold uppercase">你的排行</div>
              <ol className="divide-y divide-slate-100 text-xs dark:divide-slate-800">
                {ranked.map((r, i) => {
                  const q = getQuote(r.company.id);
                  return (
                    <li key={r.company.id} className="grid grid-cols-[1rem_1fr_50px_auto] items-center gap-1 py-1.5">
                      <span className="muted text-[10px]">{i + 1}.</span>
                      <Link to={`/company/${r.company.id}`} className="truncate font-medium hover:underline">
                        {r.company.name}
                      </Link>
                      <Sparkline data={q?.history ?? []} width={50} height={16} windowSize={90} />
                      <span className={"font-mono text-xs font-bold " + tone(r.custom)}>
                        {r.custom}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div>
              <div className="muted mb-1 text-[11px] font-semibold uppercase">預設排行</div>
              <ol className="divide-y divide-slate-100 text-xs dark:divide-slate-800">
                {defaultRanked.map((r, i) => (
                  <li key={r.company.id} className="grid grid-cols-[1rem_1fr_auto] items-center gap-1 py-1.5">
                    <span className="muted text-[10px]">{i + 1}.</span>
                    <Link to={`/company/${r.company.id}`} className="truncate font-medium hover:underline">
                      {r.company.name}
                    </Link>
                    <span className={"font-mono text-xs font-bold " + tone(r.custom)}>
                      {r.custom}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>

      {/* Sub-set: my watchlist scored by these weights */}
      <section className="card p-5">
        <h2 className="section-title">所有公司 · 自訂分數排序</h2>
        <p className="muted mt-1 text-xs">
          完整 68 家公司，依你目前的權重排序。點公司進入詳細頁。
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2 w-10 text-center">#</th>
                <th className="px-3 py-2">公司</th>
                <th className="px-3 py-2">投資型態</th>
                <th className="px-3 py-2 text-right">短期</th>
                <th className="px-3 py-2 text-right">3 年</th>
                <th className="px-3 py-2 text-right">5 年</th>
                <th className="px-3 py-2 text-right">10 年</th>
                <th className="px-3 py-2 text-right">風險</th>
                <th className="px-3 py-2 text-right">自訂</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allKpis()
                .map((it) => ({ ...it, custom: customComposite(it.kpi, weights) }))
                .sort((a, b) => b.custom - a.custom)
                .map((r, i) => (
                  <tr key={r.company.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-3 py-1.5 text-center text-xs muted">{i + 1}</td>
                    <td className="px-3 py-1.5">
                      <Link to={`/company/${r.company.id}`} className="font-medium hover:underline">
                        {r.company.name}
                      </Link>
                      <span className="muted ml-2 font-mono text-[10px]">{r.company.ticker}</span>
                    </td>
                    <td className="px-3 py-1.5"><InvestmentTypeBadge type={r.kpi.investmentType} /></td>
                    <td className={"px-3 py-1.5 text-right font-mono " + tone(r.kpi.shortTermScore)}>{r.kpi.shortTermScore}</td>
                    <td className={"px-3 py-1.5 text-right font-mono " + tone(r.kpi.threeYearScore)}>{r.kpi.threeYearScore}</td>
                    <td className={"px-3 py-1.5 text-right font-mono " + tone(r.kpi.fiveYearScore)}>{r.kpi.fiveYearScore}</td>
                    <td className={"px-3 py-1.5 text-right font-mono " + tone(r.kpi.tenYearScore)}>{r.kpi.tenYearScore}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-rose-600 dark:text-rose-400">{r.kpi.riskScore}</td>
                    <td className={"px-3 py-1.5 text-right font-mono text-base font-bold " + tone(r.custom)}>{r.custom}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
