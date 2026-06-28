# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## What this repo is

`builderpilot` is the production codebase for **BuilderPilot** — an AI operating
system / site-management platform for residential construction, built by and for
site supervisors. Owner: Stephen Ford (`sfordparadise-sys`).

The repo is a **hybrid**: it holds three distinct deliverables that ship to two
different hosts.

| Part | Path(s) | What it is | Deploys to |
|------|---------|-----------|------------|
| **SaaS app** | `src/`, `supabase/`, `*.config.*`, `package.json` | Next.js 14 field-management app (the product) | Vercel |
| **Marketing site** | `index.html`, `mentorship.html`, `blog/`, `images/`, `downloads/`, `public/` | Static site + field-notes blog | GitHub Pages |
| **The Architect** | `stefor-architect.html` | Standalone single-file proposal / change-order builder for Stefor Group | GitHub Pages (served as a static page) |

> These three live in one repo but are independent. A change to a static HTML
> page does **not** touch the Next.js app, and vice versa. Know which part you are
> editing before you start.

## Read this first

`AGENTS.md` defines the working philosophy for this repo ("lazy senior dev mode" —
the best code is the code never written). It applies to all agents. Key points:
prefer the platform/stdlib over new dependencies, deletion over addition, the
minimum that works; mark intentional shortcuts with a `ponytail:` comment; never
cut corners on validation at trust boundaries, error handling, security, or
accessibility. Leave one runnable check behind for non-trivial logic.

## The SaaS app (`src/`)

### Stack
- **Next.js 14** App Router, TypeScript (`strict: false`)
- **Supabase** — Postgres + Auth + Storage, Canada (Central) region
- **Tailwind CSS** with a custom industrial dark theme (`tailwind.config.ts`)
- **lucide-react** for icons
- **Anthropic API** for the AI Assistant, proxied server-side
- Path alias: `@/*` → `./src/*`

### Layout
```
src/
├── middleware.ts              # auth gate — redirects unauthenticated users to /login
├── app/
│   ├── layout.tsx             # root layout
│   ├── globals.css            # CSS variables + component utility classes
│   ├── page.tsx               # authed entry; loads profile, renders AuroraOperationsApp
│   ├── login/page.tsx         # email/password sign-in (Supabase Auth)
│   └── api/ai/chat/route.ts   # edge route: Anthropic proxy (POST /api/ai/chat)
├── components/
│   ├── AuroraOperationsApp.tsx  # main app shell: sidebar + tabbed views (dashboard, units, grid, deficiencies, daily log, inspections)
│   ├── UnitsView.tsx            # units/lots list + detail
│   └── AIAssistantView.tsx      # AI co-pilot (summaries, emails, inspection prep, voice-to-text)
└── lib/
    ├── constants.ts           # BRAND, SAMPLE_SITE, STAGES, INSPECTION_TYPES
    ├── supabase.ts            # browser client (createSupabaseClient; createClient alias)
    └── supabase-server.ts     # server client (cookie-based)
```

### Auth model
`src/middleware.ts` runs on every request. Unauthenticated users hitting any
non-public path are redirected to `/login`; authenticated users on `/login` are
sent to `/`. Public paths: `/login`, `/_next`, `/favicon.ico`, `/logo.svg`,
`/mark.svg`. There is currently **no sign-up UI** — first users are created via
the Supabase dashboard.

### AI Assistant
`src/app/api/ai/chat/route.ts` is an **edge runtime** proxy to
`api.anthropic.com/v1/messages`. It keeps `ANTHROPIC_API_KEY` server-side (never
expose it to the client). Default model: `claude-sonnet-4-6`. Body:
`{ system?, message, context?, model?, max_tokens? }` → `{ text, usage, model }`.
The client never calls Anthropic directly — always go through this route. When
working on LLM features, default to the latest Claude models.

### Database (`supabase/`)
Multi-tenant from day one via `sites` + `site_members`; **every table has RLS
policies** that scope rows per-user-per-site. Run migrations in the Supabase SQL
Editor **in numeric order**:
1. `01_profiles_and_sites.sql`
2. `02_units_and_stages.sql`
3. `03_inspections_deficiencies_log.sql`
4. `04_trades_photos_items.sql`
5. `05_demo_seed.sql` — Aurora Trails sample site + 44 units; **run only after the first user exists**

