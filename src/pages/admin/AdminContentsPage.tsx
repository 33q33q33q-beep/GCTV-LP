import { useEffect, useMemo, useState } from "react";
import CmsImageField from "../../components/admin/CmsImageField";
import {
  CONTENT_CATEGORY_ORDER,
  type ContentCategoryKey,
  type ContentSpotRowDb,
} from "../../data/contentsCatalog";
import { fetchSpotsAdmin, upsertContentSpot } from "../../services/contentSpotsService";

type EditorRow = {
  category_key: ContentCategoryKey;
  position: number;
  title: string;
  url: string;
  thumbnail_url: string;
  duration: string;
};

function buildEditors(rows: ContentSpotRowDb[]): EditorRow[] {
  return CONTENT_CATEGORY_ORDER.flatMap((cat) =>
    cat.defaultVideos.map((dv, position) => {
      const spot = rows.find((r) => r.category_key === cat.key && r.position === position);
      return {
        category_key: cat.key,
        position,
        title: spot?.title ?? dv.title,
        url: spot?.url ?? dv.url,
        thumbnail_url: spot?.thumbnail_url ?? dv.thumbnail,
        duration: spot?.duration ?? dv.duration,
      };
    }),
  );
}

export default function AdminContentsPage() {
  const catalogByKey = useMemo(
    () => Object.fromEntries(CONTENT_CATEGORY_ORDER.map((c) => [c.key, c])) as Record<
      ContentCategoryKey,
      (typeof CONTENT_CATEGORY_ORDER)[0]
    >,
    [],
  );

  const [editors, setEditors] = useState<EditorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchSpotsAdmin();
        if (!cancelled) setEditors(buildEditors(rows));
      } catch (e) {
        if (!cancelled) setMsg(e instanceof Error ? e.message : "読み込み失敗");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateRow = (
    category_key: ContentCategoryKey,
    position: number,
    field: keyof Omit<EditorRow, "category_key" | "position">,
    value: string,
  ) => {
    setEditors((prev) =>
      prev.map((row) =>
        row.category_key === category_key && row.position === position
          ? { ...row, [field]: value }
          : row,
      ),
    );
  };

  const saveAll = async () => {
    setSaving(true);
    setMsg(null);
    try {
      for (const row of editors) {
        await upsertContentSpot({
          category_key: row.category_key,
          position: row.position,
          title: row.title,
          url: row.url,
          thumbnail_url: row.thumbnail_url,
          duration: row.duration,
        });
      }
      setMsg("保存しました。公開サイトを再読み込みすると反映されます。");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const grouped = useMemo(() => {
    const out: Record<ContentCategoryKey, EditorRow[]> = {
      race_interview: [],
      news_information: [],
      variety_beginner: [],
    };
    editors.forEach((row) => {
      out[row.category_key].push(row);
    });
    Object.keys(out).forEach((k) => {
      out[k as ContentCategoryKey].sort((a, b) => a.position - b.position);
    });
    return out;
  }, [editors]);

  if (loading) return <p className="text-gray-400">読み込み中…</p>;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Contents / 動画リンク</h1>
      <p className="text-sm text-gray-500 mb-8">
        各カテゴリ3枠ずつ（計9スロット）のタイトル・URL・サムネイル・尺を編集できます。保存するとサイトの
        Contents セクションに反映されます。
      </p>

      {msg && (
        <div
          className={`mb-6 text-sm rounded-xl px-4 py-3 ${
            msg.startsWith("保存しました")
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {msg}
        </div>
      )}

      <div className="space-y-10">
        {(Object.keys(grouped) as ContentCategoryKey[]).map((key) => (
          <section key={key} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-black text-gray-900">
                {catalogByKey[key].emoji} {catalogByKey[key].title}
              </h2>
              <p className="text-xs text-gray-500">{catalogByKey[key].subtitle}</p>
            </div>
            <div className="space-y-8">
              {grouped[key].map((row) => (
                <div
                  key={`${row.category_key}_${row.position}`}
                  className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3"
                >
                  <p className="text-xs font-bold text-gray-400">スロット {row.position + 1}</p>
                  <div>
                    <label className="text-xs font-bold text-gray-500">タイトル</label>
                    <input
                      value={row.title}
                      onChange={(e) => updateRow(row.category_key, row.position, "title", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">URL</label>
                    <input
                      value={row.url}
                      onChange={(e) => updateRow(row.category_key, row.position, "url", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-xs"
                    />
                  </div>
                  <CmsImageField
                    label="サムネイル"
                    value={row.thumbnail_url}
                    onChange={(url) =>
                      updateRow(row.category_key, row.position, "thumbnail_url", url)
                    }
                    folder="contents"
                  />
                  <div>
                    <label className="text-xs font-bold text-gray-500">尺（表示用）</label>
                    <input
                      value={row.duration}
                      onChange={(e) =>
                        updateRow(row.category_key, row.position, "duration", e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      placeholder="LIVE / 45:32 など"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 sticky bottom-4 bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 flex justify-end shadow-lg">
        <button
          type="button"
          disabled={saving}
          onClick={() => void saveAll()}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black px-8 py-3 rounded-xl"
        >
          {saving ? "保存中…" : "すべて保存"}
        </button>
      </div>
    </div>
  );
}
