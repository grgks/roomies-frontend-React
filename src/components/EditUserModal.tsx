import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateUser } from '@/api/userAdminApi';
import { UserAdminUpdate } from '@/types';
import type { User } from '@/types';
import { Pencil } from 'lucide-react';
import FormField from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface EditUserModalProps {
    user: User;
    onUserUpdated: (user: User) => void;
}

const EditUserModal = ({ user, onUserUpdated }: EditUserModalProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [pendingData, setPendingData] = useState<UserAdminUpdate | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserAdminUpdate>({
        resolver: zodResolver(UserAdminUpdate) as never,
        defaultValues: {
            id: user.id,
            keycloakId: user.keycloakId,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isActive: user.isActive,
        },
    });

    const performUpdate = async (data: UserAdminUpdate) => {
        try {
            const updated = await updateUser(user.id, data);
            onUserUpdated(updated);
            setOpen(false);
            setPendingData(null);
        } catch {
            //console.error('Could not update user');
        }
    };

    const onSubmit = async (data: UserAdminUpdate) => {
        // Email is also the Keycloak login username. warn before changing it
        if (data.email !== user.email) {
            setPendingData(data);
            return;
        }
        await performUpdate(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{t('editUserDetails')}</DialogDescription>
            <DialogTrigger asChild>
                <button className="text-indigo-400 hover:text-indigo-600" title={t('edit')}>
                    <Pencil size={16} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('editUser')}</DialogTitle>
                </DialogHeader>

                {pendingData ? (
                    <div className="flex flex-col gap-4 mt-2">
                        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            {t('emailChangeWarning')}
                        </p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setPendingData(null)}>
                                {t('cancel')}
                            </Button>
                            <Button variant="destructive" onClick={() => performUpdate(pendingData)}>
                                {t('confirmEmailChange')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                        <FormField label={t('email')} htmlFor="edit-user-email-input" error={errors.email?.message}>
                            <input
                                id="edit-user-email-input"
                                {...register('email')}
                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </FormField>

                        <FormField label={t('phoneNumber')} htmlFor="edit-user-phone-input" error={errors.phoneNumber?.message}>
                            <input
                                id="edit-user-phone-input"
                                {...register('phoneNumber')}
                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </FormField>

                        <div className="flex items-center justify-between">
                            <label htmlFor="edit-user-active-checkbox" className="text-sm text-slate-600">{t('active')}</label>
                            <input
                                id="edit-user-active-checkbox"
                                type="checkbox"
                                {...register('isActive')}
                                className="w-4 h-4"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                        >
                            {isSubmitting ? t('saving') : t('saveChanges')}
                        </button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditUserModal;