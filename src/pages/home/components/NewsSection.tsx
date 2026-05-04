import { useState } from "react";
import { Link } from "react-router-dom";
import GachinekoSticker from "../../../components/GachinekoSticker";
import { usePublishedArticles } from "../../../hooks/usePublishedArticles";

export default function NewsSection() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const { articles, loading } = usePublishedArticles();
  const newsItems = articles.slice(0, 3);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 relative">
          <div className="absolute -left-1 md:left-2 top-0 w-28 md:w-36 lg:w-40 pointer-events-none opacity-95">
            <GachinekoSticker variant="ohayon" className="w-full h-auto" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="text-red-600">Latest News</span>
          </h2>
          <p className="text-gray-500 text-lg">GCTVからの最新情報・レポート</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4"></div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-16">読み込み中…</p>
        ) : newsItems.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            記事がありません。管理画面または Supabase で記事を追加してください。
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {newsItems.map((item) => (
              <Link
                key={item.slug}
                to={`/articles/${item.slug}`}
                className="group block cursor-pointer"
                onMouseEnter={() => setHoveredSlug(item.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                <div
                  className={`bg-gray-50 rounded-3xl overflow-hidden transition-all duration-300 ${
                    hoveredSlug === item.slug ? "transform -translate-y-2" : ""
                  }`}
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <i className="ri-calendar-line"></i>
                      <time dateTime={item.publishedAt}>{item.date}</time>
                    </div>

                    <h3 className="text-gray-900 font-bold text-lg leading-snug mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                      {item.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-red-600 font-bold text-sm group-hover:gap-3 transition-all">
                      <span>記事を読む</span>
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/articles"
            className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-article-line text-xl"></i>
            すべての記事を見る
          </Link>
          <p className="mt-6 text-gray-400 text-sm">
            コラム・読みものは{" "}
            <a
              href="https://note.com/gctv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-semibold underline-offset-4 hover:underline"
            >
              note（magazine）
            </a>{" "}
            でも公開中
          </p>
        </div>
      </div>
    </section>
  );
}
