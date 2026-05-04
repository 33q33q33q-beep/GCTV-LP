import { useEffect, useState } from "react";
import type { Article } from "../domain/article";
import { fetchPublishedArticles } from "../services/newsService";

export function usePublishedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"db" | "fallback" | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, source: s } = await fetchPublishedArticles();
        if (!cancelled) {
          setArticles(data);
          setSource(s);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { articles, loading, source };
}
