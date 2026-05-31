import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { companies } from "../data/companies";
import { categoryBySlug } from "../data/categories";
import {
  getQuote,
  getBenchmark,
  BENCHMARK_LABELS,
  type HistoryPoint,
} from "../services/marketData";
import { useWatchlist } from "../context/watchlistContextValue";
import { PriceDelta } from "../components/PriceDelta";
import type { Company } from "../types";

type Range = "3M" | "6M" | "1Y" | "2Y";
const RANGE_DAYS: Record<Range, number> = {
  "3M": 90,
  "6M": 180,
  "1Y": 252,
  "2Y": 504,
};

type WeightingMode = "equal" | "marketCap" | "custom";

interface PickWithWeight {
  company: Company;
  weight: number;
}

/** 把 history slice 標準化到 100，並依日期填齊（線性對齊） */
function normalize(history: HistoryPoint[], days: number): Array<{ d: string; c: number }> {
  if (history.length === 0) return [];
  const slice = history.slice(-days);
  if (slice.length === 0) return [];
  const base = slice[0].c;
  return slice.map((p) => ({ d: p.d, c: (p.c / base) * 100 }));
}

export type ExclusionReason =
  | "no-quote"      // Yahoo 完全無此 ticker 資料
  | "no-history"   // 有 quote 但 history 空
  | "too-short";   // history 長度 < 要求區間的一半

export interface ExcludedPick {
  company: Company;
  reason: ExclusionReason;
  reasonLabel: string;
  availableDays: number;
}

export interface PortfolioBuildResult {
  series: Array<{ d: string; v: number }>;
  usedPicks: PickWithWeight[];   // 實際納入計算的公司
  excluded: ExcludedPick[];       // 被排除的公司 + 原因
  effectiveDays: number;          // 實際使用的天數（可能 < 要求）
}

const REASON_LABEL: Record<ExclusionReason, string> = {
  "no-quote": "Yahoo Finance 無此 ticker 資料",
  "no-history": "有股價但無歷史資料",
  "too-short": "歷史資料不足以涵蓋要求區間",
};

/** 把多家公司的 normalized series 對齊到「共同日期軸」並按權重加總；同時回報排除清單 */
function buildPortfolioSeries(picks: PickWithWeight[], days: number): PortfolioBuildResult {
  const result: PortfolioBuildResult = {
    series: [],
    usedPicks: [],
    excluded: [],
    effectiveDays: 0,
  };

  if (picks.length === 0) return result;

  // 1. 對每家公司分類：有用 / 排除（記原因）
  const validSeries: Array<{ pick: PickWithWeight; norm: Array<{ d: string; c: number }> }> = [];

  for (const pick of picks) {
    const q = getQuote(pick.company.id);
    if (!q) {
      result.excluded.push({
        company: pick.company,
        reason: "no-quote",
        reasonLabel: REASON_LABEL["no-quote"],
        availableDays: 0,
      });
      continue;
    }
    if (!q.history || q.history.length === 0) {
      result.excluded.push({
        company: pick.company,
        reason: "no-history",
        reasonLabel: REASON_LABEL["no-history"],
        availableDays: 0,
      });
      continue;
    }
    // 至少要 days × 0.5 才算夠（避免單一短期 series 把整個組合截太短）
    if (q.history.length < days * 0.5) {
      result.excluded.push({
        company: pick.company,
        reason: "too-short",
        reasonLabel: `${REASON_LABEL["too-short"]}（僅 ${q.history.length} 個交易日）`,
        availableDays: q.history.length,
      });
      continue;
    }
    const norm = normalize(q.history, days);
    if (norm.length === 0) {
      result.excluded.push({
        company: pick.company,
        reason: "no-history",
        reasonLabel: REASON_LABEL["no-history"],
        availableDays: 0,
      });
      continue;
    }
    validSeries.push({ pick, norm });
  }

  if (validSeries.length === 0) return result;

  // 2. 計算實際使用的天數（取所有有效 series 的最小長度）
  const minLen = Math.min(...validSeries.map((s) => s.norm.length));
  if (minLen < 2) return result;

  result.effectiveDays = minLen;
  result.usedPicks = validSeries.map((s) => s.pick);

  // 3. 重新正規化權重（排除掉的不算）
  const totalW = result.usedPicks.reduce((s, p) => s + p.weight, 0);
  if (totalW === 0) return result;

  // 4. 重新正規化每家公司的 normalized series 從共同起點（minLen 切片的第一個點）開始
  const reNormSeries = validSeries.map((s) => {
    const tail = s.norm.slice(-minLen);
    const base = tail[0].c;
    return {
      pick: s.pick,
      points: tail.map((p) => ({ d: p.d, c: (p.c / base) * 100 })),
    };
  });

  const dates = reNormSeries[0].points.map((p) => p.d);
  for (let i = 0; i < minLen; i++) {
    let weighted = 0;
    for (const s of reNormSeries) {
      weighted += (s.points[i].c * s.pick.weight) / totalW;
    }
    result.series.push({ d: dates[i], v: weighted });
  }

  return result;
}

