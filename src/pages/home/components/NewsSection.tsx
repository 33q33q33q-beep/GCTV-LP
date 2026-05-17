import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePublishedArticles } from "../../../hooks/usePublishedArticles";

export default function NewsSection() {
  const { t } = useTranslation();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const { articles, loading } = usePublishedArticles();
  const newsItems = articles.slice(0, 3);

  return (
    <section id="latest-news" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="text-red-600">Latest News</span>
          </h2>
          <p className="text-gray-500 text-lg">{t("news.subtitle")}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4"></div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-16">{t("common.loading")}</p>
        ) : newsItems.length === 0 ? (
          <p className="text-center text-gray-500 py-16">{t("news.noArticlesCmsHint")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {newsItems.map((item) => (
              <Link
                key={item.slug}
                to={`/articles/${item.slug}`}
                className="group flex h-full cursor-pointer"
                onMouseEnter={() => setHoveredSlug(item.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                <div
                  className={`flex h-full w-full flex-col overflow-hidden rounded-3xl bg-gray-50 transition-all duration-300 ${
                    hoveredSlug === item.slug ? "transform -translate-y-2" : ""
                  }`}
                >
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                      <i className="ri-calendar-line"></i>
                      <time dateTime={item.publishedAt}>{item.date}</time>
                    </div>

                    <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-red-600">
                      {item.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">{item.excerpt}</p>

                    <div className="mt-auto flex items-center gap-2 text-sm font-bold text-red-600 transition-all group-hover:gap-3">
                      <span>{t("articles.readMore")}</span>
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
            {t("news.seeAll")}
          </Link>
          <p className="mt-6 text-gray-400 text-sm">
            {t("news.noteLine.before")}
            <a
              href="https://note.com/gctv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-semibold underline-offset-4 hover:underline"
            >
              {t("articles.noteMagazineLink")}
            </a>
            {t("news.noteLine.after")}
          </p>
        </div>
      </div>
    </section>
  );
}
