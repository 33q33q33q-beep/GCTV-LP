import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePublishedArticles } from "../../hooks/usePublishedArticles";

export default function ArticlesListPage() {
  const { t } = useTranslation();
  const { articles: items, loading, source } = usePublishedArticles();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-red-600 font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <i className="ri-arrow-left-line" />
            {t("articles.backHome")}
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-gray-900">
            <span className="text-red-600">{t("articles.listTitleAccent")}</span>
            <span className="text-gray-900">{t("articles.listTitleSuffix")}</span>
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-gray-500 mb-10 max-w-2xl">
          {t("articles.intro.before")}
          <a
            href="https://note.com/gctv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 font-semibold underline-offset-4 hover:underline"
          >
            {t("articles.noteMagazineLink")}
          </a>
          {t("articles.intro.after")}
        </p>

        {source === "fallback" && (
          <p className="mb-8 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            {t("articles.fallbackHint")}
          </p>
        )}

        {loading ? (
          <p className="text-gray-400 py-16">{t("common.loading")}</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 py-16">{t("articles.noArticles")}</p>
        ) : (
          <ul className="flex flex-col gap-8">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/articles/${item.slug}`}
                  className="group flex flex-col sm:flex-row gap-6 rounded-3xl bg-gray-50 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="sm:w-72 shrink-0 aspect-video sm:aspect-auto sm:min-h-[180px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:py-8 sm:pr-8 flex flex-col justify-center flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 items-center text-sm text-gray-400 mb-2">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">{item.category}</span>
                      <span className="flex items-center gap-1">
                        <i className="ri-calendar-line" />
                        {item.date}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{item.excerpt}</p>
                    <span className="text-red-600 font-bold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                      {t("articles.readMore")}
                      <i className="ri-arrow-right-line" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
