import { mergeContentCategories, type ContentSpotRowDb } from "../data/contentsCatalog";
import { applyMergedCategories } from "../lib/applyStandaloneMedia";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export async function fetchMergedContentCategories() {
  if (!isSupabaseConfigured || !supabase) {
    return applyMergedCategories(mergeContentCategories([]));
  }

  const { data, error } = await supabase
    .from("content_spots")
    .select("id,category_key,position,title,url,thumbnail_url,duration");

  if (error) {
    console.warn("[contentSpotsService]", error.message);
    return applyMergedCategories(mergeContentCategories([]));
  }

  return applyMergedCategories(mergeContentCategories((data ?? []) as ContentSpotRowDb[]));
}

export async function fetchSpotsAdmin(): Promise<ContentSpotRowDb[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("content_spots")
    .select("id,category_key,position,title,url,thumbnail_url,duration")
    .order("category_key", { ascending: true })
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ContentSpotRowDb[];
}

export async function upsertContentSpot(payload: {
  category_key: string;
  position: number;
  title: string;
  url: string;
  thumbnail_url: string;
  duration: string;
}) {
  if (!supabase) throw new Error("Supabase 未設定");
  const { error } = await supabase.from("content_spots").upsert(
    {
      category_key: payload.category_key,
      position: payload.position,
      title: payload.title.trim(),
      url: payload.url.trim(),
      thumbnail_url: payload.thumbnail_url.trim(),
      duration: payload.duration.trim(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "category_key,position" },
  );

  if (error) throw new Error(error.message);
}
