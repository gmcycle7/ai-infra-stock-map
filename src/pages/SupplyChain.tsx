import { Link } from "react-router-dom";
import { SupplyChainDiagram, StackDiagram } from "../components/SupplyChainDiagram";
import { categories } from "../data/categories";
import { companies } from "../data/companies";

const DOMAIN_ORDER: Array<{ key: string; zh: string; color: string }> = [
  { key: "Compute", zh: "運算", color: "bg-violet-500" },
  { key: "Memory", zh: "記憶體", color: "bg-amber-500" },
  { key: "Networking", zh: "網路", color: "bg-emerald-500" },
  { key: "Manufacturing", zh: "製造", color: "bg-blue-500" },
  { key: "Server", zh: "伺服器", color: "bg-rose-500" },
  { key: "Infrastructure", zh: "基礎建設", color: "bg-yellow-500" },
];

export function SupplyChainPage() {
  // Domain classification
  const byDomain: Record<string, typeof companies> = {};
  DOMAIN_ORDER.forEach((d) => (byDomain[d.key] = []));
  companies.forEach((c) => {
    const slug = c.category[0];
    const cat = categories.find((cc) => cc.slug === slug);
    const dom = cat?.domain ?? "Infrastructure";
    if (!byDomain[dom]) byDomain[dom] = [];
    byDomain[dom].push(c);
  });

  return (
    <div className="space-y-6">
      <header className="card p-6">
        <h1 className="text-2xl font-bold tracking-tight">供應鏈總覽</h1>
        <p className="muted mt-2 text-sm">
          從 AI 模型需求出發，串起整條 AI 基礎建設供應鏈。下方依「運算 / 記憶體 / 網路 / 製造 / 伺服器 / 基礎建設」分類，
          清楚標示每家公司處於哪個 layer。
        </p>
      </header>

      <section className="card p-5">
        <h2 className="section-title">14 大類整體流程</h2>
        <div className="mt-3"><SupplyChainDiagram /></div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="section-title">壓力傳導（誰被推著走）</h2>
          <div className="mt-3"><StackDiagram /></div>
        </div>
        <div className="card p-5">
          <h2 className="section-title">關鍵依賴：Nvidia 鏈、HBM 鏈、CoWoS 鏈</h2>
          <ol className="muted mt-2 list-decimal space-y-2 pl-5 text-sm">
            <li>
              <strong>Nvidia GPU 出貨</strong> ← 受 CoWoS 與 HBM 兩個瓶頸限制。
            </li>
            <li>
              <strong>HBM 需求</strong> ← SK Hynix / Samsung / Micron 競爭；Lam / AMAT 設備受惠。
            </li>
            <li>
              <strong>CoWoS 產能</strong> ← TSMC 主導，產能滿載直接限制 GPU 出貨；ABF 載板（欣興、南電）配合。
            </li>
            <li>
              <strong>AI server 與 800G/1.6T 網路</strong> ← 廣達、緯創、緯穎、英業達、鴻海、Arista、智邦同步成長。
            </li>
            <li>
              <strong>光通訊與銅纜</strong> ← Coherent、Lumentum、Fabrinet、Credo、Astera、Amphenol、Lotes、貿聯。
            </li>
            <li>
              <strong>電源與散熱</strong> ← 台達電、AVC、奇鋐、Delta、Vertiv、MPS 受惠 rack power 與液冷導入。
            </li>
          </ol>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">依領域 (Domain) 分組</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {DOMAIN_ORDER.map((d) => {
            const list = byDomain[d.key] ?? [];
            return (
              <div key={d.key} className="card p-4">
                <div className="flex items-center gap-2">
                  <span className={"inline-block h-3 w-3 rounded " + d.color} />
                  <div className="text-base font-semibold">{d.zh}</div>
                  <span className="muted text-xs">{list.length} 家</span>
                </div>
                <ul className="muted mt-2 space-y-1 text-sm">
                  {list.map((c) => (
                    <li key={c.id}>
                      <Link className="hover:underline" to={`/company/${c.id}`}>
                        {c.name}
                      </Link>
                      <span className="ml-1 text-[10px] text-slate-400">{c.ticker}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
