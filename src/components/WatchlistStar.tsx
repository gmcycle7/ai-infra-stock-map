import { useWatchlist } from "../context/watchlistContextValue";

interface Props {
  id: string;
  size?: "sm" | "md";
}

export function WatchlistStar({ id, size = "md" }: Props) {
  const { has, toggle } = useWatchlist();
  const on = has(id);
  const dim = size === "sm" ? "h-5 w-5 text-sm" : "h-7 w-7 text-base";
  return (
    <button
      type="button"
      aria-label={on ? "從關注清單移除" : "加入關注清單"}
      title={on ? "從關注清單移除" : "加入關注清單"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={
        "inline-flex items-center justify-center rounded-full transition " +
        dim +
        " " +
        (on
          ? "text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
          : "text-slate-400 hover:text-amber-500 dark:text-slate-500 dark:hover:text-amber-400")
      }
    >
      {on ? "★" : "☆"}
    </button>
  );
}
