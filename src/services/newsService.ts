import { articleFromNewsRow, type Article, type NewsArticleRow } from "../domain/article";
import { fallbackArticles } from "../data/fallbackArticles";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function fallbackArticlesSorted(): Article[] {
  return [...fallbackArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function fetchPublishedArticles(): Promise<{ data: Article[]; source: "db" | "fallback" }>
{
  if (!isSupabaseConfigured || !supabase) {
    return { data: fallbackArticlesSorted(), source: "fallback" };
  }

  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    if (error) console.warn("[newsService]", error.message);
    return { data: data?.length ? (data as NewsArticleRow[]).map(articleFromNewsRow) : [], source: "db" };
  }

  return { data: (data as NewsArticleRow[]).map(articleFromNewsRow), source: "db" };
}

export async function fetchPublishedArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  if (!slug) return undefined;

  if (!isSupabaseConfigured || !supabase) {
    return fallbackArticlesSorted().find((a) => a.slug === slug);
  }

  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.warn("[newsService]", error.message);
    return undefined;
  }
  if (!data) return undefined;
  return articleFromNewsRow(data as NewsArticleRow);
}

export async function fetchAllArticlesAdmin(): Promise<NewsArticleRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as NewsArticleRow[];
}

export async function fetchArticleRowAdmin(id: string): Promise<NewsArticleRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("news_articles").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return data as NewsArticleRow | null;
}

export type NewsArticleInsert = Pick<
  NewsArticleRow,
  "slug" | "title" | "excerpt" | "category" | "published_at" | "image_url" | "body" | "published"
>;

export async function insertArticleAdmin(payload: NewsArticleInsert) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase.from("news_articles").insert(payload);
  if (error) throw new Error(error.message);
}

export type NewsArticlePatch = Partial<
  Pick<
    NewsArticleRow,
    "slug" | "title" | "excerpt" | "category" | "published_at" | "image_url" | "body" | "published"
  >
>;

export async function updateArticleAdmin(id: string, patch: NewsArticlePatch) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase
    .from("news_articles")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteArticleAdmin(id: string) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase.from("news_articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
