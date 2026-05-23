import { cn, marketLabel, positionLabel, confidenceLabel } from "../lib/utils";

export function MarketBadge({ market }: { market: "US" | "Taiwan" | "Private" }) {
  const cls =
    market === "US"
      ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
      : market === "Taiwan"
        ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300"
        : "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";
  return <span className={cn("chip", cls)}>{marketLabel(market)}</span>;
}

export function PositionBadge({ pos }: { pos: "Upstream" | "Midstream" | "Downstream" }) {
  const cls =
    pos === "Upstream"
      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : pos === "Midstream"
        ? "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
        : "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300";
  return <span className={cn("chip", cls)}>{positionLabel(pos)}</span>;
}

export function ConfidenceBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  const cls =
    level === "High"
      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : level === "Medium"
        ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300"
        : "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300";
  return (
    <span className={cn("chip", cls)} title={`資料信心等級：${confidenceLabel(level)}`}>
      信心：{confidenceLabel(level)}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 4
      ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-300"
      : score >= 3
        ? "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300"
        : "border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400";
  return <span className={cn("chip", cls)} title={`AI 重要性評分 ${score}/5`}>AI {score}/5</span>;
}

export function CategoryBadge({ label, color }: { label: string; color?: string }) {
  // 不直接綁 tailwind color string（避免 purge 移除）— 用一組固定的 chip 樣式
  const palettes: Record<string, string> = {
    violet: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300",
    amber: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
    blue: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300",
    sky: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300",
    emerald: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    indigo: "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    orange: "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300",
    cyan: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
    rose: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300",
    yellow: "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    teal: "border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-950 dark:text-teal-300",
    stone: "border-stone-300 bg-stone-50 text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300",
  };
  const c = palettes[color ?? "stone"] ?? palettes.stone;
  return <span className={cn("chip", c)}>{label}</span>;
}

export function Tag({ label }: { label: string }) {
  return (
    <span className="chip border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      #{label}
    </span>
  );
}
