import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/history', async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
      include: { attendees: true },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = meetings.map((m: any) => ({
      id: m.id,
      meeting_title: m.title,
      meeting_date: m.date,
      summary: m.summary,
      attendees: m.attendees.map((a: any) => ({
        name: a.name,
        role: a.role,
        action_items: JSON.parse(a.actionItems || '[]'),
        email_subject: a.emailSubject,
        email_body: a.emailBody
      }))
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.post('/api/meetings', async (req, res) => {
  try {
    const { result, transcript } = req.body;
    
    const newMeeting = await prisma.meeting.create({
      data: {
        title: result.meeting_title || 'Untitled Meeting',
        date: result.meeting_date || new Date().toISOString(),
        summary: result.summary || '',
        transcript: transcript || '',
        attendees: {
          create: (result.attendees || []).map((a: any) => ({
            name: a.name || 'Unknown',
            role: a.role || '',
            actionItems: JSON.stringify(a.action_items || []),
            emailSubject: a.email_subject || '',
            emailBody: a.email_body || ''
          }))
        }
      }
    });

    res.json({ success: true, meetingId: newMeeting.id });
  } catch (error) {
    console.error("Error saving meeting:", error);
    res.status(500).json({ error: "Failed to save meeting" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
