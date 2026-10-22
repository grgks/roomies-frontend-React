
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { HouseProfileUpsertSchema } from '@/types/searchSchemas';
import type { HouseProfileUpsert } from '@/types/searchSchemas';
import { getMyHouseProfile, upsertHouseProfile } from '@/api/searchApi';

interface Props {
    houseId: number;
    onSuccess?: () => void;
    showSkip?: boolean; // post-create flow: can skip
    onSkip?: () => void;
}

const HouseProfileForm = ({ houseId, onSuccess, showSkip, onSkip }: Props) => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<HouseProfileUpsert>({
        resolver: zodResolver(HouseProfileUpsertSchema(t)) as never,
    });

    // load existed profile if exists
    useEffect(() => {
        getMyHouseProfile()
            .then((data) => {
                if (!data) return; // 204 = no profile yet, form stays empty
                reset({
                    rent: data.rent ?? undefined,
                    hasHeating: data.hasHeating ?? false,
                    hasAirConditioning: data.hasAirConditioning ?? false,
                    furnished: data.furnished ?? false,
                });
            })
            .catch(() => {
                // Real error (e.g. no house owned)
            })
            .finally(() => setLoading(false));
    }, [reset]);

    const onSubmit = async (data: HouseProfileUpsert) => {
        setError(null);
        try {
            await upsertHouseProfile(houseId, data);
            onSuccess?.();
        } catch {
            setError(t('couldNotSaveProfile'));
        }
    };

    if (loading) {
        return <p className="text-xs text-slate-400 pl-7">{t('loading')}</p>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 pl-7 mt-1">
            {/* Rent */}
            <div>
                <label className="text-xs text-slate-500">{t('rent')} (€)</label>
                <input
                    type="number"
                    step="0.01"
                    {...register('rent')}
                    placeholder="0.00"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.rent && <p className="text-xs text-red-500 mt-0.5">{errors.rent.message}</p>}
            </div>

            {/* Has Heating */}
            <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                <span className="text-sm text-slate-700">{t('heating')}</span>
                <input
                    type="checkbox"
                    {...register('hasHeating')}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
            </label>

            {/* Has Air Conditioning */}
            <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                <span className="text-sm text-slate-700">{t('airConditioning')}</span>
                <input
                    type="checkbox"
                    {...register('hasAirConditioning')}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
            </label>

            {/* Furnished */}
            <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                <span className="text-sm text-slate-700">{t('furnished')}</span>
                <input
                    type="checkbox"
                    {...register('furnished')}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
            </label>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
                {isSubmitting ? t('saving') : t('saveChanges')}
            </button>

            {/* Skip button. only on post-create flow */}
            {showSkip && (
                <button
                    type="button"
                    onClick={onSkip}
                    className="text-sm text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                    {t('skip')}
                </button>
            )}
        </form>
    );
};

export default HouseProfileForm;