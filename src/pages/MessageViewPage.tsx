import { useEffect, useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadSpinner';
import { getMessagesByHouseId, getMySentMessage, getMyReceivedMessage, sendMessage, markMessageAsRead } from '@/api/messageApi';
import type { Message } from '@/types';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import {useTranslation} from "react-i18next";

const MessageViewPage = () => {

    const { t } = useTranslation();
    const { houseId: houseIdParam, roommateId: roommateIdParam } = useParams();
    const { houseId, roommateId } = useAuth();
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const isHouseChat = !!houseIdParam;
    const targetRoommateId = roommateIdParam ? parseInt(roommateIdParam) : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isHouseChat && houseId) {
                    const msgs = await getMessagesByHouseId(houseId);
                    setMessages(msgs);
                } else if (targetRoommateId) {
                    const [sent, received] = await Promise.all([
                        getMySentMessage(),
                        getMyReceivedMessage(),
                    ]);
                    const conversation = [
                        ...sent.filter(m => m.receiverId === targetRoommateId),
                        ...received.filter(m => m.senderId === targetRoommateId),
                    ].sort((a, b) =>
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    );
                    setMessages(conversation);

                    // mark unread as read
                    const unread = received.filter(m => m.senderId === targetRoommateId && !m.isRead);
                    await Promise.all(unread.map(m => markMessageAsRead(m.id)));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [houseIdParam, roommateIdParam]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!content.trim() || !houseId) return;
        setSending(true);
        try {
            const msg = await sendMessage({
                content,
                houseId,
                receiverId: isHouseChat ? undefined : targetRoommateId ?? undefined,
            });
            setMessages(prev => [...prev, msg]);
            setContent('');
        } catch {
            //console.error('Could not send message');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr: string) =>
        new Date(dateStr).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });

    if (loading) return <LoadingSpinner />;

    const otherPerson = messages.find(m => m.senderId !== roommateId)?.senderFullName
        ?? messages.find(m => m.senderId === roommateId)?.receiverFullName
        ?? 'Private Chat';

    const title = isHouseChat ? `🏠 ${t('houseChat')}` : otherPerson;

    return (
        <Layout>
            <div className="bg-slate-100 px-6 pt-5 ">
                <div className="max-w-2xl mx-auto flex flex-col gap-4">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
                        <Button className="bg-purple-300" variant="outline"  size="sm" onClick={() => navigate('/messages')}>
                            {t('back')}
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3 h-[40vh] overflow-y-auto">
                        {messages.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center mt-8">{t('noMessagesYet')}.</p>
                        ) : (
                            messages.map(msg => {
                                const isMine = msg.senderId === roommateId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col max-w-[75%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}
                                    >
                                        {!isMine && (
                                            <span className="text-xs text-slate-400 mb-1">{msg.senderFullName}</span>
                                        )}
                                        <div className={`px-4 py-2 rounded-2xl text-sm ${
                                            isMine
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                        }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-xs text-slate-400 mt-1">{formatTime(msg.createdAt)}</span>
                                    </div>
                                );
                            })
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="bg-white rounded-2xl shadow-md p-4 flex gap-3 items-end">
                        <textarea
                            className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                            rows={2}
                            placeholder= {t('writeAMessage')}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <Button
                            disabled={sending || !content.trim()}
                            onClick={handleSend}
                        >
                            <Send size={16} />
                        </Button>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default MessageViewPage;