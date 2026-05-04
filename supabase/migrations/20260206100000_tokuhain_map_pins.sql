-- GCTV 特派員トラベルマップのピン

create table if not exists public.tokuhain_map_pins (
  id uuid primary key default gen_random_uuid(),
  place_title text not null,
  reporter_name text not null default '',
  image_url text not null default '',
  link_url text not null,
  description text not null default '',
  pin_x_percent real not null check (pin_x_percent >= 0 and pin_x_percent <= 100),
  pin_y_percent real not null check (pin_y_percent >= 0 and pin_y_percent <= 100),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tokuhain_map_pins_pub_ord_idx on public.tokuhain_map_pins (published, sort_order);

alter table public.tokuhain_map_pins enable row level security;

drop policy if exists "tokuhain_pins_select_pub" on public.tokuhain_map_pins;
drop policy if exists "tokuhain_pins_insert_admin" on public.tokuhain_map_pins;
drop policy if exists "tokuhain_pins_update_admin" on public.tokuhain_map_pins;
drop policy if exists "tokuhain_pins_delete_admin" on public.tokuhain_map_pins;

create policy "tokuhain_pins_select_pub"
  on public.tokuhain_map_pins for select
  using (
    published = true
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  );

create policy "tokuhain_pins_insert_admin"
  on public.tokuhain_map_pins for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  );

create policy "tokuhain_pins_update_admin"
  on public.tokuhain_map_pins for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  );

create policy "tokuhain_pins_delete_admin"
  on public.tokuhain_map_pins for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin is true)
  );
