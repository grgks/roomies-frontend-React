import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { connectStomp, disconnectStomp } from '@/services/stompService';
import useAuth from '@/hooks/useAuth';

export type NotificationType = 'NEW_MESSAGE' | 'NEW_INVITATION' | 'NEW_EXPENSE_SPLIT';

export interface Notification {
    type: NotificationType;
    message: string;
    referenceId: number;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    clearNotifications: () => void;
    removeNotification: (createdAt: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { isAuthenticated } = useAuth();

    const handleNotification = useCallback((notification: unknown) => {
        setNotifications(prev => [notification as Notification, ...prev]);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            connectStomp(handleNotification);
        }
        return () => {
            disconnectStomp();
        };
    }, [isAuthenticated, handleNotification]);

    const clearNotifications = () => setNotifications([]);
    const removeNotification = (createdAt: string) =>
        setNotifications(prev => prev.filter(n => n.createdAt !== createdAt));
    const unreadCount = notifications.length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, clearNotifications, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};