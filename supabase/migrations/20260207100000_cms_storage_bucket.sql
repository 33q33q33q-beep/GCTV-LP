-- CMS 用の公開バケット（画像をアップロードし、返却された public URL を DB に保存する想定）

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 既存ポリシー（再実行用）
drop policy if exists "cms_media_select" on storage.objects;
drop policy if exists "cms_media_insert_admin" on storage.objects;
drop policy if exists "cms_media_update_admin" on storage.objects;
drop policy if exists "cms_media_delete_admin" on storage.objects;

-- 誰でも読み取り可（公開サイトで img src に使う）
create policy "cms_media_select"
  on storage.objects for select
  using (bucket_id = 'cms-media');

-- 管理者のみアップロード
create policy "cms_media_insert_admin"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'cms-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "cms_media_update_admin"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'cms-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );

create policy "cms_media_delete_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'cms-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin is true
    )
  );
