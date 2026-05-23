import { useMemo } from "react";
import { Link } from "react-router-dom";
import { companies } from "../data/companies";
import { getQuote } from "../services/marketData";
import { windowReturn } from "../lib/priceWindow";
import { getKpi } from "../lib/kpi";
import { Sparkline } from "./Sparkline";
import { PriceDelta } from "./PriceDelta";

interface Row {
  id: string;
  name: string;
  ticker: string;
  value: number;
  history: import("../services/marketData").HistoryPoint[];
  currency: string;
}

function buildRow(c: (typeof companies)[number], value: number): Row {
  const q = getQuote(c.id);
  return {
    id: c.id,
    name: c.name,
    ticker: c.ticker,
    value,
    history: q?.history ?? [],
    currency: q?.currency ?? "USD",
  };
}

/**
 * 首頁本週重點：
 *  - 7 日漲幅 / 跌幅 top 5
 *  - 短期催化 KPI top 5
 *  - 風險最高 top 5
 */
export function WeeklyHighlights() {
  const weekUp = useMemo(() => {
    const rows: Row[] = [];
    for (const c of companies) {
      const q = getQuote(c.id);
      const r = q?.history ? windowReturn(q.history, 5) : null;
      if (r != null) rows.push(buildRow(c, r));
    }
    return rows.sort((a, b) => b.value - a.value).slice(0, 5);
  }, []);

  const weekDown = useMemo(() => {
    const rows: Row[] = [];
    for (const c of companies) {
      const q = getQuote(c.id);
      const r = q?.history ? windowReturn(q.history, 5) : null;
      if (r != null) rows.push(buildRow(c, r));
    }
    return rows.sort((a, b) => a.value - b.value).slice(0, 5);
  }, []);

  const shortTermTop = useMemo(() => {
    return companies
      .map((c) => buildRow(c, getKpi(c).shortTermScore))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, []);

  const riskTop = useMemo(() => {
    return companies
      .map((c) => buildRow(c, getKpi(c).riskScore))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <HighlightCard
        title="本週漲幅前 5"
        subtitle="近 5 個交易日"
        rows={weekUp}
        renderValue={(v) => <PriceDelta pct={v} variant="chip" size="xs" />}
      />
      <HighlightCard
        title="本週跌幅前 5"
        subtitle="近 5 個交易日"
        rows={weekDown}
        renderValue={(v) => <PriceDelta pct={v} variant="chip" size="xs" />}
      />
      <HighlightCard
        title="短期催化分數最高"
        subtitle="KPI shortTermScore 排行"
        rows={shortTermTop}
        renderValue={(v) => (
          <span className="font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {Math.round(v)}
          </span>
        )}
      />
      <HighlightCard
        title="整體風險分數最高"
        subtitle="KPI riskScore 排行；高 = 注意"
        rows={riskTop}
        renderValue={(v) => (
          <span className="font-mono font-bold tabular-nums text-rose-600 dark:text-rose-400">
            {Math.round(v)}
          </span>
        )}
      />
    </div>
  );
}

function HighlightCard({
  title,
  subtitle,
  rows,
  renderValue,
}: {
  title: string;
  subtitle: string;
  rows: Row[];
  renderValue: (v: number) => React.ReactNode;
}) {
  return (
    <article className="card flex h-full flex-col gap-2 p-4">
      <header>
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="muted text-[10px]">{subtitle}</div>
      </header>
      <ul className="divide-y divide-slate-100 text-xs dark:divide-slate-800">
        {rows.map((r) => (
          <li
            key={r.id}
            className="grid grid-cols-[1fr_50px_auto] items-center gap-2 py-1.5"
          >
            <Link to={`/company/${r.id}`} className="truncate font-medium hover:underline">
              {r.name}
            </Link>
            <Sparkline data={r.history} width={50} height={18} windowSize={30} />
            <span className="text-right">{renderValue(r.value)}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
