import { Link } from "react-router-dom";
import { bottlenecks } from "../data/bottlenecks";
import { companies } from "../data/companies";
import { ConfidenceBadge } from "../components/Badge";

export function BottlenecksPage() {
  return (
    <div className="space-y-6">
      <header className="card p-6">
        <h1 className="text-2xl font-bold tracking-tight">瓶頸對照</h1>
        <p className="muted mt-2 text-sm">
          產業每一段供應緊張、產能不夠或技術轉換，背後都有對應的受惠者。
          下方整理 7 個目前最主要的瓶頸與受惠公司清單。
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {bottlenecks.map((b) => (
          <article key={b.id} className="card flex h-full flex-col gap-3 p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">{b.nameZh}</h2>
                <div className="muted text-xs">{b.nameEn}</div>
              </div>
              <ConfidenceBadge level={b.confidenceLevel} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{b.description}</p>

            <div className="muted text-xs font-medium uppercase tracking-wide">受惠公司</div>
            <ul className="space-y-1.5 text-sm">
              {b.beneficiaries.map((bn) => {
                const co = companies.find((c) => c.id === bn.companyId);
                if (!co) return null;
                return (
                  <li key={bn.companyId} className="flex items-baseline gap-2">
                    <Link
                      to={`/company/${co.id}`}
                      className="font-medium text-brand-700 hover:underline dark:text-brand-300"
                    >
                      {co.name}
                    </Link>
                    <span className="font-mono text-[10px] text-slate-400">{co.ticker}</span>
                    <span className="muted">— {bn.reason}</span>
                  </li>
                );
              })}
            </ul>

            {b.sourceUrls.length > 0 && (
              <div className="mt-2 text-xs">
                <span className="muted">來源：</span>
                {b.sourceUrls.map((u, i) => (
                  <a
                    key={u}
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1 text-brand-600 hover:underline dark:text-brand-400"
                  >
                    [{i + 1}]
                  </a>
                ))}
              </div>
            )}
            <div className="muted text-right text-xs">最後更新：{b.lastUpdated}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
