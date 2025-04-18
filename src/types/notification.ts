export type NotificationType = 'claim' | 'update' | 'message' | 'favorite';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    medicineId?: string;
    claimId?: string;
    messageId?: string;
  };
} 