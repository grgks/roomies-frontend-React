import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { adminUpdateHouse } from '@/api/generalAdminApi';
import { HouseUpdate } from '@/types';
import type { House } from '@/types';
import { Pencil } from 'lucide-react';
import FormField from '@/components/FormField';
import { useTranslation } from 'react-i18next';

interface EditHouseModalProps {
    house: House;
    onHouseUpdated: (house: House) => void;
}

const EditHouseModal = ({ house, onHouseUpdated }: EditHouseModalProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HouseUpdate>({
        resolver: zodResolver(HouseUpdate) as never,
        defaultValues: {
            address: house.address,
            addressNumber: house.addressNumber,
            apartment: house.apartment,
            numOfRooms: house.numOfRooms,
        },
    });

    const onSubmit = async (data: HouseUpdate) => {
        try {
            const updated = await adminUpdateHouse(house.id, data);
            onHouseUpdated(updated);
            setOpen(false);
        } catch {
            console.error('Could not update house');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{t('editHouseDetails')}</DialogDescription>
            <DialogTrigger asChild>
                <button title={t('edit')} className="text-indigo-400 hover:text-indigo-600">
                    <Pencil size={16} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('editHouse')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                    <FormField label={t('address')} htmlFor="edit-house-address-input" error={errors.address?.message}>
                        <input
                            id="edit-house-address-input"
                            {...register('address')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={t('addressNumber')} htmlFor="edit-house-addressnumber-input" error={errors.addressNumber?.message}>
                        <input
                            id="edit-house-addressnumber-input"
                            {...register('addressNumber')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={t('apartment')} htmlFor="edit-house-apartment-input" error={errors.apartment?.message}>
                        <input
                            id="edit-house-apartment-input"
                            {...register('apartment')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={t('numberOfRooms')} htmlFor="edit-house-numrooms-input" error={errors.numOfRooms?.message}>
                        <input
                            id="edit-house-numrooms-input"
                            type="number"
                            {...register('numOfRooms', { valueAsNumber: true })}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
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

export default EditHouseModal;