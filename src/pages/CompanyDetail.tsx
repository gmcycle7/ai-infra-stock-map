import { Link, useParams } from "react-router-dom";
import { companies, companyById } from "../data/companies";
import { categoryBySlug } from "../data/categories";
import { CategoryBadge, ConfidenceBadge, MarketBadge, PositionBadge, ScoreBadge, Tag } from "../components/Badge";
import { MoatRadar, RiskBars } from "../components/MoatChart";
import { valuationLabels } from "../lib/utils";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="muted text-xs font-medium uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

export function CompanyDetailPage() {
  const { id } = useParams();
  const co = id ? companyById[id] : undefined;
  if (!co) {
    return (
      <div className="card p-6 text-center">
        找不到公司。<Link className="text-brand-600 underline" to="/companies">回到公司列表</Link>
      </div>
    );
  }

  const competitorsLinked = co.competitors.map((c) => {
    const found = companies.find((x) => x.name.includes(c) || x.nameEn.includes(c) || x.id === c.toLowerCase());
    return { label: c, id: found?.id };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{co.name}</h1>
            <div className="muted text-sm">{co.nameEn}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {co.ticker}
              </span>
              <MarketBadge market={co.market} />
              <PositionBadge pos={co.supplyChainPosition} />
              <ScoreBadge score={co.aiImportanceScore} />
              <ConfidenceBadge level={co.confidenceLevel} />
            </div>
          </div>
          <div className="text-right text-xs muted">
            最後更新：{co.lastUpdated}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {co.category.map((slug) => {
            const c = categoryBySlug[slug];
            return c ? <CategoryBadge key={slug} label={c.nameZh} color={c.color} /> : null;
          })}
        </div>
      </header>

      {/* Facts */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card space-y-4 p-5">
          <Field label="這家公司在做什麼">{co.whatTheyDo}</Field>
          <Field label="主要產品">
            <ul className="list-disc space-y-0.5 pl-5">
              {co.coreProducts.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Field>
          <Field label="為什麼跟 AI 有關">{co.aiRelevance}</Field>
          <Field label="主要客戶 / 生態系">{co.keyCustomersOrEcosystem}</Field>
        </div>
        <div className="card space-y-4 p-5">
          <Field label="相對競爭對手的最大優勢">{co.competitiveAdvantage}</Field>
          <Field label="主要競爭對手">
            <div className="flex flex-wrap gap-1.5">
              {competitorsLinked.map((c) =>
                c.id ? (
                  <Link
                    key={c.label}
                    to={`/company/${c.id}`}
                    className="chip border-slate-300 bg-white hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span key={c.label} className="chip border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    {c.label}
                  </span>
                ),
              )}
            </div>
          </Field>
          <Field label="主要風險">
            <ul className="list-disc space-y-0.5 pl-5">
              {co.risks.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </Field>
          <Field label="估值敏感度">
            <div className="flex flex-wrap gap-1.5">
              {co.valuationSensitivity.map((v) => (
                <span
                  key={v}
                  className="chip border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300"
                >
                  {valuationLabels[v] ?? v}
                </span>
              ))}
            </div>
          </Field>
        </div>
      </section>

      {/* Tags & Keywords */}
      <section className="card space-y-3 p-5">
        <Field label="技術關鍵字">
          <div className="flex flex-wrap gap-1.5">
            {co.technicalKeywords.map((k) => (
              <span
                key={k}
                className="chip border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {k}
              </span>
            ))}
          </div>
        </Field>
        <Field label="標籤">
          <div className="flex flex-wrap gap-1">
            {co.tags.map((t) => <Tag key={t} label={t} />)}
          </div>
        </Field>
      </section>

      {/* Moat radar + Risk bars */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="section-title">技術 / 商業護城河（0-5）</h2>
          <div className="muted mt-1 text-xs">主觀評分，用於跨公司比較參考。</div>
          <div className="mt-3 flex justify-center">
            <MoatRadar moat={co.moat} />
          </div>
        </div>
        <div className="card p-5">
          <h2 className="section-title">風險地圖（0-5，分數越高風險越大）</h2>
          <div className="muted mt-1 text-xs">主觀評分，用於提示需要關注的維度。</div>
          <div className="mt-3"><RiskBars risk={co.risk} /></div>
        </div>
      </section>

      {/* Analyst view + SerDes angle */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {co.analystView && (
          <div className="card border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
            <h2 className="section-title">分析師觀點（主觀）</h2>
            <p className="mt-2 text-sm text-slate-800 dark:text-slate-100">{co.analystView}</p>
            <p className="muted mt-3 text-xs">
              此欄位為主觀分析，與其他事實欄位分開，請自行判斷。
            </p>
          </div>
        )}
        {co.serdesAngle && (
          <div className="card border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-800 dark:bg-indigo-950/30">
            <h2 className="section-title">給 SerDes / 高速介面工程師的視角</h2>
            <p className="mt-2 text-sm text-slate-800 dark:text-slate-100">{co.serdesAngle}</p>
          </div>
        )}
      </section>

      {/* Market data placeholder */}
      <section className="card p-5">
        <h2 className="section-title">市場資料（需即時 API）</h2>
        <p className="muted mt-1 text-xs">
          為避免使用過時數字，本網站不硬編價格與市值；以下欄位待串接即時資料源。
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          {[
            ["市值 Market Cap", co.marketData?.marketCap],
            ["本益比 P/E", co.marketData?.peRatio],
            ["營收成長率 Rev Growth", co.marketData?.revenueGrowth],
            ["毛利率 Gross Margin", co.marketData?.grossMargin],
            ["股價 Price", co.marketData?.stockPrice],
            ["年初至今報酬 YTD", co.marketData?.ytdReturn],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-dashed border-slate-300 p-3 dark:border-slate-700">
              <div className="muted text-xs">{label}</div>
              <div className="font-mono text-xs italic text-slate-500 dark:text-slate-400">
                {value ?? "requires live API"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="card p-5">
        <h2 className="section-title">資料來源</h2>
        {co.sourceUrls.length === 0 ? (
          <p className="muted mt-2 text-sm">無公開來源。Confidence 等級已標示。</p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {co.sourceUrls.map((u) => (
              <li key={u}>
                <a
                  href={u}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline dark:text-brand-400"
                >
                  {u}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="muted text-right text-xs">
        資料整理：{co.lastUpdated} | 信心：{co.confidenceLevel}
      </div>
    </div>
  );
}
