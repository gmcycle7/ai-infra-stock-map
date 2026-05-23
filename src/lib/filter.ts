import type { CategorySlug, Company, Market, SupplyChainPosition } from "../types";

export interface FilterState {
  search: string;
  markets: Market[];
  categories: CategorySlug[];
  positions: SupplyChainPosition[];
  minScore: number;
  tags: string[];
  sort: "scoreDesc" | "scoreAsc" | "nameAsc" | "marketAsc" | "categoryAsc";
}

export const defaultFilter: FilterState = {
  search: "",
  markets: [],
  categories: [],
  positions: [],
  minScore: 0,
  tags: [],
  sort: "scoreDesc",
};

export function applyFilter(companies: Company[], f: FilterState): Company[] {
  const q = f.search.trim().toLowerCase();
  let list = companies.filter((c) => {
    if (f.minScore > 0 && c.aiImportanceScore < f.minScore) return false;
    if (f.markets.length > 0 && !f.markets.includes(c.market)) return false;
    if (f.categories.length > 0 && !c.category.some((cc) => f.categories.includes(cc)))
      return false;
    if (f.positions.length > 0 && !f.positions.includes(c.supplyChainPosition)) return false;
    if (f.tags.length > 0 && !c.tags.some((t) => f.tags.includes(t))) return false;
    if (q) {
      const hay =
        (c.name +
          " " +
          c.nameEn +
          " " +
          c.ticker +
          " " +
          c.tags.join(" ") +
          " " +
          c.technicalKeywords.join(" ") +
          " " +
          c.coreProducts.join(" ") +
          " " +
          c.whatTheyDo +
          " " +
          c.aiRelevance).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  list = list.slice().sort((a, b) => {
    switch (f.sort) {
      case "scoreDesc":
        return b.aiImportanceScore - a.aiImportanceScore || a.name.localeCompare(b.name);
      case "scoreAsc":
        return a.aiImportanceScore - b.aiImportanceScore || a.name.localeCompare(b.name);
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "marketAsc":
        return a.market.localeCompare(b.market) || b.aiImportanceScore - a.aiImportanceScore;
      case "categoryAsc":
        return (
          (a.category[0] ?? "").localeCompare(b.category[0] ?? "") ||
          b.aiImportanceScore - a.aiImportanceScore
        );
      default:
        return 0;
    }
  });

  return list;
}
