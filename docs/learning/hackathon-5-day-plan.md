# 5-Day Hackathon Sprint (2 hrs/day)

Goal by Sunday: build and deploy a small full-stack AI web app on your own.

## Stack (and why)
- **Frontend:** HTML + CSS + JavaScript, Tailwind via CDN. No build step, nothing to install.
- **Backend:** Python + FastAPI. You already know Python, so you only learn the web part.
- **Database:** Supabase (free hosted Postgres).
- **AI:** Gemini API (free tier).
- **Deploy:** Render (backend) + Netlify/Vercel (frontend).

## Days
| Day | Concept (~20 min) | Build (~100 min) |
|---|---|---|
| 1 | How the web works: client, server, HTTP, JSON | Page with HTML/CSS/Tailwind + JS that reacts to a button and calls a public API with `fetch` |
| 2 | APIs and routes, GET vs POST | FastAPI backend with 2 endpoints; frontend calls it |
| 3 | Databases, tables, SQL basics | Save and list data in Supabase from FastAPI |
| 4 | Calling an LLM, env vars, keeping keys secret | Add a Gemini feature (summarize/classify/chat) |
| 5 | Deploying, README, demo pitch | Deploy both parts and do a 2-hour mini-hackathon dry run |

## Hackathon-day rules
- Build the smallest version that demos end to end first, then polish.
- Commit after every working step.
- Keep a list of "fake it" options: hardcoded data is fine for a demo.