`supabase/migrations/202605210001_builderpilot_core_schema.sql` is the
consolidated schema for the Supabase CLI workflow. Storage buckets `photos` and
`documents` (both private) must exist.

When you change the schema, update both the numbered SQL file(s) and keep RLS
policies intact — new tables need site-scoped policies or they leak across tenants.

### Brand / theme
Matte black `#121212` (ink), construction gold `#F5B400` (gold), dark charcoal
`#1E1E1E`, concrete gray `#8A8A8A`. Fonts: Inter (UI), JetBrains Mono (data).
Feel: industrial, premium, field-ready — Milwaukee/DeWalt/Caterpillar, **not**
corporate SaaS. The Tailwind theme exposes `ink`, `gold`, `concrete` color scales;
prefer those tokens over raw hex. Logo: `public/logo.svg` (wordmark),
`public/mark.svg` (icon).

### Commands
```bash
npm install       # install deps
npm run dev       # local dev server (needs NEXT_PUBLIC_SUPABASE_* in .env)
npm run build     # production build
npm run start     # serve production build
npm run lint      # next lint / ESLint
```
There is no test runner configured. Per `AGENTS.md`, leave a small runnable check
behind for non-trivial new logic rather than pulling in a framework.

### Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client + middleware (public)
- `ANTHROPIC_API_KEY` — server only, for `/api/ai/chat` (never `NEXT_PUBLIC_`)

See `.env.example`. Set these in Vercel → Project Settings → Environment Variables
for production. `.env` files are gitignored.

## The marketing site (static HTML)

`index.html`, `mentorship.html`, and `blog/*.html` are hand-written static pages
(BuilderPilot field-systems site + Ontario-focused construction field-notes blog).
They are plain HTML/CSS/JS with no build step. Assets live in `images/` and
`downloads/`. Edit the HTML directly. These files are deployed by the GitHub
Pages workflow, which uploads the **entire repo root** — so the marketing pages
are what gets served at the Pages URL, not the Next.js app.

## The Architect (`stefor-architect.html`)

A single, self-contained ~700KB HTML file: a client-side proposal / change-order /
estimate builder for **Stefor Group** (a separate brand from BuilderPilot). It
includes a floor-plan tool, 3D room view, scope/estimate tables, selections
schedule, schedule, change orders, and a print-ready proposal. State persists in
`localStorage`; there is essentially no backend. Everything is inline — keep edits
inside this one file.

## Deployment

- **`.github/workflows/deploy.yml`** — on push to `main` (or manual dispatch),
  builds GitHub Pages from the repo root (`path: '.'`) and deploys. This serves
  the static marketing site + blog + `stefor-architect.html`.
- **Vercel** hosts the Next.js SaaS app (auto-detected Next preset). See
  `README.md` / `QUICK_START.md` for the full from-scratch deploy walkthrough.

## Git workflow

- Active development branch: **`claude/claude-md-docs-bj9h1d`**. Develop and push
  there; do not push to `main` without explicit permission.
- Push with `git push -u origin <branch>`; retry network failures with backoff.
- Commit with clear, descriptive messages. Do **not** create pull requests unless
  the user explicitly asks.

## Working with Stephen (owner context)

From `docs/COWORK_BRIEF.md` — worth reading in full before substantial work:
- He's a residential site supervisor, not a strong coder; he builds via Claude and
  often works from an iPhone. Be concise, show don't tell, give numbered steps for
  anything he must do himself, and make copy-paste-friendly outputs.
- Make reasonable default decisions and move; don't over-ask or over-explain code.
- **Aurora Trails** is the live app for his employer (Paradise Developments) and is
  kept separate. BuilderPilot is the generalized, sellable version. **Never** use
  Paradise's branding, logos, colors, forms, or internal document layouts, and
  don't reference Paradise by name in the product or marketing. "Aurora Trails" in
  this repo is only fictional demo/sample data.
- Don't promise features that aren't built; keep the industrial/tool-like feel.

## Key files reference

| File | Purpose |
|------|---------|
| `AGENTS.md` | Working philosophy (read first) |
| `docs/COWORK_BRIEF.md` | Full owner context + product priorities |
| `README.md` | Product overview + from-scratch deploy |
| `QUICK_START.md` | Owner-facing deploy checklist |
| `src/lib/constants.ts` | Brand, sample site, stages, inspection types |
| `tailwind.config.ts` | Brand color scales + theme |
| `supabase/*.sql` | Schema + RLS + seed (run in order) |
