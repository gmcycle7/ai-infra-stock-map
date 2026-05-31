import type { KeyPerson, LeadershipScores } from "../types";
import { LEADERSHIP_LABELS, LEADERSHIP_WEIGHTS } from "../types";
import { leaderCompositeScore } from "../data/keyPeople";

interface Props {
  people: KeyPerson[];
}

// 10 維度依權重高 → 低排序顯示
const DIM_ORDER: Array<keyof LeadershipScores> = [
  "strategicJudgement",
  "execution",
  "capitalAllocation",
  "technicalProductInsight",
  "talentOrganization",
  "integrityGovernance",
  "customerEcosystem",
  "resilience",
  "financialDiscipline",
  "communication",
];

function tone(v: number) {
  if (v >= 4.5) return "bg-emerald-500 text-white";
  if (v >= 3.5) return "bg-emerald-400 text-emerald-950";
  if (v >= 2.5) return "bg-amber-400 text-amber-950";
  if (v >= 1.5) return "bg-rose-400 text-rose-950";
  return "bg-rose-500 text-white";
}

export function LeadershipPanel({ people }: Props) {
  const scored = people.filter((p) => p.leadership);
  if (scored.length === 0) {
    return (
      <section className="card p-4">
        <h2 className="section-title text-base">領導力評估</h2>
        <p className="muted mt-2 text-sm">本公司領導者尚無打分資料（任期短或公開資訊有限）。</p>
        {people.length > 0 && (
          <ul className="muted mt-2 space-y-1 text-xs">
            {people.map((p, i) => (
              <li key={i}>
                <span className="font-mono">{p.role}</span> ·{" "}
                {p.nameZh ? `${p.nameZh}（${p.name}）` : p.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <section className="card space-y-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title">領導力評估</h2>
        <div className="muted text-xs">10 維度加權；主觀評分，僅作相對比較</div>
      </div>

      {scored.map((p, idx) => {
        const composite = leaderCompositeScore(p.leadership!);
        return (
          <div
            key={idx}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {p.role}
                </span>{" "}
                <span className="text-base font-semibold">
                  {p.nameZh ? `${p.nameZh}（${p.name}）` : p.name}
                </span>
                {p.since && (
                  <span className="muted ml-2 text-xs">自 {p.since}</span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="muted text-xs">綜合分數</span>
                <span
                  className={
                    "text-2xl font-bold tabular-nums " +
                    (composite >= 80
                      ? "text-emerald-600 dark:text-emerald-400"
                      : composite >= 65
                        ? "text-sky-600 dark:text-sky-400"
                        : composite >= 50
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400")
                  }
                >
                  {composite}
                </span>
                <span className="muted text-xs">/ 100</span>
              </div>
            </div>

            {p.bio && (
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{p.bio}</p>
            )}

            {/* 10 維度 grid — 響應式：手機 2 列、平板 5 列、桌面 10 列 */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
              {DIM_ORDER.map((d) => {
                const v = p.leadership![d];
                const weight = LEADERSHIP_WEIGHTS[d];
                return (
                  <div
                    key={d}
                    className="rounded-md border border-slate-200 p-2 text-center dark:border-slate-700"
                    title={`${LEADERSHIP_LABELS[d]}（權重 ${(weight * 100).toFixed(0)}%）`}
                  >
                    <div className="muted text-[9px] leading-tight">{LEADERSHIP_LABELS[d]}</div>
                    <div className="muted text-[8px] mt-0.5">{(weight * 100).toFixed(0)}%</div>
                    <div
                      className={
                        "mx-auto mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold " +
                        tone(v)
                      }
                    >
                      {v}
                    </div>
                  </div>
                );
              })}
            </div>

            {p.leadershipConfidence && (
              <div className="muted mt-2 text-[10px]">
                信心：{p.leadershipConfidence}
              </div>
            )}
          </div>
        );
      })}

      <div className="muted rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-[11px] dark:border-amber-900 dark:bg-amber-950/30">
        <strong>權重：</strong>
        戰略判斷力 15%、執行力 15%、資本配置能力 15%、
        技術 / 產品理解力 10%、組織與人才能力 10%、正直與治理 10%、
        客戶與生態系經營 8%、逆風韌性 7%、財務紀律 5%、溝通與市場信任 5%。
        <strong className="ml-1">影響 KPI：</strong>
        綜合 ≥ 80 → 3y/5y/10y +3~6、風險 -2 ~ -3；≤ 50 → 反向。
      </div>
    </section>
  );
}
