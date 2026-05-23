import { Link } from "react-router-dom";
import { useWatchlist } from "../context/watchlistContextValue";
import { companies } from "../data/companies";
import { CompanyCard } from "../components/CompanyCard";

export function WatchlistPage() {
  const { ids, clear } = useWatchlist();
  const list = ids
    .map((id) => companies.find((c) => c.id === id))
    .filter((c): c is (typeof companies)[number] => !!c);

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">我的關注清單</h1>
            <p className="muted mt-1 text-sm">
              點公司卡片右上角的 ☆ 按鈕加入；資料儲存在你的瀏覽器（localStorage），
              不會上傳到任何伺服器。
            </p>
          </div>
          {list.length > 0 && (
            <button type="button" className="btn" onClick={clear}>
              清空關注清單
            </button>
          )}
        </div>
      </header>

      {list.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            還沒有任何關注公司。
            <Link
              to="/companies"
              className="ml-1 text-brand-600 hover:underline dark:text-brand-400"
            >
              到公司列表
            </Link>{" "}
            開始挑選。
          </p>
        </div>
      ) : (
        <>
          <div className="muted text-xs">共 {list.length} 家</div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
