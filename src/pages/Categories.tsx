import { CategoryCard } from "../components/CategoryCard";
import { Disclaimer } from "../components/Disclaimer";
import { categories } from "../data/categories";
import { companies } from "../data/companies";

export function CategoriesPage() {
  return (
    <div className="space-y-6">
      <header className="card p-5">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">分類總覽</h1>
        <p className="muted mt-1 text-sm">
          AI 基礎建設供應鏈共 14 大分類，每個分類包含 3-8 家代表性公司。
          點擊分類進入詳細頁，可看到該分類的技術重點、瓶頸、受惠公司與比較表。
        </p>
      </header>

      <Disclaimer subtle />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c) => {
          const count = companies.filter((co) => co.category.includes(c.slug)).length;
          return <CategoryCard key={c.slug} category={c} count={count} />;
        })}
      </div>
    </div>
  );
}
