import { Link, NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Disclaimer } from "./Disclaimer";

const nav: Array<{ to: string; label: string }> = [
  { to: "/", label: "首頁" },
  { to: "/categories", label: "分類總覽" },
  { to: "/companies", label: "公司列表" },
  { to: "/supply-chain", label: "供應鏈總覽" },
  { to: "/bottlenecks", label: "瓶頸對照" },
  { to: "/risk-map", label: "風險地圖" },
  { to: "/moats", label: "技術護城河" },
  { to: "/glossary", label: "技術名詞解釋" },
];

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight">
              AI 基礎建設股票地圖
            </span>
            <span className="muted text-xs">台股 × 美股</span>
          </Link>
          <ThemeToggle />
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
