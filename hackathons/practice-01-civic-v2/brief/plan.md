# Plan: Practice 01 Civic Tech

`templates/` is empty (only `.gitkeep`), so every part of the app is written from scratch. Keep it small.

## 1. Ideas

| # | Idea | Criteria fit | Wow | Feasible in 20h | Demo-able | Total |
|---|---|---|---|---|---|---|
| A | **ProofClose**: an official can only close a ticket by uploading an "after" photo. Gemini compares it with the citizen's "before" photo. If the issue is still there, the ticket reopens and the app drafts an escalation. Reports within 50 m of the same category merge into one ticket. Tickets are routed to a ward using the BBMP ward map. | 5 | 5 | 4 | 5 | **19** |
| B | Duplicate-cluster map: load real BBMP grievances, cluster them, and show "N reports become 1 ticket" plus a ranked queue for the ward engineer | 4 | 3 | 4 | 4 | 15 |
| C | Ward "closure honesty" scorecard from OpenCity data, with a citizen re-check prompt sent N days after closure | 4 | 3 | 5 | 3 | 15 |

**Winner: A.** It attacks the gap research found: nobody verifies that a closed ticket was really fixed. It also covers both sponsor tracks, AI through Gemini vision and open data through the ward map and BBMP grievances. B's dedupe and C's honesty stat are folded into A as small parts, so they add almost no build time.

## 2. Demo story (2 minutes)

- **0:00–0:30 Problem.** "BBMP marks 86% of grievances Closed, but roads close only 58%, and citizens say closed tickets often weren't fixed." Show the ward honesty card for Bellandur, computed from the OpenCity 2025 CSV.
- **0:30–1:00 Report.** Ravi, 34, Bellandur, on a phone. He taps Report, adds a pothole photo and sends it. The app shows "Pothole, Roads dept, Ward 150 Bellandur" in about 3 seconds. A second, pre-seeded report from a neighbour 20 m away merges in, and the card shows "2 reports, 1 ticket".
- **1:00–1:40 The wow.** The ward engineer's queue shows that ticket. He tries to close it with a photo of a different, untouched road. Gemini rejects it: **"Not fixed: pothole still visible (confidence 0.86)"**. The ticket goes back to Reopened and an escalation draft appears. Then he uploads a real repaired-road photo, and the ticket shows "Verified fixed".
- **1:40–2:00 Impact line.** "Closed should mean fixed. ProofClose makes every closure prove itself. Ravi never chases a fake 'Closed' again."

Any feature that does not serve this story is cut.

## 3. Scope

**Must-have (the demo breaks without it)**
1. Citizen report: photo, browser GPS (with a fallback "use demo location" button), optional note.
2. Gemini classifies the photo into a category, a department and a one-line description.
3. Ward lookup with shapely point-in-polygon against the BBMP 2023 ward GeoJSON.
4. Dedupe: same category and within 50 m (haversine) of an open ticket attaches the report to that ticket.
5. Officer queue, one screen: tickets for one ward, sorted by report count.
6. Close-with-proof: an after photo goes to Gemini with the before photo. Verdict `fixed` gives status VERIFIED. `not_fixed` or `unclear` gives REOPENED plus an escalation draft.
7. Ward honesty card: 2025 closure % by category, precomputed into `ward_stats.json`.
8. AI fallback: responses cached by SHA-256 of the image(s); on a 429 or error, use the cache, else a manual category picker or verdict buttons. **The demo must never hang on a 429.**
9. Deployed: frontend on Vercel, backend on Render.

**Nice-to-have (only if ahead of schedule)**
- Citizen "still broken?" re-check link on a ticket page.
- Paste a Kannada/English tweet as the text report.
- Leaflet map of tickets in the officer view.

**Cut**
- Login/auth (role is chosen with a toggle).
- Real Sahaaya integration; the department queue is a mock.
- YOLO or any local model.
- WhatsApp bot.
- Charts dashboard.
- Notifications.
- Multi-city support.

## 4. Stack

