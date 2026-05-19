-- ============================================================
-- BUILDERPILOT — Migration 03: Inspections, Deficiencies, Daily Log
-- ============================================================

-- =============== INSPECTIONS ===============
create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references public.units(id) on delete cascade not null,
  inspection_type_id text not null,
  inspection_name text not null,
  category text,
  authority text,
  status text default 'Not Scheduled' check (status in ('Not Scheduled','Called','Passed','Failed','N/A')),
  called_date date,
  scheduled_date date,
  result_date date,
  inspector_name text,
  notes text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz default now()
);
create index if not exists idx_insp_unit on public.inspections(unit_id);

alter table public.inspections enable row level security;

create policy "Members can read inspections" on public.inspections
  for select to authenticated using (
    exists (
      select 1 from public.units u join public.site_members sm on sm.site_id = u.site_id
      where u.id = inspections.unit_id and sm.user_id = auth.uid()
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Supervisors can write inspections" on public.inspections
  for all to authenticated using (
    exists (
      select 1 from public.units u join public.site_members sm on sm.site_id = u.site_id
      where u.id = inspections.unit_id and sm.user_id = auth.uid() and sm.role in ('admin','supervisor','foreman')
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============== INSPECTION ITEMS (checklist within inspection) ===============
create table if not exists public.inspection_items (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid references public.inspections(id) on delete cascade not null,
  item_text text not null,
  status text default 'pending' check (status in ('pending','pass','fail','na')),
  notes text,
  sort_order int default 0,
  created_at timestamptz default now()
);
create index if not exists idx_insp_items on public.inspection_items(inspection_id);

alter table public.inspection_items enable row level security;
create policy "Inherit from inspection" on public.inspection_items
  for all to authenticated using (
    exists (select 1 from public.inspections where id = inspection_items.inspection_id)
  );

-- =============== DEFICIENCIES ===============
create table if not exists public.deficiencies (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references public.units(id) on delete cascade not null,
  issue text not null,
  location text,
  trade text,
  next_action text,
  status text default 'open' check (status in ('open','in_progress','resolved','wont_fix')),
  priority text default 'normal' check (priority in ('low','normal','high','urgent')),
  source text default 'walkthrough',
  due_date date,
  resolved_date date,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_def_unit on public.deficiencies(unit_id);
create index if not exists idx_def_status on public.deficiencies(status);

alter table public.deficiencies enable row level security;

create policy "Members can read deficiencies" on public.deficiencies
  for select to authenticated using (
    exists (
      select 1 from public.units u join public.site_members sm on sm.site_id = u.site_id
      where u.id = deficiencies.unit_id and sm.user_id = auth.uid()
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Members can write deficiencies" on public.deficiencies
  for all to authenticated using (
    exists (
      select 1 from public.units u join public.site_members sm on sm.site_id = u.site_id
      where u.id = deficiencies.unit_id and sm.user_id = auth.uid() and sm.role in ('admin','supervisor','foreman')
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============== DAILY LOG ===============
create table if not exists public.daily_log (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade not null,
  log_date date not null default current_date,
  weather text,
  temperature text,
  manpower text,
  deliveries text,
  visitors text,
  incidents text,
  notes text,
  voice_transcript text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
create index if not exists idx_log_site_date on public.daily_log(site_id, log_date desc);

alter table public.daily_log enable row level security;

create policy "Members can read daily log" on public.daily_log
  for select to authenticated using (
    exists (select 1 from public.site_members where site_id = daily_log.site_id and user_id = auth.uid())
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Members can write daily log" on public.daily_log
  for all to authenticated using (
    exists (
      select 1 from public.site_members
      where site_id = daily_log.site_id and user_id = auth.uid() and role in ('admin','supervisor','foreman')
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
