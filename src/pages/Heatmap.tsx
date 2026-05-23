import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { companies } from "../data/companies";
import { categories } from "../data/categories";
import { getKpi } from "../lib/kpi";
import { getQuote, formatPrice, formatMarketCap } from "../services/marketData";
import { windowReturn } from "../lib/priceWindow";

type Metric = "ret30" | "ret90" | "ret180" | "ret365" | "ret504" | "shortTerm" | "threeYear" | "fiveYear" | "tenYear" | "risk";

const METRICS: Array<{ k: Metric; label: string; risk?: boolean; bipolar?: boolean }> = [
  { k: "ret30", label: "1 個月實際報酬", bipolar: true },
  { k: "ret90", label: "3 個月實際報酬", bipolar: true },
  { k: "ret180", label: "6 個月實際報酬", bipolar: true },
  { k: "ret365", label: "1 年實際報酬", bipolar: true },
  { k: "ret504", label: "2 年實際報酬", bipolar: true },
  { k: "shortTerm", label: "短期催化分數" },
  { k: "threeYear", label: "三年成長分數" },
  { k: "fiveYear", label: "五年護城河分數" },
  { k: "tenYear", label: "十年結構性分數" },
  { k: "risk", label: "風險分數（高 = 紅）", risk: true },
];

interface TileData {
  id: string;
  name: string;
  ticker: string;
  metricValue: number | null;
  size: number; // 0-1, 0.3-1 range
  price: number | null;
  currency: string;
  marketCap: number | null;
}