- **Frontend:** React + Vite + Tailwind, with Leaflet only if the map nice-to-have lands. It is a mobile-first single page with two routes, `/` (citizen) and `/officer`. Plain React instead of Next.js because there is no SSR need and there is less to learn. Deployed on Vercel Hobby (free, no card, non-commercial use is fine for a hackathon).
- **Backend:** Python 3.11 + FastAPI + uvicorn, with `google-genai`, `shapely` and `pillow`. Deployed on a Render free web service.
- **Database:** SQLite via the stdlib `sqlite3`. Render's free filesystem is ephemeral and wiped on spin-down or redeploy, so the backend **reseeds from `seed.json` on startup**. That is fine for a demo.
  - Photos are stored as downscaled JPEG bytes in SQLite, max 800 px.
  - Before the demo, open the Render URL 2 minutes early, because a cold start takes about 30–60 s.
  - Backup plan: run the backend locally on the laptop.
- **AI:** Gemini API free tier, Flash family. The model name lives in the env var `GEMINI_MODEL`, default `gemini-2.5-flash`.
  - At h0, pick whichever Flash model AI Studio lists as free for the project. Third-party sources disagree on which models and limits apply, and Google no longer publishes the numbers in its docs.
  - Assume about 10 RPM and a low daily cap. The demo needs fewer than 30 calls, so warm the cache once before the demo.
- **Data:**
  - OpenCity BBMP Grievances 2025 CSV, public domain, data to June 19 2025.
  - BBMP 2023 ward map, KML, converted once to GeoJSON with geopandas on the laptop and committed as `wards.geojson`.
- **Map tiles (nice-to-have only):** OSM standard tiles. The usage policy allows light use with "© OpenStreetMap contributors" attribution; demo traffic is light.

## 5. Architecture

```
[Phone browser: React/Vite on Vercel]
        |  fetch JSON / multipart
        v
[FastAPI on Render] --- sqlite3 (reseeded from seed.json at boot)
   |-- ai.py      -> Gemini API (classify, verify) + sha256 cache table
   |-- geo.py     -> shapely on wards.geojson, haversine dedupe
   '-- ward_stats.json (precomputed offline from OpenCity CSV)
```

