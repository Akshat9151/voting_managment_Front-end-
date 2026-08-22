import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, Globe, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotificationPanel, type NotificationItem } from '../ui/NotificationPanel';
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
  const { user } = useAuth();

  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await notificationsApi.listMyNotifications();
      setNotifications(response as NotificationItem[]);
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    // Refresh every 60 seconds
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Refresh when panel opens
  const handleBellClick = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications) {
      loadNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
        {/* Authenticated identity - shows name only without duplicate role badge */}
        {user && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-100/80 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 text-xs font-bold shadow-xs">
            <span className="truncate max-w-[140px] uppercase">{user.first_name || 'Admin'}</span>
          </div>
        )}

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
          onClick={handleBellClick}
          className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-all relative min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
          title={t('navbarNotifications')}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
        onRefresh={loadNotifications}
        onUnreadCountChange={setUnreadNotifsCount}
      />
    </header>
  );
};
