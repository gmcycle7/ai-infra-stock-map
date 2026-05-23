import { Link } from "react-router-dom";
import { supplyChainEdges, supplyChainNodes } from "../data/supplyChain";

// 把 14 個節點分成 6 個層級，畫成簡化的依賴圖
const LAYERS: Array<{ title: string; nodeIds: string[] }> = [
  { title: "需求源頭", nodeIds: ["ai-model"] },
  { title: "晶片設計", nodeIds: ["compute", "memory"] },
  { title: "製造", nodeIds: ["foundry", "packaging"] },
  { title: "互連", nodeIds: ["interface", "switch-nic", "copper", "optics"] },
  { title: "整合", nodeIds: ["server"] },
  { title: "基礎建設", nodeIds: ["power", "cooling", "infra"] },
];

const palette: Record<string, string> = {
  Demand: "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/40 dark:text-violet-200",
  Compute: "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/40 dark:text-violet-200",
  Memory: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200",
  Manufacturing: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-200",
  Networking: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200",
  Server: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-200",
  Infrastructure: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-200",
};

export function SupplyChainDiagram() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">
        {LAYERS.map((layer) => (
          <div key={layer.title} className="space-y-2">
            <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              {layer.title}
            </div>
            <div className="space-y-2">
              {layer.nodeIds
                .map((id) => supplyChainNodes.find((n) => n.id === id))
                .filter(Boolean)
                .map((n) => {
                  const node = n!;
                  const cls = palette[node.domain] ?? palette.Manufacturing;
                  const slug = node.category !== "demand" ? `/category/${node.category}` : "/";
                  return (
                    <Link
                      key={node.id}
                      to={slug}
                      className={
                        "block rounded-lg border px-3 py-2 text-center text-sm font-medium shadow-sm transition hover:scale-[1.02] " +
                        cls
                      }
                      title={node.labelEn}
                    >
                      {node.labelZh}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        <div className="mb-2 font-semibold">主要依賴關係（節錄）</div>
        <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
          {supplyChainEdges.slice(0, 12).map((e, i) => {
            const f = supplyChainNodes.find((n) => n.id === e.from);
            const t = supplyChainNodes.find((n) => n.id === e.to);
            if (!f || !t) return null;
            return (
              <li key={i}>
                <span className="font-medium">{f.labelZh}</span>
                <span className="muted"> → </span>
                <span className="font-medium">{t.labelZh}</span>
                {e.label && <span className="muted">：{e.label}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 簡單的「壓力來源 → 受惠者」流程式圖
export function StackDiagram() {
  const layers = [
    { title: "AI 模型需求暴增", desc: "LLM 訓練 / 推論需求", color: "bg-violet-500" },
    { title: "GPU / ASIC 量價齊揚", desc: "Nvidia、AMD、Broadcom、Marvell、台廠 ASIC 設計服務", color: "bg-fuchsia-500" },
    { title: "HBM / 先進製程 / CoWoS 瓶頸", desc: "SK Hynix、Samsung、Micron、TSMC、ASML、ASE、京元電、欣興", color: "bg-amber-500" },
    { title: "AI server / 高速網路升級", desc: "緯創、緯穎、廣達、英業達、鴻海、Supermicro、Arista、智邦", color: "bg-emerald-500" },
    { title: "電源 / 散熱 / 連接器 / 銅纜 / 光通訊", desc: "Delta、AVC、奇鋐、Credo、Astera、Coherent、Lumentum、Fabrinet", color: "bg-cyan-500" },
    { title: "資料中心基礎建設", desc: "Vertiv、Eaton、Schneider、UPS、PDU、冷水機", color: "bg-yellow-500" },
  ];

  return (
    <div className="space-y-3">
      {layers.map((l, i) => (
        <div key={i} className="flex items-stretch gap-3">
          <div
            className={
              "flex w-8 shrink-0 items-center justify-center rounded text-xs font-bold text-white " +
              l.color
            }
          >
            {i + 1}
          </div>
          <div className="card flex-1 px-3 py-2">
            <div className="text-sm font-semibold">{l.title}</div>
            <div className="muted text-xs">{l.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
