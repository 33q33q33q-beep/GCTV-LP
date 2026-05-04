import type { ShortsGalleryItemRow, ShortsGallerySettingsRow } from "../domain/shortsGallery";

export const fallbackGallerySettings: ShortsGallerySettingsRow = {
  id: 1,
  footer_tiktok_url: "https://www.tiktok.com/@gachinkocycletv_gctv",
  footer_youtube_shorts_url: "https://www.youtube.com/@GachinkoCycleTV/shorts",
};

/** Supabase 未設定／空のときのデモ行 */
export const fallbackGalleryItems: ShortsGalleryItemRow[] = [
  {
    id: "fb-1",
    title: "ゴールスプリント決定的瞬間",
    thumbnail_url:
      "https://readdy.ai/api/search-image?query=vertical%20format%20cycling%20race%20exciting%20moment%2C%20short%20form%20video%20content%20style%2C%20dynamic%20action%20shot%20for%20social%20media&width=300&height=533&seq=shorts-1&orientation=portrait",
    video_url: "https://www.youtube.com/@GachinkoCycleTV/shorts",
    views_label: "125K",
    sort_order: 0,
    published: true,
  },
  {
    id: "fb-2",
    title: "特派員の絶景ポイント",
    thumbnail_url:
      "https://readdy.ai/api/search-image?query=vertical%20format%20female%20cyclist%20enjoying%20beautiful%20scenery%2C%20instagram%20reels%20style%20content%2C%20cheerful%20and%20bright%20atmosphere&width=300&height=533&seq=shorts-2&orientation=portrait",
    video_url: "https://www.youtube.com/@GachinkoCycleTV/shorts",
    views_label: "98K",
    sort_order: 1,
    published: true,
  },
  {
    id: "fb-3",
    title: "プロが教える走行テクニック",
    thumbnail_url:
      "https://readdy.ai/api/search-image?query=vertical%20format%20cycling%20tips%20and%20tricks%20demonstration%2C%20educational%20short%20video%20style%2C%20clear%20instructional%20content&width=300&height=533&seq=shorts-3&orientation=portrait",
    video_url: "https://www.youtube.com/@GachinkoCycleTV/shorts",
    views_label: "156K",
    sort_order: 2,
    published: true,
  },
  {
    id: "fb-4",
    title: "サイクリンググルメ",
    thumbnail_url:
      "https://readdy.ai/api/search-image?query=vertical%20format%20delicious%20cycling%20gourmet%20food%20close%20up%2C%20appetizing%20meal%20presentation%20for%20social%20media%2C%20food%20photography&width=300&height=533&seq=shorts-4&orientation=portrait",
    video_url: "https://www.youtube.com/@GachinkoCycleTV/shorts",
    views_label: "87K",
    sort_order: 3,
    published: true,
  },
];
