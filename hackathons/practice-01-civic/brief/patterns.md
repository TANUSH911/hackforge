# What wins: Civic tech (complaint reporting and resolution)

Note: only 4 past winners were found in two searches, so this table is short. No Bengaluru-specific civic winner turned up. Details of why each won are inferred from the sources' own descriptions.

## Past winners
| Project | Link | Idea | Why it won |
|---|---|---|---|
| Indy Civic Hack Day 2014 winner (pothole app) | https://indychamber.com/2014/06/03/pothole-app-developers-win-first-ever-indy-civic-hack-day/ | Dashboard phone detects bumps; a service request opens after 3 flags on a road section | Passive data collection, no citizen effort; concrete trigger rule |
| Indy runner-up (Team MACti) | same link | Opt-in text/email trash-day reminders | Simple, useful, easy to explain |
| ThinkChicago Civic Tech Challenge winner (Omer Khan) | https://engineering.wayne.edu/news/computer-science-student-wins-thinkchicago-civic-tech-challenge-44511 | Photo of traffic/pothole issue, auto-geotagged for the city | Low-friction capture, direct city usability |
| Bloomington Civic Code & Design Challenge 2018 | https://bloomington.in.gov/node/3540 | Resident interface for reporting potholes and graffiti | Design and UX focus |

Unconfirmed as winners: CivicVoice (https://devpost.com/software/civic-voice, AI duplicate detection) and CivicLens AI (image detection of potholes and garbage). Useful as proof that "AI duplicate plus vision" is a common entry.

Context: BBMP's Sahaaya app is criticised for marking complaints "resolved" falsely (https://www.deccanherald.com/city/top-bengaluru-stories/bbmp-officials-caught-lying-on-sahaaya-app-1085813.html). This is the real pain point behind the brief.

## What most teams will build (avoid these)
1. Photo plus GPS complaint app with a map of pins.
2. LLM or vision classifier that detects pothole/garbage from a photo.
3. Chatbot or WhatsApp bot that files complaints.
4. Official dashboard with heatmaps and counts.
5. Duplicate detection by text embeddings alone.

## Judging criteria to full marks
- Innovation (25%): attack the "closed without being fixed" gap, not filing. Citizen-verified closure beats another reporter.
- Technical (25%): a live end-to-end flow on real or realistic data: submit, dedupe, route, resolve. No slides-only.
- Impact and feasibility (25%): a number, such as a duplicate rate or misrouting rate on a real dataset. Show it works with the existing channels (Sahaaya, Twitter, helpline) at zero cost.
- Design (15%): usable in under 30 seconds on a phone, with an officer view as clear as the citizen view.
- Presentation (10%): a 2-minute video with the wow moment first.

## Our stand-out levers (ranked)
1. Closure verification: when an official marks a complaint resolved, ask the reporter or nearby citizens for an after photo. A vision model compares before and after and reopens fake closures. This targets the stated "closed without being fixed" failure.
2. Messy-input triage demo: paste a tweet or a Kannada/English helpline note; the LLM extracts the issue, location and correct department, and merges it into an existing cluster. Show it live in the first 30 seconds (Best use of AI track).
3. Open government data: use public Bengaluru ward and department boundaries and past complaint data to route by ward and to report a measured duplicate/misroute rate (open data track and an impact number).
4. Accountability view: per-ward and per-department "claimed vs verified resolved" score, an honest metric officials can act on.
5. Runs on free tools (local or free-tier LLM, SQLite, Leaflet) so it is feasible on an 8 GB laptop and credible for real deployment.
6. Polished two-screen UI (citizen and officer) with seeded realistic data so the demo never depends on live luck.
