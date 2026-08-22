import React, { useEffect, useRef, useState } from 'react';
import './SplashPage.css';

// ─── Types ──────────────────────────────────────────────────────────
interface SplashPageProps {
  /** Called when animation finishes — parent navigates to /login */
  onComplete: () => void;
  /** Total duration in ms (default: 3200) */
  duration?: number;
}

// ─── Loading step messages ───────────────────────────────────────────
const STEPS = [
  { at:  0, main: 'Starting up…',      sub: 'Initializing secure workspace…'     },
  { at: 20, main: 'Loading modules…',  sub: 'Verifying campaign credentials…'    },
  { at: 44, main: 'Fetching data…',    sub: 'Connecting to election servers…'    },
  { at: 68, main: 'Almost ready…',     sub: 'Preparing election dashboard…'      },
  { at: 90, main: 'Finalizing…',       sub: 'Launching VoteVictory…'             },
];

// ─── SplashPage Component ────────────────────────────────────────────
export const SplashPage: React.FC<SplashPageProps> = ({
  onComplete,
  duration = 3200,
}) => {
  const [pct,     setPct]     = useState(0);
  const [mainMsg, setMainMsg] = useState(STEPS[0].main);
  const [subMsg,  setSubMsg]  = useState(STEPS[0].sub);
  const [exiting, setExiting] = useState(false);

  const pctRef    = useRef(0);
  const msgIdxRef = useRef(0);

  useEffect(() => {
    const TICK  = 40;
    const speed = 100 / (duration / TICK);

    const timer = setInterval(() => {
      const jitter = speed * (0.55 + Math.random() * 0.95);
      pctRef.current = Math.min(pctRef.current + jitter, 100);
      const r = Math.floor(pctRef.current);

      setPct(r);

      // Cycle status messages
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

        // Play exit animation then call parent
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => onComplete(), 560);
        }, 500);
      }
    }, TICK);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div
      className={`vv-splash-root${exiting ? ' vv-exit' : ''}`}
      aria-label="Loading VoteVictory"
      role="status"
    >
      {/* Soft Floating Gradient Aura Blobs */}
      <div className="vv-aura-blob vv-aura-1" aria-hidden="true" />
      <div className="vv-aura-blob vv-aura-2" aria-hidden="true" />
      <div className="vv-aura-blob vv-aura-3" aria-hidden="true" />
      <div className="vv-grid-dots" aria-hidden="true" />

      {/* ── Main card ── */}
      <div className="vv-card">

        {/* ── Logo mark ── */}
        <div className="vv-logo-wrap">
          <div className="vv-logo-glow" aria-hidden="true" />
          <svg
            className="w-20 h-20"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="VoteVictory logo"
          >
            <defs>
              <linearGradient id="vv-splash-base" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="60%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="vv-splash-crown" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="vv-splash-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Outer Saffron Base Circle */}
            <circle cx="60" cy="56" r="48" fill="url(#vv-splash-base)" />

            {/* Inner glass ring */}
            <circle
              cx="60"
              cy="56"
              r="36"
              fill="rgba(255,255,255,0.12)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
            />

            {/* Highlight */}
            <ellipse
              cx="44"
              cy="36"
              rx="20"
              ry="11"
              fill="rgba(255,255,255,0.25)"
              transform="rotate(-22,44,36)"
            />

            {/* Crown */}
            <g transform="translate(60,16)">
              <rect x="-13" y="8" width="26" height="5" rx="2.5" fill="url(#vv-splash-crown)" />
              <polygon points="-13,8 -10,0 -6,8" fill="url(#vv-splash-crown)" />
              <polygon points="-4,8  0,-6  4,8" fill="url(#vv-splash-gold)" />
              <polygon points="6,8  10,0  13,8" fill="url(#vv-splash-crown)" />
              <circle cx="-9" cy="5" r="2" fill="white" opacity="0.85" />
              <circle cx="0" cy="3" r="2.5" fill="white" opacity="0.95" />
              <circle cx="9" cy="5" r="2" fill="white" opacity="0.85" />
            </g>

            {/* V-Checkmark */}
            <g transform="translate(60,62)">
              <polyline
                points="-20,2 -5,20 22,-19"
                fill="none"
                stroke="rgba(15,23,42,0.25)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="-20,2 -5,20 22,-19"
                fill="none"
                stroke="white"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        {/* ── Brand text lockup ── */}
        <div className="vv-title-wrap">
          <h1 className="vv-app-name">Vote<span className="vv-gold">Victory</span></h1>
          <div className="vv-hindi-name">वोट विजय</div>
          <p className="vv-app-tagline">Election Campaign Management Platform</p>
        </div>

        {/* ── Progress bar section ── */}
        <div className="vv-progress-wrap">
          <div className="vv-track">
            <div className="vv-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="vv-pct-wrap">
            <span>Progress</span>
            <span className="vv-pct-num">{pct}%</span>
          </div>
        </div>

        {/* ── Status message area ── */}
        <div className="vv-msg-wrap">
          <div className="vv-msg-main">{mainMsg}</div>
          <div className="vv-msg-sub">{subMsg}</div>
          <div className="vv-dots" aria-hidden="true">
            <div className="vv-dot" />
            <div className="vv-dot" />
            <div className="vv-dot" />
          </div>
        </div>

      </div>
    </div>
  );
};
