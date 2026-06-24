import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { resetUserPassword } from '@/api/userAdminApi';
import { AdminPasswordReset } from '@/types';
import { Key, Eye, EyeOff } from 'lucide-react';
import FormField from '@/components/FormField';
import { useTranslation } from 'react-i18next';

interface ResetPasswordModalProps {
    userId: number;
    disabled?: boolean;
}

const ResetPasswordModal = ({ userId, disabled }: ResetPasswordModalProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AdminPasswordReset>({
        resolver: zodResolver(AdminPasswordReset) as never,
    });

    const onSubmit = async (data: AdminPasswordReset) => {
        try {
            await resetUserPassword(userId, data.newPassword);
            setSuccess(true);
            reset();
        } catch {
            //console.error('Could not reset password');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => {
            setOpen(o);
            if (!o) { setSuccess(false); reset(); }
        }}>
            <DialogDescription className="sr-only">{t('resetPasswordDetails')}</DialogDescription>
            <DialogTrigger asChild>
                <button
                    disabled={disabled}
                    title={disabled ? t('onlySuperAdminCanDoThis') : t('resetPassword')}
                    className="text-amber-500 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Key size={16} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('resetPassword')}</DialogTitle>
                </DialogHeader>
                {success ? (
                    <p className="text-sm text-green-600 mt-2">{t('passwordResetSuccessfully')}</p>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-2">

                        <FormField label={t('newPassword')} htmlFor="reset-password-input" error={errors.newPassword?.message}>
                            <div className="relative">
                                <input
                                    id="reset-password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('newPassword')}
                                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </FormField>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                        >
                            {isSubmitting ? t('saving') : t('resetPassword')}
                        </button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ResetPasswordModal;