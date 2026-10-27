# Plan: Practice 01 — Civic Tech

`templates/` is empty, so we start from scratch with the default stack.

## 1. Ideas

| # | Idea | Criteria fit | Wow | Feasible in 20h | Demo-able | Total |
|---|---|---|---|---|---|---|
| A | **ProofOfFix**: a verification layer on top of Sahaaya. When an officer marks a complaint resolved, the reporter (or a nearby citizen) uploads an after photo. A vision LLM compares the before and after photos at the same spot. A fake closure reopens automatically and lowers the ward's "verified resolution" score. Messy inputs (tweets, Kannada/English helpline notes) are triaged into the same clusters. | 5 | 5 | 4 | 5 | 19 |
| B | Passive pothole sensing: phone accelerometer detects bumps; 3 hits on a road section opens a complaint | 3 | 4 | 2 (hardware-dependent, hard to demo indoors) | 2 | 11 |
| C | Complaint-to-department router using ward boundaries plus a measured misroute rate on OpenCity data | 4 | 2 | 4 | 3 | 13 |

**Winner: A.** It attacks the exact failure the brief names ("closed without being fixed"), which no common entry targets, and the before/after reopen is a visual wow that fits both sponsor tracks. Idea C's routing becomes a small part of A rather than a standalone product.

## 2. Demo story (2 minutes)

- **Persona:** Ravi, 34, RWA volunteer in Koramangala (ward from seed data).
- **0:00–0:20 hook:** "This pothole was marked 'resolved' 15 times. It's still here." Show a real Deccan Herald headline, then the app.
- **0:20–0:50 triage:** Paste a messy tweet: "@BBMP huge pothole near Sony World signal again!! 3rd time reporting". The LLM extracts category=pothole, location, department=Roads (Major Roads/Ward Engineer), and **merges** it into the existing cluster: "This is the 4th report of the same issue."
- **0:50–1:20 wow moment:** Officer view: officer clicks "Mark resolved". Ravi gets a "Verify fix" prompt and uploads an after photo that still shows the pothole. Within seconds: **"Fix not verified — pothole still visible (confidence 0.91). Complaint reopened."** Status flips red, the ward's verified score drops live.
- **1:20–1:45 accountability:** Ward board: "Claimed resolved 92% vs verified 61%" per ward and department, seeded from open data plus synthetic complaints (stated on screen).
- **1:45–2:00 impact line:** "Zero cost, works on top of Sahaaya, Twitter and helplines. ProofOfFix turns 'resolved' into 'proven fixed'."

## 3. Scope

**Must-have (demo breaks without it)**
1. Report intake: text box (tweet/helpline note) + optional photo + lat/lng → LLM extracts category, department, location text.
2. Duplicate merge: same category within 50 m (haversine) plus text similarity → attach to existing cluster, show report count.
3. Officer view: list of open complaints, "Mark resolved" button.
4. Verify flow: upload after photo → vision LLM compares before/after → `verified` or `reopened` with reason and confidence.
5. Ward accountability board: claimed vs verified resolution rate per ward.
6. Seed data: ~60 synthetic complaints over 8 real Bengaluru wards, with before/after photo pairs for 3 demo complaints.
7. Deployed URL.

**Nice-to-have (only if ahead)**
- Leaflet map of clusters on the citizen screen.
- Ward lookup from OpenCity ward GeoJSON (point-in-polygon) instead of seeded ward names.
- Kannada input example in the demo.
- Fallback rule if the LLM is rate-limited (cached response for demo items).

**Cut**
- Real Sahaaya/Twitter integration, logins/auth, notifications (SMS/WhatsApp), local embedding models (sentence-transformers is too heavy for the gain; the LLM does similarity), native mobile app.

## 4. Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router) + Tailwind, mobile-first | Default; Vercel free deploy |
| Backend | Python FastAPI | Builder knows Python |
| DB | SQLite (file, via `sqlite3` stdlib) | Zero setup; seed file committed |
| Photos | Stored on backend disk under `uploads/`, served at `/uploads/*` | Free; demo-scale |
| AI | Gemini 2.x Flash free tier (text + vision in one API) via `google-genai` | Free, multimodal; one key for triage and photo compare |
| Deploy | Vercel (frontend) + Render free (backend) | Default. Render disk is ephemeral, so the seed script runs on start (`python seed.py` if DB missing) |

Check before relying: current Gemini free-tier model name and rate limits.

## 5. Architecture

```
 Phone browser (Next.js on Vercel)
   /report   /officer   /verify/[id]   /wards
        |  JSON + multipart
        v
 FastAPI (Render) ---- Gemini Flash (triage text, compare photos)
        |
     SQLite  +  uploads/
```

