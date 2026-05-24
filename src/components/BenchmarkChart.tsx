import { useMemo, useState } from "react";
import type { HistoryPoint } from "../services/marketData";
import { BENCHMARK_LABELS, getBenchmark } from "../services/marketData";
import { windowReturn } from "../lib/priceWindow";
import { PriceDelta } from "./PriceDelta";

interface Props {
  stockHistory: HistoryPoint[];
  defaultBenchmark: string;
  stockName: string;
}

type Range = "1M" | "3M" | "6M" | "1Y" | "2Y";

const RANGE_DAYS: Record<Range, number> = {
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 252,
  "2Y": 504,
};

const BENCHMARK_OPTIONS: Array<{ id: string; label: string }> = Object.entries(BENCHMARK_LABELS).map(
  ([id, label]) => ({ id, label }),
);

/**
 * 個股 vs 對照基準的相對報酬圖：
 *  - 兩條折線：個股 normalized to 100、基準 normalized to 100
 *  - 顯示「個股 - 基準」alpha
 *  - 多個 range 切換
 */
export function BenchmarkChart({ stockHistory, defaultBenchmark, stockName }: Props) {
  const [bench, setBench] = useState(defaultBenchmark);
  const [range, setRange] = useState<Range>("1Y");

  const benchmark = getBenchmark(bench as "soxx" | "smh" | "spx" | "tw50" | "twii");
  const benchHistory = benchmark?.history ?? [];

  // 視窗化資料
  const view = useMemo(() => {
    if (stockHistory.length === 0 || benchHistory.length === 0) return null;
    const days = RANGE_DAYS[range];
    const stockSlice = stockHistory.slice(-days);
    const benchSlice = benchHistory.slice(-days);
    if (stockSlice.length === 0 || benchSlice.length === 0) return null;

    // Normalize 都從 100 起算
    const sBase = stockSlice[0].c;
    const bBase = benchSlice[0].c;
    const stockNorm = stockSlice.map((p) => ({ d: p.d, c: (p.c / sBase) * 100 }));
    const benchNorm = benchSlice.map((p) => ({ d: p.d, c: (p.c / bBase) * 100 }));

    const stockRet = windowReturn(stockSlice, days) ?? 0;
    const benchRet = windowReturn(benchSlice, days) ?? 0;
    const alpha = stockRet - benchRet;

    return { stockNorm, benchNorm, stockRet, benchRet, alpha };
  }, [stockHistory, benchHistory, range]);

  if (!view) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        相對報酬：無資料
      </div>
    );
  }

  const W = 900;
  const H = 160;
  const PAD_L = 50;
  const PAD_R = 16;
  const PAD_T = 8;
  const PAD_B = 22;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const allValues = [
    ...view.stockNorm.map((p) => p.c),
    ...view.benchNorm.map((p) => p.c),
  ];
  const yMin = Math.min(...allValues) - 2;
  const yMax = Math.max(...allValues) + 2;
  const range_v = yMax - yMin || 1;

  const dxStock = innerW / Math.max(view.stockNorm.length - 1, 1);
  const dxBench = innerW / Math.max(view.benchNorm.length - 1, 1);

  const xOfStock = (i: number) => PAD_L + i * dxStock;
  const xOfBench = (i: number) => PAD_L + i * dxBench;
  const yOf = (c: number) => PAD_T + (1 - (c - yMin) / range_v) * innerH;

  const stockPath = view.stockNorm
    .map((p, i) => (i === 0 ? "M" : "L") + xOfStock(i).toFixed(1) + " " + yOf(p.c).toFixed(1))
    .join(" ");
  const benchPath = view.benchNorm
    .map((p, i) => (i === 0 ? "M" : "L") + xOfBench(i).toFixed(1) + " " + yOf(p.c).toFixed(1))
    .join(" ");

  const beat = view.alpha > 0;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2 text-xs">
          <span className="muted">對照：</span>
          <select
            className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            value={bench}
            onChange={(e) => setBench(e.target.value)}
          >
            {BENCHMARK_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="inline-flex gap-1 rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs dark:border-slate-700 dark:bg-slate-900">
          {(Object.keys(RANGE_DAYS) as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={
                "rounded px-2 py-0.5 " +
                (range === r
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800")
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded border border-slate-200 p-2 dark:border-slate-700">
          <div className="muted text-[10px]">{stockName}</div>
          <PriceDelta pct={view.stockRet} variant="inline" size="sm" />
        </div>
        <div className="rounded border border-slate-200 p-2 dark:border-slate-700">
          <div className="muted text-[10px]">
            {BENCHMARK_LABELS[bench]}
          </div>
          <PriceDelta pct={view.benchRet} variant="inline" size="sm" />
        </div>
        <div
          className={
            "rounded border p-2 " +
            (beat
              ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950"
              : "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950")
          }
        >
          <div className="muted text-[10px]">Alpha（差距）</div>
          <span
            className={
              "font-mono text-sm font-bold " +
              (beat
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-rose-700 dark:text-rose-300")
            }
          >
            {beat ? "+" : ""}
            {view.alpha.toFixed(2)}%{beat ? " ✓ 跑贏" : " ✗ 落後"}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      >
        {/* 100 線（base line） */}
        <line
          x1={PAD_L}
          x2={W - PAD_R}
          y1={yOf(100)}
          y2={yOf(100)}
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeDasharray="2 2"
        />
        <text x={PAD_L - 4} y={yOf(100)} textAnchor="end" dominantBaseline="central" className="fill-slate-500 text-[9px]">
          100
        </text>

        {/* 基準（灰） */}
        <path
          d={benchPath}
          className="fill-none stroke-slate-400 dark:stroke-slate-500"
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
        {/* 個股 */}
        <path
          d={stockPath}
          className={
            "fill-none " +
            (beat
              ? "stroke-emerald-600 dark:stroke-emerald-400"
              : "stroke-rose-600 dark:stroke-rose-400")
          }
          strokeWidth={2}
        />
      </svg>

      <p className="muted text-[10px]">
        圖中起點都標準化為 100；個股實線、對照基準虛線。「跑贏 / 落後」是真正的 alpha — 比絕對報酬更有意義。
      </p>
    </div>
  );
}
