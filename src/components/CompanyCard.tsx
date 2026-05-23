import { Link } from "react-router-dom";
import type { Company } from "../types";
import { categoryBySlug } from "../data/categories";
import { CategoryBadge, ConfidenceBadge, MarketBadge, PositionBadge, ScoreBadge, Tag } from "./Badge";

export function CompanyCard({ company }: { company: Company }) {
  const primaryCat = company.category[0] ? categoryBySlug[company.category[0]] : undefined;

  return (
    <Link
      to={`/company/${company.id}`}
      className="group card flex h-full flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold tracking-tight">{company.name}</div>
          <div className="muted truncate text-xs">{company.nameEn}</div>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {company.ticker}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <MarketBadge market={company.market} />
        <PositionBadge pos={company.supplyChainPosition} />
        <ScoreBadge score={company.aiImportanceScore} />
        <ConfidenceBadge level={company.confidenceLevel} />
      </div>

      <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
        {company.whatTheyDo}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {company.category.slice(0, 3).map((c) => {
          const cat = categoryBySlug[c];
          return cat ? <CategoryBadge key={c} label={cat.nameZh} color={cat.color} /> : null;
        })}
        {primaryCat?.nameEn && (
          <span className="muted text-[10px] leading-relaxed">{primaryCat.nameEn}</span>
        )}
      </div>

      {company.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {company.tags.slice(0, 5).map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      )}
    </Link>
  );
}
