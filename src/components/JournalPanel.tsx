import { useState } from "react";
import { useJournal } from "../context/journalContextValue";

interface Props {
  companyId: string;
  companyName: string;
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

function TextArea({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold">{label}</span>
      <span className="muted block text-[10px]">{hint}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input mt-1 resize-y"
      />
    </label>
  );
}

function JournalPanelInner({ companyId, companyName }: Props) {
  const journal = useJournal();
  const current = journal.get(companyId);

  // 使用 lazy initializer，避免 useEffect 在 effect body 內 setState
  const [bull, setBull] = useState(current.bullCase);
  const [bear, setBear] = useState(current.bearCase);
  const [cmm, setCmm] = useState(current.changeMyMind);
  const [notes, setNotes] = useState(current.notes);
  const [savedAt, setSavedAt] = useState(current.updatedAt);
  const [dirty, setDirty] = useState(false);

  function update(setter: (v: string) => void) {
    return (v: string) => {
      setter(v);
      setDirty(true);
    };
  }

  function save() {
    journal.set(companyId, {
      bullCase: bull,
      bearCase: bear,
      changeMyMind: cmm,
      notes,
    });
    setSavedAt(new Date().toISOString());
    setDirty(false);
  }

  function clearEntry() {
    if (confirm(`確定要清空 ${companyName} 的決策日誌嗎？`)) {
      journal.remove(companyId);
      setBull("");
      setBear("");
      setCmm("");
      setNotes("");
      setSavedAt("");
      setDirty(false);
    }
  }

  const isEmpty = !bull && !bear && !cmm && !notes;

  return (
    <section className="card space-y-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title">投資決策日誌</h2>
        <span className="muted text-xs">
          僅存在你的瀏覽器（localStorage）·{" "}
          {savedAt ? `最後存檔：${fmtDate(savedAt)}` : "尚未存檔"}
        </span>
      </div>
      <p className="muted text-xs">
        投資老手最重要的紀律：寫下「為什麼看好」、「最大風險」、「會讓我改變想法的事」。
        日後回頭檢視時，這份紀錄會告訴你當初的決策是對是錯、為什麼錯。
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <TextArea
          label="🐂 看好的論點（Bull case）"
          hint="是什麼讓你想關注 / 持有這家公司？"
          value={bull}
          onChange={update(setBull)}
          placeholder="例：CoWoS 擴產直接受惠、CC Wei 執行紀律穩健、forward P/E 30 在歷史均值附近⋯"
        />
        <TextArea
          label="🐻 看空的風險（Bear case）"
          hint="主動找最強的反論點 — 避免 confirmation bias"
          value={bear}
          onChange={update(setBear)}
          placeholder="例：中國地緣風險、客戶集中於 Nvidia、N2 量產若延誤會傷財報⋯"
        />
        <TextArea
          label="🔄 什麼會讓我改變想法？"
          hint="明確的「賣出條件」— 投資紀律的核心"
          value={cmm}
          onChange={update(setCmm)}
          placeholder="例：CoWoS 訂單突然下修 30%、CC Wei 離職、forward P/E 跌破 20 反而是加碼點⋯"
        />
        <TextArea
          label="📝 自由筆記"
          hint="法說重點、新聞摘要、買賣紀錄等"
          value={notes}
          onChange={update(setNotes)}
          placeholder="例：2026 Q1 法說會 CC Wei 提到 CoWoS 全年產能翻倍⋯"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={save}
          className={"btn " + (dirty ? "btn-primary" : "")}
          disabled={!dirty}
        >
          {dirty ? "儲存變更" : "已儲存 ✓"}
        </button>
        {!isEmpty && (
          <button type="button" onClick={clearEntry} className="btn text-rose-600">
            清空
          </button>
        )}
        <span className="muted text-xs">
          資料只存你的瀏覽器；清快取或換裝置會消失。
        </span>
      </div>
    </section>
  );
}

/**
 * 包裝層：以 companyId 作為 key 強制重 mount，避免 useState 殘留前一家公司的內容
 */
export function JournalPanel(props: Props) {
  return <JournalPanelInner key={props.companyId} {...props} />;
}
