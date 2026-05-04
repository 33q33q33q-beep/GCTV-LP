import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CmsImageField from "../../components/admin/CmsImageField";
import JapanMapPinPicker from "../../components/admin/JapanMapPinPicker";
import {
  fetchTokuhainPinAdmin,
  fetchTokuhainPinsAdmin,
  insertTokuhainPinAdmin,
  updateTokuhainPinAdmin,
} from "../../services/tokuhainMapService";

export default function AdminTokuhainPinForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreate = id === "new";

  const [placeTitle, setPlaceTitle] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [description, setDescription] = useState("");
  const [pinX, setPinX] = useState(52);
  const [pinY, setPinY] = useState(55);
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [otherPins, setOtherPins] = useState<{ x: number; y: number; label?: string }[]>([]);

  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await fetchTokuhainPinsAdmin();
        if (cancelled) return;
        const others = all
          .filter((row) => (isCreate ? true : row.id !== id))
          .map((row) => ({
            x: row.pin_x_percent,
            y: row.pin_y_percent,
            label: row.place_title,
          }));
        setOtherPins(others);
      } catch {
        /* 一覧エラーでもフォーム単体編集は可能に */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isCreate]);

  useEffect(() => {
    if (isCreate || !id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setMsg(null);
      try {
        const row = await fetchTokuhainPinAdmin(id);
        // Strict Mode ではクリーンアップ後に古いリクエストが返る。cancelled のときは state を触らない
        if (cancelled) return;
        if (!row) {
          setMsg("データが見つかりません");
          return;
        }
        setPlaceTitle(row.place_title);
        setReporterName(row.reporter_name);
        setImageUrl(row.image_url);
        setLinkUrl(row.link_url);
        setDescription(row.description);
        setPinX(Number(row.pin_x_percent));
        setPinY(Number(row.pin_y_percent));
        setSortOrder(row.sort_order);
        setPublished(row.published);
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
      const trimmedLink = linkUrl.trim();
      if (!trimmedLink) throw new Error("リンクURLは必須です");

      const clampPinPct = (n: number) => {
        if (!Number.isFinite(n)) return 50;
        return Math.round(Math.min(100, Math.max(0, n)) * 1000) / 1000;
      };
      const safeSort = Number.isFinite(sortOrder) ? Math.trunc(sortOrder) : 0;

      const payload = {
        place_title: placeTitle.trim(),
        reporter_name: reporterName.trim(),
        image_url: imageUrl.trim(),
        link_url: trimmedLink,
        description: description.trim(),
        pin_x_percent: clampPinPct(pinX),
        pin_y_percent: clampPinPct(pinY),
        sort_order: safeSort,
        published,
      };

      if (isCreate) {
        await insertTokuhainPinAdmin(payload);
      } else if (id) {
        await updateTokuhainPinAdmin(id, payload);
      }
      navigate("/admin/tokuhain-map");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "保存失敗");
    } finally {
      setSaving(false);
    }
  };

  if (!id) return <p className="text-gray-400">不正なパスです</p>;
  if (loading) return <p className="text-gray-400">読み込み中…</p>;

  return (
    <div className="max-w-6xl">
      <Link
        to="/admin/tokuhain-map"
        className="text-sm font-bold text-gray-500 hover:text-red-600 mb-6 inline-block"
      >
        ← 一覧
      </Link>
      <h1 className="text-2xl font-black text-gray-900 mb-8">
        {isCreate ? "特派員マップ・ピンの新規作成" : "特派員マップ・ピンを編集"}
      </h1>

      <form onSubmit={submit} className="space-y-6 bg-white rounded-2xl border border-gray-200 p-8">
        <JapanMapPinPicker pinX={pinX} pinY={pinY} onChange={(x, y) => { setPinX(x); setPinY(y); }} otherPins={otherPins} />

        <div>
          <label className="text-xs font-bold text-gray-500">場所タイトル（例: 香川県小豆島）</label>
          <input
            value={placeTitle}
            onChange={(e) => setPlaceTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">特派員名</label>
          <input
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <CmsImageField
          label="アイコン画像（ピンに表示）"
          value={imageUrl}
          onChange={setImageUrl}
          folder="tokuhain"
          hint="顔写真など。空欄のままならトップのプレースホルダー表示になります。"
        />
        <div>
          <label className="text-xs font-bold text-gray-500">リンク先URL（クリックで開く）</label>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            required
            placeholder="https://www.youtube.com/..."
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">説明文（カードに表示）</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">並び順（小さいほど先頭）</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <span className="text-sm font-semibold">公開（オフだとサイトに表示されません）</span>
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
          <Link to="/admin/tokuhain-map" className="px-8 py-3 text-gray-600 font-bold">
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