**Endpoints** (base `/api`, JSON unless marked multipart)

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/health` | none | `{"ok": true}` |
| POST | `/reports` | multipart: `photo` (file), `lat` (float), `lng` (float), `note` (str, optional), `category_override` (str, optional) | `{"report_id", "ticket_id", "merged": bool, "ticket_report_count", "category", "department", "ward_no", "ward_name", "summary", "ai_source": "gemini"\|"cache"\|"manual"}` |
| GET | `/tickets?ward_no=150&status=OPEN,REOPENED` | query | `[{"id", "category", "department", "ward_no", "ward_name", "lat", "lng", "status", "report_count", "summary", "created_at"}]`, sorted by report_count desc |
| GET | `/tickets/{id}` | none | ticket fields + `"reports": [{"id", "note", "created_at"}]` + `"verifications": [...]` + `"escalation_draft"` |
| GET | `/tickets/{id}/photo?kind=before\|after` | none | `image/jpeg` |
| POST | `/tickets/{id}/close` | multipart: `photo` (file), `verdict_override` ("fixed"\|"not_fixed", optional) | `{"status": "VERIFIED"\|"REOPENED", "verdict", "confidence", "reason", "escalation_draft": str\|null, "ai_source"}` |
| GET | `/wards/{ward_no}/stats` | none | `{"ward_no", "ward_name", "total", "closed_pct", "by_category": [{"category", "total", "closed_pct"}]}` |

**Gemini prompts** (ask for a JSON response, parse it with `json.loads`, validate the enum values)
- **Classify:** `{"category": one of [pothole, garbage, streetlight, water_leak, other], "summary": str<=80}`. Map category to department in code: pothole → Roads & Infrastructure, garbage → Solid Waste Management, streetlight → Electrical, water_leak → BWSSB, other → General.
- **Verify** (before and after images in one call): `{"verdict": fixed|not_fixed|unclear, "confidence": 0-1, "reason": str<=100}`. A `fixed` verdict only counts if confidence ≥ 0.6.
- **Escalation draft:** a Python f-string template, no LLM call. It names the ticket, ward, report count, days open and the AI reason, and is addressed to the ward's Assistant Executive Engineer.

**Data model (SQLite)**
- `tickets`: id INTEGER PK, category TEXT, department TEXT, ward_no INTEGER, ward_name TEXT, lat REAL, lng REAL, status TEXT (OPEN|REOPENED|VERIFIED), summary TEXT, before_photo BLOB, after_photo BLOB NULL, escalation_draft TEXT NULL, created_at TEXT, updated_at TEXT
- `reports`: id INTEGER PK, ticket_id INTEGER FK, lat REAL, lng REAL, note TEXT, photo BLOB, ai_source TEXT, created_at TEXT
- `verifications`: id INTEGER PK, ticket_id FK, verdict TEXT, confidence REAL, reason TEXT, ai_source TEXT, created_at TEXT
- `ai_cache`: key TEXT PK (sha256 of the prompt kind plus the image bytes), response_json TEXT

## 6. Timeline (24h; sleep h12–h15)

| Hour | Work | Checkpoint |
|---|---|---|
| h0 | Get a Gemini key from AI Studio and note the free Flash model. Create the repo. Download the 2025 CSV and the 2023 KML. | |
| h1 | FastAPI skeleton, `/health`, SQLite schema plus seed loader | |
| h2 | Vite + Tailwind skeleton with two routes and the role toggle | |
| h3 | Convert the KML to `wards.geojson`; write `geo.py` (ward lookup, haversine) with an assert self-check | |
| h4 | `POST /reports` with a stubbed category; `GET /tickets` | |
| h5 | Deploy the backend to Render and the frontend to Vercel; set CORS and env vars | |
| **h6** | **Phone hits the deployed URL; a report shows in the officer list** | **Skeleton deployed ✅** |
| h7 | `ai.py` classify plus the cache plus the manual fallback | |
| h8 | Dedupe merge in `POST /reports`; seed the neighbour report | |
| h9 | Officer queue UI and ticket detail with before photo | |
| h10 | `POST /tickets/{id}/close` with Gemini verify and the escalation template | |
| h11 | Close-with-proof UI showing verdict, reopen and escalation | |
| h12–h15 | Sleep | |
| h15 | Precompute `ward_stats.json`, then build the honesty card (endpoint plus UI) | |
| **h16** | **Full demo story runs on the deployed app** | **All must-haves ✅** |
| h17–h19 | Nice-to-haves in order (re-check link, tweet paste, map), only if h16 passed | |
| **h20** | **Feature freeze.** Shoot the demo photos (pothole, other road, repaired road) and warm the AI cache | **Freeze ✅** |
| h21 | Tester full run on phone and desktop; fix bugs only | |
| h22 | Judge review; polish copy and empty/loading states | |
| h23 | Record the 2-min video, make the 5-slide deck, write the README, submit | |

**If the plan slips:** cut the honesty card UI and show the stat on a slide instead. Do not move h16.

## 7. Task list per agent

**Backend**
1. FastAPI app with CORS (Vercel origin plus localhost) and `/api/health`.
2. `db.py`: schema creation and a `seed.json` loader that runs on startup.
3. `geo.py`:
   - `ward_for(lat, lng)` using shapely over `wards.geojson`; returns `(None, "Outside BBMP")` when no ward contains the point.
   - `haversine_m`.
   - Assert self-check on two known points.
4. `ai.py`:
   - `classify(img_bytes)` and `verify(before, after)` returning validated dicts.
   - `ai_cache` lookup first.
   - Catch every exception; on error return `ai_source="manual"` with `category="other"` or `verdict="unclear"`.
5. `POST /api/reports`:
   - Downscale the image with Pillow.
   - Reject files over 8 MB or anything that is not an image.
   - Classify, look up the ward, dedupe within 50 m with the same category among OPEN/REOPENED tickets, then insert.
6. `GET /api/tickets`, `GET /api/tickets/{id}`, `GET /api/tickets/{id}/photo`.
7. `POST /api/tickets/{id}/close`: verify, write a `verifications` row, set the status, fill the escalation template.
8. `GET /api/wards/{ward_no}/stats` from `ward_stats.json`.
9. `render.yaml` / start command `uvicorn main:app --host 0.0.0.0 --port $PORT`; env vars `GEMINI_API_KEY`, `GEMINI_MODEL`, `FRONTEND_ORIGIN`.

**Frontend**
1. Vite + React + Tailwind scaffold; `API_BASE` from `VITE_API_BASE`.
2. Citizen page:
   - Large Report button, camera/file input (`accept="image/*" capture="environment"`), GPS with a "Use demo location (Bellandur)" fallback, optional note.
   - Result card showing category, department, ward, and "N reports, 1 ticket" when merged.
3. Officer page:
   - Ward selector, default 150; queue list sorted by report count with status chips.
4. Ticket detail:
   - Before photo; "Close with proof" upload.
   - Verdict banner, green VERIFIED or red REOPENED with the reason.
   - Escalation draft in a copyable textarea.
5. Ward honesty card at the top of the officer page.
6. Loading spinner. If the AI is unavailable, show manual category or verdict buttons.
7. Accessibility: labelled inputs, alt text, 44 px tap targets.
8. Deploy to Vercel.

**Database / data**
1. Convert the BBMP 2023 ward KML to `backend/data/wards.geojson`; keep only ward_no and ward_name, and simplify geometry so the file stays small.
2. Write `scripts/ward_stats.py`: read the OpenCity 2025 CSV with pandas and write `backend/data/ward_stats.json` (closure % per ward per category). Inspect the columns first, since they are not confirmed.
   - If the CSV has no ward column, fall back to city-level stats by category and say so on the card.
3. `backend/data/seed.json`: 6 tickets across Bellandur and Horamavu, plus one open pothole about 20 m from the demo location, ready for the merge.
4. `ward_stats.py` doubles as the source of the impact number: report the citywide closed % and the roads closed %.

**Tester**
1. Run the `geo.py` self-check and a curl script hitting every endpoint.
2. Run the full demo story on a real phone against the deployed URLs. Do it once with a valid key and once with `GEMINI_API_KEY` unset; the fallback must work.
3. Edge cases:
   - No GPS permission.
   - A point outside BBMP.
   - A non-image upload.
   - A 10 MB photo.
   - Two quick reports at the same spot.
4. Cold start: hit the Render URL after 20 minutes idle and note how long it takes.

**Judge**
1. At h16 and again at h22, score against the criteria: innovation 25, technical 25, impact 25, design 15, presentation 10.
2. Check the demo stays within 2:00 and the wow moment lands by 1:40.
3. Check the deck: problem number, demo, how it works, open data and AI used (claim both tracks), impact line.
4. Flag any claim not backed by the data, such as dedupe accuracy, which is not validated.

## Verified dependencies (WebSearch, 2026-10-28)
- **Gemini API free tier.** It exists for Flash and Flash-Lite models with no billing account. Exact per-model limits only show per project in AI Studio, and third-party sources conflict. Mitigation: cache, fallback, and the model name kept in an env var.
- **Render free web service.** 750 hours a month, spins down after 15 minutes idle, ephemeral filesystem. Mitigation: reseed at boot.
- **Vercel Hobby.** Free, no card, for non-commercial projects.
- **OpenCity BBMP Grievances.** One CSV per year from 2020 to 2025; the 2025 file is public domain and runs to June 19 2025. Columns not opened yet; the data task 2 checks them.
- **OSM tiles.** Light use is allowed with attribution; no SLA.
- **BBMP 2023 ward KML.** Taken from research.md and not re-searched; open it at h0.
