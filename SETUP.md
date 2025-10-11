## MugiwarafrostTV – Local and Deploy Setup (Bunny Stream Auto-Sync)

### 1) Environment variables (.env.local)
Create `.env.local` at the project root with:

```
BUNNY_API_KEY=YOUR_BUNNY_API_KEY
BUNNY_LIBRARY_ID=506159
BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net
DATABASE_URL=file:./dev.db

# Optional – only if you plan to sign direct HLS URLs yourself
# BUNNY_TOKEN_AUTH_KEY=YOUR_TOKEN_AUTH_KEY
```

Then run:

```
npx prisma generate
npx prisma db push
```

### 2) Bunny Stream security (recommended)
- If using the Bunny iframe (default): enable “Embed view token authentication”. The iframe auto‑signs requests.
- If you plan to use direct HLS playback: enable “CDN token authentication” and sign playlist/segment URLs server‑side.
- Block direct URL access and add your domains as allowed referrers (also add `http://localhost:3000` for local dev).

Reference: Bunny Stream security docs
`https://dash.bunny.net/stream/506159/security/general#:~:text=Token%20authentication%20key,49bd%2Dabb6%2D0a6e8e8f680a`

### 3) Webhook – auto import on upload
- In Bunny dashboard → Stream → Webhooks: set POST URL to:
  - Production: `https://YOUR_DOMAIN/api/bunny-webhook`
  - Local dev: use a tunnel (e.g., ngrok) → `https://YOUR_NGROK_HOST/api/bunny-webhook`
- Event: “Video Ready”.

What it does:
- Finds/creates Anime from the Bunny Collection (uses collection name as anime title).
- Upserts Episode by `bunnyVideoId`, sets playback URL and thumbnail.

### 4) Manual sync (safety net)
- After setting envs, start the app and visit: `/api/sync-bunny`
- This fetches the entire library, groups by collection, and backfills anime/episodes.

### 5) Run locally
```
npm install
npm run dev
```
Open `http://localhost:3000`.

### 6) Database options
- Default is SQLite (`file:./dev.db`).
- For hosted DBs, set `DATABASE_URL` accordingly and run migrations:
  - Postgres: `postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public`
  - MySQL: `mysql://USER:PASSWORD@HOST:PORT/DB`
  - Then: `npx prisma migrate deploy` (or `prisma db push` during dev)

### 7) Quick test flow
1. Upload a video into a Bunny Collection (collection name becomes the anime title).
2. Wait for “Ready”; webhook creates/updates the anime/episode.
3. Open the site → anime shows under lists; player loads via Bunny iframe URL.


