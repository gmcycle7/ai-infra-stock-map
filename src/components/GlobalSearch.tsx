import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { companies } from "../data/companies";
import { categories } from "../data/categories";
import { glossary } from "../data/glossary";

type Result =
  | { kind: "company"; id: string; name: string; sub: string; href: string }
  | { kind: "category"; id: string; name: string; sub: string; href: string }
  | { kind: "glossary"; id: string; name: string; sub: string; href: string }
  | { kind: "page"; id: string; name: string; sub: string; href: string };

const PAGES: Array<{ name: string; href: string; sub: string; keywords: string }> = [
  { name: "首頁", href: "/", sub: "Home", keywords: "首頁 home highlights" },
  { name: "公司列表", href: "/companies", sub: "Companies", keywords: "公司列表 companies 篩選" },
  { name: "兩公司比較", href: "/compare", sub: "Compare", keywords: "兩公司比較 compare" },
  { name: "產業熱力圖", href: "/heatmap", sub: "Heatmap", keywords: "熱力圖 heatmap finviz" },
  { name: "投資 KPI 儀表板", href: "/kpi-dashboard", sub: "KPI Dashboard", keywords: "kpi 儀表板 dashboard" },
  { name: "KPI 權重自訂", href: "/kpi-tuning", sub: "KPI Tuning", keywords: "kpi 權重 自訂 tuning slider" },
  { name: "KPI 驗證", href: "/kpi-validation", sub: "KPI Validation", keywords: "kpi 驗證 validation backtest 相關" },
  { name: "資料品質", href: "/data-quality", sub: "Data Quality", keywords: "資料品質 quality 信心" },
  { name: "供應鏈總覽", href: "/supply-chain", sub: "Supply chain", keywords: "供應鏈 supply chain" },
  { name: "瓶頸對照", href: "/bottlenecks", sub: "Bottlenecks", keywords: "瓶頸 bottleneck hbm cowos" },
  { name: "風險地圖", href: "/risk-map", sub: "Risk Map", keywords: "風險 risk" },
  { name: "技術護城河", href: "/moats", sub: "Moats", keywords: "護城河 moat" },
  { name: "原始評分判準", href: "/scoring-rubric", sub: "Scoring Rubric", keywords: "評分 rubric" },
  { name: "領導力判準", href: "/leadership-rubric", sub: "Leadership Rubric", keywords: "領導力 leadership rubric" },
  { name: "KPI 公式", href: "/kpi-method", sub: "KPI Method", keywords: "kpi 公式 method 權重" },
  { name: "技術名詞解釋", href: "/glossary", sub: "Glossary", keywords: "術語 glossary" },
  { name: "我的關注", href: "/watchlist", sub: "Watchlist", keywords: "watchlist 關注 收藏" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function openModal() {
    setQuery("");
    setActiveIdx(0);
    setOpen(true);
  }

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            setQuery("");
            setActiveIdx(0);
          }
          return !o;
        });
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results: Result[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return [];

    const companyRes: Result[] = companies
      .filter((c) => {
        const hay = (
          c.name +
          " " +
          c.nameEn +
          " " +
          c.ticker +
          " " +
          c.tags.join(" ") +
          " " +
          c.technicalKeywords.join(" ")
        ).toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 8)
      .map((c) => ({
        kind: "company" as const,
        id: c.id,
        name: c.name,
        sub: c.ticker + " · " + c.nameEn,
        href: `/company/${c.id}`,
      }));

    const catRes: Result[] = categories
      .filter((c) => {
        const hay = (c.nameZh + " " + c.nameEn + " " + c.technicalKeywords.join(" ")).toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 4)
      .map((c) => ({
        kind: "category" as const,
        id: c.slug,
        name: c.nameZh,
        sub: c.nameEn,
        href: `/category/${c.slug}`,
      }));

    const glossRes: Result[] = glossary
      .filter((g) => {
        const hay = (g.term + " " + g.termZh + " " + g.shortDef).toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 4)
      .map((g) => ({
        kind: "glossary" as const,
        id: g.term,
        name: g.term,
        sub: g.termZh,
        href: `/glossary?q=${encodeURIComponent(g.term)}`,
      }));

    const pageRes: Result[] = PAGES.filter((p) =>
      (p.name + " " + p.sub + " " + p.keywords).toLowerCase().includes(q),
    )
      .slice(0, 4)
      .map((p) => ({
        kind: "page" as const,
        id: p.href,
        name: p.name,
        sub: p.sub,
        href: p.href,
      }));

    return [...companyRes, ...catRes, ...glossRes, ...pageRes];
  }, [query]);

  function go(r: Result) {
    navigate(r.href);
    setOpen(false);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIdx]) go(results[activeIdx]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
        title="全站搜尋（Cmd / Ctrl + K）"
      >
        <span>🔍</span>
        <span className="hidden sm:inline">搜尋 ...</span>
        <kbd className="hidden rounded border border-slate-300 px-1 text-[10px] dark:border-slate-700 sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-[10vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <span className="text-lg">🔍</span>
              <input
                ref={inputRef}
                type="search"
                placeholder="搜尋公司、分類、術語、頁面…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onInputKey}
                className="w-full border-0 bg-transparent text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="muted text-xs"
                title="關閉（Esc）"
              >
                Esc
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {query.length === 0 ? (
                <div className="muted px-3 py-6 text-center text-sm">
                  輸入公司名稱、ticker、分類、術語… <br />
                  快捷鍵：⌘/Ctrl + K 開啟、↑↓ 移動、Enter 跳轉、Esc 關閉
                </div>
              ) : results.length === 0 ? (
                <div className="muted px-3 py-6 text-center text-sm">無結果</div>
              ) : (
                <ul>
                  {results.map((r, i) => (
                    <li key={r.kind + r.id}>
                      <Link
                        to={r.href}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setActiveIdx(i)}
                        className={
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition " +
                          (i === activeIdx
                            ? "bg-brand-50 text-brand-900 dark:bg-brand-950 dark:text-brand-200"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800")
                        }
                      >
                        <span
                          className={
                            "rounded px-1.5 py-0.5 text-[10px] font-semibold " +
                            (r.kind === "company"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                              : r.kind === "category"
                                ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                                : r.kind === "glossary"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300")
                          }
                        >
                          {r.kind === "company" ? "公司" : r.kind === "category" ? "分類" : r.kind === "glossary" ? "術語" : "頁面"}
                        </span>
                        <span className="flex-1 truncate">
                          <span className="font-medium">{r.name}</span>
                          <span className="muted ml-2 text-xs">{r.sub}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
