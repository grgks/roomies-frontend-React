import { createContext, useState, useEffect, useCallback } from 'react';
import { connectStomp, disconnectStomp } from '@/services/stompService';
import useAuth from '@/hooks/useAuth';
import {
    getMyNotifications,
    getUnreadCount,
    markAsRead as apiMarkAsRead,
    markAllAsRead as apiMarkAllAsRead,
    type NotificationDTO
} from '@/api/notificationApi';

export type NotificationType = 'NEW_MESSAGE' | 'NEW_INVITATION' | 'NEW_EXPENSE_SPLIT';

export interface Notification {
    id: number | null;
    type: NotificationType;
    message: string;
    referenceId: number;
    isRead: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const mapDTO = (dto: NotificationDTO): Notification => ({
    id: dto.id,
    type: dto.type,
    message: dto.message,
    referenceId: dto.referenceId,
    isRead: dto.isRead,
    createdAt: dto.createdAt,
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            getMyNotifications().then(data => {
                setNotifications(data.map(mapDTO));
            }).catch(() => {});

            getUnreadCount().then(count => {
                setUnreadCount(count);
            }).catch(() => {});
        }
    }, [isAuthenticated]);

    const handleNotification = useCallback((raw: unknown) => {
        const n = raw as NotificationDTO;
        setNotifications(prev => [mapDTO(n), ...prev]);
        setUnreadCount(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            connectStomp(handleNotification);
        }
        return () => {
            disconnectStomp();
        };
    }, [isAuthenticated, handleNotification]);

    const markAsRead = (id: number) => {
        apiMarkAsRead(id).then(() => {
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }).catch(() => {});
    };

    const markAllAsRead = () => {
        apiMarkAllAsRead().then(() => {
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
            setUnreadCount(0);
        }).catch(() => {});
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};