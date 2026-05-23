import { Link } from "react-router-dom";
import type { Company } from "../types";
import { companies } from "../data/companies";
import { categoryBySlug } from "../data/categories";

interface Props {
  company: Company;
}

/**
 * 同類股快速比較按鈕：找出與當前公司至少分享一個分類的其他公司，
 * 提供「並排比較」連結。
 */
export function PeerCompare({ company }: Props) {
  const peers = companies
    .filter(
      (c) =>
        c.id !== company.id &&
        c.category.some((cc) => company.category.includes(cc)),
    )
    .sort((a, b) => b.aiImportanceScore - a.aiImportanceScore)
    .slice(0, 8);

  if (peers.length === 0) return null;

  return (
    <section className="card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title text-base">與同類公司並排比較</h2>
        <span className="muted text-xs">
          挑一家點下去 →
          <Link
            to={`/compare?a=${company.id}`}
            className="ml-1 text-brand-600 hover:underline dark:text-brand-400"
          >
            開啟完整比較頁
          </Link>
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {peers.map((p) => {
          const sharedCat = p.category.find((cc) => company.category.includes(cc));
          const cat = sharedCat ? categoryBySlug[sharedCat] : undefined;
          return (
            <Link
              key={p.id}
              to={`/compare?a=${company.id}&b=${p.id}`}
              className="group inline-flex items-baseline gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs transition hover:border-brand-400 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-500 dark:hover:bg-brand-950"
            >
              <span className="font-medium">{p.name}</span>
              {cat && <span className="muted text-[10px]">· {cat.nameZh}</span>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
