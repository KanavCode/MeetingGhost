import { useState, useRef, useEffect, useCallback } from "react";
import "./styles/globals.css";
import { analyzeMeeting } from "./lib/gemini";
import { DEMO_TRANSCRIPT } from "./lib/demo";

const LOADER_STEPS = [
  "Reading transcript...",
  "Identifying attendees...",
  "Extracting action items...",
  "Drafting personalised emails...",
  "Finalising output...",
];

function Loader({ visible }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!visible) { setStepIndex(0); return; }
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, LOADER_STEPS.length - 1));
    }, 1100);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-ghost">
        <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="14" fill="url(#lg)"/>
          <path d="M16 20l4 4-4 4M24 28h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <defs><linearGradient id="lg" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
        </svg>
      </div>
      <p className="loader-text">Analysing your meeting</p>
      <p className="loader-sub">Hang tight — this usually takes 3–8 seconds</p>
      <div className="loader-steps">
        {LOADER_STEPS.map((step, i) => (
          <div
            key={step}
            className={`loader-step ${i < stepIndex ? "done" : i === stepIndex ? "active" : ""}`}
          >
            <div className="step-dot" />
            {i < stepIndex ? `✓ ${step}` : step}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSection({ transcript, setTranscript, onAnalyze, loading, error, fileRef, onFileChange }) {
  // Ctrl+Enter keyboard shortcut to analyze
  useEffect(() => {
    function handleKey(e) {
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
                onClick={() => fileRef.current.click()}
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

function AttendeeCard({ attendee, isActive }) {
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

function ResultsSection({ result, onReset }) {
  const [activeTab, setActiveTab] = useState(0);
  const [allCopied, setAllCopied] = useState(false);

  const totalTasks = result.attendees?.reduce(
    (sum, a) => sum + (a.action_items?.length || 0), 0
  ) || 0;

  function handleExportAll() {
    const lines = [];
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
    const lines = [];
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
    function handleKey(e) {
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

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleAnalyze = useCallback(async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeMeeting(transcript);
      setResult(data);
    } catch (e) {
      console.error(e);
      setError(
        e.message?.includes("API key")
          ? "API key issue — check console for details."
          : e.message?.includes("quota") || e.message?.includes("429")
          ? "Rate limit hit. Wait a moment and try again."
          : `Analysis failed: ${e.message || "Unknown error"}. Try again or check the console.`
      );
    }
    setLoading(false);
  }, [transcript]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setTranscript(ev.target.result);
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleReset() {
    setResult(null);
    setTranscript("");
    setError("");
  }

  return (
    <div className="app">
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Loader visible={loading} />

      <header className="header">
        <div className="container">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon">
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                  <path d="M16 20l4 4-4 4M24 28h8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="logo-name">MeetingGhost</span>
            </div>
            <div className="header-badge">by Kanav Modi</div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <div className="container">
          {!result ? (
            <HeroSection
              transcript={transcript}
              setTranscript={setTranscript}
              onAnalyze={handleAnalyze}
              loading={loading}
              error={error}
              fileRef={fileRef}
              onFileChange={handleFile}
            />
          ) : (
            <ResultsSection result={result} onReset={handleReset} />
          )}
        </div>
      </main>

      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "1.25rem 0",
        marginTop: "2rem",
      }}>
        <div className="container">
          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            MeetingGhost · Built by <a href="https://github.com/KanavCode" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Kanav Modi</a> · Your transcripts are processed in-browser and never stored
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
