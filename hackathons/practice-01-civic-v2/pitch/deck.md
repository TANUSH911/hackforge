# ProofClose: 5 slides

## 1. Problem
**BBMP marks 86.2% of grievances "Closed". Roads close only 58.0%. Citizens report "Closed" potholes still there.**
Source: OpenCity analysis of 126,974 BBMP grievances, 2025.
> Notes: Ravi files a pothole complaint, gets "Closed" a week later, and the pothole is still there. Published data can't tell "closed" apart from "fixed".

## 2. Solution
**ProofClose: a ticket closes only when an "after" photo proves the fix.**
[screenshot: before/after photos with the verdict]
> Notes: Duplicates within 50 m merge into one ticket. Officials close a ticket by uploading proof.

## 3. Demo
**Citizen reports a pothole → it merges with a neighbour's report → officer closes with a fake photo → rejected and reopened → real fix verified.**
> Notes: Be honest: the ward numbers are demo data. Name whether the verdict comes from Gemini or a manual pick.

## 4. How it works
`Phone photo → FastAPI → Gemini vision (cached by photo hash) → SQLite tickets → React officer queue`
**Tech: React, Vite, Tailwind, FastAPI, SQLite, Gemini 2.5 Flash.**
> Notes: Merging and close rules are plain code. AI does only classification and before/after comparison. If there's no AI, there's a manual fallback.

## 5. Impact & next steps
**"Closed" should mean fixed. Next: BBMP ward-map routing, GPS/timestamp checks on photos, citizen confirmation, a pilot with one ward.**
> Notes: Ask for one RWA or ward engineer to pilot it.
