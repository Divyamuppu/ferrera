# Ferrera Social HQ — Next.js + Neon (no login)

Live social dashboard for **Ferrera**: weekly goals, socials, website, performance, reports, **Build** (Discover + Define) and **Launch** — each with a checklist and a team chat.

- **No sign-in.** Anyone with the link can view and edit.
- Each person types their name once (remembered per device) so chat shows who said what.
- Data lives in **Neon Postgres**. The board refreshes every 3 seconds, so everyone sees changes almost instantly.

## Setup (~5 min)

1. **Neon** — [console.neon.tech](https://console.neon.tech) → create a project (free plan, region close to you, e.g. Singapore).
2. **Tables** — open the **SQL Editor** in Neon, paste [`schema.sql`](./schema.sql), run.
   (Or: `DATABASE_URL=... npm run db:setup`.)
3. **Env** — copy `.env.local.example` to `.env.local` and paste your Neon **pooled** connection string as `DATABASE_URL`.
4. **Run**
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000.

## Deploy (Vercel)

1. Push this folder to GitHub → import in Vercel.
2. Add `DATABASE_URL` in Project → Settings → Environment Variables (or use Vercel's Neon integration, which adds it for you).
3. Deploy and share the URL.

## How it works

- `GET /api/state` — returns the whole board (settings, links, tasks, reports, chat, names).
- `POST /api/mutate` — `{ op, p }` for every change (add/update/delete task, save link, post chat…).
- The dashboard polls `/api/state` every 3s (paused when the tab is hidden) and right after each change.

## Tables

- `settings` — one row `main`, JSON: week label, notes, calendar + website links
- `quick_links` — the four pinned shortcuts
- `tasks` — `tab`: `weekly | socials | website | performance | build-discover | build-define | launch`
- `report_links` — Performance Report links
- `comments` — chat per main tab (`build` chat is shared by Discover + Define)
- `profiles` — display names per browser

## Structure

```
schema.sql                     Neon tables
scripts/setup-db.mjs           Optional: apply schema.sql from the CLI
src/lib/db.ts                  Neon client (server only)
src/lib/api.ts                 Client fetch helpers
src/app/api/state/route.ts     Read the board
src/app/api/mutate/route.ts    All writes
src/app/dashboard/page.tsx     Per-browser id + dashboard
src/components/Dashboard.tsx   Dashboard UI (tasks, chat, Build sub-tabs)
src/app/globals.css            Styling (Ferrera green, light + dark)
public/ferrera-logo.png        Logo
```

> Anyone with the link can edit. Need view-only access or logins later? Add Neon Auth or a password gate — just ask.
