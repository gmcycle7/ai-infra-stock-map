import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { companies, companyById } from "../data/companies";
import { categoryBySlug } from "../data/categories";
import { getKpi } from "../lib/kpi";
import {
  getQuote,
  formatPrice,
  formatMarketCap,
  formatPE,
  lastFetchedAt,
  formatFetchedAt,
} from "../services/marketData";
import { Sparkline } from "../components/Sparkline";
import { windowReturn } from "../lib/priceWindow";
import { PriceDelta } from "../components/PriceDelta";
import { InvestmentTypeBadge } from "../components/InvestmentTypeBadge";
import {
  MarketBadge,
  PositionBadge,
  ScoreBadge,
  ConfidenceBadge,
  Tag,
} from "../components/Badge";
import { KpiRadar } from "../components/KpiRadar";
import { CsvButton } from "../components/CsvButton";
import { toCsv, todayIso } from "../lib/csv";
import { useWatchlist } from "../context/watchlistContextValue";
import type { InvestmentKpi } from "../types";

const MAX_COMPARE = 4;

const KPI_ROWS: Array<{ label: string; key: keyof InvestmentKpi; risk?: boolean }> = [
  { label: "短期催化（3-12 月）", key: "shortTermScore" },
  { label: "三年成長", key: "threeYearScore" },
  { label: "五年護城河", key: "fiveYearScore" },
  { label: "十年結構性", key: "tenYearScore" },
  { label: "整體風險", key: "riskScore", risk: true },
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

function bestIdx(values: number[], risk = false): number {
  // 找最佳：非風險 = max；風險 = min
  let best = 0;
  for (let i = 1; i < values.length; i++) {
    if (risk ? values[i] < values[best] : values[i] > values[best]) best = i;
  }
  // 若全部相等，回 -1（不標記）
  if (values.every((v) => v === values[best])) return -1;
  return best;
}

function CompanyPicker({
  label,
  value,
  onChange,
  excludeIds,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  excludeIds: string[];
  optional?: boolean;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, typeof companies>();
    for (const c of companies) {
      if (excludeIds.includes(c.id)) continue;
      const cat = c.category[0];
      const arr = map.get(cat) ?? [];
      arr.push(c);
      map.set(cat, arr);
    }
    return [...map.entries()].sort((x, y) => x[0].localeCompare(y[0]));
  }, [excludeIds]);

  return (
    <label className="block min-w-0 flex-1">
      <span className="muted mb-1 block text-xs">{label}</span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{optional ? "— 留空 —" : "— 請選擇 —"}</option>
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
    <div className="space-y-3">
      <header className="card p-3">
        <Link to={`/company/${company.id}`} className="block">
          <div className="text-sm font-semibold hover:underline truncate">{company.name}</div>
          <div className="muted truncate text-[10px]">{company.nameEn}</div>
          <div className="mt-1 font-mono text-[10px] text-slate-500">{company.ticker}</div>
        </Link>
        <div className="mt-2 flex flex-wrap gap-1">
          <MarketBadge market={company.market} />
          <PositionBadge pos={company.supplyChainPosition} />
          <ScoreBadge score={company.aiImportanceScore} />
          <InvestmentTypeBadge type={kpi.investmentType} />
          <ConfidenceBadge level={company.confidenceLevel} />
        </div>
      </header>

      {quote && quote.price != null && (
        <div className="card flex items-end justify-between gap-2 p-2">
          <div className="min-w-0">
            <div className="muted text-[10px]">最新</div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xs font-semibold truncate">
                {formatPrice(quote.price, quote.currency)}
              </span>
              <PriceDelta pct={quote.changePercent} variant="inline" size="xs" />
            </div>
            <div className="muted mt-0.5 text-[9px]">
              3M <PriceDelta pct={r90} variant="inline" size="xs" /> · 1Y{" "}
              <PriceDelta pct={r365} variant="inline" size="xs" />
            </div>
            <div className="muted mt-0.5 text-[9px]">
              {formatMarketCap(quote.marketCap, quote.currency)}
            </div>
            <div className="muted text-[9px]">Fwd PE {formatPE(quote.forwardPE)}</div>
          </div>
          <div className="w-20 flex-shrink-0">
            <Sparkline data={quote.history ?? []} width={80} height={28} windowSize={252} />
          </div>
        </div>
      )}

      <div className="card p-3">
        <KpiRadar radar={kpi.radar} size={220} />
      </div>

      <div className="card space-y-1.5 p-3 text-xs">
        <h3 className="text-[11px] font-semibold uppercase muted">最大優勢</h3>
        <p className="text-[11px] text-slate-700 dark:text-slate-200 line-clamp-4">
          {company.competitiveAdvantage}
        </p>
        <h3 className="mt-2 text-[11px] font-semibold uppercase muted">主要風險</h3>
        <ul className="muted list-disc space-y-0.5 pl-4 text-[11px]">
          {company.risks.slice(0, 2).map((r) => <li key={r} className="line-clamp-2">{r}</li>)}
        </ul>
        <div className="mt-2 flex flex-wrap gap-1">
          {company.tags.slice(0, 4).map((t) => <Tag key={t} label={t} />)}
        </div>
      </div>
    </div>
  );
}

