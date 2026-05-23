import { categories } from "../data/categories";
import type { InvestmentType, Market, SupplyChainPosition } from "../types";
import { type FilterState, defaultFilter } from "../lib/filter";
import {
  investmentTypeDescriptions,
  investmentTypePalette,
} from "../lib/investmentType";

interface Props {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  allTags?: string[];
}

const MARKETS: Array<{ v: Market; label: string }> = [
  { v: "US", label: "美股" },
  { v: "Taiwan", label: "台股" },
  { v: "Private", label: "未上市 / 海外" },
];

const POSITIONS: Array<{ v: SupplyChainPosition; label: string }> = [
  { v: "Upstream", label: "上游" },
  { v: "Midstream", label: "中游" },
  { v: "Downstream", label: "下游" },
];

const SORT_OPTIONS = [
  { v: "scoreDesc", label: "AI 重要性（高→低）" },
  { v: "shortTermDesc", label: "短期催化分數（高→低）" },
  { v: "threeYearDesc", label: "三年成長分數（高→低）" },
  { v: "fiveYearDesc", label: "五年護城河分數（高→低）" },
  { v: "tenYearDesc", label: "十年結構性分數（高→低）" },
  { v: "riskAsc", label: "風險分數（低→高）" },
  { v: "riskDesc", label: "風險分數（高→低）" },
  { v: "scoreAsc", label: "AI 重要性（低→高）" },
  { v: "nameAsc", label: "公司名稱（A→Z）" },
  { v: "marketAsc", label: "市場別" },
  { v: "categoryAsc", label: "分類" },
] as const;

const INVESTMENT_TYPES: InvestmentType[] = [
  "核心平台型",
  "關鍵瓶頸型",
  "技術升級受惠型",
  "週期成長型",
  "題材波動型",
];

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterBar({ filter, setFilter, allTags = [] }: Props) {
  return (
    <div className="card space-y-3 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="block md:col-span-2">
          <span className="muted mb-1 block text-xs">搜尋公司或關鍵字</span>
          <input
            type="search"
            className="input"
            placeholder="例如：Nvidia、HBM、台達電、SerDes、CoWoS…"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="muted mb-1 block text-xs">排序方式</span>
          <select
            className="input"
            value={filter.sort}
            onChange={(e) =>
              setFilter({ ...filter, sort: e.target.value as FilterState["sort"] })
            }
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.v} value={s.v}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <span className="muted mb-1 block text-xs">市場</span>
          <div className="flex flex-wrap gap-1.5">
            {MARKETS.map((m) => (
              <button
                key={m.v}
                type="button"
                onClick={() => setFilter({ ...filter, markets: toggle(filter.markets, m.v) })}
                className={
                  "rounded-md border px-2.5 py-1 text-xs transition " +
                  (filter.markets.includes(m.v)
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800")
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="muted mb-1 block text-xs">供應鏈位置</span>
          <div className="flex flex-wrap gap-1.5">
            {POSITIONS.map((p) => (
              <button
                key={p.v}
                type="button"
                onClick={() =>
                  setFilter({ ...filter, positions: toggle(filter.positions, p.v) })
                }
                className={
                  "rounded-md border px-2.5 py-1 text-xs transition " +
                  (filter.positions.includes(p.v)
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800")
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="muted mb-1 block text-xs">
            AI 重要性下限：{filter.minScore}+
          </span>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={filter.minScore}
            onChange={(e) => setFilter({ ...filter, minScore: Number(e.target.value) })}
            className="w-full"
          />
        </label>

        <div className="flex items-end">
          <button
            type="button"
            className="btn w-full"
            onClick={() => setFilter(defaultFilter)}
          >
            清除篩選
          </button>
        </div>
      </div>

      <div>
        <span className="muted mb-1 block text-xs">投資型態（可複選）</span>
        <div className="flex flex-wrap gap-1.5">
          {INVESTMENT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() =>
                setFilter({ ...filter, investmentTypes: toggle(filter.investmentTypes, t) })
              }
              title={investmentTypeDescriptions[t]}
              className={
                "rounded-md border px-2.5 py-1 text-xs transition " +
                (filter.investmentTypes.includes(t)
                  ? "border-brand-600 bg-brand-600 text-white"
                  : investmentTypePalette[t] + " hover:opacity-80")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="muted mb-1 block text-xs">分類（可複選）</span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() =>
                setFilter({ ...filter, categories: toggle(filter.categories, c.slug) })
              }
              className={
                "rounded-md border px-2.5 py-1 text-xs transition " +
                (filter.categories.includes(c.slug)
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800")
              }
            >
              {c.nameZh}
            </button>
          ))}
        </div>
      </div>

      {allTags.length > 0 && (
        <div>
          <span className="muted mb-1 block text-xs">技術標籤（可複選）</span>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter({ ...filter, tags: toggle(filter.tags, t) })}
                className={
                  "rounded-md border px-2.5 py-0.5 text-xs transition " +
                  (filter.tags.includes(t)
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800")
                }
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
