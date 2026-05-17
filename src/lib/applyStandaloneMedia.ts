import type { Article } from "../domain/article";
import type { MergedCategory } from "../data/contentsCatalog";
import type { ShortsGalleryItemRow } from "../domain/shortsGallery";
import type { TokuhainMapPinRow } from "../domain/tokuhainMapPin";
import { packageAsset } from "./packageAsset";
import { IS_STANDALONE } from "./standalone";

export function applyArticleMedia(articles: Article[]): Article[] {
  if (!IS_STANDALONE) return articles;
  return articles.map((a) => ({ ...a, image: packageAsset(a.image) }));
}

export function applyTokuhainPinMedia(rows: TokuhainMapPinRow[]): TokuhainMapPinRow[] {
  if (!IS_STANDALONE) return rows;
  return rows.map((r) => ({ ...r, image_url: packageAsset(r.image_url) }));
}

export function applyMergedCategories(categories: MergedCategory[]): MergedCategory[] {
  if (!IS_STANDALONE) return categories;
  return categories.map((cat) => ({
    ...cat,
    videos: cat.videos.map((v) => ({
      ...v,
      thumbnail: packageAsset(v.thumbnail),
    })),
  }));
}

export function applyShortsGalleryItems(items: ShortsGalleryItemRow[]): ShortsGalleryItemRow[] {
  if (!IS_STANDALONE) return items;
  return items.map((item) => ({
    ...item,
    thumbnail_url: packageAsset(item.thumbnail_url),
  }));
}
