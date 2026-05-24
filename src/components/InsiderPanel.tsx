import type { LiveQuote } from "../services/marketData";
import { formatPercent, formatRatio } from "../services/marketData";

interface Props {
  quote: LiveQuote;
}

function tonePct(v: number | null, opts: { lowerIsBetter?: boolean; goodHigh?: number; goodLow?: number } = {}) {
  if (v == null) return "text-slate-400";
  if (opts.lowerIsBetter) {
    if (opts.goodLow != null && v < opts.goodLow) return "text-emerald-600 dark:text-emerald-400";
    return "text-amber-600 dark:text-amber-400";
  }
  if (opts.goodHigh != null && v >= opts.goodHigh) return "text-emerald-600 dark:text-emerald-400";
  return "text-slate-600 dark:text-slate-300";
}

function shortInterestTone(v: number | null): { tone: string; label: string } {
  if (v == null) return { tone: "text-slate-400", label: "—" };
  if (v >= 0.2) return { tone: "text-rose-700 dark:text-rose-300", label: "極高" };
  if (v >= 0.1) return { tone: "text-rose-600 dark:text-rose-400", label: "偏高" };
  if (v >= 0.05) return { tone: "text-amber-600 dark:text-amber-400", label: "中等" };
  return { tone: "text-emerald-600 dark:text-emerald-400", label: "低" };
}

export function InsiderPanel({ quote }: Props) {
  const hasData =
    quote.heldPercentInsiders != null ||
    quote.heldPercentInstitutions != null ||
    quote.shortPercentOfFloat != null ||
    quote.insiderNetTxnCount != null;

  if (!hasData) {
    return (
      <section className="card p-5">
        <h2 className="section-title">內部人 / 機構 / Short Interest</h2>
        <p className="muted mt-2 text-sm">
          Yahoo Finance 無此資料（部分非美股、小型股、新上市公司會缺）。
          建議直接到公司 IR 頁或 SEC EDGAR / TWSE 公開資訊觀測站查 Form 4 / 內部人申報。
        </p>
      </section>
    );
  }

  const shortInfo = shortInterestTone(quote.shortPercentOfFloat);
  const insiderNetShares = quote.insiderNetShares;
  const insiderTxnNet = quote.insiderNetTxnCount;
  const insiderDirection =
    insiderNetShares == null
      ? null
      : insiderNetShares > 100_000
        ? { tone: "text-emerald-600 dark:text-emerald-400", label: "淨買進", arrow: "▲" }
        : insiderNetShares < -100_000
          ? { tone: "text-rose-600 dark:text-rose-400", label: "淨賣出", arrow: "▼" }
          : { tone: "text-slate-500 dark:text-slate-400", label: "持平", arrow: "—" };

  return (
    <section className="card space-y-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title">內部人 / 機構 / Short Interest</h2>
        <span className="muted text-xs">來源：Yahoo Finance · 通常落後 1-3 個月</span>
      </div>

      {/* 持股結構 */}
      <div>
        <h3 className="muted mb-2 text-xs font-semibold uppercase">持股結構</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Cell
            label="內部人持股"
            value={formatPercent(quote.heldPercentInsiders)}
            hint="員工 / 董監事 / 大股東持股比"
          />
          <Cell
            label="機構持股"
            value={formatPercent(quote.heldPercentInstitutions)}
            hint=">70% 通常代表「機構共識」"
            valueClass={tonePct(quote.heldPercentInstitutions, { goodHigh: 0.6 })}
          />
          <Cell
            label="Short / Float"
            value={formatPercent(quote.shortPercentOfFloat)}
            hint={`Short Interest ${shortInfo.label}`}
            valueClass={shortInfo.tone}
          />
        </div>
      </div>

      {/* Short / 內部人交易 */}
      <div>
        <h3 className="muted mb-2 text-xs font-semibold uppercase">內部人交易（近 6 個月）+ Short 細節</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Cell
            label="近 6 月內部人淨股數"
            value={
              insiderNetShares == null
                ? "—"
                : `${insiderDirection?.arrow ?? ""} ${Math.abs(insiderNetShares).toLocaleString()} 股`
            }
            valueClass={insiderDirection?.tone}
            hint={
              insiderDirection
                ? insiderDirection.label + "（負值 = 淨賣）"
                : "Yahoo 資料推算；準確以 SEC Form 4 為準"
            }
          />
          <Cell
            label="近 6 月內部人交易筆數"
            value={
              insiderTxnNet == null
                ? "—"
                : `${insiderTxnNet > 0 ? "+" : ""}${insiderTxnNet} 筆`
            }
            hint="（買進筆數 - 賣出筆數）"
            valueClass={
              insiderTxnNet == null
                ? "text-slate-400"
                : insiderTxnNet > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : insiderTxnNet < 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-slate-500"
            }
          />
          <Cell
            label="Short 回補天數"
            value={formatRatio(quote.shortRatio, 1)}
            hint="Short shares / 日均成交量；> 5 表示回補可能引發 squeeze"
            valueClass={
              quote.shortRatio == null
                ? "text-slate-400"
                : quote.shortRatio >= 5
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-600 dark:text-slate-300"
            }
          />
        </div>
      </div>

      {/* 讀法提醒 */}
      <div className="muted rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-[11px] dark:border-amber-900 dark:bg-amber-950/30">
        <strong>讀法：</strong>
        <ul className="mt-1 list-disc space-y-0.5 pl-5">
          <li>
            <strong>內部人「淨賣出」</strong>：原因多元（行權繳稅、生活、分散風險），單看絕對值意義有限；連續多季淨賣值得追蹤
          </li>
          <li>
            <strong>機構持股 &gt; 70%</strong>：股票被「機構共識」覆蓋；冷門題材股通常 &lt; 40%
          </li>
          <li>
            <strong>Short / Float &gt; 10%</strong>：空頭觀點明顯；可能是空殺潛力，也可能是基本面警訊
          </li>
          <li>
            <strong>Short 回補天數 &gt; 5</strong>：若有正面消息可能引發 short squeeze
          </li>
        </ul>
      </div>
    </section>
  );
}

function Cell({
  label,
  value,
  hint,
  valueClass = "",
}: {
  label: string;
  value: string;
  hint?: string;
  valueClass?: string;
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
