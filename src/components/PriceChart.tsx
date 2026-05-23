import { useMemo, useRef, useState } from "react";
import type { HistoryPoint } from "../services/marketData";
import { formatPrice } from "../services/marketData";

type Range = "1M" | "3M" | "6M" | "1Y" | "2Y" | "All";

const RANGE_DAYS: Record<Range, number | null> = {
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
  "2Y": 730,
  All: null,
};

const RANGES: Range[] = ["1M", "3M", "6M", "1Y", "2Y", "All"];

interface Props {
  data: HistoryPoint[];
  currency: string;
  height?: number;
  defaultRange?: Range;
}

/**
 * 股價折線圖。
 *  - 區間選擇器：1M / 3M / 6M / 1Y / 2Y / All
 *  - Hover：crosshair + 軸線投影 + 浮動 tooltip
 */
export function PriceChart({
  data,
  currency,
  height = 220,
  defaultRange = "6M",
}: Props) {
  const [range, setRange] = useState<Range>(defaultRange);
  const ref = useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // 視窗化資料（依 range 切片）
  // 用「資料最後一筆日期」當基準（而非 Date.now()），更穩定且符合 purity 規則
  const view = useMemo(() => {
    if (data.length === 0) return [];
    const days = RANGE_DAYS[range];
    if (days == null) return data;
    const lastDate = new Date(data[data.length - 1].d).getTime();
    const cutoff = lastDate - days * 24 * 60 * 60 * 1000;
    return data.filter((p) => new Date(p.d).getTime() >= cutoff);
  }, [data, range]);

  const W = 900;
  const H = height;
  const PAD_L = 56;
  const PAD_R = 56;
  const PAD_T = 12;
  const PAD_B = 28;

  const stats = useMemo(() => {
    if (view.length === 0) return null;
    const closes = view.map((p) => p.c);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const first = view[0];
    const last = view[view.length - 1];
    const change = last.c - first.c;
    const changePct = (change / first.c) * 100;
    return { min, max, first, last, change, changePct };
  }, [view]);

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        無歷史價資料
      </div>
    );
  }

  if (!stats || view.length === 0) {
    return (
      <div className="space-y-2">
        <RangeButtons range={range} setRange={setRange} />
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          所選區間無資料
        </div>
      </div>
    );
  }

  const range_v = stats.max - stats.min || 1;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const dx = innerW / Math.max(view.length - 1, 1);

  const xOf = (i: number) => PAD_L + i * dx;
  const yOf = (c: number) => PAD_T + (1 - (c - stats.min) / range_v) * innerH;

  const pathD = view
    .map((p, i) => (i === 0 ? "M" : "L") + xOf(i).toFixed(1) + " " + yOf(p.c).toFixed(1))
    .join(" ");

  const areaD =
    pathD +
    ` L${xOf(view.length - 1).toFixed(1)} ${(PAD_T + innerH).toFixed(1)}` +
    ` L${xOf(0).toFixed(1)} ${(PAD_T + innerH).toFixed(1)} Z`;

  const isUp = stats.change >= 0;
  const lineCls = isUp
    ? "stroke-emerald-600 dark:stroke-emerald-400"
    : "stroke-rose-600 dark:stroke-rose-400";
  const areaCls = isUp ? "fill-emerald-500/10" : "fill-rose-500/10";

  // X 軸刻度：依 range 決定密度
  const xTicks: Array<{ i: number; label: string }> = [];
  if (range === "1M") {
    let lastWeek = -1;
    view.forEach((p, i) => {
      const d = new Date(p.d);
      const week = Math.floor(d.getDate() / 7);
      if (week !== lastWeek) {
        lastWeek = week;
        xTicks.push({ i, label: `${d.getMonth() + 1}/${d.getDate()}` });
      }
    });
  } else if (range === "3M" || range === "6M") {
    let lastMonth = "";
    view.forEach((p, i) => {
      const m = p.d.slice(0, 7);
      if (m !== lastMonth) {
        lastMonth = m;
        xTicks.push({ i, label: `${parseInt(p.d.slice(5, 7), 10)}月` });
      }
    });
  } else {
    // 1Y / 2Y / All — 顯示季 / 半年
    let lastQuarter = "";
    view.forEach((p, i) => {
      const m = parseInt(p.d.slice(5, 7), 10);
      const y = p.d.slice(2, 4);
      const qLabel = m <= 3 ? "Q1" : m <= 6 ? "Q2" : m <= 9 ? "Q3" : "Q4";
      const key = y + qLabel;
      if (key !== lastQuarter) {
        lastQuarter = key;
        xTicks.push({ i, label: `${y}${qLabel}` });
      }
    });
  }

  // Y 軸 5 個刻度
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => stats.min + range_v * t);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.max(0, Math.min(view.length - 1, Math.round((x - PAD_L) / dx)));
    setHoverIdx(idx);
  }
  function onLeave() {
    setHoverIdx(null);
  }

  const hover = hoverIdx != null ? view[hoverIdx] : null;

  function fmtY(v: number) {
    // 軸標籤用簡短格式
    if (currency === "KRW") return Math.round(v).toLocaleString();
    if (v >= 10000) return v.toFixed(0);
    if (v >= 100) return v.toFixed(1);
    return v.toFixed(2);
  }

  return (
    <div className="space-y-3">
      {/* 統計列 + 區間切換 */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs">
          <span>
            <span className="muted">{stats.first.d} → {stats.last.d}</span>
          </span>
          <span>
            <span className="muted">最新</span>{" "}
            <span className="font-mono font-semibold">
              {formatPrice(stats.last.c, currency)}
            </span>
          </span>
          <span
            className={
              isUp
                ? "font-semibold text-emerald-600 dark:text-emerald-400"
                : "font-semibold text-rose-600 dark:text-rose-400"
            }
          >
            {range} 漲跌：{isUp ? "+" : ""}
            {stats.changePct.toFixed(2)}%
          </span>
          <span className="muted">
            高{" "}
            <span className="font-mono">{formatPrice(stats.max, currency)}</span> / 低{" "}
            <span className="font-mono">{formatPrice(stats.min, currency)}</span>
          </span>
        </div>
        <RangeButtons range={range} setRange={setRange} />
      </div>

      {/* SVG chart */}
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full select-none rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        onMouseMove={onMove}
        onTouchStart={(e) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const x = ((e.touches[0].clientX - rect.left) / rect.width) * W;
          const idx = Math.max(0, Math.min(view.length - 1, Math.round((x - PAD_L) / dx)));
          setHoverIdx(idx);
        }}
        onTouchMove={(e) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const x = ((e.touches[0].clientX - rect.left) / rect.width) * W;
          const idx = Math.max(0, Math.min(view.length - 1, Math.round((x - PAD_L) / dx)));
          setHoverIdx(idx);
        }}
        onTouchEnd={onLeave}
        onMouseLeave={onLeave}
      >
        {/* Y 軸格線 + 標籤 */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={yOf(v)}
              y2={yOf(v)}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth={1}
              strokeDasharray={i === 0 || i === yTicks.length - 1 ? "0" : "3 3"}
            />
            <text
              x={PAD_L - 6}
              y={yOf(v)}
              textAnchor="end"
              dominantBaseline="central"
              className="fill-slate-500 text-[10px]"
            >
              {fmtY(v)}
            </text>
          </g>
        ))}

        {/* X 軸刻度 */}
        {xTicks.map((t) => (
          <text
            key={t.i}
            x={xOf(t.i)}
            y={H - 8}
            textAnchor="middle"
            className="fill-slate-500 text-[10px]"
          >
            {t.label}
          </text>
        ))}

        {/* 折線 + 區域 */}
        <path d={areaD} className={areaCls} />
        <path d={pathD} className={"fill-none " + lineCls} strokeWidth={1.8} />

        {/* Hover crosshair + 軸投影 */}
        {hover && hoverIdx != null && (
          <g>
            {/* 垂直 crosshair */}
            <line
              x1={xOf(hoverIdx)}
              x2={xOf(hoverIdx)}
              y1={PAD_T}
              y2={PAD_T + innerH}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeDasharray="2 2"
            />
            {/* 水平 crosshair */}
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={yOf(hover.c)}
              y2={yOf(hover.c)}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeDasharray="2 2"
            />
            {/* 點 */}
            <circle
              cx={xOf(hoverIdx)}
              cy={yOf(hover.c)}
              r={4}
              className={"fill-white " + lineCls}
              strokeWidth={2}
            />

            {/* Y 軸投影標籤（左側） */}
            <g transform={`translate(${PAD_L - 4}, ${yOf(hover.c)})`}>
              <rect
                x={-48}
                y={-9}
                width={48}
                height={18}
                rx={3}
                className="fill-slate-900 dark:fill-slate-100"
              />
              <text
                x={-24}
                y={0}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white text-[10px] font-mono dark:fill-slate-900"
              >
                {fmtY(hover.c)}
              </text>
            </g>

            {/* X 軸投影標籤（下側） */}
            <g transform={`translate(${xOf(hoverIdx)}, ${PAD_T + innerH + 4})`}>
              <rect
                x={-32}
                y={0}
                width={64}
                height={16}
                rx={3}
                className="fill-slate-900 dark:fill-slate-100"
              />
              <text
                x={0}
                y={8}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white text-[10px] font-mono dark:fill-slate-900"
              >
                {hover.d}
              </text>
            </g>

            {/* 浮動 tooltip（含完整資訊） */}
            <g
              transform={`translate(${
                xOf(hoverIdx) + 8 + 120 > W
                  ? xOf(hoverIdx) - 128
                  : xOf(hoverIdx) + 8
              }, ${PAD_T + 4})`}
            >
              <rect width={120} height={40} rx={6} className="fill-slate-900/95 stroke-slate-700" />
              <text x={8} y={15} className="fill-slate-300 text-[10px]">
                {hover.d}
              </text>
              <text x={8} y={30} className="fill-white text-[12px] font-semibold">
                {formatPrice(hover.c, currency)}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}

function RangeButtons({
  range,
  setRange,
}: {
  range: Range;
  setRange: (r: Range) => void;
}) {
  return (
    <div className="inline-flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs dark:border-slate-700 dark:bg-slate-900">
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setRange(r)}
          className={
            "rounded-md px-2.5 py-1 transition " +
            (range === r
              ? "bg-brand-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800")
          }
        >
          {r}
        </button>
      ))}
    </div>
  );
}
