import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../store/notification-store';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fadeIn, slideIn, scaleIn } from '../lib/animations';
import { theme } from '../lib/theme';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId);
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <motion.div className="relative" initial="hidden" animate="visible" variants={fadeIn}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-5 w-5 text-secondary-600" />
          {unreadCount > 0 && (
            <motion.span
              className={`absolute -top-1 -right-1 h-4 w-4 rounded-full ${theme.gradients.primary} text-white text-xs flex items-center justify-center`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
              <h3 className="font-semibold text-secondary-900">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-secondary-500 hover:text-secondary-900"
                >
                  Mark all as read
                </Button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <motion.div
                  className="p-4 text-center text-secondary-500"
                  variants={fadeIn}
                >
                  Loading...
                </motion.div>
              ) : notifications.length === 0 ? (
                <motion.div
                  className="p-4 text-center text-secondary-500"
                  variants={fadeIn}
                >
                  No notifications
                </motion.div>
              ) : (
                <motion.div
                  className="divide-y divide-secondary-200"
                  variants={slideIn}
                >
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 hover:bg-secondary-50 cursor-pointer ${
                        !notification.read ? 'bg-primary-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      variants={scaleIn}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-secondary-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-secondary-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-secondary-500 mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!notification.read && (
                          <motion.span
                            className={`h-2 w-2 rounded-full ${theme.gradients.primary}`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 