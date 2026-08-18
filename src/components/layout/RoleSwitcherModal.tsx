import React from 'react';
// NOTE: This file is DEPRECATED and should be deleted.
// Role switching has been removed - roles now come exclusively from the backend.
import { Modal } from '../ui/Modal';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * @deprecated This component is no longer used.
 * Role switching has been completely removed from the application.
 * Only the LanguageModal is exported from the parent directory.
 * This entire file should be deleted.
 */
export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  // Role switching is no longer supported
  // const { currentRole, switchRole } = useAuth();

  // Removed: Role switching is no longer supported
  // const handleSelectRole = (role: UserRole) => {
  //   switchRole(role);
  //   onClose();
  // };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Role Switching – Deprecated</span>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-xs text-slate-500 mb-4">
          ⚠️ This component is deprecated. Role switching has been removed from the application.
          User roles are now managed exclusively by the backend.
          This file should be deleted.
        </p>
      </div>
    </Modal>
  );
};
