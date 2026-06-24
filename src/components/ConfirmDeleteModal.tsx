import { useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConfirmDeleteModalProps {
    onConfirm: () => Promise<void>;
    triggerIcon?: ReactNode;
    title: string;
    message: string;
    disabled?: boolean;
    disabledTitle?: string;
}

const ConfirmDeleteModal = ({ onConfirm, triggerIcon, title, message, disabled, disabledTitle }: ConfirmDeleteModalProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            await onConfirm();
            setOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{title}</DialogDescription>
            <DialogTrigger asChild>
                <button
                    disabled={disabled}
                    title={disabled ? disabledTitle : title}
                    className="text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    {triggerIcon ?? <Trash2 size={16} />}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-2">
                    <p className="text-sm text-slate-600">{message}</p>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            {t('cancel')}
                        </Button>
                        <Button variant="destructive" disabled={submitting} onClick={handleConfirm}>
                            {submitting ? t('deleting') : t('confirmDelete')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteModal;