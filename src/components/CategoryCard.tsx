import { Link } from "react-router-dom";
import type { Category } from "../types";
import { colorOf } from "../lib/utils";

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  const c = colorOf(category.color);
  return (
    <Link
      to={`/category/${category.slug}`}
      className={
        "card group flex h-full flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md " +
        c.border
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className={"text-base font-semibold " + c.text}>{category.nameZh}</div>
          <div className="muted text-xs">{category.nameEn}</div>
        </div>
        <span className={"chip " + c.border + " " + c.bg + " " + c.text}>
          {count} 家
        </span>
      </div>
      <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
        {category.shortDesc}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {category.technicalKeywords.slice(0, 5).map((k) => (
          <span
            key={k}
            className="chip border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {k}
          </span>
        ))}
      </div>
    </Link>
  );
}
