import { Link } from "react-router-dom";
import type { Company } from "../types";
import { categoryBySlug } from "../data/categories";
import {
  CategoryBadge,
  ConfidenceBadge,
  MarketBadge,
  PositionBadge,
  ScoreBadge,
} from "./Badge";
import { InvestmentTypeBadge } from "./InvestmentTypeBadge";
import { Sparkline } from "./Sparkline";
import { windowReturn } from "../lib/priceWindow";
import { PriceDelta } from "./PriceDelta";
import { WatchlistStar } from "./WatchlistStar";
import { getKpi } from "../lib/kpi";
import { getQuote, formatPrice } from "../services/marketData";

function MiniScore({ label, v, risk = false }: { label: string; v: number; risk?: boolean }) {
  const cls = risk
    ? v >= 70
      ? "bg-rose-500"
      : v >= 50
        ? "bg-amber-500"
        : "bg-emerald-500"
    : v >= 75
      ? "bg-emerald-500"
      : v >= 55
        ? "bg-sky-500"
        : v >= 35
          ? "bg-amber-400"
          : "bg-slate-400";
  const tcls = risk
    ? v >= 70
      ? "text-rose-700 dark:text-rose-300"
      : v >= 50
        ? "text-amber-700 dark:text-amber-300"
        : "text-emerald-700 dark:text-emerald-300"
    : v >= 75
      ? "text-emerald-700 dark:text-emerald-300"
      : v >= 55
        ? "text-sky-700 dark:text-sky-300"
        : v >= 35
          ? "text-amber-700 dark:text-amber-300"
          : "text-slate-500 dark:text-slate-400";
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="muted text-[10px]">{label}</span>
      <span className={"font-mono text-[11px] font-semibold tabular-nums " + tcls}>{v}</span>
      <span className="relative h-1 w-10 overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
        <span className={"absolute inset-y-0 left-0 " + cls} style={{ width: v + "%" }} />
      </span>
    </div>
  );
}

export function CompanyCard({ company }: { company: Company }) {
  const primaryCat = company.category[0] ? categoryBySlug[company.category[0]] : undefined;
  const kpi = getKpi(company);
  const quote = getQuote(company.id);
  const r90 = quote?.history ? windowReturn(quote.history, 90) : null;

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
        <div className="flex flex-shrink-0 items-center gap-1">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {company.ticker}
          </span>
          <WatchlistStar id={company.id} size="sm" />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <MarketBadge market={company.market} />
        <PositionBadge pos={company.supplyChainPosition} />
        <ScoreBadge score={company.aiImportanceScore} />
        <InvestmentTypeBadge type={kpi.investmentType} />
        <ConfidenceBadge level={company.confidenceLevel} />
      </div>

      {/* Price + sparkline + 3M return */}
      {quote && quote.price != null && (
        <div className="flex items-end justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="min-w-0">
            <div className="muted text-[10px]">
              最新價
              {quote.priceAsOf && (
                <span
                  className="ml-1 text-amber-600 dark:text-amber-400"
                  title={`資料截至 ${quote.priceAsOf}（即時 quote 不可用，使用歷史收盤備援）`}
                >
                  ⏱ {quote.priceAsOf}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-semibold">
                {formatPrice(quote.price, quote.currency)}
              </span>
              <PriceDelta pct={quote.changePercent} variant="inline" size="xs" />
            </div>
            <div className="muted mt-0.5 text-[10px]">
              3M <PriceDelta pct={r90} variant="inline" size="xs" />
            </div>
          </div>
          <div className="w-24 flex-shrink-0">
            <Sparkline data={quote.history ?? []} width={100} height={32} windowSize={90} />
          </div>
        </div>
      )}

      <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
        {company.whatTheyDo}
      </p>

      {/* KPI mini bars */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 border-t border-slate-100 pt-2 dark:border-slate-800">
        <MiniScore label="短期" v={kpi.shortTermScore} />
        <MiniScore label="三年" v={kpi.threeYearScore} />
        <MiniScore label="五年" v={kpi.fiveYearScore} />
        <MiniScore label="十年" v={kpi.tenYearScore} />
        <MiniScore label="風險" v={kpi.riskScore} risk />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {company.category.slice(0, 3).map((c) => {
          const cat = categoryBySlug[c];
          return cat ? <CategoryBadge key={c} label={cat.nameZh} color={cat.color} /> : null;
        })}
        {primaryCat?.nameEn && (
          <span className="muted text-[10px] leading-relaxed">{primaryCat.nameEn}</span>
        )}
      </div>
    </Link>
  );
}
