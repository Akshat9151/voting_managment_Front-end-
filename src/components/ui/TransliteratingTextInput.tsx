import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FormInput, FormInputProps } from './FormInput';
import { Textarea, TextareaProps } from './Textarea';

const LATIN_TEXT = /[A-Za-z]/;
const transliterate = async (source: string): Promise<string | undefined> => {
  const response = await fetch(
    `https://inputtools.google.com/request?text=${encodeURIComponent(source)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
  );
  const data = await response.json();
  return data?.[1]?.[0]?.[1]?.[0];
};

type BaseProps = { sourceValue?: string; alwaysTransliterate?: boolean };

export const useTransliteratedValue = (
  value: string | number | readonly string[] | undefined,
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined,
  sourceValue?: string,
  alwaysTransliterate?: boolean
) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const requestId = useRef(0);
  const lastSource = useRef('');
  const currentValue = String(value ?? '');
  const sourceText = String(sourceValue ?? currentValue);

  useEffect(() => {
    const shouldTransliterate = alwaysTransliterate || language === 'hi';
    if (!shouldTransliterate || !LATIN_TEXT.test(sourceText.trim()) || lastSource.current === sourceText) return;
    lastSource.current = sourceText;
    const timer = window.setTimeout(async () => {
      const id = ++requestId.current;
      setIsLoading(true);
      try {
        const suggestion = await transliterate(sourceText);
        if (id === requestId.current && suggestion && (sourceValue ? sourceText === String(sourceValue) : currentValue === sourceText)) {
          onChange?.({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>);
        }
      } catch {
        // Leave the editable source text unchanged when the suggestion service is unavailable.
      } finally {
        if (id === requestId.current) setIsLoading(false);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [currentValue, language, onChange, sourceText, sourceValue]);

  return isLoading;
};

export const TransliteratingTextInput: React.FC<FormInputProps & BaseProps> = ({ value, onChange, sourceValue, alwaysTransliterate, helperText, ...props }) => {
  const { t } = useLanguage();
  const isLoading = useTransliteratedValue(value, onChange, sourceValue, alwaysTransliterate);
  return <FormInput {...props} value={value} onChange={onChange} helperText={isLoading ? t('transliterationLoading') : helperText} />;
};

export const TransliteratingTextArea: React.FC<TextareaProps & BaseProps> = ({ value, onChange, sourceValue, alwaysTransliterate, ...props }) => {
  const { t } = useLanguage();
  const isLoading = useTransliteratedValue(value, onChange, sourceValue, alwaysTransliterate);
  return <Textarea {...props} value={value} onChange={onChange} error={isLoading ? t('transliterationLoading') : props.error} />;
};
