interface Props {
  /** 漲跌幅 (%) */
  pct: number | null;
  /** 顯示樣式：chip 帶背景；inline 純文字 */
  variant?: "chip" | "inline";
  size?: "xs" | "sm";
}

/**
 * 帶箭頭與顏色的漲跌幅顯示。
 * - 上漲 ▲ 綠
 * - 下跌 ▼ 紅
 * - 平盤 / 無資料 — 灰
 */
export function PriceDelta({ pct, variant = "chip", size = "xs" }: Props) {
  if (pct == null) {
    return (
      <span className={"font-mono text-slate-400 " + (size === "xs" ? "text-xs" : "text-sm")}>
        —
      </span>
    );
  }

  const isUp = pct > 0;
  const isFlat = pct === 0;
  const arrow = isFlat ? "—" : isUp ? "▲" : "▼";
  const sign = isUp ? "+" : "";
  const txt = `${arrow} ${sign}${pct.toFixed(2)}%`;
  const sizeCls = size === "xs" ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-0.5";

  if (variant === "inline") {
    const tone = isFlat
      ? "text-slate-500"
      : isUp
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-rose-600 dark:text-rose-400";
    return <span className={"font-mono tabular-nums " + sizeCls + " " + tone}>{txt}</span>;
  }

  const cls = isFlat
    ? "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    : isUp
      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300";
  return (
    <span
      className={
        "inline-flex items-center rounded-md border font-mono font-semibold tabular-nums " +
        sizeCls +
        " " +
        cls
      }
    >
      {txt}
    </span>
  );
}
