import { createContext, useContext } from "react";

export interface JournalEntry {
  bullCase: string;       // 看好的論點
  bearCase: string;       // 看空的風險
  changeMyMind: string;   // 什麼會讓我改變想法
  notes: string;          // 自由筆記
  updatedAt: string;      // ISO timestamp
}

export const EMPTY_ENTRY: JournalEntry = {
  bullCase: "",
  bearCase: "",
  changeMyMind: "",
  notes: "",
  updatedAt: "",
};

export interface JournalContextValue {
  get(id: string): JournalEntry;
  set(id: string, entry: Partial<JournalEntry>): void;
  remove(id: string): void;
  /** 全部有資料的公司 id */
  allIds(): string[];
}

export const JournalContext = createContext<JournalContextValue | null>(null);

export function useJournal(): JournalContextValue {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error("useJournal must be used inside JournalProvider");
  return ctx;
}
