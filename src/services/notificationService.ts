import api from './api';
import { ApiResponse, Notification } from '../types';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications');
    return response.data.data;
  },

  getUnread: async (): Promise<Notification[]> => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications/unread');
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ unreadCount: number }>>('/notifications/count');
    return response.data.data.unreadCount;
  },

  markAsRead: async (id: number): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};
