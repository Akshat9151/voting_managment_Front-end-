import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Menu, Globe, Bell, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotificationPanel } from '../ui/NotificationPanel';
import { notificationsApi } from '../../services/api';
import { VoteVictoryLogo } from '../ui/VoteVictoryLogo';

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
  const { user, currentRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await notificationsApi.listMyNotifications();
        setNotifications(response);
      } catch {
        setNotifications([]);
      }
    };
    loadNotifications();
  }, []);

  // Determine role badge color and label
  const getRoleBadgeColor = () => {
    switch (currentRole) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200/80 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'VOLUNTEER':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
    }
  };

  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-5 flex items-center justify-between shadow-xs dark:bg-slate-900/90 dark:border-slate-700 transition-colors">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={t('navbarToggleSidebar')}
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 text-decoration-none group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
            <VoteVictoryLogo className="w-full h-full" />
          </div>
          <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
            Vote<span style={{ color: 'var(--brand-primary)' }}>Victory</span>
          </span>
        </Link>
      </div>

      {/* Right: Controls & Badges */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Authenticated identity */}
        {user && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-xs ${getRoleBadgeColor()}`}>
            <span className="hidden sm:inline truncate max-w-[120px]">{user.first_name}</span>
            <span className="hidden sm:inline">·</span>
            <span className="truncate">
              {t(`role${currentRole.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`)}
            </span>
          </div>
        )}

        {/* 1. Theme Toggle */}
        <button
          onClick={() => {
            toggleTheme();
            showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode!`, 'success');
          }}
          className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-amber-400 transition-all active:scale-95 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shadow-xs"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Language Modal Trigger */}
        <button
          onClick={onOpenLanguageModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[38px]"
          title={t('navbarChangeLanguage')}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="uppercase">{language}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-all relative min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
          title={t('navbarNotifications')}
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          )}
        </button>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
        onUnreadCountChange={setUnreadNotifsCount}
      />
    </header>
  );
};
