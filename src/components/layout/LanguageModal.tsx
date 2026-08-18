import React from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';
import { Check, Globe } from 'lucide-react';

export const LanguageModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-600" />
          <span>Select Platform Language</span>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-2.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code as LanguageCode); onClose(); }}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer min-h-[48px] ${
                isSelected
                  ? 'border-sky-500 bg-sky-50 font-bold text-sky-900'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div>
                <div className="text-sm font-bold">{lang.native}</div>
                <div className="text-xs text-slate-500">{lang.label}</div>
              </div>
              {isSelected && <Check className="w-4 h-4 text-sky-600" />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
