---
name: hackathon
description: Run the full HackForge pipeline on a hackathon problem statement — research, winning patterns, plan, build, test, judge and pitch — using the agents in .claude/agents. Use when the user types /hackathon or says they're starting a hackathon or practice run.
argument-hint: <event-name> [learn|compete]
---

# /hackathon — run the whole team

Arguments: `$ARGUMENTS` → event name (kebab-case, e.g. `bmsce-hacks-2026`) and mode (`learn` or `compete`). If either is missing, ask once for both, and ask for the problem statement.

## 0. Set up (orchestrator does this itself)
1. Create `hackathons/<event>/brief/`. Write `brief/problem.md` from what the user gives: problem statement(s), judging criteria and weights, rules, sponsor tracks, submission requirements, deadline, and builder constraints (solo, intermediate Python/Java/C, ₹0, 8 GB Intel Mac). If several problem statements are offered, keep all and let the planner choose.
2. Write `brief/clock.md`: start time, deadline, and checkpoint times (skeleton deployed +6h, must-haves +16h, freeze +20h, submit −1h). In compete mode, state time left at every step.
3. Commit: `Start <event>`.

## 1. Understand (parallel)
Launch **researcher** and **winning-patterns** together, both pointed at `hackathons/<event>/`. Wait for both.

## 2. Plan
Launch **planner**. Then show the user the chosen idea, the demo "wow" moment and the scope in under 10 lines.
**Stop and ask the user to approve or change the idea.** This is the only mandatory pause: everything after depends on it. Commit.

## 3. Build
1. Launch **database**. Commit.
2. Launch **backend** and **frontend** together (they share only `brief/contract.md`). Commit.

## 4. Test
Launch **tester**. If the verdict is NOT READY, send each blocker to the agent that owns that code (backend/frontend/database), then run **tester** again. Max 2 rounds, then move on and tell the user what's still broken. Commit.

## 5. Judge and pitch
Launch **judge**. Show the user the score, the predicted rank and the top 5 fixes. Ask which fixes to do (default: the top 2 if time allows). Do them through the owning agents, then re-run **tester** quickly. Commit.

## 6. Ship checklist (tell the user what's left for them)
- Deploy: frontend → Vercel, backend → Render (user signs in; never enter their credentials).
- Add API keys to the hosts' env settings (the user does this).
- Record the demo video following `pitch/demo-script.md`.
- Make the deck from `pitch/deck.md`.
- Submit using `pitch/submission.md`.
- Push to GitHub.

## Modes
- **learn:** before each step, say in 2–3 lines what is about to happen and why; after each step, explain what the agent produced and one concept it used (with a pointer to `docs/learning/`). Pause after each step for questions.
- **compete:** no explanations. One-line status after each step with time left. Only pause at the idea approval and when something is broken.

## Rules
- Agents hand off only through files in `brief/`. Pass each agent the absolute hackathon folder path.
- Follow the builder rules in the root `CLAUDE.md`.
- If a checkpoint in `brief/clock.md` is about to be missed, cut scope (ask the planner's nice-to-have list first), never move the deadline.
- If an agent fails or returns nonsense, retry once with a clearer instruction, then tell the user.
