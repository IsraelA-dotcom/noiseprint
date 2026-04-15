import { useEffect, useRef, useState } from "react";

const CONFIDENCE_THRESHOLD = 0.85;
const CLIP_DURATION_MS = 2000;
const BACKEND_URL = "https://noiseprint-backend.onrender.com";

export function useAudioMonitor() {
  const [threatDetected, setThreatDetected] = useState(false);
  const [threatType, setThreatType] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [decibel, setDecibel] = useState(0);
  const [location, setLocation] = useState("FUTA Campus, Akure");
  const [micAllowed, setMicAllowed] = useState(null);

  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const cooldownRef = useRef(false);
  const locationRef = useRef("FUTA Campus, Akure");
  const latitudeRef = useRef(null);
  const longitudeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const loc = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
          setLocation(loc);
          locationRef.current = loc;
          latitudeRef.current = lat;
          longitudeRef.current = lon;
        },
        () => {
          locationRef.current = "FUTA Campus, Akure";
          latitudeRef.current = null;
          longitudeRef.current = null;
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }

    async function startMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setMicAllowed(true);

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function trackDecibel() {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          const db = Math.round((avg / 255) * 120);
          setDecibel(db);
          animFrameRef.current = requestAnimationFrame(trackDecibel);
        }
        trackDecibel();

        startRecordingLoop(stream);
      } catch (err) {
        setMicAllowed(false);
        console.error("Mic access denied:", err);
      }
    }

    startMic();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function startRecordingLoop(stream) {
    function recordClip() {
      const chunks = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        analyzeDecibel();
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, CLIP_DURATION_MS);
    }

    recordClip();
    intervalRef.current = setInterval(recordClip, CLIP_DURATION_MS + 200);
  }

  function analyzeDecibel() {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const db = Math.round((avg / 255) * 120);

    if (db >= 70 && !cooldownRef.current) {
      cooldownRef.current = true;
      setThreatDetected(true);
      setThreatType("Loud Noise");
      setConfidence(0.95);

      sendAlert(locationRef.current, db, latitudeRef.current, longitudeRef.current);

      setTimeout(() => {
        setThreatDetected(false);
        setThreatType(null);
        setConfidence(null);
        cooldownRef.current = false;
      }, 8000);
    }
  }

  const sendAlert = async (location, decibel, latitude, longitude) => {
    try {
      const res = await fetch(`${BACKEND_URL}/alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, decibel, latitude, longitude }),
      });
      const data = await res.json();
      console.log("Alert sent:", data.message);
    } catch (error) {
      console.error("Alert failed:", error);
    }
  };

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return { threatDetected, threatType, confidence, decibel, micAllowed };
}      console.error('Alert failed:', error);
    }
  };

  async function analyzeClip(base64Audio) {
    try {
      const res = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: base64Audio,
          location: locationRef.current,
        }),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (
        data.threatDetected &&
        data.confidence >= CONFIDENCE_THRESHOLD &&
        !cooldownRef.current
      ) {
        cooldownRef.current = true;
        setThreatDetected(true);
        setThreatType(data.threatType);
        setConfidence(data.confidence);

        await sendAlert(locationRef.current, data.decibel || 0);

        setTimeout(() => {
          setThreatDetected(false);
          setThreatType(null);
          setConfidence(null);
          cooldownRef.current = false;
        }, 8000);
      }
    } catch (err) {
      console.warn("Backend not connected:", err.message);
    }
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return { threatDetected, threatType, confidence, decibel, micAllowed };
}
