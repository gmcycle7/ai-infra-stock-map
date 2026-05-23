import { downloadCsv } from "../lib/csv";

interface Props {
  filename: string;
  csv: string;
  label?: string;
  size?: "sm" | "md";
}

export function CsvButton({ filename, csv, label = "匯出 CSV", size = "md" }: Props) {
  const sz = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <button
      type="button"
      onClick={() => downloadCsv(filename, csv)}
      className={
        "inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 " +
        sz
      }
      title="可用 Excel / Google Sheets 開啟"
    >
      📥 {label}
    </button>
  );
}
