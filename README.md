# BuilderPilot

> Run Your Sites. Not Just Your Day.
> The AI Operating System for Residential Builders.

Built by site supers. For site supers.

---

## What this is

BuilderPilot is a modern site management platform for residential construction. It centralizes everything a site supervisor does in a day — lot tracking, inspections, deficiencies, daily logs, trade accountability, and photo documentation — into one fast, mobile-first app designed for the field, not the office.

This repo is the production codebase. **Aurora Trails** is a sample/demo community of 44 townhomes used to populate the app with realistic data.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Postgres + Auth + Storage) — Canada region
- **Tailwind CSS** with custom industrial dark theme
- **Vercel** for hosting
- **Lucide** for icons

## Brand

- Primary: Matte Black `#121212`
- Accent: Construction Gold `#F5B400`
- Secondary: Dark Charcoal `#1E1E1E`, Concrete Gray `#8A8A8A`
- Fonts: Inter (UI), JetBrains Mono (data)

Industrial. Premium. Field-ready. Think Milwaukee, DeWalt, Caterpillar — not corporate SaaS.

---

## Deploy from scratch

### 1. Create the Supabase project
1. Go to supabase.com → New project
2. Name: `builderpilot`
3. Region: **Canada (Central)**
4. Generate a strong DB password and save it
5. After project is provisioned, go to **SQL Editor**
6. Run the migrations in `/supabase/` in this order:
   - `01_profiles_and_sites.sql`
   - `02_units_and_stages.sql`
   - `03_inspections_deficiencies_log.sql`
   - `04_trades_photos_items.sql`
7. Go to **Storage** → create two buckets: `photos` and `documents` (both private)
8. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Create the GitHub repo
1. Go to github.com → New repository
2. Name: `builderpilot`
3. Private
4. Don't initialize with anything
5. Upload all files from this folder

### 3. Deploy on Vercel
1. Go to vercel.com → Add New → Project
2. Import the `builderpilot` GitHub repo
3. Framework preset: Next.js (auto-detected)
4. Add the two environment variables from step 1.8
5. Deploy

### 4. First user
1. Open the deployed app → you'll be redirected to `/login`
2. Sign up via Supabase Auth (use **Authentication → Users → Add user** in Supabase dashboard for now since there's no signup UI yet — or run a quick email/password signup via the API)
3. Once you have one user, go back to Supabase SQL Editor and run `/supabase/05_demo_seed.sql` — this creates the Aurora Trails sample site and makes your first user the admin.

---

## What's done in this initial build

- ✅ Brand identity (logo, colors, fonts, theme)
- ✅ Dark industrial UI shell
- ✅ Login page with BuilderPilot branding
- ✅ Authenticated sidebar layout with all main nav items
- ✅ Dashboard view with KPI tiles and quick actions
- ✅ Database schema (multi-tenant from day one via `sites` + `site_members`)
- ✅ Row-level security on every table
- ✅ Auth middleware
- ✅ Seed data for Aurora Trails sample community

## What's next (for Cowork or future sessions)

- [ ] Units / Lots view with grid + card view
- [ ] Rough / Finishing / PDO stage grids
- [ ] Inspections module
- [ ] Deficiencies module
- [ ] Daily log with voice-to-text
- [ ] Trades rolodex
- [ ] Photos & docs with markup
- [ ] AI Assistant module (Claude API integration)
- [ ] Site map view
- [ ] Settings: site config, user management
- [ ] Onboarding wizard for new builders

The architecture supports all of this — each module just needs its UI built and wired to the existing tables.

---

## Legal note

BuilderPilot is built from generalized residential construction experience. It does not use proprietary forms, internal documents, or confidential workflows from any specific builder. "Aurora Trails" is a fictional demo community used to populate the app with realistic-looking sample data.

---

## Contact

This is currently a solo project. Sales, support, and partnerships will be added when the product reaches launch.
