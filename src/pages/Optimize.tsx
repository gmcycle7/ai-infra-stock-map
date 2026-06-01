import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "../context/watchlistContextValue";
import { companies } from "../data/companies";
import { getQuote, BENCHMARK_LABELS, getBenchmark } from "../services/marketData";
import { windowReturn } from "../lib/priceWindow";
import { PriceDelta } from "../components/PriceDelta";
import { CsvButton } from "../components/CsvButton";
import { toCsv, todayIso } from "../lib/csv";
import { companyLeadershipScore } from "../data/keyPeople";
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
const STEP = 0.005;  // 0.5% 一檔

interface Candidate {
  company: Company;
  ret: number | null;          // 該期間個股報酬 (%)
  forwardPE: number | null;
  trailingPE: number | null;
  leadership: number | null;    // 公司層級平均領導力 (0-100，多位平均)
}

interface Allocation {
  candidate: Candidate;
  weight: number; // 0-1
}

/**
 * 排名線性遞減配置（每 0.5% 為一檔）：
 *   weight_i = a − b × i (i 為排名，0 = 報酬最高)
 *   受限於：a ≤ MAX_W, a − b(n−1) ≥ MIN_W, Σ weight_i = 1
 *
 * 由 Σ weight_i = 1 推得 a = 1/n + b(n−1)/2。
 * 取「使兩個邊界限制皆滿足」的最大 b — 也就是最大差異化、
 * 頂端最接近 MAX_W、底端最接近 MIN_W 的線性遞減。
 *
 * 為何不直接用 LP 解（top 數家 20% + 其餘 0.5%）？
 *   實務上沒人會把投資集中在 5 檔各 20% — 多數投資人會把高信心股權重拉高，
 *   但低信心股仍給「足以追蹤」的非零權重，且權重呈分層遞減。本演算法
 *   即此「分層配置」的數學形式。
 */
