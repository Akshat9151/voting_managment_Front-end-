import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FormInput, FormInputProps } from './FormInput';
import { Textarea, TextareaProps } from './Textarea';

const LATIN_TEXT = /[A-Za-z]/;

// Common Hindi phonetic fallback dictionary for offline/instant speed
const PHONETIC_DICT: Record<string, string> = {
  ramesh: 'रमेश',
  rameshwar: 'रामेश्वर',
  suresh: 'सुरेश',
  mahesh: 'महेश',
  dinesh: 'दिनेश',
  rajesh: 'राजेश',
  patel: 'पटेल',
  sharma: 'शर्मा',
  verma: 'वर्मा',
  singh: 'सिंह',
  kumar: 'कुमार',
  yadav: 'यादव',
  chaudhary: 'चौधरी',
  meena: 'मीना',
  gupta: 'गुप्ता',
  jain: 'जैन',
  sarpanch: 'सरपंच',
  panch: 'पंच',
  pradhan: 'प्रधान',
  parshad: 'पार्षद',
  vidhayak: 'विधायक',
  ward: 'वार्ड',
  karmak: 'क्रमांक',
  chunav: 'चुनाव',
  pratyashi: 'प्रत्याशी',
  namaste: 'नमस्ते',
  vikas: 'विकास',
  vijay: 'विजय',
  sankalp: 'संकल्प',
  gram: 'ग्राम',
  panchayat: 'पंचायत',
  vote: 'वोट',
  seva: 'सेवा',
  samman: 'सम्मान',
  samarthan: 'समर्थन',
  shanti: 'शांति',
  khushhali: 'खुशहाली',
  bharat: 'भारत',
  jai: 'जय',
  shri: 'श्री',
  ram: 'राम',
};

