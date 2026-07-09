import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquarePlus } from 'lucide-react';
import { sendMessage } from '@/api/messageApi';
import { type Message, type Roommate } from '@/types';
import FormField from '@/components/FormField';
import {useTranslation} from "react-i18next";
import { MessageInsertSchema } from '@/types';
import type { MessageInsert } from '@/types';

type SendMessageForm = Omit<MessageInsert, 'houseId'>;

interface SendMessageModalProps {
    houseId: number;
    roommates?: Roommate[];       // if exists -> private mode  dropdown
    defaultReceiverId?: number;   // pre-checked receiver
    onMessageSent: (message: Message) => void;
}

const SendMessageModal = ({ houseId, roommates, defaultReceiverId, onMessageSent }: SendMessageModalProps) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const SendMessageSchema = MessageInsertSchema(t).omit({ houseId: true });

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SendMessageForm>({
        resolver: zodResolver(SendMessageSchema),
        defaultValues: { receiverId: defaultReceiverId },
    });

    const onSubmit = async (data: SendMessageForm) => {
        try {
            const message = await sendMessage({
                content: data.content,
                houseId,
                receiverId: data.receiverId,
            });
            onMessageSent(message);
            reset();
            setOpen(false);
        } catch {
            //console.error('Could not send message');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                    <MessageSquarePlus size={18} />
                    {t('newMessage')}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {roommates ? t('sendPrivateMessage') : t('sendHouseMessage')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                    {roommates && (
                        <FormField label={t('to')} htmlFor="message-receiver-input" error={errors.receiverId?.message}>
                            <select
                                id="message-receiver-input"
                                {...register('receiverId', { valueAsNumber: true })}
                                className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">{t('selectRoommate')}</option>
                                {roommates.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.firstname} {r.lastname}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    )}

                    <FormField label={t('messages')}
                               htmlFor="message-content-input" error={errors.content?.message}>
                        <textarea
                            id="message-content-input"
                            {...register('content')}
                            rows={4}
                            placeholder={t('writeYourMessage')}
                            className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        />
                    </FormField>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {isSubmitting ? t('sending') : t('send')}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SendMessageModal;