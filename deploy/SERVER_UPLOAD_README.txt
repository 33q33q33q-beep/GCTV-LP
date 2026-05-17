GCTV 静的サイト（HTMLパッケージ）— WEB屋さん向け
================================================

■ 中身
  index.html … トップのHTML（エントリ）
  assets/ … JavaScript・CSS（公開ページ＋管理画面 CMS を含む）
  pkg-media/ … 同梱画像
  gachineko/ … マスコットPNG
  community/ … 画像など
  htaccess.txt … Apache 用（.htaccess にリネームして使用）
  CMS_README.txt … 管理画面のURL・Supabase の注意

■ 管理画面（CMS）
  https://（あなたのドメイン）/admin/login
  詳細は CMS_README.txt を参照。

■ アップロード方法
  1. ZIP を解凍する
  2. 解凍した中身すべてを公開フォルダ（public_html 等）に置く
  3. index.html と assets/ が同じ階層にあることを確認
  4. ブラウザでトップと /admin/login を開いて確認

■ 注意
  - file:// では動きません。HTTP(S) で確認してください。
  - .json ファイルは同梱していません（設定はビルド時に JS へ埋め込み済み）。
