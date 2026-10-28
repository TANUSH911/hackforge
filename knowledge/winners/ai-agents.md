# Winners: generative AI / AI agents (open theme)
_Last updated: 2026-10-28. Confirmed = page states a prize._
Note: "Why it won" is partly my inference; sources rarely state judge reasoning. n/s = not stated.

## Confirmed winners
| Project | Event, year, prize | One-line idea | Why it won (demo moment / tech / impact) | Stack | Link |
|---|---|---|---|---|---|
| CrossBeam | Anthropic "Built with Opus 4.6" Claude Code hackathon, Feb 2026, 1st place | Cuts California housing-permit delays: sub-agents parse blueprints and correction letters in parallel | Costly well-defined problem (rejections, ~6-month delays, ~$30k each) from a domain expert | Claude Code, sub-agents, spatial indexing | https://claudecode.jp/en/news/student/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon |
| Elisa | Same, 2nd place | Block-based visual programming for kids on top of Claude Code | Makes pro tool accessible, teaches concepts | Meta-planner, task graphs, teaching engine | same link |
| PostVisit.ai | Same, 3rd place | Explains diagnoses in plain language, checks visit notes against evidence | Cardiologist domain depth | AI + evidence retrieval | same link |
| Chat2Cash | Build India 2026 (Bengaluru, 15 Feb 2026), Grand Prize $16,500 | Turns WhatsApp chats into invoices, tracked payments, recovered revenue | Real small-business pain on a channel Indians already use | Claude, Replit | https://devfolio.co/blog/buildindia2026/ |
| ClaudeClip | Same, 1st runner-up $11,500 | Describe the video, Claude assembles a first cut from your footage, edit on timeline | Visible end-to-end demo | Claude, Replit | same link |
| AI Battle Royale | Same, 2nd runner-up $7,000 | LLM agents fight to survive, live interpretable multi-agent benchmark | Spectacle plus benchmark angle | Claude, Replit | same link |
| RFP automation agent (Team Dwaynefernandes470, SPIT Mumbai) | EY Techathon 6.0, Mar 2026, 1st, Rs 3,00,000 | Multi-agent workflow finds/ranks FMCG tenders, summarises, recommends OEM SKUs, gathers pricing | Enterprise ROI: less manual effort, better bid accuracy | agentic multi-agent; n/s | https://www.ey.com/en_in/newsroom/2026/03/sardar-patel-institute-of-technology-mumbai-wins-ey-techathon-6-0 |
| Agentic omnichannel retail assistant (Techno Engg College Banipur) | EY Techathon 6.0, runner-up Rs 2,00,000 | Retail assistant across web, mobile, WhatsApp, in-store | Channel coverage | n/s | same link |
| VERA (Kasukabe Defence Group, IIT Roorkee) | EY Techathon 6.0, People's Choice | Platform of seven agents turning unstructured data into decision-grade assets | Won by audience vote | n/s | same link |
| Smart Hotel Agent (Bounteous AIchemists) | Agentforce Hackathon, TDX Bengaluru, Apr-May 2025, Grand Prize (pool Rs 1.25 crore) | Personalised guest check-in/requests via tablet agent | Judged on originality, business relevance, demo quality | Salesforce Data Cloud, Slack, Agentforce | https://www.salesforce.com/in/news/?p=11198 |
| AutoMates | Same, runner-up | Slack agent for cab booking and car rental confirmations | n/s | Slack, Agentforce | same link |
| RiskWise | Microsoft AI Agents Hackathon, Apr 2025, Best Overall | Agents scan shipping data/trade news to flag supply-chain risks, natural-language queries | Concrete enterprise use case | Python, Next.js, Azure AI Agent Service, Semantic Kernel, SQL | https://microsoft.github.io/AI_Agents_Hackathon/es/winners/ |
| ModelProof (Sentinel AI Chat) | Same, Best JS/TS Agent | Runs two LLMs per query, compares answers, audits hallucination/bias/toxicity | Trust/eval angle | Node.js, Azure OpenAI | same link |
| Likeminds | Agno Global Agent Hackathon, May 2025, $5,000 Grand Prize | Agentic semantic social network | Full-stack execution, collaborating-agent vision, technical depth | Agno | https://www.agno.com/blog/global-agent-hackathon-winners |
| Beifong | Same, $1,000 plus BrowserUse Grand Prize $2,500 | Curated junk-free personal feeds turned into podcasts | Thoughtful design, execution, real utility | n/s | same link |

## Unconfirmed (snippet only)
- Build India 2026 winners' builders' nationality not stated; event location Bengaluru only.
- Other Agno winners (Windows-Use, Superwizard AI $2,000, TripCraft AI, AI Clinical Trial Matcher) are confirmed prizes but I could not verify builders' country; some names look Indian.
- Opus 4.7 hackathon (2026) headline "doctor, carpenter, teacher win": no project details read.
- ETHIndia / ETHGlobal New Delhi AI-agent winners: only a LinkedIn snippet; no project found.
- Devpost galleries returned 403; no Devpost-sourced winners.

## Patterns across winners
- Winners are often domain experts pointing agents at a costly, specific workflow (permits, tenders, supply-chain risk, invoices).
- India wins skew to enterprise/SMB automation (RFPs, hotel ops, WhatsApp invoicing) over consumer chatbots; WhatsApp and Slack are the surfaces.
- Multi-agent structure is the headline technique (parallel sub-agents, seven-agent platform, coordinator + researchers).
- Showable output beats chat: first cut of a video, an invoice, a ranked tender list, a podcast episode.
- Trust/eval tooling (ModelProof, benchmarks like AI Battle Royale) wins a niche slot.
- Judges state originality, business relevance, demo quality, execution depth.
- Overdone and lost in what I saw: generic "chat with docs", trip planners and email agents mostly sit in lower Agno tiers ($300-$1,000), not grand prizes.

## Idea seeds for a solo 24h build
- Vertical paperwork agent for one Indian bureaucratic process (GST notice reply, rent agreement check, municipal permit) with parallel sub-agents and a before/after rejection-risk score.
- WhatsApp-native agent that turns a messy voice note into a finished artifact (quote, PO, ledger entry).
- Agent referee: runs two models on the same task and shows a disagreement/hallucination report live.
- Tender or scheme-discovery agent ranking government/enterprise opportunities for a small firm with draft response.
- Spectator-friendly agent arena in a local-language game, producing a live leaderboard.