export function HeatmapPage() {
  const [metric, setMetric] = useState<Metric>("ret90");
  const [sizeBy, setSizeBy] = useState<"importance" | "marketCap">("importance");

  const meta = METRICS.find((m) => m.k === metric)!;

  // 為每個分類生成 tile list
  const byCategory = useMemo(() => {
    const result: Array<{
      slug: string;
      nameZh: string;
      color: string;
      tiles: TileData[];
    }> = [];

    for (const cat of categories) {
      const tiles: TileData[] = companies
        .filter((c) => c.category.includes(cat.slug))
        .map((c) => {
          const q = getQuote(c.id);
          const kpi = getKpi(c);
          let v: number | null = null;
          switch (metric) {
            case "ret30":
              v = q?.history ? windowReturn(q.history, 30) : null;
              break;
            case "ret90":
              v = q?.history ? windowReturn(q.history, 90) : null;
              break;
            case "ret180":
              v = q?.history ? windowReturn(q.history, 180) : null;
              break;
            case "ret365":
              v = q?.history ? windowReturn(q.history, 252) : null;
              break;
            case "ret504":
              v = q?.history ? windowReturn(q.history, 504) : null;
              break;
            case "shortTerm":
              v = kpi.shortTermScore;
              break;
            case "threeYear":
              v = kpi.threeYearScore;
              break;
            case "fiveYear":
              v = kpi.fiveYearScore;
              break;
            case "tenYear":
              v = kpi.tenYearScore;
              break;
            case "risk":
              v = kpi.riskScore;
              break;
          }

          const size =
            sizeBy === "importance"
              ? c.aiImportanceScore / 5
              : q?.marketCap
                ? Math.max(0.3, Math.min(1, Math.log10(q.marketCap) / 13))
                : 0.4;

          return {
            id: c.id,
            name: c.name,
            ticker: c.ticker,
            metricValue: v,
            size,
            price: q?.price ?? null,
            currency: q?.currency ?? "USD",
            marketCap: q?.marketCap ?? null,
          };
        });

      if (tiles.length === 0) continue;
      // 同一分類內依 size 排序
      tiles.sort((a, b) => b.size - a.size);
      result.push({ slug: cat.slug, nameZh: cat.nameZh, color: cat.color, tiles });
    }
    return result;
  }, [metric, sizeBy]);

  function colorFor(v: number | null): string {
    if (v == null) return "bg-slate-200 dark:bg-slate-800";
    if (meta.bipolar) {
      // 正負雙極：綠 ↔ 紅
      if (v > 30) return "bg-emerald-600 text-white";
      if (v > 15) return "bg-emerald-500 text-white";
      if (v > 5) return "bg-emerald-400 text-emerald-950";
      if (v > -5) return "bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
      if (v > -15) return "bg-rose-400 text-rose-950";
      if (v > -30) return "bg-rose-500 text-white";
      return "bg-rose-600 text-white";
    }
    if (meta.risk) {
      // 風險越高越紅
      if (v >= 75) return "bg-rose-600 text-white";
      if (v >= 60) return "bg-rose-500 text-white";
      if (v >= 45) return "bg-amber-500 text-white";
      if (v >= 30) return "bg-amber-400 text-amber-950";
      return "bg-emerald-500 text-white";
    }
    // 非風險：越高越綠
    if (v >= 80) return "bg-emerald-600 text-white";
    if (v >= 65) return "bg-emerald-500 text-white";
    if (v >= 50) return "bg-sky-500 text-white";
    if (v >= 35) return "bg-amber-400 text-amber-950";
    return "bg-slate-400 text-white";
  }

  function fmt(v: number | null): string {
    if (v == null) return "—";
    if (meta.bipolar) return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
    return v.toFixed(0);
  }

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">產業熱力圖</h1>
        <p className="muted mt-1 text-sm">
          類 finviz 的 sector heatmap：依分類分組，每塊代表一家公司。
          顏色 = 選定指標，大小 = AI 重要性或市值。
        </p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <label className="block flex-1">
            <span className="muted mb-1 block text-xs">顏色指標</span>
            <select className="input" value={metric} onChange={(e) => setMetric(e.target.value as Metric)}>
              {METRICS.map((m) => (
                <option key={m.k} value={m.k}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block flex-1">
            <span className="muted mb-1 block text-xs">大小依據</span>
            <select className="input" value={sizeBy} onChange={(e) => setSizeBy(e.target.value as "importance" | "marketCap")}>
              <option value="importance">AI 重要性 (1-5)</option>
              <option value="marketCap">市值（對數）</option>
            </select>
          </label>
        </div>
      </header>

      {/* Legend */}
      <div className="card p-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="muted">圖例：</span>
          {meta.bipolar ? (
            <>
              <span className="chip bg-rose-600 text-white">&lt; -30%</span>
              <span className="chip bg-rose-400 text-rose-950">-15 ~ -5%</span>
              <span className="chip bg-slate-300 text-slate-700">-5 ~ +5%</span>
              <span className="chip bg-emerald-400 text-emerald-950">+5 ~ +15%</span>
              <span className="chip bg-emerald-600 text-white">&gt; +30%</span>
            </>
          ) : meta.risk ? (
            <>
              <span className="chip bg-emerald-500 text-white">&lt; 30</span>
              <span className="chip bg-amber-400 text-amber-950">30-45</span>
              <span className="chip bg-amber-500 text-white">45-60</span>
              <span className="chip bg-rose-500 text-white">60-75</span>
              <span className="chip bg-rose-600 text-white">&gt; 75</span>
            </>
          ) : (
            <>
              <span className="chip bg-slate-400 text-white">&lt; 35</span>
              <span className="chip bg-amber-400 text-amber-950">35-50</span>
              <span className="chip bg-sky-500 text-white">50-65</span>
              <span className="chip bg-emerald-500 text-white">65-80</span>
              <span className="chip bg-emerald-600 text-white">&gt; 80</span>
            </>
          )}
          <span className="muted ml-2">大小 = {sizeBy === "importance" ? "AI 重要性" : "市值"}</span>
        </div>
      </div>

      {/* Sector grids */}
      <div className="space-y-4">
        {byCategory.map((sec) => (
          <section key={sec.slug} className="card p-4">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <h2 className="text-base font-semibold">
                <Link to={`/category/${sec.slug}`} className="hover:underline">
                  {sec.nameZh}
                </Link>
              </h2>
              <span className="muted text-xs">{sec.tiles.length} 家</span>
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}
            >
              {sec.tiles.map((t) => {
                const minH = 60;
                const maxH = 110;
                const h = minH + (maxH - minH) * t.size;
                return (
                  <Link
                    key={t.id}
                    to={`/company/${t.id}`}
                    className={
                      "flex flex-col justify-between rounded p-2 transition hover:scale-[1.03] " +
                      colorFor(t.metricValue)
                    }
                    style={{ minHeight: h + "px" }}
                    title={`${t.name} (${t.ticker})${t.price != null ? ` | ${formatPrice(t.price, t.currency)}` : ""}${t.marketCap != null ? ` | ${formatMarketCap(t.marketCap, t.currency)}` : ""} | ${meta.label} ${fmt(t.metricValue)}`}
                  >
                    <div className="text-[11px] font-bold leading-tight">{t.name}</div>
                    <div className="text-right text-[15px] font-mono font-bold tabular-nums leading-tight">
                      {fmt(t.metricValue)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="muted text-right text-[10px]">
        資料：Yahoo Finance（每日自動抓取）+ KPI 推導。
        滑鼠 hover tile 可看完整 ticker / 股價 / 市值。
      </div>
    </div>
  );
}
