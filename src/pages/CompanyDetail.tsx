import { Link, useParams } from "react-router-dom";
import { companies, companyById } from "../data/companies";
import { categoryBySlug } from "../data/categories";
import { keyPeopleById } from "../data/keyPeople";
import { CategoryBadge, ConfidenceBadge, MarketBadge, PositionBadge, ScoreBadge, Tag } from "../components/Badge";
import { MoatRadar, RiskBars } from "../components/MoatChart";
import { PriceChart } from "../components/PriceChart";
import { KpiPanel } from "../components/KpiPanel";
import { LeadershipPanel } from "../components/LeadershipPanel";
import { AnalystTargetBar } from "../components/AnalystTargetBar";
import { FinancialsPanel } from "../components/FinancialsPanel";
import { PriceDelta } from "../components/PriceDelta";
import { WatchlistStar } from "../components/WatchlistStar";
import { PeerCompare } from "../components/PeerCompare";
import { getKpi } from "../lib/kpi";
import { valuationLabels } from "../lib/utils";
import {
  formatFetchedAt,
  formatMarketCap,
  formatPE,
  formatPrice,
  getQuote,
  lastFetchedAt,
} from "../services/marketData";

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
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <span>{co.name}</span>
              <WatchlistStar id={co.id} />
            </h1>
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

        {/* 掌權人 — 簡短列表（詳細評分在下方的 LeadershipPanel） */}
        {keyPeopleById[co.id] && keyPeopleById[co.id].length > 0 && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-900">
            <div className="muted mb-1 font-semibold uppercase tracking-wide">掌權人 / 創辦人</div>
            <ul className="space-y-1">
              {keyPeopleById[co.id].map((p, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    {p.role}
                  </span>
                  <span className="font-semibold">
                    {p.nameZh ? `${p.nameZh}（${p.name}）` : p.name}
                  </span>
                  {p.since && <span className="muted">自 {p.since}</span>}
                  {p.note && <span className="muted">— {p.note}</span>}
                </li>
              ))}
            </ul>
            <p className="muted mt-2 text-[10px]">
              資料時點：2026-05；任期可能異動，請以最新公告為準。詳細評分見下方領導力評估。
            </p>
          </div>
        )}
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

      {/* Market data */}
      <MarketDataSection companyId={co.id} />

      {/* Financials */}
      <FinancialsSectionWrap companyId={co.id} />

      {/* Investment KPI */}
      <KpiPanel company={co} kpi={getKpi(co)} />

      {/* Leadership assessment */}
      <LeadershipPanel people={keyPeopleById[co.id] ?? []} />

      {/* Peer compare buttons */}
      <PeerCompare company={co} />


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

// ----------------------------------------------------------------------
// 市場資料區塊：讀取 src/data/marketData.json（每日自動更新）
// ----------------------------------------------------------------------
function MarketDataSection({ companyId }: { companyId: string }) {
  const q = getQuote(companyId);

  if (!q || (q.price == null && (!q.history || q.history.length === 0))) {
    return (
      <section className="card p-5">
        <h2 className="section-title">市場資料</h2>
        <p className="muted mt-2 text-sm">
          目前無法從 Yahoo Finance 取得此 ticker 的資料（可能是小型股或代號需確認）。
          {q?.error && <span className="ml-1">錯誤：{q.error}</span>}
        </p>
      </section>
    );
  }

  return (
    <section className="card space-y-5 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title">市場資料</h2>
        <div className="muted text-xs">
          資料更新：{formatFetchedAt(lastFetchedAt)}（每日自動 from Yahoo Finance）
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-7">
        <Cell label="股價" value={formatPrice(q.price, q.currency)} mono />
        <CellDelta label="漲跌幅" pct={q.changePercent} />
        <Cell label="市值" value={formatMarketCap(q.marketCap, q.currency)} mono />
        <Cell label="本益比 P/E (TTM)" value={formatPE(q.trailingPE)} mono />
        <Cell label="預估本益比 Fwd P/E" value={formatPE(q.forwardPE)} mono />
        <Cell label="52 週高" value={formatPrice(q.fiftyTwoWeekHigh, q.currency)} mono />
        <Cell label="52 週低" value={formatPrice(q.fiftyTwoWeekLow, q.currency)} mono />
      </div>

      {/* 歷史價折線（含 1M/3M/6M/1Y/2Y/All 區間切換） */}
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold">歷史股價走勢</h3>
          <span className="muted text-xs">
            日線收盤，hover / 點擊看單日價格
          </span>
        </div>
        <PriceChart data={q.history ?? []} currency={q.currency} />
      </div>

      {/* 分析師目標價 */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">分析師目標價（Wall Street consensus）</h3>
        <AnalystTargetBar quote={q} />
      </div>

      <p className="muted text-xs">
        Ticker on Yahoo: <span className="font-mono">{q.symbol}</span> |
        前日收盤：{formatPrice(q.previousClose, q.currency)} |
        資料來源：Yahoo Finance（透過 GitHub Action 每日抓取，僅供研究參考，非即時報價）
      </p>
    </section>
  );
}

function FinancialsSectionWrap({ companyId }: { companyId: string }) {
  const q = getQuote(companyId);
  if (!q) return null;
  return <FinancialsPanel quote={q} />;
}

function CellDelta({ label, pct }: { label: string; pct: number | null }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="muted text-xs">{label}</div>
      <div className="mt-1"><PriceDelta pct={pct} variant="chip" size="sm" /></div>
    </div>
  );
}

function Cell({
  label,
  value,
  mono = false,
  valueClass = "",
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="muted text-xs">{label}</div>
      <div
        className={
          (mono ? "font-mono " : "") + "mt-1 text-sm font-semibold " + valueClass
        }
      >
        {value}
      </div>
    </div>
  );
}

