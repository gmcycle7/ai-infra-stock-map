import { Link } from "react-router-dom";
import { CategoryCard } from "../components/CategoryCard";
import { Disclaimer } from "../components/Disclaimer";
import { categories } from "../data/categories";
import { companies } from "../data/companies";
import { getKpi } from "../lib/kpi";
import { getQuote } from "../services/marketData";
import { windowReturn } from "../lib/priceWindow";
import { colorOf } from "../lib/utils";
import { categoryCyclePhase } from "../lib/cyclePhase";

function avgRound(arr: number[]): number {
  if (arr.length === 0) return 0;
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
}

function avgPctRound(arr: number[]): number | null {
  if (arr.length === 0) return null;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function tone(v: number, risk = false) {
  if (risk) {
    if (v >= 65) return "text-rose-600 dark:text-rose-400";
    if (v >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (v >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (v >= 55) return "text-sky-600 dark:text-sky-400";
  if (v >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-slate-500 dark:text-slate-400";
}

export function CategoriesPage() {
  // 計算每個 category 的彙總 KPI + 循環階段
  const summaryRows = categories.map((cat) => {
    const list = companies.filter((c) => c.category.includes(cat.slug));
    const kpis = list.map((c) => getKpi(c));
    const returns: number[] = [];
    for (const c of list) {
      const q = getQuote(c.id);
      if (q?.history) {
        const r = windowReturn(q.history, 252);
        if (r != null) returns.push(r);
      }
    }
    const cycle = categoryCyclePhase(cat.slug);
    return {
      slug: cat.slug,
      nameZh: cat.nameZh,
      color: cat.color,
      n: list.length,
      avgShort: avgRound(kpis.map((k) => k.shortTermScore)),
      avg3y: avgRound(kpis.map((k) => k.threeYearScore)),
      avg5y: avgRound(kpis.map((k) => k.fiveYearScore)),
      avg10y: avgRound(kpis.map((k) => k.tenYearScore)),
      avgRisk: avgRound(kpis.map((k) => k.riskScore)),
      avg1yReturn: avgPctRound(returns),
      cycle,
    };
  });

  // 依 3 年成長排序
  const sortedBy3y = [...summaryRows].sort((a, b) => b.avg3y - a.avg3y);

  return (
    <div className="space-y-6">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">分類總覽</h1>
        <p className="muted mt-1 text-sm">
          AI 基礎建設供應鏈共 {categories.length} 大分類。
          下方包含每個分類的「平均 KPI」與「12M 平均報酬」 — 直接看哪個分類整體最強。
        </p>
      </header>

      <Disclaimer subtle />

      {/* 分類 KPI 摘要表 + 循環階段 */}
      <section className="card p-4">
        <h2 className="section-title text-base">分類整體 KPI + 循環階段（依 3 年成長排序）</h2>
        <p className="muted mt-1 text-xs">
          循環階段是「該分類所有公司」的 12M 報酬 × forward PE × 營收成長加總判斷。
          半導體投資失敗 70% 是循環位置錯，不是選股錯。
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">分類</th>
                <th className="px-3 py-2 text-center">家數</th>
                <th className="px-3 py-2 text-center">循環階段</th>
                <th className="px-3 py-2 text-right">短期</th>
                <th className="px-3 py-2 text-right">3 年</th>
                <th className="px-3 py-2 text-right">5 年</th>
                <th className="px-3 py-2 text-right">10 年</th>
                <th className="px-3 py-2 text-right">風險</th>
                <th className="px-3 py-2 text-right">12M 報酬</th>
                <th className="px-3 py-2 text-right">Fwd P/E</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedBy3y.map((row) => {
                const c = colorOf(row.color);
                return (
                  <tr key={row.slug} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-3 py-1.5">
                      <Link
                        to={`/category/${row.slug}`}
                        className={"font-medium hover:underline " + c.text}
                      >
                        {row.nameZh}
                      </Link>
                    </td>
                    <td className="px-3 py-1.5 text-center">{row.n}</td>
                    <td className="px-3 py-1.5 text-center">
                      <span className={"chip " + row.cycle.tone} title={row.cycle.description}>
                        {row.cycle.phase}
                      </span>
                    </td>
                    <td className={"px-3 py-1.5 text-right font-mono " + tone(row.avgShort)}>{row.avgShort}</td>
                    <td className={"px-3 py-1.5 text-right font-mono font-bold " + tone(row.avg3y)}>{row.avg3y}</td>
                    <td className={"px-3 py-1.5 text-right font-mono " + tone(row.avg5y)}>{row.avg5y}</td>
                    <td className={"px-3 py-1.5 text-right font-mono " + tone(row.avg10y)}>{row.avg10y}</td>
                    <td className={"px-3 py-1.5 text-right font-mono " + tone(row.avgRisk, true)}>{row.avgRisk}</td>
                    <td className="px-3 py-1.5 text-right font-mono">
                      {row.avg1yReturn != null ? (
                        <span
                          className={
                            row.avg1yReturn >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }
                        >
                          {row.avg1yReturn >= 0 ? "+" : ""}
                          {row.avg1yReturn.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono">
                      {row.cycle.avgForwardPE != null ? row.cycle.avgForwardPE.toFixed(1) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="muted mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-900">
          <strong>循環階段對照：</strong>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li><strong className="text-emerald-700 dark:text-emerald-300">底部</strong>：報酬負 + 估值低 — 風險已反映，但需催化</li>
            <li><strong className="text-sky-700 dark:text-sky-300">復甦</strong>：報酬轉正 + 估值合理 — 風險報酬比最好</li>
            <li><strong className="text-amber-700 dark:text-amber-300">成熟</strong>：報酬持續 + 估值偏高 — 仍可參與但須注意</li>
            <li><strong className="text-rose-700 dark:text-rose-300">高峰</strong>：報酬極端 + 估值飽和 — 注意 reversion 風險</li>
          </ul>
        </div>
      </section>

      <h2 className="section-title">分類卡片</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c) => {
          const count = companies.filter((co) => co.category.includes(c.slug)).length;
          return <CategoryCard key={c.slug} category={c} count={count} />;
        })}
      </div>
    </div>
  );
}
