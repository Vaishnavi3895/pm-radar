# PM Radar 🛰️

**A personal PM job-hunting intelligence tool — built to help BD professionals transition into product management.**

Live at: `[your-url].netlify.app`

---

## What it does

Most job hunters open LinkedIn, scroll for 20 minutes, apply to 5 generic roles, and wonder why they don't hear back. PM Radar is the opposite — a weekly intelligence feed that gives you deep context on every company before you reach out, so every application is specific, informed, and hard to ignore.

### The feed
Every week, PM Radar surfaces companies that are **recently funded**, **actively hiring PMs**, or **in the news** — with enough context to have a real conversation, not just send a resume.

### The dossier — 7 tabs per company

| Tab | What's inside |
|---|---|
| **Overview** | Funding snapshot, latest news, parent/subsidiary relationships, why this is your opening |
| **Product** | What they're actually building — in plain language |
| **GTM** | Their go-to-market strategy — so you speak their commercial language in interviews |
| **My Angle** | Your tailored BD-to-PM entry path: outreach approach, what to pitch, 48-hour action |
| **Interview Prep** | 4 questions per company with answer hints specific to a BD background |
| **LinkedIn** | PMs & above at the company, warm connection paths, cold DM template |
| **Resume Match** | Match score against the role, gap analysis, side-by-side resume edit suggestions |

### Cover letter generator
One click generates a **story-led cover letter** tailored to each company — built specifically for a career transition, so it leads with a concrete moment from your experience rather than your job title.

### Pipeline tracker
- **Two-week system** — current week + last week always visible, so no lead gets lost when a new batch drops
- **Status tracking** — mark each company as Interested / Contacted / In Conversation / Passed
- **Status filter** — see everything you haven't acted on yet across all weeks
- **Archive tab** — companies older than 2 weeks move here automatically

---

## Why I built this

I'm a BD professional with 6.5 years at Adobe, Anaplan, Salesforce, and BrowserStack, transitioning into product management. The standard job hunt advice — "tailor your resume, research the company, network" — is right but vague. I wanted a tool that made all of that concrete and fast.

PM Radar is the tool I wished existed when I started the transition. It's also the most PM thing I've built: I defined the problem, mapped the user journey (me, every Tuesday morning), and shipped something that actually changes my behaviour.

---

## Tech stack

- **Pure HTML/CSS/JS** — single file, zero dependencies, zero build step
- **Claude API** (Anthropic) — powers the cover letter generator and resume match scoring
- **Browser localStorage** — pipeline status persists across sessions
- **Deployed on Netlify** via GitHub — auto-deploys on every push

---

## Weekly refresh rhythm

Every **Tuesday morning** — the optimal day for PM job hunting based on LinkedIn response rate data:

1. Open PM Radar — new companies load at the top
2. Last week's targets stay visible in the "Last week" tab
3. Pick 2 companies max, read their dossier
4. Send LinkedIn outreach while people are at peak responsiveness (Tue 10–11am)
5. Mark status as Contacted — follow up Wed/Thu

---

## Features in progress

- [ ] Notion export — push dossier + tailored resume bullets to a Notion page
- [ ] Email digest — weekly feed delivered to your inbox every Tuesday 8am
- [ ] HelloPM capstone tracker — live project link updates resume match scores
- [ ] Application notes — add private notes per company inside the tracker

---

## About

Built by **Vaishnavi Pai** — product-minded B2B professional transitioning into PM roles.

[LinkedIn](https://linkedin.com/in/vaishnavi-pai-8b6125a4) · [Portfolio](https://framer.com)

---

*If you're also transitioning into PM and want to use or adapt this tool — go for it. The best cover letter is still the one you send.*
