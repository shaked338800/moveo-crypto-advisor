# Project Status

## Stack
- Frontend: React 19 + Vite + TypeScript + shadcn/ui + React Query + Tailwind CSS v4
- Backend: Node.js + Express v5 + TypeScript
- Database: PostgreSQL (Neon) via Prisma ORM
- Auth: JWT + bcryptjs

---

## Status: COMPLETE — Deployed to production

Frontend: https://moveo-crypto-advisor-s.vercel.app (Vercel)
Backend: https://moveo-crypto-advisor.onrender.com (Render)

---

## All Completed

### Backend
- [x] Express server (`src/server.ts`) with CORS, Morgan, env validation at startup
- [x] `GET /api/health`
- [x] Prisma schema — User, Preference, Vote models
- [x] Neon PostgreSQL connected + migrations run
- [x] Auth routes — `POST /api/auth/register`, `POST /api/auth/login` (rate limited)
- [x] Auth middleware — JWT verification
- [x] User routes — `GET /api/user/me`, `POST /api/user/preferences`
- [x] Dashboard route — `GET /api/dashboard` (parallel fetch of all 4 sections)
- [x] Votes routes — `GET /api/votes`, `POST /api/votes` (upsert)
- [x] Services: CoinGecko, NewsData, OpenRouter (Mistral 7B), meme — all with fallbacks
- [x] Zod validation on all routes

### Frontend
- [x] React + Vite scaffold with path aliases (`@/`)
- [x] Tailwind CSS v4 + shadcn/ui
- [x] AuthContext — token rehydration via `GET /api/user/me` on mount
- [x] ProtectedRoute — auth guard + onboarding gate
- [x] Axios instance with Bearer token interceptor
- [x] Home page
- [x] Login page (with client-side Zod validation)
- [x] Signup page (with client-side Zod validation)
- [x] Onboarding page — 3-step form (coins, investor type, content types)
- [x] Dashboard page — 4 sections: Coin Prices, AI Insight, Market News, Meme
- [x] Voting UI — thumbs up/down per section, state persisted via GET on load
- [x] Feedback Pipeline explainer card

### Deployment
- [x] Vercel config (`vercel.json`) — monorepo build + SPA rewrite rule
- [x] `frontend/.env.production` — bakes production API URL into Vite build
- [x] Render env vars set — `FRONTEND_URL`, `DATABASE_URL`, `JWT_SECRET`, all API keys
- [x] README updated

---

## Known Limitations (intentional for scope)
- JWT stored in localStorage (not httpOnly cookies)
- No token refresh / revocation
- Meme section uses a static list, not a live API
- No price charts
