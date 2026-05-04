import { useEffect, useState } from "react";
import type { ShortsGalleryItemRow, ShortsGallerySettingsRow } from "../domain/shortsGallery";
import { fetchPublicGallery } from "../services/shortsGalleryService";

export function useShortsGallery() {
  const [items, setItems] = useState<ShortsGalleryItemRow[]>([]);
  const [settings, setSettings] = useState<ShortsGallerySettingsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"db" | "fallback" | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchPublicGallery();
        if (!cancelled) {
          setItems(res.items);
          setSettings(res.settings);
          setSource(res.source);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, settings, loading, source };
}