function totalReturn(series: Array<{ d: string; v: number }>): number {
  if (series.length < 2) return 0;
  const last = series[series.length - 1].v;
  return last - 100;
}

function maxDrawdown(series: Array<{ d: string; v: number }>): number {
  let peak = 100;
  let maxDD = 0;
  for (const p of series) {
    if (p.v > peak) peak = p.v;
    const dd = (p.v / peak - 1) * 100;
    if (dd < maxDD) maxDD = dd;
  }
  return maxDD;
}

export function BacktestPage() {
  const { ids: watchIds } = useWatchlist();
  const [params, setParams] = useSearchParams();

  // 初始選取
  const initialIds = useMemo(() => {
    const fromUrl = params.get("ids");
    if (fromUrl) return fromUrl.split(",").filter(Boolean);
    if (watchIds.length > 0) return watchIds.slice(0, 10);
    return [];
  }, [params, watchIds]);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [weightMode, setWeightMode] = useState<WeightingMode>("equal");
  const [range, setRange] = useState<Range>("1Y");
  const [benchmark, setBenchmark] = useState("soxx");

  // 同步 URL
  useEffect(() => {
    if (selectedIds.length > 0) {
      const p = new URLSearchParams();
      p.set("ids", selectedIds.join(","));
      setParams(p, { replace: true });
    }
  }, [selectedIds, setParams]);

  // 計算權重
  const picks: PickWithWeight[] = useMemo(() => {
    const sel = selectedIds
      .map((id) => companies.find((c) => c.id === id))
      .filter((c): c is Company => !!c);
    if (sel.length === 0) return [];

    if (weightMode === "equal") {
      return sel.map((c) => ({ company: c, weight: 1 }));
    } else if (weightMode === "marketCap") {
      return sel.map((c) => {
        const q = getQuote(c.id);
        return { company: c, weight: q?.marketCap ?? 0 };
      });
    } else {
      return sel.map((c) => ({ company: c, weight: weights[c.id] ?? 1 }));
    }
  }, [selectedIds, weightMode, weights]);

  // 組合 series
  const days = RANGE_DAYS[range];
  const buildResult = useMemo(() => buildPortfolioSeries(picks, days), [picks, days]);
  const portfolio = buildResult.series;
  const benchQuote = getBenchmark(benchmark as "soxx" | "smh" | "spx" | "tw50" | "twii");
  const benchSeries = useMemo(
    () => (benchQuote ? normalize(benchQuote.history, days) : []),
    [benchQuote, days],
  );

  const portfolioReturn = totalReturn(portfolio);
  const benchReturn = totalReturn(benchSeries.map((p) => ({ d: p.d, v: p.c })));
  const alpha = portfolioReturn - benchReturn;
  const maxDD = maxDrawdown(portfolio);

  function toggleSelect(id: string) {
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  // SVG chart
  const W = 900;
  const H = 240;
  const PAD_L = 50;
  const PAD_R = 16;
  const PAD_T = 10;
  const PAD_B = 26;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const allValues = [...portfolio.map((p) => p.v), ...benchSeries.map((p) => p.c), 100];
  const yMin = allValues.length > 0 ? Math.min(...allValues) - 2 : 90;
  const yMax = allValues.length > 0 ? Math.max(...allValues) + 2 : 110;
  const range_v = yMax - yMin || 1;

  function xOf(idx: number, total: number) {
    return PAD_L + (idx / Math.max(total - 1, 1)) * innerW;
  }
  function yOf(c: number) {
    return PAD_T + (1 - (c - yMin) / range_v) * innerH;
  }

  const portfolioPath = portfolio
    .map((p, i) =>
      (i === 0 ? "M" : "L") + xOf(i, portfolio.length).toFixed(1) + " " + yOf(p.v).toFixed(1),
    )
    .join(" ");

  const benchPath = benchSeries
    .map((p, i) =>
      (i === 0 ? "M" : "L") + xOf(i, benchSeries.length).toFixed(1) + " " + yOf(p.c).toFixed(1),
    )
    .join(" ");

  const beat = alpha > 0;

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">組合回測模擬器</h1>
        <p className="muted mt-1 text-sm">
          假設你 N 個月前等權重買了選定公司，今天報酬會是多少？對照基準（SOXX / 0050 / SPX）的「真實 alpha」是多少？
        </p>
        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>幾個必須注意的事：</strong>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>這是 <strong>事後回測</strong>，不代表未來 — 過去贏 alpha 不保證未來繼續</li>
            <li>未計入交易成本、稅、FX 變動；台幣計價買美股實際差異會更大</li>
            <li>不能計算「分批進場」或「停損點」 — 純做 buy-and-hold 模擬</li>
            <li>市值權重會自動排除無市值資料的公司</li>
          </ol>
        </div>
      </header>

      {/* 控制列 */}
      <section className="card space-y-4 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="muted mb-1 block text-xs">回測期間</span>
            <div className="inline-flex gap-1 rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs dark:border-slate-700 dark:bg-slate-900">
              {(Object.keys(RANGE_DAYS) as Range[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={
                    "rounded px-2.5 py-1 " +
                    (range === r
                      ? "bg-brand-600 text-white"
                      : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800")
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="muted mb-1 block text-xs">權重方式</span>
            <select
              className="input"
              value={weightMode}
              onChange={(e) => setWeightMode(e.target.value as WeightingMode)}
            >
              <option value="equal">等權重</option>
              <option value="marketCap">市值權重</option>
              <option value="custom">自訂（下方設定）</option>
            </select>
          </label>

          <label className="block">
            <span className="muted mb-1 block text-xs">對照基準</span>
            <select
              className="input"
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value)}
            >
              {Object.entries(BENCHMARK_LABELS).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {watchIds.length > 0 && (
            <button
              type="button"
              className="btn"
              onClick={() => setSelectedIds(watchIds)}
            >
              ★ 載入我的關注清單（{watchIds.length} 家）
            </button>
          )}
        </div>
      </section>

      {/* 結果 */}
      {selectedIds.length === 0 ? (
        <div className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">
          請從下方選擇至少 1 家公司，或載入你的關注清單。
        </div>
      ) : (
        <>
          {/* 缺資料警告 — 永遠顯示（如有） */}
          {buildResult.excluded.length > 0 && (
            <section className="card border-amber-300 bg-amber-50/40 p-4 dark:border-amber-700 dark:bg-amber-950/20">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-semibold text-amber-900 dark:text-amber-200">
                  ⚠️ {buildResult.excluded.length} 家公司因缺資料被排除
                </h2>
                <span className="muted text-xs">
                  納入計算的：{buildResult.usedPicks.length} 家
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-xs">
                {buildResult.excluded.map((ex) => (
                  <li key={ex.company.id} className="flex flex-wrap items-baseline gap-2">
                    <Link
                      to={`/company/${ex.company.id}`}
                      className="font-medium hover:underline"
                    >
                      {ex.company.name}
                    </Link>
                    <span className="muted font-mono text-[10px]">{ex.company.ticker}</span>
                    <span
                      className={
                        "chip text-[10px] " +
                        (ex.reason === "too-short"
                          ? "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
                          : "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-200")
                      }
                    >
                      {ex.reasonLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSelect(ex.company.id)}
                      className="ml-auto text-[10px] text-rose-600 hover:underline"
                    >
                      從選取中移除
                    </button>
                  </li>
                ))}
              </ul>
              <p className="muted mt-3 text-[10px]">
                以下情況常見：(1) 部分小型台股 Yahoo Finance 無資料；
                (2) 新上市公司歷史不足要求區間；
                (3) Yahoo ticker 對應有誤。回測仍會用其他 {buildResult.usedPicks.length} 家公司繼續計算 — 但「組合代表性」會打折。
              </p>
            </section>
          )}

          {/* 如果完全沒可用公司 */}
          {portfolio.length === 0 ? (
            <div className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              全部選定公司皆無足夠歷史資料 — 試試縮短期間，或挑其他公司。
            </div>
          ) : (
            <>
              {/* 若實際使用天數 < 要求天數，提示 */}
              {buildResult.effectiveDays < days && buildResult.effectiveDays > 0 && (
                <div className="rounded-lg border border-sky-300 bg-sky-50 p-3 text-xs text-sky-800 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200">
                  ℹ️ 實際回測期間為 <strong>{buildResult.effectiveDays} 個交易日</strong>
                  （要求 {days} 天）— 因部分公司歷史較短，自動截短為共同期間。
                </div>
              )}

          {/* 主結果 + 圖 */}
          <section className="card space-y-3 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <ResultBox
                label="組合報酬"
                value={(portfolioReturn >= 0 ? "+" : "") + portfolioReturn.toFixed(2) + "%"}
                tone={
                  portfolioReturn >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }
                hint={`${buildResult.effectiveDays} 天 · ${buildResult.usedPicks.length} 家`}
              />
              <ResultBox
                label="對照報酬"
                value={(benchReturn >= 0 ? "+" : "") + benchReturn.toFixed(2) + "%"}
                tone="text-slate-700 dark:text-slate-200"
                hint={BENCHMARK_LABELS[benchmark]}
              />
              <ResultBox
                label="Alpha（差距）"
                value={(beat ? "+" : "") + alpha.toFixed(2) + "%"}
                tone={
                  beat
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-rose-700 dark:text-rose-300"
                }
                hint={beat ? "✓ 你跑贏基準" : "✗ 你落後基準"}
              />
              <ResultBox
                label="最大回撤"
                value={maxDD.toFixed(2) + "%"}
                tone="text-rose-600 dark:text-rose-400"
                hint="從高點到低點的最大跌幅"
              />
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              {/* 100 基準線 */}
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={yOf(100)}
                y2={yOf(100)}
                className="stroke-slate-300 dark:stroke-slate-700"
                strokeDasharray="2 2"
              />
              <text x={PAD_L - 4} y={yOf(100)} textAnchor="end" dominantBaseline="central" className="fill-slate-500 text-[10px]">
                100
              </text>

              {/* Y 軸刻度 */}
              {[yMin, (yMin + yMax) / 2, yMax].map((v, i) => (
                <text
                  key={i}
                  x={PAD_L - 4}
                  y={yOf(v)}
                  textAnchor="end"
                  dominantBaseline="central"
                  className="fill-slate-500 text-[10px]"
                >
                  {v.toFixed(0)}
                </text>
              ))}

              {/* 基準（灰虛線） */}
              <path
                d={benchPath}
                className="fill-none stroke-slate-400 dark:stroke-slate-500"
                strokeWidth={1.5}
                strokeDasharray="3 2"
              />
              {/* 組合（粗線） */}
              <path
                d={portfolioPath}
                className={
                  "fill-none " +
                  (beat
                    ? "stroke-emerald-600 dark:stroke-emerald-400"
                    : "stroke-rose-600 dark:stroke-rose-400")
                }
                strokeWidth={2.5}
              />

              {/* Legend */}
              <g transform={`translate(${PAD_L + 8}, ${PAD_T + 4})`}>
                <rect x={0} y={0} width={170} height={32} rx={4} className="fill-white/80 dark:fill-slate-900/80" />
                <line x1={6} y1={10} x2={20} y2={10} className={beat ? "stroke-emerald-600 dark:stroke-emerald-400" : "stroke-rose-600 dark:stroke-rose-400"} strokeWidth={2.5} />
                <text x={24} y={10} dominantBaseline="central" className="fill-slate-700 text-[10px] dark:fill-slate-300">你的組合</text>
                <line x1={6} y1={24} x2={20} y2={24} className="stroke-slate-400" strokeWidth={1.5} strokeDasharray="3 2" />
                <text x={24} y={24} dominantBaseline="central" className="fill-slate-700 text-[10px] dark:fill-slate-300">{BENCHMARK_LABELS[benchmark]}</text>
              </g>
            </svg>
          </section>

          {/* 組合明細表 */}
          <section className="card p-4">
            <h2 className="section-title text-base">組合明細</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-3 py-2">公司</th>
                    <th className="px-3 py-2">分類</th>
                    <th className="px-3 py-2 text-right">權重</th>
                    <th className="px-3 py-2 text-right">{range} 個股報酬</th>
                    <th className="px-3 py-2">移除</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {picks.map((p) => {
                    const q = getQuote(p.company.id);
                    const r = q?.history
                      ? (() => {
                          const view = q.history.slice(-days);
                          if (view.length < 2) return null;
                          return ((view[view.length - 1].c / view[0].c) - 1) * 100;
                        })()
                      : null;
                    const totalW = picks.reduce((s, x) => s + x.weight, 0);
                    const wPct = totalW > 0 ? (p.weight / totalW) * 100 : 0;
                    return (
                      <tr key={p.company.id}>
                        <td className="px-3 py-1.5">
                          <Link to={`/company/${p.company.id}`} className="font-medium hover:underline">
                            {p.company.name}
                          </Link>
                        </td>
                        <td className="px-3 py-1.5 text-[10px] muted">
                          {p.company.category
                            .slice(0, 2)
                            .map((s) => categoryBySlug[s]?.nameZh ?? s)
                            .join(", ")}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono">
                          {weightMode === "custom" ? (
                            <input
                              type="number"
                              className="w-20 rounded border border-slate-300 px-1 py-0.5 text-right dark:border-slate-700 dark:bg-slate-900"
                              value={weights[p.company.id] ?? 1}
                              onChange={(e) =>
                                setWeights({
                                  ...weights,
                                  [p.company.id]: Number(e.target.value),
                                })
                              }
                              min={0}
                              step={0.1}
                            />
                          ) : (
                            wPct.toFixed(1) + "%"
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <PriceDelta pct={r} variant="inline" size="xs" />
                        </td>
                        <td className="px-3 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelect(p.company.id)}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            移除
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
            </>
          )}
        </>
      )}

      {/* 公司選擇 */}
      <section className="card p-4">
        <h2 className="section-title text-base">選擇公司（{selectedIds.length} 家已選）</h2>
        <p className="muted mt-1 text-xs">點下方公司加入 / 移除</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {companies.map((c) => {
            const on = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleSelect(c.id)}
                className={
                  "rounded-md border px-2 py-0.5 text-xs transition " +
                  (on
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800")
                }
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ResultBox({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string;
  tone?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="muted text-xs">{label}</div>
      <div className={"mt-1 text-xl font-bold tabular-nums " + (tone ?? "")}>{value}</div>
      {hint && <div className="muted mt-0.5 text-[10px]">{hint}</div>}
    </div>
  );
}
