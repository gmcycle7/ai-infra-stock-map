import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useWatchlist } from "../context/watchlistContextValue";
import { companies } from "../data/companies";
import { categoryBySlug } from "../data/categories";
import { CompanyCard } from "../components/CompanyCard";
import { WatchlistStar } from "../components/WatchlistStar";
import { getKpi } from "../lib/kpi";
import { getQuote, formatRatio } from "../services/marketData";
import { windowReturn } from "../lib/priceWindow";
import {
  keyPeopleById,
  leaderCompositeScore,
} from "../data/keyPeople";
import { LEADERSHIP_LABELS } from "../types";
import type { Company, LeadershipScores } from "../types";

function calcPortfolioStats(picks: Company[]) {
  if (picks.length === 0) return null;
  let totalAi = 0;
  let totalRisk = 0;
  let totalBeta = 0;
  let betaN = 0;
  let totalFwdPE = 0;
  let fwdPEN = 0;
  let totalNvidiaDep = 0;
  const marketCounts: Record<string, number> = { US: 0, Taiwan: 0, Private: 0 };
  const typeCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const sectorBreakdown: Record<string, { count: number; share: number }> = {};
  let totalReturn12m = 0;
  let return12mN = 0;
  let highRiskCount = 0;

  for (const c of picks) {
    const kpi = getKpi(c);
    const q = getQuote(c.id);
    totalAi += c.aiImportanceScore;
    totalRisk += kpi.riskScore;
    totalNvidiaDep += c.risk.nvidiaDependency;
    if (kpi.riskScore >= 70) highRiskCount++;
    if (q?.beta != null) {
      totalBeta += q.beta;
      betaN++;
    }
    if (q?.forwardPE != null && q.forwardPE > 0 && q.forwardPE < 500) {
      totalFwdPE += q.forwardPE;
      fwdPEN++;
    }
    if (q?.history) {
      const r = windowReturn(q.history, 252);
      if (r != null) {
        totalReturn12m += r;
        return12mN++;
      }
    }
    marketCounts[c.market] = (marketCounts[c.market] ?? 0) + 1;
    typeCounts[kpi.investmentType] = (typeCounts[kpi.investmentType] ?? 0) + 1;
    for (const cat of c.category) {
      categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
    }
  }

  for (const [k, v] of Object.entries(categoryCounts)) {
    sectorBreakdown[k] = { count: v, share: v / picks.length };
  }

  return {
    n: picks.length,
    avgAi: totalAi / picks.length,
    avgRisk: totalRisk / picks.length,
    avgBeta: betaN > 0 ? totalBeta / betaN : null,
    avgFwdPE: fwdPEN > 0 ? totalFwdPE / fwdPEN : null,
    avgNvidiaDep: totalNvidiaDep / picks.length,
    avgReturn12m: return12mN > 0 ? totalReturn12m / return12mN : null,
    marketCounts,
    typeCounts,
    sectorBreakdown,
    highRiskCount,
  };
}

function StatBox({
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
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="muted text-xs">{label}</div>
      <div className={"mt-1 text-xl font-bold tabular-nums " + (tone ?? "")}>{value}</div>
      {hint && <div className="muted mt-0.5 text-[10px]">{hint}</div>}
    </div>
  );
}

function ConcentrationBar({
  label,
  share,
  warn,
}: {
  label: string;
  share: number;
  warn?: boolean;
}) {
  const pct = share * 100;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 shrink-0 text-slate-600 dark:text-slate-300">{label}</span>
      <span className="relative h-2 flex-1 overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
        <span
          className={
            "absolute inset-y-0 left-0 " +
            (warn ? "bg-rose-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500")
          }
          style={{ width: pct + "%" }}
        />
      </span>
      <span className="w-12 text-right font-mono tabular-nums">{pct.toFixed(0)}%</span>
    </div>
  );
}