export function ComparePage() {
  const [params, setParams] = useSearchParams();
  const { ids: watchIds } = useWatchlist();

  // 從 URL 讀（a/b/c/d）
  const init = ["a", "b", "c", "d"].map((k) => params.get(k) ?? "");
  while (init.length < MAX_COMPARE) init.push("");
  const [picks, setPicks] = useState<string[]>(init);

  function update(idx: number, id: string) {
    const next = [...picks];
    next[idx] = id;
    setPicks(next);
    const p = new URLSearchParams();
    next.forEach((v, i) => {
      if (v) p.set(["a", "b", "c", "d"][i], v);
    });
    setParams(p);
  }

  function fromWatchlist() {
    const newPicks = watchIds.slice(0, MAX_COMPARE);
    while (newPicks.length < MAX_COMPARE) newPicks.push("");
    setPicks(newPicks);
    const p = new URLSearchParams();
    newPicks.forEach((v, i) => {
      if (v) p.set(["a", "b", "c", "d"][i], v);
    });
    setParams(p);
  }

  const activeCompanies = picks
    .map((id) => (id ? companyById[id] : undefined))
    .filter((c): c is (typeof companies)[number] => !!c);

  const activeCount = activeCompanies.length;

  const csv = useMemo(() => {
    if (activeCompanies.length < 2) return "";
    const rows: Array<Record<string, unknown>> = [];
    for (const row of KPI_ROWS) {
      const r: Record<string, unknown> = { dimension: row.label };
      activeCompanies.forEach((c) => {
        const k = getKpi(c);
        r[c.name] = k[row.key];
      });
      rows.push(r);
    }
    return toCsv(rows);
  }, [activeCompanies]);

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">多公司比較</h1>
        <p className="muted mt-1 text-sm">
          並排比較最多 4 家公司的 KPI、市場資料、雷達圖、優勢與風險。
          每維度會自動標示「← 優」勝者。
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
          {picks.map((v, i) => (
            <CompanyPicker
              key={i}
              label={`${["A", "B", "C", "D"][i]} 公司${i >= 2 ? "（可選）" : ""}`}
              value={v}
              onChange={(id) => update(i, id)}
              excludeIds={picks.filter((_, j) => j !== i && picks[j])}
              optional={i >= 2}
            />
          ))}
        </div>

        <div className="muted mt-3 flex flex-wrap items-baseline gap-1 text-[11px]">
          <span>快速：</span>
          {[
            [["nvidia", "amd"], "Nvidia vs AMD"],
            [["alchip", "guc"], "Alchip vs GUC"],
            [["avc", "auras"], "雙鴻 vs 奇鋐"],
            [["astera", "credo", "synopsys", "cadence"], "高速介面 4 強"],
            [["coherent", "lumentum", "fabrinet", "aaoi"], "光通訊 4 大"],
            [["unimicron", "nanyapcb", "ibiden", "shinko"], "ABF 載板 4 強"],
            [["wiwynn", "quanta", "wistron", "inventec"], "AI Server ODM 4 大"],
            [["delta", "liteon", "acbel", "chicony"], "台廠電源 4 雄"],
            [["camtek", "onto", "advantest", "kla"], "HBM/設備 4 強"],
            [["mps", "infineon", "ti", "onsemi"], "電源 IC 4 強"],
            [["broadcom", "marvell", "synopsys", "cadence"], "EDA + ASIC 4 大"],
          ].map(([ids, label]) => (
            <button
              key={label as string}
              type="button"
              onClick={() => {
                const newPicks = [...(ids as string[])];
                while (newPicks.length < MAX_COMPARE) newPicks.push("");
                setPicks(newPicks);
                const p = new URLSearchParams();
                (ids as string[]).forEach((v, i) => p.set(["a", "b", "c", "d"][i], v));
                setParams(p);
              }}
              className="rounded border border-slate-200 px-1.5 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {label}
            </button>
          ))}
          {watchIds.length >= 2 && (
            <button
              type="button"
              onClick={fromWatchlist}
              className="rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300"
            >
              ★ 比較我關注的前 {Math.min(MAX_COMPARE, watchIds.length)} 家
            </button>
          )}
        </div>
      </header>

      {activeCount < 2 ? (
        <div className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">
          至少選 2 家公司開始比較（最多 4 家）。
        </div>
      ) : (
        <>
          {/* 公司欄位（動態 2-4 列） */}
          <div
            className="grid grid-cols-1 gap-3"
            style={{
              gridTemplateColumns:
                activeCount === 2
                  ? "repeat(2, minmax(0, 1fr))"
                  : activeCount === 3
                    ? "repeat(3, minmax(0, 1fr))"
                    : "repeat(4, minmax(0, 1fr))",
            }}
          >
            {activeCompanies.map((c) => (
              <CompanyColumn key={c.id} company={c} />
            ))}
          </div>

          {/* 並排 KPI 比較表 */}
          <section className="card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="section-title text-base">並排 KPI 比較表</h2>
              <CsvButton
                filename={`compare-${todayIso()}-${activeCompanies.map((c) => c.id).join("-")}.csv`}
                csv={csv}
                label="匯出 CSV"
                size="sm"
              />
            </div>
            <p className="muted mt-1 text-xs">
              綠色「優」標示該維度勝者（風險維度則是「低 = 優」）。
              <Link to="/kpi-method" className="ml-1 text-brand-600 hover:underline dark:text-brand-400">
                看公式
              </Link>
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-2 py-2">維度</th>
                    {activeCompanies.map((c) => (
                      <th key={c.id} className="px-2 py-2 text-center">
                        <Link to={`/company/${c.id}`} className="hover:underline">
                          {c.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {KPI_ROWS.map((row) => {
                    const values = activeCompanies.map((c) => getKpi(c)[row.key] as number);
                    const best = bestIdx(values, row.risk);
                    return (
                      <tr key={row.key as string}>
                        <td className="px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300">
                          {row.label}
                        </td>
                        {values.map((v, i) => (
                          <td key={i} className="px-2 py-1.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={
                                  "w-8 text-right font-mono text-xs font-semibold tabular-nums " +
                                  scoreTone(v, row.risk)
                                }
                              >
                                {v}
                              </span>
                              <ScoreBar value={v} risk={row.risk} />
                              {i === best && (
                                <span className="rounded bg-emerald-100 px-1 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                  ★
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="muted text-right text-[10px]">
            資料更新：{formatFetchedAt(lastFetchedAt)}
          </div>
        </>
      )}
    </div>
  );
}
