import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Permission.css";

export default function Permission() {
  const navigate = useNavigate();
  const [micStatus, setMicStatus] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function requestPermissions() {
    setLoading(true);

    // Request microphone
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicStatus("granted");
    } catch {
      setMicStatus("denied");
    }

    // Request location
    await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationStatus("granted");
          resolve();
        },
        () => {
          setLocationStatus("denied");
          resolve();
        }
      );
    });

    setLoading(false);
  }

  const bothGranted = micStatus === "granted" && locationStatus === "granted";
  const anyDenied = micStatus === "denied" || locationStatus === "denied";
  const asked = micStatus !== null && locationStatus !== null;

  return (
    <div className="perm-root">
      <div className="perm-glow-left" />
      <div className="perm-glow-right" />

      <div className="perm-content">
        <div className="perm-eyebrow">SignalCo</div>

        <h1 className="perm-title">
          Before we<br />
          <span className="perm-title-accent">arm up.</span>
        </h1>

        <p className="perm-subtitle">
          NoisePrint needs two permissions to protect you.
          We don't store or share any of this data.
        </p>

        <div className="perm-cards">
          <div className={`perm-card ${micStatus === "granted" ? "perm-card--granted" : micStatus === "denied" ? "perm-card--denied" : ""}`}>
            <div className="perm-card-icon">🎙️</div>
            <div className="perm-card-info">
              <span className="perm-card-title">Microphone</span>
              <span className="perm-card-desc">
                To listen for acoustic threats in real time
              </span>
            </div>
            <div className="perm-card-status">
              {micStatus === "granted" && <span className="perm-status-granted">✓</span>}
              {micStatus === "denied" && <span className="perm-status-denied">✗</span>}
              {micStatus === null && <span className="perm-status-pending">—</span>}
            </div>
          </div>

          <div className={`perm-card ${locationStatus === "granted" ? "perm-card--granted" : locationStatus === "denied" ? "perm-card--denied" : ""}`}>
            <div className="perm-card-icon">📍</div>
            <div className="perm-card-info">
              <span className="perm-card-title">Location</span>
              <span className="perm-card-desc">
                To tag alerts with where the threat occurred
              </span>
            </div>
            <div className="perm-card-status">
              {locationStatus === "granted" && <span className="perm-status-granted">✓</span>}
              {locationStatus === "denied" && <span className="perm-status-denied">✗</span>}
              {locationStatus === null && <span className="perm-status-pending">—</span>}
            </div>
          </div>
        </div>

        {anyDenied && asked && (
          <p className="perm-denied-msg">
            One or more permissions were denied. Please enable them in your
            browser settings and reload the page.
          </p>
        )}

        {!asked && (
          <button
            className="perm-cta"
            onClick={requestPermissions}
            disabled={loading}
          >
            {loading ? "Requesting..." : "Grant Permissions"}
          </button>
        )}

        {bothGranted && (
          <button
            className="perm-cta perm-cta--ready"
            onClick={() => navigate("/setup")}
          >
            Continue to Setup →
          </button>
        )}

        {anyDenied && asked && (
          <button
            className="perm-cta perm-cta--retry"
            onClick={() => window.location.reload()}
          >
            Reload & Try Again
          </button>
        )}

        <p className="perm-footnote">
          Audio is processed locally · Location is never stored on our servers
        </p>
      </div>
    </div>
  );
}