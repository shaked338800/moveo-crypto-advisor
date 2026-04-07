# Project Status

## Stack
- Frontend: React + Vite + TypeScript
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

## In Progress
- [ ] Auth middleware (JWT verification)

## Not Started
- [ ] Onboarding route + controller
- [ ] Dashboard routes (coins, news, AI, meme)
- [ ] Votes route + controller
- [ ] Frontend scaffold
- [ ] Frontend pages (Login, Signup, Onboarding, Dashboard)
- [ ] Frontend auth context
- [ ] Deployment

---

## Current Goal
Verify auth routes work correctly end-to-end.

## Next Step
1. Add try/catch to auth controller
2. Test POST /api/auth/register with Postman
3. Test POST /api/auth/login with Postman
4. Confirm JWT is returned and user appears in DB
