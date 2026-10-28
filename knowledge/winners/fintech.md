# Winners: fintech
_Last updated: 2026-10-28. Confirmed = page states a prize._

Note: Devpost/Finextra/Finastra/BS pages returned 403 to fetches; sources below are news/college/university pages that were opened. Many articles omit tech stacks ("not stated").

## Confirmed winners
| Project | Event, year, prize | One-line idea | Why it won (demo moment / tech / impact) | Stack | Link |
|---|---|---|---|---|---|
| Moneymitra (India) | MumbaiHacks 2025, Fintech track winner (amount not stated) | AI personal-finance app: automated budgeting, OCR/SMS transaction classification, spending alerts, stock tracking, multilingual financial literacy | Article stresses feature breadth, "enterprise-grade security", multilingual literacy; judging criteria not stated | not stated | https://cxotoday.com/media-coverage/mumbaihacks-2025-crowns-indias-next-gen-ai-innovators-becomes-worlds-largest-agentic-ai-hackathon/ |
| FinOps Copilot (India) | MumbaiHacks 2025, Fintech runner-up | Natural-language agent automating fintech ops (quote fetching, policy updates) | Live AI agents for client reminders and policy queries | not stated (agentic AI) | same as above |
| Akatsuki (IIT Delhi, India) | SIB Finathon 2023 (South Indian Bank x Enactus IIT Delhi), 1st, Rs 3 lakh | Hyper-personalised banking: AI/3D-model approach to understand customer behaviour; "Bank-Esy" feature for SIB Mirror+ (per PTI/Dinamalar via search snippet) | Two-phase event: online screening, then finale with 3 coding challenges at IIT Delhi | not stated | https://psuwatch.com/amp/story/newsupdates/pti/south-indian-bank |
| Hyperpersonalizers (IIT Roorkee, India) | SIB Finathon 2023, 2nd, Rs 2 lakh | Not described in source | not stated | not stated | same |
| Phantom (Coimbatore Inst. of Tech., India) | SIB Finathon 2023, 3rd, Rs 1 lakh | Not described in source | not stated | not stated | same |
| Bancable Africa | Paris Dauphine Fintech Chair hackathon (on Devpost), June 2022, 1st, EUR 1,500 | App that makes loan requests "bankable" to cut rejected applications (financial inclusion) | not stated | not stated | https://dauphine.psl.eu/dauphine/media-et-communication/article/hackathon-fintech-for-good-decouvrez-les-5-projets-gagnants |
| Bee Card | same, 1st (sustainable finance), EUR 1,500 | Banking innovation serving biodiversity | not stated | not stated | same |
| Smart Bidding | same, 1st (blockchain for good), EUR 1,000 | Decentralised, collusion-resistant arbitration of raw-materials contracts | not stated | Blockchain | same |
| Hapy Finance | same, 2nd (blockchain for good), EUR 500 | 5%/yr liquid investment indexed to carbon-neutral/low-energy DeFi protocols | not stated | DeFi | same |
| Wealth-Known (Hong Kong) | CityU SDGs x Fintech Hackathon 2023 (financial-inclusion theme), Most Collaborative + Most Outstanding Team | Gamified investment-simulation app teaching financial literacy to HK secondary students | Teacher-usable: MCQs, trading sessions, news, difficulty levels; reasoning not stated | mobile app (details not stated) | https://www.cb.cityu.edu.hk/news-and-events/news/2023/08/cityu-sdgs-x-fintech-hackathon-2023 |

## Unconfirmed (snippet only)
- BizFiz: reported 1st at FinTech Open Hackathon 2022 (NITI Aayog/PhonePe, YourStory; page returned 403).
- FraudLens (VNITx, VNIT Nagpur): AI UPI fraud detection, Central Bank of India hackathon 2025 (search snippet; PDF 404).
- Pied Piper: 1st fintech domain, Hackscript 4.0 (APSIT); PDF unreadable, year unknown.
- Growr / Finlit: Finastra Hack to the Future 4 (2022); sources conflict on Growr (runner-up vs DEI winner); page 403.
- Haqdarshak: Singapore-India Hackathon 2023 startup-category winner (financial inclusion) - snippet only.
- RBI HaRBInger 2024 (fraud / divyang-friendly): FPL Technologies named a winner; full list not fetched (403).
- Out of date range, not listed: Banga (2013 >Play Hackathon, confirmed), MoneyRemaid (Mastercard 2015).

## Patterns across winners
- Indian winners are dominated by bank-sponsored events (SIB, PSB, NPCI/RBI) where the problem statement is fixed (personalisation, fraud, defaulters) rather than open-ended inclusion.
- Recent (2025) winners are explicitly "agentic AI" plus a Hindi/Hinglish/multilingual angle; Moneymitra and FinOps Copilot both lean on agents, OCR and SMS parsing.
- Data sources seen: SMS/receipt OCR for transactions, bank customer-behaviour data, DeFi/carbon indices.
- Financial literacy for teens/underserved (Wealth-Known, Moneymitra) is rewarded when gamified or localised.
- Judges favoured named real-world problem (rejected loan applications, fraud) over generic "budget tracker"; but expense trackers still won when paired with multilingual + OCR + security.
- Prize pages rarely credit tech depth; pitch clarity, domain fit and live agent demos are what coverage highlights.
- Overdone ideas (plain expense tracker, generic crypto wallet, QR payments) did not appear among reported winners; the sources do not show which were submitted, so this is inferred, not verified.

## Idea seeds for a solo 24h build
- SMS/UPI-screenshot parser that explains a gig worker's irregular income as a loan-eligibility "proof pack" a bank can accept.
- Voice-first Hinglish agent that reads a rejected loan reason and tells the user exactly what to fix (Bancable-style, India context).
- Fraud-pattern explainer: paste a suspicious SMS/UPI collect request, get risk verdict with cited rules (fraud theme recurs in RBI/PSB/NPCI).
- Gamified "teach-by-simulation" for a single product (SIP, credit score, insurance) in a regional language for school students.
- Agentic back-office copilot for small kirana/MSME: natural-language queries over a UPI statement CSV (FinOps Copilot angle).
