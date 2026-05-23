export function Disclaimer({ subtle = false }: { subtle?: boolean }) {
  return (
    <div
      className={
        subtle
          ? "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
          : "rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100"
      }
    >
      <strong>免責聲明：</strong>
      本網站內容僅供產業與技術研究使用，不構成任何投資建議。
      股票投資涉及風險，請自行判斷並查證最新財務資料。
    </div>
  );
}
