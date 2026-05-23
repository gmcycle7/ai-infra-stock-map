import type { LiveQuote } from "../services/marketData";
import {
  formatPrice,
  formatRecommendation,
  targetUpside,
} from "../services/marketData";
import { PriceDelta } from "./PriceDelta";

interface Props {
  quote: LiveQuote;
}

/**
 * 分析師目標價橫條圖：在「目標低」→「目標高」軸上同時顯示：
 *  - 目前股價 marker
 *  - 目標中位數 marker
 *  - 上行空間 %（隱含 upside）
 */
export function AnalystTargetBar({ quote }: Props) {
  const { price, targetLow, targetHigh, targetMean, targetMedian, currency, recommendationKey, numberOfAnalystOpinions } = quote;
  const rec = formatRecommendation(recommendationKey);
  const upside = targetUpside(price, targetMean);

  if (price == null || targetLow == null || targetHigh == null) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        分析師目標價：Yahoo Finance 無資料（部分小型股或新上市公司可能沒有 sell-side 覆蓋）
      </div>
    );
  }

  // 為了視覺穩定，讓 axis range 比 high/low 稍大
  const axisLow = Math.min(targetLow, price) * 0.97;
  const axisHigh = Math.max(targetHigh, price) * 1.03;
  const range = axisHigh - axisLow || 1;

  const pos = (v: number) => ((v - axisLow) / range) * 100;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
        <div>
          <span className="muted">分析師建議：</span>
          <span className={"font-semibold " + rec.tone}>{rec.zh}</span>
          {quote.recommendationMean != null && (
            <span className="muted ml-1">（平均 {quote.recommendationMean.toFixed(1)}/5）</span>
          )}
          {numberOfAnalystOpinions != null && (
            <span className="muted ml-1">· {numberOfAnalystOpinions} 位分析師</span>
          )}
        </div>
        <div>
          <span className="muted">目標價隱含上行：</span>
          <PriceDelta pct={upside} variant="inline" size="sm" />
        </div>
      </div>

      <div className="relative h-12 rounded-lg bg-gradient-to-r from-rose-200 via-amber-100 to-emerald-200 dark:from-rose-900/40 dark:via-amber-900/30 dark:to-emerald-900/40">
        {/* 目標 range bar */}
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-700/70 dark:bg-slate-100/40"
          style={{
            left: pos(targetLow) + "%",
            width: pos(targetHigh) - pos(targetLow) + "%",
          }}
        />

        {/* 目標中位數 / 均值 marker */}
        {targetMedian != null && (
          <div
            className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-slate-900 dark:bg-white"
            style={{ left: pos(targetMedian) + "%" }}
            title={`中位目標 ${formatPrice(targetMedian, currency)}`}
          />
        )}
        {targetMean != null && (
          <div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-900 bg-white dark:border-white dark:bg-slate-900"
            style={{ left: pos(targetMean) + "%" }}
            title={`平均目標 ${formatPrice(targetMean, currency)}`}
          />
        )}

        {/* 目前價 marker：用倒三角 */}
        <div
          className="absolute top-0 -translate-x-1/2 text-brand-700 dark:text-brand-300"
          style={{ left: pos(price) + "%" }}
          title={`目前價 ${formatPrice(price, currency)}`}
        >
          <div className="text-sm leading-none">▼</div>
        </div>
        <div
          className="absolute top-1/2 h-12 w-0.5 -translate-x-1/2 bg-brand-600 dark:bg-brand-400"
          style={{ left: pos(price) + "%", top: 0 }}
        />

        {/* Labels at extremes */}
        <div className="absolute bottom-0 left-1 text-[10px] text-slate-500">
          低 {formatPrice(targetLow, currency)}
        </div>
        <div className="absolute bottom-0 right-1 text-[10px] text-slate-500">
          高 {formatPrice(targetHigh, currency)}
        </div>
      </div>

      <div className="muted text-[10px]">
        ▼ 目前價 {formatPrice(price, currency)} | ● 平均目標{" "}
        {targetMean != null ? formatPrice(targetMean, currency) : "—"} | ▌中位目標{" "}
        {targetMedian != null ? formatPrice(targetMedian, currency) : "—"}
      </div>
      <p className="muted text-[10px]">
        ⚠ 目標價為 Yahoo 彙整 sell-side 分析師研究，僅供參考，不保證價格走勢；
        覆蓋人數越多通常代表越穩定。
      </p>
    </div>
  );
}
