import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Vote, Menu, Globe, Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotificationPanel } from '../ui/NotificationPanel';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenLanguageModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenLanguageModal
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { language, t } = useLanguage();
  const { elections, activeElection, setActiveElection } = useElection();
  const { user, currentRole } = useAuth();
  const [showElectionDrop, setShowElectionDrop] = useState(false);

  // Determine role badge color and label
  const getRoleBadgeColor = () => {
    switch (currentRole) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ADMIN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'VOLUNTEER': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-5 flex items-center justify-between shadow-xs dark:bg-slate-900/80 dark:border-slate-700">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-95"
          aria-label={t('navbarToggleSidebar')}
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 text-decoration-none group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Vote className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
            Elect<span className="text-sky-600">Win</span>
          </span>
        </Link>
      </div>

      {/* Right: Controls & Badges */}
      <div className="flex items-center gap-1.5 sm:gap-3">

        {/* Election Switcher */}
        {activeElection && (
          <div className="relative">
            <button
              onClick={() => setShowElectionDrop(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 text-xs font-bold transition-all cursor-pointer min-h-[38px] max-w-[160px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate hidden sm:inline">{activeElection.title}</span>
              <span className="sm:hidden truncate">Election</span>
              {elections.length > 1 && <ChevronDown className="w-3 h-3 shrink-0" />}
            </button>
            {showElectionDrop && elections.length > 1 && (
              <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 min-w-[200px] py-1.5">
                {elections.map(e => (
                  <button
                    key={e.id}
                    onClick={() => { setActiveElection(e); setShowElectionDrop(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-sky-50 transition-all ${
                      e.id === activeElection.id ? 'text-sky-700 bg-sky-50' : 'text-slate-700'
                    }`}
                  >
                    {e.title}
                    {e.status === 'ACTIVE' && <span className="ml-1.5 text-[10px] text-emerald-600 font-bold">LIVE</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Role Badge */}
        {user && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${getRoleBadgeColor()}`}>
            <span className="hidden sm:inline truncate max-w-[120px]">{user.first_name}</span>
            <span className="hidden sm:inline">·</span>
            <span className="truncate">{t(`role${currentRole.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`)}</span>
          </div>
        )}

        {/* Language Modal Trigger */}
        <button
          onClick={onOpenLanguageModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[38px]"
          title={t('navbarChangeLanguage')}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="uppercase">{language}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all relative min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
          title={t('navbarNotifications')}
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
};
