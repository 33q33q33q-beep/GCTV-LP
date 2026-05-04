-- アップロード失敗の対策:
-- 1) バケットの MIME 制限を緩める（null = 形式はストレージ側で実質制限なし）
-- 2) 管理者判定を SECURITY DEFINER 関数に寄せ、profiles の RLS で EXISTS が読めないケースを避ける

update storage.buckets
set
  allowed_mime_types = null,
  file_size_limit = 10485760
where id = 'cms-media';

create or replace function public.is_cms_storage_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin is true
  );
$$;

grant execute on function public.is_cms_storage_admin() to authenticated;

drop policy if exists "cms_media_insert_admin" on storage.objects;
drop policy if exists "cms_media_update_admin" on storage.objects;
drop policy if exists "cms_media_delete_admin" on storage.objects;

create policy "cms_media_insert_admin"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'cms-media'
    and public.is_cms_storage_admin()
  );

create policy "cms_media_update_admin"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'cms-media'
    and public.is_cms_storage_admin()
  );

create policy "cms_media_delete_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'cms-media'
    and public.is_cms_storage_admin()
  );
