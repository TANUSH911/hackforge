# Winners: edtech
_Last updated: 2026-10-28. Confirmed = page states a prize._

Note: Devpost pages returned 403; sources are official/college/news pages that were opened. Stack/why-won are often not stated.

## Confirmed winners
| Project | Event, year, prize | One-line idea | Why it won (demo moment / tech / impact) | Stack | Link |
|---|---|---|---|---|---|
| Every Classroom a Digital Classroom (The Arise & Educate, KL Univ., India) | Smart India Hackathon 2022, 1st, Rs 1 lakh | Low-cost, offline-capable digital classroom on local hardware with synced grade-level content | Fits govt NDEAR/DIKSHA problem statement; works without internet | Raspberry Pi, DIKSHA content APIs | https://www.kluniversity.in/blog/Winning-Competitions-has-become-a-habit-of-KL-students.html |
| University information platform (The Warriors, KL Univ., India) | SIH 2022, 1st, Rs 1 lakh | Pan-India bank to compare universities' courses, faculty, admissions, certifications (AICTE statement) | not stated | not specified | same |
| Ed360 (Team Zephyrus, IEM, India) | Hack This Fall 3.0 (MLH, Gandhinagar), Feb 2023; track prizes Storyblok, GoDaddy, Postman | Edtech platform rewarding students for finishing tasks/assignments on time | not stated | not stated | https://iem.edu.in/news-events/team-zephyrus-wins-two-mlh-hackathons-in-a-row/ |
| Padhai Check (India) | MumbaiHacks 2025, Misinformation track winner | Agentic study companion verifying exam-related claims against official sources, Hinglish, well-being support | All-women team; official-source verification; reasoning not stated | not stated (agentic AI) | https://cxotoday.com/media-coverage/mumbaihacks-2025-crowns-indias-next-gen-ai-innovators-becomes-worlds-largest-agentic-ai-hackathon/ |
| ChatEDU | Microsoft AI Classroom Hackathon 2024, 1st Technical Project | Turns any text/file into tutoring: study guides, quizzes, long-answer practice | Judging favoured core Azure components; immersive tutoring | Azure AI, GPT-4, Azure DBs | https://www.microsoft.com/en-us/education/blog/?p=5318 |
| Dialogues Through Time | same, 2nd Technical | History game with AI-driven dialogue with figures | Storytelling + interactive AI + visuals | AI dialogue (stack not stated) | same |
| Insight | same, 3rd Technical | Lecture notes to personalised quizzes/flashcards | Interactive, personalised study material | not specified | same |
| Cuepal | same, Best Graduate Student App | Student notes to flashcards and quiz questions in real time | Tailored materials | OpenAI GPT-4 | same |
| Neural Synchronisation | same, Best No Code Project | Collaborative learning system balancing participation, with accessibility | Inclusive design, real-time adaptation (bonus for accessibility/Responsible AI) | Azure Cognitive Services transcription | same |
| EquEdu | same, Honorable Mention | Makes educational video accessible to visually impaired learners | Accessibility focus | AI-powered (not stated) | same |
| Wonder Reader (BINUS Univ. Intl., Indonesia) | Google Solution Challenge 2023, Top 3 | 3D-printed digital braille device; teachers send questions via Bluetooth, students answer on braille keyboard | Hardware + Google stack, accessibility impact | Google Cloud, Firebase, Flutter, Text-to-Speech API | https://blog.google/technology/developers/google-student-developer-clubs-solution-challenge-2023/ |

## Unconfirmed (snippet only)
- CodeCapture: India Education category winner, Imagine Cup 2021 (confirmed on Microsoft page, but 2021 is outside 4 years and idea unstated).
- SignLearn (Access Builders): 2nd runner-up Rs 1 lakh, RedBrick Hacks III Nationals (Ashoka); page confirms prize but year not stated.
- HackRx 5.0: DJSCE teams Unethusiasts (2nd runner-up Rs 25,000) and init0 (Rs 1 lakh); project ideas unknown, domain unverified.
- SIGNEDGE (Peru, DigiEduHack) and Botool (Teens in AI France 2021): search snippets only; DigiEduHack page 404.
- Infinity Learn Hackathon SignBridge Eureka Award: LinkedIn snippet.

## Patterns across winners
- Accessibility (braille, sign language, visually impaired video) recurs at every global event; judges explicitly add bonus credit for it.
- Document/notes-to-quiz-and-flashcards is the most common AI idea; it won at Microsoft's event mostly because it used required Azure components, not novelty.
- Indian government hackathons (SIH) reward offline/low-bandwidth, low-cost hardware, and use of national platforms (DIKSHA/NDEAR).
- Verification/trust angle (Padhai Check checking claims vs official sources) and Hinglish/regional language show up in India wins.
- Gamified or incentive-based study management (Ed360) won sponsor track prizes, mainly by using sponsor tools (Storyblok, GoDaddy, Postman).
- Plain chatbot tutors alone were not highlighted; winners paired AI with a niche (history dialogue, braille hardware, official-source checks). Inferred from winner lists, not verified against submissions.
- Sponsor-tech fit (Azure, Google Cloud) is a visible winning criterion.

## Idea seeds for a solo 24h build
- Offline-first PWA that syncs DIKSHA/NCERT chapters and generates quizzes on-device for low-connectivity schools.
- "Exam-claim checker": paste a WhatsApp rumour about syllabus/dates, get verdict citing official board notices (Padhai Check angle, narrower).
- Teacher-side tool: upload class notes, produce quizzes plus an accessibility pack (alt-text, simplified reading level, TTS) in one click.
- Sign-language or braille practice with webcam feedback, targeted at one regional sign vocabulary.
- Assignment-deadline incentive layer that plugs into Google Classroom and uses sponsor APIs for the demo.
