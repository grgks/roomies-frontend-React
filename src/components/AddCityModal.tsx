import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { adminAddCity } from '@/api/generalAdminApi';
import { CityInsert } from '@/types';
import type { City } from '@/types';
import FormField from '@/components/FormField';
import { useTranslation } from 'react-i18next';

interface AddCityModalProps {
    onCityAdded: (city: City) => void;
}

const AddCityModal = ({ onCityAdded }: AddCityModalProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CityInsert>({
        resolver: zodResolver(CityInsert) as never,
    });

    const onSubmit = async (data: CityInsert) => {
        try {
            const city = await adminAddCity(data);
            onCityAdded(city);
            reset();
            setOpen(false);
        } catch {
            console.error('Could not create city');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{t('addCity')}</DialogDescription>
            <DialogTrigger asChild>
                <button
                    id="add-city-btn"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    {t('addCity')}
                </button>
            </DialogTrigger>
            <DialogContent id="add-city-modal">
                <DialogHeader>
                    <DialogTitle>{t('addCity')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                    <FormField label={t('cityName')} htmlFor="city-name-input" error={errors.name?.message}>
                        <input
                            id="city-name-input"
                            {...register('name')}
                            className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <button
                        id="city-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {isSubmitting ? t('saving') : t('addCity')}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCityModal;