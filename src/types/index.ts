export interface ActionItem {
  task: string;
}

export interface Attendee {
  name: string;
  role?: string;
  action_items: string[];
  email_subject: string;
  email_body: string;
}

export interface MeetingResult {
  id?: string;
  meeting_title: string;
  meeting_date: string;
  attendees: Attendee[];
  summary: string;
}

export interface AppSettings {
  tone: 'Professional' | 'Casual' | 'Strict';
  language: string;
}
