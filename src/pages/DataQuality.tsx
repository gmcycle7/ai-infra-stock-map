import { Link } from "react-router-dom";
import { companies } from "../data/companies";
import { categoryBySlug } from "../data/categories";
import { getQuote, lastFetchedAt, formatFetchedAt } from "../services/marketData";
import { ConfidenceBadge, MarketBadge } from "../components/Badge";
import { keyPeopleById } from "../data/keyPeople";
import { getKpi } from "../lib/kpi";
import { CsvButton } from "../components/CsvButton";
import { toCsv, todayIso } from "../lib/csv";

interface Issue {
  type: "missing-price" | "missing-financial" | "low-confidence" | "missing-leader" | "missing-source" | "old-fetch";
  level: "warn" | "info";
  message: string;
}

function auditCompany(c: (typeof companies)[number]): Issue[] {
  const issues: Issue[] = [];
  const q = getQuote(c.id);
  const kpi = getKpi(c);
  const leaders = keyPeopleById[c.id];

  if (!q || q.price == null) {
    issues.push({ type: "missing-price", level: "warn", message: "無 Yahoo 即時股價" });
  } else if (q.grossMargin == null && q.profitMargin == null) {
    issues.push({ type: "missing-financial", level: "warn", message: "無詳細財務（毛利、淨利）" });
  } else if (q.revenueGrowthYoY == null) {
    issues.push({ type: "missing-financial", level: "info", message: "無營收 YoY 資料" });
  }

  if (c.confidenceLevel === "Low") {
    issues.push({ type: "low-confidence", level: "warn", message: "Confidence: Low（資料偏推測）" });
  } else if (c.confidenceLevel === "Medium") {
    issues.push({ type: "low-confidence", level: "info", message: "Confidence: Medium" });
  }

  if (!leaders || leaders.length === 0) {
    issues.push({ type: "missing-leader", level: "info", message: "無掌權人資料" });
  } else {
    const scored = leaders.filter((p) => p.leadership);
    if (scored.length === 0) {
      issues.push({ type: "missing-leader", level: "info", message: "掌權人無評分" });
    }
  }

  if (kpi.leadershipScore == null) {
    // 已被 missing-leader 涵蓋，跳過
  }

  if (c.sourceUrls.length < 2) {
    issues.push({ type: "missing-source", level: "info", message: `僅 ${c.sourceUrls.length} 個來源` });
  }

  return issues;
}

const TYPE_LABELS: Record<Issue["type"], string> = {
  "missing-price": "缺股價",
  "missing-financial": "缺財務",
  "low-confidence": "低信心",
  "missing-leader": "缺領導力",
  "missing-source": "缺來源",
  "old-fetch": "資料過舊",
};

