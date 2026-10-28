# Demo script (2:00)
**Precondition:** the demo photos and `ai_cache` are seeded (fix 1), or a Gemini key is set. If neither, use the "No-AI" lines.

| Time | Say | Click |
|---|---|---|
| 0:00 | "Ravi reported this pothole. A week later it said Closed. The pothole is still there." | Show the pothole photo full screen |
| 0:10 | "OpenCity found BBMP marks 86% of complaints Closed, but roads only 58%. Nobody checks the fix." | Citizen home, Bellandur card ("demo data") |
| 0:25 | "Ravi reports it from his phone." | Report → add photo → Use demo location → Send |
| 0:35 | "It's tagged Pothole, Roads, and merged with his neighbour's report: two reports, one ticket." | Point at the result card. *No-AI:* "AI is off, so he picks Pothole by hand." Pick Pothole |
| 0:50 | "Now the ward engineer closes it, with a photo of a road nobody touched." | `/officer` → ticket 1 → Close → upload the untouched photo |
| 1:05 | "Rejected: not fixed. The ticket reopens and an escalation is drafted." | Show the verdict + draft. *No-AI:* press "Not fixed" and say "the officer's verdict, AI off" |
| 1:25 | "Real repair photo: verified fixed. Trying to close it again is refused." | Close → repaired photo → Verified (*No-AI:* "Fixed" button) |
| 1:45 | "Closed should mean fixed. ProofClose makes every closure prove itself." | Before/after side by side |

**Backup:** a screen recording of a full working run (made after fix 1) on the laptop and on a USB stick. If the backend dies, the frontend has `VITE_USE_MOCK=true` mock mode. Never present mock output as live AI.
