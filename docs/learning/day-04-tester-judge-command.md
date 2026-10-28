# Day 4 — Testing, judging, and one command for everything

## Why a tester agent
On Day 3 each builder said "all tests pass" — and the app still had a bug (the `main:app` database). Each agent tested **its own half**. Bugs live where halves meet. Three kinds of testing:

| Kind | Question | Example |
|---|---|---|
| Unit | Does this one function work? | `haversine()` returns 20 m for two nearby points |
| Integration | Do the parts work together? | Frontend's `/api/tickets` call matches the backend route |
| End-to-end (E2E) | Does the whole user story work? | Citizen reports → officer closes → "Not fixed" appears |

In a 24h hackathon, **E2E on the demo script** matters most: judges only see the demo.

"Break it like a judge": empty input, huge file, refresh mid-flow, backend down. Judges love to click the wrong thing.

## Why a judge agent
Most teams never see their project from the judge's chair. The judge agent:
1. Scores each criterion with evidence and predicts your rank.
2. Lists the top 5 fixes ranked by **points gained per hour** — at hour 20 you can't do everything, so do what moves the score most.
3. Prepares answers to the 6 hardest questions.
4. Writes the deck, demo script, README and Devpost text.

**Honesty rule:** never claim what doesn't work. Judges check, and getting caught costs more than the missing feature.

## Skills vs agents
| | Agent (`.claude/agents/`) | Skill (`.claude/skills/`) |
|---|---|---|
| What | A separate worker with its own memory | Instructions loaded into the *current* Claude |
| Used for | Doing a job (research, build, test) | A procedure / playbook to follow |
| Example | `tester` | `/hackathon` |

`/hackathon` is a skill: it teaches the orchestrator the full playbook — which agent, in what order, when to commit, when to stop and ask you.

## The full pipeline

```
/hackathon <event> compete
 0 setup: brief/problem.md + clock.md
 1 researcher ‖ winning-patterns
 2 planner  ──► YOU approve the idea (only mandatory pause)
 3 database ─► backend ‖ frontend
 4 tester ──► fix blockers ──► tester (max 2 rounds)
 5 judge ───► top fixes ──► tester
 6 ship checklist (deploy, video, deck, submit) — you do the sign-ins
```
`‖` = in parallel.

## Learn vs compete in the command
- `learn` — explains before and after every step, pauses for questions.
- `compete` — one-line status + time left; pauses only for idea approval and broken things.

## Practice
1. Open `.claude/agents/judge.md`. Which of the "tough questions" would you have struggled to answer at your last hackathon?
2. Why does the `/hackathon` command pause after the planner and nowhere else in compete mode?
