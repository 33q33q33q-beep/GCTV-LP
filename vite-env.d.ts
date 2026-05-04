/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** SnapWidget・Elfsight 等が出すInstagramフィード iframe の URL（自動更新） */
  readonly VITE_INSTAGRAM_FEED_IFRAME_URL?: string;
  /** TikTok creator 埋め込みの @ユーザー名（例: gachinkocycletv_gctv） */
  readonly VITE_TIKTOK_USERNAME?: string;
  /** X 埋め込みタイムラインの完全 URL（未設定時は twitter.com/GachinkoCycleTV?ref_src=…） */
  readonly VITE_TWITTER_TIMELINE_HREF?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __BASE_PATH__: string;
declare const __IS_PREVIEW__: boolean;
declare const __READDY_PROJECT_ID__: string;
declare const __READDY_VERSION_ID__: string;
declare const __READDY_AI_DOMAIN__: string;
