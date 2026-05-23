import { Link } from "react-router-dom";
import type { Company, InvestmentKpi } from "../types";
import { horizonLabel } from "../lib/kpi";
import { KpiRadar } from "./KpiRadar";
import { InvestmentTypeBadge } from "./InvestmentTypeBadge";

interface Props {
  company: Company;
  kpi: InvestmentKpi;
}

function tone(v: number) {
  if (v >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (v >= 55) return "text-sky-600 dark:text-sky-400";
  if (v >= 35) return "text-amber-600 dark:text-amber-400";
  return "text-slate-500 dark:text-slate-400";
}

function riskTone(v: number) {
  if (v >= 70) return "text-rose-600 dark:text-rose-400";
  if (v >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}

function ScoreBar({ value, max = 100, risk = false }: { value: number; max?: number; risk?: boolean }) {
  const pct = (value / max) * 100;
  const cls = risk
    ? value >= 70
      ? "bg-rose-500"
      : value >= 50
        ? "bg-amber-500"
        : "bg-emerald-500"
    : value >= 75
      ? "bg-emerald-500"
      : value >= 55
        ? "bg-sky-500"
        : value >= 35
          ? "bg-amber-400"
          : "bg-slate-400";
  return (
    <span className="relative inline-block h-1.5 w-full overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
      <span className={"absolute inset-y-0 left-0 " + cls} style={{ width: pct + "%" }} />
    </span>
  );
}

function Row({ label, value, risk = false }: { label: string; value: number; risk?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-xs">
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
      <span className={"font-mono tabular-nums " + (risk ? riskTone(value) : tone(value))}>
        {value}
      </span>
      <span className="w-24"><ScoreBar value={value} risk={risk} /></span>
    </div>
  );
}

function HorizonCard({
  label,
  score,
  hint,
  small,
}: {
  label: string;
  score: number;
  hint: string;
  small: string;
}) {
  return (
    <div className="card flex flex-col items-center gap-1 p-3 text-center">
      <div className="muted text-[11px]">{label}</div>
      <div className={"text-3xl font-bold tabular-nums " + tone(score)}>{score}</div>
      <div className="text-[11px] font-semibold">{hint}</div>
      <div className="muted text-[10px]">{small}</div>
    </div>
  );
}

export function KpiPanel({ company, kpi }: Props) {
  return (
    <section className="card space-y-5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="section-title">投資 KPI 評分</h2>
          <InvestmentTypeBadge type={kpi.investmentType} />
        </div>
        <div className="muted text-xs">
          1-100 分；產業邏輯推導，<Link to="/kpi-method" className="text-brand-600 hover:underline dark:text-brand-400">看公式</Link>
        </div>
      </div>

      {/* 4 horizon big scores */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <HorizonCard
          label="短期催化（3-12 月）"
          score={kpi.shortTermScore}
          hint={horizonLabel(kpi.shortTermScore, "shortTerm")}
          small="近期動能 / 訂單 / 題材"
        />
        <HorizonCard
          label="三年成長"
          score={kpi.threeYearScore}
          hint={horizonLabel(kpi.threeYearScore, "threeYear")}
          small="AI capex 循環受惠"
        />
        <HorizonCard
          label="五年護城河"
          score={kpi.fiveYearScore}
          hint={horizonLabel(kpi.fiveYearScore, "fiveYear")}
          small="技術 + 生態系 + 客戶黏著"
        />
        <HorizonCard
          label="十年結構性"
          score={kpi.tenYearScore}
          hint={horizonLabel(kpi.tenYearScore, "tenYear")}
          small="不可取代性 + TAM 擴張"
        />
      </div>

      {/* 風險分數 + 領導力 並排 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-900 dark:bg-rose-950/30">
          <div className="flex items-baseline justify-between">
            <div className="text-sm font-semibold">整體風險分數</div>
            <div className={"text-2xl font-bold tabular-nums " + riskTone(kpi.riskScore)}>
              {kpi.riskScore}
            </div>
          </div>
          <div className="muted mt-1 text-xs">
            風險獨立呈現，不混進機會分數；高機會 + 高風險 = 高 beta。
          </div>
        </div>

        <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-3 dark:border-indigo-900 dark:bg-indigo-950/30">
          <div className="flex items-baseline justify-between">
            <div className="text-sm font-semibold">領導力分數</div>
            <div className={"text-2xl font-bold tabular-nums " + (
              kpi.leadershipScore == null
                ? "text-slate-400"
                : kpi.leadershipScore >= 80
                  ? "text-emerald-600 dark:text-emerald-400"
                  : kpi.leadershipScore >= 65
                    ? "text-sky-600 dark:text-sky-400"
                    : kpi.leadershipScore >= 50
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-rose-600 dark:text-rose-400"
            )}>
              {kpi.leadershipScore ?? "—"}
            </div>
          </div>
          <div className="muted mt-1 text-xs">
            {kpi.leadershipAdjustmentApplied && kpi.leadershipNote
              ? kpi.leadershipNote
              : kpi.leadershipScore == null
                ? "領導者資料不足，未調整 KPI"
                : "已套用至 KPI 微調"}
            ｜
            <Link to="/leadership-rubric" className="text-brand-600 hover:underline dark:text-brand-400">看判準</Link>
          </div>
        </div>
      </div>

      {/* 雷達圖 + 細項 */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <h3 className="muted mb-2 text-xs font-semibold uppercase">10 維度雷達</h3>
          <KpiRadar radar={kpi.radar} />
        </div>
        <div className="space-y-3">
          <h3 className="muted text-xs font-semibold uppercase">細項分數（節錄）</h3>
          <div className="space-y-1.5">
            <Row label="AI 相關性" value={kpi.aiRevenueExposure} />
            <Row label="營收成長潛力" value={kpi.revenueGrowthPotential} />
            <Row label="毛利率擴張潛力" value={kpi.marginExpansionPotential} />
            <Row label="技術護城河" value={kpi.technologyMoat} />
            <Row label="生態系鎖定" value={kpi.ecosystemLockIn} />
            <Row label="供應鏈重要性" value={kpi.supplyChainImportance} />
            <Row label="客戶黏著度" value={kpi.customerPenetration} />
            <Row label="不可取代性（10 年）" value={kpi.irreplaceability} />
          </div>
          <h3 className="muted pt-2 text-xs font-semibold uppercase">風險細項</h3>
          <div className="space-y-1.5">
            <Row label="估值風險" value={kpi.valuationRisk} risk />
            <Row label="景氣循環風險" value={kpi.cyclicalityRisk} risk />
            <Row label="客戶集中度" value={kpi.customerConcentrationRisk} risk />
            <Row label="地緣政治風險" value={kpi.geopoliticalRisk} risk />
            <Row label="技術替代風險" value={kpi.technologyDisruptionRisk} risk />
          </div>
        </div>
      </div>

      {/* 摘要 + 警語 */}
      <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30">
        <div className="font-semibold text-amber-900 dark:text-amber-200">分析摘要</div>
        <p className="mt-1 text-slate-800 dark:text-slate-100">{kpi.kpiCommentary}</p>
        <p className="muted mt-2">
          此 KPI 為產業邏輯評分，尚未串接即時財報；營收成長率、EPS、毛利率等財務細節
          需以最新財報為準（標示「需要資料驗證」）。本網站不提供買賣建議。
          <span className="ml-1">公司資料來源：{company.sourceUrls.length} 個。</span>
        </p>
      </div>
    </section>
  );
}
