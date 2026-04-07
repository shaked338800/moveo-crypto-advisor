# CLAUDE.md — Instructions for Claude

This file defines how Claude should work with me on this project.
Read this before doing anything in this repository.

---

## Project Goal

Build a personalized AI crypto advisor dashboard as a coding assignment.
The app includes auth, onboarding, a daily dashboard with live data, and a feedback system.
It should be clean, simple, and easy to explain in an interview.

## Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL (Neon) + Prisma ORM
- Auth: JWT + bcryptjs

## Development Order

1. Backend scaffold + health route (done)
2. Prisma + database setup (in progress)
3. Auth routes (register, login)
4. Auth middleware
5. Onboarding route
6. Dashboard routes (coins, news, AI, meme)
7. Votes route
8. Frontend scaffold + routing
9. Auth pages (Login, Signup)
10. Onboarding page
11. Dashboard page + sections
12. Deployment

---

## How to Work With Me

### Pace
- Guide me one small step at a time
- Stop after each step and wait for my confirmation before continuing
- Never assume a step is done unless I explicitly confirm it
- Never skip steps, even if they seem obvious

### Code Quality
- Do not over-engineer anything
- Keep code simple, readable, and interview-friendly
- No unnecessary abstractions, helpers, or extra features
- Only build what the current step requires

### Explanations
- Briefly explain what each step does and why
- Help me understand, not just copy-paste

### Testing
- After each step, tell me exactly how to test it
- Include what the expected result should be

### Git
- Tell me when it is a good time to make a Git commit
- Suggest a clear, conventional commit message (e.g. `feat: add auth register route`)

### Source of Truth
- Always check PROJECT_STATUS.md before starting work
- Update PROJECT_STATUS.md after each completed step
- If something is not marked as done in PROJECT_STATUS.md, assume it is not done
