-- BuilderPilot core schema
-- Project: wreqnixyzhloufytptbl
-- Purpose: auth-aware site operations tables for low-rise residential construction.

create extension if not exists pgcrypto;

-- Profiles mirror Supabase auth users.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text not null default 'supervisor' check (role in ('admin', 'supervisor', 'foreman', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  builder text,
  community_type text,
  municipality text,
  province text default 'Ontario',
  status text not null default 'active' check (status in ('active', 'closed', 'hold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  block text,
  lot_number text,
  unit_number text,
  address text,
  model text,
  elevation text,
  closing_date date,
  purchaser_notes text,
  status text not null default 'active' check (status in ('active', 'closed', 'hold', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(site_id, block, lot_number)
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  company text not null,
  contact_name text,
  phone text,
  email text,
  trade_type text,
  notes text,
  status text not null default 'active' check (status in ('active', 'inactive', 'watch', 'scheduled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stage_progress (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  stage_group text not null check (stage_group in ('rough', 'finishing', 'pdo')),
  stage_name text not null,
  trade text,
  planned_date date,
  completed_date date,
  inspection_pass_date date,
  status text not null default 'open' check (status in ('open', 'ready', 'called', 'passed', 'failed', 'hold', 'complete', 'na')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(unit_id, stage_group, stage_name)
);

create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  inspection_type text not null,
  category text,
  authority text,
  called_date date,
  scheduled_date date,
  result_date date,
  status text not null default 'Not Scheduled' check (status in ('Not Scheduled', 'Called', 'Passed', 'Failed', 'N/A')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deficiencies (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  unit_id uuid references public.units(id) on delete set null,
  block text,
  lot_number text,
  location text,
  issue text not null,
  trade text,
  priority text not null default 'P3' check (priority in ('P1', 'P2', 'P3', 'P4')),
  status text not null default 'open' check (status in ('open', 'watching', 'assigned', 'complete', 'closed')),
  assigned_to text,
  due_date date,
  completed_date date,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  log_date date not null default current_date,
  weather text,
  manpower text,
  deliveries text,
  inspections text,
  safety text,
  work_completed text,
  issues text,
  tomorrow_focus text,
  summary text,
  prepared_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(site_id, log_date)
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  unit_id uuid references public.units(id) on delete set null,
  deficiency_id uuid references public.deficiencies(id) on delete set null,
  title text,
  bucket text default 'site-photos',
  storage_path text,
  category text,
  notes text,
  taken_at timestamptz default now(),
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array['profiles','sites','units','trades','stage_progress','inspections','deficiencies','daily_logs'] loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', t, t);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.sites enable row level security;
alter table public.units enable row level security;
alter table public.trades enable row level security;
alter table public.stage_progress enable row level security;
alter table public.inspections enable row level security;
alter table public.deficiencies enable row level security;
alter table public.daily_logs enable row level security;
alter table public.photos enable row level security;

-- Simple authenticated-user policies for first production pass.
-- Tighten later for per-builder, per-site, and role-specific access.
do $$
declare
  t text;
begin
  foreach t in array array['sites','units','trades','stage_progress','inspections','deficiencies','daily_logs','photos'] loop
    execute format('drop policy if exists "Authenticated users can read %I" on public.%I', t, t);
    execute format('create policy "Authenticated users can read %I" on public.%I for select to authenticated using (true)', t, t);
    execute format('drop policy if exists "Authenticated users can insert %I" on public.%I', t, t);
    execute format('create policy "Authenticated users can insert %I" on public.%I for insert to authenticated with check (true)', t, t);
    execute format('drop policy if exists "Authenticated users can update %I" on public.%I', t, t);
    execute format('create policy "Authenticated users can update %I" on public.%I for update to authenticated using (true) with check (true)', t, t);
    execute format('drop policy if exists "Authenticated users can delete %I" on public.%I', t, t);
    execute format('create policy "Authenticated users can delete %I" on public.%I for delete to authenticated using (true)', t, t);
  end loop;
end $$;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create index if not exists idx_units_site_block_lot on public.units(site_id, block, lot_number);
create index if not exists idx_stage_progress_unit on public.stage_progress(unit_id, stage_group, status);
create index if not exists idx_inspections_unit_status on public.inspections(unit_id, status);
create index if not exists idx_deficiencies_site_status_priority on public.deficiencies(site_id, status, priority);
create index if not exists idx_daily_logs_site_date on public.daily_logs(site_id, log_date desc);
create index if not exists idx_photos_site_unit on public.photos(site_id, unit_id);
