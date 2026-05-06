import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Article } from "../../domain/article";
import { fetchPublishedArticleBySlug } from "../../services/newsService";
import NotFound from "../NotFound";

const SITE_NAME = "GCTV";

export default function ArticleDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setArticle(null);
      return;
    }
    (async () => {
      const a = await fetchPublishedArticleBySlug(slug);
      if (!cancelled) setArticle(a ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (article === undefined || article === null) return;
    document.title = `${article.title} | ${SITE_NAME}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", article.excerpt);

    return () => {
      document.title = SITE_NAME;
    };
  }, [article]);

  if (article === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-400">
        {t("article.loading")}
      </div>
    );
  }

  if (article === null) {
    return <NotFound />;
  }

  const paragraphs = article.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-wrap gap-4 justify-between items-center">
          <Link
            to="/articles"
            className="text-gray-600 hover:text-red-600 font-semibold inline-flex items-center gap-2 transition-colors text-sm"
          >
            <i className="ri-arrow-left-line" />
            {t("article.backToIndex")}
          </Link>
          <Link to="/" className="text-gray-400 hover:text-gray-700 text-sm">
            {t("articles.backHome")}
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <div className="mb-6 flex flex-wrap gap-2 items-center text-sm">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">{article.category}</span>
          <time dateTime={article.publishedAt} className="text-gray-400 flex items-center gap-1">
            <i className="ri-calendar-line" />
            {article.date}
          </time>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">{article.title}</h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-10">{article.excerpt}</p>

        <div className="relative overflow-hidden rounded-2xl aspect-video mb-10">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-gray max-w-none">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx} className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-14 pt-10 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4">{t("article.relatedLinks")}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://note.com/gctv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 font-semibold px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors text-sm"
            >
              note magazine
              <i className="ri-external-link-line" />
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
