import React, { useEffect, useState } from 'react';

const LOADER_STEPS = [
  "Reading transcript...",
  "Identifying attendees...",
  "Extracting action items...",
  "Drafting personalised emails...",
  "Finalising output...",
];

export function Loader({ visible }: { visible: boolean }) {
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
