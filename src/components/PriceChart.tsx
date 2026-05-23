import { useMemo, useRef, useState } from "react";
import type { HistoryPoint } from "../services/marketData";
import { formatPrice } from "../services/marketData";

interface Props {
  data: HistoryPoint[];
  currency: string;
  height?: number;
}

/**
 * 簡單 SVG 折線圖：6 個月日線收盤。
 * 含 hover crosshair、月份 X 軸標籤、最高/最低 / 起始 / 最新 標籤。
 */
export function PriceChart({ data, currency, height = 200 }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const W = 900;
  const H = height;
  const PAD_L = 56;
  const PAD_R = 16;
  const PAD_T = 12;
  const PAD_B = 28;

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const closes = data.map((p) => p.c);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const first = data[0];
    const last = data[data.length - 1];
    const change = last.c - first.c;
    const changePct = (change / first.c) * 100;
    return { min, max, first, last, change, changePct };
  }, [data]);

  if (data.length === 0 || !stats) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        無歷史價資料
      </div>
    );
  }

  const range = stats.max - stats.min || 1;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const dx = innerW / Math.max(data.length - 1, 1);

  const xOf = (i: number) => PAD_L + i * dx;
  const yOf = (c: number) => PAD_T + (1 - (c - stats.min) / range) * innerH;

  const pathD = data
    .map((p, i) => (i === 0 ? "M" : "L") + xOf(i).toFixed(1) + " " + yOf(p.c).toFixed(1))
    .join(" ");

  const areaD =
    pathD +
    ` L${xOf(data.length - 1).toFixed(1)} ${(PAD_T + innerH).toFixed(1)}` +
    ` L${xOf(0).toFixed(1)} ${(PAD_T + innerH).toFixed(1)} Z`;

  const isUp = stats.change >= 0;
  const lineCls = isUp
    ? "stroke-emerald-600 dark:stroke-emerald-400"
    : "stroke-rose-600 dark:stroke-rose-400";
  const areaCls = isUp
    ? "fill-emerald-500/10"
    : "fill-rose-500/10";

  // 找月份切分點作 X 軸刻度
  const monthTicks: Array<{ i: number; label: string }> = [];
  let lastMonth = "";
  data.forEach((p, i) => {
    const m = p.d.slice(0, 7); // YYYY-MM
    if (m !== lastMonth) {
      lastMonth = m;
      const monthNum = parseInt(p.d.slice(5, 7), 10);
      monthTicks.push({ i, label: `${monthNum}月` });
    }
  });

  // Y 軸刻度：取 4 個等距值
  const yTicks = [0, 0.33, 0.66, 1].map((t) => stats.min + range * t);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.max(0, Math.min(data.length - 1, Math.round((x - PAD_L) / dx)));
    setHoverIdx(idx);
  }
  function onLeave() {
    setHoverIdx(null);
  }

  const hover = hoverIdx != null ? data[hoverIdx] : null;

  return (
    <div className="space-y-2">
      {/* 統計列 */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xs">
        <span>
          <span className="muted">起始（{stats.first.d}）</span>{" "}
          <span className="font-mono">{formatPrice(stats.first.c, currency)}</span>
        </span>
        <span>
          <span className="muted">最新（{stats.last.d}）</span>{" "}
          <span className="font-mono font-semibold">{formatPrice(stats.last.c, currency)}</span>
        </span>
        <span className={isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
          6M 漲跌：{isUp ? "+" : ""}
          {stats.changePct.toFixed(2)}%（{isUp ? "+" : ""}
          {stats.change.toFixed(2)}）
        </span>
        <span className="muted">
          高 <span className="font-mono">{formatPrice(stats.max, currency)}</span> / 低{" "}
          <span className="font-mono">{formatPrice(stats.min, currency)}</span>
        </span>
      </div>

      {/* SVG chart */}
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full select-none rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* 格線 + Y 軸標籤 */}
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
              {formatPrice(v, currency).replace(currency, "").replace("$", "").trim()}
            </text>
          </g>
        ))}

        {/* X 軸月份刻度 */}
        {monthTicks.map((t) => (
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

        {/* 折線 */}
        <path d={areaD} className={areaCls} />
        <path d={pathD} className={"fill-none " + lineCls} strokeWidth={1.8} />

        {/* Hover crosshair */}
        {hover && hoverIdx != null && (
          <g>
            <line
              x1={xOf(hoverIdx)}
              x2={xOf(hoverIdx)}
              y1={PAD_T}
              y2={PAD_T + innerH}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeDasharray="2 2"
            />
            <circle
              cx={xOf(hoverIdx)}
              cy={yOf(hover.c)}
              r={3.5}
              className={"fill-white " + lineCls}
              strokeWidth={2}
            />
            {/* Tooltip */}
            <g
              transform={`translate(${Math.min(
                xOf(hoverIdx) + 8,
                W - 110,
              )}, ${PAD_T + 6})`}
            >
              <rect
                width={106}
                height={36}
                rx={6}
                className="fill-slate-900/95 stroke-slate-700"
              />
              <text x={8} y={14} className="fill-slate-200 text-[10px]">
                {hover.d}
              </text>
              <text x={8} y={28} className="fill-white text-[12px] font-semibold">
                {formatPrice(hover.c, currency)}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
