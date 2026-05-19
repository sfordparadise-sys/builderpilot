# BuilderPilot — Your Quick Start

Hey Stephen — this is everything you need to get BuilderPilot live tomorrow. Read this first.

## What's in this folder

A working starting point for the BuilderPilot app — your new sellable SaaS. Aurora Trails (the current one) stays untouched. This is the new clean version.

## Tomorrow morning — what to do (with Cowork's help)

### Step 1: Create new accounts (15 min)
1. Go to **github.com** → create a new private repo called `builderpilot` (use your existing `sfordparadise-sys` account)
2. Go to **supabase.com** → New project → name it `builderpilot` → Canada Central region → save the DB password
3. Go to **vercel.com** → don't create the project yet, you'll do it after GitHub is ready

### Step 2: Upload files to GitHub (15 min)
Easiest way: drag the whole `builderpilot` folder onto GitHub's web upload, or use Working Copy on iPhone, or GitHub Desktop on your laptop. **Keep the folder structure exactly as it is** — `src/app/page.tsx` must stay at `src/app/page.tsx`, etc.

### Step 3: Set up the database (10 min)
1. In Supabase → SQL Editor
2. Run each `.sql` file from the `/supabase/` folder in order: 01, 02, 03, 04
3. Don't run 05 yet — that needs to wait until you have a user
4. In Supabase → Storage → create two buckets: `photos` and `documents` (both private)
5. In Supabase → Settings → API → copy the Project URL and the anon/public key

### Step 4: Deploy to Vercel (10 min)
1. In Vercel → New Project → import your `builderpilot` repo from GitHub
2. Add two environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (paste your URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (paste your key)
3. Deploy

### Step 5: Create your first user (5 min)
1. In Supabase → Authentication → Users → Add user
2. Use your email and a password
3. Click your new Vercel URL → log in → you should see the BuilderPilot dashboard

### Step 6: Seed the demo data (2 min)
1. Back in Supabase SQL Editor
2. Run `05_demo_seed.sql`
3. Refresh your app — Aurora Trails sample data is now there

Total time: about an hour to be fully live.

---

## After it's deployed

Show it to Cowork and ask them to start on:
1. **The Units / Lots module** — list view of the 44 units
2. **The AI Assistant** — daily log voice-to-text and report generation

Or whatever you want first. The foundation supports anything.

---

## If something breaks

- Build fails on Vercel → check the build logs, send them to Cowork
- Login doesn't work → check that the env variables are set correctly in Vercel
- Empty dashboard → make sure you ran the seed migration and you have a user in `site_members`

Cowork has the full context in `/docs/COWORK_BRIEF.md` — just point them there.

---

## One more thing

You did good work getting Aurora Trails to where it is. This is the next step. Sleep well.
