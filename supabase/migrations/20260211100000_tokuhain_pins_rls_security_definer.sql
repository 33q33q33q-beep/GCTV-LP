-- 特派員ピン: profiles を EXISTS で直接参照すると、RLS の組み合わせで UPDATE が 0 件になることがある。
-- storage の is_cms_storage_admin と同様、SECURITY DEFINER で管理者判定する。

create or replace function public.is_gctv_admin()
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

grant execute on function public.is_gctv_admin() to authenticated;

drop policy if exists "tokuhain_pins_select_pub" on public.tokuhain_map_pins;
drop policy if exists "tokuhain_pins_insert_admin" on public.tokuhain_map_pins;
drop policy if exists "tokuhain_pins_update_admin" on public.tokuhain_map_pins;
drop policy if exists "tokuhain_pins_delete_admin" on public.tokuhain_map_pins;

create policy "tokuhain_pins_select_pub"
  on public.tokuhain_map_pins for select
  using (
    published = true
    or public.is_gctv_admin()
  );

create policy "tokuhain_pins_insert_admin"
  on public.tokuhain_map_pins for insert
  with check (public.is_gctv_admin());

create policy "tokuhain_pins_update_admin"
  on public.tokuhain_map_pins for update
  using (public.is_gctv_admin())
  with check (public.is_gctv_admin());

create policy "tokuhain_pins_delete_admin"
  on public.tokuhain_map_pins for delete
  using (public.is_gctv_admin());
