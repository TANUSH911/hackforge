# Day 2 — How agents work

## What a subagent is
A **subagent** is a separate Claude with its own job description, its own allowed tools, and its own fresh memory (context window). The main Claude (the orchestrator) hands it a task, it works alone, and it returns a short result.

Why bother instead of one big Claude?
- **Focus** — a researcher prompt makes a better researcher than a do-everything prompt.
- **Clean memory** — 40 web pages of research stay inside the researcher; the orchestrator only gets the summary, so it doesn't get confused or run out of room.
- **Parallel work** — researcher and winning-patterns run at the same time.
- **Cost control** — cheap model for reading the web, strong model for decisions.

## Anatomy of an agent file
Each agent is one Markdown file in `.claude/agents/`:

```markdown
---
name: researcher                  ← how the orchestrator calls it
description: Deep research ...    ← tells the orchestrator WHEN to use it
tools: WebSearch, WebFetch, Read  ← what it's allowed to do (least power needed)
model: sonnet                     ← sonnet = cheaper/faster, inherit = same as main
---

You are the research lead...      ← the system prompt: role, input, steps, output format
```

The part between `---` lines is **frontmatter** (settings). Everything after is the **prompt**.

## How our agents talk: the handoff folder
Agents don't share memory, so they share **files**:

```
hackathons/<event>/brief/
  problem.md   ← you/orchestrator
  research.md  ← researcher        ┐ run in parallel
  patterns.md  ← winning-patterns  ┘
  plan.md      ← planner (reads all three)
```

This is the same idea as a team writing to a shared Google Doc.

## What makes a good agent prompt
1. A clear **role** ("veteran hackathon judge").
2. Exact **input** files.
3. Numbered **steps**.
4. A fixed **output format** — so the next agent knows where to look.
5. **Honesty rules** — "never invent statistics or links".
6. A short **reply** — so the orchestrator's memory stays small.

## Design choices we made
- Researcher/winning-patterns use `sonnet` → saves your Pro usage on web reading.
- Planner uses `inherit` (your main model) → the most important decision gets the strongest brain.
- Planner is told "demo first": every feature must serve the 2-minute demo. This is the #1 reason teams who finish still don't win.

## Practice
1. Open `.claude/agents/planner.md` and read the 7 steps. Which step would have helped most at your last hackathon?
2. Try changing the default stack line to one you're curious about, then `git diff` to see your change (`git restore .claude/agents/planner.md` undoes it).
