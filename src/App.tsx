import React, { useState, useRef, useCallback } from "react";
import "./styles/globals.css";
import { analyzeMeeting } from "./lib/gemini";
import { AppSettings, MeetingResult } from "./types";
import { Loader } from "./components/Loader";
import { HeroSection } from "./components/HeroSection";
import { ResultsSection } from "./components/ResultsSection";
import { SettingsPanel } from "./components/SettingsPanel";
import { HistorySidebar } from "./components/HistorySidebar";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Settings & UI state
  const [settings, setSettings] = useState<AppSettings>({ tone: 'Professional', language: 'English' });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = useCallback(async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeMeeting(transcript, settings);
      
      // Save meeting result to backend history
      try {
        await fetch('/api/meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result: data, transcript })
        });
      } catch (err) {
        console.error("Could not save history to backend", err);
      }

      setResult(data);
    } catch (e: any) {
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
  }, [transcript, settings]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setTranscript(ev.target?.result as string);
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
      <SettingsPanel visible={showSettings} onClose={() => setShowSettings(false)} settings={settings} setSettings={setSettings} />
      <HistorySidebar visible={showHistory} onClose={() => setShowHistory(false)} onSelectMeeting={setResult} />

      <header className="header">
        <div className="container">
          <div className="header-inner" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo" style={{ cursor: 'pointer' }} onClick={handleReset}>
              <div className="logo-icon">
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                  <path d="M16 20l4 4-4 4M24 28h8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="logo-name">MeetingGhost</span>
            </div>
            
            <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-ghost" onClick={() => setShowHistory(true)}>
                📚 History
              </button>
              <button className="btn-ghost" onClick={() => setShowSettings(true)}>
                ⚙️ Settings
              </button>
            </div>
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
            MeetingGhost · Built by <a href="https://github.com/KanavCode" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Kanav Modi</a> · Your transcripts are processed in-browser
          </p>
        </div>
      </footer>
    </div>
  );
}
