import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { companies, companyById } from "../data/companies";
import { categoryBySlug } from "../data/categories";
import { getKpi } from "../lib/kpi";
import { getQuote, formatPrice, formatMarketCap, formatPE, lastFetchedAt, formatFetchedAt } from "../services/marketData";
import { Sparkline } from "../components/Sparkline";
import { windowReturn } from "../lib/priceWindow";
import { PriceDelta } from "../components/PriceDelta";
import { InvestmentTypeBadge } from "../components/InvestmentTypeBadge";
import { MarketBadge, PositionBadge, ScoreBadge, ConfidenceBadge, Tag } from "../components/Badge";
import { KpiRadar } from "../components/KpiRadar";
import type { InvestmentKpi } from "../types";

const KPI_ROWS: Array<{ label: string; key: keyof InvestmentKpi; risk?: boolean }> = [
  { label: "短期催化（3-12 月）", key: "shortTermScore" },
  { label: "三年成長", key: "threeYearScore" },
  { label: "五年護城河", key: "fiveYearScore" },
  { label: "十年結構性", key: "tenYearScore" },
  { label: "整體風險（越高越大）", key: "riskScore", risk: true },
  { label: "AI 相關性", key: "aiRevenueExposure" },
  { label: "營收成長潛力", key: "revenueGrowthPotential" },
  { label: "毛利率擴張潛力", key: "marginExpansionPotential" },
  { label: "技術護城河", key: "technologyMoat" },
  { label: "生態系鎖定", key: "ecosystemLockIn" },
  { label: "定價力", key: "pricingPower" },
  { label: "供應鏈重要性", key: "supplyChainImportance" },
  { label: "客戶滲透", key: "customerPenetration" },
  { label: "不可取代性", key: "irreplaceability" },
  { label: "客戶集中度（風險）", key: "customerConcentrationRisk", risk: true },
  { label: "估值風險", key: "valuationRisk", risk: true },
  { label: "技術替代風險", key: "technologyDisruptionRisk", risk: true },
];

