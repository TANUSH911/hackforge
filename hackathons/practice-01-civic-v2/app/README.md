# ProofClose
A civic ticket closes only when an "after" photo proves the fix.

![screenshot](docs/screenshot.png) <!-- placeholder -->

## Features
- Citizen photo report with GPS or a demo location; AI category, with a manual pick as fallback
- Same category within 50 m → merged into one ticket
- Ward engineer queue, sorted by report count
- Close-with-proof: before/after check → Verified, or Reopened with an escalation draft; a second close returns 409

## Tech
React + Vite + Tailwind · FastAPI + SQLite · Gemini 2.5 Flash (optional)

## Run (3 commands, two terminals)
```
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt && .venv/bin/uvicorn main:app --port 8000
cd frontend && npm install && cp .env.example .env
npm run dev   # set VITE_USE_MOCK=false in .env to use the backend; /officer = engineer view
```
Set `GEMINI_API_KEY` before starting the backend to turn on AI. See `backend/README.md` and `frontend/README.md`.

## Honest notes
- All tickets and ward stats are **seeded demo data** (6 tickets), not BBMP data. The 86.2%/58.0% figures in the pitch are from OpenCity's 2025 analysis and are not computed in the app.
- Without a Gemini key, classify and verify fall back to manual buttons, and a fallback report currently also leaves a stray "Other" ticket (known bug).
- Ward = ward of the nearest seeded ticket within 5 km, a stand-in for BBMP ward-polygon lookup.
- No demo photos ship yet.
