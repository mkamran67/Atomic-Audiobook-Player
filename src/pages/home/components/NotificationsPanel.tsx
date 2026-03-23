import { useEffect, useRef } from 'react';
import { notifications as initialNotifications, Notification } from '../../../mocks/notifications';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
}

export default function NotificationsPanel({
  open,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 dark:text-white text-base">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="overflow-y-auto max-h-[420px] divide-y divide-gray-50 dark:divide-gray-800">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <i className="ri-notification-off-line text-2xl text-gray-400 dark:text-gray-500"></i>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`w-full text-left flex items-start gap-3 px-5 py-4 transition-colors cursor-pointer group ${
                n.read
                  ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  : 'bg-purple-50/60 dark:bg-purple-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${n.iconBg}`}>
                <i className={`${n.icon} text-lg ${n.iconColor}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className={`text-sm font-semibold truncate ${n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                    {n.title}
                  </span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-0.5"></span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{n.message}</p>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">{n.time}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <button
          onClick={onClose}
          className="w-full text-center text-sm text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          View all activity
        </button>
      </div>
    </div>
  );
}

export { initialNotifications };
