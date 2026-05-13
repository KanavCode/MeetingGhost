# MeetingGhost

> Paste a meeting transcript. Get personalised action-item emails for every attendee — instantly.

## The problem

Generic meeting summaries don't create accountability. Personalised action-item emails do.

If you get an email that's **specifically addressed to you**, listing **only your tasks**, you'll act on it. Generic summaries get skimmed. Personalised lists get done.

## How it works

1. **Paste** your meeting transcript (or upload a .txt file)
2. **AI** identifies every attendee and extracts their specific tasks
3. **Copy** or **open in Gmail** a personalised email draft for each person — ready to send

## Tech stack

- React + Vite (frontend — no backend needed)
- Gemini 2.5 Flash API (AI engine)
- Vanilla CSS with glassmorphism design

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

## What's next (10 more hours)

- Gmail OAuth — auto-send the emails instead of copy-paste
- Slack bot — drop transcript in channel, bot DMs each person their tasks
- Follow-up reminders after 48 hours if tasks aren't confirmed done
- Calendar integration — block time for deadlines automatically

## Built by

[Kanav Modi](https://github.com/KanavCode) — Software Developer Intern
