# Vercel deployment notes (Vite + React)

## Why `/api` works locally but fails on Vercel

The Vite `server.proxy` setting only runs in local dev (`vite dev`).
After deployment, Vercel serves static files and does not use Vite's dev proxy.
So relative requests such as `/api/predict` return `404` unless you deploy an API at the same origin.

## Production options

### Option A (recommended): deploy backend separately

1. Deploy the Node backend (Render / Railway / Fly / etc.).
2. Set `VITE_API_BASE_URL` in Vercel to your backend URL (for example `https://api.example.com`).
3. Keep frontend requests using `buildApiUrl('/api/...')`.
4. Configure CORS on backend to allow your Vercel frontend domain.

Result: frontend calls `https://api.example.com/api/...` in production.

### Option B: move backend routes to Vercel serverless functions

1. Create `/api` serverless functions in the Vercel project.
2. Do **not** set `VITE_API_BASE_URL`.
3. Frontend keeps calling relative `/api/...` URLs via `buildApiUrl`.

Result: frontend calls same-origin `/api/...` routes on Vercel.

## SPA refresh fix

`vercel.json` rewrites non-API routes to `index.html`, so refreshing `/chat` no longer returns `404`.

## Environment safety

- Only expose public variables with `VITE_` prefix.
- Keep backend secrets (DB URL, API keys, OpenAI keys) on backend provider only.
