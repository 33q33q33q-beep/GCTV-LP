/** 静的HTMLパッケージ用ビルド（`npm run build:public-package`） */
export const IS_STANDALONE = import.meta.env.VITE_STANDALONE === "true";
/** true のときのみ管理画面ルートを除外（通常の公開 ZIP では含める） */
export const IS_STANDALONE_NO_ADMIN =
  import.meta.env.VITE_STANDALONE_NO_ADMIN === "true";
