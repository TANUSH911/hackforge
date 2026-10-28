# What wins: Civic complaints, last-mile resolution (Bengaluru)

Note: knowledge/ was not readable (directory read failed, no Glob); nothing from it used. Winner galleries are thin for this exact theme, so evidence is partly adjacent.

## Past winners
| Project | Link | Idea | Why it won |
|---|---|---|---|
| CivicFix (2nd, $2k, Meta/Reskilll Llama Hackathon, Bengaluru) CONFIRMED | https://getcoai.com/news/highlights-from-metas-first-ever-llama-hackathon-in-india | WhatsApp bot, Llama, reports and tracks local civic issues | Zero-install channel citizens already use plus a sponsor-tech fit (Llama + WhatsApp API). Page gives no judge reasoning. |
| Super SAIJAN (Global Special Award, SAS Hackathon 2025, Jakarta JAKI) CONFIRMED | https://www.sas.com/en_us/webinars/ai-in-action-transforming-jakarta-s-urban-services-with-sas-viya.html | Fuzzy-match duplicate reports, ML prioritisation, anomaly detection, CCTV/image validation, dispatch | Attacks exactly our pain (duplicates, triage) with a full check-rank-dispatch pipeline on a real city's data. |
| DARPG Hackathon 2024 winners (DARPG_163 summariser+translation for last-mile officer; _635 Whisper STT; _285 CPGRAM chatbot) | https://event.data.gov.in/darpg-hackathon-2024-winners/ | Govt grievance-redressal tools on real anonymised grievance data | Winners served the officer who must act, using the organiser's real data. Rank order is my inference. |
| Janaagraha civic hackathon winner (name/date not found) | https://asiafoundation.org (Janaagraha write-up, via search) | WhatsApp app to report official inaction and track complaint action | Built on open municipal data; accountability tracking. Unconfirmed details. |
| Notify 311, Esri UC Hackathon 2013, 1st | https://www.esri.com/esri-news/arcuser/fall-2013/inaugural-uc-hackathon | Resident problem reporting for San Diego | Old; shows report-and-map is a decade-old baseline. |
| SF civic hackathon 1st: 311 AI chatbot | https://missionlocal.org/?p=572552 | AI agent helping with 311 calls | Plain-language AI front door. |
| Memphis 2024 hackathon, challenge winner NEAIA | https://www.memphistn.gov/city-of-memphis-hackathon | AI assistant redirecting non-emergency calls | Relieves a real overloaded city workflow. |

Unconfirmed (no winner badge found): FixMyCity AI https://devpost.com/software/fixmycity-ai (duplicate detection + routing, page returned 403), CivicFix (Devpost) https://devpost.com/software/civifix, PaveGuard https://devpost.com/software/paveguard, Fedora's SIH 2025 CityFix (blog only).

## What most teams will build (avoid)
1. Photo + GPS + category report app with a map.
2. WhatsApp/Telegram complaint chatbot (CivicFix already exists).
3. YOLO pothole detector from an uploaded photo.
4. Admin dashboard with charts of ticket counts.
5. LLM "classify and route to department" demo using a made-up routing table.
All of these treat reporting as the problem. The brief's problem is routing and closure.

## Judging criteria -> full marks
- Innovation 25%: attack the last mile (verify closure, dedupe, escalate), not intake.
- Technical 25%: live end-to-end flow on real data, not slides. Must work on 8 GB Intel Mac with free/local models.
- Impact/feasibility 25%: one number (e.g. X% of sampled complaints are duplicates or wrongly routed) and a named user (ward engineer, not "the city").
- Design 15%: one-screen officer view and a 3-tap citizen flow; mobile-first.
- Presentation 10%: demo first, backup video, impact in one closing line.
Sponsor tracks: AI (any LLM/vision) and open government data; hit both.

## Our stand-out levers (ranked)
1. Closure verification: citizen photos "before" and "after"; a vision/LLM check flags tickets closed without a real fix, and auto-reopens or escalates. Few teams build this.
2. Duplicate clustering plus routing on real open data (Bengaluru/BBMP or data.gov.in complaint data, OpenStreetMap geo): embed text, merge by location+time, show "47 reports -> 1 ticket" live. Mirrors the Jakarta winner.
3. Quantified impact slide from the real dataset: measured duplicate rate, misrouting rate, median time to close.
4. Officer-side tool, not just citizen-side: ranked work queue with auto-drafted escalation message (DARPG winners served the officer).
5. 30-second wow: live paste a messy Kannada/English tweet, watch it classify, dedupe, route and show the SLA clock.
6. Zero-cost stack and a polished, minimal UI; explicitly claim both sponsor tracks (local/open LLM + open data).

Judging-tip basis (vendor blogs, rough guidance): working demo beats architecture; pitch about 60s problem, 90s live demo, 30s impact.
