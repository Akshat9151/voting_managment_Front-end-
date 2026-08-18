import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckSquare, Map, Trash2, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: 'task-assigned' | 'activity-submitted' | 'deadline-approaching';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
}

interface NotificationPanelProps {
  isOpen: boolean;
  notifications?: Notification[];
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  notifications = [],
  onClose,
  onMarkAsRead,
  onDelete
}) => {
  const { t } = useLanguage();

  // TODO: Connect to real backend once available
  // const notifications = await notificationsApi.getAll();
  
  const mockNotifications: Notification[] = notifications.length === 0 ? [
    {
      id: '1',
      type: 'task-assigned',
      title: t('notificationTaskAssigned'),
      message: 'You have been assigned: "Survey voter database for Ward A"',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: '2',
      type: 'deadline-approaching',
      title: t('notificationDeadlineApproaching'),
      message: 'Task "Distribute campaign materials" is due in 2 days',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false
    },
    {
      id: '3',
      type: 'activity-submitted',
      title: t('notificationActivitySubmitted'),
      message: 'Your field activity "Door-to-door campaign" is pending approval',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    }
  ] : notifications;

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task-assigned':
        return <CheckSquare className="w-4 h-4 text-sky-600" />;
      case 'activity-submitted':
        return <Map className="w-4 h-4 text-emerald-600" />;
      case 'deadline-approaching':
        return <CheckSquare className="w-4 h-4 text-amber-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-slate-50';
    switch (type) {
      case 'task-assigned':
        return 'bg-sky-50 border-l-4 border-sky-500';
      case 'activity-submitted':
        return 'bg-emerald-50 border-l-4 border-emerald-500';
      case 'deadline-approaching':
        return 'bg-amber-50 border-l-4 border-amber-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('notificationJustNow');
    if (minutes < 60) return t('notificationMinutesAgo').replace('{count}', String(minutes));
    if (hours < 24) return t('notificationHoursAgo').replace('{count}', String(hours));
    return t('notificationDaysAgo').replace('{count}', String(days));
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Notification Panel */}
      <div
        className={`fixed right-0 top-14 h-[calc(100vh-56px)] w-[360px] bg-white border-l border-slate-200 shadow-xl z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="border-b border-slate-200 p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">{t('navbarNotifications')}</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-slate-500">
                {unreadCount} {t('notificationUnread')}
              </p>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {mockNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <CheckSquare className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">{t('notificationNoNotifications')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('notificationAllCaughtUp')}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {mockNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-100 transition-all hover:bg-slate-50 cursor-pointer ${getNotificationColor(
                    notification.type,
                    notification.read
                  )}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-sky-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>

                    <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead?.(notification.id)}
                          className="p-1.5 rounded hover:bg-slate-200 transition-all"
                          title={t('notificationMarkAsRead')}
                        >
                        <Check className="w-3 h-3 text-slate-600" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete?.(notification.id)}
                        className="p-1.5 rounded hover:bg-rose-100 transition-all"
                        title={t('notificationDelete')}
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {mockNotifications.length > 0 && (
          <div className="border-t border-slate-200 p-4">
            <button className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
              {t('notificationClearAll')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
