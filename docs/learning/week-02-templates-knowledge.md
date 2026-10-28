# Week 2 — Templates and the knowledge base

## Why a template
At hour 0 every team loses 1–2 hours on setup: creating folders, installing libraries, wiring the frontend to the backend, fixing CORS. `templates/fullstack/` is a **working, tested app** you copy and then change. Every lesson from the practice runs is already inside it, so the same bugs can't happen twice.

## Tour of the template

```
templates/fullstack/
├── backend/
│   ├── main.py          FastAPI app: /health + example items API + example AI endpoint
│   ├── ai.py            ask_json(): demo cache → Gemini → honest fallback
│   ├── requirements.txt pinned library versions
│   └── db/
│       ├── schema.sql   tables (keep ai_cache)
│       └── seed.py      demo data + DEMO_AI answers; safe DB path
├── frontend/
│   └── src/
│       ├── api.js       one function per endpoint; mock mode switch
│       ├── mock.js      fake responses with the same shape as the real API
│       ├── App.jsx      tiny router (URL per screen), useApi (loading/error/data)
│       └── index.css    design tokens (colours, fonts, buttons)
├── render.yaml          one-click backend deploy
└── README.md            run in 2 commands, deploy steps
```

## Three ideas worth understanding

**1. Cache-first AI (`ai.py`)**
```
request → is the answer in ai_cache? → yes: return it ("cache")
                                      → no: ask Gemini → valid JSON? → save + return ("gemini")
                                                       → no/timeout → return None → app says "couldn't check"
```
A **hash** (`sha256`) turns any input into a fixed fingerprint, so the same photo/text always finds the same cached answer. Pre-filling the cache for demo inputs = a demo that works offline.

**2. `useApi` — one hook, three states**
Every screen needs *loading*, *error* and *data*. Writing it once means no screen can forget the spinner or show a blank page.

**3. Pinned versions**
`fastapi==0.162.0` (exact) instead of `fastapi` (latest). Tomorrow's new version can't break your hackathon build.

## The knowledge base
Agents used to search the web from zero every time (slow, and Devpost blocks fetches). Now they read `knowledge/` first:
- `judging-playbook.md` — how projects are really scored, 10 reasons finished projects lose.
- `pitch-playbook.md` — 2-minute structure, 5 slides, demo-day rules.
- `winners/<theme>.md` — confirmed past winners in 6 themes, with patterns and idea seeds.

It grows: after each hackathon you add the winners you saw and one lesson.

## Practice
1. Copy the template to a scratch folder and run it with the 2 commands in its README.
2. In `seed.py`, change the demo item's title. Run the backend and click "Run AI" on it. Why does the AI answer disappear? (Hint: the cache key is a hash of the title + body.)
3. Read "10 most common reasons finished projects don't win". Which ones happened to you?
