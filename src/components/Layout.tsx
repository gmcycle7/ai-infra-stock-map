import { Link, NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Disclaimer } from "./Disclaimer";
import { GlobalSearch } from "./GlobalSearch";
import { useWatchlist } from "../context/watchlistContextValue";
import { lastFetchedAt, formatFetchedAt } from "../services/marketData";

const nav: Array<{ to: string; label: string }> = [
  { to: "/", label: "首頁" },
  { to: "/categories", label: "分類總覽" },
  { to: "/companies", label: "公司列表" },
  { to: "/watchlist", label: "我的關注" },
  { to: "/compare", label: "兩公司比較" },
  { to: "/heatmap", label: "產業熱力圖" },
  { to: "/kpi-dashboard", label: "投資 KPI 儀表板" },
  { to: "/kpi-tuning", label: "KPI 權重自訂" },
  { to: "/kpi-validation", label: "KPI 驗證" },
  { to: "/data-quality", label: "資料品質" },
  { to: "/supply-chain", label: "供應鏈總覽" },
  { to: "/bottlenecks", label: "瓶頸對照" },
  { to: "/risk-map", label: "風險地圖" },
  { to: "/moats", label: "技術護城河" },
  { to: "/scoring-rubric", label: "原始評分判準" },
  { to: "/leadership-rubric", label: "領導力判準" },
  { to: "/kpi-method", label: "KPI 公式" },
  { to: "/glossary", label: "技術名詞解釋" },
];

export function Layout() {
  const { ids } = useWatchlist();
  return (
    <div className="flex min-h-screen flex-col">
      {/* Global data-freshness banner */}
      <div className="border-b border-slate-200 bg-slate-100 px-4 py-1 text-center text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        📊 市場資料更新：<strong>{formatFetchedAt(lastFetchedAt)}</strong>（每日台北 06:00 自動抓 Yahoo Finance）
        · 僅供研究，不構成投資建議
      </div>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight">
              AI 基礎建設股票地圖
            </span>
            <span className="muted text-xs">台股 × 美股</span>
          </Link>
          <div className="flex items-center gap-2">
            <GlobalSearch />
            {ids.length > 0 && (
              <Link
                to="/watchlist"
                className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300"
              >
                ★ {ids.length}
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
        <nav className="border-t border-slate-100 dark:border-slate-900">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-x-1 gap-y-1 overflow-x-auto px-2 py-2 text-sm">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  [
                    "rounded-md px-3 py-1.5 transition",
                    isActive
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                  ].join(" ")
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl space-y-3 px-4 text-xs text-slate-500 dark:text-slate-400">
          <Disclaimer />
          <p>
            資料整理：2026-05-24。所有市值、本益比、股價等市場資料一律標示
            <strong> requires live API </strong>，請以即時資料來源為準。
          </p>
        </div>
      </footer>
    </div>
  );
}
