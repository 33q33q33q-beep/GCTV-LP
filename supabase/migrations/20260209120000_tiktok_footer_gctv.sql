-- フッター「TikTokでもっと見る」の既定アカウントを GCTV 用ハンドルに更新（旧 URL のみ差し替え）

update public.shorts_gallery_settings
set
  footer_tiktok_url = 'https://www.tiktok.com/@gachinkocycletv_gctv',
  updated_at = now()
where footer_tiktok_url = 'https://www.tiktok.com/@gachinkocycletv';
