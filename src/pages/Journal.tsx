import { Link } from "react-router-dom";
import { useJournal } from "../context/journalContextValue";
import { companies } from "../data/companies";

function fmtDate(iso: string): string {
  if (!iso) return "—";
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

export function JournalPage() {
  const journal = useJournal();
  const ids = journal.allIds();
  const entries = ids
    .map((id) => ({
      id,
      company: companies.find((c) => c.id === id),
      entry: journal.get(id),
    }))
    .filter((x): x is { id: string; company: NonNullable<typeof x.company>; entry: ReturnType<typeof journal.get> } => !!x.company)
    .sort((a, b) => (b.entry.updatedAt || "").localeCompare(a.entry.updatedAt || ""));

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">投資決策日誌總覽</h1>
        <p className="muted mt-2 text-sm">
          所有寫過決策日誌的公司，依「最後編輯」排序。
          紀錄目的：日後回頭檢視「我當初為什麼這樣判斷」、「該觀察什麼信號」。
          這是投資紀律的核心。
        </p>
        <p className="muted mt-2 text-xs">
          資料只存在你的瀏覽器 localStorage — 清快取 / 換裝置 / 換瀏覽器會消失。
          建議定期把重要筆記另存其他地方。
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          還沒有任何決策日誌。
          <Link to="/companies" className="ml-1 text-brand-600 hover:underline dark:text-brand-400">
            到公司列表
          </Link>{" "}
          挑一家公司，在詳細頁的「投資決策日誌」區塊寫下你的看法。
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(({ id, company, entry }) => (
            <article key={id} className="card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-semibold">
                  <Link to={`/company/${company.id}`} className="hover:underline">
                    {company.name}
                  </Link>{" "}
                  <span className="muted text-xs font-normal">{company.ticker}</span>
                </h2>
                <span className="muted text-[10px]">最後編輯：{fmtDate(entry.updatedAt)}</span>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                {entry.bullCase && (
                  <div className="rounded border border-emerald-200 bg-emerald-50/50 p-2 dark:border-emerald-700 dark:bg-emerald-950/30">
                    <div className="font-semibold text-emerald-800 dark:text-emerald-200">🐂 看好</div>
                    <div className="muted mt-1 whitespace-pre-wrap">{entry.bullCase}</div>
                  </div>
                )}
                {entry.bearCase && (
                  <div className="rounded border border-rose-200 bg-rose-50/50 p-2 dark:border-rose-700 dark:bg-rose-950/30">
                    <div className="font-semibold text-rose-800 dark:text-rose-200">🐻 看空</div>
                    <div className="muted mt-1 whitespace-pre-wrap">{entry.bearCase}</div>
                  </div>
                )}
                {entry.changeMyMind && (
                  <div className="rounded border border-amber-200 bg-amber-50/50 p-2 dark:border-amber-700 dark:bg-amber-950/30">
                    <div className="font-semibold text-amber-800 dark:text-amber-200">🔄 改變想法</div>
                    <div className="muted mt-1 whitespace-pre-wrap">{entry.changeMyMind}</div>
                  </div>
                )}
                {entry.notes && (
                  <div className="rounded border border-slate-200 bg-slate-50/50 p-2 dark:border-slate-700 dark:bg-slate-900">
                    <div className="font-semibold">📝 筆記</div>
                    <div className="muted mt-1 whitespace-pre-wrap">{entry.notes}</div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
