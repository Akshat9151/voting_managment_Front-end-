import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Contact2, Palette, Send, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileQuickBar: React.FC = () => {
  const { t } = useLanguage();

  const quickItems = [
    { to: '/', label: t('mobileNavDashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/voters', label: t('mobileNavVoters'), icon: <Contact2 className="w-5 h-5" /> },
    { to: '/studio', label: t('mobileNavStudio'), icon: <Palette className="w-5 h-5" /> },
    { to: '/broadcast', label: t('mobileNavBroadcast'), icon: <Send className="w-5 h-5" /> },
    { to: '/volunteer-ward', label: t('mobileNavFieldDesk'), icon: <MapPin className="w-5 h-5" /> }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-[58px] bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 flex items-center justify-around shadow-lg">
      {quickItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 text-[10px] font-bold transition-all select-none',
              isActive
                ? 'text-sky-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            )
          }
        >
          {item.icon}
          <span className="mt-0.5">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
