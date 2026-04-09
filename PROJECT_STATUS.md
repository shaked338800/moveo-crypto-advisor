# Project Status

## Stack
- Frontend: React + Vite + TypeScript + shadcn/ui + React Query
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL (Neon) via Prisma ORM
- Auth: JWT + bcryptjs

---

## Completed
- [x] Backend folder structure created
- [x] Express server running (`src/server.ts`)
- [x] `GET /api/health` route working
- [x] All backend packages installed
- [x] Prisma installed and initialized
- [x] `schema.prisma` defined (User, Preference, Vote models)
- [x] Prisma connected to Neon PostgreSQL
- [x] `prisma migrate dev` ran — tables created in DB
- [x] Auth packages installed (jsonwebtoken, bcryptjs)
- [x] Auth controller and routes created and tested (register, login, edge cases)
- [x] Auth middleware (JWT verification)
- [x] Onboarding route + controller (GET /api/user/me, POST /api/user/preferences)
- [x] Frontend scaffold (React + Vite + TypeScript)
- [x] Tailwind CSS + shadcn/ui installed
- [x] AuthContext + ProtectedRoute
- [x] API layer with axios (auth.api.ts)
- [x] Home page
- [x] Login page
- [x] Signup page
- [x] Onboarding page (3-step form)
- [x] Dashboard placeholder
- [x] Mono-repo setup (frontend + backend under one git repo)

## In Progress
- [ ] Deployment — environment variables need to be set in Render + Vercel dashboards

## Not Started
- (nothing — all features implemented)

---

## Completed (recently confirmed)
- [x] Dashboard routes — backend (coins, news, AI, meme)
- [x] Dashboard page — frontend (4 sections with voting)
- [x] Votes route + controller (GET /api/votes, POST /api/votes with upsert)
- [x] Services: CoinGecko, NewsData, OpenRouter AI, static meme list (all with fallbacks)

## Current Goal
Deploy — set production env vars in Render (backend) and Vercel (frontend).
