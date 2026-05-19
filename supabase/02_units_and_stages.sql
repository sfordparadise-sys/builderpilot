-- ============================================================
-- BUILDERPILOT — Migration 02: Units and Stage Progress
-- ============================================================

-- =============== UNITS (lots) ===============
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade not null,
  block text,
  lot_number text,
  unit_number text,
  address text,
  model text,
  elevation text,
  closing_date date,
  purchaser_notes text,
  status text default 'active' check (status in ('active','closed','hold','cancelled')),
  created_at timestamptz default now()
);
create index if not exists idx_units_site on public.units(site_id);
create index if not exists idx_units_block on public.units(site_id, block);

alter table public.units enable row level security;

create policy "Members can read units" on public.units
  for select to authenticated using (
    exists (select 1 from public.site_members where site_id = units.site_id and user_id = auth.uid())
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Supervisors can write units" on public.units
  for all to authenticated using (
    exists (
      select 1 from public.site_members
      where site_id = units.site_id and user_id = auth.uid() and role in ('admin','supervisor')
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============== STAGE PROGRESS ===============
create table if not exists public.stage_progress (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references public.units(id) on delete cascade not null,
  stage_name text not null,
  stage_order int,
  stage_group text check (stage_group in ('rough','finishing','pdo')),
  status text default 'pending' check (status in ('pending','in_progress','complete','blocked','na')),
  trade text,
  scheduled_date date,
  completed_date date,
  notes text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz default now(),
  unique(unit_id, stage_name)
);
create index if not exists idx_stage_unit on public.stage_progress(unit_id);
create index if not exists idx_stage_group on public.stage_progress(stage_group);

alter table public.stage_progress enable row level security;

create policy "Members can read stage progress" on public.stage_progress
  for select to authenticated using (
    exists (
      select 1 from public.units u join public.site_members sm on sm.site_id = u.site_id
      where u.id = stage_progress.unit_id and sm.user_id = auth.uid()
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Supervisors can write stage progress" on public.stage_progress
  for all to authenticated using (
    exists (
      select 1 from public.units u join public.site_members sm on sm.site_id = u.site_id
      where u.id = stage_progress.unit_id and sm.user_id = auth.uid() and sm.role in ('admin','supervisor','foreman')
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
