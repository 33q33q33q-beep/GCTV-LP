-- GCTV CMS: NEWS + Contents スロット
-- 【既に public.profiles がある Supabase で ERROR 42P07 になる場合】
--    このファイルは実行せず、20260203120000_cms_when_profiles_exists.sql を実行してください。
--
-- Set admin after signup (SQL Editor):
--   update public.profiles set is_admin = true where email = 'your@email.com';

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  is_admin boolean not null default false,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create table public.news_articles (
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

create index news_articles_published_idx on public.news_articles (published, published_at desc);

alter table public.news_articles enable row level security;

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

create table public.content_spots (
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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
