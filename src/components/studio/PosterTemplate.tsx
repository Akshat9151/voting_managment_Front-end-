import React, { forwardRef } from 'react';
import { TemplateLayoutJson, TemplateElement } from '../../types/studio';

export interface PosterTemplateProps {
  layout?: TemplateLayoutJson;
  values?: Record<string, string>;
  photoUrl?: string | null;
  symbolMode?: 'preset' | 'custom';
  symbolValue?: string;
  backgroundImageUrl?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export const PosterTemplate = forwardRef<HTMLDivElement, PosterTemplateProps>(
  (
    {
      layout,
      values = {},
      photoUrl,
      symbolMode = 'preset',
      symbolValue = '🚜',
      backgroundImageUrl,
      className = '',
      style = {}
    },
    ref
  ) => {
    if (!layout || !layout.elements || layout.elements.length === 0) {
      return (
        <div
          ref={ref}
          className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm ${className}`}
          style={{ width: 600, height: 848, ...style }}
        >
          No Template Layout
        </div>
      );
    }

    // Sort elements by z_index ascending (lower z_index rendered first, higher on top)
    const sortedElements = [...layout.elements].sort(
      (a, b) => (a.z_index ?? 0) - (b.z_index ?? 0)
    );

    // Resolve placeholders in text with alias normalization and empty safety
    const resolveText = (el: TemplateElement): string => {
      let text = el.value || el.placeholder || '';
      
      const normalizedValues: Record<string, string> = {
        candidate_name: values.candidate_name || values.candidateName || values.name || values.full_name || values.hindiName || '',
        candidateName: values.candidate_name || values.candidateName || values.name || values.full_name || values.hindiName || '',
        name: values.candidate_name || values.candidateName || values.name || values.full_name || values.hindiName || '',
        
        position: values.position || values.post || values.post_title || values.position_title || '',
        post: values.position || values.post || values.post_title || values.position_title || '',
        
        ward_no: values.ward_no || values.ward || values.wardNo || '',
        ward: values.ward_no || values.ward || values.wardNo || '',
        
        ballot_no: values.ballot_no || values.ballot || values.ballot_number || values.ballotNo || values.serial_number || values.sequence_number || '',
        ballot: values.ballot_no || values.ballot || values.ballot_number || values.ballotNo || values.serial_number || values.sequence_number || '',
        
        slogan: values.slogan || values.message || values.tagline || values.nara || '',
        contact: values.contact || values.phone || values.mobile || values.contact_number || values.contactNumber || '',
        phone: values.contact || values.phone || values.mobile || values.contact_number || values.contactNumber || '',
        symbol_name: values.symbol_name || values.symbolName || 'चुनाव चिह्न',
        ...values
      };

      // Replace all {{key}} tokens
      text = text.replace(/\{\{\s*([\w]+)\s*\}\}/g, (_match, key) => {
        return normalizedValues[key] ?? '';
      }).trim();

      if ((el.placeholder || '').includes('{{') && !text) {
        return '';
      }

      return text;
    };

    /**
     * Dynamically compute optimal font size so text never overflows its bounding box
     * and never collides with adjacent elements.
     */
    const computeFittedFontSize = (
      text: string,
      boxWidth: number,
      boxHeight: number,
      baseFontSize: number = 16
    ): number => {
      if (!text || !boxWidth || !boxHeight) return baseFontSize;

      const trimmed = text.trim();
      const charCount = trimmed.length;
      if (charCount === 0) return baseFontSize;

      // Allow font scaling down to 40% of base size or 10px minimum
      const minSize = Math.max(10, Math.floor(baseFontSize * 0.4));
      const effectiveWidth = Math.max(20, boxWidth - 4);
      const effectiveHeight = Math.max(16, boxHeight - 2);

      for (let size = baseFontSize; size >= minSize; size -= 0.5) {
        // Average glyph width for mixed Hindi Devanagari & English text
        const avgCharWidth = size * 0.62;
        const totalTextWidth = charCount * avgCharWidth;
        const lines = Math.max(1, Math.ceil(totalTextWidth / effectiveWidth));
        const requiredHeight = lines * size * 1.22;

        if (requiredHeight <= effectiveHeight) {
          return size;
        }
      }

      return minSize;
    };

    const width = layout.width || 600;
    const height = layout.height || 848;

    return (
      <div
        ref={ref}
        className={`relative select-none ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: layout.bg_color || '#ffffff',
          backgroundImage: backgroundImageUrl ? `url("${backgroundImageUrl}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
          fontFamily: "'Outfit', 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
          boxSizing: 'border-box',
          ...style
        }}
      >
        {sortedElements.map((el, index) => {
          const baseStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${el.x}px`,
            top: `${el.y}px`,
            width: `${el.width}px`,
            height: `${el.height}px`,
            zIndex: el.z_index ?? index,
            boxSizing: 'border-box'
          };

          // 1. TEXT ELEMENT
          if (el.type === 'text') {
            const resolved = resolveText(el);
            const baseFontSize = el.font_size || 16;
            const fittedFontSize = computeFittedFontSize(
              resolved,
              el.width,
              el.height,
              baseFontSize
            );

            return (
              <div
                key={`el-text-${index}`}
                style={{
                  ...baseStyle,
                  color: el.color || '#000000',
                  fontSize: `${fittedFontSize}px`,
                  fontWeight: (el.font_weight as any) || 'normal',
                  textAlign: (el.text_align as any) || 'left',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems:
                    el.text_align === 'center'
                      ? 'center'
                      : el.text_align === 'right'
                      ? 'flex-end'
                      : 'flex-start',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  maxHeight: `${el.height}px`,
                  maxWidth: `${el.width}px`,
                  padding: '1px 2px',
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif"
                }}
              >
                {resolved}
              </div>
            );
          }

          // 2. PHOTO ELEMENT (Circular crop, no canvas race condition)
          if (el.type === 'photo') {
            return (
              <div
                key={`el-photo-${index}`}
                style={{
                  ...baseStyle,
                  borderRadius: el.border_radius !== undefined && el.border_radius !== null ? `${el.border_radius}px` : '50%',
                  overflow: 'hidden',
                  border: el.border_width
                    ? `${el.border_width}px solid ${el.border_color || '#d97706'}`
                    : '4px solid #f59e0b',
                  backgroundColor: '#e2e8f0',
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
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 bg-slate-200">
                    <span style={{ fontSize: `${Math.min(el.width, el.height) * 0.35}px` }}>
                      {(values.candidate_name?.charAt(0) || 'C').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            );
          }

          // 3. SYMBOL ELEMENT (Emoji centered or custom uploaded image)
          if (el.type === 'symbol') {
            const isCustom = symbolMode === 'custom' && symbolValue && symbolValue.startsWith('data:');
            return (
              <div
                key={`el-symbol-${index}`}
                style={{
                  ...baseStyle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: el.bg_color || 'transparent',
                  borderRadius: el.border_radius ? `${el.border_radius}px` : undefined,
                  border: el.border_width
                    ? `${el.border_width}px solid ${el.border_color || '#d97706'}`
                    : undefined,
                  overflow: 'hidden'
                }}
              >
                {isCustom ? (
                  <img
                    src={symbolValue}
                    alt="Symbol"
                    crossOrigin="anonymous"
                    style={{
                      width: '88%',
                      height: '88%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: el.font_size ? `${el.font_size}px` : `${Math.min(el.width, el.height) * 0.58}px`,
                      lineHeight: 1,
                      textAlign: 'center'
                    }}
                  >
                    {symbolValue || '🚜'}
                  </span>
                )}
              </div>
            );
          }

          // 4. SHAPE & MASK ELEMENTS (Colored / decorative box or redaction mask)
          if (el.type === 'shape' || el.type === 'mask') {
            return (
              <div
                key={`el-${el.type}-${index}`}
                style={{
                  ...baseStyle,
                  backgroundColor: el.color || el.bg_color || '#ffffff',
                  borderRadius: el.border_radius ? `${el.border_radius}px` : undefined,
                  border: el.border_width
                    ? `${el.border_width}px solid ${el.border_color || 'transparent'}`
                    : undefined
                }}
              />
            );
          }

          // 5. IMAGE ELEMENT
          if (el.type === 'image') {
            return (
              <div
                key={`el-img-${index}`}
                style={{
                  ...baseStyle,
                  overflow: 'hidden',
                  borderRadius: el.border_radius ? `${el.border_radius}px` : undefined
                }}
              >
                {el.value && (
                  <img
                    src={el.value}
                    alt="Decorative"
                    crossOrigin="anonymous"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  }
);

PosterTemplate.displayName = 'PosterTemplate';
