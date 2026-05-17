-- 配信スケジュール（1行＝1レース）
-- 公開側は race_date と「今日（Asia/Tokyo）」を比較して予定／終了を判定

create table if not exists public.broadcast_races (
  id uuid primary key default gen_random_uuid(),
  race_date date not null,
  title text not null,
  subtitle text not null default '',
  note text not null default '',
  live_url text not null default '',
  archive_url text not null default '',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists broadcast_races_date_idx on public.broadcast_races (race_date desc);
create index if not exists broadcast_races_pub_date_idx on public.broadcast_races (published, race_date);

alter table public.broadcast_races enable row level security;

drop policy if exists "broadcast_select_published" on public.broadcast_races;
drop policy if exists "broadcast_insert_admin" on public.broadcast_races;
drop policy if exists "broadcast_update_admin" on public.broadcast_races;
drop policy if exists "broadcast_delete_admin" on public.broadcast_races;

create policy "broadcast_select_published"
  on public.broadcast_races for select
  using (
    published = true
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "broadcast_insert_admin"
  on public.broadcast_races for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "broadcast_update_admin"
  on public.broadcast_races for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "broadcast_delete_admin"
  on public.broadcast_races for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

-- ---------------------------------------------------------------------------
-- 既定の配信カレンダー（初回のみ。既に行がある場合はスキップ）
-- 再投入: delete from public.broadcast_races; 後に本ブロックを再実行
-- ---------------------------------------------------------------------------
insert into public.broadcast_races (
  race_date,
  title,
  subtitle,
  note,
  live_url,
  archive_url,
  published,
  sort_order
)
select v.race_date, v.title, v.subtitle, v.note, v.live_url, v.archive_url, v.published, v.sort_order
from (
  values
    ('2026-05-24'::date, 'TOJ Stage1', 'チャリ・ロト 堺ステージ', 'タイムトライアル', '', '', true, 0),
    ('2026-05-25'::date, 'TOJ Stage2', 'JPF 京都ステージ', '', '', '', true, 0),
    ('2026-05-26'::date, 'TOJ Stage3', 'いなべステージ', '', '', '', true, 0),
    ('2026-05-27'::date, 'TOJ Stage4', 'Astemo 大鹿ステージ', 'チームタイムトライアル', '', '', true, 0),
    ('2026-05-28'::date, 'TOJ Stage5', '綿半 信州飯田ステージ', '', '', '', true, 0),
    ('2026-05-29'::date, 'TOJ Stage6', 'スルガ銀行 富士山ステージ', '', '', '', true, 0),
    ('2026-05-30'::date, 'TOJ Stage7', 'AMANO 相模原ステージ', '', '', '', true, 0),
    ('2026-05-31'::date, 'TOJ Stage8', 'SPEEDチャンネル 東京ステージ', 'クリテリウム', '', '', true, 0),
    ('2026-05-31'::date, 'E1 E2 E3', '第3回綾川町ロードレース', '(COPPA AYAGAWA)', '', '', true, 1),
    ('2026-06-06'::date, 'JCT 第4戦', '第5回石川クリテリウム', '', '', '', true, 0),
    ('2026-06-07'::date, 'JPT 第6戦', '第23回石川ロードレース(第15回ジュニアチャンピオンシップ）', '', '', '', true, 0),
    ('2026-07-05'::date, 'JPT 第7戦', '第1回大町温泉郷ロードレース※調整中', '', '', '', true, 0),
    ('2026-09-06'::date, 'JPT 第8戦', E'第1回西郷村ロードレース\u3000※調整中', '', '', '', true, 0),
    ('2026-09-19'::date, 'JPT 第９戦', '第11回南魚沼ロードレース※調整中', '', '', '', true, 0),
    ('2026-09-20'::date, 'JCT 第4戦', E'第6回南魚沼クリテリウム\u3000※調整中', '', '', '', true, 0),
    ('2026-02-21'::date, 'JPT第1戦', '第4回鹿屋・肝付ロードレース', '', '', 'https://youtube.com/live/lDsCS-Zo8Ns?feature=share', true, 0),
    ('2026-02-22'::date, 'JCT 第1戦', '第4回志布志クリテリウム', '', '', 'https://youtube.com/live/8VhKmJwgbvI?feature=share', true, 0),
    ('2026-03-28'::date, 'JPT 第2戦', '2026広島三原ロードレース', '', '', 'https://youtube.com/live/PfNCHlAOlAE?feature=share', true, 0),
    ('2026-03-29'::date, 'JCT 第3戦', '2026 マリモホールディングス 広島クリテリウム', '', '', 'https://youtube.com/live/H8tiMvqEvSA?feature=share', true, 0),
    ('2026-04-04'::date, 'JPT 第2戦', '第3回NTT東日本真岡芳賀ロードレース', '', '', 'https://youtube.com/live/4WX1uNFnOR0?feature=share', true, 0),
    ('2026-04-05'::date, 'JCT 第3戦', '第3回NTT東日本宇都宮清原クリテリウム', '', '', 'https://youtube.com/live/GZbXNAkM77g?feature=share', true, 0),
    ('2026-04-18'::date, 'E1', '第60回西日本ロードクラシック第7回播磨中央公園ロードレースDay1', '', '', 'https://youtube.com/live/PkuuQzwRb8o?feature=share', true, 0),
    ('2026-04-19'::date, 'JPT 第4戦', '第60回西日本ロードクラシック第7回播磨中央公園ロードレースDay2', '', '', 'https://youtube.com/live/2BxOkUcb4LY?feature=share', true, 0),
    ('2026-04-26'::date, 'JPT 第5戦', '第60回東日本ロードクラシックDay2', '', '', 'https://youtube.com/live/MWdZ8Y1tNPA?feature=share', true, 0)
) as v(race_date, title, subtitle, note, live_url, archive_url, published, sort_order)
where not exists (select 1 from public.broadcast_races limit 1);
