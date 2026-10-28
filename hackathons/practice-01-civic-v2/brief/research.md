# Research: Fixing the last mile of civic complaints (Bengaluru)

## Problem in one paragraph
Bengaluru's intake is not the bottleneck; closure quality is. BBMP logged 126,974 grievances in ~5.5 months of 2025 (about 750/day), 86.2% marked "Closed", but road maintenance closes only 58.0%, and just 1.3% are "Reopened" ([OpenCity analysis](https://opencity.in/?p=11842)). Citizens say tickets are closed with no work done, and officials were reported marking issues "resolved" on the app ([Deccan Herald](https://www.deccanherald.com/city/top-bengaluru-stories/bbmp-officials-caught-lying-on-sahaaya-app-1085813.html)). Bengaluru topped NCRB's civic-negligence deaths chart for a 4th year (17 deaths) ([Deccan Herald](https://www.deccanherald.com/amp/story/india%2Fkarnataka%2Fbengaluru%2Fbengaluru-tops-ncrbs-chart-for-civic-negligence-deaths-for-4th-successive-year-3748656)). No official closed-without-fix rate exists; "Closed" cannot be separated from "fixed" in published data.

## Who we build for
Ravi, 34, IT worker in Bellandur/Horamavu (both in the top-complaint wards). He files a pothole complaint, gets "Closed" a week later, the pothole is still there, and he has no cheap way to prove it or escalate. Secondary user: a ward engineer drowning in duplicates.

## Existing solutions and their gaps
| Product | What it does | Gap to exploit |
|---|---|---|
| BBMP Sahaaya 2.0 | Official app + helpline; added a "double escalation" option for unresolved tickets ([DH](https://www.deccanherald.com/amp/story/india%2Fkarnataka%2Fbengaluru%2Fsahaaya-2-0-s-double-escalation-feature-plugs-no-resolution-gap-2873920), unverified: page 403) | Closure self-reported by officials; reports of closure with no action; apps reportedly pulled from stores ([DH](https://www.deccanherald.com/amp/story/india%2Fkarnataka%2Fbengaluru%2Fbbmp-s-sahaaya-pulled-from-app-stores-leaving-citizens-in-a-lurch-3379354)); Sahaaya Plus in development |
| Fix My Street (pothole app) | Photo pothole complaints | Residents say complaints still unaddressed ([South First](https://thesouthfirst.com/karnataka/karnataka-governments-pothole-free-bengaluru-deadline-nears-but-roads-remain-in-ruins)); work orders did not match citizen complaints ([DH](https://www.deccanherald.com/amp/story/india%2Fkarnataka%2Fbengaluru%2Fpothole-complaints-on-bengaluru-local-roads-ignored-finds-study-1238071.html)) |
| I Change My City (Janaagraha) | Citizen complaints routed to civic bodies | Platform-claimed 90%+ resolution is unverified; status of the service unclear ([directory](https://civictech.guide/listing/i-change-my-city)) |
| RWA manual follow-up (e.g. Cooke Town) | Residents chase tickets | Does not scale ([DH](https://www.deccanherald.com/india/karnataka/bengaluru/how-residents-of-cooke-town-beat-the-black-spot-problem-4059235)) |
| iWatchRoad (research) | YOLO pothole detection + GPS map from dashcam | Research prototype, no complaint loop ([arXiv](https://arxiv.org/abs/2508.10945)) |

Gap summary: nobody does independent, citizen-verified closure (before/after photo check) or merges duplicates by location.

## Building blocks
| Name | Use | Free limits / status | Link |
|---|---|---|---|
| BBMP grievances data (OpenCity) | Seed data, category/ward stats | Public portal; file format not confirmed | [data.opencity.in](https://data.opencity.in) |
| I Change My City complaints log 2019-22 | Realistic seed complaints | Listed on OpenCity; resource page 404'd when fetched, `unverified` | [search result](https://data.opencity.in/dataset/i-change-my-city-data/resource/i-change-my-city-complaints-log---2019---2022) |
| BBMP ward map 2023 | Ward routing by point-in-polygon | Public domain, KML (convert with geopandas); 2022/2023/2025 boundaries differ | [OpenCity](https://data.opencity.in/dataset/bbmp-wards-delimitation-2023/resource/bbmp-final-wards-map---2023) |
| Open311 GeoReport v2 | Standard complaint schema/API shape | Open spec, no fees; page itself not opened, `unverified` | [spec](https://webarchive.library.unt.edu/web/20170118233000mp_/http://wiki.open311.org/GeoReport_v2) |
| Gemini API (vision + text) | Classify photo, pick department, compare before/after | Free tier exists, per project; exact per-model numbers not on the docs page (see AI Studio); third-party blogs report cuts, `unverified` | [docs](https://ai.google.dev/gemini-api/docs/rate-limits) |
| Nominatim | Reverse geocode | Max 1 req/s, identifying User-Agent, cache results | [policy](https://operations.osmfoundation.org/policies/nominatim/) |
| OSM tiles + Leaflet | Map UI | Not verified; tile policy not opened, `unverified` | - |
| Ultralytics YOLO + iWatchRoad | Local pothole detection | Paper CC BY-NC-SA; weights/code release not confirmed, `unverified` | [arXiv](https://arxiv.org/abs/2508.10945) |

## Sponsor / track angles
- Best use of AI: Gemini vision to classify the issue, route to department, dedupe, and judge whether an "after" photo shows a real fix.
- Best use of open government data: OpenCity BBMP grievances + ward map to route by ward and show ward-level closure honesty (e.g. roads 58% vs electrical 96.4%).

## Risks
- No access to live Sahaaya/BBMP submission; demo must use a mock department queue or Open311-style stub.
- No public data separating "closed" from "actually fixed"; before/after verification must be demoed with self-made photos.
- Gemini free-tier limits are unconfirmed and recently reported to be cut; cache responses and have a fallback.
- Ward boundary vintages differ (198/243/2025 corporations); pick one and state it.
- 8 GB Intel Mac: avoid training; use API or tiny pretrained models only.
- Dedup by location and image similarity is easy to demo; real-world accuracy not validated.

## Sources
All inline above. Search snippets only (pages not opened): TNM pothole-deaths investigation, South First, DH articles, Nominatim secondary sources. Fetched and read: OpenCity analysis, Nominatim policy, Gemini rate-limits page, arXiv iWatchRoad.
