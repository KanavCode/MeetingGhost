import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppSettings, MeetingResult } from "../types";

// In production (Vercel), set VITE_GEMINI_API_KEY as environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeMeeting(transcript: string, settings: AppSettings): Promise<MeetingResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 8192,
    },
  });

  const SYSTEM_PROMPT = `You are MeetingGhost — an AI that reads meeting transcripts and generates hyper-personalised action-item emails for each attendee.

Given a meeting transcript, you must:
1. Identify all named attendees
2. Extract specific action items, tasks, commitments or follow-ups for EACH person
3. Generate a personalised email draft for each attendee — addressed by name, listing only THEIR tasks, with inferred deadlines if mentioned

TONE & LANGUAGE INSTRUCTIONS:
- The tone of the email body should be: ${settings.tone}
- All text (titles, summaries, email bodies, action items) MUST be written in: ${settings.language}

Respond ONLY with valid JSON, no markdown fences, no extra text. Format exactly:
{
  "meeting_title": "string",
  "meeting_date": "string",
  "attendees": [
    {
      "name": "Full Name",
      "role": "inferred role or Team Member",
      "action_items": ["specific task 1", "specific task 2"],
      "email_subject": "string",
      "email_body": "Full personalised email body with a greeting, their specific tasks listed clearly, any deadlines, and a closing based on the requested tone. 4-6 sentences minimum."
    }
  ],
  "summary": "2-3 sentence meeting summary"
}

Rules:
- Only include attendees who have at least one action item
- Be specific — extract exact tasks, deadlines, and commitments
- If no clear attendees/tasks, create one entry for 'All Attendees' with general follow-ups`;

  const prompt = `${SYSTEM_PROMPT}

Here is the meeting transcript to analyze:

${transcript}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Clean JSON — strip any markdown fences if Gemini adds them
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as MeetingResult;
  } catch {
    // Second attempt: find JSON object in response
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as MeetingResult;
    throw new Error("Could not parse AI response as JSON");
  }
}
