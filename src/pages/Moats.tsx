import { Link } from "react-router-dom";
import { companies } from "../data/companies";
import { moatLabels } from "../lib/utils";
import type { MoatDimension } from "../types";

const DIMS: MoatDimension[] = [
  "process",
  "ipDesign",
  "ecosystem",
  "customer",
  "manufacturing",
  "switching",
];

function tone(v: number) {
  if (v >= 5) return "bg-emerald-600 text-white";
  if (v >= 4) return "bg-emerald-500 text-white";
  if (v >= 3) return "bg-emerald-300 text-emerald-900";
  if (v >= 2) return "bg-yellow-300 text-yellow-900";
  if (v >= 1) return "bg-amber-300 text-amber-900";
  return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500";
}

export function MoatsPage() {
  const list = companies
    .slice()
    .sort(
      (a, b) =>
        b.aiImportanceScore - a.aiImportanceScore ||
        DIMS.reduce((s, d) => s + b.moat[d] - a.moat[d], 0),
    );

  return (
    <div className="space-y-6">
      <header className="card p-6">
        <h1 className="text-2xl font-bold tracking-tight">技術 / 商業護城河</h1>
        <p className="muted mt-2 text-sm">
          6 個維度（製程、IP / 設計、生態系、客戶關係、製造規模、轉換成本），
          主觀評分 0-5，用於跨公司比較。
        </p>
      </header>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 bg-slate-50 text-left text-[11px] uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">公司</th>
              <th className="px-3 py-2">代號</th>
              <th className="px-3 py-2 text-center">AI</th>
              {DIMS.map((d) => (
                <th key={d} className="px-2 py-2 text-center">
                  {moatLabels[d]}
                </th>
              ))}
              <th className="px-3 py-2 text-center">總分</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((c) => {
              const total = DIMS.reduce((s, d) => s + c.moat[d], 0);
              return (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-3 py-1.5 font-medium">
                    <Link className="hover:underline" to={`/company/${c.id}`}>
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-3 py-1.5 font-mono text-[10px] text-slate-400">{c.ticker}</td>
                  <td className="px-3 py-1.5 text-center">{c.aiImportanceScore}</td>
                  {DIMS.map((d) => (
                    <td key={d} className="px-2 py-1.5 text-center">
                      <span
                        className={
                          "inline-flex h-7 w-7 items-center justify-center rounded text-[11px] font-semibold " +
                          tone(c.moat[d])
                        }
                      >
                        {c.moat[d]}
                      </span>
                    </td>
                  ))}
                  <td className="px-3 py-1.5 text-center font-semibold">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card p-4 text-xs">
        <div className="font-semibold">評分指引</div>
        <ul className="muted mt-2 list-disc space-y-1 pl-5">
          <li><strong>製程</strong>：自有 / 主導先進製程的能力（如 TSMC、ASML 為 5）。</li>
          <li><strong>IP / 設計</strong>：核心 IP、SerDes、架構設計能力。</li>
          <li><strong>生態系</strong>：軟體 / 工具鏈 / 開發者社群 / 標準制定影響力。</li>
          <li><strong>客戶關係</strong>：與 hyperscaler / 領先客戶的深度。</li>
          <li><strong>製造規模</strong>：自有 / 控制的產能、良率管理。</li>
          <li><strong>轉換成本</strong>：客戶要更換的痛苦程度。</li>
        </ul>
      </div>
    </div>
  );
}
