import type { MoatScore } from "../types";
import { moatLabels } from "../lib/utils";

// 用 SVG 畫簡單的雷達圖（不依賴 recharts，避免 bundle 過大）
export function MoatRadar({ moat, size = 220 }: { moat: MoatScore; size?: number }) {
  const dims: Array<keyof MoatScore> = [
    "process",
    "ipDesign",
    "ecosystem",
    "customer",
    "manufacturing",
    "switching",
  ];
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 28;
  const max = 5;

  function pointAt(value: number, idx: number) {
    const angle = (Math.PI * 2 * idx) / dims.length - Math.PI / 2;
    const radius = (value / max) * r;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  const polygon = dims
    .map((d, i) => {
      const p = pointAt(moat[d], i);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const rings = [1, 2, 3, 4, 5].map((lvl) => (
    <polygon
      key={lvl}
      points={dims
        .map((_, i) => {
          const p = pointAt(lvl, i);
          return `${p.x},${p.y}`;
        })
        .join(" ")}
      className="fill-none stroke-slate-200 dark:stroke-slate-800"
      strokeWidth={1}
    />
  ));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs">
      {rings}
      {dims.map((d, i) => {
        const outer = pointAt(max, i);
        const labelRadius = r + 14;
        const angle = (Math.PI * 2 * i) / dims.length - Math.PI / 2;
        const lx = cx + labelRadius * Math.cos(angle);
        const ly = cy + labelRadius * Math.sin(angle);
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
              className="fill-slate-600 text-[10px] dark:fill-slate-400"
            >
              {moatLabels[d]} {moat[d]}
            </text>
          </g>
        );
      })}
      <polygon
        points={polygon}
        className="fill-brand-500/40 stroke-brand-600 dark:fill-brand-400/30 dark:stroke-brand-400"
        strokeWidth={1.5}
      />
    </svg>
  );
}

// 風險條圖
import type { RiskScore } from "../types";
import { riskLabels } from "../lib/utils";

export function RiskBars({ risk }: { risk: RiskScore }) {
  const dims: Array<keyof RiskScore> = [
    "nvidiaDependency",
    "memoryCycle",
    "chinaExport",
    "customerConc",
    "capexCycle",
    "valuation",
    "techTransition",
  ];
  return (
    <ul className="space-y-1.5 text-xs">
      {dims.map((d) => {
        const v = risk[d];
        const pct = (v / 5) * 100;
        const tone =
          v >= 4
            ? "bg-rose-500"
            : v >= 3
              ? "bg-amber-500"
              : v >= 2
                ? "bg-yellow-400"
                : "bg-emerald-500";
        return (
          <li key={d} className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-slate-600 dark:text-slate-300">
              {riskLabels[d]}
            </span>
            <span className="relative h-2 flex-1 overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
              <span
                className={"absolute inset-y-0 left-0 " + tone}
                style={{ width: pct + "%" }}
              />
            </span>
            <span className="w-6 text-right tabular-nums text-slate-600 dark:text-slate-400">
              {v}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
