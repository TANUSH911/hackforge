# Winners: sustainability / climate / agriculture
_Last updated: 2026-10-28. Confirmed = page states a prize._
Note: "Why it won" is often my inference from the source description; sources rarely give judge reasoning. Stack "n/s" = source did not state it.

## Confirmed winners
| Project | Event, year, prize | One-line idea | Why it won (demo moment / tech / impact) | Stack | Link |
|---|---|---|---|---|---|
| NEXAURA 2.3 (Sairam, India) | Smart India Hackathon 2025 Software Edition, 1st prize, Rs 1,50,000 | Smart crop advisory system for small and marginal farmers (SIH25010) | Government problem statement, farmer-facing advisory (inferred) | n/s | https://sairam.edu.in/?p=52079 |
| Code Hydrotopes (CMRIT Bangalore, India) | SIH 2022, Rs 1 lakh | Web+mobile app recommending which crop to grow per season based on water availability (Central Water Commission problem) | Water-scarcity framing; suggests alternatives to conventional crops to cut low-yield risk | n/s | https://news.careers360.com/cmrit-bangalore-engineering-software-team-wins-smart-india-hackathon-2022 |
| Agriguru (HITS, India) | Infosys Global Hackathon (Tech for Good) 2025, 1st prize, Rs 5 lakh, Challenge 7, 33 finalist teams | AI farming companion: crop recommendation, plant disease diagnosis, satellite insights, regional-language voice | SDG 2 fit, voice in regional languages, cleared several rounds plus mentoring | n/s | https://hindustanuniv.ac.in/events/hits-students-win-top-prize-at-infosys-global-hackathon/ |
| Smart Trash Bin (K J Somaiya, India) | Climate Hackathon 2024 (Ekonnect + US Consulate Mumbai), Rs 1.5 lakh | Smart waste bin (page gives no detail) | n/s | n/s | https://kjsce.somaiya.edu/en/view-announcement/678 |
| Sustain-ify (Amrita, India) | HackHarvard 2024, Overall Best Hack (All-Track Grand Prize) | AI app: scan packaging video for eco/health impact, photo of waste gives DIY upcycle ideas, eco-shopping assistant | Judged on innovation, technical complexity, functionality; consumer-facing AI with 3 features; first Indian university to win it | AI-powered; n/s | https://www.amrita.edu/news/amrita-students-win-grand-prize-in-a-world-renowned-hackathon-at-harvard/ |
| Spoon Share (Deogiri Inst., India) | Google Solution Challenge 2024, one of 3 grand prize teams (Demo Day 27 Jun 2024; $3,000 each) | Connects surplus-food donors with people in need, volunteer/org verification | Food waste + hunger, verified listings | Flutter, Firebase, Google Maps API | https://blog.google/technology/developers/meet-the-students-that-are-changing-the-world-through-technology/ |
| Climate Change Impact on Himalayan Timberline (India team) | Cloudera + AMD Climate and Sustainability Hackathon, Apr 2024, 3rd place | Analyses temperature/precipitation correlation in the Himalayan treeline to help communities anticipate change | Judged on uniqueness, code quality, web app quality, environmental impact | Cloudera ML AMP on AMD | https://cxotoday.com/press-release/cloudera-machine-learning-hackathon-generates-groundbreaking-climate-and-sustainability-projects/ |
| AviWind Guardian | Same Cloudera/AMD event, 1st place | Balances wind-energy growth against migratory-bird risk for developers/conservationists | Clear tradeoff tool, environmental impact | Cloudera ML AMP | same link |
| Center of Meteorological Technology (Code of Duty, Mexico) | Same event, 2nd place | App improving wind-speed prediction (pressure, temp, humidity, direction) for hurricane decisions | Usable app on real weather features | Cloudera ML AMP | same link |
| EcoRoute (AUD, UAE) | AI for Sustainability Hackathon (EU Delegation UAE + Sorbonne Abu Dhabi) 2025, Sustainable AI Excellence Award | Recommends sustainable walking routes in cities | Judges called it most practical and impactful; geospatial + satellite indicators + live map | ML, geospatial, route optimisation, interactive map | https://www.aud.edu/all-news/aud-students-win-top-sustainability-award-at-eu-s-ai-for-sustainability-hackathon |
| Pollution prediction solution (MPSTME Shirpur, India) | AISEHack 2026 (ANRF, IIT Delhi, IBM, IIIT-H), 1st position, Pollution Prediction theme | AI-based pollution prediction (no detail) | Won offline finale among 2,100+ students | n/s | https://engineering-shirpur.nmims.edu/mpstme-students-win-first-prize-at-aisehack-2026/ |

## Unconfirmed (snippet only)
- FarmConnect (MPSTME Shirpur), SIH 2024 grand finale: page says top 6 of 500+ teams, no prize named (mobile app for direct farmer market access) https://engineering-shirpur.nmims.edu/farmconnect-team-from-mpstme-shirpur-shines-at-sih-2024-grand-finale/
- Khwaab Society (RCCIIT), SIH 2025 AI farmer query advisory: search snippet says Rs 1.5 lakh; KIIT page returned 403.
- CODE FUSERS (Techno Main Salt Lake), crop disease prediction, Rs 1 lakh: year/round unverified (IITH PDF unreadable).
- Bhartiya Coder Party (GGSIPU), 1st at Sustainovation by Intin 2025, Rs 1 lakh: confirmed winner but project not described https://www.tribuneindia.com/news/business/union-minister-shri-bhupender-yadav-felicitates-lakhpati-winning-team-of-sustainovation-by-intin-indias-sustainability-hackathon/amp
- Devpost galleries (hacktheclimate, intelligentplanet) returned 403; no winners read.

## Patterns across winners
- Farmer-facing advisory (crop choice, disease, voice in local language) dominates Indian wins, mostly via SIH and corporate "Tech for Good" events: the idea is common, so winners differ by a concrete data hook (water availability, satellite).
- Consumer-scan-and-explain (Sustain-ify, packaging video, waste photo) won the biggest generic prize; multi-feature polished AI demo beat niche tools.
- Food-waste redistribution won Google Solution Challenge with plain Flutter/Firebase/Maps; verified-donor trust layer was the differentiator.
- Cloudera climate winners used real meteorological/ecological data and framed a tradeoff or decision (wind vs birds, treeline change) rather than a generic dashboard.
- Geospatial/satellite + routing/prediction (EcoRoute, pollution prediction, wind speed) is a repeating AI use; judges praised "practical and impactful".
- Judging language stresses impact, code quality and usability; named SDG alignment appears in nearly every Google/Infosys write-up.
- Not seen winning in what I read: generic waste-bin or plain dashboards (Smart Trash Bin won, but with no detail to learn from); cannot say what lost because losing entries are not published.

## Idea seeds for a solo 24h build
- Decision tool for a single tradeoff using a public dataset (e.g. solar vs. crop land, or irrigation timing vs. forecast) with a one-screen recommendation.
- Voice-first (Hindi/regional) farmer assistant that answers one question well, such as "can I sell/spray today" using weather + mandi price APIs.
- Photo-in, action-out waste/packaging scanner with an Indian-product database (FSSAI labels, plastic codes).
- Surplus-food or surplus-produce matcher with a trust/verification step and a live map demo.
- Hyperlocal pollution or heat forecast for one city, shown as safe-route advice rather than a chart.
