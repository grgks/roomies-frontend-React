import { useNavigate } from 'react-router-dom';
import { Bell, X, MessageCircle, Receipt, Mail } from 'lucide-react';
import { useNotifications, type Notification } from '@/context/NotificationContext';
import {useTranslation} from "react-i18next";

const getNotificationRoute = (notification: Notification): string => {
    switch (notification.type) {
        case 'NEW_MESSAGE':    return '/messages';
        case 'NEW_EXPENSE_SPLIT': return '/expenses';
        case 'NEW_INVITATION': return '/invitations';
        default: return '/dashboard';
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
    const { notifications, clearNotifications, removeNotification } = useNotifications();
    const navigate = useNavigate();

    const{t}  = useTranslation();

    if (!open) return null;

    const handleClick = (notification: Notification) => {
        navigate(getNotificationRoute(notification));
        removeNotification(notification.createdAt);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Panel */}
            <div className="absolute -right-5 top-15 w-65 max-w-[90vw] bg-slate-300 rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <Bell size={15} className="text-purple-600" />
                        <span className="text-sm font-semibold text-slate-700">{t('notifications')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                            <button
                                onClick={clearNotifications}
                                className="text-xs text-slate-400 hover:text-slate-600 transition">
                                {t('clearAll')}
                            </button>
                        )}
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X size={15} />
                        </button>
                    </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                            <Bell size={28} className="mb-2 opacity-30" />
                            <p className="text-sm">{t('noNotifications')}</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.createdAt}
                                onClick={() => handleClick(n)}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition">
                                <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-700 truncate">{n.message}</p>
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