const transliterateOnline = async (source: string): Promise<string | undefined> => {
  try {
    const trimmed = source.trim();
    if (!trimmed) return undefined;
    
    // Check quick dictionary first for single words
    const lower = trimmed.toLowerCase();
    if (PHONETIC_DICT[lower]) {
      return PHONETIC_DICT[lower];
    }

    const response = await fetch(
      `https://inputtools.google.com/request?text=${encodeURIComponent(trimmed)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (!response.ok) return PHONETIC_DICT[lower];
    const data = await response.json();
    return data?.[1]?.[0]?.[1]?.[0] || PHONETIC_DICT[lower];
  } catch {
    const lower = source.trim().toLowerCase();
    return PHONETIC_DICT[lower];
  }
};

export const transliterateText = async (text: string): Promise<string> => {
  if (!text || !LATIN_TEXT.test(text)) return text;
  
  // Split by words/spaces, transliterate latin segments
  const parts = text.split(/(\s+)/);
  const translatedParts = await Promise.all(
    parts.map(async (part) => {
      if (LATIN_TEXT.test(part)) {
        const res = await transliterateOnline(part);
        return res || part;
      }
      return part;
    })
  );
  return translatedParts.join('');
};

type BaseProps = {
  sourceValue?: string;
  alwaysTransliterate?: boolean;
  enableToggle?: boolean;
};

export const useTransliteratedValue = (
  value: string | number | readonly string[] | undefined,
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined,
  sourceValue?: string,
  alwaysTransliterate?: boolean
) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const requestId = useRef(0);
  const lastProcessed = useRef('');
  const currentValue = String(value ?? '');
  const sourceText = String(sourceValue ?? currentValue);

  // Debounced transliteration
  useEffect(() => {
    const shouldTransliterate = alwaysTransliterate || language === 'hi';
    if (!shouldTransliterate || !LATIN_TEXT.test(sourceText.trim())) return;
    if (lastProcessed.current === sourceText) return;

    const timer = window.setTimeout(async () => {
      const id = ++requestId.current;
      setIsLoading(true);
      try {
        const suggestion = await transliterateText(sourceText);
        if (id === requestId.current && suggestion && suggestion !== sourceText) {
          lastProcessed.current = suggestion;
          onChange?.({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>);
        }
      } catch {
        // Fallback gracefully without throwing
      } finally {
        if (id === requestId.current) setIsLoading(false);
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [currentValue, language, onChange, sourceText, sourceValue, alwaysTransliterate]);

  return isLoading;
};

export const TransliteratingTextInput: React.FC<FormInputProps & BaseProps> = ({
  value,
  onChange,
  sourceValue,
  alwaysTransliterate = false,
  enableToggle = true,
  helperText,
  ...props
}) => {
  const { t } = useLanguage();
  const [hindiMode, setHindiMode] = useState(alwaysTransliterate);
  const isLoading = useTransliteratedValue(value, onChange, sourceValue, hindiMode);

  const handleManualTransliterate = useCallback(async () => {
    const current = String(value ?? '');
    if (!current.trim()) return;
    const res = await transliterateText(current);
    if (res && onChange) {
      onChange({ target: { value: res } } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [value, onChange]);

  // Handle spacebar word conversion
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!hindiMode) return;
      if (e.key === ' ' || e.key === 'Enter') {
        const input = e.currentTarget;
        const text = input.value;
        const cursorPos = input.selectionStart || text.length;
        const textBeforeCursor = text.slice(0, cursorPos);
        const lastWordMatch = textBeforeCursor.match(/([a-zA-Z]+)$/);
        
        if (lastWordMatch) {
          const latinWord = lastWordMatch[1];
          const converted = await transliterateOnline(latinWord);
          if (converted && converted !== latinWord) {
            const startIdx = cursorPos - latinWord.length;
            const newText = text.slice(0, startIdx) + converted + (e.key === ' ' ? ' ' : '') + text.slice(cursorPos);
            if (onChange) {
              onChange({ target: { value: newText } } as React.ChangeEvent<HTMLInputElement>);
            }
            if (e.key === ' ') {
              e.preventDefault();
            }
          }
        }
      }
    },
    [hindiMode, onChange]
  );

  return (
    <div className="relative">
      <FormInput
        {...props}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        helperText={
          isLoading ? (t('transliterationLoading') || '✍️ अनुवाद / लिप्यंतरण हो रहा है...') : helperText
        }
      />
      {enableToggle && (
        <div className="absolute right-2 top-8 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setHindiMode((prev) => !prev)}
            title={hindiMode ? 'हिंदी टाइपिंग सक्रिय है (क्लिक करके अंग्रेजी में बदलें)' : 'English typing (Click for Hindi)'}
            className={`px-1.5 py-0.5 text-[11px] font-bold rounded border transition-all ${
              hindiMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {hindiMode ? 'अ' : 'A'}
          </button>
          {LATIN_TEXT.test(String(value ?? '')) && (
            <button
              type="button"
              onClick={handleManualTransliterate}
              title="हिंदी में बदलें (Transliterate to Hindi)"
              className="px-1.5 py-0.5 text-[10px] font-semibold bg-sky-100 text-sky-700 border border-sky-300 rounded hover:bg-sky-200"
            >
              🔄
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const TransliteratingTextArea: React.FC<TextareaProps & BaseProps> = ({
  value,
  onChange,
  sourceValue,
  alwaysTransliterate = false,
  enableToggle = true,
  ...props
}) => {
  const { t } = useLanguage();
  const [hindiMode, setHindiMode] = useState(alwaysTransliterate);
  const isLoading = useTransliteratedValue(value, onChange, sourceValue, hindiMode);

  const handleManualTransliterate = useCallback(async () => {
    const current = String(value ?? '');
    if (!current.trim()) return;
    const res = await transliterateText(current);
    if (res && onChange) {
      onChange({ target: { value: res } } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, [value, onChange]);

  return (
    <div className="relative">
      <Textarea
        {...props}
        value={value}
        onChange={onChange}
        error={isLoading ? (t('transliterationLoading') || 'हिंदी में बदला जा रहा है...') : props.error}
      />
      {enableToggle && (
        <div className="absolute right-2 top-2 flex items-center gap-1 z-10">
          <button
            type="button"
            onClick={() => setHindiMode((prev) => !prev)}
            title={hindiMode ? 'हिंदी टाइपिंग सक्रिय है' : 'English mode'}
            className={`px-1.5 py-0.5 text-[11px] font-bold rounded border transition-all ${
              hindiMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {hindiMode ? 'अ हिंदी' : 'A Eng'}
          </button>
          {LATIN_TEXT.test(String(value ?? '')) && (
            <button
              type="button"
              onClick={handleManualTransliterate}
              title="हिंदी में बदलें"
              className="px-1.5 py-0.5 text-[10px] font-semibold bg-sky-100 text-sky-700 border border-sky-300 rounded hover:bg-sky-200"
            >
              🔄 Translate
            </button>
          )}
        </div>
      )}
    </div>
  );
};
