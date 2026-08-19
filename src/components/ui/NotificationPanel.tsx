import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  CheckSquare,
  MapPin,
  Clock,
  Trash2,
  Check,
  CheckCheck,
  Bell,
  BellOff,
  X,
  RefreshCw,
  Send,
  UserPlus
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'task-assigned' | 'activity-submitted' | 'deadline-approaching' | 'broadcast-sent' | 'voter-added';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'task-assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned: "Survey voter database for Ward 04 & verify mobile numbers"',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    read: false
  },
  {
    id: 'notif-2',
    type: 'deadline-approaching',
    title: 'Deadline Approaching',
    message: 'Campaign Task "Distribute 500 Panna slips in Patel Basti" is due in 2 days.',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    read: false
  },
  {
    id: 'notif-3',
    type: 'activity-submitted',
    title: 'Field Activity Submitted for Review',
    message: 'Volunteer Kailash Saini submitted door-to-door rally report for Booth 02.',
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), // 6 hours ago
    read: false
  },
  {
    id: 'notif-4',
    type: 'broadcast-sent',
    title: 'WhatsApp Broadcast Delivered',
    message: 'Morning voting appeal message delivered to 1,240 verified electors with 94% read rate.',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    read: true
  },
  {
    id: 'notif-5',
    type: 'voter-added',
    title: 'New Voters Imported',
    message: 'Booth Incharge added 48 new electors from Youth Registration Drive in Ward 01.',
    timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), // 2 days ago
    read: true
  }
];

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  onUnreadCountChange
}) => {
  const { showToast } = useToast();

  // Load notifications from localStorage or fallback to defaults
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('electwin_notifications');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Save to localStorage and notify parent
  useEffect(() => {
    try {
      localStorage.setItem('electwin_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
    const unread = notifications.filter(n => !n.read).length;
    if (onUnreadCountChange) {
      onUnreadCountChange(unread);
    }
  }, [notifications, onUnreadCountChange]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Toggle read/unread on click
  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read!', 'success');
  };

  // Delete single notification
  const handleDeleteOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification removed', 'info');
  };

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
    showToast('All notifications cleared', 'info');
  };

  // Restore sample notifications when list is empty
  const handleResetDefaults = () => {
    setNotifications(DEFAULT_NOTIFICATIONS);
    showToast('Sample notifications restored!', 'success');
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'task-assigned':
        return <CheckSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'activity-submitted':
        return <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'deadline-approaching':
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'broadcast-sent':
        return <Send className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'voter-added':
        return <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMs / 3600000);
      const days = Math.floor(diffMs / 86400000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days === 1) return 'Yesterday';
      return `${days}d ago`;
    } catch {
      return 'Recent';
    }
  };

  const displayList = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Slide-out Panel */}
      <aside
        className={`fixed right-0 top-14 h-[calc(100vh-56px)] w-full max-w-[380px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/70 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Campaign Alerts & Notifications
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs & Quick Actions */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {displayList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <BellOff className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications right now'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {filter === 'unread'
                    ? 'You have reviewed all campaign updates!'
                    : 'New task assignments and election alerts will appear here.'}
                </p>
              </div>
              {notifications.length === 0 && (
                <button
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-xl hover:bg-sky-100 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Sample Alerts</span>
                </button>
              )}
            </div>
          ) : (
            displayList.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggleRead(item.id)}
                className={`p-3.5 sm:p-4 transition-all cursor-pointer group flex items-start gap-3 relative ${
                  item.read
                    ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 opacity-80'
                    : 'bg-sky-50/70 dark:bg-sky-950/30 hover:bg-sky-50 dark:hover:bg-sky-950/50 border-l-4 border-brand-primary'
                }`}
              >
                {/* Type Icon Badge */}
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5">
                    <h4 className={`text-xs font-extrabold truncate ${item.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      • {item.read ? 'Read' : 'Click to mark read'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons (Always visible on hover / tap) */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(item.id);
                    }}
                    className={`p-1.5 rounded-lg transition-all ${
                      item.read
                        ? 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-brand-primary hover:bg-sky-100 dark:hover:bg-sky-900/50'
                    }`}
                    title={item.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteOne(e, item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Clear All Button */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
            <button
              type="button"
              onClick={handleClearAll}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Notifications</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
