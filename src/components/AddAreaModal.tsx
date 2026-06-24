import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { adminAddArea } from '@/api/generalAdminApi';
import { getAllCities } from '@/api/staticApi';
import { AreaInsert } from '@/types';
import type { Area, City } from '@/types';
import FormField from '@/components/FormField';
import { useTranslation } from 'react-i18next';

interface AddAreaModalProps {
    onAreaAdded: (area: Area) => void;
}

const AddAreaModal = ({ onAreaAdded }: AddAreaModalProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [cities, setCities] = useState<City[]>([]);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AreaInsert>({
        resolver: zodResolver(AreaInsert) as never,
    });

    useEffect(() => {
        if (open) {
            getAllCities().then(setCities);
        }
    }, [open]);

    const onSubmit = async (data: AreaInsert) => {
        try {
            const area = await adminAddArea(data);
            onAreaAdded(area);
            reset();
            setOpen(false);
        } catch {
            console.error('Could not create area');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{t('addArea')}</DialogDescription>
            <DialogTrigger asChild>
                <button
                    id="add-area-btn"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    {t('addArea')}
                </button>
            </DialogTrigger>
            <DialogContent id="add-area-modal">
                <DialogHeader>
                    <DialogTitle>{t('addArea')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                    <FormField label={t('areaName')} htmlFor="area-name-input" error={errors.name?.message}>
                        <input
                            id="area-name-input"
                            {...register('name')}
                            className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={t('city')} htmlFor="area-city-select" error={errors.cityId?.message}>
                        <select
                            id="area-city-select"
                            {...register('cityId', { valueAsNumber: true })}
                            className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="">{t('selectCity')}</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label={t('postalCode')} htmlFor="area-postal-input" error={errors.postalCode?.message}>
                        <input
                            id="area-postal-input"
                            {...register('postalCode')}
                            className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <button
                        id="area-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {isSubmitting ? t('saving') : t('addArea')}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddAreaModal;