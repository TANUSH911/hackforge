# Judge report: ProofClose (as it is today)
Judged on the test report verdict: NOT READY. No Gemini key, no demo photos, empty `ai_cache`. Ward routing is "nearest seeded ticket within 5 km", not the BBMP ward map. Ward stats come from 6 seeded tickets.

## 1. Scores
| Criterion | Weight | Score | Evidence |
|---|---|---|---|
| Innovation | 25% | 7 | Making a closure prove itself with a before/after photo check fills a real gap (research: nobody does it). But today the AI part never runs. |
| Technical (working demo) | 25% | 4 | API, merging, the officer queue, 409 on a second close and the error codes all work. But classify and verify both fall back to manual, and every fallback leaves a stray "Other" ticket. |
| Impact and feasibility | 25% | 6 | The 86.2% closed vs 58.0% roads numbers (OpenCity) are a strong hook, but nothing on screen backs them up, and the routing is a stand-in. |
| Design / UX | 15% | 6 | Clean citizen and officer flows, "demo data" labels are honest. The detail screen is lost on refresh, and manual verdict buttons replace the wow. |
| Presentation | 10% | 5 | The script is good, but it quotes a verdict (0.86) and numbers the app cannot show. |

**Weighted total: 5.7 / 10.** Predicted rank: **~20th of 50** (middle of the pack). With fix 1 done: about 7.0, top 10.

## 2. First 30 seconds
No. The opening ward card says "4 tickets / 25%" from demo data, while the speaker says "86% vs 58%". That mismatch is the first thing a judge notices. Better: open on one screen showing a "Closed" ticket with its before and after photos side by side, stamped **"Not fixed: pothole still visible"**. Opening line: "BBMP marks 86% of complaints Closed. We make every Closed prove it was fixed."

## 3. Top 5 fixes (points per hour)
1. **Get the wow running offline (1.5 h, +1.0 total).** Add `db/photos/ticket_1.jpg` plus fixed demo report/after photos, and seed `ai_cache` rows with the scripted verdicts. Better still, also add a free Gemini key. Without this, the AI track and the demo story both collapse.
2. **Stop the stray ticket on AI fallback (1 h, +0.3).** Don't save the ticket until the category is known: return `needs_category`, then save on the manual pick.
3. **Make the stat honest on screen (0.5 h, +0.3).** Show "OpenCity 2025: 86.2% Closed, roads 58.0%" as a static, sourced line next to the demo ward card. Mostly a pitch fix with one line of UI.
4. **Ward routing claim (pitch-only, 0 h, protects points).** Say "nearest-ward stand-in, the BBMP 2023 polygon lookup is next". Never say "BBMP ward map" in the pitch. A 2-hour shapely swap is the code version.
5. **Detail route `/ticket/:id` (1 h, +0.1).** Refreshing or sharing a link keeps the ticket open.

## 4. Tough questions
1. **"Is this data real?"** No, the on-screen tickets and ward stats are seeded demo data, and they are labelled that way. The 86.2% / 58.0% figures come from OpenCity's analysis of 126,974 real 2025 BBMP grievances.
2. **"What's AI and what's hard-coded?"** Gemini 2.5 Flash classifies the photo and compares before and after; the results are cached by photo hash so the demo is repeatable. Without a key, the officer picks the verdict by hand. Merging duplicates (same category, within 50 m) and the close rules are plain code.
3. **"Doesn't Sahaaya already do this?"** Sahaaya lets citizens escalate, but officials still self-report closure, and DH reported closures with no work done. We add an independent photo check before "Closed" counts.
4. **"Can an official fake the after photo?"** Yes, for now. A photo of a different road could pass, so next we will check the photo's GPS and timestamp against the ticket and let the citizen confirm. The goal is to make lying cost effort, not to make it impossible.
5. **"Does it scale and what does it cost?"** At ~750 grievances/day, only closures need a vision call, which fits a small paid Gemini quota or a local YOLO model. The backend is one FastAPI service with SQLite, and a city version would move to Postgres.
6. **"Privacy and business model?"** We store photos and a location, not names. We would strip EXIF metadata other than GPS and blur faces before showing photos publicly. The buyer is the city corporation or an RWA federation that wants closure numbers it can trust; it is a public-good tool, not an ad business.
