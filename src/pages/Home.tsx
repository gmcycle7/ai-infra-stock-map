import { Link } from "react-router-dom";
import { Disclaimer } from "../components/Disclaimer";
import { CategoryCard } from "../components/CategoryCard";
import { SupplyChainDiagram, StackDiagram } from "../components/SupplyChainDiagram";
import { categories } from "../data/categories";
import { companies } from "../data/companies";

export function HomePage() {
  const counts = categories.map((c) => ({
    slug: c.slug,
    count: companies.filter((co) => co.category.includes(c.slug)).length,
  }));
  const totals = {
    us: companies.filter((c) => c.market === "US").length,
    tw: companies.filter((c) => c.market === "Taiwan").length,
    other: companies.filter((c) => c.market === "Private").length,
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="card p-6 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          AI 基礎建設股票地圖：台股與美股
        </h1>
        <p className="muted mt-2 text-sm md:text-base">
          為台灣半導體 / SerDes 工程師量身整理的 AI 基礎建設供應鏈資料。
          快速掌握 <strong>{companies.length}</strong> 家公司、
          <strong> {categories.length} </strong>個分類，從 GPU、HBM、CoWoS、SerDes、Switch、光通訊到電源散熱。
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="chip border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300">
            美股 {totals.us}
          </span>
          <span className="chip border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300">
            台股 {totals.tw}
          </span>
          <span className="chip border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            未上市 / 海外 {totals.other}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/companies" className="btn btn-primary">瀏覽公司列表</Link>
          <Link to="/supply-chain" className="btn">供應鏈總覽</Link>
          <Link to="/glossary" className="btn">技術名詞解釋</Link>
        </div>
        <div className="mt-6">
          <Disclaimer />
        </div>
      </section>

      {/* Why AI Infra Matters */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="section-title">為什麼 AI 基礎建設重要</h2>
          <p className="muted mt-2 text-sm">
            從 ChatGPT 引爆的這波 AI 浪潮中，模型本身（OpenAI、Anthropic、Google DeepMind）的價值最容易被看見，
            但真正可以「投資」的標的，多數集中在<strong>把模型跑起來的硬體</strong>：GPU、HBM、先進製程、CoWoS、
            高速 SerDes、Switch ASIC、光通訊、AI server、電源與散熱。
          </p>
          <ul className="muted mt-3 list-disc space-y-1 pl-5 text-sm">
            <li>AI 模型「越大越好」推動 GPU / ASIC 對 HBM、CoWoS、先進製程的需求暴增。</li>
            <li>GPU cluster 從千顆走向十萬顆，800G/1.6T 光通訊與高速 SerDes 成為新的瓶頸。</li>
            <li>單 rack 功耗從 ~20kW 推到 120kW+，整個電源 / 液冷供應鏈被迫升級。</li>
            <li>台灣 ODM、ASIC 設計、CoWoS、ABF 載板、散熱、電源在此供應鏈中具關鍵地位。</li>
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="section-title">適合誰看</h2>
          <ul className="muted mt-2 space-y-1 text-sm">
            <li>• 在台灣半導體 / SoC / SerDes 圈工作的工程師</li>
            <li>• 想用工程角度理解 AI 概念股的投資者</li>
            <li>• 研究 AI 供應鏈的技術 PM、分析師、學生</li>
          </ul>
          <h3 className="mt-4 text-sm font-semibold">本站特色</h3>
          <ul className="muted mt-1 space-y-1 text-sm">
            <li>• 不亂吹捧、不抄財經媒體：所有事實欄位必註明來源</li>
            <li>• 主觀分析放在「分析師觀點」欄位，與事實清楚分開</li>
            <li>• 給 SerDes 工程師的視角欄位：你能直接判斷的技術變數</li>
            <li>• 所有股價、市值欄位皆標示「requires live API」，不放過期數字</li>
          </ul>
        </div>
      </section>

      {/* Supply chain */}
      <section className="space-y-3">
        <h2 className="section-title">AI 基礎建設供應鏈總覽</h2>
        <SupplyChainDiagram />
      </section>

      {/* Stack */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="section-title">壓力傳導：誰被推著走</h2>
          <p className="muted mt-1 text-xs">
            從模型需求出發，到資料中心基礎建設，每一層的瓶頸都會傳到下一層。
          </p>
          <div className="mt-4">
            <StackDiagram />
          </div>
        </div>
        <div className="card p-5">
          <h2 className="section-title">給 SerDes 工程師的視角</h2>
          <p className="muted mt-1 text-xs">
            如果你正在做 112G/224G PAM4、PCIe Gen5/Gen6、UCIe、retimer，這幾條趨勢線是你日常工作的下游：
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
            <li>
              <strong>每條 lane 從 112G PAM4 → 224G PAM4 / PAM6</strong>：
              insertion loss 預算變緊，DFE 殘餘錯誤敏感度上升，CTLE/FFE/PR 設計成為差異化關鍵。
            </li>
            <li>
              <strong>Switch ASIC 從 51.2T → 102.4T</strong>：
              受惠 Broadcom Tomahawk 6、Marvell Teralynx 等，以及配套的 retimer、AEC、光模組。
            </li>
            <li>
              <strong>PCIe Gen5 → Gen6 全面普及</strong>：
              GPU↔CPU、GPU↔NVMe SSD 都需要 retimer（Astera Labs、Microchip）。
            </li>
            <li>
              <strong>銅 vs 光的拉鋸</strong>：
              AEC 內含 retimer 是延長銅纜壽命的關鍵；CPO / LPO 是改變遊戲規則的長期變數。
            </li>
            <li>
              <strong>封裝內 die-to-die UCIe</strong>：
              Chiplet 與 SoIC 帶來新的「封裝內 SerDes」設計題目。
            </li>
          </ol>
        </div>
      </section>

      {/* Categories grid */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="section-title">14 大分類</h2>
          <Link to="/categories" className="text-sm text-brand-600 hover:underline dark:text-brand-400">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.slug}
              category={c}
              count={counts.find((x) => x.slug === c.slug)?.count ?? 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
