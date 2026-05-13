# MeetingGhost — 300-word Write-up

## What I built

MeetingGhost is a tool that reads meeting transcripts and generates personalised
action-item emails for every attendee — not a generic summary, but individual
emails addressed to each person, listing only their specific tasks, with inferred
deadlines pulled from the conversation.

You paste a transcript (or upload a .txt file), and in seconds you get a tab for
each attendee with their action items extracted and an email draft ready to copy.

## Why this

I've been in too many meetings where everyone agreed on next steps and most people
forgot them by the next morning. Generic meeting summaries don't fix this — they
list everything for everyone, so nobody feels personally accountable.

The insight: accountability scales with personalization. If you get an email that's
specifically addressed to you, listing only your tasks, you'll act on it. Generic
summaries get skimmed. Personalised lists get done.

This is the smallest version of the idea that's still actually useful. It works.
You can paste a transcript right now and get something real.

## What I chose to cut

Real-time audio processing (Recall.ai integration, Zoom/Meet bots). Calendar
integration for automatic deadline blocking. Actual email sending via Gmail API.
Multi-language support. I cut all of this deliberately — none of it changes whether
the core idea works. You can validate the whole thing with paste-and-click.

## What I'd do with 10 more hours

Gmail OAuth so the emails send automatically. A Slack bot version — drop a
transcript in a channel, it DMs each person their tasks. Follow-up reminders if
tasks aren't marked done within 48 hours. That's the full loop: meeting happens →
everyone gets their email → stragglers get a nudge → accountability closes.
