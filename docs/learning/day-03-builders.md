# Day 3 — Frontend, backend, database (how a web app is built)

## The three layers

```
 Browser (frontend)          Server (backend)              Storage (database)
 React + Tailwind     HTTP    FastAPI (Python)      SQL     SQLite file
 what the user sees  <---->  rules + AI calls      <---->  tables of rows
 runs on user's phone  JSON   runs on Render              lives next to the server
```

- **Frontend** — the screens. Runs in the browser. Everything in it is public, so **no secret keys here**.
- **Backend** — the brain. Receives requests, checks them, talks to the database and the AI, sends back answers. Secrets (API keys) live here in `.env`.
- **Database** — the memory. Tables (like Excel sheets) with rows. SQL is the language to ask it things: `SELECT * FROM complaints WHERE ward = 'Koramangala';`

## What an API is
An **API** is a menu of requests the backend accepts. Each item is an **endpoint**:

```
POST /reports          body: {"text": "pothole near Sony signal", "lat": 12.93, "lng": 77.62}
                       reply: {"id": 41, "category": "pothole", "merged_into": 7}
```

- **Method** — `GET` read, `POST` create, `PUT/PATCH` update, `DELETE` remove.
- **Path** — `/reports`, `/reports/7/verify`.
- **JSON** — the text format both sides speak: `{"key": "value"}`.
- **Status code** — `200` OK, `201` created, `400` your request was wrong, `404` not found, `500` server broke.

When you used the Gemini API earlier in plans, it's the same idea: your backend is the *client* calling Google's *server*.

## The contract — why builders can work in parallel
The database agent writes `brief/contract.md`: every endpoint with exact request/response JSON. Then:
- backend builds the server to match it,
- frontend builds screens against it (using **mock mode** — fake responses copied from the contract — until the real server is up).

Like two people building a plug and a socket at the same time from the same drawing.

## Demo-safety tricks built into the agents
| Trick | Why |
|---|---|
| Seed data with real names and fixed IDs | Demo looks real; the "wow" record always exists |
| AI fallback (cache / rules) | Works when the free API rate-limits or Wi-Fi dies |
| `/health` endpoint | One quick check the server is alive before you present |
| Mock mode in frontend | UI never blocked by backend bugs |
| `.env` + `.env.example` | Keys stay secret; others know which keys are needed |

## Vocabulary
- **Virtual env (`venv`)** — a private box of Python libraries for one project.
- **`requirements.txt` / `package.json`** — the shopping list of libraries (Python / JavaScript).
- **CORS** — browser rule that blocks a site calling a server on another address unless the server allows it.
- **Deploy** — put it on the internet: frontend → Vercel, backend → Render.

## Practice
1. In `hackathons/practice-01-civic-v2/brief/plan.md`, find the endpoints section. For one endpoint, write its method, path, and what JSON you'd expect back.
2. Which data in that plan must never be in the frontend? Why?
