import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ShortsGalleryItemRow, ShortsGallerySettingsRow } from "../../domain/shortsGallery";
import {
  deleteGalleryItemAdmin,
  fetchGalleryItemsAdmin,
  fetchGallerySettingsAdmin,
  saveGallerySettingsAdmin,
} from "../../services/shortsGalleryService";

export default function AdminShortsGalleryPage() {
  const [items, setItems] = useState<ShortsGalleryItemRow[]>([]);
  const [footerTiktok, setFooterTiktok] = useState("");
  const [footerShorts, setFooterShorts] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingFooter, setSavingFooter] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const applySettings = useCallback((s: ShortsGallerySettingsRow) => {
    setFooterTiktok(s.footer_tiktok_url);
    setFooterShorts(s.footer_youtube_shorts_url);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [list, s] = await Promise.all([fetchGalleryItemsAdmin(), fetchGallerySettingsAdmin()]);
      setItems(list);
      applySettings(s);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "読み込み失敗");
    } finally {
      setLoading(false);
    }
  }, [applySettings]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFooter(true);
    setMsg(null);
    try {
      await saveGallerySettingsAdmin({
        footer_tiktok_url: footerTiktok,
        footer_youtube_shorts_url: footerShorts,
      });
      setMsg("下部ボタンのURLを保存しました");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "保存失敗");
    } finally {
      setSavingFooter(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("このカードを削除しますか？")) return;
    try {
      await deleteGalleryItemAdmin(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "削除失敗");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">TikTok &amp; Shorts ギャラリー</h1>
          <p className="text-sm text-gray-500 mt-1">
            各カードの「動画URL」は TikTok または YouTube Shorts のリンクを貼り付け可能です。サムネは空ならプレースホルダー表示。
          </p>
        </div>
        <Link
          to="/admin/shorts/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl"
        >
          <i className="ri-add-line" />
          カードを追加
        </Link>
      </div>

      {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
      {msg && <p className="mb-4 text-sm text-emerald-700">{msg}</p>}

      <form
        onSubmit={saveFooter}
        className="mb-10 bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
      >
        <h2 className="font-black text-gray-900">下部の「もっと見る」ボタン</h2>
        <div>
          <label className="text-xs font-bold text-gray-500">TikTok でもっと見る（URL）</label>
          <input
            value={footerTiktok}
            onChange={(e) => setFooterTiktok(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">Shortsでもっと見る（URL）</label>
          <input
            value={footerShorts}
            onChange={(e) => setFooterShorts(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
            required
          />
        </div>
        <button
          type="submit"
          disabled={savingFooter}
          className="bg-gray-900 text-white font-bold px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {savingFooter ? "保存中…" : "フッターリンクを保存"}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400">読み込み中…</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b">
              <tr>
                <th className="px-4 py-3">順</th>
                <th className="px-4 py-3">タイトル</th>
                <th className="px-4 py-3">動画URL</th>
                <th className="px-4 py-3">公開</th>
                <th className="px-4 py-3 w-32">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                  <td className="px-4 py-3">{r.sort_order}</td>
                  <td className="px-4 py-3 font-semibold max-w-[160px] truncate">{r.title}</td>
                  <td className="px-4 py-3 font-mono text-xs max-w-[220px] truncate">{r.video_url}</td>
                  <td className="px-4 py-3">{r.published ? "○" : "—"}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to={`/admin/shorts/${r.id}`} className="text-red-600 font-bold">
                      編集
                    </Link>
                    <button type="button" onClick={() => void remove(r.id)} className="text-gray-400">
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="p-8 text-center text-gray-400 text-sm">
              カードがありません。SQL でテーブル作成後、「カードを追加」から登録してください。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
