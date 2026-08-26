import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { PosterTemplateProps } from './PosterTemplate';

// Common auto-shrink hook
function useAutoShrink(
  text: string,
  ref: React.RefObject<HTMLElement | null>,
  maxFontSize: number,
  minFontSize: number,
  maxW: number,
  maxH: number
) {
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    let size = maxFontSize;
    const el = ref.current;
    if (!el) return;

    el.style.fontSize = `${size}px`;
    while (
      size > minFontSize &&
      (el.offsetWidth > maxW || el.offsetHeight > maxH || el.scrollWidth > maxW || el.scrollHeight > maxH)
    ) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }
    setFontSize(size);
  }, [text, maxFontSize, minFontSize, maxW, maxH, ref]);

  return fontSize;
}

// 1. Royal Navy & Gold Rally (1080x1350)
export const RoyalNavyGoldTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 52, 20, 490, 130);
    const posFontSize = useAutoShrink(position, posRef, 32, 18, 470, 55);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 28, 16, 920, 90);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'भव्य विकास, अटूट विश्वास • आपके एक वोट से बदलेगा गांव का भविष्य!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1350px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1350px', background: 'linear-gradient(180deg, #0A192F 0%, #0F172A 45%, #F8FAFC 45%, #F8FAFC 100%)' }} />

        {/* Top Gold Header */}
        <div style={{ position: 'absolute', top: '20px', left: '50px', width: '980px', height: '55px', background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(217,119,6,0.3)' }}>
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', letterSpacing: '1px' }}>॥ ग्राम पंचायत आम चुनाव 2026 • विजय संकल्प महारैली ॥</span>
        </div>

        {/* Top Tagline */}
        <div style={{ position: 'absolute', top: '88px', left: '50px', width: '980px', textAlign: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#FDE68A', letterSpacing: '0.5px' }}>★ योग्य, कर्मठ, ईमानदार एवं जन-जन के प्रिय प्रत्याशी को भारी मतों से विजयी बनाएं ★</span>
        </div>

        {/* Photo Shield Frame */}
        <div style={{ position: 'absolute', top: '130px', left: '50px', width: '440px', height: '540px', borderRadius: '28px', border: '5px solid #F59E0B', background: '#1E293B', overflow: 'hidden', boxShadow: '0 16px 36px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              <span style={{ fontSize: '150px', fontWeight: 900, color: '#FBBF24', lineHeight: 1 }}>{initial}</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#E2E8F0', marginTop: '12px', letterSpacing: '1px' }}>प्रत्याशी फोटो</span>
            </div>
          )}
        </div>

        {/* Right Info Block */}
        <div style={{ position: 'absolute', top: '135px', left: '520px', width: '510px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>॥ आपका अपना प्रत्याशी ॥</div>
          <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', marginTop: '6px' }}>
            <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#FBBF24', lineHeight: 1.15, wordBreak: 'break-word', textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
              {candidateName || 'उम्मीदवार का नाम'}
            </span>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', border: '2px solid #60A5FA', borderRadius: '18px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', boxShadow: '0 4px 14px rgba(30,58,138,0.4)' }}>
            <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {position || 'सरपंच प्रत्याशी'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: 1, background: '#FFFFFF', border: '2.5px solid #0F172A', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>वार्ड नंबर / WARD</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', lineHeight: 1, marginTop: '2px' }}>{wardNo.trim() || '—'}</div>
            </div>
            <div style={{ flex: 1, background: '#FEF3C7', border: '2.5px solid #D97706', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(217,119,6,0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>क्रमांक / BALLOT</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#92400E', lineHeight: 1, marginTop: '2px' }}>{ballotNo.trim() || '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: '16px', background: '#FFFFFF', border: '3px solid #F59E0B', borderRadius: '20px', height: '120px', display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '14px', boxShadow: '0 6px 16px rgba(245,158,11,0.18)' }}>
            <div style={{ width: '96px', height: '96px', background: '#FEF3C7', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {symbolUrl ? (
                <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
              ) : (
                <span style={{ fontSize: '70px', lineHeight: 1 }}>🪔</span>
              )}
            </div>
            <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>चुनाव चिह्न / ELECTION SYMBOL</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginTop: '2px', wordBreak: 'break-word' }}>{symbolName || 'चुनाव चिह्न'}</div>
            </div>
          </div>
        </div>

        {/* Slogan Box */}
        <div style={{ position: 'absolute', top: '695px', left: '50px', width: '980px', height: '150px', background: '#0A192F', border: '2px solid #D97706', borderRadius: '22px', padding: '16px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 6px 20px rgba(10,25,47,0.2)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🎯</span><span>हमारा मुख्य संकल्प / Campaign Promise</span>
          </div>
          <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.35, wordBreak: 'break-word', fontStyle: 'italic' }}>
            "{effectiveSlogan}"
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{ position: 'absolute', top: '865px', left: '50px', width: '980px', height: '200px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🏛️</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>पारदर्शी पंचायत</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>बिना भेदभाव हर ग्रामीण के काम और योजनाओं का सीधा लाभ</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>💡</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>आधुनिक सुविधाएं</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>सीसी रोड, स्ट्रीट लाइट, वाई-फाई और 24 घंटे शुद्ध पेयजल</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🤝</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>सेवा और समर्पण</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>सुख-दुख में हर समय आपके साथ उपस्थित रहने का वादा</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', top: '1085px', left: '50px', width: '980px', height: '115px', background: 'linear-gradient(135deg, #0A192F, #1E293B)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxShadow: '0 8px 24px rgba(10,25,47,0.25)' }}>
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: '23px', fontWeight: 900, color: '#FBBF24' }}>चुनाव चिह्न पर मोहर लगाकर भारी मतों से विजयी बनाएं!</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8', marginTop: '2px' }}>निवेदक: समस्त ग्रामवासी एवं युवा मोर्चा</div>
          </div>
          {contactNumber.trim() ? (
            <div style={{ background: '#D97706', borderRadius: '14px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontSize: '20px', fontWeight: 800 }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
RoyalNavyGoldTemplate.displayName = 'RoyalNavyGoldTemplate';

// 2. Crimson Bold Youth Poster (1080x1350)
export const CrimsonBoldYouthTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 52, 20, 490, 130);
    const posFontSize = useAutoShrink(position, posRef, 32, 18, 470, 55);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 28, 16, 920, 90);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'युवा जोश, नई सोच • भ्रष्टाचार मुक्त पंचायत का निर्माण!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1350px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1350px', background: '#FAFAFA' }} />

        {/* Top Header */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '120px', background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 6px 20px rgba(220,38,38,0.3)' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FDE047', letterSpacing: '2px', textTransform: 'uppercase' }}>॥ त्रिस्तरीय पंचायत आम चुनाव 2026 ॥</div>
          <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '1px', marginTop: '4px' }}>युवा शक्ति • प्रगतिशील विचार • जन-जन का अधिकार</div>
        </div>

        {/* Left Info Block */}
        <div style={{ position: 'absolute', top: '150px', left: '50px', width: '510px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '1px' }}>॥ आपका कर्मठ साथी ॥</div>
          <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', marginTop: '4px' }}>
            <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#991B1B', lineHeight: 1.15, wordBreak: 'break-word' }}>
              {candidateName || 'उम्मीदवार का नाम'}
            </span>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: '18px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}>
            <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 800, color: '#FDE047', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {position || 'जिला पंचायत सदस्य'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: 1, background: '#FFFFFF', border: '3px solid #DC2626', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 12px rgba(220,38,38,0.12)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>वार्ड नंबर / WARD</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A', lineHeight: 1, marginTop: '2px' }}>{wardNo.trim() || '—'}</div>
            </div>
            <div style={{ flex: 1, background: '#FEF2F2', border: '3px solid #991B1B', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 12px rgba(153,27,27,0.12)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase' }}>क्रमांक / BALLOT</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#991B1B', lineHeight: 1, marginTop: '2px' }}>{ballotNo.trim() || '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: '16px', background: '#FFFFFF', border: '3px solid #DC2626', borderRadius: '20px', height: '125px', display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '14px', boxShadow: '0 6px 16px rgba(220,38,38,0.15)' }}>
            <div style={{ width: '96px', height: '96px', background: '#FEF2F2', border: '2px solid #FCA5A5', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {symbolUrl ? (
                <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
              ) : (
                <span style={{ fontSize: '70px', lineHeight: 1 }}>🏏</span>
              )}
            </div>
            <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>चुनाव चिह्न / ELECTION SYMBOL</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginTop: '2px', wordBreak: 'break-word' }}>{symbolName || 'चुनाव चिह्न'}</div>
            </div>
          </div>
        </div>

        {/* Right Photo Box */}
        <div style={{ position: 'absolute', top: '150px', left: '590px', width: '440px', height: '540px', borderRadius: '28px', border: '6px solid #DC2626', background: '#1E293B', overflow: 'hidden', boxShadow: '0 16px 36px rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CBD5E1' }}>
              <span style={{ fontSize: '150px', fontWeight: 900, color: '#EF4444', lineHeight: 1 }}>{initial}</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FCA5A5', marginTop: '12px' }}>प्रत्याशी फोटो</span>
            </div>
          )}
        </div>

        {/* Slogan Box */}
        <div style={{ position: 'absolute', top: '715px', left: '50px', width: '980px', height: '150px', background: '#FFF1F2', border: '2px solid #FDA4AF', borderLeft: '8px solid #DC2626', borderRadius: '20px', padding: '16px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 14px rgba(220,38,38,0.08)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>🔥 चुनावी संकल्प / Youth Manifesto</div>
          <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#1E293B', lineHeight: 1.35, wordBreak: 'break-word', fontStyle: 'italic' }}>
            "{effectiveSlogan}"
          </div>
        </div>

        {/* 3 Action Pillars */}
        <div style={{ position: 'absolute', top: '885px', left: '50px', width: '980px', height: '200px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🎯</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#991B1B', marginBottom: '4px' }}>रोजगार व खेल</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>खेल मैदान, लाइब्रेरी एवं कौशल विकास केंद्र की स्थापना</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>⚡</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#991B1B', marginBottom: '4px' }}>त्वरित समाधान</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>जनसमस्याओं का 24 घंटे में मौके पर निवारण</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🛡️</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#991B1B', marginBottom: '4px' }}>सुरक्षा एवं न्याय</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>गांव में सीसीटीवी कैमरे एवं निष्पक्ष प्रशासनिक सहयोग</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', top: '1105px', left: '50px', width: '980px', height: '115px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxShadow: '0 8px 24px rgba(15,23,42,0.2)' }}>
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: '23px', fontWeight: 900, color: '#FDE047' }}>चुनाव निशान के सामने वाला बटन दबाकर रिकॉर्ड मतों से जिताएं!</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8', marginTop: '2px' }}>निवेदक: समस्त युवा साथी एवं ग्रामवासी</div>
          </div>
          {contactNumber.trim() ? (
            <div style={{ background: '#DC2626', borderRadius: '14px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontSize: '20px', fontWeight: 800 }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
CrimsonBoldYouthTemplate.displayName = 'CrimsonBoldYouthTemplate';

// 3. Emerald Gram Vikas Poster (1080x1350)
export const EmeraldGramVikasTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 52, 20, 490, 130);
    const posFontSize = useAutoShrink(position, posRef, 32, 18, 470, 55);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 28, 16, 920, 90);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'हर खेत को पानी, हर हाथ को काम • महिला सशक्तिकरण एवं खुशहाल ग्राम!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1350px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1350px', background: '#F0FDF4' }} />

        {/* Top Header */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '115px', background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 6px 20px rgba(6,78,59,0.3)' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FDE047', letterSpacing: '1.5px' }}>॥ ग्राम पंचायत आम चुनाव 2026 • विकास की नई सुबह ॥</div>
          <div style={{ fontSize: '25px', fontWeight: 900, marginTop: '4px' }}>स्वावलंबन • खुशहाली • ईमानदारी से सेवा</div>
        </div>

        {/* Left Photo */}
        <div style={{ position: 'absolute', top: '145px', left: '50px', width: '440px', height: '540px', borderRadius: '28px', border: '6px solid #059669', background: '#064E3B', overflow: 'hidden', boxShadow: '0 16px 36px rgba(4,120,87,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#A7F3D0' }}>
              <span style={{ fontSize: '150px', fontWeight: 900, color: '#FDE047', lineHeight: 1 }}>{initial}</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#D1FAE5', marginTop: '12px' }}>प्रत्याशी फोटो</span>
            </div>
          )}
        </div>

        {/* Right Info Block */}
        <div style={{ position: 'absolute', top: '145px', left: '520px', width: '510px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '1px' }}>॥ आपकी अपनी लोकप्रिय उम्मीदवार ॥</div>
          <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', marginTop: '4px' }}>
            <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#064E3B', lineHeight: 1.15, wordBreak: 'break-word' }}>
              {candidateName || 'उम्मीदवार का नाम'}
            </span>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #047857, #065F46)', borderRadius: '18px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', boxShadow: '0 4px 14px rgba(4,120,87,0.3)' }}>
            <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {position || 'प्रधान प्रत्याशी'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: 1, background: '#FFFFFF', border: '3px solid #047857', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>वार्ड नंबर / WARD</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#064E3B', lineHeight: 1, marginTop: '2px' }}>{wardNo.trim() || '—'}</div>
            </div>
            <div style={{ flex: 1, background: '#FEF3C7', border: '3px solid #D97706', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(217,119,6,0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>क्रमांक / BALLOT</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#92400E', lineHeight: 1, marginTop: '2px' }}>{ballotNo.trim() || '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: '16px', background: '#FFFFFF', border: '3px solid #059669', borderRadius: '20px', height: '125px', display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '14px', boxShadow: '0 6px 16px rgba(5,150,105,0.15)' }}>
            <div style={{ width: '96px', height: '96px', background: '#ECFDF5', border: '2px solid #A7F3D0', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {symbolUrl ? (
                <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
              ) : (
                <span style={{ fontSize: '70px', lineHeight: 1 }}>🌾</span>
              )}
            </div>
            <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>चुनाव चिह्न / ELECTION SYMBOL</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#064E3B', marginTop: '2px', wordBreak: 'break-word' }}>{symbolName || 'चुनाव चिह्न'}</div>
            </div>
          </div>
        </div>

        {/* Slogan Box */}
        <div style={{ position: 'absolute', top: '710px', left: '50px', width: '980px', height: '150px', background: '#ECFDF5', border: '2px solid #A7F3D0', borderLeft: '8px solid #047857', borderRadius: '20px', padding: '16px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 14px rgba(4,120,87,0.08)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>🌾 विकास का संकल्प पत्र</div>
          <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#064E3B', lineHeight: 1.35, wordBreak: 'break-word', fontStyle: 'italic' }}>
            "{effectiveSlogan}"
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{ position: 'absolute', top: '880px', left: '50px', width: '980px', height: '200px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          <div style={{ background: '#FFFFFF', border: '2px solid #D1FAE5', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>💧</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B', marginBottom: '4px' }}>सिंचाई एवं पेयजल</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#047857', lineHeight: 1.3 }}>नहरों की सफाई, ट्यूबवेल और हर घर नल जल योजना</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #D1FAE5', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>👩‍🌾</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B', marginBottom: '4px' }}>महिला समूह प्रोत्साहन</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#047857', lineHeight: 1.3 }}>स्वयं सहायता समूहों को ऋण एवं स्वरोजगार के अवसर</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #D1FAE5', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🏥</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B', marginBottom: '4px' }}>स्वास्थ्य एवं शिक्षा</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#047857', lineHeight: 1.3 }}>प्राथमिक स्वास्थ्य केंद्र में डॉक्टर एवं स्कूलों का कायाकल्प</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', top: '1100px', left: '50px', width: '980px', height: '115px', background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxShadow: '0 8px 24px rgba(6,78,59,0.25)' }}>
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: '23px', fontWeight: 900, color: '#FDE047' }}>चुनाव चिह्न पर मोहर लगाकर अपनी बहन/बेटी को विजयी बनाएं!</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#A7F3D0', marginTop: '2px' }}>निवेदक: समस्त मातृशक्ति एवं ग्राम पंचायत वासी</div>
          </div>
          {contactNumber.trim() ? (
            <div style={{ background: '#047857', borderRadius: '14px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontSize: '20px', fontWeight: 800 }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
EmeraldGramVikasTemplate.displayName = 'EmeraldGramVikasTemplate';

// 4. Tricolor Rashtriya Gaurav (1080x1350)
export const TricolorRashtriyaGauravTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 52, 20, 490, 130);
    const posFontSize = useAutoShrink(position, posRef, 32, 18, 470, 55);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 28, 16, 920, 90);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'राष्ट्रहित सर्वोपरि • सेवा, समर्पण और सशक्त ग्राम विकास का संकल्प!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1350px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1350px', background: '#FFFFFF' }} />

        {/* Top Tricolor Strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '18px', background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%, #138808 100%)' }} />

        {/* Header Badge */}
        <div style={{ position: 'absolute', top: '32px', left: '50px', width: '980px', height: '60px', background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(30,58,138,0.25)' }}>
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#FBBF24', letterSpacing: '1px' }}>॥ राष्ट्र सेवा • सामाजिक न्याय • विकसित भारत का संकल्प ॥</span>
        </div>

        {/* Left Info Block */}
        <div style={{ position: 'absolute', top: '110px', left: '50px', width: '510px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>॥ आपका निष्ठावान प्रतिनिधि ॥</div>
          <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', marginTop: '4px' }}>
            <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#EA580C', lineHeight: 1.15, wordBreak: 'break-word' }}>
              {candidateName || 'उम्मीदवार का नाम'}
            </span>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)', borderRadius: '18px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', boxShadow: '0 4px 14px rgba(21,128,61,0.25)' }}>
            <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {position || 'जिला परिषद सदस्य'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: 1, background: '#FFF7ED', border: '3px solid #EA580C', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(234,88,12,0.12)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase' }}>वार्ड नंबर / WARD</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#9A3412', lineHeight: 1, marginTop: '2px' }}>{wardNo.trim() || '—'}</div>
            </div>
            <div style={{ flex: 1, background: '#F0FDF4', border: '3px solid #15803D', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(21,128,61,0.12)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>क्रमांक / BALLOT</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#166534', lineHeight: 1, marginTop: '2px' }}>{ballotNo.trim() || '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: '16px', background: '#FFFFFF', border: '3px solid #1E3A8A', borderRadius: '20px', height: '130px', display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '14px', boxShadow: '0 6px 16px rgba(30,58,138,0.15)' }}>
            <div style={{ width: '96px', height: '96px', background: '#EFF6FF', border: '2px solid #93C5FD', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {symbolUrl ? (
                <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
              ) : (
                <span style={{ fontSize: '70px', lineHeight: 1 }}>🦁</span>
              )}
            </div>
            <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E3A8A', textTransform: 'uppercase' }}>चुनाव चिह्न / ELECTION SYMBOL</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginTop: '2px', wordBreak: 'break-word' }}>{symbolName || 'चुनाव चिह्न'}</div>
            </div>
          </div>
        </div>

        {/* Right Photo Box */}
        <div style={{ position: 'absolute', top: '110px', left: '590px', width: '440px', height: '560px', borderRadius: '28px', border: '6px solid #FF9933', background: '#0F172A', overflow: 'hidden', boxShadow: '0 16px 36px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#FFFFFF' }}>
              <span style={{ fontSize: '150px', fontWeight: 900, lineHeight: 1 }}>{initial}</span>
              <span style={{ fontSize: '18px', fontWeight: 800, marginTop: '12px' }}>प्रत्याशी फोटो</span>
            </div>
          )}
        </div>

        {/* Slogan Box */}
        <div style={{ position: 'absolute', top: '690px', left: '50px', width: '980px', height: '150px', background: '#FFF7ED', border: '2px solid #FDBA74', borderLeft: '8px solid #EA580C', borderRadius: '20px', padding: '16px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 14px rgba(234,88,12,0.08)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>🇮🇳 राष्ट्रहित एवं ग्राम गौरव संकल्प</div>
          <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#1E293B', lineHeight: 1.35, wordBreak: 'break-word', fontStyle: 'italic' }}>
            "{effectiveSlogan}"
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{ position: 'absolute', top: '860px', left: '50px', width: '980px', height: '210px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🇮🇳</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#EA580C', marginBottom: '4px' }}>राष्ट्र व समाज सेवा</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>सैनिक परिवारों, किसानों और निर्धनों के सम्मान हेतु तत्पर</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🛣️</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E3A8A', marginBottom: '4px' }}>मजबूत इंफ्रास्ट्रक्चर</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>हाईवे कनेक्टिविटी, पक्की नालियां व आधुनिक सोलर लाइट</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>⚖️</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803D', marginBottom: '4px' }}>सच्चा नेतृत्व</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>बिना रिश्वत, बिना पक्षपात हर नागरिक के काम की गारंटी</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', top: '1090px', left: '50px', width: '980px', height: '115px', background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxShadow: '0 8px 24px rgba(30,58,138,0.25)' }}>
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: '23px', fontWeight: 900, color: '#FBBF24' }}>चुनाव निशान पर मोहर लगाकर राष्ट्रवादी प्रत्याशी को विजयी बनाएं!</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#93C5FD', marginTop: '2px' }}>निवेदक: समस्त क्षेत्रवासी एवं चुनाव संचालन समिति</div>
          </div>
          {contactNumber.trim() ? (
            <div style={{ background: '#EA580C', borderRadius: '14px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontSize: '20px', fontWeight: 800 }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
TricolorRashtriyaGauravTemplate.displayName = 'TricolorRashtriyaGauravTemplate';

// 5. Royal Purple Elite Poster (1080x1350)
export const RoyalPurpleEliteTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 52, 20, 490, 130);
    const posFontSize = useAutoShrink(position, posRef, 32, 18, 470, 55);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 28, 16, 920, 90);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'स्मार्ट वार्ड, सुरक्षित परिवार • शिक्षित एवं कानूनविद् नेतृत्व की पुकार!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1350px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1350px', background: '#FAF5FF' }} />

        {/* Top Header */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '115px', background: 'linear-gradient(135deg, #3B0764 0%, #581C87 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 6px 20px rgba(59,7,100,0.3)' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FDE047', letterSpacing: '2px', textTransform: 'uppercase' }}>॥ नगर निकाय आम चुनाव 2026 ॥</div>
          <div style={{ fontSize: '25px', fontWeight: 900, marginTop: '4px' }}>शिक्षित • जुझारू • कानूनविद नेतृत्व को चुनें</div>
        </div>

        {/* Left Photo */}
        <div style={{ position: 'absolute', top: '145px', left: '50px', width: '440px', height: '540px', borderRadius: '28px', border: '6px solid #7C3AED', background: '#3B0764', overflow: 'hidden', boxShadow: '0 16px 36px rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#E9D5FF' }}>
              <span style={{ fontSize: '150px', fontWeight: 900, color: '#FDE047', lineHeight: 1 }}>{initial}</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#F3E8FF', marginTop: '12px' }}>प्रत्याशी फोटो</span>
            </div>
          )}
        </div>

        {/* Right Info Block */}
        <div style={{ position: 'absolute', top: '145px', left: '520px', width: '510px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '1px' }}>॥ आपका अपना सेवक ॥</div>
          <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', marginTop: '4px' }}>
            <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#4C1D95', lineHeight: 1.15, wordBreak: 'break-word' }}>
              {candidateName || 'उम्मीदवार का नाम'}
            </span>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)', borderRadius: '18px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', boxShadow: '0 4px 14px rgba(109,40,217,0.3)' }}>
            <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {position || 'नगर परिषद पार्षद'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: 1, background: '#FFFFFF', border: '3px solid #7C3AED', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase' }}>वार्ड नंबर / WARD</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#4C1D95', lineHeight: 1, marginTop: '2px' }}>{wardNo.trim() || '—'}</div>
            </div>
            <div style={{ flex: 1, background: '#FEF3C7', border: '3px solid #D97706', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(217,119,6,0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>क्रमांक / BALLOT</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#92400E', lineHeight: 1, marginTop: '2px' }}>{ballotNo.trim() || '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: '16px', background: '#FFFFFF', border: '3px solid #7C3AED', borderRadius: '20px', height: '125px', display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '14px', boxShadow: '0 6px 16px rgba(124,58,237,0.15)' }}>
            <div style={{ width: '96px', height: '96px', background: '#F3E8FF', border: '2px solid #D8B4FE', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {symbolUrl ? (
                <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
              ) : (
                <span style={{ fontSize: '70px', lineHeight: 1 }}>⚖️</span>
              )}
            </div>
            <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase' }}>चुनाव चिह्न / ELECTION SYMBOL</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#3B0764', marginTop: '2px', wordBreak: 'break-word' }}>{symbolName || 'चुनाव चिह्न'}</div>
            </div>
          </div>
        </div>

        {/* Slogan Box */}
        <div style={{ position: 'absolute', top: '710px', left: '50px', width: '980px', height: '150px', background: '#F3E8FF', border: '2px solid #D8B4FE', borderLeft: '8px solid #7C3AED', borderRadius: '20px', padding: '16px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 14px rgba(124,58,237,0.08)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#6D28D9', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>✨ चुनावी संकल्प एवं दूरदृष्टि</div>
          <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#3B0764', lineHeight: 1.35, wordBreak: 'break-word', fontStyle: 'italic' }}>
            "{effectiveSlogan}"
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{ position: 'absolute', top: '880px', left: '50px', width: '980px', height: '200px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          <div style={{ background: '#FFFFFF', border: '2px solid #E9D5FF', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>⚖️</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#4C1D95', marginBottom: '4px' }}>कानूनी सहायता</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6B21A8', lineHeight: 1.3 }}>गरीबों के लिए निःशुल्क कानूनी सलाह एवं सरकारी योजनाओं का लाभ</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E9D5FF', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🏙️</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#4C1D95', marginBottom: '4px' }}>स्मार्ट वार्ड विकास</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6B21A8', lineHeight: 1.3 }}>नियमित सफाई, सीवर लाइन, सुंदर पार्क एवं स्ट्रीट लाइट्स</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E9D5FF', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>📱</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#4C1D95', marginBottom: '4px' }}>डिजिटल शिकायत केंद्र</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6B21A8', lineHeight: 1.3 }}>घर बैठे वार्ड की समस्याओं को दर्ज और ट्रैक करने की व्यवस्था</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', top: '1100px', left: '50px', width: '980px', height: '115px', background: 'linear-gradient(135deg, #3B0764 0%, #581C87 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxShadow: '0 8px 24px rgba(59,7,100,0.25)' }}>
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: '23px', fontWeight: 900, color: '#FDE047' }}>चुनाव निशान पर मोहर लगाकर भारी बहुमत से विजयी बनाएं!</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#D8B4FE', marginTop: '2px' }}>निवेदक: समस्त वार्डवासी एवं युवा कल्याण समिति</div>
          </div>
          {contactNumber.trim() ? (
            <div style={{ background: '#F59E0B', borderRadius: '14px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A', fontSize: '20px', fontWeight: 900 }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
RoyalPurpleEliteTemplate.displayName = 'RoyalPurpleEliteTemplate';

// 6. Maroon Heritage Sarpanch (1080x1350)
export const MaroonHeritageTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 52, 20, 490, 130);
    const posFontSize = useAutoShrink(position, posRef, 32, 18, 470, 55);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 28, 16, 920, 90);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'परंपरा, प्रतिष्ठा और निष्पक्ष न्याय • ग्राम पंचायत का सर्वांगीण उत्थान!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1350px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1350px', background: '#FFFBEB' }} />
        <div style={{ position: 'absolute', top: '15px', left: '15px', width: '1050px', height: '1320px', border: '3px solid #881337', borderRadius: '24px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '22px', left: '22px', width: '1036px', height: '1306px', border: '1px dashed #D97706', borderRadius: '18px', pointerEvents: 'none' }} />

        {/* Top Header */}
        <div style={{ position: 'absolute', top: '35px', left: '45px', width: '990px', height: '80px', background: 'linear-gradient(135deg, #881337 0%, #4C0519 100%)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 6px 18px rgba(136,19,55,0.3)' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FDE047', letterSpacing: '1px' }}>॥ ग्राम पंचायत आम चुनाव 2026 • निष्पक्ष व अनुभवी नेतृत्व ॥</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FCE7F3', marginTop: '2px' }}>सबका साथ • सबका विकास • सबका विश्वास</div>
        </div>

        {/* Left Photo Box */}
        <div style={{ position: 'absolute', top: '135px', left: '50px', width: '440px', height: '540px', borderRadius: '28px', border: '6px solid #881337', background: '#4C0519', overflow: 'hidden', boxShadow: '0 16px 36px rgba(136,19,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#FCE7F3' }}>
              <span style={{ fontSize: '150px', fontWeight: 900, color: '#FDE047', lineHeight: 1 }}>{initial}</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FBCFE8', marginTop: '12px' }}>प्रत्याशी फोटो</span>
            </div>
          )}
        </div>

        {/* Right Info Block */}
        <div style={{ position: 'absolute', top: '135px', left: '520px', width: '510px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#881337', textTransform: 'uppercase', letterSpacing: '1px' }}>॥ ग्रामवासियों के भरोसेमंद साथी ॥</div>
          <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', marginTop: '4px' }}>
            <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#881337', lineHeight: 1.15, wordBreak: 'break-word' }}>
              {candidateName || 'उम्मीदवार का नाम'}
            </span>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #881337 0%, #701A75 100%)', borderRadius: '18px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', boxShadow: '0 4px 14px rgba(136,19,55,0.3)' }}>
            <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 800, color: '#FDE047', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {position || 'सरपंच पद के प्रबल दावेदार'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: 1, background: '#FFFFFF', border: '3px solid #881337', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#881337', textTransform: 'uppercase' }}>वार्ड नंबर / WARD</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#881337', lineHeight: 1, marginTop: '2px' }}>{wardNo.trim() || '—'}</div>
            </div>
            <div style={{ flex: 1, background: '#FEF3C7', border: '3px solid #D97706', borderRadius: '18px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(217,119,6,0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>क्रमांक / BALLOT</div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#92400E', lineHeight: 1, marginTop: '2px' }}>{ballotNo.trim() || '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: '16px', background: '#FFFFFF', border: '3px solid #881337', borderRadius: '20px', height: '125px', display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '14px', boxShadow: '0 6px 16px rgba(136,19,55,0.15)' }}>
            <div style={{ width: '96px', height: '96px', background: '#FFF1F2', border: '2px solid #FDA4AF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {symbolUrl ? (
                <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
              ) : (
                <span style={{ fontSize: '70px', lineHeight: 1 }}>🪓</span>
              )}
            </div>
            <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#881337', textTransform: 'uppercase' }}>चुनाव चिह्न / ELECTION SYMBOL</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginTop: '2px', wordBreak: 'break-word' }}>{symbolName || 'चुनाव चिह्न'}</div>
            </div>
          </div>
        </div>

        {/* Slogan Box */}
        <div style={{ position: 'absolute', top: '700px', left: '50px', width: '980px', height: '150px', background: '#FFFFFF', border: '2px solid #FBCFE8', borderLeft: '8px solid #881337', borderRadius: '20px', padding: '16px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 14px rgba(136,19,55,0.08)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#881337', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>⚜️ सेवा और समर्पण का संकल्प</div>
          <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#4C0519', lineHeight: 1.35, wordBreak: 'break-word', fontStyle: 'italic' }}>
            "{effectiveSlogan}"
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{ position: 'absolute', top: '870px', left: '50px', width: '980px', height: '200px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🤝</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#881337', marginBottom: '4px' }}>पारस्परिक सद्भाव</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#701A75', lineHeight: 1.3 }}>आपसी भाईचारा, पंचायती विवादों का निष्पक्ष व शांतिपूर्ण निपटारा</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>🚜</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#881337', marginBottom: '4px' }}>किसान खुशहाली</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#701A75', lineHeight: 1.3 }}>खाद, बीज, बिजली एवं कृषि उपकरणों की सुलभ उपलब्धता</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '36px', lineHeight: 1, marginBottom: '6px' }}>👵</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#881337', marginBottom: '4px' }}>बुजुर्ग सम्मान</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#701A75', lineHeight: 1.3 }}>पेंशन, स्वास्थ्य जांच एवं सामाजिक सुरक्षा का विशेष प्रबंध</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', top: '1090px', left: '50px', width: '980px', height: '115px', background: 'linear-gradient(135deg, #881337 0%, #4C0519 100%)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxShadow: '0 8px 24px rgba(136,19,55,0.25)' }}>
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: '23px', fontWeight: 900, color: '#FDE047' }}>चुनाव निशान पर मोहर लगाकर अनुभवी नेतृत्व को विजयी बनाएं!</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#FCE7F3', marginTop: '2px' }}>निवेदक: समस्त ग्रामवासी एवं वरिष्ठ नागरिक मंडल</div>
          </div>
          {contactNumber.trim() ? (
            <div style={{ background: '#D97706', borderRadius: '14px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
MaroonHeritageTemplate.displayName = 'MaroonHeritageTemplate';

// 7. WhatsApp Status Story Card (1080x1920)
export const WhatsAppStatusTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 60, 24, 920, 140);
    const posFontSize = useAutoShrink(position, posRef, 36, 20, 800, 60);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 32, 18, 900, 130);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'आपका एक कीमती वोट बनाएगा हमारे गांव को आदर्श ग्राम पंचायत!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1920px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1920px', background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)' }} />

        {/* Election Header Banner */}
        <div style={{ position: 'absolute', top: '40px', left: '60px', width: '960px', height: '65px', background: 'linear-gradient(90deg, #D97706, #F59E0B, #D97706)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(217,119,6,0.35)' }}>
          <span style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', letterSpacing: '1px' }}>
            ॥ ग्राम पंचायत आम चुनाव 2026 • विजय संकल्प अपील ॥
          </span>
        </div>

        {/* Hero Photo Center Top */}
        <div style={{ position: 'absolute', top: '130px', left: '260px', width: '560px', height: '680px', borderRadius: '36px', border: '8px solid #F59E0B', background: '#0F172A', overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#FBBF24' }}>
              <span style={{ fontSize: '180px', fontWeight: 900, lineHeight: 1 }}>{initial}</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginTop: '16px' }}>प्रत्याशी फोटो</span>
            </div>
          )}
        </div>

        {/* Candidate Info */}
        <div style={{ position: 'absolute', top: '840px', left: '60px', width: '960px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#CBD5E1', letterSpacing: '2px', textTransform: 'uppercase' }}>॥ आपका अपना प्रत्याशी ॥</div>
          <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 16px', marginTop: '6px' }}>
            <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#FBBF24', lineHeight: 1.15, wordBreak: 'break-word', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              {candidateName || 'उम्मीदवार का नाम'}
            </span>
          </div>

          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: '24px', padding: '12px 36px', boxShadow: '0 6px 18px rgba(5,150,105,0.4)', marginTop: '6px', maxWidth: '850px' }}>
            <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {position || 'सरपंच पद हेतु'}
            </span>
          </div>
        </div>

        {/* Ward & Ballot & Symbol */}
        <div style={{ position: 'absolute', top: '1140px', left: '60px', width: '960px', display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '24px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>वार्ड नंबर / WARD</div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, marginTop: '6px' }}>{wardNo.trim() || '—'}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(245,158,11,0.12)', border: '2px solid #F59E0B', borderRadius: '24px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>क्रमांक / BALLOT</div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#FBBF24', lineHeight: 1, marginTop: '6px' }}>{ballotNo.trim() || '—'}</div>
          </div>
          <div style={{ flex: 1.4, background: '#FFFFFF', border: '3px solid #F59E0B', borderRadius: '24px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '110px', height: '110px', background: '#FEF3C7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {symbolUrl ? (
                <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
              ) : (
                <span style={{ fontSize: '90px', lineHeight: 1 }}>🛺</span>
              )}
            </div>
            <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>चुनाव चिह्न</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', wordBreak: 'break-word' }}>{symbolName || 'चुनाव चिह्न'}</div>
            </div>
          </div>
        </div>

        {/* Slogan Box */}
        <div style={{ position: 'absolute', top: '1390px', left: '60px', width: '960px', height: '200px', background: 'rgba(255,255,255,0.05)', border: '2px solid #F59E0B', borderRadius: '26px', padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>📌 चुनावी संकल्प संदेश</div>
          <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.4, wordBreak: 'break-word', fontStyle: 'italic' }}>
            "{effectiveSlogan}"
          </div>
        </div>

        {/* Bottom Appeal */}
        <div style={{ position: 'absolute', top: '1620px', left: '60px', width: '960px', height: '240px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', borderRadius: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', boxShadow: '0 12px 36px rgba(217,119,6,0.35)' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '0.5px' }}>चुनाव निशान पर बटन दबाकर भारी मतों से विजयी बनाएं!</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#451A03', marginTop: '6px' }}>निवेदक: समस्त ग्रामवासी एवं युवा मित्र मंडल</div>
          {contactNumber.trim() ? (
            <div style={{ background: '#D97706', borderRadius: '18px', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '26px', fontWeight: 900, marginTop: '20px', boxShadow: '0 6px 18px rgba(217,119,6,0.4)' }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
WhatsAppStatusTemplate.displayName = 'WhatsAppStatusTemplate';

// 8. Square Social Post (1080x1080)
export const SquareSocialPostTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 48, 18, 570, 110);
    const posFontSize = useAutoShrink(position, posRef, 28, 16, 550, 48);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 24, 15, 950, 80);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'स्वच्छ वार्ड, सुंदर वार्ड • हर नागरिक को मिले पूरा अधिकार!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1080px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1080px', background: '#FFFFFF' }} />

        {/* Top Header */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '95px', background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', color: '#FFFFFF', boxShadow: '0 4px 16px rgba(15,118,110,0.25)' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FDE047', letterSpacing: '1px' }}>॥ नगर पालिका / पंचायत चुनाव 2026 ॥</div>
            <div style={{ fontSize: '22px', fontWeight: 900, marginTop: '2px' }}>वार्ड विकास महा-अभियान</div>
          </div>
          <div style={{ background: '#FFFFFF', color: '#0F766E', padding: '6px 14px', borderRadius: '16px', fontSize: '14px', fontWeight: 900 }}>
            ★ VOTE & SUPPORT ★
          </div>
        </div>

        {/* Left Photo */}
        <div style={{ position: 'absolute', top: '115px', left: '40px', width: '380px', height: '480px', borderRadius: '24px', border: '5px solid #0D9488', background: '#0F172A', overflow: 'hidden', boxShadow: '0 12px 28px rgba(13,148,136,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CCFBF1' }}>
              <span style={{ fontSize: '130px', fontWeight: 900, color: '#FDE047', lineHeight: 1 }}>{initial}</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '10px' }}>प्रत्याशी फोटो</span>
            </div>
          )}
        </div>

        {/* Right Info Block */}
        <div style={{ position: 'absolute', top: '115px', left: '445px', width: '595px', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '1px' }}>॥ आपका अपना कर्मठ प्रत्याशी ॥</div>
          <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', marginTop: '2px' }}>
            <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#0F766E', lineHeight: 1.15, wordBreak: 'break-word' }}>
              {candidateName || 'उम्मीदवार का नाम'}
            </span>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)', borderRadius: '16px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', boxShadow: '0 4px 12px rgba(15,118,110,0.25)' }}>
            <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {position || 'वार्ड पार्षद प्रत्याशी'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '14px' }}>
            <div style={{ flex: 1, background: '#F0FDFA', border: '2.5px solid #0D9488', borderRadius: '16px', padding: '6px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase' }}>वार्ड नंबर</div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#0F766E', lineHeight: 1, marginTop: '2px' }}>{wardNo.trim() || '—'}</div>
            </div>
            <div style={{ flex: 1, background: '#FEF3C7', border: '2.5px solid #D97706', borderRadius: '16px', padding: '6px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>क्रमांक / BALLOT</div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#92400E', lineHeight: 1, marginTop: '2px' }}>{ballotNo.trim() || '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: '14px', background: '#FFFFFF', border: '2.5px solid #0D9488', borderRadius: '18px', height: '110px', display: 'flex', alignItems: 'center', padding: '6px 14px', gap: '12px', boxShadow: '0 4px 12px rgba(13,148,136,0.12)' }}>
            <div style={{ width: '85px', height: '85px', background: '#F0FDFA', border: '1.5px solid #99F6E4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {symbolUrl ? (
                <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
              ) : (
                <span style={{ fontSize: '65px', lineHeight: 1 }}>🪁</span>
              )}
            </div>
            <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase' }}>चुनाव चिह्न</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', wordBreak: 'break-word' }}>{symbolName || 'चुनाव चिह्न'}</div>
            </div>
          </div>
        </div>

        {/* Slogan Box */}
        <div style={{ position: 'absolute', top: '620px', left: '40px', width: '1000px', height: '130px', background: '#F0FDFA', border: '2px solid #99F6E4', borderLeft: '8px solid #0D9488', borderRadius: '18px', padding: '12px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 12px rgba(13,148,136,0.08)' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', marginBottom: '4px' }}>🎯 मुख्य चुनावी संकल्प</div>
          <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#134E4A', lineHeight: 1.35, wordBreak: 'break-word', fontStyle: 'italic' }}>
            "{effectiveSlogan}"
          </div>
        </div>

        {/* 3 Quick Pillars */}
        <div style={{ position: 'absolute', top: '770px', left: '40px', width: '1000px', height: '160px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '16px', padding: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '30px', lineHeight: 1, marginBottom: '4px' }}>💡</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F766E', marginBottom: '2px' }}>प्रकाश एवं सुरक्षा</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>हर गली में एलईडी लाइट एवं निगरानी व्यवस्था</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '16px', padding: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '30px', lineHeight: 1, marginBottom: '4px' }}>🚰</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F766E', marginBottom: '2px' }}>स्वच्छ पेयजल</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>नियमित जलापूर्ति एवं वाटर प्यूरीफायर प्लांट</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '16px', padding: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '30px', lineHeight: 1, marginBottom: '4px' }}>🧹</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F766E', marginBottom: '2px' }}>कचरा मुक्त वार्ड</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>डोर-टू-डोर कूड़ा कलेक्शन एवं नियमित सफाई</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', top: '950px', left: '40px', width: '1000px', height: '95px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', boxShadow: '0 6px 18px rgba(15,23,42,0.2)' }}>
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#FDE047' }}>चुनाव निशान के सामने मोहर लगाकर विजयी बनाएं!</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginTop: '2px' }}>निवेदक: समस्त क्षेत्रवासी एवं युवा कार्यकर्ता</div>
          </div>
          {contactNumber.trim() ? (
            <div style={{ background: '#0D9488', borderRadius: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#FFFFFF', fontSize: '18px', fontWeight: 800 }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
SquareSocialPostTemplate.displayName = 'SquareSocialPostTemplate';

// 9. Grand Victory Hoarding (1920x1080)
export const GrandVictoryHoardingTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 64, 26, 840, 140);
    const posFontSize = useAutoShrink(position, posRef, 36, 20, 780, 60);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 28, 16, 800, 80);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'मजबूत नेतृत्व, भव्य विकास • क्षेत्र के समग्र उत्थान के लिए आपका एक वोट!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1920px',
          height: '1080px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1920px', height: '1080px', background: 'linear-gradient(135deg, #0A192F 0%, #0F172A 50%, #1E293B 100%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1920px', height: '16px', background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%, #138808 100%)' }} />

        {/* Left Column: Symbol & Badges */}
        <div style={{ position: 'absolute', top: '60px', left: '60px', width: '380px', textAlign: 'center' }}>
          <div style={{ background: '#FFFFFF', border: '4px solid #F59E0B', borderRadius: '28px', padding: '24px 20px', boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '1px' }}>चुनाव चिह्न / ELECTION SYMBOL</div>
            <div style={{ width: '200px', height: '200px', background: '#FEF3C7', border: '3px solid #FDE68A', borderRadius: '24px', margin: '16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {symbolUrl ? (
                <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
              ) : (
                <span style={{ fontSize: '100px', lineHeight: 1 }}>🚀</span>
              )}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>{symbolName || 'चुनाव चिह्न'}</div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <div style={{ flex: 1, background: '#FFFFFF', border: '3px solid #0F172A', borderRadius: '22px', padding: '16px 8px', textAlign: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#64748B' }}>वार्ड नंबर</div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#0F172A', lineHeight: 1, marginTop: '4px' }}>{wardNo.trim() || '—'}</div>
            </div>
            <div style={{ flex: 1, background: '#FEF3C7', border: '3px solid #D97706', borderRadius: '22px', padding: '16px 8px', textAlign: 'center', boxShadow: '0 6px 18px rgba(217,119,6,0.3)' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#B45309' }}>क्रमांक</div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#92400E', lineHeight: 1, marginTop: '4px' }}>{ballotNo.trim() || '—'}</div>
            </div>
          </div>
        </div>

        {/* Center Column: Main Message & Details */}
        <div style={{ position: 'absolute', top: '60px', left: '480px', width: '860px' }}>
          <div style={{ background: 'linear-gradient(90deg, #D97706, #F59E0B)', borderRadius: '20px', padding: '10px 24px', display: 'inline-block', boxShadow: '0 4px 14px rgba(217,119,6,0.4)' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', letterSpacing: '1px' }}>॥ भव्य चुनावी महा-प्रचार 2026 • विजय संकल्प ॥</span>
          </div>

          <div style={{ fontSize: '24px', fontWeight: 800, color: '#CBD5E1', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '16px' }}>
            सर्व समाज के प्रिय एवं जुझारू उम्मीदवार
          </div>

          <div style={{ height: '150px', display: 'flex', alignItems: 'center', padding: '4px 0', marginTop: '8px' }}>
            <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#FBBF24', lineHeight: 1.15, wordBreak: 'break-word', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              {candidateName || 'उम्मीदवार का नाम'}
            </span>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', borderRadius: '22px', height: '70px', display: 'flex', alignItems: 'center', padding: '0 24px', boxShadow: '0 6px 18px rgba(30,58,138,0.4)', maxWidth: '800px' }}>
            <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, wordBreak: 'break-word' }}>
              {position || 'विधायक / सांसद / प्रधान पद के उम्मीदवार'}
            </span>
          </div>

          <div style={{ marginTop: '24px', background: '#0A192F', border: '2px solid #D97706', borderRadius: '22px', padding: '18px 28px', boxShadow: '0 6px 20px rgba(0,0,0,0.3)', maxWidth: '820px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', marginBottom: '6px' }}>🎯 विकास का संकल्प</div>
            <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.35, wordBreak: 'break-word', fontStyle: 'italic' }}>
              "{effectiveSlogan}"
            </div>
          </div>
        </div>

        {/* Right Column: Massive Photo */}
        <div style={{ position: 'absolute', top: '60px', left: '1380px', width: '480px', height: '850px', borderRadius: '36px', border: '8px solid #F59E0B', background: '#0F172A', overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#FBBF24' }}>
              <span style={{ fontSize: '180px', fontWeight: 900, lineHeight: 1 }}>{initial}</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginTop: '16px' }}>प्रत्याशी फोटो</span>
            </div>
          )}
        </div>

        {/* Full-Width Footer */}
        <div style={{ position: 'absolute', top: '940px', left: '60px', width: '1800px', height: '110px', background: 'linear-gradient(135deg, #0A192F 0%, #1E293B 100%)', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}>
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: '30px', fontWeight: 900, color: '#FBBF24', letterSpacing: '0.5px' }}>चुनाव निशान पर मोहर लगाकर ऐतिहासिक मतों से विजयी बनाएं!</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#94A3B8', marginTop: '2px' }}>निवेदक: समस्त क्षेत्रवासी, युवा मोर्चा एवं प्रचार समिति</div>
          </div>
          {contactNumber.trim() ? (
            <div style={{ background: '#D97706', borderRadius: '18px', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '28px', fontWeight: 900 }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
GrandVictoryHoardingTemplate.displayName = 'GrandVictoryHoardingTemplate';

// 10. Gram Vikas Sankalp Patrika (1080x1528)
export const GramVikasSankalpPatrikaTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      candidateName,
      position,
      wardNo = '',
      ballotNo = '',
      slogan = '',
      contactNumber = '',
      photoUrl = null,
      symbolUrl = null,
      symbolName = 'चुनाव चिह्न',
      className = '',
      style = {},
      scale,
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const nameFontSize = useAutoShrink(candidateName, nameRef, 48, 18, 560, 115);
    const posFontSize = useAutoShrink(position, posRef, 30, 16, 540, 50);
    const sloganFontSize = useAutoShrink(slogan, sloganRef, 26, 15, 960, 80);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'ईमानदार सोच, सशक्त ग्राम पंचायत • 7 सूत्रीय विकास घोषणा पत्र!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1528px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1528px', background: '#F8FAFC' }} />
        <div style={{ position: 'absolute', top: '15px', left: '15px', width: '1050px', height: '1498px', border: '3px solid #065F46', borderRadius: '24px', pointerEvents: 'none' }} />

        {/* Top Header */}
        <div style={{ position: 'absolute', top: '30px', left: '40px', width: '1000px', height: '110px', background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 6px 18px rgba(6,95,70,0.3)' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FDE047', letterSpacing: '1.5px' }}>॥ श्री गणेशाय नमः • ग्राम पंचायत आम चुनाव 2026 ॥</div>
          <div style={{ fontSize: '26px', fontWeight: 900, marginTop: '4px' }}>ग्राम विकास संकल्प एवं घोषणा-पत्र</div>
        </div>

        {/* Photo & Candidate Details Grid */}
        <div style={{ position: 'absolute', top: '160px', left: '40px', width: '1000px', display: 'flex', gap: '24px' }}>
          <div style={{ width: '400px', height: '480px', borderRadius: '24px', border: '5px solid #059669', background: '#0F172A', overflow: 'hidden', boxShadow: '0 12px 28px rgba(5,150,105,0.25)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {photoUrl ? (
              <img src={photoUrl} alt="Candidate" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#A7F3D0' }}>
                <span style={{ fontSize: '140px', fontWeight: 900, color: '#FDE047', lineHeight: 1 }}>{initial}</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '12px' }}>प्रत्याशी फोटो</span>
              </div>
            )}
          </div>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '1px' }}>॥ आपका अपना सेवक व प्रत्याशी ॥</div>
            <div style={{ height: '125px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', marginTop: '4px' }}>
              <span ref={nameRef} style={{ fontSize: `${nameFontSize}px`, fontWeight: 900, color: '#065F46', lineHeight: 1.15, wordBreak: 'break-word' }}>
                {candidateName || 'उम्मीदवार का नाम'}
              </span>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #047857 0%, #064E3B 100%)', borderRadius: '18px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', boxShadow: '0 4px 12px rgba(4,120,87,0.25)' }}>
              <span ref={posRef} style={{ fontSize: `${posFontSize}px`, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, wordBreak: 'break-word' }}>
                {position || 'सरपंच पद के अधिकृत प्रत्याशी'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '14px' }}>
              <div style={{ flex: 1, background: '#FFFFFF', border: '2.5px solid #065F46', borderRadius: '16px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>वार्ड नंबर</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#065F46', lineHeight: 1, marginTop: '2px' }}>{wardNo.trim() || '—'}</div>
              </div>
              <div style={{ flex: 1, background: '#FEF3C7', border: '2.5px solid #D97706', borderRadius: '16px', padding: '8px 4px', textAlign: 'center', boxShadow: '0 4px 10px rgba(217,119,6,0.15)' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>क्रमांक / BALLOT</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#92400E', lineHeight: 1, marginTop: '2px' }}>{ballotNo.trim() || '—'}</div>
              </div>
            </div>

            <div style={{ marginTop: '14px', background: '#FFFFFF', border: '3px solid #D97706', borderRadius: '18px', height: '115px', display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '12px', boxShadow: '0 4px 12px rgba(217,119,6,0.15)' }}>
              <div style={{ width: '85px', height: '85px', background: '#FEF3C7', border: '2px solid #FDE68A', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {symbolUrl ? (
                  <img src={symbolUrl} alt="Symbol" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                ) : (
                  <span style={{ fontSize: '70px', lineHeight: 1 }}>🌺</span>
                )}
              </div>
              <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>चुनाव चिह्न / SYMBOL</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', wordBreak: 'break-word' }}>{symbolName || 'चुनाव चिह्न'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slogan Box */}
        <div style={{ position: 'absolute', top: '660px', left: '40px', width: '1000px', height: '130px', background: '#ECFDF5', border: '2px solid #A7F3D0', borderLeft: '8px solid #065F46', borderRadius: '18px', padding: '14px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 12px rgba(6,95,70,0.08)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>📜 संकल्प एवं विचार</div>
          <div ref={sloganRef} style={{ fontSize: `${sloganFontSize}px`, fontWeight: 700, color: '#064E3B', lineHeight: 1.35, wordBreak: 'break-word', fontStyle: 'italic' }}>
            "{effectiveSlogan}"
          </div>
        </div>

        {/* 6-Point Manifesto Grid */}
        <div style={{ position: 'absolute', top: '810px', left: '40px', width: '1000px', background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '24px', padding: '24px 28px', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#065F46', borderBottom: '2px solid #D1FAE5', paddingBottom: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🎯</span><span>हमारा 6-सूत्रीय ऐतिहासिक ग्राम विकास संकल्प</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px' }}>1️⃣</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#065F46' }}>पक्की सड़कें व जलनिकासी</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>हर मोहल्ले में इंटरलॉकिंग व ढकी हुई पक्की नालियां</div>
              </div>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px' }}>2️⃣</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#065F46' }}>24 घंटे शुद्ध पेयजल</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>हर घर नल योजना का 100% क्रियान्वयन व वाटर एटीएम</div>
              </div>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px' }}>3️⃣</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#065F46' }}>युवा लाइब्रेरी व खेल मैदान</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>प्रतियोगी परीक्षाओं हेतु वाई-फाई युक्त आधुनिक ई-लाइब्रेरी</div>
              </div>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px' }}>4️⃣</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#065F46' }}>कृषि व सिंचाई सुविधा</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>खाद, बीज की समय पर उपलब्धता व सरकारी सब्सिडी में मदद</div>
              </div>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px' }}>5️⃣</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#065F46' }}>महिला सुरक्षा व स्वावलंबन</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>स्ट्रीट लाइट, सीसीटीवी व सिलाई-कढ़ाई प्रशिक्षण केंद्र</div>
              </div>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px' }}>6️⃣</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#065F46' }}>पारदर्शी पंचायत प्रशासन</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>ग्राम निधि का पूरा हिसाब एवं भ्रष्टाचार पर शून्य सहनशीलता</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', top: '1375px', left: '40px', width: '1000px', height: '110px', background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxShadow: '0 8px 24px rgba(6,95,70,0.25)' }}>
          <div style={{ color: '#FFFFFF' }}>
            <div style={{ fontSize: '23px', fontWeight: 900, color: '#FDE047' }}>चुनाव निशान पर मोहर लगाकर विकास की नींव मजबूत करें!</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#D1FAE5', marginTop: '2px' }}>निवेदक: समस्त ग्रामवासी एवं पंचायत सुधार समिति</div>
          </div>
          {contactNumber.trim() ? (
            <div style={{ background: '#D97706', borderRadius: '14px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>
              <span>📞</span><span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
GramVikasSankalpPatrikaTemplate.displayName = 'GramVikasSankalpPatrikaTemplate';
