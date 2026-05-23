import { useMemo, useState } from "react";
import { companies } from "../data/companies";
import { CompanyCard } from "../components/CompanyCard";
import { FilterBar } from "../components/FilterBar";
import { applyFilter, defaultFilter, type FilterState } from "../lib/filter";

export function CompaniesPage() {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  // 抽出 top tags
  const allTags = useMemo(() => {
    const m = new Map<string, number>();
    companies.forEach((c) => c.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)));
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24)
      .map(([t]) => t);
  }, []);

  const list = useMemo(() => applyFilter(companies, filter), [filter]);

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">公司列表</h1>
        <p className="muted mt-1 text-sm">
          共 {companies.length} 家公司。可依市場、分類、供應鏈位置、AI 重要性、技術標籤、關鍵字綜合篩選。
        </p>
      </header>

      <FilterBar filter={filter} setFilter={setFilter} allTags={allTags} />

      <div className="muted text-xs">
        篩選結果：{list.length} 家
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <CompanyCard key={c.id} company={c} />
        ))}
        {list.length === 0 && (
          <div className="card col-span-full p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            沒有符合條件的公司，試著放寬篩選。
          </div>
        )}
      </div>
    </div>
  );
}
