import { Link, useParams } from "react-router-dom";
import { categoryBySlug } from "../data/categories";
import { companies } from "../data/companies";
import { bottlenecks } from "../data/bottlenecks";
import { CompanyCard } from "../components/CompanyCard";
import { ConfidenceBadge, MarketBadge, PositionBadge, ScoreBadge } from "../components/Badge";
import { colorOf } from "../lib/utils";

export function CategoryDetailPage() {
  const { slug } = useParams();
  const cat = slug ? categoryBySlug[slug] : undefined;

  if (!cat) {
    return (
      <div className="card p-6 text-center">
        找不到分類。<Link className="text-brand-600 underline" to="/categories">回到分類總覽</Link>
      </div>
    );
  }

  const list = companies.filter((c) => c.category.includes(cat.slug));
  const c = colorOf(cat.color);
  const relatedBottlenecks = bottlenecks.filter((b) =>
    b.beneficiaries.some((bn) => list.find((co) => co.id === bn.companyId)),
  );

  return (
    <div className="space-y-6">
      <header className={"card p-6 " + c.bg + " " + c.border}>
        <div className="flex flex-wrap items-baseline gap-2">
          <h1 className={"text-2xl font-bold tracking-tight " + c.text}>{cat.nameZh}</h1>
          <span className="muted text-sm">{cat.nameEn}</span>
        </div>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{cat.shortDesc}</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{cat.whyAiMatters}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cat.technicalKeywords.map((k) => (
            <span
              key={k}
              className="chip border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {k}
            </span>
          ))}
        </div>
        {cat.serdesNote && (
          <div className="mt-4 rounded-lg border border-indigo-300 bg-indigo-50 p-3 text-sm text-indigo-900 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200">
            <strong>給 SerDes 工程師：</strong>
            {cat.serdesNote}
          </div>
        )}
      </header>

      {/* Companies in this category */}
      <section className="space-y-3">
        <h2 className="section-title">代表公司（{list.length}）</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {list.map((co) => (
            <CompanyCard key={co.id} company={co} />
          ))}
        </div>
      </section>

      {/* Compare table */}
      <section className="space-y-3">
        <h2 className="section-title">公司比較表</h2>
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">公司</th>
                <th className="px-3 py-2">代號</th>
                <th className="px-3 py-2">市場</th>
                <th className="px-3 py-2">供應鏈</th>
                <th className="px-3 py-2">AI 重要性</th>
                <th className="px-3 py-2">最大優勢</th>
                <th className="px-3 py-2">主要風險（首條）</th>
                <th className="px-3 py-2">信心</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((co) => (
                <tr key={co.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-3 py-2 font-medium">
                    <Link className="hover:underline" to={`/company/${co.id}`}>
                      {co.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{co.ticker}</td>
                  <td className="px-3 py-2"><MarketBadge market={co.market} /></td>
                  <td className="px-3 py-2"><PositionBadge pos={co.supplyChainPosition} /></td>
                  <td className="px-3 py-2"><ScoreBadge score={co.aiImportanceScore} /></td>
                  <td className="px-3 py-2 max-w-xs text-slate-600 dark:text-slate-300">
                    {co.competitiveAdvantage}
                  </td>
                  <td className="px-3 py-2 max-w-xs text-slate-600 dark:text-slate-300">
                    {co.risks[0]}
                  </td>
                  <td className="px-3 py-2"><ConfidenceBadge level={co.confidenceLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottlenecks beneficiaries */}
      {relatedBottlenecks.length > 0 && (
        <section className="space-y-3">
          <h2 className="section-title">相關瓶頸與受惠者</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {relatedBottlenecks.map((b) => (
              <div key={b.id} className="card p-4">
                <div className="font-semibold">{b.nameZh}</div>
                <div className="muted text-xs">{b.nameEn}</div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{b.description}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {b.beneficiaries
                    .filter((bn) => list.find((co) => co.id === bn.companyId))
                    .map((bn) => {
                      const co = companies.find((co) => co.id === bn.companyId);
                      if (!co) return null;
                      return (
                        <li key={bn.companyId}>
                          <Link className="font-medium hover:underline" to={`/company/${co.id}`}>
                            {co.name}
                          </Link>
                          <span className="muted">：{bn.reason}</span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
