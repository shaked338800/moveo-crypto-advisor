# AI Crypto Advisor

A full-stack personalized crypto dashboard built as part of a coding assignment for Moveo.

The application adapts to user preferences and provides curated daily insights using external data sources and AI.

---

## 🌐 Live Demo

👉 https://moveo-crypto-advisor-s.vercel.app

---

## 🚀 Features

* JWT-based authentication (register / login)
* Onboarding flow to capture user preferences
* Personalized dashboard with:
  * 💰 Coin Prices (CoinGecko API)
  * 📈 7-day price chart per coin (interactive modal)
  * 📰 Market News (NewsData.io)
  * 🤖 AI Insight of the Day (OpenRouter → Mistral 7B)
  * 😂 Crypto Meme of the Day
* ✏️ Edit preferences from the dashboard at any time
* 👍👎 Voting system for each content section
* Feedback loop designed for future personalization

---

## 🧠 Architecture Overview

* Frontend communicates with backend via REST API
* JWT stored in localStorage and attached to every request via Axios interceptor
* Auth state rehydrated on page load via `GET /api/user/me`
* Backend uses a JWT middleware for all protected routes
* External APIs are isolated in a services layer — all with static fallbacks
* Dashboard data is fetched in parallel using `Promise.all`
* Votes are stored per user per content item using an upsert pattern

---

## 🛠 Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 19 + Vite + TypeScript + shadcn/ui |
| Backend  | Node.js + Express v5 + TypeScript       |
| Database | PostgreSQL (Neon) + Prisma ORM          |
| Auth     | JWT + bcryptjs                          |
| Styling  | Tailwind CSS v4                         |

---

## ⚙️ Environment Variables

### Backend (set in Render dashboard)

```
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
COINGECKO_API_KEY=
NEWSDATA_API_KEY=
OPENROUTER_API_KEY=
```

### Frontend (set in Vercel dashboard or `.env.production`)

```
VITE_API_URL=
```

---

## 🤖 AI Assistance

AI tools were used during development as a supporting resource — for looking up syntax, sanity-checking logic, and getting quick answers in unfamiliar areas (e.g. Prisma upsert patterns, CoinGecko API params, Render deployment config).

All architecture decisions, feature design, and implementation were done independently. AI was treated similarly to documentation or Stack Overflow — a reference, not a driver.

---

## 🧩 Future Improvements

* Replace localStorage JWT with httpOnly cookies
* Add refresh token mechanism
* Improve personalization based on voting patterns

---

## 📌 Notes

* Deployed on Vercel (frontend) and Render (backend)
* External APIs all have fallbacks — the dashboard always renders even if APIs are down
* Votes are stored per user and can be used for future recommendation systems
* Rate limiting is applied to auth routes (10 requests / 15 min per IP)
