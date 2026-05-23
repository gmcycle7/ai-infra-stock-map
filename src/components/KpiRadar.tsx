import type { InvestmentKpi } from "../types";
import { radarLabels } from "../lib/kpi";

interface Props {
  radar: InvestmentKpi["radar"];
  size?: number;
}

/**
 * 10 維度投資 KPI 雷達圖。
 * 機會維度與風險維度同圖呈現，但用不同色標示（避免誤讀）。
 */
export function KpiRadar({ radar, size = 320 }: Props) {
  const dims = Object.keys(radar) as Array<keyof InvestmentKpi["radar"]>;
  const riskDims = new Set<keyof InvestmentKpi["radar"]>([
    "valuationRisk",
    "cyclicalityRisk",
    "disruptionRisk",
  ]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 56;
  const max = 100;

  function point(value: number, idx: number) {
    const angle = (Math.PI * 2 * idx) / dims.length - Math.PI / 2;
    const radius = (value / max) * r;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  // 機會 polygon（藍）
  const oppPoints = dims
    .map((d, i) => {
      const v = riskDims.has(d) ? 0 : radar[d];
      return v > 0 ? point(v, i) : null;
    })
    .filter(Boolean) as Array<{ x: number; y: number }>;

  // 風險 polygon（紅）— 只畫風險維度的 3 個點，其它為 0
  const riskPoints = dims
    .map((d, i) => (riskDims.has(d) ? point(radar[d], i) : point(0, i)));

  const oppPolyD = dims
    .map((d, i) => {
      const v = riskDims.has(d) ? 0 : radar[d];
      const p = point(v, i);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const riskPolyD = riskPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // 同心圈：25 / 50 / 75 / 100
  const rings = [25, 50, 75, 100].map((lvl) => (
    <polygon
      key={lvl}
      points={dims
        .map((_, i) => {
          const p = point(lvl, i);
          return `${p.x},${p.y}`;
        })
        .join(" ")}
      className="fill-none stroke-slate-200 dark:stroke-slate-800"
      strokeWidth={1}
    />
  ));

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-sm">
        {rings}
        {dims.map((d, i) => {
          const outer = point(max, i);
          const labelRadius = r + 26;
          const angle = (Math.PI * 2 * i) / dims.length - Math.PI / 2;
          const lx = cx + labelRadius * Math.cos(angle);
          const ly = cy + labelRadius * Math.sin(angle);
          const isRisk = riskDims.has(d);
          return (
            <g key={d}>
              <line
                x1={cx}
                y1={cy}
                x2={outer.x}
                y2={outer.y}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth={1}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className={
                  "text-[10px] " +
                  (isRisk
                    ? "fill-rose-600 dark:fill-rose-400"
                    : "fill-slate-700 dark:fill-slate-200")
                }
              >
                <tspan x={lx} dy="0">{radarLabels[d]}</tspan>
                <tspan x={lx} dy="11" className="fill-slate-400 dark:fill-slate-500">{radar[d]}</tspan>
              </text>
            </g>
          );
        })}
        {/* 機會多邊形 */}
        <polygon
          points={oppPolyD}
          className="fill-brand-500/30 stroke-brand-600 dark:fill-brand-400/25 dark:stroke-brand-400"
          strokeWidth={1.5}
        />
        {/* 機會點 */}
        {oppPoints.map((p, i) => (
          <circle key={"o" + i} cx={p.x} cy={p.y} r={2.5} className="fill-brand-600 dark:fill-brand-400" />
        ))}
        {/* 風險三角 */}
        <polygon
          points={riskPolyD}
          className="fill-rose-500/15 stroke-rose-500 dark:stroke-rose-400"
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />
      </svg>

      <div className="flex flex-wrap justify-center gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-brand-500/60 ring-1 ring-brand-600" />
          機會維度
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-rose-500/20 ring-1 ring-rose-500" />
          風險維度（分數越高 = 風險越大）
        </span>
      </div>
    </div>
  );
}
