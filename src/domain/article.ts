export interface Article {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** 画面上の「2024年3月15日」形式 */
  date: string;
  /** YYYY-MM-DD */
  publishedAt: string;
  image: string;
  body: string;
  /** 管理者画面用 */
  published?: boolean;
}

export type NewsArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  image_url: string;
  body: string;
  published: boolean;
};

export function formatDateJaYYYYMMDD(isoDate: string): string {
  const d = new Date(isoDate.endsWith("Z") ? isoDate : `${isoDate}T12:00:00`);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function articleFromNewsRow(row: NewsArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    publishedAt: row.published_at.slice(0, 10),
    date: formatDateJaYYYYMMDD(row.published_at.slice(0, 10)),
    image: row.image_url,
    body: row.body,
    published: row.published,
  };
}
