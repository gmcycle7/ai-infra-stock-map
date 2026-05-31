import { useEffect, useState, useCallback } from "react";
import { lastFetchedAt, formatFetchedAt } from "../services/marketData";
import {
  REPO_URLS,
  getStoredToken,
  setStoredToken,
  triggerWorkflow,
  listRecentRuns,
  verifyToken,
  type WorkflowRun,
} from "../lib/githubActions";

function daysAgo(iso: string): { days: number; label: string; tone: string } {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor(ms / (60 * 60 * 1000));
  if (days >= 7) return { days, label: `${days} 天前`, tone: "text-rose-600 dark:text-rose-400" };
  if (days >= 3) return { days, label: `${days} 天前`, tone: "text-amber-600 dark:text-amber-400" };
  if (days >= 1) return { days, label: `${days} 天前`, tone: "text-sky-600 dark:text-sky-400" };
  if (hours >= 1) return { days: 0, label: `${hours} 小時前`, tone: "text-emerald-600 dark:text-emerald-400" };
  return { days: 0, label: "剛剛", tone: "text-emerald-600 dark:text-emerald-400" };
}

function fmtStatus(r: WorkflowRun): { label: string; tone: string } {
  if (r.status === "completed") {
    if (r.conclusion === "success") return { label: "成功", tone: "text-emerald-600 dark:text-emerald-400" };
    if (r.conclusion === "failure") return { label: "失敗", tone: "text-rose-600 dark:text-rose-400" };
    return { label: r.conclusion ?? "結束", tone: "text-slate-600 dark:text-slate-300" };
  }
  if (r.status === "in_progress") return { label: "執行中…", tone: "text-sky-600 dark:text-sky-400" };
  if (r.status === "queued") return { label: "排隊中…", tone: "text-amber-600 dark:text-amber-400" };
  return { label: r.status, tone: "text-slate-500" };
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
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

export function UpdateDataPage() {
  const [token, setToken] = useState(getStoredToken());
  const [tokenInput, setTokenInput] = useState("");
  const [tokenStatus, setTokenStatus] = useState<{ login: string; scopes: string } | null>(null);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const refreshRuns = useCallback(async () => {
    if (!getStoredToken()) return;
    try {
      const list = await listRecentRuns(5);
      setRuns(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  // 載入時驗證 token + 抓 runs（cancelled flag 避免 unmount 後 setState）
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const s = await verifyToken();
        if (!cancelled) setTokenStatus(s);
      } catch (e) {
        if (!cancelled) {
          setError(String(e));
          setTokenStatus(null);
        }
      }
      try {
        const list = await listRecentRuns(5);
        if (!cancelled) setRuns(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // 若有進行中的 run，每 5 秒輪詢
  useEffect(() => {
    if (!token) return;
    const hasRunning = runs.some((r) => r.status !== "completed");
    if (!hasRunning) return;
    const id = setInterval(() => {
      refreshRuns();
    }, 5000);
    return () => clearInterval(id);
  }, [runs, token, refreshRuns]);

  async function saveToken() {
    if (!tokenInput.trim()) return;
    setStoredToken(tokenInput.trim());
    setToken(tokenInput.trim());
    setTokenInput("");
    setError(null);
    setInfo("Token 已儲存到瀏覽器 localStorage");
  }

  function clearToken() {
    setStoredToken("");
    setToken("");
    setTokenStatus(null);
    setRuns([]);
    setInfo("Token 已從瀏覽器清除");
  }

  async function trigger() {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      await triggerWorkflow();
      setInfo("✓ 已觸發 — workflow 通常 1-2 分鐘完成，下面會自動更新狀態");
      // 觸發後 2 秒抓一次
      setTimeout(refreshRuns, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const freshness = daysAgo(lastFetchedAt);
  const stale = freshness.days >= 3;

  return (
    <div className="space-y-6">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">手動更新股價資料</h1>
        <p className="muted mt-2 text-sm">
          每天台北 06:00 自動抓 Yahoo Finance；如果你想立刻刷新（例：盤中盯盤 / 重大事件後），
          下方提供 3 種方式。
        </p>
      </header>

      {/* 目前狀態 */}
      <section className="card p-5">
        <h2 className="section-title text-base">目前資料狀態</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <Stat
            label="最後更新時間"
            value={formatFetchedAt(lastFetchedAt)}
          />
          <Stat
            label="距今"
            value={freshness.label}
            tone={freshness.tone}
          />
          <Stat
            label="狀態"
            value={stale ? "建議更新" : "新鮮"}
            tone={stale ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}
          />
        </div>
      </section>

      {/* 方法 1: 線上一鍵更新 */}
      <section className="card space-y-3 p-5">
        <h2 className="section-title">🚀 方法 1：線上一鍵更新（推薦）</h2>
        <p className="muted text-sm">
          需要先設定一個 GitHub Personal Access Token（PAT），只需要 <code>workflow</code> 權限。
          Token 存在你的瀏覽器 localStorage，<strong>不會上傳到任何伺服器</strong>。
        </p>

        {!token ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-sm font-semibold">設定 Token（一次性）</h3>
            <ol className="muted mt-2 list-decimal space-y-1 pl-5 text-xs">
              <li>
                到{" "}
                <a
                  href={REPO_URLS.newToken}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline dark:text-brand-400"
                >
                  GitHub Token 產生頁
                </a>
                （已預設 <code>workflow</code> scope）
              </li>
              <li>
                Expiration 建議 <strong>90 days</strong> 或 <strong>No expiration</strong>
              </li>
              <li>按 <strong>Generate token</strong>，把 <code>ghp_…</code> 那串貼到下面</li>
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="input flex-1 min-w-[16rem]"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveToken}
                disabled={!tokenInput.trim()}
              >
                儲存 Token
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-950/40">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-sm">
                <span className="font-semibold">✓ Token 已設定</span>
                {tokenStatus && (
                  <span className="muted ml-2">
                    （帳號 <code>{tokenStatus.login}</code>，scopes: <code>{tokenStatus.scopes || "—"}</code>）
                  </span>
                )}
              </div>
              <button type="button" onClick={clearToken} className="btn text-rose-600">
                清除 Token
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={trigger}
                disabled={busy}
              >
                {busy ? "觸發中…" : "🔄 立即更新股價"}
              </button>
              <button type="button" className="btn" onClick={refreshRuns}>
                重新整理狀態
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200">
            <strong>錯誤：</strong> {error}
          </div>
        )}
        {info && !error && (
          <div className="rounded-lg border border-sky-300 bg-sky-50 p-3 text-xs text-sky-800 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200">
            {info}
          </div>
        )}

        {/* Recent runs */}
        {token && runs.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm font-semibold">最近 5 次執行</h3>
            <table className="mt-2 min-w-full text-xs">
              <thead className="text-left text-[10px] uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-2 py-1">開始</th>
                  <th className="px-2 py-1">結束</th>
                  <th className="px-2 py-1">狀態</th>
                  <th className="px-2 py-1">連結</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {runs.map((r) => {
                  const s = fmtStatus(r);
                  return (
                    <tr key={r.id}>
                      <td className="px-2 py-1 font-mono">{fmtTime(r.run_started_at ?? r.created_at)}</td>
                      <td className="px-2 py-1 font-mono">
                        {r.status === "completed" ? fmtTime(r.updated_at) : "—"}
                      </td>
                      <td className={"px-2 py-1 font-semibold " + s.tone}>{s.label}</td>
                      <td className="px-2 py-1">
                        <a
                          href={r.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:underline dark:text-brand-400"
                        >
                          看 log
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="muted mt-2 text-[10px]">
              成功後約 1-2 分鐘，網站會由 Pages 重新部署 — 你需要重新整理瀏覽器才看得到新資料。
            </p>
          </div>
        )}
      </section>

      {/* 方法 2: GitHub Actions UI */}
      <section className="card space-y-2 p-5">
        <h2 className="section-title">🌐 方法 2：直接到 GitHub Actions UI</h2>
        <p className="muted text-sm">
          不想存 Token？打開下面連結，按 <strong>「Run workflow」</strong> 綠色按鈕即可。
        </p>
        <a
          href={REPO_URLS.actions}
          target="_blank"
          rel="noreferrer"
          className="btn inline-flex"
        >
          🔗 打開 GitHub Actions 頁面
        </a>
        <p className="muted text-[11px]">
          需要你登入 GitHub 帳號 gmcycle7。在 Actions 頁面右側會看到「Run workflow」。
        </p>
      </section>

      {/* 方法 3: 本機指令 */}
      <section className="card space-y-2 p-5">
        <h2 className="section-title">💻 方法 3：本機指令（若你有 clone repo）</h2>
        <p className="muted text-sm">
          最快、最完整 — 在你電腦上跑一次 fetcher，commit + push 後幾秒鐘網站就更新。
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
{`cd /Users/matthuang/claude_code/Stock_01
npm run fetch:prices
git add src/data/marketData.json
git commit -m "chore: refresh market data"
git push`}
        </pre>
        <p className="muted text-[11px]">
          整套流程約 2-4 分鐘（取 prices + push + Pages 部署 + 重整網頁）。
        </p>
      </section>

      {/* 重要提醒 */}
      <section className="card border-amber-300 bg-amber-50/30 p-5 text-xs dark:border-amber-700 dark:bg-amber-950/20">
        <h3 className="font-semibold text-amber-900 dark:text-amber-200">
          ⚠️ 必看的小事
        </h3>
        <ul className="muted mt-2 list-disc space-y-1 pl-5">
          <li>Yahoo Finance 對美股是 15 分鐘延遲；台股約 20 分鐘延遲（盤中）</li>
          <li>盤後 / 假日跑 fetcher 拿到的是最新收盤價</li>
          <li>過於頻繁觸發可能會被 Yahoo 限速（rate limit）— 建議間隔 &gt; 15 分鐘</li>
          <li>Token 只存在你的瀏覽器，<a href={REPO_URLS.manageTokens} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline dark:text-brand-400">隨時可到 GitHub 撤銷</a></li>
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="muted text-xs">{label}</div>
      <div className={"mt-1 text-lg font-bold tabular-nums " + (tone ?? "")}>{value}</div>
    </div>
  );
}
