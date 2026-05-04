import { useEffect, useState } from "react";
import type { MergedCategory } from "../data/contentsCatalog";
import { fetchMergedContentCategories } from "../services/contentSpotsService";

export function useMergedContents() {
  const [categories, setCategories] = useState<MergedCategory[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMergedContentCategories();
        if (!cancelled) setCategories(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}
