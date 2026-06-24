import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { adminChangeHouseOwner, adminGetRoommatesByHouse } from '@/api/generalAdminApi';
import type { House, AdminRoommate } from '@/types';
import { ArrowRightLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChangeOwnerModalProps {
    house: House;
    onOwnerChanged: (house: House) => void;
}

const ChangeOwnerModal = ({ house, onOwnerChanged }: ChangeOwnerModalProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [roommates, setRoommates] = useState<AdminRoommate[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            adminGetRoommatesByHouse(house.id).then(setRoommates).catch(() => setRoommates([]));
        } else {
            setSelectedId('');
            setError(null);
        }
    }, [open, house.id]);

    const handleSubmit = async () => {
        if (selectedId === '') {
            setError(t('selectRoommateRequired'));
            return;
        }
        setError(null);
        setSubmitting(true);
        try {
            const updated = await adminChangeHouseOwner(house.id, selectedId);
            onOwnerChanged(updated);
            setOpen(false);
        } catch {
            setError(t('couldNotChangeOwner'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{t('changeOwnerDetails')}</DialogDescription>
            <DialogTrigger asChild>
                <button title={t('changeOwner')} className="text-amber-500 hover:text-amber-700">
                    <ArrowRightLeft size={16} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('changeOwner')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-2">
                    <select
                        value={selectedId}
                        onChange={e => setSelectedId(e.target.value === '' ? '' : Number(e.target.value))}
                        className="border rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">{t('selectNewOwner')}</option>
                        {roommates
                            .filter(r => r.id !== house.ownerId)
                            .map(r => (
                                <option key={r.id} value={r.id}>{r.firstname} {r.lastname}</option>
                            ))}
                    </select>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <Button disabled={submitting} onClick={handleSubmit}>
                        {submitting ? t('saving') : t('saveChanges')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeOwnerModal;