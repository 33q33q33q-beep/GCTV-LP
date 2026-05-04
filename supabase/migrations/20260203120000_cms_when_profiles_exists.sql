-- Supabase デフォルトで public.profiles が既にあるプロジェクト向け
-- （20260203000000 で ERROR: relation "profiles" already exists になった場合に実行）
--
-- 1) profiles に GCTV 用カラムを追加
-- 2) news_articles / content_spots を作成
-- 3) RLS・ポリシー（名前は既存と被らないよう gctv_ 接頭辞を一部使用）

alter table public.profiles
  add column if not exists email text,
  add column if not exists is_admin boolean not null default false;

update public.profiles p
set email = coalesce(nullif(trim(p.email), ''), u.email)
from auth.users u
where p.id = u.id;

-- 既存テンプレのポリシーと重ならないよう、自プロファイル参照用
drop policy if exists "gctv_profiles_select_own" on public.profiles;
create policy "gctv_profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

alter table public.profiles enable row level security;

-- NEWS
create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  category text not null,
  published_at date not null,
  image_url text not null,
  body text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_articles_published_idx
  on public.news_articles (published, published_at desc);

alter table public.news_articles enable row level security;

drop policy if exists "news_select_public_or_admin" on public.news_articles;
drop policy if exists "news_insert_admin" on public.news_articles;
drop policy if exists "news_update_admin" on public.news_articles;
drop policy if exists "news_delete_admin" on public.news_articles;

create policy "news_select_public_or_admin"
  on public.news_articles for select
  using (
    published = true
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "news_insert_admin"
  on public.news_articles for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "news_update_admin"
  on public.news_articles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "news_delete_admin"
  on public.news_articles for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

-- Contents（9スロット）
create table if not exists public.content_spots (
  id uuid primary key default gen_random_uuid(),
  category_key text not null
    check (category_key in ('race_interview', 'news_information', 'variety_beginner')),
  position smallint not null check (position >= 0 and position <= 2),
  title text not null,
  url text not null,
  thumbnail_url text not null,
  duration text not null default '',
  updated_at timestamptz not null default now(),
  unique (category_key, position)
);

alter table public.content_spots enable row level security;

drop policy if exists "content_select_all" on public.content_spots;
drop policy if exists "content_insert_admin" on public.content_spots;
drop policy if exists "content_update_admin" on public.content_spots;
drop policy if exists "content_delete_admin" on public.content_spots;

create policy "content_select_all"
  on public.content_spots for select using (true);

create policy "content_insert_admin"
  on public.content_spots for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "content_update_admin"
  on public.content_spots for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "content_delete_admin"
  on public.content_spots for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

-- 新規サインアップで profiles に行が入るテンプレ用トリガがある場合、そのままでもOK。
-- 無い／壊している場合のみ、Dashboard の Starter トリガーを参照するか、元の migration の
-- handle_new_user ブロックのみを適用してください。
