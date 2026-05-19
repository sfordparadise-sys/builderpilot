# BuilderPilot — Cowork Brief

**For:** The Claude Cowork session picking this up tomorrow.
**From:** Tonight's prep session.
**Owner:** Stephen (site supervisor, founder).

---

## TL;DR

Stephen has a working construction-site management app called **Aurora Trails** running for his employer (Paradise Developments). He's keeping that one live as-is. **BuilderPilot** is the rebranded, generalized, sellable SaaS version of the same product. This folder contains the foundation. Your job tomorrow is to keep building it.

---

## What's already done

### 1. Brand
- Name: **BuilderPilot**
- Tagline: "Run Your Sites. Not Just Your Day."
- Colors: matte black `#121212`, construction gold `#F5B400`, charcoal `#1E1E1E`, concrete gray `#8A8A8A`
- Logo: `/public/logo.svg` (full wordmark), `/public/mark.svg` (icon only)
- Fonts: Inter (UI), JetBrains Mono (data tables)
- Design feel: industrial, premium, field-ready — Milwaukee/DeWalt/Caterpillar, NOT corporate startup

### 2. Tech foundation
- Next.js 14 (App Router, TypeScript)
- Supabase (Postgres + Auth + Storage), Canada region
- Tailwind with custom theme in `tailwind.config.ts`
- Custom CSS variables and component utility classes in `src/app/globals.css`
- Auth middleware in `src/middleware.ts`

### 3. Database schema (in `/supabase/`)
Multi-tenant from day one via `sites` and `site_members` tables. Run these in Supabase SQL Editor in order:
1. `01_profiles_and_sites.sql` — profiles, sites, site_members
2. `02_units_and_stages.sql` — units (lots) and stage_progress
3. `03_inspections_deficiencies_log.sql` — inspections, inspection_items, deficiencies, daily_log
4. `04_trades_photos_items.sql` — trades, photos, frequent_items
5. `05_demo_seed.sql` — creates Aurora Trails sample site + 44 units (run AFTER first user signup)

Every table has RLS policies that check `site_members` to scope data per-user-per-site.

### 4. UI built so far
- **Login page** (`/login`) — branded, dark, with logo and tagline
- **Main app shell** (`/`) — sidebar with 13 nav items, top bar with date, dark theme
- **Dashboard view** — KPI tiles (active lots, inspections, deficiencies, closings) + quick actions + welcome state
- All other nav items go to a placeholder card

---

## Stephen's priorities for tomorrow

In order:

### Priority 1 — Get it deployed and demo-able
1. Help Stephen create a new GitHub repo (`builderpilot`)
2. Help him push this folder to it
3. Help him create the new Supabase project (Canada region)
4. Help him run the migrations
5. Help him deploy to Vercel
6. Walk him through creating a first user and running the seed migration
7. Confirm he can log in and see the dashboard with Aurora Trails sample data

### Priority 2 — Build the Units / Lots module
Stephen needs to see a list of the 44 units, sortable by block, with a card view that opens to show all the details. Reference the Aurora Trails app at `aurora-trails-zeta.vercel.app` for the proven layout. Use the new theme.

### Priority 3 — Build the AI Assistant module
This is BuilderPilot's biggest differentiator vs. Procore. Use Anthropic's API. Features:
- Voice-to-text daily log entries
- "Summarize today's site activity" given recent log + deficiency entries
- "Draft a purchaser deficiency summary email" given a unit's deficiencies
- "Prep me for tomorrow's framing inspection" given a unit
Make it feel like an assistant in the super's pocket.

### Priority 4 — Stage grids (rough / finishing / PDO)
Port from the Aurora Trails app, adapted to the new schema where stages come from `stage_progress` table joined to units. Aurora Trails had hardcoded `STAGES` array — BuilderPilot has it generic and editable.

---

## Important context

### Stephen's situation
- He's a residential site supervisor (low-rise townhomes)
- He's at Paradise Developments and is building Aurora Trails (44 units across blocks B5, B7, B11, B14, B16)
- He works long days; he prefers concise communication and concrete next steps
- He doesn't have a strong coding background — he uses Claude to build everything
- He works primarily on iPhone with a laptop available evenings
- He's gone through significant trial and error with file uploads, GitHub mobile, and SQL migrations on the Aurora Trails app

### Stephen's goals
- Keep Aurora Trails running for his employer (don't touch it)
- Build BuilderPilot as a sellable SaaS for other builders
- Use real Aurora Trails workflow knowledge but never use Paradise's proprietary forms, logos, or documents
- Target market: site supervisors at other residential builders, sold via OHBA, LinkedIn, word of mouth
- Pricing target: $299–499/month per active site
- First sale goal: sell internally to Paradise (all their other sites) as reference customer

### What NOT to do
- Don't use any Paradise branding, logos, colors, forms, or internal document layouts
- Don't reference Paradise by name in the app or marketing
- Don't promise features that aren't built
- Don't make it look like a corporate SaaS — keep the industrial/tool-like feel
- Don't over-explain code; Stephen wants to see results
- Don't ask too many clarifying questions when reasonable defaults exist — make decisions and move

### Communication style with Stephen
- Be concise. He doesn't need long explanations of code.
- Show, don't tell. Generate files, give him exact steps.
- Use numbered steps when he needs to do something on his phone or laptop.
- When something can be done in parallel by you and him, do your part and tell him his.
- He'll often work from his phone — accommodate that with copy-paste-friendly outputs.
- When he hits a problem (file uploads, SQL errors), don't make him re-explain — just fix it.

---

## Useful references

- **Aurora Trails repo:** github.com/sfordparadise-sys/aurora-trails (private)
- **Aurora Trails live:** aurora-trails-zeta.vercel.app
- His GitHub account: `sfordparadise-sys`
- He may create a new account `builderpilot` for the SaaS — ask him.

---

## File inventory in this folder

```
builderpilot/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── .env.example
├── .gitignore
├── README.md
├── public/
│   ├── logo.svg
│   └── mark.svg
├── src/
│   ├── middleware.ts
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx (main app shell + dashboard)
│   │   └── login/
│   │       └── page.tsx
│   ├── components/  (empty — build modules here)
│   └── lib/
│       ├── constants.ts (brand + sample site + generic stages + inspection types)
│       ├── supabase.ts (client)
│       └── supabase-server.ts (server)
├── supabase/
│   ├── 01_profiles_and_sites.sql
│   ├── 02_units_and_stages.sql
│   ├── 03_inspections_deficiencies_log.sql
│   ├── 04_trades_photos_items.sql
│   └── 05_demo_seed.sql
└── docs/
    └── COWORK_BRIEF.md  ← you are here
```

---

## First message to Stephen tomorrow

Something like:

> Morning Stephen. I've got the BuilderPilot foundation ready from last night — brand, theme, database schema, login, dashboard shell, and seed data for an Aurora Trails sample site. Want to start by getting it deployed so you can see it, or jump into building out the Units module first?

Then move from there based on his answer.

Good luck. He's a good guy. Take care of him.
