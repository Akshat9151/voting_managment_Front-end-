import React, { forwardRef, useEffect, useRef, useState } from 'react';

export interface PosterTemplateProps {
  candidateName: string;
  position: string;
  wardNo?: string;
  ballotNo?: string;
  slogan?: string;
  contactNumber?: string;
  photoUrl?: string | null;
  symbolUrl?: string | null;
  symbolName?: string;
  className?: string;
  style?: React.CSSProperties;
  scale?: number;
}

export const PosterTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
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
      scale
    },
    ref
  ) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);

    const [nameFontSize, setNameFontSize] = useState(54);
    const [posFontSize, setPosFontSize] = useState(34);
    const [sloganFontSize, setSloganFontSize] = useState(30);

    // Auto-shrink algorithm for Candidate Name
    useEffect(() => {
      let size = 54;
      const maxW = 466;
      const maxH = 148;
      const minSize = 20;

      const el = nameRef.current;
      if (!el) return;

      el.style.fontSize = `${size}px`;
      while (
        size > minSize &&
        (el.offsetWidth > maxW || el.offsetHeight > maxH || el.scrollWidth > maxW || el.scrollHeight > maxH)
      ) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
      setNameFontSize(size);
    }, [candidateName]);

    // Auto-shrink algorithm for Position
    useEffect(() => {
      let size = 34;
      const maxW = 458;
      const maxH = 62;
      const minSize = 18;

      const el = posRef.current;
      if (!el) return;

      el.style.fontSize = `${size}px`;
      while (
        size > minSize &&
        (el.offsetWidth > maxW || el.offsetHeight > maxH || el.scrollWidth > maxW || el.scrollHeight > maxH)
      ) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
      setPosFontSize(size);
    }, [position]);

    // Auto-shrink algorithm for Slogan
    useEffect(() => {
      let size = 30;
      const maxW = 900;
      const maxH = 95;
      const minSize = 16;

      const el = sloganRef.current;
      if (!el) return;

      el.style.fontSize = `${size}px`;
      while (
        size > minSize &&
        (el.offsetWidth > maxW || el.offsetHeight > maxH || el.scrollWidth > maxW || el.scrollHeight > maxH)
      ) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
      setSloganFontSize(size);
    }, [slogan]);

    const initial = (candidateName.trim().charAt(0) || 'उ').toUpperCase();
    const effectiveSlogan = slogan.trim() || 'गांव का समग्र विकास, हर घर विश्वास और खुशहाली!';

    return (
      <div
        ref={ref}
        id="poster-canvas-root"
        className={`relative select-none bg-white text-slate-900 overflow-hidden ${className}`}
        style={{
          width: '1080px',
          height: '1350px',
          fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif",
          transformOrigin: 'top left',
          transform: scale ? `scale(${scale})` : undefined,
          boxSizing: 'border-box',
          ...style
        }}
      >
        {/* Top Tricolor Strip */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1080px',
            height: '16px',
            background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%, #138808 100%)'
          }}
        />

        {/* Top Tagline */}
        <div
          style={{
            position: 'absolute',
            top: '28px',
            left: '60px',
            width: '960px',
            height: '48px',
            background: '#FEF3C7',
            border: '1.5px solid #F59E0B',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 800,
            color: '#92400E',
            letterSpacing: '0.5px'
          }}
        >
          <span>॥ ग्राम पंचायत आम चुनाव 2026 • निष्पक्ष, ईमानदार एवं कर्मठ नेतृत्व ॥</span>
        </div>

        {/* Appeal Banner */}
        <div
          style={{
            position: 'absolute',
            top: '92px',
            left: '60px',
            width: '960px',
            height: '70px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(15, 23, 42, 0.15)'
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>★</span>
            <span>Vote For Victory</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#F8FAFC' }}>
            सर्व समाज के प्रिय एवं विकासशील प्रत्याशी को भारी मतों से विजयी बनाएं
          </div>
        </div>

        {/* Greeting */}
        <div
          style={{
            position: 'absolute',
            top: '190px',
            left: '60px',
            width: '490px',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 700,
            color: '#64748B',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
        >
          ॥ आपका अपना प्रत्याशी ॥
        </div>

        {/* Candidate Name Box */}
        <div
          style={{
            position: 'absolute',
            top: '228px',
            left: '60px',
            width: '490px',
            height: '162px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '6px 12px',
            overflow: 'hidden'
          }}
        >
          <span
            ref={nameRef}
            style={{
              fontSize: `${nameFontSize}px`,
              fontWeight: 900,
              color: '#D97706',
              lineHeight: 1.15,
              wordBreak: 'break-word',
              textShadow: '0 2px 4px rgba(217, 119, 6, 0.12)'
            }}
          >
            {candidateName || 'उम्मीदवार का नाम'}
          </span>
        </div>

        {/* Position Pill */}
        <div
          style={{
            position: 'absolute',
            top: '405px',
            left: '60px',
            width: '490px',
            height: '75px',
            background: 'linear-gradient(135deg, #047857 0%, #065F46 100%)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 16px',
            boxShadow: '0 4px 12px rgba(4, 120, 87, 0.25)',
            overflow: 'hidden'
          }}
        >
          <span
            ref={posRef}
            style={{
              fontSize: `${posFontSize}px`,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.2,
              wordBreak: 'break-word'
            }}
          >
            {position || 'सरपंच प्रत्याशी'}
          </span>
        </div>

        {/* Ward Badge */}
        <div
          style={{
            position: 'absolute',
            top: '495px',
            left: '60px',
            width: '235px',
            height: '105px',
            background: '#F8FAFC',
            border: '2.5px solid #CBD5E1',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
            वार्ड नंबर / WARD
          </span>
          <span style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
            {wardNo.trim() || '—'}
          </span>
        </div>

        {/* Ballot Badge */}
        <div
          style={{
            position: 'absolute',
            top: '495px',
            left: '315px',
            width: '235px',
            height: '105px',
            background: '#FEF3C7',
            border: '2.5px solid #F59E0B',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.12)'
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
            क्रमांक / BALLOT
          </span>
          <span style={{ fontSize: '34px', fontWeight: 900, color: '#92400E', lineHeight: 1 }}>
            {ballotNo.trim() || '—'}
          </span>
        </div>

        {/* Symbol Box */}
        <div
          style={{
            position: 'absolute',
            top: '615px',
            left: '60px',
            width: '490px',
            height: '145px',
            background: '#FFFFFF',
            border: '3px solid #F59E0B',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            padding: '10px 18px',
            gap: '16px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.15)'
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              background: '#FEF3C7',
              border: '2px solid #FDE68A',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            {symbolUrl ? (
              <img
                src={symbolUrl}
                alt="Election Symbol"
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
              />
            ) : (
              <span style={{ fontSize: '72px', lineHeight: 1 }}>🚜</span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              चुनाव चिह्न / ELECTION SYMBOL
            </span>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', marginTop: '2px', wordBreak: 'break-word' }}>
              {symbolName || 'चुनाव चिह्न'}
            </span>
          </div>
        </div>

        {/* Candidate Photo Frame */}
        <div
          style={{
            position: 'absolute',
            top: '190px',
            left: '580px',
            width: '440px',
            height: '570px',
            borderRadius: '28px',
            border: '6px solid #F59E0B',
            background: '#E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Candidate"
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
                color: '#94A3B8'
              }}
            >
              <span style={{ fontSize: '160px', fontWeight: 900, color: '#CBD5E1', lineHeight: 1 }}>
                {initial}
              </span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#94A3B8', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                प्रत्याशी फोटो
              </span>
            </div>
          )}
        </div>

        {/* Slogan Box */}
        <div
          style={{
            position: 'absolute',
            top: '785px',
            left: '60px',
            width: '960px',
            height: '160px',
            background: '#FFFBEB',
            border: '2px solid #FDE68A',
            borderLeft: '8px solid #D97706',
            borderRadius: '20px',
            padding: '16px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.08)',
            overflow: 'hidden'
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📌</span>
            <span>संकल्प एवं संदेश / Campaign Promise</span>
          </div>
          <div
            ref={sloganRef}
            style={{
              fontSize: `${sloganFontSize}px`,
              fontWeight: 700,
              color: '#1E293B',
              lineHeight: 1.35,
              wordBreak: 'break-word',
              fontStyle: 'italic'
            }}
          >
            "{effectiveSlogan}"
          </div>
        </div>

        {/* 3 Key Pillars */}
        <div
          style={{
            position: 'absolute',
            top: '965px',
            left: '60px',
            width: '960px',
            height: '215px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
        >
          <div
            style={{
              background: '#F8FAFC',
              border: '2px solid #E2E8F0',
              borderRadius: '20px',
              padding: '20px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
            }}
          >
            <span style={{ fontSize: '40px', marginBottom: '8px', lineHeight: 1 }}>🤝</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>ईमानदार नेतृत्व</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>हर वर्ग का सम्मान, सबकी बात, सबका साथ और निष्पक्ष सेवा</span>
          </div>

          <div
            style={{
              background: '#F8FAFC',
              border: '2px solid #E2E8F0',
              borderRadius: '20px',
              padding: '20px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
            }}
          >
            <span style={{ fontSize: '40px', marginBottom: '8px', lineHeight: 1 }}>⚡</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>तेज विकास</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>पक्की सड़कें, शुद्ध पेयजल, 24 घंटे बिजली एवं स्वच्छता</span>
          </div>

          <div
            style={{
              background: '#F8FAFC',
              border: '2px solid #E2E8F0',
              borderRadius: '20px',
              padding: '20px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
            }}
          >
            <span style={{ fontSize: '40px', marginBottom: '8px', lineHeight: 1 }}>🗳️</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>आपका एक वोट</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', lineHeight: 1.3 }}>ग्राम पंचायत के समग्र एवं उज्ज्वल भविष्य के लिए समर्पित</span>
          </div>
        </div>

        {/* Footer Bar */}
        <div
          style={{
            position: 'absolute',
            top: '1205px',
            left: '60px',
            width: '960px',
            height: '115px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '600px' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#F8FAFC', letterSpacing: '0.5px' }}>
              चुनाव निशान के सामने वाला बटन दबाकर भारी मतों से विजयी बनाएं!
            </span>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#94A3B8', marginTop: '2px' }}>
              निवेदक: समस्त ग्रामवासी एवं चुनाव प्रचार समिति
            </span>
          </div>

          {contactNumber.trim() ? (
            <div
              style={{
                background: '#D97706',
                borderRadius: '16px',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
                flexShrink: 0
              }}
            >
              <span>📞</span>
              <span>{contactNumber.trim()}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

PosterTemplate.displayName = 'PosterTemplate';

