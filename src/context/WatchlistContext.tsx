import { useEffect, useMemo, useState, type ReactNode } from "react";
import { WatchlistContext } from "./watchlistContextValue";

const KEY = "ai-infra-watchlist";

function load(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(load);

  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const value = useMemo(
    () => ({
      ids,
      has: (id: string) => ids.includes(id),
      toggle: (id: string) =>
        setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])),
      clear: () => setIds([]),
    }),
    [ids],
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}
