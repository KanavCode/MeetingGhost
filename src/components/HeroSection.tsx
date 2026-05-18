import React, { useEffect, RefObject } from 'react';
import { DEMO_TRANSCRIPT } from '../lib/demo';

interface HeroSectionProps {
  transcript: string;
  setTranscript: (val: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  error: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HeroSection({ transcript, setTranscript, onAnalyze, loading, error, fileRef, onFileChange }: HeroSectionProps) {
  // Ctrl+Enter keyboard shortcut to analyze
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && transcript.trim() && !loading) {
        e.preventDefault();
        onAnalyze();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [transcript, loading, onAnalyze]);

  return (
    <>
      <section className="hero">
        <div className="hero-eyebrow">AI-Powered Meeting Intelligence</div>
        <h1 className="hero-title">
          Paste a meeting.<br />
          <span>Own the follow-up.</span>
        </h1>
        <p className="hero-sub">
          MeetingGhost reads your transcript and generates personalised
          action-item emails for every attendee — not a generic summary,
          but individual emails they'll actually act on.
        </p>
      </section>

      <section className="input-section">
        <div className="glass input-card">
          <div className="input-header">
            <label className="input-label">Meeting transcript</label>
            <div className="btn-group">
              <button
                id="load-demo-btn"
                className="btn-ghost"
                onClick={() => setTranscript(DEMO_TRANSCRIPT)}
              >
                ✨ Load demo
              </button>
              <button
                id="upload-btn"
                className="btn-ghost"
                onClick={() => fileRef.current?.click()}
              >
                📎 Upload .txt
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,.vtt,.srt"
                style={{ display: "none" }}
                onChange={onFileChange}
              />
            </div>
          </div>

          <textarea
            id="transcript-input"
            className="transcript-area"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={"Paste your meeting notes, transcript, or Zoom/Meet export here...\n\nExample:\nJohn: I'll finish the report by Friday.\nSarah: I'll review it Monday and send feedback.\nMike: I need to set up the staging server by Wednesday."}
          />

          <div className="input-footer">
            <span className="char-count">
              {transcript.length > 0
                ? `${transcript.split(/\s+/).filter(Boolean).length} words`
                : "Paste, type, or upload your transcript"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {transcript.trim() && (
                <span className="kbd-hint">⌘/Ctrl + Enter</span>
              )}
              <button
                id="analyze-btn"
                className="btn-primary"
                onClick={onAnalyze}
                disabled={loading || !transcript.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Analysing...
                  </>
                ) : (
                  <>Generate emails →</>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-box">
              <span>⚠️</span>
              <div>
                <strong>Something went wrong</strong>
                <br />
                {error}
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="how-it-works">
          {[
            { n: 1, title: "Paste transcript", desc: "Any format — raw notes, Zoom transcript, Meet export, Otter.ai, or .vtt subtitles" },
            { n: 2, title: "AI extracts tasks", desc: "AI identifies every attendee, their commitments, and inferred deadlines" },
            { n: 3, title: "Send personalised emails", desc: "Copy, open in Gmail, or export all — emails are ready to send in one click" },
          ].map((s) => (
            <div key={s.n} className="glass step-card">
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
