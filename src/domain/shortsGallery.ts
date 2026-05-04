export interface ShortsGalleryItemRow {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  views_label: string;
  sort_order: number;
  published: boolean;
}

export interface ShortsGallerySettingsRow {
  id: number;
  footer_tiktok_url: string;
  footer_youtube_shorts_url: string;
}