function scoreTone(v: number, risk = false) {
  if (risk) {
    if (v >= 70) return "text-rose-600 dark:text-rose-400";
    if (v >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (v >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (v >= 55) return "text-sky-600 dark:text-sky-400";
  if (v >= 35) return "text-amber-600 dark:text-amber-400";
  return "text-slate-500 dark:text-slate-400";
}

function ScoreBar({ value, risk = false }: { value: number; risk?: boolean }) {
  const cls = risk
    ? value >= 70
      ? "bg-rose-500"
      : value >= 50
        ? "bg-amber-500"
        : "bg-emerald-500"
    : value >= 75
      ? "bg-emerald-500"
      : value >= 55
        ? "bg-sky-500"
        : value >= 35
          ? "bg-amber-400"
          : "bg-slate-400";
  return (
    <span className="relative inline-block h-1.5 w-full overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
      <span className={"absolute inset-y-0 left-0 " + cls} style={{ width: value + "%" }} />
    </span>
  );
}

function winner(a: number, b: number, risk = false) {
  // risk: 越低越好；非 risk：越高越好
  if (a === b) return null;
  if (risk) return a < b ? "a" : "b";
  return a > b ? "a" : "b";
}

function CompanyPicker({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  exclude?: string;
}) {
  // 依分類分組
  const grouped = useMemo(() => {
    const map = new Map<string, typeof companies>();
    for (const c of companies) {
      if (c.id === exclude) continue;
      const cat = c.category[0];
      const arr = map.get(cat) ?? [];
      arr.push(c);
      map.set(cat, arr);
    }
    return [...map.entries()].sort((x, y) => x[0].localeCompare(y[0]));
  }, [exclude]);

  return (
    <label className="block flex-1">
      <span className="muted mb-1 block text-xs">{label}</span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— 請選擇 —</option>
        {grouped.map(([cat, list]) => {
          const c = categoryBySlug[cat];
          return (
            <optgroup key={cat} label={c?.nameZh ?? cat}>
              {list.map((co) => (
                <option key={co.id} value={co.id}>
                  {co.name}（{co.ticker}）
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </label>
  );
}

function CompanyColumn({ company }: { company: typeof companies[number] }) {
  const kpi = getKpi(company);
  const quote = getQuote(company.id);
  const r90 = quote?.history ? windowReturn(quote.history, 90) : null;
  const r365 = quote?.history ? windowReturn(quote.history, 252) : null;

  return (
    <div className="space-y-4">
      <header className="card p-4">
        <Link to={`/company/${company.id}`} className="block">
          <div className="text-lg font-semibold hover:underline">{company.name}</div>
          <div className="muted text-xs">{company.nameEn}</div>
          <div className="mt-1 font-mono text-xs text-slate-500">{company.ticker}</div>
        </Link>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <MarketBadge market={company.market} />
          <PositionBadge pos={company.supplyChainPosition} />
          <ScoreBadge score={company.aiImportanceScore} />
          <InvestmentTypeBadge type={kpi.investmentType} />
          <ConfidenceBadge level={company.confidenceLevel} />
        </div>
      </header>

      {quote && quote.price != null && (
        <div className="card flex items-end justify-between gap-3 p-3">
          <div>
            <div className="muted text-[10px]">最新價</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-base font-semibold">
                {formatPrice(quote.price, quote.currency)}
              </span>
              <PriceDelta pct={quote.changePercent} variant="inline" size="sm" />
            </div>
            <div className="muted mt-0.5 text-[10px]">
              3M <PriceDelta pct={r90} variant="inline" size="xs" /> · 1Y{" "}
              <PriceDelta pct={r365} variant="inline" size="xs" />
            </div>
            <div className="muted mt-1 text-[10px]">
              市值 {formatMarketCap(quote.marketCap, quote.currency)} · Fwd P/E{" "}
              {formatPE(quote.forwardPE)}
            </div>
          </div>
          <div className="w-32 flex-shrink-0">
            <Sparkline data={quote.history ?? []} width={130} height={42} windowSize={252} />
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="mb-2 text-sm font-semibold">10 維度 KPI 雷達</h3>
        <KpiRadar radar={kpi.radar} size={260} />
      </div>

      <div className="card space-y-2 p-4 text-sm">
        <h3 className="text-sm font-semibold">主要產品 / 標籤</h3>
        <ul className="muted list-disc space-y-0.5 pl-5 text-xs">
          {company.coreProducts.slice(0, 4).map((p) => <li key={p}>{p}</li>)}
        </ul>
        <div className="flex flex-wrap gap-1">
          {company.tags.slice(0, 8).map((t) => <Tag key={t} label={t} />)}
        </div>
      </div>

      <div className="card p-4 text-xs">
        <div className="font-semibold">最大優勢</div>
        <p className="muted mt-1">{company.competitiveAdvantage}</p>
        <div className="mt-2 font-semibold">主要風險（節錄）</div>
        <ul className="muted mt-1 list-disc space-y-0.5 pl-5">
          {company.risks.slice(0, 3).map((r) => <li key={r}>{r}</li>)}
        </ul>
      </div>
    </div>
  );
}

export function ComparePage() {
  const [params, setParams] = useSearchParams();
  const [a, setA] = useState(params.get("a") ?? "nvidia");
  const [b, setB] = useState(params.get("b") ?? "amd");

  const ca = a ? companyById[a] : undefined;
  const cb = b ? companyById[b] : undefined;

  function update(newA: string, newB: string) {
    setA(newA);
    setB(newB);
    const p = new URLSearchParams();
    if (newA) p.set("a", newA);
    if (newB) p.set("b", newB);
    setParams(p);
  }

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">兩公司比較</h1>
        <p className="muted mt-1 text-sm">
          並排比較任兩家公司的 KPI、市場資料、雷達圖、優勢與風險。
          適合判斷「同業競爭強弱」與「同類股代替性」。
        </p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <CompanyPicker label="A 公司" value={a} onChange={(v) => update(v, b)} exclude={b} />
          <CompanyPicker label="B 公司" value={b} onChange={(v) => update(a, v)} exclude={a} />
        </div>
        <div className="muted mt-2 text-[10px]">
          常用比較：
          {[
            ["nvidia", "amd", "Nvidia vs AMD"],
            ["alchip", "guc", "Alchip vs GUC"],
            ["avc", "auras", "雙鴻 vs 奇鋐"],
            ["astera", "credo", "Astera vs Credo"],
            ["coherent", "lumentum", "Coherent vs Lumentum"],
            ["unimicron", "nanyapcb", "欣興 vs 南電"],
            ["wiwynn", "quanta", "緯穎 vs 廣達"],
            ["synopsys", "cadence", "Synopsys vs Cadence"],
            ["ibiden", "unimicron", "Ibiden vs 欣興"],
          ].map(([x, y, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => update(x, y)}
              className="ml-1 rounded border border-slate-200 px-1.5 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {!ca || !cb ? (
        <div className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">
          請選擇兩家公司開始比較。
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CompanyColumn company={ca} />
            <CompanyColumn company={cb} />
          </div>

          {/* 並排 KPI 比較表 */}
          <section className="card p-4">
            <h2 className="section-title text-base">並排 KPI 比較</h2>
            <p className="muted mt-1 text-xs">
              綠色「優」標示哪一邊在該維度勝出（風險維度則是「低 = 優」）。
              所有分數 0-100，產業邏輯推導，
              <Link to="/kpi-method" className="ml-1 text-brand-600 hover:underline dark:text-brand-400">看公式</Link>
              。
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-3 py-2">維度</th>
                    <th className="px-3 py-2 text-center">{ca.name}</th>
                    <th className="px-3 py-2 text-center" />
                    <th className="px-3 py-2 text-center">{cb.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {KPI_ROWS.map((row) => {
                    const ka = getKpi(ca);
                    const kb = getKpi(cb);
                    const va = ka[row.key] as number;
                    const vb = kb[row.key] as number;
                    const w = winner(va, vb, row.risk);
                    return (
                      <tr key={row.key}>
                        <td className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">
                          {row.label}
                        </td>
                        <td className="px-3 py-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                "w-8 text-right font-mono text-xs font-semibold tabular-nums " +
                                scoreTone(va, row.risk)
                              }
                            >
                              {va}
                            </span>
                            <ScoreBar value={va} risk={row.risk} />
                          </div>
                        </td>
                        <td className="px-2 py-1.5 text-center text-[10px]">
                          {w === "a" && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                              ← 優
                            </span>
                          )}
                          {w === "b" && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                              優 →
                            </span>
                          )}
                          {w === null && <span className="muted">—</span>}
                        </td>
                        <td className="px-3 py-1.5">
                          <div className="flex items-center gap-2">
                            <ScoreBar value={vb} risk={row.risk} />
                            <span
                              className={
                                "w-8 text-left font-mono text-xs font-semibold tabular-nums " +
                                scoreTone(vb, row.risk)
                              }
                            >
                              {vb}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="muted text-right text-[10px]">
            市場資料更新：{formatFetchedAt(lastFetchedAt)}
          </div>
        </>
      )}
    </div>
  );
}
