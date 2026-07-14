import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, MessageCircle, Receipt, Mail } from 'lucide-react';
import useNotifications from '@/hooks/useNotifications';
import type { Notification } from '@/context/NotificationContext';
import { useTranslation } from 'react-i18next';

const getNotificationRoute = (notification: Notification): string => {
    switch (notification.type) {
        case 'NEW_MESSAGE':       return '/messages';
        case 'NEW_EXPENSE_SPLIT': return '/expenses';
        case 'NEW_INVITATION':    return '/invitations';
        default:                  return '/dashboard';
    }
};

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'NEW_MESSAGE':       return <MessageCircle size={14} className="text-purple-500" />;
        case 'NEW_EXPENSE_SPLIT': return <Receipt size={14} className="text-green-500" />;
        case 'NEW_INVITATION':    return <Mail size={14} className="text-blue-500" />;
    }
};

interface NotificationPanelProps {
    open: boolean;
    onClose: () => void;
}

const NotificationPanel = ({ open, onClose }: NotificationPanelProps) => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [tab, setTab] = useState<'all' | 'unread'>('all');

    if (!open) return null;

    const filtered = tab === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const handleClick = (notification: Notification) => {
        if (notification.id && !notification.isRead) {
            markAsRead(notification.id);
        }
        navigate(getNotificationRoute(notification));
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute -right-5 top-15 w-65 max-w-[90vw] bg-slate-100 rounded-xl shadow-xl border border-slate-400 z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <Bell size={15} className="text-purple-600" />
                        <span className="text-sm font-semibold text-slate-700">{t('notifications')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {notifications.some(n => !n.isRead) && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-slate-400 hover:text-slate-600 transition">
                                {t('markAllRead')}
                            </button>
                        )}
                        <button onClick={onClose} className="text-slate-500 hover:text-slate-600" aria-label="Close notifications">
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => setTab('all')}
                        className={`flex-1 text-xs py-2 transition ${tab === 'all' ? 'text-purple-600 font-semibold border-b-2 border-purple-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        {t('all')}
                    </button>
                    <button
                        onClick={() => setTab('unread')}
                        className={`flex-1 text-xs py-2 transition ${tab === 'unread' ? 'text-purple-600 font-semibold border-b-2 border-purple-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        {t('unread')}
                    </button>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                            <Bell size={28} className="mb-2 opacity-30" />
                            <p className="text-sm">{t('noNotifications')}</p>
                        </div>
                    ) : (
                        filtered.map((n) => (
                            <div
                                key={n.id ?? n.createdAt}
                                onClick={() => handleClick(n)}
                                className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition
                                    ${!n.isRead ? 'bg-white/80' : 'opacity-60'}`}>
                                <div className="mt-0.5">
                                    {!n.isRead && <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-1" />}
                                    {getNotificationIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate ${!n.isRead ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                        {n.message}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {new Date(n.createdAt).toLocaleTimeString('el-GR', {
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;