import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAudioMonitor } from "../hooks/useAudioMonitor";
import "./Monitoring.css";

export default function Monitoring() {
  const navigate = useNavigate();
  const { threatDetected, threatType, confidence, decibel, micAllowed } = useAudioMonitor();
  const [armedAt] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  const bars = Array.from({ length: 32 });

  if (micAllowed === false) {
    return (
      <div className="mon-root">
        <div className="mon-mic-denied">
          <span className="mon-mic-icon">🎙️</span>
          <h2 className="mon-mic-title">Microphone Access Denied</h2>
          <p className="mon-mic-text">
            NoisePrint needs microphone access to monitor for threats.
            Please allow microphone access in your browser settings and reload.
          </p>
          <button className="mon-mic-reload" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mon-root ${threatDetected ? "mon-root--threat" : ""}`}>
      <div className="mon-glow" />

      <header className="mon-header">
        <span className="mon-logo">
          Noise<span className="mon-logo-accent">Print</span>
        </span>
        <div className="mon-header-right">
          <button className="mon-dashboard-btn" onClick={() => navigate("/dashboard")}>
            Dashboard →
          </button>
          <span className="mon-badge">LIVE</span>
        </div>
      </header>

      <div className="mon-center">
        <div className={`mon-wave ${threatDetected ? "mon-wave--threat" : ""}`}>
          {bars.map((_, i) => (
            <div
              key={i}
              className="mon-bar"
              style={{ animationDelay: `${(i * 0.07).toFixed(2)}s` }}
            />
          ))}
        </div>

        <div className="mon-decibel">
          {decibel} <span className="mon-decibel-unit">dB</span>
        </div>

        <div className="mon-status">
          {threatDetected ? (
            <div className="mon-threat-info">
              <span className="mon-status--threat">🚨 THREAT DETECTED</span>
              {threatType && (
                <span className="mon-threat-type">{threatType.toUpperCase()}</span>
              )}
              {confidence && (
                <span className="mon-threat-confidence">
                  {Math.round(confidence * 100)}% confidence
                </span>
              )}
            </div>
          ) : (
            <>
              <span className="mon-status-dot" />
              <span className="mon-status-text">MONITORING</span>
            </>
          )}
        </div>
      </div>

      <footer className="mon-footer">
        <span className="mon-timestamp">Armed at {armedAt}</span>
        <button className="mon-disarm" onClick={() => navigate("/setup")}>
          ⏹ Disarm
        </button>
      </footer>
    </div>
  );
}