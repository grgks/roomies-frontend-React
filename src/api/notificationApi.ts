import axiosInstance from '@/services/axiosInstance';

export interface NotificationDTO {
    id: number;
    type: 'NEW_MESSAGE' | 'NEW_INVITATION' | 'NEW_EXPENSE_SPLIT';
    message: string;
    referenceId: number;
    isRead: boolean;
    createdAt: string;
}

export const getMyNotifications = async (): Promise<NotificationDTO[]> => {
    const res = await axiosInstance.get('/api/notifications');
    return res.data;
};

export const getUnreadCount = async (): Promise<number> => {
    const res = await axiosInstance.get('/api/notifications/unread-count');
    return res.data;
};

export const markAsRead = async (id: number): Promise<void> => {
    await axiosInstance.put(`/api/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
    await axiosInstance.put('/api/notifications/read-all');
};