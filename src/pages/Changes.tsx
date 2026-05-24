import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  buildSnapshot,
  getChangesSinceLastVisit,
  getRecentMovers,
  markVisited,
} from "../lib/recentChanges";
import { useWatchlist } from "../context/watchlistContextValue";
import { lastFetchedAt, formatFetchedAt, formatRecommendation } from "../services/marketData";
import { PriceDelta } from "../components/PriceDelta";

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

export function ChangesPage() {
  const { has } = useWatchlist();
  const [tick, setTick] = useState(0); // 重新 render trigger
  const changes = useMemo(() => getChangesSinceLastVisit(), [tick]);
  const movers = useMemo(() => getRecentMovers(), []);
  const [snapshotJustTaken, setSnapshotJustTaken] = useState(false);

  function markAsRead() {
    markVisited();
    setSnapshotJustTaken(true);
    setTick((t) => t + 1);
  }

  function takeFirstSnapshot() {
    buildSnapshot();
    markVisited();
    setTick((t) => t + 1);
  }

  // 過濾關注名單版本
  const watchPriceChanges = changes?.priceChanges.filter((x) => has(x.id)) ?? [];

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">變動快訊</h1>
            <p className="muted mt-1 text-sm">
              自上次造訪後的變化（價格、分析師目標、評等升降）+ 短期最大移動者。
              快照存在你的瀏覽器，按「標記為已讀」會更新基準。
            </p>
            <p className="muted mt-2 text-[10px]">
              市場資料更新：{formatFetchedAt(lastFetchedAt)}
            </p>
          </div>
          {changes && (
            <button type="button" className="btn btn-primary" onClick={markAsRead}>
              {snapshotJustTaken ? "已標記 ✓" : "標記為已讀"}
            </button>
          )}
        </div>
      </header>

      {!changes ? (
        <section className="card p-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            還沒有上次造訪的快照可比對。
          </p>
          <p className="muted mt-1 text-xs">建立初始快照後，下次造訪會顯示這段期間的變動。</p>
          <button type="button" className="btn btn-primary mt-3" onClick={takeFirstSnapshot}>
            建立初始快照
          </button>
        </section>
      ) : (
        <>
          <p className="muted text-xs">
            上次造訪：<strong>{fmtDate(changes.visitedAt)}</strong>
            （上次看到的市場資料時點：{fmtDate(changes.fetchedAt)}）
          </p>

          {/* 關注公司的變動（特別 highlight） */}
          {watchPriceChanges.length > 0 && (
            <section className="card border-amber-300 bg-amber-50/30 p-4 dark:border-amber-700 dark:bg-amber-950/20">
              <h2 className="section-title text-base">⭐ 你關注的公司有變動</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-amber-100/50 text-left text-xs uppercase text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                    <tr>
                      <th className="px-3 py-2">公司</th>
                      <th className="px-3 py-2 text-right">上次價</th>
                      <th className="px-3 py-2 text-right">現在價</th>
                      <th className="px-3 py-2 text-right">變動</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 dark:divide-amber-900">
                    {watchPriceChanges.map((c) => (
                      <tr key={c.id}>
                        <td className="px-3 py-1.5">
                          <Link to={`/company/${c.id}`} className="font-medium hover:underline">
                            {c.name}
                          </Link>
                          <span className="muted ml-2 text-[10px]">{c.ticker}</span>
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono">{c.from.toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right font-mono font-semibold">{c.to.toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right">
                          <PriceDelta pct={c.pct} variant="chip" size="xs" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 全部價格變動 */}
          <section className="card p-4">
            <h2 className="section-title text-base">
              全部價格變動（{changes.priceChanges.length}）
            </h2>
            <p className="muted mt-1 text-xs">變動 ≥ 0.5% 才列出，依絕對變動排序</p>
            {changes.priceChanges.length === 0 ? (
              <p className="muted mt-3 text-sm">沒有顯著變動。</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2">公司</th>
                      <th className="px-3 py-2 text-right">上次</th>
                      <th className="px-3 py-2 text-right">現在</th>
                      <th className="px-3 py-2 text-right">變動</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {changes.priceChanges.slice(0, 30).map((c) => (
                      <tr key={c.id} className={has(c.id) ? "bg-amber-50/30 dark:bg-amber-950/20" : ""}>
                        <td className="px-3 py-1.5">
                          <Link to={`/company/${c.id}`} className="font-medium hover:underline">
                            {c.name}
                          </Link>
                          {has(c.id) && <span className="ml-1 text-amber-500">★</span>}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono">{c.from.toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right font-mono font-semibold">{c.to.toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right"><PriceDelta pct={c.pct} variant="chip" size="xs" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 分析師目標價變動 */}
          {changes.targetChanges.length > 0 && (
            <section className="card p-4">
              <h2 className="section-title text-base">
                分析師目標價變動（{changes.targetChanges.length}）
              </h2>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2">公司</th>
                      <th className="px-3 py-2 text-right">上次目標</th>
                      <th className="px-3 py-2 text-right">現在目標</th>
                      <th className="px-3 py-2 text-right">調整</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {changes.targetChanges.slice(0, 20).map((c) => (
                      <tr key={c.id} className={has(c.id) ? "bg-amber-50/30 dark:bg-amber-950/20" : ""}>
                        <td className="px-3 py-1.5">
                          <Link to={`/company/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                          {has(c.id) && <span className="ml-1 text-amber-500">★</span>}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono">{c.from.toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right font-mono font-semibold">{c.to.toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right"><PriceDelta pct={c.pct} variant="chip" size="xs" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 評等升降 */}
          {changes.ratingChanges.length > 0 && (
            <section className="card p-4">
              <h2 className="section-title text-base">
                分析師評等升降（{changes.ratingChanges.length}）
              </h2>
              <ul className="mt-3 space-y-1 text-sm">
                {changes.ratingChanges.map((c) => {
                  const fromR = formatRecommendation(c.from);
                  const toR = formatRecommendation(c.to);
                  return (
                    <li key={c.id} className="flex items-baseline gap-2">
                      <Link className="font-medium hover:underline" to={`/company/${c.id}`}>
                        {c.name}
                      </Link>
                      <span className={"text-xs " + fromR.tone}>{fromR.zh}</span>
                      <span className="muted">→</span>
                      <span className={"text-xs font-bold " + toR.tone}>{toR.zh}</span>
                      {has(c.id) && <span className="text-amber-500">★</span>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}

      {/* 與快照無關的「近期最大移動」 */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MoverCard title="本週漲幅最大" rows={movers.weekUp} positive />
        <MoverCard title="本週跌幅最大" rows={movers.weekDown} />
        <MoverCard title="本月漲幅最大" rows={movers.monthUp} positive hint="22 個交易日" />
        <MoverCard title="本月跌幅最大" rows={movers.monthDown} hint="22 個交易日" />
      </section>
    </div>
  );
}

function MoverCard({
  title,
  rows,
  hint,
}: {
  title: string;
  rows: Array<{ id: string; name: string; ticker: string; pct: number }>;
  positive?: boolean;
  hint?: string;
}) {
  const { has } = useWatchlist();
  return (
    <article className="card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="muted text-[10px]">{hint ?? "5 個交易日"}</span>
      </div>
      <ol className="mt-2 divide-y divide-slate-100 text-sm dark:divide-slate-800">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={
              "grid grid-cols-[1.5rem_1fr_auto] items-center gap-2 py-1.5 " +
              (has(r.id) ? "rounded bg-amber-50/30 dark:bg-amber-950/20" : "")
            }
          >
            <span className="text-xs text-slate-400 tabular-nums">{i + 1}.</span>
            <Link to={`/company/${r.id}`} className="truncate font-medium hover:underline">
              {r.name}
              {has(r.id) && <span className="ml-1 text-amber-500">★</span>}
            </Link>
            <PriceDelta pct={r.pct} variant="chip" size="xs" />
          </li>
        ))}
      </ol>
    </article>
  );
}
