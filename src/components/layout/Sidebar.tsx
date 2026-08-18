import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Award,
  Contact2,
  Palette,
  Send,
  UserCheck,
  AlertCircle,
  Receipt,
  BarChart3,
  Settings,
  MapPin,
  UserPlus,
  Activity,
  LogOut,
  X,
  Sparkles,
  CheckSquare,
  Crown
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoleSwitcher: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenRoleSwitcher
}) => {
  const { currentRole, logout } = useAuth();

  // Super Admin (Parshad) Full Platform Navigation
  const superAdminNavItems = [
    { to: '/', label: 'War Room Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/candidates', label: 'Candidate Management', icon: <Award className="w-4 h-4" /> },
    { to: '/team', label: 'Team & Admin RBAC', icon: <Users className="w-4 h-4" /> },
    { to: '/tasks', label: 'Task & Operations', icon: <CheckSquare className="w-4 h-4" /> },
    { to: '/field-activities', label: 'Field Activity Stream', icon: <Activity className="w-4 h-4" /> },
    { to: '/voters', label: 'Voter Roll & OCR', icon: <Contact2 className="w-4 h-4" /> },
    { to: '/studio', label: 'Design Studio', icon: <Palette className="w-4 h-4" /> },
    { to: '/broadcast', label: 'Broadcast Center', icon: <Send className="w-4 h-4" /> },
    { to: '/volunteers', label: 'Booth & Area Ops', icon: <UserCheck className="w-4 h-4" /> },
    { to: '/subscriptions', label: 'SaaS Subscriptions', icon: <Crown className="w-4 h-4 text-amber-500" /> },
    { to: '/expenses', label: 'EC Expenses Ledger', icon: <Receipt className="w-4 h-4" /> },
    { to: '/analytics', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  // Admin (Candidate) Campaign Navigation
  const candidateAdminNavItems = [
    { to: '/', label: 'Campaign Command', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/volunteers', label: 'Volunteer Management', icon: <UserCheck className="w-4 h-4" /> },
    { to: '/tasks', label: 'Assign Field Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { to: '/field-activities', label: 'Activities & Attendance', icon: <Activity className="w-4 h-4" /> },
    { to: '/voters', label: 'Voter Roll & Slip Sync', icon: <Contact2 className="w-4 h-4" /> },
    { to: '/broadcast', label: 'Broadcast Center', icon: <Send className="w-4 h-4" /> },
    { to: '/complaints', label: 'Grievances & Surveys', icon: <AlertCircle className="w-4 h-4" /> },
    { to: '/analytics', label: 'Campaign Progress', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  // Volunteer Ground-Level Navigation
  const volunteerNavItems = [
    { to: '/', label: 'Field Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/tasks', label: 'My Assigned Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { to: '/field-activities', label: 'Submit Field Report', icon: <Activity className="w-4 h-4" /> },
    { to: '/volunteer-ward', label: 'Ward 02 Field Desk', icon: <MapPin className="w-4 h-4" /> },
    { to: '/volunteer-add', label: 'Add Elector (Ward 02)', icon: <UserPlus className="w-4 h-4" /> },
    { to: '/volunteer-activity', label: 'My Field Record', icon: <Activity className="w-4 h-4" /> }
  ];

  const currentNavItems =
    currentRole === 'superadmin'
      ? superAdminNavItems
      : currentRole === 'admin'
      ? candidateAdminNavItems
      : volunteerNavItems;

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
          'fixed lg:sticky top-0 lg:top-14 left-0 h-screen lg:h-[calc(100vh-56px)] w-[260px] bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 space-y-4">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 lg:hidden">
            <div className="font-heading font-extrabold text-lg text-slate-900">
              Elect<span className="text-sky-600">Win</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Status Box */}
          <div
            onClick={onOpenRoleSwitcher}
            className="p-3 bg-gradient-to-br from-sky-50 to-slate-50 border border-sky-100 rounded-xl cursor-pointer hover:border-sky-300 transition-all flex items-center justify-between shadow-xs"
          >
            <div>
              <div className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">
                {currentRole === 'superadmin' && 'SUPER ADMIN (PARSHAD)'}
                {currentRole === 'admin' && 'CAMPAIGN ADMIN (CANDIDATE)'}
                {currentRole === 'volunteer' && 'GROUND VOLUNTEER'}
              </div>
              <div className="text-xs font-bold text-slate-900 capitalize">{currentRole} View</div>
            </div>
            <Sparkles className="w-4 h-4 text-sky-500" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[11px] font-extrabold uppercase text-slate-400 px-3 py-1 tracking-wider">
              {currentRole === 'superadmin' && 'Central Master Platform'}
              {currentRole === 'admin' && 'Candidate Management'}
              {currentRole === 'volunteer' && 'Field Operations'}
            </div>
            {currentNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[42px]',
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 py-2.5 rounded-xl transition-all cursor-pointer min-h-[42px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
