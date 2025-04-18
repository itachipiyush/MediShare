import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Notification, NotificationType } from '../types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ notifications: [], unreadCount: 0, isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      const unreadCount = data.filter(n => !n.read).length;
      set({ notifications: data, unreadCount, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch notifications', isLoading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to mark notification as read' });
    }
  },

  markAllAsRead: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('userId', user.id)
        .eq('read', false);

      if (error) throw error;

      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to mark all notifications as read' });
    }
  },

  addNotification: async (notification) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          createdAt: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        notifications: [data, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to add notification' });
    }
  },

  clearError: () => set({ error: null })
})); 