export function WatchlistPage() {
  const { ids, clear } = useWatchlist();
  const list = useMemo(
    () =>
      ids
        .map((id) => companies.find((c) => c.id === id))
        .filter((c): c is Company => !!c),
    [ids],
  );
  const stats = useMemo(() => calcPortfolioStats(list), [list]);

  // 最弱環節：3 個維度
  const weakestRiskCompany = useMemo(
    () =>
      [...list]
        .map((c) => ({ c, kpi: getKpi(c) }))
        .sort((a, b) => b.kpi.riskScore - a.kpi.riskScore)[0],
    [list],
  );
  const lowestConfidenceCompany = useMemo(
    () =>
      [...list]
        .filter((c) => c.confidenceLevel === "Low")
        .sort((a, b) => b.aiImportanceScore - a.aiImportanceScore)[0],
    [list],
  );

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">我的關注組合</h1>
            <p className="muted mt-1 text-sm">
              你關注的公司集合分析。把這頁當「投資組合 diversification check」用 —
              避免「以為自己分散，其實全押 Nvidia 鏈」這種陷阱。
              資料儲存在你的瀏覽器（localStorage），不會上傳。
            </p>
          </div>
          {list.length > 0 && (
            <div className="flex gap-2">
              <Link to={`/backtest?ids=${ids.join(",")}`} className="btn btn-primary">
                📈 回測這個組合
              </Link>
              <Link to={`/compare?a=${ids[0]}${ids[1] ? "&b=" + ids[1] : ""}${ids[2] ? "&c=" + ids[2] : ""}${ids[3] ? "&d=" + ids[3] : ""}`} className="btn">
                並排比較
              </Link>
              <button type="button" className="btn" onClick={clear}>
                清空
              </button>
            </div>
          )}
        </div>
      </header>

      {list.length === 0 || !stats ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            還沒有任何關注公司。
            <Link to="/companies" className="ml-1 text-brand-600 hover:underline dark:text-brand-400">
              到公司列表
            </Link>{" "}
            開始挑選（點卡片右上角 ☆）。
          </p>
        </div>
      ) : (
        <>
          {/* 組合摘要 */}
          <section className="space-y-3">
            <h2 className="section-title text-base">組合摘要（{stats.n} 家公司）</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              <StatBox
                label="平均 AI 重要性"
                value={stats.avgAi.toFixed(1) + "/5"}
              />
              <StatBox
                label="平均風險分數"
                value={stats.avgRisk.toFixed(0)}
                tone={
                  stats.avgRisk >= 65
                    ? "text-rose-600 dark:text-rose-400"
                    : stats.avgRisk >= 50
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                }
                hint={stats.avgRisk >= 65 ? "偏高 — 注意分散" : "可接受範圍"}
              />
              <StatBox
                label="平均 Beta (vs 市場)"
                value={stats.avgBeta != null ? formatRatio(stats.avgBeta, 2) : "—"}
                tone={
                  stats.avgBeta == null
                    ? ""
                    : stats.avgBeta >= 1.5
                      ? "text-rose-600 dark:text-rose-400"
                      : stats.avgBeta >= 1
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                }
                hint="> 1.5 表示組合波動 > 大盤"
              />
              <StatBox
                label="平均 Forward P/E"
                value={stats.avgFwdPE != null ? stats.avgFwdPE.toFixed(1) : "—"}
                tone={
                  stats.avgFwdPE == null
                    ? ""
                    : stats.avgFwdPE >= 50
                      ? "text-rose-600 dark:text-rose-400"
                      : stats.avgFwdPE >= 30
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                }
                hint="估值高 = 預期飽和"
              />
              <StatBox
                label="平均 Nvidia 依賴度"
                value={(stats.avgNvidiaDep / 5 * 100).toFixed(0) + "%"}
                tone={
                  stats.avgNvidiaDep >= 3
                    ? "text-rose-600 dark:text-rose-400"
                    : stats.avgNvidiaDep >= 2
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                }
                hint={stats.avgNvidiaDep >= 3 ? "過度集中" : "尚可"}
              />
              <StatBox
                label="平均 12M 報酬"
                value={
                  stats.avgReturn12m != null
                    ? (stats.avgReturn12m >= 0 ? "+" : "") + stats.avgReturn12m.toFixed(1) + "%"
                    : "—"
                }
                tone={
                  stats.avgReturn12m == null
                    ? ""
                    : stats.avgReturn12m >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                }
              />
            </div>
          </section>

          {/* 分散度 */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="card p-4">
              <h3 className="text-sm font-semibold">市場分散度</h3>
              <p className="muted mt-1 text-[10px]">過度集中單一市場 = 匯率 + 地緣政治曝險過大</p>
              <div className="mt-3 space-y-1.5">
                {(["US", "Taiwan", "Private"] as const).map((m) => {
                  const cnt = stats.marketCounts[m] ?? 0;
                  if (cnt === 0) return null;
                  const label = m === "US" ? "美股" : m === "Taiwan" ? "台股" : "未上市 / 海外";
                  return (
                    <ConcentrationBar
                      key={m}
                      label={label}
                      share={cnt / stats.n}
                      warn={cnt / stats.n > 0.8}
                    />
                  );
                })}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="text-sm font-semibold">投資型態分布</h3>
              <p className="muted mt-1 text-[10px]">
                題材波動型 &gt; 50% = 投機色彩重；核心平台型 &gt; 50% = 偏保守
              </p>
              <div className="mt-3 space-y-1.5">
                {Object.entries(stats.typeCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([t, n]) => (
                    <ConcentrationBar
                      key={t}
                      label={t}
                      share={n / stats.n}
                      warn={t === "題材波動型" && n / stats.n > 0.4}
                    />
                  ))}
              </div>
            </div>
          </section>

          {/* 產業分散度 */}
          <section className="card p-4">
            <h3 className="text-sm font-semibold">產業分散度（公司可跨類，比例可能 &gt; 100%）</h3>
            <p className="muted mt-1 text-[10px]">單一產業 &gt; 50% = 該產業循環下行時整個組合會大跌</p>
            <div className="mt-3 grid grid-cols-1 gap-1.5 md:grid-cols-2">
              {Object.entries(stats.sectorBreakdown)
                .sort((a, b) => b[1].share - a[1].share)
                .map(([slug, info]) => {
                  const cat = categoryBySlug[slug];
                  return (
                    <ConcentrationBar
                      key={slug}
                      label={cat?.nameZh ?? slug}
                      share={info.share}
                      warn={info.share > 0.5}
                    />
                  );
                })}
            </div>
          </section>

          {/* 警示 */}
          {(stats.highRiskCount > 0 ||
            stats.avgRisk >= 65 ||
            stats.avgNvidiaDep >= 3 ||
            (stats.avgFwdPE != null && stats.avgFwdPE >= 50) ||
            weakestRiskCompany?.kpi.riskScore >= 75 ||
            lowestConfidenceCompany) && (
            <section className="card border-amber-300 bg-amber-50/50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                ⚠️ 組合健檢警示
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-900 dark:text-amber-200">
                {stats.avgNvidiaDep >= 3 && (
                  <li>
                    <strong>Nvidia 依賴度高</strong>：平均 {(stats.avgNvidiaDep / 5 * 100).toFixed(0)}%
                    — 若 Nvidia 出貨放緩，整個組合都會被拖累
                  </li>
                )}
                {stats.avgRisk >= 65 && (
                  <li>
                    <strong>平均風險偏高</strong>：{stats.avgRisk.toFixed(0)} / 100 — 適合風險容忍度高的人
                  </li>
                )}
                {stats.avgFwdPE != null && stats.avgFwdPE >= 50 && (
                  <li>
                    <strong>估值已偏高</strong>：平均 Forward P/E {stats.avgFwdPE.toFixed(1)}x — 預期已飽和，下修空間大
                  </li>
                )}
                {stats.highRiskCount > 0 && (
                  <li>
                    有 <strong>{stats.highRiskCount} 家</strong>風險分數 &gt; 70
                  </li>
                )}
                {weakestRiskCompany && weakestRiskCompany.kpi.riskScore >= 75 && (
                  <li>
                    <strong>最弱環節（風險）</strong>：
                    <Link
                      to={`/company/${weakestRiskCompany.c.id}`}
                      className="ml-1 font-bold underline"
                    >
                      {weakestRiskCompany.c.name}
                    </Link>
                    （風險分數 {weakestRiskCompany.kpi.riskScore}）
                  </li>
                )}
                {lowestConfidenceCompany && (
                  <li>
                    <strong>最弱環節（資料）</strong>：
                    <Link
                      to={`/company/${lowestConfidenceCompany.id}`}
                      className="ml-1 font-bold underline"
                    >
                      {lowestConfidenceCompany.name}
                    </Link>
                    （信心 Low — 評分主要依推測）
                  </li>
                )}
                {Object.values(stats.sectorBreakdown).some((info) => info.share > 0.5) && (
                  <li>
                    <strong>產業過度集中</strong>：有產業占 &gt; 50%，建議考慮其他類別
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* 領導力篩選 */}
          <LeadershipFilter list={list} />

          {/* 公司卡片列表 */}
          <section>
            <h2 className="section-title text-base">關注公司列表</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* 補充說明 — 即使空組合也顯示 */}
      <p className="muted text-[10px]">
        小提醒：這個分析以「等權重」為前提（每家公司影響力相同）。實際組合若有不同權重，
        想做更精確模擬請到「📈 回測這個組合」頁面。
      </p>
    </div>
  );
}

// =====================================================================
// 領導力篩選：過濾出組合中掌權人分數過低的公司
// =====================================================================
interface LeaderRow {
  company: Company;
  leaderName: string;
  compositeScore: number | null;        // null = 無打分
  weakestDim: keyof LeadershipScores | null;
  weakestValue: number | null;
}

function buildLeaderRows(list: Company[]): LeaderRow[] {
  const rows: LeaderRow[] = [];
  for (const c of list) {
    const leaders = keyPeopleById[c.id] ?? [];
    const scored = leaders.filter((p) => p.leadership);
    if (scored.length === 0) {
      rows.push({
        company: c,
        leaderName: leaders[0]
          ? leaders[0].nameZh
            ? `${leaders[0].nameZh}（${leaders[0].name}）`
            : leaders[0].name
          : "（無資料）",
        compositeScore: null,
        weakestDim: null,
        weakestValue: null,
      });
      continue;
    }

    // 取分數最低的領導者（最弱環節）
    const sorted = [...scored].sort(
      (a, b) => leaderCompositeScore(a.leadership!) - leaderCompositeScore(b.leadership!),
    );
    const worst = sorted[0];
    const composite = leaderCompositeScore(worst.leadership!);

    // 找該領導者分數最低的維度（指出弱點）
    let weakestDim: keyof LeadershipScores | null = null;
    let weakestValue = 6;
    for (const key of Object.keys(worst.leadership!) as Array<keyof LeadershipScores>) {
      const v = worst.leadership![key];
      if (v < weakestValue) {
        weakestValue = v;
        weakestDim = key;
      }
    }

    rows.push({
      company: c,
      leaderName: worst.nameZh ? `${worst.nameZh}（${worst.name}）` : worst.name,
      compositeScore: composite,
      weakestDim,
      weakestValue,
    });
  }
  return rows;
}

function LeadershipFilter({ list }: { list: Company[] }) {
  const [threshold, setThreshold] = useState(65);
  const [includeUnscored, setIncludeUnscored] = useState(false);

  const rows = useMemo(() => buildLeaderRows(list), [list]);
  const scoredRows = rows.filter((r) => r.compositeScore != null);
  const unscoredRows = rows.filter((r) => r.compositeScore == null);

  const belowThreshold = scoredRows.filter(
    (r) => r.compositeScore != null && r.compositeScore < threshold,
  );
  const flagged = includeUnscored
    ? [...belowThreshold, ...unscoredRows]
    : belowThreshold;

  // 排序：分數低 → 高，無分數放最後
  flagged.sort((a, b) => {
    if (a.compositeScore == null) return 1;
    if (b.compositeScore == null) return -1;
    return a.compositeScore - b.compositeScore;
  });

  // 計算分布
  const distribution = {
    excellent: scoredRows.filter((r) => (r.compositeScore ?? 0) >= 80).length,
    good: scoredRows.filter((r) => (r.compositeScore ?? 0) >= 65 && (r.compositeScore ?? 0) < 80).length,
    fair: scoredRows.filter((r) => (r.compositeScore ?? 0) >= 50 && (r.compositeScore ?? 0) < 65).length,
    weak: scoredRows.filter((r) => (r.compositeScore ?? 0) < 50).length,
    unscored: unscoredRows.length,
  };

  return (
    <section className="card space-y-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title text-base">領導力篩選</h2>
        <span className="muted text-xs">
          找出組合中掌權人分數過低的公司
        </span>
      </div>

      {/* 分布概覽 */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <DistBox label="優秀 ≥80" count={distribution.excellent} tone="bg-emerald-500 text-white" />
        <DistBox label="穩健 65-79" count={distribution.good} tone="bg-sky-500 text-white" />
        <DistBox label="中等 50-64" count={distribution.fair} tone="bg-amber-500 text-white" />
        <DistBox label="偏弱 <50" count={distribution.weak} tone="bg-rose-500 text-white" />
        <DistBox label="無資料" count={distribution.unscored} tone="bg-slate-400 text-white" />
      </div>

      {/* 控制列 */}
      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex flex-1 items-center gap-3 min-w-[14rem]">
            <span className="muted text-xs whitespace-nowrap">
              閾值：低於 <strong className="text-base font-bold text-brand-700 dark:text-brand-300 tabular-nums">{threshold}</strong> 分視為「過低」
            </span>
            <input
              type="range"
              min={30}
              max={90}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="flex-1 accent-brand-600"
            />
          </label>
          <label className="flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={includeUnscored}
              onChange={(e) => setIncludeUnscored(e.target.checked)}
            />
            <span>同時列出「無打分資料」者</span>
          </label>
        </div>
      </div>

      {/* 篩選結果 */}
      {flagged.length === 0 ? (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50/40 p-4 text-sm dark:border-emerald-700 dark:bg-emerald-950/30">
          <strong className="text-emerald-800 dark:text-emerald-200">
            ✓ 組合中沒有公司的領導力低於 {threshold} 分
          </strong>
          <p className="muted mt-1 text-xs">
            這代表你關注的公司大多數有相對穩健的掌權人。
            若想看更嚴格的標準，把閾值拉高試試。
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm">
            <strong>{flagged.length}</strong> 家公司觸發警示
            {flagged.length === scoredRows.length + (includeUnscored ? unscoredRows.length : 0) && (
              <span className="muted ml-2">（閾值已包含全部組合）</span>
            )}
          </div>
          <ul className="space-y-1.5 text-sm">
            {flagged.map((row) => (
              <li
                key={row.company.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-baseline gap-3 rounded-md border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <Link
                    to={`/company/${row.company.id}`}
                    className="font-medium hover:underline"
                  >
                    {row.company.name}
                  </Link>
                  <span className="muted ml-2 font-mono text-[10px]">
                    {row.company.ticker}
                  </span>
                  <div className="muted text-[11px]">
                    掌權人：{row.leaderName}
                    {row.weakestDim && row.weakestValue != null && (
                      <span className="ml-2 text-rose-600 dark:text-rose-400">
                        · 最弱：{LEADERSHIP_LABELS[row.weakestDim]} {row.weakestValue}/5
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={
                    "font-mono text-lg font-bold tabular-nums " +
                    (row.compositeScore == null
                      ? "text-slate-400"
                      : row.compositeScore >= 65
                        ? "text-sky-600 dark:text-sky-400"
                        : row.compositeScore >= 50
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400")
                  }
                >
                  {row.compositeScore ?? "—"}
                </span>
                <Link
                  to={`/company/${row.company.id}#leadership`}
                  className="text-[11px] text-brand-600 hover:underline dark:text-brand-400"
                  title="到該公司詳細頁的領導力區塊"
                >
                  詳細 →
                </Link>
                <WatchlistStar id={row.company.id} size="sm" />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="muted rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-[11px] dark:border-amber-900 dark:bg-amber-950/30">
        <strong>怎麼讀：</strong>
        若公司有多位掌權人（例如鴻海有 Terry Gou + Young Liu），取「<strong>分數最低</strong>」者作為篩選基準（最弱環節）。
        <strong className="ml-1">無打分資料</strong>不一定代表領導者不好，多為任期短或公開資訊有限 — 是否包含可自由切換。
        <strong className="ml-1">最弱維度</strong>標示出該領導者在 10 維度中得分最低的一項，幫你定位該注意什麼。
        詳細評分判準見 <Link to="/leadership-rubric" className="text-brand-600 hover:underline dark:text-brand-400">領導力評分判準</Link>。
      </div>
    </section>
  );
}

function DistBox({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-2 text-center dark:border-slate-700">
      <div className="muted text-[10px]">{label}</div>
      <div
        className={
          "mx-auto mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold tabular-nums " +
          tone
        }
      >
        {count}
      </div>
    </div>
  );
}
