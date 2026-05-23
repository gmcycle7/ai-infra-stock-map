import { Link } from "react-router-dom";
import {
  allKpis,
  answerQuestion,
  dashboardQuestions,
  type DashboardQuestion,
} from "../lib/kpi";
import { InvestmentTypeBadge } from "../components/InvestmentTypeBadge";
import { investmentTypeDescriptions } from "../lib/investmentType";
import type { InvestmentType } from "../types";
import { MarketBadge } from "../components/Badge";
import { Sparkline } from "../components/Sparkline";
import { getQuote } from "../services/marketData";
import { useWatchlist } from "../context/watchlistContextValue";
import { WatchlistStar } from "../components/WatchlistStar";

const QUESTION_ORDER: DashboardQuestion[] = [
  "shortTermCatalyst",
  "threeYearGrowth",
  "fiveYearMoat",
  "tenYearStructural",
  "highestRisk",
  "nvidiaExposure",
  "networkUpgrade",
  "hbmCowos",
  "powerCooling",
  "cpoExposure",
];

const SCORE_KEY: Record<DashboardQuestion, string> = {
  shortTermCatalyst: "shortTermScore",
  threeYearGrowth: "threeYearScore",
  fiveYearMoat: "fiveYearScore",
  tenYearStructural: "tenYearScore",
  highestRisk: "riskScore",
  nvidiaExposure: "shortTermScore",
  networkUpgrade: "threeYearScore",
  hbmCowos: "threeYearScore",
  powerCooling: "threeYearScore",
  cpoExposure: "tenYearScore",
};

const SCORE_LABEL: Record<DashboardQuestion, string> = {
  shortTermCatalyst: "短期",
  threeYearGrowth: "三年",
  fiveYearMoat: "五年",
  tenYearStructural: "十年",
  highestRisk: "風險",
  nvidiaExposure: "短期",
  networkUpgrade: "三年",
  hbmCowos: "三年",
  powerCooling: "三年",
  cpoExposure: "十年",
};

function tone(v: number, risk = false) {
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

function RankingCard({ q }: { q: DashboardQuestion }) {
  const { has } = useWatchlist();
  const list = answerQuestion(q, 8);
  const scoreKey = SCORE_KEY[q] as
    | "shortTermScore"
    | "threeYearScore"
    | "fiveYearScore"
    | "tenYearScore"
    | "riskScore";
  const isRisk = q === "highestRisk";

  return (
    <article className="card flex h-full flex-col gap-3 p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold">{dashboardQuestions[q].zh}</h3>
        <span className="muted text-xs font-mono">{dashboardQuestions[q].en}</span>
      </header>
      <ol className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
        {list.map((item, i) => {
          const quote = getQuote(item.company.id);
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
          const watched = has(item.company.id);
          return (
            <li
              key={item.company.id}
              className={
                "grid grid-cols-[1.75rem_1fr_60px_auto_2.5rem_1.25rem] items-center gap-2 py-1.5 " +
                (watched ? "rounded bg-amber-50/50 dark:bg-amber-950/30" : "")
              }
            >
              <span
                className={
                  "text-center text-xs tabular-nums " +
                  (medal ? "text-base" : "text-slate-400")
                }
              >
                {medal ?? `${i + 1}.`}
              </span>
              <Link
                to={`/company/${item.company.id}`}
                className={"truncate text-sm hover:underline " + (watched ? "font-bold" : "font-medium")}
              >
                {item.company.name}
              </Link>
              <div>
                {quote?.history && quote.history.length > 0 ? (
                  <Sparkline data={quote.history} width={60} height={20} windowSize={90} />
                ) : (
                  <span className="text-[10px] text-slate-400">—</span>
                )}
              </div>
              <MarketBadge market={item.company.market} />
              <span
                className={
                  "text-right font-mono text-sm font-semibold tabular-nums " +
                  tone(item.kpi[scoreKey], isRisk)
                }
              >
                {item.kpi[scoreKey]}
              </span>
              <WatchlistStar id={item.company.id} size="sm" />
            </li>
          );
        })}
      </ol>
      <div className="muted text-[10px]">
        排序依：{SCORE_LABEL[q]} 分數 + 對應產業 / 標籤過濾條件
        <span className="ml-1">· 黃底 = 你關注中</span>
      </div>
    </article>
  );
}

export function KpiDashboardPage() {
  // 統計每個投資型態的數量
  const typeCounts = new Map<InvestmentType, number>();
  for (const { kpi } of allKpis()) {
    typeCounts.set(kpi.investmentType, (typeCounts.get(kpi.investmentType) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">投資 KPI 儀表板</h1>
        <p className="muted mt-2 text-sm">
          以 4 個時間維度 + 風險獨立分數，加上 9 大產業關鍵問題，快速比較 60 家公司。
          所有分數皆從產業邏輯與既有 moat / risk / AI 重要性欄位「公式化推導」，
          <Link to="/kpi-method" className="ml-1 text-brand-600 hover:underline dark:text-brand-400">
            點此看公式
          </Link>
          。
        </p>
        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>免責：</strong>本網站僅供教育與技術研究使用。
          KPI 為產業邏輯評分，不構成買賣建議，亦不保證任何股票將上漲或下跌。
          財務細項（營收成長率、EPS、毛利率、目標價）皆「需要資料驗證」，請以最新財報為準。
        </div>
      </header>

      {/* 5 種投資型態統計 */}
      <section className="card p-4">
        <h2 className="section-title text-base">投資型態分布</h2>
        <div className="muted mt-1 text-xs">每家公司會被歸類到 1 種型態，方便理解投資定位。</div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          {(["核心平台型", "關鍵瓶頸型", "週期成長型", "技術升級受惠型", "題材波動型"] as InvestmentType[]).map(
            (t) => (
              <div key={t} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex items-baseline justify-between gap-2">
                  <InvestmentTypeBadge type={t} />
                  <span className="muted text-xs">{typeCounts.get(t) ?? 0} 家</span>
                </div>
                <p className="muted mt-2 text-xs">{investmentTypeDescriptions[t]}</p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* 9 大問題排行 */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {QUESTION_ORDER.map((q) => (
          <RankingCard key={q} q={q} />
        ))}
      </section>
    </div>
  );
}
