# Research: Fixing the last mile of civic complaints (Bengaluru)

## Problem in one paragraph
Bengaluru civic complaints go through BBMP's Sahaaya system (built 2014-15 by Indigo Systems), which pools complaints from apps, social media and helplines ([source](https://citizenmatters.in/bengaluru-civic-issues-complaint-fix/)). Deccan Herald reported complaints marked "resolved" while the pothole remained, with one complaint reopened and re-closed at least 15 times ([source](https://www.deccanherald.com/amp/story/india%2Fkarnataka%2Fbengaluru%2Fbbmps-online-redress-forum-closing-2151152)). OpenCity analysed over 126,000 BBMP grievances from H1 2025 ([source](https://opencity.in/category/showcase/)). Officially 39,887 of 41,150 identified potholes were filled by March 2026, but opposition disputes the figure because new potholes keep appearing ([source](https://newskarnataka.com/bengaluru/bengaluru-fills-39887-potholes-but-public-anger-still-remains/15042026/)). I found no published count of complaints closed without a fix.

## Who we build for
Ravi, 34, a Bengaluru commuter and RWA volunteer. He reports the same pothole three times on different channels, gets a "resolved" message, and has no quick way to prove it is still broken or to see who owns it.

## Existing solutions and their gaps
| Solution | What it does | Gap to exploit |
|---|---|---|
| BBMP/GBA Sahaaya | Official complaint hub | Closures without a fix, reopen loops (sources above) |
| I Change My City (Janaagraha) | Citizen complaint portal, ward-level data on OpenCity | Only aggregated data is public; no unverified-closure check |
| Twitter/X tagging and helplines | Fast public pressure | Unstructured, duplicated, unrouted |
| BBMP pothole helpline | Phone reporting | Reported as not working ([DH](https://www.deccanherald.com/india/karnataka/bengaluru/pothole-helpline-not-working-684957.html)) |
Not verified: app-store review complaints for these apps (not searched).

## Building blocks
Only the OpenCity and CKAN rows were seen in search. The rest come from general knowledge and are not verified, so check each before relying on it.
| Name | For | Free limits | Link |
|---|---|---|---|
| OpenCity data portal | Ward-level complaint data, BBMP datasets | Open; no Sahaaya CSV confirmed | https://data.opencity.in/organization/janaagraha |
| India Data Platform (CKAN) | Other BBMP datasets | Licence often unspecified | https://ndp.ckan.civicdatalab.in/dataset/bbmp-notices |
| OpenStreetMap + Nominatim | Geocoding, ward lookup | Free, 1 req/s (unverified) | https://nominatim.org |
| Free LLM tier (Gemini or Groq) | Classify issue, route to department, dedupe text | Free keys, rate-limited (unverified) | - |
| sentence-transformers (local) | Duplicate detection by embeddings | Runs on 8 GB CPU | https://sbert.net |
| Leaflet, SQLite | Map and storage | Free | - |

## Sponsor / track angles
- Best use of AI: photo or text in, classified issue, department and duplicate check out. The brief names no specific sponsor tools.
- Open government data: use the OpenCity ward-level data to show chronic hotspots and ward accountability.

## Risks
- No confirmed public complaint-level Sahaaya data. Plan on synthetic or seed data and say so in the demo.
- Cannot file into the real Sahaaya system, so the demo is a prototype layer, not an integration.
- Real citizens' verification of fixes cannot be tested in 24 hours. Simulate it.
- 8 GB Intel Mac: use small local models or hosted free tiers.

## Sources
- https://citizenmatters.in/bengaluru-civic-issues-complaint-fix/
- https://www.deccanherald.com/amp/story/india%2Fkarnataka%2Fbengaluru%2Fbbmps-online-redress-forum-closing-2151152
- https://www.deccanherald.com/india/karnataka/bengaluru/pothole-helpline-not-working-684957.html
- https://newskarnataka.com/bengaluru/bengaluru-fills-39887-potholes-but-public-anger-still-remains/15042026/
- https://opencity.in/category/showcase/
- https://data.opencity.in/organization/janaagraha
- https://ndp.ckan.civicdatalab.in/dataset/bbmp-notices
