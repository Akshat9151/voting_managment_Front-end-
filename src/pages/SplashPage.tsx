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
  { at:  0, main: 'Starting up…',      sub: 'Initializing secure session…'       },
  { at: 20, main: 'Loading modules…',  sub: 'Verifying credentials store…'       },
  { at: 44, main: 'Fetching data…',    sub: 'Connecting to election servers…'    },
  { at: 68, main: 'Almost ready…',     sub: 'Preparing your dashboard…'          },
  { at: 90, main: 'Finalizing…',       sub: 'Launching secure workspace…'        },
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
        setSubMsg('Redirecting to login…');

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
      {/* Decorative layers */}
      <div className="vv-grid-dots" aria-hidden="true" />
      <div className="vv-blob vv-blob-1" aria-hidden="true" />
      <div className="vv-blob vv-blob-2" aria-hidden="true" />
      <div className="vv-blob vv-blob-3" aria-hidden="true" />

      {/* ── Main card ── */}
      <div className="vv-card">

        {/* ── Logo mark ── */}
        <div className="vv-logo-wrap">
          <div className="vv-logo-glow" aria-hidden="true" />
          <svg
            className="vv-logo-svg"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="VoteVictory logo"
          >
            <defs>
              <linearGradient id="vv-g-main" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#1B6FD8" />
                <stop offset="42%"  stopColor="#4A5CF0" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient id="vv-g-face" x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%"   stopColor="#5B9BFF" />
                <stop offset="50%"  stopColor="#4A5CF0" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="vv-g-crown" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#FCD34D" />
                <stop offset="50%"  stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="vv-g-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id="vv-g-check" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#FFFFFF" stopOpacity={1} />
                <stop offset="100%" stopColor="#E0E8FF" stopOpacity={0.95} />
              </linearGradient>
              <filter id="vv-f-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgba(27,70,200,0.28)" />
              </filter>
              <filter id="vv-f-check-glow">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="vv-f-ring-glow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Shadow disc */}
            <ellipse cx="60" cy="68" rx="46" ry="10"
              fill="rgba(50,30,120,0.14)" filter="url(#vv-f-shadow)" />

            {/* Outer ring */}
            <circle cx="60" cy="56" r="52"
              fill="none" stroke="url(#vv-g-main)" strokeWidth="1.2" opacity="0.3"
              filter="url(#vv-f-ring-glow)" />

            {/* Main filled circle */}
            <circle cx="60" cy="56" r="46" fill="url(#vv-g-face)" />

            {/* Inner glass ring */}
            <circle cx="60" cy="56" r="36"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

            {/* Top-left specular highlight */}
            <ellipse cx="44" cy="36" rx="20" ry="11"
              fill="rgba(255,255,255,0.25)" transform="rotate(-22,44,36)" />

            {/* Top-right specular dot */}
            <circle cx="76" cy="30" r="5" fill="rgba(255,255,255,0.14)" />

            {/* ── Crown ── */}
            <g transform="translate(60,16)">
              <rect x="-13" y="8" width="26" height="5" rx="2.5" fill="url(#vv-g-crown)" />
              <polygon points="-13,8 -10,0 -6,8"  fill="url(#vv-g-crown)" />
              <polygon points="-4,8  0,-6  4,8"   fill="url(#vv-g-gold)"  />
              <polygon points="6,8  10,0  13,8"   fill="url(#vv-g-crown)" />
              <circle cx="-9" cy="5"   r="2"   fill="white" opacity="0.8" />
              <circle cx="0"  cy="3"   r="2.5" fill="white" opacity="0.9" />
              <circle cx="9"  cy="5"   r="2"   fill="white" opacity="0.8" />
            </g>

            {/* ── Checkmark / V ── */}
            <g filter="url(#vv-f-check-glow)" transform="translate(60,62)">
              <polyline points="-20,2 -5,20 22,-19"
                fill="none" stroke="rgba(255,255,255,0.25)"
                strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="-20,2 -5,20 22,-19"
                fill="none" stroke="url(#vv-g-check)"
                strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="-20,2 -5,20 22,-19"
                fill="none" stroke="white"
                strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
            </g>

            {/* Star sparkles */}
            <g transform="translate(20,28)" opacity="0.7">
              <line x1="0" y1="-5" x2="0"  y2="5"  stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-5" y1="0" x2="5"  y2="0"  stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
              <line x1="3.5"  y1="-3.5" x2="-3.5" y2="3.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            </g>
            <g transform="translate(98,36)" opacity="0.5">
              <line x1="0" y1="-3.5" x2="0"    y2="3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="-3.5" y1="0" x2="3.5"  y2="0"   stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </g>
            <circle cx="96" cy="78" r="2" fill="rgba(255,255,255,0.45)" />

            {/* Arc text */}
            <path id="vv-arc" d="M 22,56 A 38,38 0 0,0 98,56" fill="none" />
            <text fontSize="7.5" fontFamily="Poppins,sans-serif" fontWeight="600"
              fill="rgba(255,255,255,0.35)" letterSpacing="3">
              <textPath href="#vv-arc" startOffset="50%" textAnchor="middle">
                VOTE VICTORY
              </textPath>
            </text>
          </svg>
        </div>

        {/* ── Brand text ── */}
        <div className="vv-brand-block">
          <div className="vv-brand-en">VoteVictory</div>
          <div className="vv-brand-divider">
            <div className="vv-brand-dot" />
          </div>
          <div className="vv-brand-hi">वोट विजय</div>
          <div className="vv-brand-tagline">Election Campaign Management Platform</div>
        </div>

        {/* ── Loading bar ── */}
        <div className="vv-loader-section">
          <div className="vv-loader-meta">
            <span>{mainMsg}</span>
            <span className="vv-loader-pct">{pct}%</span>
          </div>
          <div
            className="vv-loader-track"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading progress"
          >
            <div className="vv-loader-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="vv-loader-status" aria-live="polite">
            {subMsg}
          </div>
        </div>

        {/* Bounce dots */}
        <div className="vv-dots" aria-hidden="true">
          <div className="vv-dot" />
          <div className="vv-dot" />
          <div className="vv-dot" />
        </div>

      </div>{/* /vv-card */}

      {/* Footer strip */}
      <div className="vv-footer" aria-hidden="true">
        <span className="vv-footer-dot" />
        Secure · Encrypted · Trusted
        <span className="vv-footer-dot" />
      </div>
    </div>
  );
};

export default SplashPage;
