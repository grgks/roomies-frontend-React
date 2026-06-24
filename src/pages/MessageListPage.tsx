import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadSpinner';
import SendMessageModal from '@/components/SendMessageModal';
import {getMessagesByHouseId, getMyUnreadMessage} from '@/api/messageApi';
import { getActiveRoommates } from '@/api/roommateApi';
import type { Message, Roommate } from '@/types';
import {useTranslation} from "react-i18next";
import usePageTitle from "@/hooks/usePageTitle.ts";

const MessageListPage = () => {
    const { t } = useTranslation();
    const { houseId, roommateId } = useAuth();
    const navigate = useNavigate();

    const [houseMessages, setHouseMessages] = useState<Message[]>([]);
    const [roommates, setRoommates] = useState<Roommate[]>([]);
    const [loading, setLoading] = useState(true);

    const [unreadByRoommate, setUnreadByRoommate] = useState<Set<number>>(new Set());

    usePageTitle(t('messages'))

    useEffect(() => {
        if (!houseId) {
        setLoading(false);
        return;
    }
        const fetchData = async () => {
            try {
                const [msgs, rms, unread] = await Promise.all([
                    getMessagesByHouseId(houseId),
                    getActiveRoommates(),
                    getMyUnreadMessage(),
                ]);
                setHouseMessages(msgs);
                setRoommates(rms.filter(r => r.id !== roommateId));
                const unreadIds = new Set(unread.map(m => m.senderId));
                setUnreadByRoommate(unreadIds);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [houseId]);

    // Group private messages by conversation partner
    const privateConversations = roommates.map(r => ({
        roommate: r,
    }));

    if (loading) return <LoadingSpinner />;

    if (!houseId) return (
        <Layout>
            <div className="bg-slate-100 min-h-screen flex items-center justify-center">
                <p className="text-slate-500">{t('youNeedToBeInAHouseToUseMessages')}.</p>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="bg-emerald-200 px-6 pb-20 min-h-screen">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">
                    <h1 className="text-2xl font-bold text-slate-800">{t('messages')}</h1>

                    {/* House Chat */}
                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800">🏠 {t('houseChat')}</h2>
                            <SendMessageModal
                                houseId={houseId}
                                onMessageSent={msg => setHouseMessages(prev => [...prev, msg])}
                            />
                        </div>
                        {houseMessages.length === 0 ? (
                            <p className="text-slate-400 text-sm">{t('noMessagesYet')}.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {houseMessages.slice(-3).map(msg => (
                                    <div key={msg.id} className="flex justify-between items-center text-sm border-b pb-2">
                                        <span className="text-slate-600 font-medium">{msg.senderFullName}</span>
                                        <span className="text-slate-400 truncate max-w-xs">{msg.content}</span>
                                    </div>

                                ))}
                                <button
                                    className="text-indigo-500 text-sm hover:underline text-right"
                                    onClick={() => navigate(`/messages/house/${houseId}`)}
                                >
                                    {t('viewAll')} →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Private Messages */}
                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800">💬 {t('privateMessages')}</h2>
                            <SendMessageModal
                                houseId={houseId}
                                roommates={roommates}
                                onMessageSent={() => {}}
                            />
                        </div>
                        {privateConversations.length === 0 ? (
                            <p className="text-slate-400 text-sm">{t('noRoommatesYet')}</p>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                {privateConversations.map(({ roommate }) => (
                                    <div
                                        key={roommate.id}
                                        className="flex items-center justify-between border-b pb-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            {unreadByRoommate.has(roommate.id) && (
                                                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                            )}
                                        <span className="text-sm font-medium text-slate-700">
                                            {roommate.firstname} {roommate.lastname}
                                        </span>
                                        </div>
                                        <button
                                            className="text-indigo-500 text-sm hover:underline"
                                            onClick={() => navigate(`/messages/private/${roommate.id}`)}
                                        >
                                            {t('view')} →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default MessageListPage;