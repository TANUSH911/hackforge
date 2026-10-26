# Day 1 — Git basics

## The idea in one paragraph
Git is a **save system with history** for a folder. Every time you "commit", git stores a snapshot of your files with a message. You can look back at any snapshot, see what changed, and undo mistakes. GitHub is just a website that stores a copy of your git history online.

## The three places your changes live

```
working folder  --git add-->  staging area  --git commit-->  history
(your edits)                  (chosen for next save)          (saved snapshots)
```

`git add` is like putting items in a box; `git commit` seals the box with a label.

## Commands we used today

| Command | What it does |
|---|---|
| `git init -b main` | Turn this folder into a git repo, main branch named `main` |
| `git status` | What changed? What's staged? Run this constantly |
| `git add <file>` / `git add .` | Stage one file / everything |
| `git commit -m "message"` | Save a snapshot with a message |
| `git log --oneline` | List saved snapshots |
| `git diff` | Show exact line changes not yet staged |

## Special files
- `.gitignore` — files git should never track (secrets in `.env`, `node_modules/`, etc.). **Never commit API keys.**
- `.gitkeep` — git doesn't track empty folders, so we put an empty file inside to keep the folder.

## Good commit messages
Short, present tense, says *what* changed: `Add researcher agent`, `Fix login crash`. Not `stuff` or `final final v2`.

## Coming later
- `git push` / `git pull` — sync with GitHub
- `git branch` / `git switch` — try ideas without breaking main
- `git restore` / `git revert` — undo mistakes

## Practice (5 min)
1. Run `git status` and `git log --oneline` in this folder.
2. Add a line to `README.md`, run `git diff`, then `git add README.md` and `git commit -m "Update README"`.
3. Run `git log --oneline` again and see your commit.
