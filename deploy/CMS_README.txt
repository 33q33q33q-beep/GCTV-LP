GCTV 管理画面（CMS）— 設置・運用メモ
====================================

■ 管理画面のURL（ビルド同梱）
  /admin/login … ログイン
  /admin/news … 記事（ニュース）
  /admin/contents … コンテンツ枠
  /admin/schedule … 放送スケジュール
  /admin/shorts … ショート動画ギャラリー
  /admin/tokuhain-map … 特派マップ

■ 必要なもの
  - Supabase プロジェクト（URL と anon public key）
  - ビルド前にプロジェクト直下の .env に設定:
      VITE_SUPABASE_URL=...
      VITE_SUPABASE_ANON_KEY=...
  - Supabase 上でマイグレーション適用済みであること
  - ログイン用ユーザーの profiles.is_admin = true

■ ZIP の作り方（開発側）
  .env を設定したうえで:
    npm run build:public-package

  Supabase 未設定でビルドした ZIP では、公開ページはデモデータ表示、
  管理画面はログインできません。必ず .env を入れてから作り直してください。

■ サーバー側
  公開サイトと同じフォルダに置きます（別フォルダ不要）。
  /admin/* も index.html にフォールバックするよう .htaccess（htaccess.txt）を有効にしてください。
