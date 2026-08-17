import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileQuickBar } from './MobileQuickBar';
import { RoleSwitcherModal, LanguageModal } from './RoleSwitcherModal';
import { ToastContainer } from '../ui/Toast';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      />

      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <MobileQuickBar />

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};
