import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { adminUpdateRoommate } from '@/api/generalAdminApi';
import { RoommateAdminUpdateSchema } from '@/types';
import type { AdminRoommate, RoommateAdminUpdate } from '@/types';
import { Gender } from '@/types/enums';
import { Pencil } from 'lucide-react';
import FormField from '@/components/FormField';
import { useTranslation } from 'react-i18next';

interface EditRoommateModalProps {
    roommate: AdminRoommate;
    onRoommateUpdated: (roommate: AdminRoommate) => void;
}

const EditAdminRoommateModal = ({ roommate, onRoommateUpdated }: EditRoommateModalProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RoommateAdminUpdate>({
        resolver: zodResolver(RoommateAdminUpdateSchema(t)) as never,
        defaultValues: {
            firstname: roommate.firstname,
            lastname: roommate.lastname,
            gender: roommate.gender,
        },
    });

    const onSubmit = async (data: RoommateAdminUpdate) => {
        try {
            const updated = await adminUpdateRoommate(roommate.id, data);
            onRoommateUpdated(updated);
            setOpen(false);
        } catch {
            //console.error('Could not update roommate');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{t('editRoommateDetails')}</DialogDescription>
            <DialogTrigger asChild>
                <button title={t('edit')} className="text-indigo-400 hover:text-indigo-600">
                    <Pencil size={16} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('editRoommate')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                    <FormField label={t('firstname')} htmlFor="edit-roommate-firstname-input" error={errors.firstname?.message}>
                        <input
                            id="edit-roommate-firstname-input"
                            {...register('firstname')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={t('lastname')} htmlFor="edit-roommate-lastname-input" error={errors.lastname?.message}>
                        <input
                            id="edit-roommate-lastname-input"
                            {...register('lastname')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={t('gender')} htmlFor="edit-roommate-gender-select" error={errors.gender?.message}>
                        <select
                            id="edit-roommate-gender-select"
                            {...register('gender')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {Object.values(Gender).map(g => (
                                <option key={g} value={g}>{t(g)}</option>
                            ))}
                        </select>
                    </FormField>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {isSubmitting ? t('saving') : t('saveChanges')}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditAdminRoommateModal;