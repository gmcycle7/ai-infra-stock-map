import type { KeyPerson, LeadershipScores } from "../types";
import { leaderCompositeScore } from "../data/keyPeople";

interface Props {
  people: KeyPerson[];
}

const DIM_LABELS: Array<{ key: keyof LeadershipScores; label: string; desc: string }> = [
  { key: "resilience", label: "韌性", desc: "在逆境（產業低谷、巨變）中堅持並調整的能力" },
  { key: "execution", label: "執行力", desc: "把策略落地的紀律與速度" },
  { key: "integrity", label: "正直", desc: "揭露透明、信譽、無重大爭議" },
  { key: "vision", label: "願景", desc: "對產業長期方向的判斷力與布局" },
  { key: "capitalAllocation", label: "資本配置", desc: "M&A / R&D / 買回 / 配息的取捨品質" },
  { key: "communication", label: "溝通透明", desc: "法說會 / IR / 對股東的可預期性" },
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
    // 沒有打分資料，只顯示姓名
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
        <div className="muted text-xs">主觀評分；僅作相對比較</div>
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

            <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-6">
              {DIM_LABELS.map((d) => {
                const v = p.leadership![d.key];
                return (
                  <div
                    key={d.key}
                    className="rounded-md border border-slate-200 p-2 text-center dark:border-slate-700"
                    title={d.desc}
                  >
                    <div className="muted text-[10px]">{d.label}</div>
                    <div className={"mx-auto mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold " + tone(v)}>
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
        <strong>領導力分數如何影響 KPI：</strong>
        綜合分數 ≥ 80：3y/5y/10y KPI 各 +3~6 分、風險 -2 ~ -3；
        ≤ 50：3y/5y/10y KPI 各扣 3-6 分、風險 +2~3。
        以避免主觀過度主導。
      </div>
    </section>
  );
}
