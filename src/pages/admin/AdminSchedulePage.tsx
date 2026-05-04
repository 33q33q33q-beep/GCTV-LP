import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BroadcastRaceRow } from "../../domain/broadcastRace";
import {
  deleteRaceAdmin,
  fetchAllRacesAdmin,
} from "../../services/broadcastRacesService";
import { formatRaceDateBadgeJa, isBroadcastEndedRace, tokyoDateString } from "../../lib/tokyoDate";

export default function AdminSchedulePage() {
  const [rows, setRows] = useState<BroadcastRaceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      setRows(await fetchAllRacesAdmin());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("このレースを削除しますか？")) return;
    try {
      await deleteRaceAdmin(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const today = tokyoDateString();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">配信スケジュール</h1>
          <p className="text-sm text-gray-500 mt-1">
            レース日・タイトル・アーカイブURLを登録。サイトでは東京日付が <code>{today}</code>{" "}
            より<strong>前</strong>の日を「終了」（当日はまだ「予定」）に並べ替えます。
          </p>
        </div>
        <Link
          to="/admin/schedule/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl"
        >
          <i className="ri-add-line" />
          新規作成
        </Link>
      </div>

      {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
      {loading ? (
        <p className="text-gray-400">読み込み中…</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">レース日</th>
                <th className="px-4 py-3">状態</th>
                <th className="px-4 py-3">タイトル</th>
                <th className="px-4 py-3">副題</th>
                <th className="px-4 py-3">公開</th>
                <th className="px-4 py-3 w-32">並び</th>
                <th className="px-4 py-3 w-40">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const d = r.race_date.slice(0, 10);
                const ended = isBroadcastEndedRace(d, today);
                return (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono text-xs text-gray-600">{d}</div>
                      <div className="text-gray-900 font-semibold">{formatRaceDateBadgeJa(d)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-black px-2 py-1 rounded-full ${
                          ended ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ended ? "終了" : "予定"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 max-w-[180px] truncate">
                      {r.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{r.subtitle}</td>
                    <td className="px-4 py-3">{r.published ? "○" : "—"}</td>
                    <td className="px-4 py-3">{r.sort_order}</td>
                    <td className="px-4 py-3 flex flex-wrap gap-2">
                      <Link
                        to={`/admin/schedule/${r.id}`}
                        className="text-red-600 font-bold hover:underline"
                      >
                        編集
                      </Link>
                      <button
                        type="button"
                        onClick={() => void remove(r.id)}
                        className="text-gray-400 hover:text-red-600 font-semibold"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="p-8 text-center text-gray-400">
              行がありません。SQL で <code>broadcast_races</code> を作成後、追加してください。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
