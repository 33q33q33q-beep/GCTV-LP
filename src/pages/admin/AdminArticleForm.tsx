import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { slugifyForUrl } from "../../lib/slugify";
import CmsImageField from "../../components/admin/CmsImageField";
import {
  fetchArticleRowAdmin,
  insertArticleAdmin,
  updateArticleAdmin,
} from "../../services/newsService";

export default function AdminArticleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  /** `news/new` ルートでは :id が無く undefined になるため両方判定する */
  const isCreate = !id || id === "new";

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("お知らせ");
  const [publishedAt, setPublishedAt] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [imageUrl, setImageUrl] = useState("");
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  /** 新規のみ: スラッグをユーザーが手で変えたらタイトル連動を止める */
  const slugLockedRef = useRef(false);

  useEffect(() => {
    if (isCreate || !id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setMsg(null);
      try {
        const row = await fetchArticleRowAdmin(id);
        if (cancelled) return;
        if (!row) {
          setMsg("記事が見つかりません");
          return;
        }
        setSlug(row.slug);
        setTitle(row.title);
        setExcerpt(row.excerpt);
        setCategory(row.category);
        setPublishedAt(row.published_at.slice(0, 10));
        setImageUrl(row.image_url);
        setBody(row.body);
        setPublished(row.published);
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

  useEffect(() => {
    if (isCreate) {
      slugLockedRef.current = false;
    }
  }, [isCreate]);

  const suggestSlug = () => {
    slugLockedRef.current = false;
    setSlug(slugifyForUrl(title));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const slugForSave = isCreate
        ? (slug.trim() || slugifyForUrl(title.trim()))
        : slug.trim();
      if (isCreate) {
        await insertArticleAdmin({
          slug: slugForSave,
          title: title.trim(),
          excerpt: excerpt.trim(),
          category: category.trim(),
          published_at: publishedAt,
          image_url: imageUrl.trim(),
          body: body.trim(),
          published,
        });
      } else if (id) {
        await updateArticleAdmin(id, {
          slug: slugForSave,
          title: title.trim(),
          excerpt: excerpt.trim(),
          category: category.trim(),
          published_at: publishedAt,
          image_url: imageUrl.trim(),
          body: body.trim(),
          published,
        });
      }
      navigate("/admin/news");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-400">読み込み中…</p>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/news" className="text-sm font-bold text-gray-500 hover:text-red-600">
          ← 一覧
        </Link>
        <h1 className="text-2xl font-black text-gray-900">
          {isCreate ? "記事の新規作成" : "記事の編集"}
        </h1>
      </div>

      <form onSubmit={submit} className="space-y-5 bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">タイトル</label>
          <input
            value={title}
            onChange={(e) => {
              const v = e.target.value;
              setTitle(v);
              if (isCreate && !slugLockedRef.current) {
                setSlug(slugifyForUrl(v));
              }
            }}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          {isCreate && (
            <p className="mt-1 text-xs text-gray-400">
              スラッグはタイトルから自動で付きます。下のスラッグ欄を編集すると自動更新を止められます。
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              スラッグ（URL）{isCreate ? "　※自動" : ""}
            </label>
            <div className="flex gap-2">
              <input
                value={slug}
                onChange={(e) => {
                  slugLockedRef.current = true;
                  setSlug(e.target.value);
                }}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
                placeholder="タイトル入力で自動生成"
              />
              <button
                type="button"
                onClick={suggestSlug}
                className="shrink-0 text-xs font-bold text-red-600 px-2"
                title="タイトルからスラッグを再生成（自動連動を再開）"
              >
                自動
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">公開日</label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">カテゴリ</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 mt-6 md:mt-8 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span className="text-sm font-semibold text-gray-700">公開する</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">リード（抜粋）</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <CmsImageField
          label="画像"
          value={imageUrl}
          onChange={setImageUrl}
          folder="news"
          required
          hint="アップロードすると公開 URL が自動入力されます。"
        />

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">
            本文（空行で段落）
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={14}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono leading-relaxed"
          />
        </div>

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
            to="/admin/news"
            className="inline-flex items-center px-8 py-3 text-gray-600 font-bold hover:text-gray-900"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
