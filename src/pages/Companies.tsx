import { useMemo, useState } from "react";
import { companies } from "../data/companies";
import { CompanyCard } from "../components/CompanyCard";
import { FilterBar } from "../components/FilterBar";
import { CsvButton } from "../components/CsvButton";
import { applyFilter, defaultFilter, type FilterState } from "../lib/filter";
import { toCsv, todayIso } from "../lib/csv";
import { getKpi } from "../lib/kpi";
import { getQuote } from "../services/marketData";
import { categoryBySlug } from "../data/categories";

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

  const csv = useMemo(() => {
    const rows = list.map((c) => {
      const kpi = getKpi(c);
      const q = getQuote(c.id);
      const cats = c.category.map((s) => categoryBySlug[s]?.nameZh ?? s).join(" / ");
      return {
        name: c.name,
        nameEn: c.nameEn,
        ticker: c.ticker,
        market: c.market,
        categories: cats,
        position: c.supplyChainPosition,
        aiImportance: c.aiImportanceScore,
        investmentType: kpi.investmentType,
        confidenceLevel: c.confidenceLevel,
        shortTermScore: kpi.shortTermScore,
        threeYearScore: kpi.threeYearScore,
        fiveYearScore: kpi.fiveYearScore,
        tenYearScore: kpi.tenYearScore,
        riskScore: kpi.riskScore,
        leadershipScore: kpi.leadershipScore ?? "",
        price: q?.price ?? "",
        currency: q?.currency ?? "",
        marketCap: q?.marketCap ?? "",
        trailingPE: q?.trailingPE ?? "",
        forwardPE: q?.forwardPE ?? "",
        grossMargin: q?.grossMargin != null ? (q.grossMargin * 100).toFixed(2) + "%" : "",
        revenueGrowthYoY: q?.revenueGrowthYoY != null ? (q.revenueGrowthYoY * 100).toFixed(2) + "%" : "",
        targetMean: q?.targetMean ?? "",
        recommendation: q?.recommendationKey ?? "",
        tags: c.tags.join(" / "),
      };
    });
    return toCsv(rows);
  }, [list]);

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">公司列表</h1>
            <p className="muted mt-1 text-sm">
              共 {companies.length} 家公司。可依市場、分類、供應鏈位置、AI 重要性、技術標籤、關鍵字綜合篩選。
            </p>
          </div>
          <CsvButton
            filename={`ai-infra-companies-${todayIso()}.csv`}
            csv={csv}
            label={`匯出 ${list.length} 家為 CSV`}
          />
        </div>
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
