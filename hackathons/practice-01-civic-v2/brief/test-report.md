# Test report
Verdict: NOT READY (API and UI wiring work; the scripted "wow" verdict cannot appear without a Gemini key, and the no-key fallback creates a stray ticket)

## Demo script walk-through (step → pass/fail)
- Ward card for Bellandur → PASS (now labelled "demo data"; shows 4 tickets / 25%, not the 86%/58% the script quotes)
- Ravi report, AI classifies "Pothole, Roads, Ward 150" → FAIL with no key: returns `other`/`manual` and creates a new ticket #7
- Ravi picks Pothole by hand → PASS: merges into ticket 1, `ticket_report_count: 2`, and sets ticket 1's before photo
- Officer queue shows ticket 1 → PASS (order 3, 2, 1 as in the contract)
- Close with an untouched-road photo → "Not fixed (0.86)" → FAIL with no key: `unclear`, 0%, verdict buttons. "Not fixed" works through the button
- Close with a repaired photo → Verified → PASS through the "Fixed" button; a second close returns 409

## Bugs fixed
- `app/frontend/src/App.jsx`: ward card said "BBMP grievances 2025" and the footer said "OpenCity BBMP Grievances 2025". Both now say demo data (the card uses the API's `source`). Real data must never be claimed for demo numbers.
- `app/backend/main.py`: the escalation draft said "found it NOT fixed" even when the verdict was `unclear`. It now says "could not confirm a fix" for unclear.

## Open bugs
- **blocker**: there are no demo photos and no pre-seeded `ai_cache` (`ai_cache: 0`), so the wow cannot work offline. Fix: add `db/photos/ticket_1.jpg` plus fixed demo report/after photos, then seed `ai_cache` rows keyed by sha256("classify"+photo) and sha256("verify"+before+after) with the scripted verdicts.
- **major**: when the AI fails, `POST /reports` without an override already inserts a ticket of category `other` (or merges into one). The manual re-pick then adds a second report, so every fallback leaves a stray "Other reported by citizen" ticket in the queue. To reproduce: with no key, POST a photo at the demo location and the response shows `ticket_id: 7, merged: false`. A fix needs a contract decision (do not persist until the category is known).
- **minor**: the detail screen has no URL of its own (routes are only `/` and `/officer`), so a refresh loses the open ticket.
- **minor**: ward stats come from the 6 seeded tickets, so the "86% vs 58%" line in the demo script has no data on screen to back it.
- **minor**: the contract names `VITE_API_BASE`, but the code and README use `VITE_API_URL`. The code is consistent with itself, so only the contract doc is wrong.
- **minor**: no `.gitignore` (folder is not a git repo). Add one before pushing: `.venv`, `node_modules`, `dist`, `__pycache__`, `.env*`, `db/proofclose.db`. `.env.local` holds no secrets.

## Judge-proofing checklist
- Every contract endpoint plus its error codes (400/404/409/413/415) → PASS
- Frontend paths and fields match the backend (`/tickets`, `/reports`, `/wards/{n}/stats`, `/close`, `/photo`) → PASS
- Empty / missing photo, wrong type, 9 MB file → PASS (400/415/413)
- Outside BBMP → PASS (`ward_no: null`)
- Double-click submit → PASS by code (buttons disabled while busy); not clicked live
- Backend down → PASS by code (api.js shows "Can't reach the server"); not tried live
- Refresh mid-flow → FAIL (detail screen has no URL)
- `npm run build` → PASS
- Backend starts with README commands, RESEED → PASS
- Wow with no API key → FAIL
- DB reseeded clean after testing → PASS
