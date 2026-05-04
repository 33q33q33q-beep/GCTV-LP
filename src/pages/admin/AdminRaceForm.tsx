import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchRaceAdmin,
  insertRaceAdmin,
  updateRaceAdmin,
} from "../../services/broadcastRacesService";

export default function AdminRaceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  /** `schedule/new` では useParams の id が undefined になりうる */
  const isCreate = !id || id === "new";

  const [raceDate, setRaceDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [note, setNote] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [archiveUrl, setArchiveUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

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
        const row = await fetchRaceAdmin(id);
        if (cancelled) return;
        if (!row) {
          setMsg("データが見つかりません");
          return;
        }
        setRaceDate(row.race_date.slice(0, 10));
        setTitle(row.title);
        setSubtitle(row.subtitle);
        setNote(row.note);
        setLiveUrl(row.live_url);
        setArchiveUrl(row.archive_url);
        setPublished(row.published);
        setSortOrder(row.sort_order);
      } catch (e) {
        if (!cancelled) setMsg(e instanceof Error ? e.message : "読み込み失敗");
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
        race_date: raceDate,
        title: title.trim(),
        subtitle: subtitle.trim(),
        note: note.trim(),
        live_url: liveUrl.trim(),
        archive_url: archiveUrl.trim(),
        published,
        sort_order: sortOrder,
      };
      if (isCreate) {
        await insertRaceAdmin(payload);
      } else if (id) {
        await updateRaceAdmin(id, payload);
      }
      navigate("/admin/schedule");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400">読み込み中…</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/schedule" className="text-sm font-bold text-gray-500 hover:text-red-600">
          ← 一覧
        </Link>
        <h1 className="text-2xl font-black text-gray-900">
          {isCreate ? "レースの新規登録" : "レースの編集"}
        </h1>
      </div>

      <form
        onSubmit={submit}
        className="space-y-5 bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">レース日（公開ページの並び／終了判定に使用）</label>
            <input
              type="date"
              required
              value={raceDate}
              onChange={(e) => setRaceDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              同日内の並び（小さいほど先）
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">タイトル（例: TOJ Stage1）</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">サブタイトル（会場・大会名）</label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">備考（種目・調整中等）</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="例: タイムトライアル、※調整中"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">
            LIVE / 配信ページURL（予定枠にリンク表示。空なら非表示）
          </label>
          <input
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono text-xs"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">
            アーカイブURL（終了枠の「アーカイブ視聴」ボタン）
          </label>
          <input
            value={archiveUrl}
            onChange={(e) => setArchiveUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono text-xs"
            placeholder="https://youtube.com/..."
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span className="text-sm font-semibold text-gray-700">サイトに公開する</span>
        </label>

        {msg && <p className="text-sm text-red-600">{msg}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black px-8 py-3 rounded-xl"
          >
            {saving ? "保存中…" : "保存"}
          </button>
          <Link
            to="/admin/schedule"
            className="inline-flex items-center px-8 py-3 text-gray-600 font-bold hover:text-gray-900"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
