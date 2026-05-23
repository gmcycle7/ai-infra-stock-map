// Pearson 相關係數 + 線性迴歸
export interface CorrelationStats {
  r: number;
  r2: number;
  slope: number;
  intercept: number;
  n: number;
}

export function pearson(xs: number[], ys: number[]): CorrelationStats | null {
  if (xs.length !== ys.length || xs.length < 3) return null;
  const n = xs.length;
  const meanX = xs.reduce((s, v) => s + v, 0) / n;
  const meanY = ys.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let dx2 = 0;
  let dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  if (denom === 0) return null;
  const r = num / denom;
  const slope = num / dx2;
  const intercept = meanY - slope * meanX;
  return { r, r2: r * r, slope, intercept, n };
}

export function rInterpretation(r: number): { label: string; tone: string } {
  const abs = Math.abs(r);
  if (abs >= 0.7) return { label: "強相關", tone: "text-emerald-700 dark:text-emerald-300" };
  if (abs >= 0.5) return { label: "中等相關", tone: "text-sky-700 dark:text-sky-300" };
  if (abs >= 0.3) return { label: "弱相關", tone: "text-amber-700 dark:text-amber-300" };
  return { label: "幾乎無相關", tone: "text-rose-700 dark:text-rose-300" };
}
