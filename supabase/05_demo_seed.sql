-- ============================================================
-- BUILDERPILOT — Migration 05: Demo Seed Data (Aurora Trails)
-- Run this AFTER your first user has signed up so we have a profile to link to.
-- ============================================================

-- Create sample site
insert into public.sites (id, name, type, builder_name, address, active)
values (
  '11111111-1111-1111-1111-111111111111',
  'Aurora Trails',
  'Sample Community — 44 Townhomes',
  'Sample Builder',
  '123 Demo Lane, Aurora, ON',
  true
) on conflict (id) do nothing;

-- Add the first user (whoever signs up first) as admin of the sample site
do $$
declare
  first_user uuid;
begin
  select id into first_user from public.profiles order by created_at limit 1;
  if first_user is not null then
    insert into public.site_members (site_id, user_id, role)
    values ('11111111-1111-1111-1111-111111111111', first_user, 'admin')
    on conflict (site_id, user_id) do update set role = 'admin';

    update public.profiles set role = 'admin' where id = first_user;
  end if;
end $$;

-- Seed 44 units across 5 blocks
insert into public.units (site_id, block, lot_number, unit_number, model, elevation, closing_date)
select
  '11111111-1111-1111-1111-111111111111',
  block,
  lot_number::text,
  block || 'U' || lot_number,
  case (lot_number % 3) when 0 then 'Maple' when 1 then 'Birch' else 'Cedar' end,
  case (lot_number % 2) when 0 then 'A' else 'B' end,
  current_date + (lot_number * 7 || ' days')::interval
from (
  select 'B5' as block, generate_series(1, 10) as lot_number
  union all
  select 'B7', generate_series(11, 18)
  union all
  select 'B11', generate_series(19, 28)
  union all
  select 'B14', generate_series(29, 36)
  union all
  select 'B16', generate_series(37, 44)
) t
on conflict do nothing;

-- Seed a few trades
insert into public.trades (site_id, trade_category, company_name, contact_name, phone)
values
  ('11111111-1111-1111-1111-111111111111', 'Framer', 'Northern Framing Co.', 'John D.', '555-0101'),
  ('11111111-1111-1111-1111-111111111111', 'Electrician', 'PowerLine Electric', 'Sara K.', '555-0102'),
  ('11111111-1111-1111-1111-111111111111', 'Plumber', 'BlueWater Plumbing', 'Mike T.', '555-0103'),
  ('11111111-1111-1111-1111-111111111111', 'HVAC', 'Comfort Air HVAC', 'Lisa M.', '555-0104'),
  ('11111111-1111-1111-1111-111111111111', 'Drywall', 'Premier Drywall', 'Tom R.', '555-0105'),
  ('11111111-1111-1111-1111-111111111111', 'Painter', 'Crystal Paint', 'Dan P.', '555-0106')
on conflict do nothing;

-- Seed a few frequent items
insert into public.frequent_items (site_id, type, text)
values
  ('11111111-1111-1111-1111-111111111111', 'deficiency', 'Drywall touch-up needed'),
  ('11111111-1111-1111-1111-111111111111', 'deficiency', 'Paint scuff'),
  ('11111111-1111-1111-1111-111111111111', 'deficiency', 'Trim gap'),
  ('11111111-1111-1111-1111-111111111111', 'daily_log', 'Concrete delivery'),
  ('11111111-1111-1111-1111-111111111111', 'daily_log', 'Inspector on site'),
  ('11111111-1111-1111-1111-111111111111', 'daily_log', 'Weather delay')
on conflict do nothing;
