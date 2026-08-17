import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Vote, Menu, Globe, Bell, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenRoleSwitcher: () => void;
  onOpenLanguageModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenRoleSwitcher,
  onOpenLanguageModal
}) => {
  const { currentRole } = useAuth();
  const { language } = useLanguage();

  const roleLabel = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    volunteer: 'Volunteer Desk'
  }[currentRole];

  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-5 flex items-center justify-between shadow-xs">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-95"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 text-decoration-none group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Vote className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900">
            Elect<span className="text-sky-600">Win</span>
          </span>
        </Link>
      </div>

      {/* Right: Controls & Badges */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Role Pill Switcher */}
        <button
          onClick={onOpenRoleSwitcher}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200/80 text-sky-800 text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[38px]"
        >
          <Shield className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="hidden sm:inline">{roleLabel}</span>
          <span className="sm:hidden">{currentRole === 'superadmin' ? 'Owner' : currentRole === 'admin' ? 'Admin' : 'Field'}</span>
        </button>

        {/* Language Modal Trigger */}
        <button
          onClick={onOpenLanguageModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[38px]"
          title="Change Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="uppercase">{language}</span>
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all relative min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
          title="Live Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};
