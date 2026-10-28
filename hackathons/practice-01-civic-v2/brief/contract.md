# API Contract: ProofClose

Base URL: `${VITE_API_BASE}/api`. JSON unless marked multipart. Timestamps are ISO-8601 UTC strings (`2026-10-21T08:12:00Z`). Field names match `app/backend/db/schema.sql` exactly.

## Changes from plan
- **Seed source is `app/backend/db/seed.py`, not `seed.json`.** The backend reseeds at startup by running `seed.main()` (or `python3 db/seed.py`). Same effect, one file fewer.
- `ai_source` also allows `"seed"` (for pre-seeded reports/verifications).
- Seeded tickets have `before_photo = NULL` unless `app/backend/db/photos/ticket_<id>.jpg` exists. Drop the real demo pothole photo in as `ticket_1.jpg` before the demo, otherwise verify for ticket 1 has no before image.
- Ward numbers use the **198-ward** numbering (150 Bellandur, 25 Horamavu) to match the demo script. The plan's ward map is the **2023 (243-ward)** KML, whose numbers differ. Whoever builds `wards.geojson` must map to these numbers or change the seed.
- **No ward map yet.** A new ticket gets the ward of the nearest seeded ticket within 5 km, else `Outside BBMP`.
- **Before photo:** a citizen report on a ticket with `before_photo = NULL` (e.g. seeded ticket 1) sets it, so Ravi's demo report supplies ticket 1's before photo.
- **Close without a before photo no longer 422s.** It returns 200 with the AI-failure shape (`verdict: "unclear"`, `confidence: 0`, `ai_source: "manual"`, `reason: "No before photo to compare"`, REOPENED); frontend shows verdict buttons as usual.
- **Ward stats are computed live from our own tickets** (`category` = department name, `closed_pct` = VERIFIED share) and the response adds `"source": "demo data"`. No `ward_stats.json`.
- Error body everywhere: `{"detail": "<message>"}` (FastAPI default).

## Enums
- `category`: `pothole | garbage | streetlight | water_leak | other`
- `department` (derived in code): pothole→`Roads & Infrastructure`, garbage→`Solid Waste Management`, streetlight→`Electrical`, water_leak→`BWSSB`, other→`General`
- `status`: `OPEN | REOPENED | VERIFIED`
- `verdict`: `fixed | not_fixed | unclear` (`fixed` counts only if `confidence >= 0.6`)
- `ai_source`: `gemini | cache | manual | seed`

## Demo fixtures (fixed IDs)
- Demo location (Ravi, "Use demo location" button): `lat 12.92600, lng 77.67620`.
- Ticket **1**: pothole, Ward 150 Bellandur, OPEN, 1 report, ~20 m north of demo location. Ravi's pothole report merges into it → `ticket_report_count: 2`.
- Ticket 3: REOPENED streetlight with an existing escalation draft. Ticket 4: VERIFIED example.
- Ward 150 queue (OPEN,REOPENED): tickets 2, 3, 1 (by report_count desc).

---

### GET /health
Response 200: `{"ok": true}`

### POST /reports  (multipart)
Fields: `photo` file (required, image/*, ≤ 8 MB), `lat` float, `lng` float, `note` str optional, `category_override` str optional (one of the categories; skips AI, `ai_source: "manual"`).

Response 201:
```json
{"report_id": 11, "ticket_id": 1, "merged": true, "ticket_report_count": 2,
 "category": "pothole", "department": "Roads & Infrastructure",
 "ward_no": 150, "ward_name": "Bellandur",
 "summary": "Deep pothole on Bellandur Main Rd near Central Mall junction",
 "ai_source": "gemini"}
```
`merged=false` creates a new ticket (status OPEN, `before_photo` = this photo); `summary` is then the AI summary. Outside BBMP: `ward_no: null, ward_name: "Outside BBMP"` (still 201).
Errors: 400 missing photo/lat/lng or bad `category_override`; 413 file > 8 MB; 415 not an image.
AI failure without override: still 201 with `category: "other"`, `ai_source: "manual"`; frontend then shows the manual category picker (resubmit with `category_override`).

### GET /tickets?ward_no=150&status=OPEN,REOPENED
Both params optional (`status` comma-separated). Sorted by `report_count` desc, then `created_at` asc.
Response 200:
```json
[{"id": 2, "category": "garbage", "department": "Solid Waste Management", "ward_no": 150,
  "ward_name": "Bellandur", "lat": 12.9321, "lng": 77.6839, "status": "OPEN",
  "report_count": 2, "summary": "Garbage dumped on footpath, Green Glen Layout 2nd Cross",
  "created_at": "2026-10-19T17:40:00Z"}]
```
Errors: 400 unknown status value.

### GET /tickets/{id}
Response 200: list fields above plus `updated_at`, `has_after_photo` (bool), `escalation_draft` (str|null), and:
```json
{"id": 3, "...": "...", "status": "REOPENED", "report_count": 2, "has_after_photo": false,
 "reports": [{"id": 4, "note": "Dark stretch, unsafe for women walking from bus stop", "created_at": "2026-10-02T19:05:00Z"},
             {"id": 5, "note": "Marked closed on Sahaaya but lights still off", "created_at": "2026-10-12T20:10:00Z"}],
 "verifications": [{"id": 1, "verdict": "not_fixed", "confidence": 0.81,
   "reason": "After photo shows the same unlit poles; no new fixtures visible",
   "ai_source": "seed", "created_at": "2026-10-12T11:00:00Z"}],
 "escalation_draft": "To: Assistant Executive Engineer, Ward 150 Bellandur\nTicket #3 ..."}
```
`reports` oldest first, `note` may be null. `verifications` newest first.
Errors: 404 ticket not found.

### GET /tickets/{id}/photo?kind=before|after
Response 200 `image/jpeg`. Errors: 404 ticket not found or that photo is NULL; 400 bad `kind`.

### POST /tickets/{id}/close  (multipart)
Fields: `photo` file (required, same limits), `verdict_override` `fixed|not_fixed` optional (skips AI, `ai_source: "manual"`, confidence 1.0).
Writes a `verifications` row and stores `after_photo`. `fixed` with confidence ≥ 0.6 → `VERIFIED`, `escalation_draft: null`; else → `REOPENED` with a filled template.
Response 200:
```json
{"status": "REOPENED", "verdict": "not_fixed", "confidence": 0.86,
 "reason": "Pothole still visible in the same spot",
 "escalation_draft": "To: Assistant Executive Engineer, Ward 150 Bellandur\nTicket #1 (pothole, 2 citizen reports) was marked closed but photo verification found it NOT fixed: Pothole still visible in the same spot. Open 7 days. Please reassign and attach proof of repair.",
 "ai_source": "gemini"}
```
AI failure without override: 200 with `verdict: "unclear"`, `confidence: 0`, `ai_source: "manual"`, status REOPENED; frontend shows verdict buttons (resubmit with `verdict_override`).
Errors: 404 ticket; 409 ticket already VERIFIED; 400/413/415 as for reports. (No 422: see Changes.)

### GET /wards/{ward_no}/stats
Computed from the tickets table (demo data, see Changes).
Response 200:
```json
{"ward_no": 150, "ward_name": "Bellandur", "total": 2140, "closed_pct": 84.1,
 "by_category": [{"category": "Road Maintenance", "total": 612, "closed_pct": 57.2},
                 {"category": "Electrical", "total": 388, "closed_pct": 95.9}],
 "source": "demo data"}
```
(Example numbers are illustrative until `ward_stats.json` is computed. `by_category.category` is BBMP's category text, not our enum.)
Errors: 404 ward not in stats.
