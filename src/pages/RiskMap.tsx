import { Link } from "react-router-dom";
import { companies } from "../data/companies";
import { riskLabels } from "../lib/utils";
import type { RiskDimension } from "../types";

const DIMS: RiskDimension[] = [
  "nvidiaDependency",
  "memoryCycle",
  "chinaExport",
  "customerConc",
  "capexCycle",
  "valuation",
  "techTransition",
];

function tone(v: number) {
  if (v >= 4) return "bg-rose-500 text-white";
  if (v >= 3) return "bg-amber-500 text-white";
  if (v >= 2) return "bg-yellow-300 text-yellow-900";
  if (v >= 1) return "bg-emerald-300 text-emerald-900";
  return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500";
}

export function RiskMapPage() {
  // 依 AI 重要性排序，後面再依照風險總和呈現
  const list = companies.slice().sort((a, b) => b.aiImportanceScore - a.aiImportanceScore);

  return (
    <div className="space-y-6">
      <header className="card p-6">
        <h1 className="text-2xl font-bold tracking-tight">風險地圖</h1>
        <p className="muted mt-2 text-sm">
          每家公司在 7 個風險維度上的主觀評分（0-5，分數越高表示風險越大）。
          顏色越紅代表風險越集中，請搭配公司詳細頁判讀。
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
                  {riskLabels[d]}
                </th>
              ))}
              <th className="px-3 py-2 text-center">總分</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((c) => {
              const total = DIMS.reduce((s, d) => s + c.risk[d], 0);
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
                          tone(c.risk[d])
                        }
                      >
                        {c.risk[d]}
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
        <div className="font-semibold">顏色解讀</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="chip bg-emerald-300 text-emerald-900">0-1 低</span>
          <span className="chip bg-yellow-300 text-yellow-900">2 偏低</span>
          <span className="chip bg-amber-500 text-white">3 中</span>
          <span className="chip bg-rose-500 text-white">4-5 高</span>
        </div>
        <p className="muted mt-2">
          評分為主觀整理，目的在於提示「該觀察什麼風險」，並非預測。
          特別注意：高 AI 重要性 + 高 Nvidia 依賴 + 高估值的公司，波動度通常會更高。
        </p>
      </div>
    </div>
  );
}
