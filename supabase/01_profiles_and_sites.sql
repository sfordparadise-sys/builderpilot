-- ============================================================
-- BUILDERPILOT — Initial Database Schema
-- Run in Supabase SQL Editor in order: 01 → 02 → 03 → 04
-- ============================================================

-- =============== PROFILES ===============
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  name text,
  role text default 'viewer' check (role in ('admin','supervisor','foreman','viewer')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Users can read all profiles" on public.profiles
  for select to authenticated using (true);
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============== SITES (multi-tenant root) ===============
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  builder_name text,
  address text,
  active boolean default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
alter table public.sites enable row level security;

create policy "Members can read sites" on public.sites
  for select to authenticated using (
    exists (select 1 from public.site_members where site_id = sites.id and user_id = auth.uid())
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============== SITE MEMBERS ===============
create table if not exists public.site_members (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text default 'viewer' check (role in ('admin','supervisor','foreman','viewer')),
  created_at timestamptz default now(),
  unique(site_id, user_id)
);
alter table public.site_members enable row level security;

create policy "Members can read own memberships" on public.site_members
  for select to authenticated using (user_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
