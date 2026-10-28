# ProofClose
**Tagline:** Closed should mean fixed: photo-proof civic closures

**Inspiration:** OpenCity found BBMP marks 86.2% of 126,974 grievances Closed (roads only 58.0%), and Deccan Herald reported officials marking issues resolved on the app without doing the work.

**What it does:** Citizens report an issue with a photo. Reports of the same category within 50 m merge into one ticket. A ward engineer can close a ticket only by uploading an after photo. The app compares it with the before photo: not fixed means the ticket reopens and an escalation is drafted; fixed means it's verified.

**How we built it:** React + Vite + Tailwind frontend; FastAPI + SQLite backend; Gemini 2.5 Flash vision for classification and before/after comparison, cached by photo hash, with a manual fallback when AI is unavailable.

**Challenges:** Keeping the demo repeatable without a reliable free AI quota; handling AI failure without creating bad tickets (still open: a fallback can leave a stray "Other" ticket).

**Accomplishments:** The full close-with-proof loop, duplicate merging, and an API with proper error codes (400/404/409/413/415).

**What we learned:** The hard part is trust in closure, not reporting. Honest labelling of demo data matters.

**What's next:** BBMP 2023 ward-polygon routing (it currently uses the nearest seeded ward), GPS/timestamp checks on after photos, citizen confirmation, a pilot with one ward.

**Honest notes:** Tickets and ward stats are seeded demo data. Without a Gemini key, the verdicts are chosen by hand.

**Built with:** React, Vite, Tailwind CSS, Python, FastAPI, SQLite, Gemini API
