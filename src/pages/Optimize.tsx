import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "../context/watchlistContextValue";
import { companies } from "../data/companies";
import { getQuote, BENCHMARK_LABELS, getBenchmark } from "../services/marketData";
import { windowReturn } from "../lib/priceWindow";
import { PriceDelta } from "../components/PriceDelta";
import { CsvButton } from "../components/CsvButton";
import { toCsv, todayIso } from "../lib/csv";
import type { Company } from "../types";

type Period = "3M" | "6M" | "1Y" | "2Y";
const PERIOD_DAYS: Record<Period, number> = {
  "3M": 63,
  "6M": 126,
  "1Y": 252,
  "2Y": 504,
};

const MIN_W = 0.005; // 0.5%
const MAX_W = 0.20;  // 20%

interface Candidate {
  company: Company;
  ret: number | null;          // 該期間個股報酬 (%)
  forwardPE: number | null;
  trailingPE: number | null;
}

interface Allocation {
  candidate: Candidate;
  weight: number; // 0-1
}

/**
 * 線性規劃最佳解（最大化 Σ w_i × r_i，受限於 MIN_W ≤ w_i ≤ MAX_W，Σ w_i = 1）：
 * 排序後從報酬高的開始給 MAX_W，剩餘給 MIN_W。
 * 中間若有「剩餘 < MAX_W - MIN_W」需要部分填入。
 */
function optimize(candidates: Candidate[]): Allocation[] {
  const validCands = candidates.filter((c) => c.ret != null);
  if (validCands.length === 0) return [];

  const n = validCands.length;
  const minTotal = n * MIN_W;
  if (minTotal > 1.0001) {
    // 公司數過多無法滿足 minimum；退回到等權重
    return validCands.map((c) => ({ candidate: c, weight: 1 / n }));
  }

  // 依報酬降序排
  const sorted = [...validCands].sort((a, b) => (b.ret ?? 0) - (a.ret ?? 0));

  // 先給所有公司 MIN_W
  const weights = new Array(sorted.length).fill(MIN_W);
  let remaining = 1 - minTotal;
  const extraCap = MAX_W - MIN_W; // 每家最多可額外加多少

  // 從報酬最高開始填到 MAX_W
  for (let i = 0; i < sorted.length && remaining > 0; i++) {
    const add = Math.min(extraCap, remaining);
    weights[i] += add;
    remaining -= add;
  }

  // 數值誤差修正
  const sum = weights.reduce((s, w) => s + w, 0);
  if (Math.abs(sum - 1) > 1e-6) {
    const factor = 1 / sum;
    for (let i = 0; i < weights.length; i++) weights[i] *= factor;
  }

  return sorted.map((c, i) => ({ candidate: c, weight: weights[i] }));
}

/** 等權重作為對照 */
function equalAllocation(candidates: Candidate[]): Allocation[] {
  const valid = candidates.filter((c) => c.ret != null);
  if (valid.length === 0) return [];
  const w = 1 / valid.length;
  return valid.map((c) => ({ candidate: c, weight: w }));
}

function portfolioReturn(allocs: Allocation[]): number {
  return allocs.reduce((s, a) => s + a.weight * (a.candidate.ret ?? 0), 0);
}

function weightedAvg(
  allocs: Allocation[],
  selector: (c: Candidate) => number | null,
): { avg: number | null; coverage: number } {
  let totalW = 0;
  let weightedSum = 0;
  let validW = 0;
  for (const a of allocs) {
    totalW += a.weight;
    const v = selector(a.candidate);
    if (v != null && v > 0 && v < 1000) {
      // 過濾異常值（負 PE 或超大 PE 在 weighted avg 中無意義）
      weightedSum += a.weight * v;
      validW += a.weight;
    }
  }
  if (validW === 0) return { avg: null, coverage: 0 };
  return { avg: weightedSum / validW, coverage: validW / totalW };
}

function alpha(allocs: Allocation[], benchmarkRet: number): number {
  return portfolioReturn(allocs) - benchmarkRet;
}

function formatPE(v: number | null): string {
  if (v == null) return "—";
  return v.toFixed(1);
}

