import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  EMPTY_ENTRY,
  JournalContext,
  type JournalEntry,
} from "./journalContextValue";

const KEY = "ai-infra-journal";

type Store = Record<string, JournalEntry>;

function load(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed != null ? parsed : {};
  } catch {
    return {};
  }
}

export function JournalProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(load);

  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  }, [store]);

  const value = useMemo(
    () => ({
      get(id: string): JournalEntry {
        return store[id] ?? EMPTY_ENTRY;
      },
      set(id: string, entry: Partial<JournalEntry>) {
        setStore((cur) => ({
          ...cur,
          [id]: {
            ...EMPTY_ENTRY,
            ...cur[id],
            ...entry,
            updatedAt: new Date().toISOString(),
          },
        }));
      },
      remove(id: string) {
        setStore((cur) => {
          const next = { ...cur };
          delete next[id];
          return next;
        });
      },
      allIds() {
        return Object.keys(store).filter(
          (id) =>
            store[id].bullCase ||
            store[id].bearCase ||
            store[id].changeMyMind ||
            store[id].notes,
        );
      },
    }),
    [store],
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}
