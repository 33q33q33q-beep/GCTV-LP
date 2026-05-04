import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDateJaYYYYMMDD, type NewsArticleRow } from "../../domain/article";
import { deleteArticleAdmin, fetchAllArticlesAdmin } from "../../services/newsService";

export default function AdminNewsPage() {
  const [rows, setRows] = useState<NewsArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await fetchAllArticlesAdmin();
      setRows(data);
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
    if (!confirm("この記事を削除しますか？")) return;
    try {
      await deleteArticleAdmin(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-black text-gray-900">NEWS 記事</h1>
        <Link
          to="/admin/news/new"
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
                <th className="px-4 py-3">公開日</th>
                <th className="px-4 py-3">タイトル</th>
                <th className="px-4 py-3">スラッグ</th>
                <th className="px-4 py-3">公開</th>
                <th className="px-4 py-3 w-40">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {formatDateJaYYYYMMDD(r.published_at.slice(0, 10))}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 max-w-xs truncate">
                    {r.title}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.slug}</td>
                  <td className="px-4 py-3">{r.published ? "○" : "—"}</td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    <Link
                      to={`/admin/news/${r.id}`}
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
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="p-8 text-center text-gray-400">記事がありません。新規作成してください。</p>
          )}
        </div>
      )}
    </div>
  );
}
