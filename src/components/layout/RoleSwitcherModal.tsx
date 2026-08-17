import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';
import { Check, UserCog, Globe } from 'lucide-react';
import { UserRole } from '../../types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, switchRole } = useAuth();

  const roles: { role: UserRole; title: string; desc: string; badge: string; color: string }[] = [
    {
      role: 'superadmin',
      title: 'Super Admin (Candidate Owner)',
      desc: 'Full access to candidate nomination, team assignments, statutory EC budgets & war room.',
      badge: 'Owner Access',
      color: 'border-violet-500 bg-violet-50/40 text-violet-700'
    },
    {
      role: 'admin',
      title: 'Admin (Campaign Operations)',
      desc: 'Manages voter roll sync, broadcast messaging, design studio assets & volunteer operations.',
      badge: 'Manager Access',
      color: 'border-sky-500 bg-sky-50/40 text-sky-700'
    },
    {
      role: 'volunteer',
      title: 'Field Volunteer (Ward 02 Desk)',
      desc: 'High-speed mobile interface dedicated to assigned booth electors & one-tap status logging.',
      badge: 'Field Desk',
      color: 'border-emerald-500 bg-emerald-50/40 text-emerald-700'
    }
  ];

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <UserCog className="w-5 h-5 text-sky-600" />
          <span>Switch Hierarchy Role</span>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-xs text-slate-500 mb-4">
          Experience ElectWin through different hierarchy views in real-time.
        </p>
        {roles.map((r) => {
          const isSelected = currentRole === r.role;
          return (
            <div
              key={r.role}
              onClick={() => handleSelectRole(r.role)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                isSelected
                  ? `${r.color} shadow-sm ring-1 ring-offset-1 ring-sky-400`
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900">{r.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 border border-slate-200">
                    {r.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

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
