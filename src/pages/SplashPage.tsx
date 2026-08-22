import React, { useEffect, useRef, useState } from 'react';
import './SplashPage.css';

interface SplashPageProps {
  onComplete: () => void;
  duration?: number;
}

const STEPS = [
  { at:  0, main: 'Starting up…',     sub: 'Initializing secure workspace…'  },
  { at: 20, main: 'Loading modules…', sub: 'Verifying campaign credentials…' },
  { at: 44, main: 'Fetching data…',   sub: 'Connecting to election servers…' },
  { at: 68, main: 'Almost ready…',    sub: 'Preparing election dashboard…'   },
  { at: 90, main: 'Finalizing…',      sub: 'Launching VoteVictory…'          },
];

export const SplashPage: React.FC<SplashPageProps> = ({ onComplete, duration = 3200 }) => {
  const [pct,     setPct]     = useState(0);
  const [mainMsg, setMainMsg] = useState(STEPS[0].main);
  const [subMsg,  setSubMsg]  = useState(STEPS[0].sub);
  const [exiting, setExiting] = useState(false);
  const [ringDone, setRingDone] = useState(false);

  const pctRef    = useRef(0);
  const msgIdxRef = useRef(0);

  // Mark ring as done after its spin finishes (1.8s)
  useEffect(() => {
    const t = setTimeout(() => setRingDone(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const TICK  = 40;
    const speed = 100 / (duration / TICK);

    const timer = setInterval(() => {
      const jitter = speed * (0.55 + Math.random() * 0.95);
      pctRef.current = Math.min(pctRef.current + jitter, 100);
      const r = Math.floor(pctRef.current);
      setPct(r);

      for (let i = msgIdxRef.current; i < STEPS.length; i++) {
        if (r >= STEPS[i].at) {
          setMainMsg(STEPS[i].main);
          setSubMsg(STEPS[i].sub);
          msgIdxRef.current = i + 1;
        }
      }

      if (pctRef.current >= 100) {
        clearInterval(timer);
        setPct(100);
        setMainMsg('Ready!');
        setSubMsg('Redirecting to sign in…');
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => onComplete(), 560);
        }, 500);
      }
    }, TICK);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div className={`sp-root${exiting ? ' sp-exit' : ''}`} aria-label="Loading VoteVictory" role="status">

      {/* Mesh gradient background */}
      <div className="sp-bg" aria-hidden="true" />
      <div className="sp-dots-bg" aria-hidden="true" />

      {/* Soft aura blobs */}
      <div className="vv-aura-blob vv-aura-1" aria-hidden="true" />
      <div className="vv-aura-blob vv-aura-2" aria-hidden="true" />
      <div className="vv-aura-blob vv-aura-3" aria-hidden="true" />

      {/* ── Centre content ── */}
      <div className="sp-center">

        {/* ── Logo + ring ── */}
        <div className="sp-ring-wrap">
          {/* Glow */}
          <div className="sp-ring-glow" aria-hidden="true" />

          {/* Conic spinning ring */}
          <div className={`sp-ring${ringDone ? ' sp-ring-pulse' : ''}`} aria-hidden="true" />

          {/* Orbiting particles */}
          <div className="sp-orbit" aria-hidden="true">
            <div className="sp-particle" />
            <div className="sp-particle" />
            <div className="sp-particle" />
            <div className="sp-particle" />
          </div>

          {/* Logo disc */}
          <div className="sp-logo-disc">
            {/* Crown + Checkmark SVG */}
            <svg
              className="sp-logo-svg"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="VoteVictory logo"
              role="img"
            >
              {/* Crown peaks */}
              <path
                className="sp-crown-path"
                d="M10 36 L10 28 L20 16 L32 26 L44 10 L54 28 L54 36 Z"
              />
              {/* Crown band */}
              <rect className="sp-crown-path" x="10" y="36" width="44" height="8" rx="4" />
              {/* Checkmark drawn last */}
              <polyline
                className="sp-check-path"
                points="14,34 27,48 50,20"
              />
            </svg>
          </div>
        </div>

        {/* ── Brand text ── */}
        <div className="sp-brand">
          <h1 className="sp-name">
            Vote<span className="sp-name-gold">Victory</span>
          </h1>
          <div className="sp-hindi">वोट विजय</div>
          <p className="sp-tagline">Election Campaign Management Platform</p>
        </div>

        {/* ── Progress + status ── */}
        <div className="sp-bottom">
          <div className="sp-progress-track">
            <div className="sp-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="sp-progress-meta">
            <span>Loading</span>
            <span className="sp-pct">{pct}%</span>
          </div>

          <div className="sp-status">
            <div className="sp-status-main">{mainMsg}</div>
            <div className="sp-status-sub">{subMsg}</div>
            <div className="sp-dots-row" aria-hidden="true">
              <div className="sp-dot-ind" />
              <div className="sp-dot-ind" />
              <div className="sp-dot-ind" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
