# Winners: civic-tech / govtech / smart city
_Last updated: 2026-10-28. Confirmed = page states a prize. Devpost returned 403 on every fetch, so winners come from college/news/city/event pages; stacks are mostly NOT stated on those pages._
## Confirmed winners
| Project | Event, year, prize | One-line idea | Why it won (demo moment / tech / impact) | Stack | Link |
|---|---|---|---|---|---|
| C&D-waste paver blocks (Sona College team) | Smart India Hackathon 2023, 1st, Rs 1,00,000 (MoHUA) | Crush construction/demolition waste, bind with molten cement-bag material into pavers | Physical result: blocks stronger than kiln mud bricks in 3 h, plus 99.99% pure CO2 by-product; ministry problem statement | Process/hardware, no software stack stated | https://www.indiablooms.com/life/smart-india-hackathon-2023-sona-college-of-technology-student-teams-emerge-winners/details |
| Pothole alert + drowsiness detection (MMEC Mullana) | Hackcidents, IIT Madras, 2023, one of 3 winners (prize not stated) | Vehicle-side pothole alerts combined with driver drowsiness detection | Road-safety hardware plus app; page stresses real-world deployment (MTC bus fitted with sensors) | GPS hardware, companion app, accident-location data | https://www.iitm.ac.in/happenings/press-releases-and-coverages/pothole-location-alerts-drowsiness-detectors-teams-come |
| Crash shock-wave device (Rungta, Bhilai) | Hackcidents, IIT Madras, 2023, one of 3 winners | Detects collision shock, sends location/time to hospitals, police, family | Cuts rescue time; clear emergency-response chain | GPS hardware, app | same as above |
| Team Lumina police dashboard | Karnataka State Police Datathon, 2024, 1st, Rs 1,00,000 | Dashboard for police performance and resource management | Govt-agency data problem, dashboard output | Not stated | https://pce.ac.in/?p=7100 |
| Team Homebrew | Smart India Hackathon 2022 (software), 1st, Rs 1,00,000 | Extract voice and image data from social media in disaster areas for NDRF | Disaster-response use case from a real agency | Not stated | https://pce.ac.in/?p=7100 |
| Hotspotters | Seattle Customer Service AI Hackathon, Nov 2025, 1st | Dashboard mapping service-request hotspots and duplicates, with AI assistant and field route planner | Built on real Seattle Open Data; staff-facing ops value | Seattle Open Data, Bolt, AI assistant | https://innovation-hub.seattle.gov/2025/11/26/seattle-customer-service-ai-hackathon-recap/ |
| Rainy Day Friend (5 Star Rating) | Seattle Customer Service AI Hackathon, Nov 2025, 2nd | Resident Q&A over municipal code with citations plus official analytics | Citation-backed RAG, property-specific answers via GIS | Hybrid RAG, King County GIS API | same as above |
| SafeContractor | CivicHacks 2025 (Boston University), Overall Winner | Verify contractor credentials from public records, AI profile summaries flag scams | Resident-facing, public-records data, clear harm prevented | Public records, LLM summaries | https://www.bu.edu/spark/2025/03/05/civichacks-2025-recap-a-weekend-of-innovation-collaboration-and-impact |
| Green Gauge | CivicHacks 2025, Best Technical Execution | Address to satellite image to AI tree-cover and air-quality insights for policymakers | Type an address, get an instant insight | Satellite imagery, pre-trained CV model, LLM | same as above |
| PoliSights.ai | CivicHacks 2025, Best Use of AI | Automates regulatory tracking for small businesses | Scraping to NLP to searchable store | BeautifulSoup, Scrapy, OpenAI, spaCy, Snowflake, Pinecone | same as above |
| Saarthi.AI (Team Sylithe) | RedBrick Hacks III Nationals, Ashoka Univ., 1st, Rs 2.5 lakh (year not stated on page) | Multilingual assistant nudging low-carbon transport | Sustainable-cities theme, multilingual access | Not stated | https://www.ashoka.edu.in/redbrick-hacks-iii-nationals-finals-held-at-ashoka-university-february-6-8/ |
| Pay4All | ETHforAll 2023 (ETHIndia/Devfolio), QuickNode partner prize | Transparent decentralized payments for grassroots workers | Public-good framing on-chain | Ethereum, QuickNode | https://devfolio.co/blog/from-start-to-finish-the-story-of-ethforall/ |
| NagarikAPP | Nepal AI Hackathon, Mar 2026, overall winner | AI solution for digital public services | Citizen-services focus | Not stated | https://www.b360nepal.com/detail/28027/nepals-ai-hackathon-2026-brings-together-innovators-with-nagarikapp-emerging-as-winner |
## Unconfirmed (snippet only)
- CBIT team, single portal to apply for government services, 1st at VNR VJIET 24h hackathon 2024 (PDF unreadable).
- SF311, GovLink (FutureHacks), Potify (Knoxville) on Devpost: no winner status verified.
- IIM Bangalore DBE vibe-coding hackathon: Jan Saarthi 1st, CivicConnect runner-up (page 404).
- SIH 2024 teams VoltAces, Mavericks (MoHUA): project not described. SIH 2024 Girijananda "Terabyte" won Rs 1L but is an image chatbot, off-theme.
- Rajasthan Police Hackathon 1.0 Team Q-star (geo-tagging private cameras): prize not stated.
## Patterns across winners
- Real agency or open data (police, MoHUA, NDRF, Seattle/Boston records) beats synthetic data.
- Physical or measurable demo moments (paver strength, sensors on a bus) beat slides.
- AI shows up as RAG with citations over municipal text, summarisation of public records, or satellite/CV insight, not a bare chatbot.
- Staff-facing dashboards (hotspots, duplicates, performance) win as often as resident apps.
- Judges rewarded a named, narrow user and one clear harm prevented.
- Generic complaint-reporting or pothole-map apps appear on Devpost but I found no confirmed winner for them.
- India ministry problem statements (SIH) reward a concrete fix to a stated problem over a platform.
## Idea seeds for a solo 24h build
- Cited-answer RAG over a local municipal bye-law or permit PDF, with property-specific lookup.
- Duplicate-complaint merger plus hotspot map on an open 311-style dataset, aimed at ward officers.
- Public-records verifier (licence, vendor, contractor) with an LLM risk summary.
- Address-to-insight page using free satellite/air-quality data for a ward councillor.
- Post-disaster social media triage that outputs a rescue-priority list for responders.