### API endpoints

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/api/reports` | multipart: `text` (str), `lat` (float), `lng` (float), `photo` (file, optional) | `{report_id, complaint_id, merged: bool, report_count, category, department, ward}` |
| GET | `/api/complaints?status=open\|resolved_claimed\|verified\|reopened&ward=` | – | `[{id, category, department, ward, lat, lng, status, report_count, before_photo_url, created_at, reopen_count}]` |
| GET | `/api/complaints/{id}` | – | complaint + `reports: [...]` + `verifications: [...]` |
| POST | `/api/complaints/{id}/resolve` | `{officer_note}` | `{id, status: "resolved_claimed"}` |
| POST | `/api/complaints/{id}/verify` | multipart: `photo` (file) | `{verdict: "fixed"\|"not_fixed"\|"unclear", confidence, reason, status}` |
| GET | `/api/wards/scores` | – | `[{ward, department, claimed_resolved, verified_fixed, verified_rate, reopened}]` |
| GET | `/uploads/{name}` | – | image file |

Rules:
- Merge: open/claimed/reopened complaint with same `category` within 50 m → merge. (If text similarity is wanted, ask Gemini "same issue? yes/no" only when 2+ candidates.)
- Verify: `not_fixed` with confidence ≥ 0.6 → status `reopened`, `reopen_count += 1`. `fixed` ≥ 0.6 → `verified`. Otherwise stays `resolved_claimed`, UI shows "needs another photo".
- Department map (fixed dict): pothole→Roads, garbage→Solid Waste Management, streetlight→Electrical, water_leak→BWSSB, other→Ward Office.

### Data model (SQLite)

- `complaints`: `id INTEGER PK, category TEXT, department TEXT, ward TEXT, lat REAL, lng REAL, status TEXT, before_photo TEXT, report_count INTEGER, reopen_count INTEGER, officer_note TEXT, created_at TEXT, resolved_at TEXT`
- `reports`: `id INTEGER PK, complaint_id INTEGER FK, raw_text TEXT, source TEXT (app|twitter|helpline), photo TEXT, lat REAL, lng REAL, created_at TEXT`
- `verifications`: `id INTEGER PK, complaint_id INTEGER FK, after_photo TEXT, verdict TEXT, confidence REAL, reason TEXT, created_at TEXT`

Ward scores are a SQL `GROUP BY ward, department` over `complaints`; no extra table.

### Gemini prompts (JSON output)
- Triage: input text → `{category, location_text, department, source_guess}`; category is one of the 5 enums.
- Compare: before + after images → `{verdict, confidence, reason}`; prompt says "same location? is the defect still visible?".

## 6. Timeline (24h, sleep allowed)

| Hour | Work | Checkpoint |
|---|---|---|
| 0–1 | Repo, FastAPI + Next.js skeletons, SQLite schema, Gemini key test | |
| 1–3 | `POST /api/reports` with triage + merge; `GET /api/complaints` | |
| 3–5 | Report page + officer list page wired to API | |
| 5–6 | Deploy both (Vercel + Render), seed on start | **Skeleton live by h6** |
| 6–9 | Resolve + verify endpoints, Gemini photo compare, verify page | |
| 9–11 | Ward scores endpoint + board page | |
| 11–12 | Seed data: 60 complaints, 3 before/after photo pairs (take/find CC0 photos) | |
| 12–17 | **Sleep** | |
| 17–18 | Fix overnight issues, ensure all must-haves pass end to end | **Must-haves done by h18** (shifted for sleep; do by h16 if skipping part of sleep) |
| 18–20 | Nice-to-haves: Leaflet map, cached LLM fallback | **Feature freeze h20** |
| 20–22 | Tester run, bug fixes, mobile polish | |
| 22–23 | Record 2-min demo video, 5-slide deck | |
| 23–24 | README, submit repo + video + deck | |

## 7. Task lists

### Backend
1. `main.py` FastAPI app, CORS for Vercel domain, static `/uploads`.
2. `llm.py`: `triage(text) -> dict`, `compare(before_path, after_path) -> dict` using Gemini JSON mode; on error return `{"category":"other",...}` / `{"verdict":"unclear","confidence":0}`.
3. `POST /api/reports` with haversine merge (50 m, same category).
4. `GET /api/complaints`, `GET /api/complaints/{id}`.
5. `POST /api/complaints/{id}/resolve`.
6. `POST /api/complaints/{id}/verify` with thresholds above.
7. `GET /api/wards/scores`.
8. Render deploy: `requirements.txt`, start command `python seed.py && uvicorn main:app --host 0.0.0.0 --port $PORT`.

### Frontend
1. Layout with bottom nav: Report, Officer, Wards. Mobile-first, large tap targets.
2. `/report`: textarea, "use my location" (browser geolocation, default to demo coords), photo input, result card showing category, department, "merged with N reports".
3. `/officer`: filterable list (status chips), "Mark resolved" button per row.
4. `/verify/[id]`: before photo, upload after photo, verdict banner (green verified / red reopened with reason).
5. `/wards`: table of claimed vs verified per ward, red bars where the gap > 20 points.
6. `NEXT_PUBLIC_API_URL` env var; deploy to Vercel.

### Database
1. `schema.sql` with the three tables.
2. `seed.py`: creates DB if missing; 60 complaints across 8 wards (Koramangala, HSR Layout, Indiranagar, Jayanagar, Whitefield, BTM Layout, Malleshwaram, Hebbal), mixed statuses so scores show a claimed-vs-verified gap.
3. 3 demo photo pairs in `seed_photos/` (before, fake after, real-fixed after).
4. Nice: load OpenCity ward GeoJSON for point-in-polygon ward lookup.

### Tester
1. Script the demo story end to end on the deployed URL on a phone viewport.
2. Merge: two reports 20 m apart same category merge; 200 m apart do not.
3. Verify: fake-after photo reopens, fixed photo verifies, unrelated photo gives `unclear`.
4. Gemini failure (bad key) does not crash intake.
5. Ward scores change after a reopen.

### Judge
1. Score the demo video against the 5 criteria; check the wow moment is in the first 60 s.
2. Confirm the deck states synthetic data and prototype-over-Sahaaya honestly.
3. Check both sponsor tracks are claimed with a concrete line each.
