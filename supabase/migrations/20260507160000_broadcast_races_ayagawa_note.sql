-- 5/31 綾川町ロードレースに COPPA 表記を追記（既存DB向け）
update public.broadcast_races
set note = '(COPPA AYAGAWA)'
where race_date = '2026-05-31'::date
  and title = 'E1 E2 E3';
