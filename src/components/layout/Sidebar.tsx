import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Users,
  Award,
  Contact2,
  Palette,
  Send,
  AlertCircle,
  Receipt,
  BarChart3,
  Settings,
  UserPlus,
  Activity,
  LogOut,
  X,
  CheckSquare,
  Map
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose
}) => {
  const { logout, user, currentRole } = useAuth();
  const { t } = useLanguage();

  // Determine role badge color
  const getRoleBadgeColor = () => {
    switch (currentRole) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ADMIN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'VOLUNTEER': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Navigation Items according to role
  const mainNavItems = [
    { to: '/', label: t('navItemDashboard'), icon: <LayoutDashboard className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'VOLUNTEER'] },
    { to: '/team', label: t('navItemTeam'), icon: <Users className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { to: '/candidates', label: t('navItemCandidates'), icon: <Award className="w-4 h-4" />, roles: ['SUPER_ADMIN'] },
    { to: '/voters', label: t('navItemVoters'), icon: <Contact2 className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { to: '/tasks', label: t('navItemTasks'), icon: <CheckSquare className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'VOLUNTEER'] },
    { to: '/field-activities', label: t('navItemFieldActivities'), icon: <Map className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'VOLUNTEER'] },
    { to: '/studio', label: t('navItemDesignStudio'), icon: <Palette className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'VOLUNTEER'] },
    { to: '/broadcast', label: t('navItemBroadcast'), icon: <Send className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { to: '/complaints', label: t('navItemComplaints'), icon: <AlertCircle className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { to: '/expenses', label: t('navItemExpenses'), icon: <Receipt className="w-4 h-4" />, roles: ['SUPER_ADMIN'] },
    { to: '/analytics', label: t('navItemAnalytics'), icon: <BarChart3 className="w-4 h-4" />, roles: ['SUPER_ADMIN'] },
    { to: '/settings', label: t('navItemSettings'), icon: <Settings className="w-4 h-4" />, roles: ['SUPER_ADMIN', 'ADMIN', 'VOLUNTEER'] }
  ];

  const volunteerNavItems = [
    { to: '/volunteer-add', label: t('navItemAddVoter'), icon: <UserPlus className="w-4 h-4" /> },
    { to: '/volunteer-activity', label: t('navItemFieldRecord'), icon: <Activity className="w-4 h-4" /> }
  ];

  const visibleMainNavItems = mainNavItems.filter((item) => item.roles.includes(currentRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed lg:sticky top-0 lg:top-14 left-0 h-screen lg:h-[calc(100vh-56px)] w-[240px] max-w-[75vw] lg:w-[220px] xl:w-[240px] bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto dark:bg-slate-900 dark:border-slate-700',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 space-y-4">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 lg:hidden dark:border-slate-800">
            <div className="font-heading font-extrabold text-lg text-slate-900 dark:text-slate-100">
              Vote<span style={{ color: 'var(--brand-primary)' }}>Victory</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 min-h-[36px] min-w-[36px] flex items-center justify-center dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[11px] font-extrabold uppercase text-slate-400 px-3 py-1 tracking-wider">
              {t('navigationSidebarCampaignMgmt')}
            </div>
            {visibleMainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => (isActive ? { backgroundColor: 'var(--brand-primary)' } : undefined)}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[42px]',
                    isActive
                      ? 'text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                  )
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Field Volunteer Section */}
            {currentRole === 'VOLUNTEER' && <div className="pt-3">
              <div className="text-[11px] font-extrabold uppercase text-slate-400 px-3 py-1 tracking-wider">
                {t('navigationSidebarFieldVolunteer')}
              </div>
              {volunteerNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[42px]',
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                    )
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3 dark:border-slate-700 dark:bg-slate-950/40">
          {/* User Role Display */}
          {user && (
            <div className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${getRoleBadgeColor()}`}>
              <div className="truncate">{user.first_name} {user.last_name}</div>
              <div className="text-[10px] opacity-80 mt-0.5">
                {t(`role${currentRole.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')}`)}
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 py-2.5 rounded-xl transition-all cursor-pointer min-h-[42px] dark:bg-slate-800 dark:hover:bg-rose-900/20 dark:border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('navItemSignOut')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