export function OptimizePage() {
  const { ids } = useWatchlist();
  const [period, setPeriod] = useState<Period>("1Y");
  const [benchmark, setBenchmark] = useState<string>("soxx");
  const days = PERIOD_DAYS[period];

  // 從 watchlist 載入 candidate 公司 + 計算指標
  const candidates: Candidate[] = useMemo(() => {
    return ids
      .map((id) => companies.find((c) => c.id === id))
      .filter((c): c is Company => !!c)
      .map((c) => {
        const q = getQuote(c.id);
        const r = q?.history ? windowReturn(q.history, days) : null;
        return {
          company: c,
          ret: r,
          forwardPE: q?.forwardPE ?? null,
          trailingPE: q?.trailingPE ?? null,
        };
      });
  }, [ids, days]);

  const excluded = candidates.filter((c) => c.ret == null);
  const valid = candidates.filter((c) => c.ret != null);

  const optimal = useMemo(() => optimize(candidates), [candidates]);
  const equal = useMemo(() => equalAllocation(candidates), [candidates]);

  const benchQuote = getBenchmark(benchmark as "soxx" | "smh" | "spx" | "tw50" | "twii");
  const benchRet = useMemo(() => {
    if (!benchQuote?.history) return null;
    return windowReturn(benchQuote.history, days);
  }, [benchQuote, days]);

  // 統計
  const optReturn = portfolioReturn(optimal);
  const eqReturn = portfolioReturn(equal);
  const optAlpha = benchRet != null ? alpha(optimal, benchRet) : null;
  const eqAlpha = benchRet != null ? alpha(equal, benchRet) : null;

  const optTrailingPE = weightedAvg(optimal, (c) => c.trailingPE);
  const optForwardPE = weightedAvg(optimal, (c) => c.forwardPE);
  const eqTrailingPE = weightedAvg(equal, (c) => c.trailingPE);
  const eqForwardPE = weightedAvg(equal, (c) => c.forwardPE);

  // 統計分布
  const atMax = optimal.filter((a) => a.weight >= MAX_W - 1e-6).length;
  const atMin = optimal.filter((a) => a.weight <= MIN_W + 1e-6).length;
  const middle = optimal.length - atMax - atMin;

  // CSV
  const csv = useMemo(() => {
    return toCsv(
      optimal.map((a, i) => ({
        rank: i + 1,
        name: a.candidate.company.name,
        ticker: a.candidate.company.ticker,
        weightPct: (a.weight * 100).toFixed(2) + "%",
        returnPct: a.candidate.ret != null ? a.candidate.ret.toFixed(2) + "%" : "",
        trailingPE: a.candidate.trailingPE != null ? a.candidate.trailingPE.toFixed(2) : "",
        forwardPE: a.candidate.forwardPE != null ? a.candidate.forwardPE.toFixed(2) : "",
        contribution: ((a.weight * (a.candidate.ret ?? 0)).toFixed(2)) + "%",
      })),
    );
  }, [optimal]);

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">組合最佳化模擬</h1>
        <p className="muted mt-1 text-sm">
          給定關注名單，找出「過去報酬最高」的權重配置（每家 0.5% - 20% 之間）。
          純事後最佳化 — 不代表未來。
        </p>
        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>必看的限制：</strong>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>這是<strong>事後完美後見之明</strong> — 真實投資時你不會知道哪家會贏</li>
            <li>未計入交易成本、稅、再平衡頻率、流動性</li>
            <li>過去報酬不代表未來；高 PE 公司歷史報酬高 ≠ 未來會繼續</li>
            <li>純 buy-and-hold 模擬；未考慮波動與最大回撤</li>
            <li>主要用法：(1) 看「事後最佳化能達到什麼」、(2) 比較等權重 vs 最佳，了解集中度溢價</li>
          </ul>
        </div>
      </header>

      {ids.length === 0 ? (
        <div className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">
          請先到 <Link to="/companies" className="text-brand-600 hover:underline dark:text-brand-400">公司列表</Link> 選一些公司加入關注名單，再回來這頁。
        </div>
      ) : (
        <>
          {/* 控制 */}
          <section className="card space-y-3 p-4">
            <div className="flex flex-wrap items-end gap-3">
              <label className="block">
                <span className="muted mb-1 block text-xs">回測期間</span>
                <div className="inline-flex gap-1 rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs dark:border-slate-700 dark:bg-slate-900">
                  {(Object.keys(PERIOD_DAYS) as Period[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={
                        "rounded px-3 py-1 " +
                        (period === p
                          ? "bg-brand-600 text-white"
                          : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800")
                      }
                    >
                      {p === "3M" ? "3 個月" : p === "6M" ? "6 個月" : p === "1Y" ? "12 個月" : "24 個月"}
                    </button>
                  ))}
                </div>
              </label>
              <label className="block">
                <span className="muted mb-1 block text-xs">對照基準</span>
                <select
                  className="input"
                  value={benchmark}
                  onChange={(e) => setBenchmark(e.target.value)}
                >
                  {Object.entries(BENCHMARK_LABELS).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </label>
              <div className="muted self-end text-xs">
                關注 {ids.length} 家 · 有效 {valid.length} 家 · 排除 {excluded.length} 家
              </div>
            </div>
          </section>

          {/* 排除清單 */}
          {excluded.length > 0 && (
            <section className="card border-amber-300 bg-amber-50/40 p-4 dark:border-amber-700 dark:bg-amber-950/20">
              <h2 className="text-base font-semibold text-amber-900 dark:text-amber-200">
                ⚠️ {excluded.length} 家因缺資料被排除
              </h2>
              <ul className="mt-2 space-y-0.5 text-xs">
                {excluded.map((c) => (
                  <li key={c.company.id}>
                    <Link to={`/company/${c.company.id}`} className="hover:underline">
                      {c.company.name}
                    </Link>
                    <span className="muted ml-2 font-mono text-[10px]">{c.company.ticker}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {valid.length === 0 ? (
            <div className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              所有公司缺乏歷史資料 — 換短期間試試。
            </div>
          ) : (
            <>
              {/* 最佳 vs 等權重 並排 */}
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="card border-emerald-300 bg-emerald-50/30 p-4 dark:border-emerald-700 dark:bg-emerald-950/20">
                  <h2 className="section-title text-base">🎯 最佳配置（事後）</h2>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Box label="組合報酬" value={(optReturn >= 0 ? "+" : "") + optReturn.toFixed(2) + "%"} tone={optReturn >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"} />
                    <Box
                      label={`Alpha vs ${BENCHMARK_LABELS[benchmark]}`}
                      value={
                        optAlpha == null
                          ? "—"
                          : (optAlpha >= 0 ? "+" : "") + optAlpha.toFixed(2) + "%"
                      }
                      tone={optAlpha == null ? "" : optAlpha >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}
                    />
                    <Box label="加權平均 P/E (TTM)" value={formatPE(optTrailingPE.avg)} hint={`覆蓋 ${(optTrailingPE.coverage * 100).toFixed(0)}%`} />
                    <Box label="加權平均 Fwd P/E" value={formatPE(optForwardPE.avg)} hint={`覆蓋 ${(optForwardPE.coverage * 100).toFixed(0)}%`} />
                  </div>
                  <div className="muted mt-3 text-[10px]">
                    {atMax} 家在上限 (20%) · {middle} 家在中間 · {atMin} 家在下限 (0.5%)
                  </div>
                </div>
                <div className="card border-sky-300 bg-sky-50/30 p-4 dark:border-sky-700 dark:bg-sky-950/20">
                  <h2 className="section-title text-base">⚖️ 等權重對照</h2>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Box label="組合報酬" value={(eqReturn >= 0 ? "+" : "") + eqReturn.toFixed(2) + "%"} tone={eqReturn >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"} />
                    <Box
                      label={`Alpha vs ${BENCHMARK_LABELS[benchmark]}`}
                      value={
                        eqAlpha == null
                          ? "—"
                          : (eqAlpha >= 0 ? "+" : "") + eqAlpha.toFixed(2) + "%"
                      }
                      tone={eqAlpha == null ? "" : eqAlpha >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}
                    />
                    <Box label="加權平均 P/E (TTM)" value={formatPE(eqTrailingPE.avg)} hint={`覆蓋 ${(eqTrailingPE.coverage * 100).toFixed(0)}%`} />
                    <Box label="加權平均 Fwd P/E" value={formatPE(eqForwardPE.avg)} hint={`覆蓋 ${(eqForwardPE.coverage * 100).toFixed(0)}%`} />
                  </div>
                  <div className="muted mt-3 text-[10px]">
                    每家 {((1 / valid.length) * 100).toFixed(2)}% · 全部 {valid.length} 家
                  </div>
                </div>
              </section>

              {/* 集中度溢價 */}
              <section className="card p-4 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="section-title text-base">集中度溢價</h2>
                  <span className="muted text-[10px]">最佳配置贏等權重多少 — 反映「事後選對贏家」的回報</span>
                </div>
                <div className="mt-3">
                  <span
                    className={
                      "text-3xl font-bold tabular-nums " +
                      (optReturn - eqReturn >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400")
                    }
                  >
                    {optReturn - eqReturn >= 0 ? "+" : ""}
                    {(optReturn - eqReturn).toFixed(2)}%
                  </span>
                </div>
                <p className="muted mt-2 text-xs">
                  數字越大代表你的關注名單中「贏家與輸家」差距越大；事前若能挑出贏家，獎勵越豐厚。
                  數字小 = 名單內表現均衡，集中持有 vs 平均持有差異不大。
                </p>
              </section>

              {/* 最佳配置完整表 */}
              <section className="card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="section-title text-base">最佳配置明細（依權重降序）</h2>
                  <CsvButton
                    filename={`optimal-allocation-${todayIso()}-${period}.csv`}
                    csv={csv}
                    label="匯出 CSV"
                    size="sm"
                  />
                </div>
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                      <tr>
                        <th className="px-2 py-2 w-10 text-center">#</th>
                        <th className="px-2 py-2">公司</th>
                        <th className="px-2 py-2 text-right">{period} 個股報酬</th>
                        <th className="px-2 py-2 text-right">P/E TTM</th>
                        <th className="px-2 py-2 text-right">Fwd P/E</th>
                        <th className="px-2 py-2 text-right">最佳權重</th>
                        <th className="px-2 py-2 text-right">貢獻</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {optimal.map((a, i) => {
                        const contribution = a.weight * (a.candidate.ret ?? 0);
                        const isMax = a.weight >= MAX_W - 1e-6;
                        const isMin = a.weight <= MIN_W + 1e-6;
                        return (
                          <tr key={a.candidate.company.id}>
                            <td className="px-2 py-1.5 text-center text-xs muted">{i + 1}</td>
                            <td className="px-2 py-1.5">
                              <Link
                                to={`/company/${a.candidate.company.id}`}
                                className="font-medium hover:underline"
                              >
                                {a.candidate.company.name}
                              </Link>
                              <span className="muted ml-2 font-mono text-[10px]">
                                {a.candidate.company.ticker}
                              </span>
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <PriceDelta pct={a.candidate.ret} variant="inline" size="xs" />
                            </td>
                            <td className="px-2 py-1.5 text-right font-mono">{formatPE(a.candidate.trailingPE)}</td>
                            <td className="px-2 py-1.5 text-right font-mono">{formatPE(a.candidate.forwardPE)}</td>
                            <td className="px-2 py-1.5 text-right font-mono">
                              <span className={
                                isMax
                                  ? "font-bold text-emerald-600 dark:text-emerald-400"
                                  : isMin
                                    ? "muted"
                                    : "font-semibold"
                              }>
                                {(a.weight * 100).toFixed(2)}%
                              </span>
                              {isMax && <span className="ml-1 text-[10px] text-emerald-500">▲</span>}
                              {isMin && <span className="ml-1 text-[10px]">▼</span>}
                            </td>
                            <td className={
                              "px-2 py-1.5 text-right font-mono " +
                              (contribution >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400")
                            }>
                              {contribution >= 0 ? "+" : ""}{contribution.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-50 text-sm font-bold dark:bg-slate-900">
                      <tr>
                        <td colSpan={5} className="px-2 py-2 text-right">合計</td>
                        <td className="px-2 py-2 text-right font-mono">
                          {(optimal.reduce((s, a) => s + a.weight, 0) * 100).toFixed(2)}%
                        </td>
                        <td className={
                          "px-2 py-2 text-right font-mono " +
                          (optReturn >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400")
                        }>
                          {optReturn >= 0 ? "+" : ""}{optReturn.toFixed(2)}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>

              <section className="card p-4 text-xs">
                <h2 className="section-title text-base">演算法說明</h2>
                <ul className="muted mt-2 list-disc space-y-1 pl-5">
                  <li>限制：每家 <strong>{(MIN_W * 100).toFixed(1)}% ≤ 權重 ≤ {(MAX_W * 100).toFixed(0)}%</strong>，總和 = 100%</li>
                  <li>線性目標 + 線性限制 → 最佳解在頂點上，即多數公司會在上限或下限</li>
                  <li>演算法：按 {period} 個股報酬降序排，從報酬最高開始給 {(MAX_W * 100).toFixed(0)}% 直到剩餘額度用完；其餘均給 {(MIN_W * 100).toFixed(1)}%</li>
                  <li>「貢獻」= 權重 × 個股報酬，加總即為組合報酬</li>
                  <li>加權平均 P/E：以實際權重計算，自動排除負值與 &gt; 1000 的異常值</li>
                </ul>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Box({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
      <div className="muted text-[10px]">{label}</div>
      <div className={"mt-1 text-base font-bold tabular-nums " + (tone ?? "")}>{value}</div>
      {hint && <div className="muted text-[9px]">{hint}</div>}
    </div>
  );
}
