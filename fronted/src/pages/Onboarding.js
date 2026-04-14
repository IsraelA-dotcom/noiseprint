import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="ob-root">
      <div className="ob-glow-left" />
      <div className="ob-glow-right" />

      <div className="ob-content">
        <div className="ob-eyebrow">SignalCo</div>

        <h1 className="ob-title">
          Noise<span className="ob-title-accent">Print</span>
        </h1>

        <p className="ob-tagline">
          Passive acoustic threat detection.<br />
          Always listening. Never wrong.
        </p>

        <div className="ob-waveform">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="ob-wave-bar" style={{ animationDelay: `${(i * 0.05).toFixed(2)}s` }} />
        ))}
      </div>

        <button className="ob-cta" onClick={() => navigate("/permission")}>
          Begin Setup
          <span className="ob-cta-arrow">→</span>
        </button>

        <p className="ob-footnote">
          Requires microphone access · No data leaves your device during setup
        </p>
      </div>
    </div>
  );
}