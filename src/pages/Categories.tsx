import { Link } from "react-router-dom";
import { CategoryCard } from "../components/CategoryCard";
import { Disclaimer } from "../components/Disclaimer";
import { categories } from "../data/categories";
import { companies } from "../data/companies";
import { getKpi } from "../lib/kpi";
import { getQuote } from "../services/marketData";
import { windowReturn } from "../lib/priceWindow";
import { colorOf } from "../lib/utils";

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
  // 計算每個 category 的彙總 KPI
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

      {/* 分類 KPI 摘要表 */}
      <section className="card p-4">
        <h2 className="section-title text-base">分類整體 KPI（依 3 年成長排序）</h2>
        <p className="muted mt-1 text-xs">
          每分類取所有公司的「KPI 平均值」與「12M 股價平均報酬」。能力範圍內幫你看「產業強弱」而非個股。
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">分類</th>
                <th className="px-3 py-2 text-center">家數</th>
                <th className="px-3 py-2 text-right">短期</th>
                <th className="px-3 py-2 text-right">3 年</th>
                <th className="px-3 py-2 text-right">5 年</th>
                <th className="px-3 py-2 text-right">10 年</th>
                <th className="px-3 py-2 text-right">風險</th>
                <th className="px-3 py-2 text-right">12M 報酬 (avg)</th>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
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
