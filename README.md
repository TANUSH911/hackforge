# HackForge

A multi-agent system built on Claude Code that takes a hackathon problem statement and helps a solo developer research, plan, build, test and pitch a winning project in 24 hours.

> Work in progress — built over 3 weeks by Tanush (BTech CS, BMS College of Engineering, Bangalore).

## How it works

An orchestrator (`CLAUDE.md`) coordinates eight specialist agents: researcher, winning-patterns analyst, planner, frontend, backend, database, tester and judge. Each lives in `.claude/agents/`.

Two modes:
- **Learn** — explains every step (for practice runs)
- **Compete** — maximum speed (for real hackathons)

## Roadmap

- [x] Day 1 — project skeleton, git setup, GitHub
- [x] Day 2 — researcher, winning-patterns, planner agents
- [x] Day 3 — database, backend, frontend agents
- [x] Day 4 — tester, judge agents + /hackathon command
- [ ] Week 1 — eight agents + orchestrator command
- [x] Week 2 — full-stack template, judging + pitch playbooks, 64 confirmed past winners in 6 themes
- [ ] Week 3 — mock hackathons, fixes, polish
