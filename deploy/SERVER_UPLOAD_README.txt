GCTV 静的サイト（HTMLパッケージ）— WEB屋さん向け
================================================

■ 中身
  index.html … トップのHTML（エントリ）
  assets/ … JavaScript・CSS（ファイル名はビルドごとに変わります）
  gachineko/ … 画像（マスコットPNG）
  community/ … 画像など
  _redirects … Netlify 等で SPA 用ルーティングに使える場合があります
  .htaccess … Apache で SPA 用に使える場合があります

■ アップロード方法（一般的）
  1. この ZIP を解凍する
  2. 解凍して出てきた「中身すべて」を、サーバーの公開ディレクトリ
     （例: public_html / www / htdocs など）にそのまま置く
  3. ブラウザで index.html が開ける URL にアクセスする

■ 注意（React / Vite 製の静的サイト）
  - ルート直下に置くのが最も安全です（サブフォルダ配信の場合はサーバ設定が必要なことがあります）。
  - 直接開く file:// では動かない場合があります。必ず HTTP(S) 経由で確認してください。

■ 再生成する場合（開発側）
  プロジェクトで npm ci → npm run build
  → 生成された out/ フォルダが最新の静的ファイルです。
