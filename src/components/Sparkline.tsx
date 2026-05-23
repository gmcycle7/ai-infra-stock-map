import type { HistoryPoint } from "../services/marketData";

interface Props {
  data: HistoryPoint[];
  width?: number;
  height?: number;
  /** 取後 N 個交易日（90 天 ≈ 約 3 個月） */
  windowSize?: number;
}

/**
 * 極簡 inline sparkline — 給卡片 / 表格使用。
 * 自動依漲跌顯示顏色：綠 = 區間上漲、紅 = 區間下跌。
 */
export function Sparkline({ data, width = 100, height = 28, windowSize = 90 }: Props) {
  if (!data || data.length === 0) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-400 text-[9px]"
        >
          無資料
        </text>
      </svg>
    );
  }

  const view = data.slice(-windowSize);
  const closes = view.map((p) => p.c);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const dx = width / Math.max(view.length - 1, 1);

  const xOf = (i: number) => i * dx;
  const yOf = (c: number) => height - ((c - min) / range) * (height - 2) - 1;

  const pathD = view
    .map((p, i) => (i === 0 ? "M" : "L") + xOf(i).toFixed(1) + " " + yOf(p.c).toFixed(1))
    .join(" ");

  const areaD =
    pathD + ` L${xOf(view.length - 1).toFixed(1)} ${height} L0 ${height} Z`;

  const isUp = view[view.length - 1].c >= view[0].c;
  const lineCls = isUp ? "stroke-emerald-500" : "stroke-rose-500";
  const areaCls = isUp ? "fill-emerald-500/15" : "fill-rose-500/15";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
      <path d={areaD} className={areaCls} />
      <path d={pathD} className={"fill-none " + lineCls} strokeWidth={1.5} />
    </svg>
  );
}

// windowReturn 已搬到 src/lib/priceWindow.ts
