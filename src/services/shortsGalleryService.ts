import {
  fallbackGalleryItems,
  fallbackGallerySettings,
} from "../data/fallbackShortsGallery";
import type { ShortsGalleryItemRow, ShortsGallerySettingsRow } from "../domain/shortsGallery";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export async function fetchPublicGallery(): Promise<{
  items: ShortsGalleryItemRow[];
  settings: ShortsGallerySettingsRow;
  source: "db" | "fallback";
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      items: fallbackGalleryItems,
      settings: fallbackGallerySettings,
      source: "fallback",
    };
  }

  const [itemsRes, settingsRes] = await Promise.all([
    supabase
      .from("shorts_gallery_items")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase.from("shorts_gallery_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  if (itemsRes.error) console.warn("[shortsGalleryService items]", itemsRes.error.message);
  if (settingsRes.error) console.warn("[shortsGalleryService settings]", settingsRes.error.message);

  const items = (itemsRes.data ?? []) as ShortsGalleryItemRow[];
  const settings =
    (settingsRes.data as ShortsGallerySettingsRow | undefined) ?? fallbackGallerySettings;

  return { items, settings, source: "db" };
}

export async function fetchGalleryItemsAdmin(): Promise<ShortsGalleryItemRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("shorts_gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ShortsGalleryItemRow[];
}

export async function fetchGalleryItemAdmin(id: string): Promise<ShortsGalleryItemRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("shorts_gallery_items").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as ShortsGalleryItemRow | null;
}

export async function fetchGallerySettingsAdmin(): Promise<ShortsGallerySettingsRow> {
  if (!supabase) return fallbackGallerySettings;
  const { data, error } = await supabase.from("shorts_gallery_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ShortsGallerySettingsRow) ?? fallbackGallerySettings;
}

export async function saveGallerySettingsAdmin(input: {
  footer_tiktok_url: string;
  footer_youtube_shorts_url: string;
}) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase
    .from("shorts_gallery_settings")
    .update({
      footer_tiktok_url: input.footer_tiktok_url.trim(),
      footer_youtube_shorts_url: input.footer_youtube_shorts_url.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);
}

export async function insertGalleryItemAdmin(payload: {
  title: string;
  thumbnail_url: string;
  video_url: string;
  views_label: string;
  sort_order: number;
  published: boolean;
}) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase.from("shorts_gallery_items").insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateGalleryItemAdmin(
  id: string,
  patch: Partial<Omit<ShortsGalleryItemRow, "id" | "created_at">>,
) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase
    .from("shorts_gallery_items")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteGalleryItemAdmin(id: string) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase.from("shorts_gallery_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