export function DataQualityPage() {
  const all = companies.map((c) => ({
    company: c,
    issues: auditCompany(c),
  }));

  // 統計
  const totalCompanies = companies.length;
  const withPrice = all.filter((x) => !x.issues.some((i) => i.type === "missing-price")).length;
  const withFinancials = all.filter(
    (x) => !x.issues.some((i) => i.type === "missing-financial" && i.level === "warn"),
  ).length;
  const highConfidence = companies.filter((c) => c.confidenceLevel === "High").length;
  const mediumConfidence = companies.filter((c) => c.confidenceLevel === "Medium").length;
  const lowConfidence = companies.filter((c) => c.confidenceLevel === "Low").length;
  const withLeader = companies.filter(
    (c) => keyPeopleById[c.id] && keyPeopleById[c.id].some((p) => p.leadership),
  ).length;

  // 依問題分組
  const byType: Record<Issue["type"], typeof all> = {
    "missing-price": [],
    "missing-financial": [],
    "low-confidence": [],
    "missing-leader": [],
    "missing-source": [],
    "old-fetch": [],
  };
  all.forEach((x) => {
    x.issues.forEach((i) => byType[i.type].push(x));
  });

  // 排序：問題多 → 問題少
  const sorted = [...all].sort((a, b) => {
    const wa = a.issues.filter((i) => i.level === "warn").length;
    const wb = b.issues.filter((i) => i.level === "warn").length;
    if (wa !== wb) return wb - wa;
    return b.issues.length - a.issues.length;
  });

  const csv = toCsv(
    all.map((x) => ({
      name: x.company.name,
      ticker: x.company.ticker,
      market: x.company.market,
      confidence: x.company.confidenceLevel,
      sourceCount: x.company.sourceUrls.length,
      issues: x.issues.map((i) => `[${i.level}]${TYPE_LABELS[i.type]}:${i.message}`).join(" / "),
    })),
  );

  return (
    <div className="space-y-6">
      <header className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">資料品質報告</h1>
            <p className="muted mt-2 text-sm">
              一頁看出網站哪些公司資料較弱、信心較低；幫你校準對不同部分的信任度。
              這是我能做的最誠實的「告訴你哪裡可能錯」設計。
            </p>
          </div>
          <CsvButton
            filename={`data-quality-${todayIso()}.csv`}
            csv={csv}
            label="匯出 CSV"
          />
        </div>
        <div className="muted mt-3 text-xs">
          市場資料更新：{formatFetchedAt(lastFetchedAt)}
        </div>
      </header>

      {/* 高階統計 */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="收錄公司" value={totalCompanies.toString()} sub="總數" />
        <Stat
          label="有股價"
          value={`${withPrice}/${totalCompanies}`}
          sub={`${((withPrice / totalCompanies) * 100).toFixed(0)}% 覆蓋率`}
          tone="text-emerald-600 dark:text-emerald-400"
        />
        <Stat
          label="有財務"
          value={`${withFinancials}/${totalCompanies}`}
          sub={`${((withFinancials / totalCompanies) * 100).toFixed(0)}% 完整度`}
          tone="text-sky-600 dark:text-sky-400"
        />
        <Stat
          label="領導力打分"
          value={`${withLeader}/${totalCompanies}`}
          sub={`${((withLeader / totalCompanies) * 100).toFixed(0)}% 覆蓋率`}
          tone="text-amber-600 dark:text-amber-400"
        />
      </section>

      <section className="grid grid-cols-3 gap-3">
        <Stat
          label="High Confidence"
          value={highConfidence.toString()}
          tone="text-emerald-600 dark:text-emerald-400"
          sub="多來源驗證"
        />
        <Stat
          label="Medium Confidence"
          value={mediumConfidence.toString()}
          tone="text-amber-600 dark:text-amber-400"
          sub="部分依推論"
        />
        <Stat
          label="Low Confidence"
          value={lowConfidence.toString()}
          tone="text-rose-600 dark:text-rose-400"
          sub="需特別查證"
        />
      </section>

      {/* 各問題的清單 */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {(["missing-price", "missing-financial", "low-confidence", "missing-leader"] as Issue["type"][]).map(
          (t) => {
            const list = byType[t];
            if (list.length === 0) return null;
            return (
              <article key={t} className="card p-4">
                <h3 className="font-semibold">
                  {TYPE_LABELS[t]} <span className="muted text-xs">{list.length} 家</span>
                </h3>
                <ul className="mt-2 space-y-1 text-xs">
                  {list.slice(0, 15).map((x) => (
                    <li key={x.company.id} className="flex items-baseline gap-2">
                      <Link
                        to={`/company/${x.company.id}`}
                        className="font-medium hover:underline"
                      >
                        {x.company.name}
                      </Link>
                      <span className="muted">{x.company.ticker}</span>
                      <MarketBadge market={x.company.market} />
                    </li>
                  ))}
                  {list.length > 15 && (
                    <li className="muted">…還有 {list.length - 15} 家</li>
                  )}
                </ul>
              </article>
            );
          },
        )}
      </section>

      {/* 完整列表 */}
      <section className="card p-4">
        <h2 className="section-title text-base">所有公司資料品質明細</h2>
        <p className="muted mt-1 text-xs">依「警告數」由多到少排序。</p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-left text-[11px] uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">公司</th>
                <th className="px-3 py-2">分類</th>
                <th className="px-3 py-2">市場</th>
                <th className="px-3 py-2">Confidence</th>
                <th className="px-3 py-2">來源數</th>
                <th className="px-3 py-2">問題</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sorted.map((x) => (
                <tr key={x.company.id}>
                  <td className="px-3 py-1.5">
                    <Link
                      className="font-medium hover:underline"
                      to={`/company/${x.company.id}`}
                    >
                      {x.company.name}
                    </Link>
                  </td>
                  <td className="px-3 py-1.5 text-[10px] muted">
                    {x.company.category
                      .slice(0, 2)
                      .map((s) => categoryBySlug[s]?.nameZh ?? s)
                      .join(", ")}
                  </td>
                  <td className="px-3 py-1.5"><MarketBadge market={x.company.market} /></td>
                  <td className="px-3 py-1.5"><ConfidenceBadge level={x.company.confidenceLevel} /></td>
                  <td className="px-3 py-1.5 text-center font-mono">{x.company.sourceUrls.length}</td>
                  <td className="px-3 py-1.5">
                    {x.issues.length === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">✓ 完整</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {x.issues.map((i, k) => (
                          <span
                            key={k}
                            className={
                              "chip text-[10px] " +
                              (i.level === "warn"
                                ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                : "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300")
                            }
                            title={i.message}
                          >
                            {TYPE_LABELS[i.type]}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-5 text-xs">
        <h2 className="section-title text-base">怎麼使用這頁</h2>
        <ul className="muted mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>High confidence + 完整財務</strong>：可放心參考 KPI 排名（但仍非預測）
          </li>
          <li>
            <strong>Medium confidence</strong>：建議讀詳細頁的「分析師觀點」+ 來源連結後再判斷
          </li>
          <li>
            <strong>Low confidence 或缺財務</strong>：當作「產業地圖」用，財務細節以公司 IR 為準
          </li>
          <li>
            <strong>缺領導力評分</strong>：通常是任期短或公開資訊有限；不代表領導者不好，只是我沒打分
          </li>
        </ul>
      </section>
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
    <div className="card p-4">
      <div className="muted text-xs">{label}</div>
      <div className={"mt-1 text-2xl font-bold tabular-nums " + (tone ?? "")}>{value}</div>
      {sub && <div className="muted mt-1 text-[10px]">{sub}</div>}
    </div>
  );
}