function optimize(candidates: Candidate[]): Allocation[] {
  const validCands = candidates.filter((c) => c.ret != null);
  if (validCands.length === 0) return [];

  const n = validCands.length;
  if (n === 1) return [{ candidate: validCands[0], weight: 1 }];
  if (n * MIN_W > 1.0001) {
    // 公司數過多無法滿足最低 0.5%；退回到等權重
    return validCands.map((c) => ({ candidate: c, weight: 1 / n }));
  }
  if (n * MAX_W < 1 - 1e-9) {
    // 公司數過少（n × MAX_W < 100%）：MAX_W 約束本身不可行 — 退回到等權重
    return validCands.map((c) => ({ candidate: c, weight: 1 / n }));
  }

  // 依報酬降序排
  const sorted = [...validCands].sort((a, b) => (b.ret ?? 0) - (a.ret ?? 0));

  // 計算線性遞減的最大斜率 b
  const bFromMax = ((MAX_W - 1 / n) * 2) / (n - 1); // 由 a ≤ MAX_W 推得
  const bFromMin = (2 / n - 2 * MIN_W) / (n - 1);   // 由 a − b(n−1) ≥ MIN_W 推得
  const b = Math.max(0, Math.min(bFromMax, bFromMin));
  const a = 1 / n + (b * (n - 1)) / 2;

  // 原始權重（線性遞減）
  const raw = sorted.map((_, i) => a - b * i);

  // 四捨五入到 0.5% 增量並夾在 [MIN_W, MAX_W]
  const weights = raw.map((w) =>
    Math.max(MIN_W, Math.min(MAX_W, Math.round(w / STEP) * STEP)),
  );

  // 微調總和到 1.00：缺額加在頂端、超額扣在底端（維持排名單調）
  let sum = weights.reduce((s, w) => s + w, 0);
  let safety = n * 200;
  while (Math.abs(sum - 1) > STEP / 2 && safety > 0) {
    if (sum < 1) {
      let added = false;
      for (let i = 0; i < n; i++) {
        if (weights[i] + STEP <= MAX_W + 1e-9) {
          weights[i] += STEP;
          sum += STEP;
          added = true;
          break;
        }
      }
      if (!added) break;
    } else {
      let removed = false;
      for (let i = n - 1; i >= 0; i--) {
        if (weights[i] - STEP >= MIN_W - 1e-9) {
          weights[i] -= STEP;
          sum -= STEP;
          removed = true;
          break;
        }
      }
      if (!removed) break;
    }
    safety--;
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
        const ls = companyLeadershipScore(c.id);
        return {
          company: c,
          ret: r,
          forwardPE: q?.forwardPE ?? null,
          trailingPE: q?.trailingPE ?? null,
          leadership: ls.score, // 多位掌權人自動取平均
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

  // 加權平均領導力（0-100；多位掌權人公司已在 candidate 階段取平均）
  const optLeadership = weightedAvg(optimal, (c) => c.leadership);
  const eqLeadership = weightedAvg(equal, (c) => c.leadership);

  // 組合中低分（< 65）領導力的公司，以「占權重比例」衡量風險
  const optLowLeadershipWeight = optimal.reduce(
    (s, a) => s + (a.candidate.leadership != null && a.candidate.leadership < 65 ? a.weight : 0),
    0,
  );
  const optLowLeadershipCompanies = optimal
    .filter((a) => a.candidate.leadership != null && a.candidate.leadership < 65)
    .sort((a, b) => (a.candidate.leadership ?? 0) - (b.candidate.leadership ?? 0));

  // 統計分布
  const topWeight = optimal.length > 0 ? Math.max(...optimal.map((a) => a.weight)) : 0;
  const bottomWeight = optimal.length > 0 ? Math.min(...optimal.map((a) => a.weight)) : 0;
  const highTierCount = optimal.filter((a) => a.weight >= 0.15).length;
  const midTierCount = optimal.filter((a) => a.weight >= 0.05 && a.weight < 0.15).length;
  const lowTierCount = optimal.filter((a) => a.weight < 0.05).length;

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
        leadership: a.candidate.leadership != null ? a.candidate.leadership.toString() : "",
        contribution: ((a.weight * (a.candidate.ret ?? 0)).toFixed(2)) + "%",
      })),
    );
  }, [optimal]);

  function leadershipTone(v: number | null) {
    if (v == null) return "";
    if (v >= 80) return "text-emerald-700 dark:text-emerald-300";
    if (v >= 65) return "text-sky-700 dark:text-sky-300";
    if (v >= 50) return "text-amber-700 dark:text-amber-300";
    return "text-rose-700 dark:text-rose-300";
  }

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">組合最佳化模擬</h1>
        <p className="muted mt-1 text-sm">
          按過去報酬給予「<strong>排名線性遞減</strong>」的分層權重配置（每家 0.5% - 20% 之間，以 0.5% 為一檔）。
          頂端權重最高、依序遞減 — 不是極端的 20% / 0.5% 二選一。
        </p>
        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>必看的限制：</strong>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>這是<strong>事後後見之明</strong>排名 — 真實投資時你不會預先知道誰排第一</li>
            <li>未計入交易成本、稅、再平衡頻率、流動性</li>
            <li>過去報酬不代表未來；高 PE 公司歷史報酬高 ≠ 未來會繼續</li>
            <li>純 buy-and-hold 模擬；未考慮波動與最大回撤</li>
            <li>主要用法：(1) 看分層配置在過去能達到什麼、(2) 比較等權重 vs 最佳，了解差異化溢價</li>
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
                    <Box
                      label="加權平均領導力"
                      value={optLeadership.avg != null ? optLeadership.avg.toFixed(0) + " / 100" : "—"}
                      tone={leadershipTone(optLeadership.avg)}
                      hint={`覆蓋 ${(optLeadership.coverage * 100).toFixed(0)}%（多位掌權人取平均）`}
                    />
                    <Box
                      label="低分掌權人占比"
                      value={(optLowLeadershipWeight * 100).toFixed(1) + "%"}
                      tone={
                        optLowLeadershipWeight >= 0.3
                          ? "text-rose-700 dark:text-rose-300"
                          : optLowLeadershipWeight >= 0.15
                            ? "text-amber-700 dark:text-amber-300"
                            : "text-emerald-700 dark:text-emerald-300"
                      }
                      hint="權重落在領導力 < 65 公司的比例"
                    />
                  </div>
                  <div className="muted mt-3 text-[10px]">
                    頂 {(topWeight * 100).toFixed(1)}% → 底 {(bottomWeight * 100).toFixed(1)}% ·
                    高權重(≥15%) {highTierCount} 家 · 中(5-15%) {midTierCount} 家 · 低(&lt;5%) {lowTierCount} 家
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
                    <Box
                      label="加權平均領導力"
                      value={eqLeadership.avg != null ? eqLeadership.avg.toFixed(0) + " / 100" : "—"}
                      tone={leadershipTone(eqLeadership.avg)}
                      hint={`覆蓋 ${(eqLeadership.coverage * 100).toFixed(0)}%（多位掌權人取平均）`}
                    />
                    <Box label="—" value="" hint="" />
                  </div>
                  <div className="muted mt-3 text-[10px]">
                    每家 {((1 / valid.length) * 100).toFixed(2)}% · 全部 {valid.length} 家
                  </div>
                </div>
              </section>

              {/* 低分掌權人警示 */}
              {optLowLeadershipCompanies.length > 0 && (
                <section className="card border-rose-300 bg-rose-50/30 p-4 dark:border-rose-700 dark:bg-rose-950/20">
                  <h2 className="text-base font-semibold text-rose-900 dark:text-rose-200">
                    ⚠️ 最佳配置中含領導力 &lt; 65 分的公司（{optLowLeadershipCompanies.length} 家）
                  </h2>
                  <p className="muted mt-1 text-xs">
                    這些公司可能因為過去報酬高被分到較大權重，但領導力分數偏低 — 注意「題材好但掌門人弱」的潛在風險。
                  </p>
                  <ul className="mt-3 space-y-1 text-xs">
                    {optLowLeadershipCompanies.map((a) => (
                      <li
                        key={a.candidate.company.id}
                        className="grid grid-cols-[1fr_auto_auto_auto] items-baseline gap-3 rounded border border-rose-200 bg-white p-2 dark:border-rose-800 dark:bg-slate-900"
                      >
                        <Link to={`/company/${a.candidate.company.id}`} className="font-medium hover:underline">
                          {a.candidate.company.name}
                        </Link>
                        <span className="muted font-mono text-[10px]">{a.candidate.company.ticker}</span>
                        <span className={"font-mono text-sm font-bold " + leadershipTone(a.candidate.leadership)}>
                          領導力 {a.candidate.leadership}
                        </span>
                        <span className="muted font-mono text-[10px]">
                          權重 {(a.weight * 100).toFixed(1)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

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
                  <li>限制：每家 <strong>{(MIN_W * 100).toFixed(1)}% ≤ 權重 ≤ {(MAX_W * 100).toFixed(0)}%</strong>，每 <strong>{(STEP * 100).toFixed(1)}%</strong> 為一檔，總和 = 100%</li>
                  <li>排名線性遞減：按 {period} 個股報酬降序排名，<code>weight_i = a − b × i</code>（i 為 0..n−1）</li>
                  <li>取使「頂端 ≤ {(MAX_W * 100).toFixed(0)}%」與「底端 ≥ {(MIN_W * 100).toFixed(1)}%」皆滿足的<strong>最大 b</strong>（最大差異化），再四捨五入到 {(STEP * 100).toFixed(1)}% 並微調總和到 100%</li>
                  <li>為何不用 LP 最優解？LP 解必在頂點 — 即少數公司 20% + 其他 0.5%，二選一沒有中間檔位。實務分散原則希望<strong>分層配置</strong>，故改採線性遞減</li>
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
