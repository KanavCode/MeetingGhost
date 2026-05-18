import React, { useEffect, useState } from 'react';
import { MeetingResult } from '../types';

interface HistorySidebarProps {
  visible: boolean;
  onClose: () => void;
  onSelectMeeting: (meeting: MeetingResult) => void;
}

export function HistorySidebar({ visible, onClose, onSelectMeeting }: HistorySidebarProps) {
  const [history, setHistory] = useState<MeetingResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchHistory();
    }
  }, [visible]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
    setLoading(false);
  }

  if (!visible) return null;

  return (
    <div className="history-sidebar">
      <div className="history-header">
        <h3>Meeting History</h3>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>
      <div className="history-list">
        {loading ? (
          <p className="history-msg">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="history-msg">No past meetings found.</p>
        ) : (
          history.map(m => (
            <div key={m.id} className="history-item glass" onClick={() => { onSelectMeeting(m); onClose(); }}>
              <div className="history-item-title">{m.meeting_title}</div>
              <div className="history-item-date">{m.meeting_date}</div>
              <div className="history-item-meta">{m.attendees.length} attendees</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
