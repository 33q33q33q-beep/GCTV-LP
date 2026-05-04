import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { TokuhainMapPinRow } from "../../domain/tokuhainMapPin";
import {
  deleteTokuhainPinAdmin,
  fetchTokuhainPinsAdmin,
} from "../../services/tokuhainMapService";

export default function AdminTokuhainMapPage() {
  const [pins, setPins] = useState<TokuhainMapPinRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      setPins(await fetchTokuhainPinsAdmin());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "読み込み失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("このピンを削除しますか？")) return;
    try {
      await deleteTokuhainPinAdmin(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "削除失敗");
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">GCTV 特派員マップ</h1>
          <p className="text-sm text-gray-500 mt-1">
            日本地図上のピン位置・リンクURL・説明を編集すると、トップのトラベルマップに反映されます（公開にチェックが入っている行のみ）。
          </p>
        </div>
        <Link
          to="/admin/tokuhain-map/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl"
        >
          <i className="ri-add-line" />
          ピンを追加
        </Link>
      </div>

      {err ? (
        <p className="mb-4 text-sm text-red-600 whitespace-pre-wrap">{err}</p>
      ) : null}

      {loading ? (
        <p className="text-gray-400">読み込み中…</p>
      ) : err ? null : pins.length === 0 ? (
        <p className="text-gray-500 text-sm">
          まだピンがありません。「ピンを追加」から作成するか、Supabase でマイグレーション{" "}
          <code className="text-xs bg-gray-100 px-1 rounded">20260206100000_tokuhain_map_pins.sql</code>{" "}
          が実行済みか確認してください。
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-black text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">場所タイトル</th>
                <th className="px-4 py-3">特派員名</th>
                <th className="px-4 py-3 hidden md:table-cell">位置 (X/Y%)</th>
                <th className="px-4 py-3">公開</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pins.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-bold text-gray-900">{p.place_title}</td>
                  <td className="px-4 py-3">{p.reporter_name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 hidden md:table-cell">
                    {p.pin_x_percent.toFixed(1)} / {p.pin_y_percent.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="text-emerald-700 font-bold text-xs">公開</span>
                    ) : (
                      <span className="text-gray-400 font-bold text-xs">下書き</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <Link to={`/admin/tokuhain-map/${p.id}`} className="text-red-600 font-bold hover:underline">
                      編集
                    </Link>
                    <button
                      type="button"
                      onClick={() => void remove(p.id)}
                      className="text-gray-400 hover:text-red-600 font-bold"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
