import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CmsImageField from "../../components/admin/CmsImageField";
import {
  fetchGalleryItemAdmin,
  insertGalleryItemAdmin,
  updateGalleryItemAdmin,
} from "../../services/shortsGalleryService";

export default function AdminShortsItemForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  /** `shorts/new` では useParams の id が undefined になりうる */
  const isCreate = !id || id === "new";

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [viewsLabel, setViewsLabel] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);

  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isCreate || !id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setMsg(null);
      try {
        const row = await fetchGalleryItemAdmin(id);
        if (cancelled) return;
        if (!row) {
          setMsg("データなし");
          return;
        }
        setTitle(row.title);
        setVideoUrl(row.video_url);
        setThumbnailUrl(row.thumbnail_url ?? "");
        setViewsLabel(row.views_label ?? "");
        setSortOrder(row.sort_order ?? 0);
        setPublished(row.published ?? true);
      } catch (e) {
        if (!cancelled) setMsg(e instanceof Error ? e.message : "読込失敗");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isCreate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        title: title.trim(),
        video_url: videoUrl.trim(),
        thumbnail_url: thumbnailUrl.trim(),
        views_label: viewsLabel.trim(),
        sort_order: sortOrder,
        published,
      };
      if (!payload.video_url) throw new Error("動画URLは必須です");

      if (isCreate) {
        await insertGalleryItemAdmin(payload);
      } else if (id) {
        await updateGalleryItemAdmin(id, payload);
      }
      navigate("/admin/shorts");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "保存失敗");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400">読み込み中…</p>;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/shorts" className="text-sm font-bold text-gray-500 hover:text-red-600 mb-6 inline-block">
        ← 一覧
      </Link>
      <h1 className="text-2xl font-black text-gray-900 mb-8">
        {isCreate ? "ギャラリーカードの新規作成" : "ギャラリーカードを編集"}
      </h1>

      <form onSubmit={submit} className="space-y-4 bg-white rounded-2xl border border-gray-200 p-8">
        <div>
          <label className="text-xs font-bold text-gray-500">タイトル</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">
            動画URL（TikTok / YouTube Shorts など）
          </label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
            placeholder="https://www.tiktok.com/@..."
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono text-xs"
          />
        </div>
        <CmsImageField
          label="サムネイル画像（空なら自動プレースホルダ）"
          value={thumbnailUrl}
          onChange={setThumbnailUrl}
          folder="shorts"
          hint="未設定なら一覧ではプレースホルダー表示になります。"
        />
        <div>
          <label className="text-xs font-bold text-gray-500">
            表示用ラベル（例: 「125万回視聴」「任意」）
          </label>
          <input
            value={viewsLabel}
            onChange={(e) => setViewsLabel(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="表示しないときは空欄でOK"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">並び順（小さいほど左）</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <span className="text-sm font-semibold">公開</span>
        </label>

        {msg && <p className="text-sm text-red-600">{msg}</p>}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 text-white font-black px-8 py-3 rounded-xl disabled:opacity-50"
          >
            {saving ? "保存中…" : "保存"}
          </button>
          <Link to="/admin/shorts" className="px-8 py-3 text-gray-600 font-bold">
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
