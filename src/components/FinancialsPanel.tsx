import type { LiveQuote } from "../services/marketData";
import {
  formatLargeNumber,
  formatPercent,
  formatRatio,
} from "../services/marketData";

interface Props {
  quote: LiveQuote;
}

function tone(v: number | null, opts: { good: number; bad: number; lowerIsBetter?: boolean } = { good: 0.15, bad: 0.05 }) {
  if (v == null) return "text-slate-400";
  const { good, bad, lowerIsBetter } = opts;
  if (lowerIsBetter) {
    if (v < bad) return "text-emerald-600 dark:text-emerald-400";
    if (v < good) return "text-sky-600 dark:text-sky-400";
    return "text-amber-600 dark:text-amber-400";
  }
  if (v >= good) return "text-emerald-600 dark:text-emerald-400";
  if (v >= bad) return "text-sky-600 dark:text-sky-400";
  if (v >= 0) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function Cell({
  label,
  value,
  valueClass = "",
  hint,
}: {
  label: string;
  value: string;
  valueClass?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="muted text-xs">{label}</div>
      <div className={"mt-1 font-mono text-sm font-semibold tabular-nums " + valueClass}>
        {value}
      </div>
      {hint && <div className="muted mt-0.5 text-[10px]">{hint}</div>}
    </div>
  );
}

export function FinancialsPanel({ quote }: Props) {
  // 是否完全沒財務資料
  const hasData =
    quote.grossMargin != null ||
    quote.profitMargin != null ||
    quote.revenueGrowthYoY != null ||
    quote.returnOnEquity != null;

  if (!hasData) {
    return (
      <section className="card p-5">
        <h2 className="section-title">基本面財務指標</h2>
        <p className="muted mt-2 text-sm">
          Yahoo Finance 無此公司的詳細財務資料（部分小型股或新上市公司會這樣）。
          請至公司 IR 頁面查最新財報。
        </p>
      </section>
    );
  }

  return (
    <section className="card space-y-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title">基本面財務指標</h2>
        <span className="muted text-xs">
          來源：Yahoo Finance（TTM / 最新季）· 數字會落後最新財報 0-3 個月，
          請以公司 IR 為準
        </span>
      </div>

      <div>
        <h3 className="muted mb-2 text-xs font-semibold uppercase">獲利能力</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Cell
            label="毛利率"
            value={formatPercent(quote.grossMargin)}
            valueClass={tone(quote.grossMargin, { good: 0.4, bad: 0.2 })}
          />
          <Cell
            label="營業利益率"
            value={formatPercent(quote.operatingMargin)}
            valueClass={tone(quote.operatingMargin, { good: 0.25, bad: 0.1 })}
          />
          <Cell
            label="淨利率"
            value={formatPercent(quote.profitMargin)}
            valueClass={tone(quote.profitMargin, { good: 0.2, bad: 0.05 })}
          />
          <Cell
            label="ROE"
            value={formatPercent(quote.returnOnEquity)}
            valueClass={tone(quote.returnOnEquity, { good: 0.2, bad: 0.1 })}
            hint="股東權益報酬率"
          />
        </div>
      </div>

      <div>
        <h3 className="muted mb-2 text-xs font-semibold uppercase">成長性</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Cell
            label="營收 YoY 成長"
            value={formatPercent(quote.revenueGrowthYoY)}
            valueClass={tone(quote.revenueGrowthYoY, { good: 0.2, bad: 0 })}
            hint="最新季 vs 去年同期"
          />
          <Cell
            label="獲利 YoY 成長"
            value={formatPercent(quote.earningsGrowthYoY)}
            valueClass={tone(quote.earningsGrowthYoY, { good: 0.25, bad: 0 })}
            hint="最新季 EPS YoY"
          />
          <Cell
            label="ROA"
            value={formatPercent(quote.returnOnAssets)}
            valueClass={tone(quote.returnOnAssets, { good: 0.1, bad: 0.03 })}
            hint="資產報酬率"
          />
        </div>
      </div>

      <div>
        <h3 className="muted mb-2 text-xs font-semibold uppercase">估值比率</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Cell
            label="PEG (Forward)"
            value={formatRatio(quote.pegRatio)}
            valueClass={tone(quote.pegRatio, { good: 1, bad: 2, lowerIsBetter: true })}
            hint="< 1 通常被視為便宜"
          />
          <Cell
            label="P/B"
            value={formatRatio(quote.priceToBook)}
            valueClass={tone(quote.priceToBook, { good: 3, bad: 6, lowerIsBetter: true })}
          />
          <Cell
            label="EV / Revenue"
            value={formatRatio(quote.enterpriseToRevenue)}
            valueClass={tone(quote.enterpriseToRevenue, { good: 5, bad: 15, lowerIsBetter: true })}
          />
          <Cell
            label="EV / EBITDA"
            value={formatRatio(quote.enterpriseToEbitda)}
            valueClass={tone(quote.enterpriseToEbitda, { good: 15, bad: 30, lowerIsBetter: true })}
          />
        </div>
      </div>

      <div>
        <h3 className="muted mb-2 text-xs font-semibold uppercase">財務健康 + 風險</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Cell
            label="現金與短期投資"
            value={formatLargeNumber(quote.totalCash, quote.currency)}
          />
          <Cell
            label="總負債"
            value={formatLargeNumber(quote.totalDebt, quote.currency)}
          />
          <Cell
            label="自由現金流"
            value={formatLargeNumber(quote.freeCashflow, quote.currency)}
            valueClass={
              quote.freeCashflow == null
                ? "text-slate-400"
                : quote.freeCashflow > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
            }
            hint="FCF（年度）"
          />
          <Cell
            label="Beta (vs 市場)"
            value={formatRatio(quote.beta)}
            hint="> 1 表示比大盤波動大"
          />
        </div>
      </div>

      {quote.dividendYield != null && quote.dividendYield > 0 && (
        <div className="muted text-xs">
          股息殖利率：
          <span className="ml-1 font-mono">{formatPercent(quote.dividendYield, 2)}</span>
        </div>
      )}

      <div className="muted rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-[11px] dark:border-amber-900 dark:bg-amber-950/30">
        <strong>讀法提醒：</strong>
        毛利率高 = 定價能力強；ROE/ROA = 資本效率；PEG/EV ratios = 估值便宜還是貴；
        FCF 是現金真實獲利能力（&gt; 0 才能配息 / 買回 / 投資）。
        以上是「快速健檢」用 — 嚴肅投資仍需讀完整 10-K / 年報。
      </div>
    </section>
  );
}
