import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  CheckSquare,
  Trash2,
  Check,
  Palette,
  Users,
  AlertCircle,
  Activity,
  Bell,
  X
} from 'lucide-react';
import { notificationsApi } from '../../services/api';

export interface NotificationItem {
  id: string;
  type: 'task-assigned' | 'activity-submitted' | 'activity-approved' | 'poster-shared' | 'team-member-added' | 'complaint-status' | 'general';
  title: string;
  message: string;
  link?: string;
  timestamp?: string;
  read: boolean;
  data?: Record<string, any>;
}

interface NotificationPanelProps {
  isOpen: boolean;
  notifications?: NotificationItem[];
  onClose: () => void;
  onRefresh?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  notifications = [],
  onClose,
  onRefresh,
  onUnreadCountChange
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [onUnreadCountChange, unreadCount]);

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      try {
        await notificationsApi.markAsRead(notif.id);
        onRefresh?.();
      } catch {}
    }
    onClose();
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationsApi.markAsRead(id);
      onRefresh?.();
    } catch {}
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationsApi.deleteNotification(id);
      onRefresh?.();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      onRefresh?.();
    } catch {}
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'poster-shared':
        return <Palette className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
      case 'team-member-added':
        return <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'task-assigned':
        return <CheckSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'complaint-status':
        return <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'activity-approved':
      case 'activity-submitted':
        return <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('notificationJustNow', 'Just now');
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Notification Panel */}
      <div
        className={`fixed right-0 top-14 h-[calc(100vh-56px)] w-full max-w-[360px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-transform duration-300 dark:bg-slate-900 dark:border-slate-800 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="border-b border-slate-200 p-4 flex items-center justify-between dark:border-slate-800">
          <div>
            <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              <span>{t('navbarNotifications', 'Notifications')}</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {unreadCount} new
                </span>
              )}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 px-2 py-1 rounded hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No notifications yet</p>
              <p className="text-xs text-slate-500 mt-1">Updates on team members, posters, and tasks will appear here.</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3.5 transition-all cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                  !notification.read
                    ? 'bg-sky-50/50 dark:bg-sky-950/20'
                    : 'bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-[10px] font-medium text-slate-400">
                        {formatTime(notification.timestamp)}
                      </span>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                            className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
