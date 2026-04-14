import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Dashboard.css";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const threatIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const FUTA_COORDS = [7.2986, 5.1374];

const mockAlerts = [
  {
    id: 1,
    timestamp: "08:42:11",
    location: "FUTA Main Gate",
    coords: [7.3012, 5.1398],
    decibel: 94,
  },
  {
    id: 2,
    timestamp: "09:15:03",
    location: "Engineering Complex",
    coords: [7.2978, 5.1361],
    decibel: 88,
  },
  {
    id: 3,
    timestamp: "10:01:47",
    location: "Student Union Building",
    coords: [7.2994, 5.1382],
    decibel: 102,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [alerts] = useState(mockAlerts);
  const [selected, setSelected] = useState(null);

  return (
    <div className="dash-root">
      <div className="dash-glow-top" />

      <header className="dash-header">
        <div className="dash-header-left">
          <span className="dash-logo">
            Noise<span className="dash-logo-accent">Print</span>
          </span>
          <span className="dash-eyebrow">Security Dashboard</span>
        </div>
        <button className="dash-back" onClick={() => navigate("/monitoring")}>
          ← Monitoring
        </button>
      </header>

      <div className="dash-body">
        <div className="dash-map-wrap">
          <MapContainer
            center={FUTA_COORDS}
            zoom={15}
            className="dash-map"
            zoomControl={false}
          >
            <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
/>
            {alerts.map((alert) => (
              <Marker
                key={alert.id}
                position={alert.coords}
                icon={threatIcon}
                eventHandlers={{ click: () => setSelected(alert) }}
              >
                <Popup className="dash-popup">
                  <strong>THREAT DETECTED</strong><br />
                  {alert.location}<br />
                  Decibel: {alert.decibel} dB
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="dash-map-label">
            <span className="dash-map-dot" />
            FUTA Campus · Akure, Nigeria
          </div>
        </div>

        <div className="dash-log">
          <div className="dash-log-header">
            <h2 className="dash-log-title">Alert Log</h2>
            <span className="dash-log-count">{alerts.length} events</span>
          </div>

          <div className="dash-log-list">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`dash-log-item ${selected?.id === alert.id ? "dash-log-item--active" : ""}`}
                onClick={() => setSelected(alert)}
              >
                <div className="dash-log-left">
                  <span className="dash-log-dot" />
                  <div className="dash-log-info">
                    <span className="dash-log-location">{alert.location}</span>
                    <span className="dash-log-time">{alert.timestamp}</span>
                  </div>
                </div>
                <div className="dash-log-db">
                  <span className="dash-log-db-value">{alert.decibel}</span>
                  <span className="dash-log-db-unit">dB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}