import React, { useState, useEffect } from 'react';
import { MeetingResult } from '../types';
import { AttendeeCard } from './AttendeeCard';

interface ResultsSectionProps {
  result: MeetingResult;
  onReset: () => void;
}

export function ResultsSection({ result, onReset }: ResultsSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [allCopied, setAllCopied] = useState(false);

  const totalTasks = result.attendees?.reduce(
    (sum, a) => sum + (a.action_items?.length || 0), 0
  ) || 0;

  function handleExportAll() {
    const lines: string[] = [];
    lines.push(`# ${result.meeting_title}`);
    lines.push(`Date: ${result.meeting_date}`);
    lines.push(`Attendees: ${result.attendees?.length || 0}`);
    lines.push(`\n## Summary\n${result.summary}\n`);
    lines.push("---\n");
    result.attendees?.forEach((a) => {
      lines.push(`## ${a.name} (${a.role})`);
      lines.push(`\n### Action Items`);
      a.action_items?.forEach((item) => lines.push(`- ${item}`));
      lines.push(`\n### Email`);
      lines.push(`Subject: ${a.email_subject}\n`);
      lines.push(a.email_body);
      lines.push("\n---\n");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.meeting_title?.replace(/[^a-zA-Z0-9]/g, "_") || "meeting"}_action_items.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopyAll() {
    const lines: string[] = [];
    result.attendees?.forEach((a) => {
      lines.push(`To: ${a.name}`);
      lines.push(`Subject: ${a.email_subject}\n`);
      lines.push(a.email_body);
      lines.push("\n---\n");
    });
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2500);
    });
  }

  // Keyboard: left/right arrow to switch tabs
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setActiveTab((i) => Math.min(i + 1, (result.attendees?.length || 1) - 1));
      } else if (e.key === "ArrowLeft") {
        setActiveTab((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [result.attendees?.length]);

  return (
    <div className="results">
      <div className="glass meeting-header">
        <div className="meeting-header-inner">
          <div>
            <div className="meeting-title">{result.meeting_title}</div>
            <div className="meeting-meta">
              {result.meeting_date} · <span>{result.attendees?.length} attendees</span> · <span>{totalTasks} total tasks</span>
            </div>
          </div>
          <button id="new-analysis-btn" className="btn-back" onClick={onReset}>
            ← New analysis
          </button>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-label">Meeting summary</div>
        <div className="summary-text">{result.summary}</div>
      </div>

      {/* Actions toolbar */}
      <div className="results-toolbar">
        <button
          id="export-all-btn"
          className="btn-ghost"
          onClick={handleExportAll}
        >
          📥 Export all (.md)
        </button>
        <button
          id="copy-all-btn"
          className={`btn-ghost ${allCopied ? "copied-ghost" : ""}`}
          onClick={handleCopyAll}
        >
          {allCopied ? "✓ All copied!" : "📋 Copy all emails"}
        </button>
      </div>

      <div className="attendee-tabs">
        {result.attendees?.map((a, i) => {
          const initials = a.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <button
              key={i}
              id={`tab-${a.name.replace(/\s+/g, "-")}`}
              className={`tab-btn ${activeTab === i ? "active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              <div className="tab-avatar">{initials}</div>
              {a.name.split(" ")[0]}
            </button>
          );
        })}
        <span className="tab-hint">← → arrow keys</span>
      </div>

      {result.attendees?.map((a, i) => (
        <AttendeeCard key={a.name} attendee={a} isActive={activeTab === i} />
      ))}
    </div>
  );
}
