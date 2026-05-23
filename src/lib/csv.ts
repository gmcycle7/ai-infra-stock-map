// CSV 匯出工具
// 處理 escape：含逗號 / 引號 / 換行的欄位包雙引號，內部雙引號轉成 ""

export function toCsvCell(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv(rows: Array<Record<string, unknown>>, columns?: string[]): string {
  if (rows.length === 0) return "";
  const cols = columns ?? Object.keys(rows[0]);
  const header = cols.map(toCsvCell).join(",");
  const body = rows
    .map((r) => cols.map((k) => toCsvCell(r[k])).join(","))
    .join("\n");
  // Excel 友善：加 BOM 讓 Excel 用 UTF-8 開啟中文不亂碼
  return "﻿" + header + "\n" + body;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
