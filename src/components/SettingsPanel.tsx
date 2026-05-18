import React from 'react';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  visible: boolean;
  onClose: () => void;
}

const TONES = ['Professional', 'Casual', 'Strict'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese'];

export function SettingsPanel({ settings, setSettings, visible, onClose }: SettingsPanelProps) {
  if (!visible) return null;

  return (
    <div className="settings-overlay">
      <div className="glass settings-modal">
        <div className="settings-header">
          <h3>Settings</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-body">
          <div className="form-group">
            <label>Email Tone</label>
            <select 
              value={settings.tone}
              onChange={(e) => setSettings({ ...settings, tone: e.target.value as any })}
              className="settings-select"
            >
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <p className="setting-desc">Adjusts how the AI drafts the emails.</p>
          </div>

          <div className="form-group">
            <label>Output Language</label>
            <select 
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="settings-select"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <p className="setting-desc">The language for the email bodies and action items.</p>
          </div>
        </div>
        
        <div className="settings-footer">
          <button className="btn-primary" onClick={onClose}>Save & Close</button>
        </div>
      </div>
    </div>
  );
}
