# MeetingGhost

**Turn messy meeting transcripts into individual accountability — instantly.**

MeetingGhost is an AI-powered productivity tool designed to solve the "post-meeting amnesia" problem. Instead of sending a generic summary that everyone ignores, MeetingGhost generates **personalised action-item emails** for every attendee.

## 🚀 The Problem
Generic meeting summaries don't drive action. When a summary lists 20 tasks for 5 people in one long document, individual accountability gets lost in the noise. People skim, miss their names, and commitments fall through the cracks.

## ✨ The Solution
Accountability scales with personalisation. MeetingGhost parses your raw meeting transcripts (from Zoom, Google Meet, Otter.ai, or manual notes) and:
1. **Identifies every attendee** mentioned in the conversation.
2. **Extracts specific commitments** and tasks assigned to each person.
3. **Infers deadlines** based on the context of the discussion.
4. **Drafts ready-to-send emails** tailored to each individual, containing *only* their specific responsibilities.

## 🛠️ Key Features
- **Intelligent Parsing**: Powered by Gemini AI to understand context and nuance in natural conversation.
- **Personalised Tabs**: View a dedicated dashboard for each attendee with their specific action items.
- **One-Click Follow-up**: Copy email drafts to your clipboard or open them directly in Gmail with one click.
- **Markdown Export**: Export the entire meeting breakdown as a clean Markdown file for documentation.
- **Privacy First**: All processing happens in-browser. Your transcripts are never stored on a server.
- **Power-User UX**: Optimized with keyboard shortcuts (`Ctrl+Enter` to analyze, arrow keys to switch tabs).

## 💻 Tech Stack
- **Frontend**: React 18 + Vite
- **AI Engine**: Gemini 2.5 Flash API
- **Styling**: Vanilla CSS (Modern Dark Glassmorphism)
- **Deployment**: Vercel

## 🏃‍♂️ Run Locally

1. **Clone the repo**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up your API Key**:
   Create a `.env` file in the root directory and add:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 👤 Built By
**Kanav Modi** — Software Developer Intern  
[GitHub](https://github.com/KanavCode) | [Portfolio](https://kanavmodi.me)
