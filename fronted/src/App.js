import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

import Onboarding from "./pages/Onboarding";
import Setup from "./pages/Setup";
import Monitoring from "./pages/Monitoring";
import Dashboard from "./pages/Dashboard";
import Permission from "./pages/Permission";

import "./App.css";

function RouteTransitionLayer() {
  const location = useLocation();
  const overlayRef = useRef(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }, [location.pathname]);

  return <div ref={overlayRef} className="route-flash-overlay" aria-hidden="true" />;
}

export default function App() {
  return (
    <Router>
      <div className="app-root">
        <RouteTransitionLayer />
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
          <Route path="/permission" element={<Permission />} />
        </Routes>
      </div>
    </Router>
  );
}