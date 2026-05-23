import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { allKpis } from "../lib/kpi";
import { getQuote } from "../services/marketData";
import { windowReturn } from "../lib/priceWindow";
import { pearson, rInterpretation, type CorrelationStats } from "../lib/correlation";
import type { InvestmentKpi } from "../types";

// 可選的 KPI horizon
const KPI_OPTIONS: Array<{ key: keyof InvestmentKpi; label: string }> = [
  { key: "shortTermScore", label: "短期催化分數" },
  { key: "threeYearScore", label: "三年成長分數" },
  { key: "fiveYearScore", label: "五年護城河分數" },
  { key: "tenYearScore", label: "十年結構性分數" },
  { key: "riskScore", label: "風險分數（理論上 vs. 實際波動）" },
];

// 可選的實際報酬窗口
const RETURN_OPTIONS: Array<{ days: number; label: string }> = [
  { days: 30, label: "1 個月實際報酬" },
  { days: 90, label: "3 個月實際報酬" },
  { days: 180, label: "6 個月實際報酬" },
  { days: 252, label: "1 年實際報酬" },
  { days: 504, label: "2 年實際報酬" },
];

interface Point {
  id: string;
  name: string;
  kpi: number;
  ret: number;
}

export function KpiValidationPage() {
  const [kpiKey, setKpiKey] = useState<keyof InvestmentKpi>("shortTermScore");
  const [returnDays, setReturnDays] = useState<number>(180);

  const points = useMemo<Point[]>(() => {
    const out: Point[] = [];
    for (const { company, kpi } of allKpis()) {
      const q = getQuote(company.id);
      if (!q || !q.history || q.history.length < 30) continue;
      const r = windowReturn(q.history, returnDays);
      if (r == null) continue;
      const v = kpi[kpiKey];
      if (typeof v !== "number") continue;
      out.push({ id: company.id, name: company.name, kpi: v, ret: r });
    }
    return out;
  }, [kpiKey, returnDays]);

  const stats = useMemo(
    () => pearson(points.map((p) => p.kpi), points.map((p) => p.ret)),
    [points],
  );

  // 找最大的「正驚喜」與「負驚喜」（殘差最大者）
  const surprises = useMemo<{ best: (Point & { residual: number })[]; worst: (Point & { residual: number })[] }>(() => {
    if (!stats) return { best: [], worst: [] };
    const withResid = points.map((p) => {
      const expected = stats.slope * p.kpi + stats.intercept;
      const residual = p.ret - expected;
      return { ...p, residual };
    });
    const sorted = [...withResid].sort((a, b) => b.residual - a.residual);
    return {
      best: sorted.slice(0, 5), // 表現超越 KPI 預測
      worst: sorted.slice(-5).reverse(), // 表現低於 KPI 預測
    };
  }, [points, stats]);

  return (
    <div className="space-y-6">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">KPI 驗證：分數 vs 實際報酬</h1>
        <p className="muted mt-2 text-sm">
          老實檢驗：我給的 KPI 分數，是否能在過去實際解釋股價漲跌？
          下方用 Pearson 相關係數 (r) 與線性迴歸測試。
          r² 是「KPI 解釋的變異比例」 — 1.0 = 完美預測、0 = 完全無預測力。
        </p>

        <div className="muted mt-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <strong>三個必須注意的事：</strong>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>
              <strong>過去績效不代表未來</strong> — 即使 r 高，也只能說明「KPI 與過去報酬相關」，不能說明未來會繼續。
            </li>
            <li>
              <strong>循環論證風險</strong> — KPI 中「熱門類別 +1」、「估值高 → 市場情緒高」這些
              本質上已經內含「股價已上漲」資訊，所以正相關不算意外。
            </li>
            <li>
              <strong>選股偏差</strong> — 60+ 家全是「我已認為 AI 相關」的公司，無對照組（例如沒納入毫無 AI 暴險的傳產股），
              所以 r 會被收斂。
            </li>
          </ol>
        </div>
      </header>

      <section className="card space-y-4 p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="block flex-1">
            <span className="muted mb-1 block text-xs">KPI 分數</span>
            <select
              className="input"
              value={kpiKey as string}
              onChange={(e) => setKpiKey(e.target.value as keyof InvestmentKpi)}
            >
              {KPI_OPTIONS.map((o) => (
                <option key={o.key as string} value={o.key as string}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block flex-1">
            <span className="muted mb-1 block text-xs">實際報酬窗口</span>
            <select
              className="input"
              value={returnDays}
              onChange={(e) => setReturnDays(Number(e.target.value))}
            >
              {RETURN_OPTIONS.map((o) => (
                <option key={o.days} value={o.days}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ScatterPlot points={points} stats={stats} />

        {stats ? (
          <StatsPanel stats={stats} />
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            資料不足無法計算相關係數
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SurpriseCard
          title="正面驚喜（實際漲幅 > KPI 預期）"
          subtitle="KPI 可能低估這些公司，或它們有 KPI 沒抓到的催化"
          list={surprises.best}
          positive
        />
        <SurpriseCard
          title="負面驚喜（實際漲幅 < KPI 預期）"
          subtitle="KPI 可能高估這些公司，或它們有 KPI 沒抓到的逆風"
          list={surprises.worst}
        />
      </section>

      <section className="card p-5 text-xs">
        <h2 className="section-title text-base">我的誠實結論</h2>
        <ul className="muted mt-2 list-disc space-y-1 pl-5">
          <li>
            如果你看到 <strong>r &gt; 0.5</strong>：KPI 在這個窗口下有解釋力，
            但要記得「循環論證」風險。
          </li>
          <li>
            如果你看到 <strong>r &lt; 0.3</strong>：KPI 與該窗口報酬關係不大，
            這完全正常 — 短期股價受太多因素影響（情緒、流動性、財報意外）。
          </li>
          <li>
            最有用的看法：把這頁當作「KPI 的反向校驗」。
            負驚喜公司值得單獨研究：是否 KPI 漏抓什麼風險？
          </li>
          <li>
            <Link to="/kpi-method" className="text-brand-600 hover:underline dark:text-brand-400">
              KPI 公式說明
            </Link>{" "}
            ｜{" "}
            <Link to="/scoring-rubric" className="text-brand-600 hover:underline dark:text-brand-400">
              moat / risk 原始分數打法
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

function ScatterPlot({
  points,
  stats,
}: {
  points: Point[];
  stats: CorrelationStats | null;
}) {
  const W = 900;
  const H = 360;
  const PAD_L = 56;
  const PAD_R = 16;
  const PAD_T = 12;
  const PAD_B = 36;

  if (points.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        無資料
      </div>
    );
  }

  const ys = points.map((p) => p.ret);
  const xMin = 0;
  const xMax = 100;
  const yMin = Math.min(...ys, 0) - 5;
  const yMax = Math.max(...ys, 0) + 5;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const xOf = (v: number) => PAD_L + ((v - xMin) / (xMax - xMin)) * innerW;
  const yOf = (v: number) => PAD_T + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  // Y axis ticks (5)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => yMin + (yMax - yMin) * t);
  const xTicks = [0, 25, 50, 75, 100];

  // 迴歸線
  const regressionLine = stats ? (
    <line
      x1={xOf(0)}
      y1={yOf(stats.intercept)}
      x2={xOf(100)}
      y2={yOf(stats.intercept + stats.slope * 100)}
      className="stroke-brand-600 dark:stroke-brand-400"
      strokeWidth={2}
      strokeDasharray="4 3"
    />
  ) : null;

  // Y=0 線
  const zeroLine = (
    <line
      x1={PAD_L}
      x2={W - PAD_R}
      y1={yOf(0)}
      y2={yOf(0)}
      className="stroke-slate-300 dark:stroke-slate-700"
      strokeWidth={1}
    />
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Grid */}
      {yTicks.map((t, i) => (
        <g key={"y" + i}>
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={yOf(t)}
            y2={yOf(t)}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeDasharray="2 2"
          />
          <text
            x={PAD_L - 6}
            y={yOf(t)}
            textAnchor="end"
            dominantBaseline="central"
            className="fill-slate-500 text-[10px]"
          >
            {t.toFixed(0)}%
          </text>
        </g>
      ))}
      {xTicks.map((t, i) => (
        <g key={"x" + i}>
          <line
            x1={xOf(t)}
            x2={xOf(t)}
            y1={PAD_T}
            y2={PAD_T + innerH}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeDasharray="2 2"
          />
          <text
            x={xOf(t)}
            y={H - 20}
            textAnchor="middle"
            className="fill-slate-500 text-[10px]"
          >
            {t}
          </text>
        </g>
      ))}
      {zeroLine}

      {/* Regression line */}
      {regressionLine}

      {/* Axis labels */}
      <text
        x={PAD_L + innerW / 2}
        y={H - 4}
        textAnchor="middle"
        className="fill-slate-600 text-[11px] dark:fill-slate-300"
      >
        KPI 分數 (0-100)
      </text>
      <text
        x={12}
        y={PAD_T + innerH / 2}
        textAnchor="middle"
        className="fill-slate-600 text-[11px] dark:fill-slate-300"
        transform={`rotate(-90, 12, ${PAD_T + innerH / 2})`}
      >
        實際報酬 (%)
      </text>

      {/* Points */}
      {points.map((p) => {
        const isUp = p.ret >= 0;
        return (
          <g key={p.id}>
            <circle
              cx={xOf(p.kpi)}
              cy={yOf(p.ret)}
              r={5}
              className={isUp ? "fill-emerald-500/70 stroke-emerald-700" : "fill-rose-500/70 stroke-rose-700"}
              strokeWidth={1}
            >
              <title>
                {p.name} | KPI {p.kpi} | 實際 {p.ret.toFixed(1)}%
              </title>
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

function StatsPanel({ stats }: { stats: CorrelationStats }) {
  const interp = rInterpretation(stats.r);
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Stat label="樣本數 n" value={stats.n.toString()} />
      <Stat
        label="Pearson r"
        value={stats.r.toFixed(3)}
        tone={interp.tone}
        sub={interp.label}
      />
      <Stat
        label="r² (解釋力)"
        value={(stats.r2 * 100).toFixed(1) + "%"}
        sub={`KPI 解釋 ${(stats.r2 * 100).toFixed(0)}% 的報酬變異`}
      />
      <Stat
        label="迴歸斜率"
        value={stats.slope.toFixed(3)}
        sub={`KPI +10 → 預期 +${(stats.slope * 10).toFixed(1)}%`}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="muted text-xs">{label}</div>
      <div className={"mt-1 text-2xl font-bold tabular-nums " + (tone ?? "")}>{value}</div>
      {sub && <div className="muted mt-1 text-[10px]">{sub}</div>}
    </div>
  );
}

function SurpriseCard({
  title,
  subtitle,
  list,
  positive = false,
}: {
  title: string;
  subtitle: string;
  list: Array<Point & { residual: number }>;
  positive?: boolean;
}) {
  return (
    <div className="card p-4">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="muted mt-1 text-xs">{subtitle}</p>
      <ol className="mt-3 space-y-1.5 text-sm">
        {list.map((p) => (
          <li key={p.id} className="grid grid-cols-[1fr_auto_auto] items-baseline gap-2">
            <Link className="truncate hover:underline" to={`/company/${p.id}`}>
              {p.name}
            </Link>
            <span className="muted font-mono text-xs">KPI {p.kpi}</span>
            <span
              className={
                "w-16 text-right font-mono text-xs font-semibold tabular-nums " +
                (positive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400")
              }
            >
              {p.ret >= 0 ? "+" : ""}
              {p.ret.toFixed(1)}%
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
