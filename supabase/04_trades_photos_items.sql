-- ============================================================
-- BUILDERPILOT — Migration 04: Trades, Photos, Frequent Items
-- ============================================================

-- =============== TRADES ROLODEX ===============
create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade not null,
  trade_category text not null,
  company_name text not null,
  contact_name text,
  phone text,
  email text,
  notes text,
  rating int check (rating between 1 and 5),
  active boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_trades_site on public.trades(site_id);
create index if not exists idx_trades_cat on public.trades(trade_category);

alter table public.trades enable row level security;

create policy "Members can read trades" on public.trades
  for select to authenticated using (
    exists (select 1 from public.site_members where site_id = trades.site_id and user_id = auth.uid())
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Supervisors can write trades" on public.trades
  for all to authenticated using (
    exists (
      select 1 from public.site_members
      where site_id = trades.site_id and user_id = auth.uid() and role in ('admin','supervisor')
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============== PHOTOS ===============
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references public.units(id) on delete cascade,
  site_id uuid references public.sites(id) on delete cascade,
  storage_path text not null,
  caption text,
  category text default 'general',
  related_to_type text,
  related_to_id uuid,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
create index if not exists idx_photos_unit on public.photos(unit_id);
create index if not exists idx_photos_site on public.photos(site_id);

alter table public.photos enable row level security;

create policy "Members can read photos" on public.photos
  for select to authenticated using (
    (site_id is not null and exists (select 1 from public.site_members where site_id = photos.site_id and user_id = auth.uid()))
    or (unit_id is not null and exists (
      select 1 from public.units u join public.site_members sm on sm.site_id = u.site_id
      where u.id = photos.unit_id and sm.user_id = auth.uid()
    ))
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Members can upload photos" on public.photos
  for insert to authenticated with check (uploaded_by = auth.uid());

create policy "Owner can delete own photos" on public.photos
  for delete to authenticated using (uploaded_by = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- =============== FREQUENT ITEMS (quick chips) ===============
create table if not exists public.frequent_items (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  type text not null check (type in ('deficiency','daily_log','inspection_note')),
  text text not null,
  sort_order int default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
create index if not exists idx_freq_site_type on public.frequent_items(site_id, type);

alter table public.frequent_items enable row level security;

create policy "Authenticated can read frequent items" on public.frequent_items
  for select to authenticated using (true);
create policy "Supervisors can write frequent items" on public.frequent_items
  for all to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','supervisor'))
  );

-- =============== STORAGE BUCKETS ===============
-- Run these manually in Supabase Dashboard → Storage → Create bucket:
-- 1. photos (public: false)
-- 2. documents (public: false)
