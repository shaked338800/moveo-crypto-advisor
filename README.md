# AI Crypto Advisor

A personalized crypto investor dashboard built as a coding assignment for Moveo.

The app learns about the user through a short onboarding quiz, then displays daily AI-curated content tailored to their crypto interests.

## Features

- JWT-based authentication (register / login)
- Onboarding quiz to capture user preferences
- Daily dashboard with 4 sections:
  - Coin Prices (CoinGecko API)
  - Market News (CryptoPanic API)
  - AI Insight of the Day (OpenRouter)
  - Fun Crypto Meme
- Thumbs up/down voting on each section

## Tech Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Frontend | React + Vite + TypeScript      |
| Backend  | Node.js + Express + TypeScript |
| Database | PostgreSQL (Neon) + Prisma     |
| Auth     | JWT + bcryptjs                 |

## Status

Work in progress. See PROJECT_STATUS.md for current state.
