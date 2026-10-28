# HackForge full-stack template

React + Vite + Tailwind frontend, FastAPI + SQLite backend, Gemini with an offline demo cache. Copy it at hour 0 and you have a running, deployable app in 10 minutes.

## Use it
```bash
cp -R templates/fullstack hackathons/<event>/app
```

## Run locally (2 terminals)
```bash
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt && .venv/bin/uvicorn main:app --port 8000
```
```bash
cd frontend && npm install && cp .env.example .env.local && npm run dev
```
Open http://localhost:5173. Check the backend: http://localhost:8000/health

## What's built in (lessons from practice runs)
| Feature | Where | Why |
|---|---|---|
| Demo AI cache | `backend/db/seed.py` → `DEMO_AI` | The "wow" works with no API key or Wi-Fi |
| Honest AI fallback | `backend/ai.py`, `label_item` in `main.py` | Never claims a result the AI didn't give |
| Safe DB path | `backend/db/seed.py` | Fixes the `main:app` database bug |
| Reseed on start | `main.py`, `RESEED=1` | Fresh demo data every deploy (Render's disk is wiped) |
| `/health` | `main.py` | 5-second check before you present |
| Mock mode | `frontend/src/mock.js` | Build the UI before the backend exists |
| Loading / empty / error states | `useApi` in `App.jsx` | Looks finished; no blank screens |
| A URL per screen | `usePath` / `go` in `App.jsx` | Refresh mid-demo keeps your place |
| Design tokens | `frontend/src/index.css` | Change colours/fonts in one place |

## Replace the example
1. `backend/db/schema.sql` — your tables (keep `ai_cache`).
2. `backend/db/seed.py` — your demo data and `DEMO_AI` answers.
3. `backend/main.py` — your endpoints from `brief/contract.md`.
4. `frontend/src/api.js` + `mock.js` — one function per endpoint.
5. `frontend/src/App.jsx` — your screens, in demo order.

## Deploy (free)
- **Backend → Render:** New → Blueprint → pick the repo (`render.yaml`). Add `GEMINI_API_KEY` in the dashboard.
- **Frontend → Vercel:** import the repo, root `frontend/`, set `VITE_API_URL` to the Render URL and `VITE_USE_MOCK=false`.
- Render free servers sleep: open `/health` 2 minutes before judging.
