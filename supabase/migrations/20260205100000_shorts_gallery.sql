-- TikTok / Shorts ギャラリーカード + 下部「もっと見る」ボタン2本

create table if not exists public.shorts_gallery_settings (
  id smallint primary key default 1,
  footer_tiktok_url text not null default 'https://www.tiktok.com/@gachinkocycletv',
  footer_youtube_shorts_url text not null default 'https://www.youtube.com/@GachinkoCycleTV/shorts',
  updated_at timestamptz not null default now(),
  constraint single_row_chk check (id = 1)
);

insert into public.shorts_gallery_settings (id) values (1)
on conflict (id) do nothing;

create table if not exists public.shorts_gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  thumbnail_url text not null default '',
  video_url text not null,
  views_label text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shorts_gallery_items_pub_ord_idx on public.shorts_gallery_items (published, sort_order);

alter table public.shorts_gallery_settings enable row level security;
alter table public.shorts_gallery_items enable row level security;

drop policy if exists "shorts_settings_select" on public.shorts_gallery_settings;
drop policy if exists "shorts_settings_admin" on public.shorts_gallery_settings;
drop policy if exists "shorts_items_select_pub" on public.shorts_gallery_items;
drop policy if exists "shorts_items_insert_admin" on public.shorts_gallery_items;
drop policy if exists "shorts_items_update_admin" on public.shorts_gallery_items;
drop policy if exists "shorts_items_delete_admin" on public.shorts_gallery_items;

create policy "shorts_settings_select"
  on public.shorts_gallery_settings for select using (true);

create policy "shorts_settings_admin"
  on public.shorts_gallery_settings for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  );

create policy "shorts_items_select_pub"
  on public.shorts_gallery_items for select
  using (
    published = true
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  );

create policy "shorts_items_insert_admin"
  on public.shorts_gallery_items for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  );

create policy "shorts_items_update_admin"
  on public.shorts_gallery_items for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  );

create policy "shorts_items_delete_admin"
  on public.shorts_gallery_items for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  );
