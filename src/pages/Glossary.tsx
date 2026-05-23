import { useMemo, useState } from "react";
import { glossary } from "../data/glossary";
import { categories } from "../data/categories";

export function GlossaryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");

  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return glossary.filter((g) => {
      if (cat && g.category !== cat) return false;
      if (qq) {
        const hay = (g.term + " " + g.termZh + " " + g.shortDef + " " + g.longDef).toLowerCase();
        if (!hay.includes(qq)) return false;
      }
      return true;
    });
  }, [q, cat]);

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">技術名詞解釋</h1>
        <p className="muted mt-1 text-sm">
          以台灣半導體 / SerDes 工程師為主要讀者；常用 GPU、CPU、DPU、LPU、NPU、TPU、ASIC、HBM、CoWoS、SerDes、PAM4、CPO、AEC、ACC、DAC、Optical Module、Retimer、Switch ASIC、NIC、AI Server、ODM、EMS 等都已收錄。
        </p>
      </header>

      <div className="card flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <input
          type="search"
          className="input md:max-w-sm"
          placeholder="搜尋名詞（中英、縮寫）"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="input md:max-w-xs" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">所有分類</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nameZh}
            </option>
          ))}
          <option value="general">通用</option>
        </select>
        <div className="muted text-xs">共 {list.length} 條</div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {list.map((g) => (
          <div key={g.term} className="card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-base font-semibold">{g.term}</span>
                <span className="muted ml-2 text-sm">{g.termZh}</span>
              </div>
              <span className="chip border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {g.category}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
              {g.shortDef}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{g.longDef}</p>
            {g.related.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="muted text-xs">相關：</span>
                {g.related.map((r) => (
                  <span
                    key={r}
                    className="chip border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
