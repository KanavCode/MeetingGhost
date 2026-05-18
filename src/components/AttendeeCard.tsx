import React, { useState } from 'react';
import { Attendee } from '../types';

interface AttendeeCardProps {
  attendee: Attendee;
  isActive: boolean;
}

export function AttendeeCard({ attendee, isActive }: AttendeeCardProps) {
  const [copied, setCopied] = useState(false);

  if (!isActive) return null;

  const initials = attendee.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleCopy() {
    const fullEmail = `Subject: ${attendee.email_subject}\n\n${attendee.email_body}`;
    navigator.clipboard.writeText(fullEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleGmail() {
    const subject = encodeURIComponent(attendee.email_subject || "");
    const body = encodeURIComponent(attendee.email_body || "");
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank");
  }

  return (
    <div className="glass attendee-card" key={attendee.name}>
      <div className="attendee-header">
        <div className="attendee-info">
          <div className="attendee-avatar">{initials}</div>
          <div>
            <div className="attendee-name">{attendee.name}</div>
            <div className="attendee-role">{attendee.role}</div>
          </div>
        </div>
        <div className="tasks-badge">
          {attendee.action_items?.length || 0} task{attendee.action_items?.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="section-label">Action items</div>
      <div className="action-items">
        {attendee.action_items?.map((item, i) => (
          <div key={i} className="action-item">
            <div className="action-check">
              <svg viewBox="0 0 12 12" fill="none">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            </div>
            <span className="action-text">{item}</span>
          </div>
        ))}
      </div>

      <div className="section-label">Email draft</div>
      <div className="email-draft">
        <div className="email-header">
          <div className="email-subject-row">
            <div className="email-subject-label">Subject</div>
            <div className="email-subject">{attendee.email_subject}</div>
          </div>
          <div className="email-actions">
            <button
              id={`copy-btn-${attendee.name.replace(/\s+/g, "-")}`}
              className={`btn-copy ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <button
              id={`gmail-btn-${attendee.name.replace(/\s+/g, "-")}`}
              className="btn-gmail"
              onClick={handleGmail}
              title="Open in Gmail"
            >
              ✉️ Gmail
            </button>
          </div>
        </div>
        <div className="email-body">{attendee.email_body}</div>
      </div>
    </div>
  );
}
