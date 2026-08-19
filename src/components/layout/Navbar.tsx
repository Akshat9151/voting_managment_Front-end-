import React, { useState, useRef, useEffect } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Vote, Menu, Globe, Bell, ChevronDown, Sun, Moon, ShieldCheck, UserCheck, Users, LogOut, Check } from 'lucide-react';
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
  const [showRoleDrop, setShowRoleDrop] = useState(false);
  const [showElectionDrop, setShowElectionDrop] = useState(false);

  const { language, t } = useLanguage();
  const { elections, activeElection, setActiveElection } = useElection();
  const { user, currentRole, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const electionMenuRef = useRef<HTMLDivElement>(null);

  const [unreadNotifsCount, setUnreadNotifsCount] = useState(3);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setShowRoleDrop(false);
      }
      if (electionMenuRef.current && !electionMenuRef.current.contains(e.target as Node)) {
        setShowElectionDrop(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setShowRoleDrop(false);
    showToast(`Switched role to ${role.replace('_', ' ')}!`, 'success');
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
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, var(--brand-primary), #7c3aed)' }}
          >
            <Vote className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
            Elect<span style={{ color: 'var(--brand-primary)' }}>Win</span>
          </span>
        </Link>
      </div>

      {/* Right: Controls & Badges */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">

        {/* Election Switcher */}
        {activeElection && (
          <div className="relative" ref={electionMenuRef}>
            <button
              onClick={() => setShowElectionDrop(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 text-xs font-bold transition-all cursor-pointer min-h-[38px] max-w-[160px] dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate hidden sm:inline">{activeElection.title}</span>
              <span className="sm:hidden truncate">Election</span>
              {elections.length > 1 && <ChevronDown className="w-3 h-3 shrink-0" />}
            </button>
            {showElectionDrop && elections.length > 1 && (
              <div className="absolute right-0 top-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 min-w-[200px] py-1.5 animate-fade-in">
                {elections.map(e => (
                  <button
                    key={e.id}
                    onClick={() => { setActiveElection(e); setShowElectionDrop(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all ${
                      e.id === activeElection.id ? 'text-brand-primary font-bold' : 'text-slate-700 dark:text-slate-200'
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

        {/* User Role Switcher / Toggle */}
        {user && (
          <div className="relative" ref={roleMenuRef}>
            <button
              onClick={() => setShowRoleDrop(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${getRoleBadgeColor()}`}
              title="Click to switch role or view profile"
            >
              <span className="hidden sm:inline truncate max-w-[120px]">{user.first_name}</span>
              <span className="hidden sm:inline">·</span>
              <span className="truncate">
                {t(`role${currentRole.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`)}
              </span>
              <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${showRoleDrop ? 'rotate-180' : ''}`} />
            </button>

            {/* Role Switcher Popover */}
            {showRoleDrop && (
              <div className="absolute right-0 top-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 w-64 p-2 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {user.full_name || `${user.first_name} ${user.last_name}`}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </div>
                </div>

                <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Switch Role
                </div>

                <button
                  type="button"
                  onClick={() => handleRoleChange('SUPER_ADMIN')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentRole === 'SUPER_ADMIN'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Super Admin</span>
                  </div>
                  {currentRole === 'SUPER_ADMIN' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('ADMIN')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentRole === 'ADMIN'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Campaign Admin</span>
                  </div>
                  {currentRole === 'ADMIN' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('VOLUNTEER')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentRole === 'VOLUNTEER'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Field Volunteer</span>
                  </div>
                  {currentRole === 'VOLUNTEER' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowRoleDrop(false); logout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('navItemSignOut')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 1. Theme Toggle (Top Right Corner) */}
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
        onClose={() => setShowNotifications(false)}
        onUnreadCountChange={setUnreadNotifsCount}
      />
    </header>
  );
};
