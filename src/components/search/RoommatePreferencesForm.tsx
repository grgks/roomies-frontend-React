import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
    SmokingPreference,
    PetPreference,
    NoiseLevel,
    VisitorFrequency,
    GenderPreference,
} from '@/types/enums';
import { RoommatePreferencesUpsertSchema } from '@/types/searchSchemas';
import type { RoommatePreferencesUpsert } from '@/types/searchSchemas';
import { getMyRoommatePreferences, upsertMyRoommatePreferences } from '@/api/searchApi';

interface RoommatePreferencesFormProps {
    onSuccess?: () => void;
}

const RoommatePreferencesForm = ({ onSuccess }: RoommatePreferencesFormProps) => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RoommatePreferencesUpsert>({
        resolver: zodResolver(RoommatePreferencesUpsertSchema(t)) as never,
    });

    useEffect(() => {
        getMyRoommatePreferences()
            .then((data) => {
                if (!data) return; // 204 = not filled yet
                reset({
                    smoking: data.smoking ?? undefined,
                    pets: data.pets ?? undefined,
                    noiseLevel: data.noiseLevel ?? undefined,
                    visitors: data.visitors ?? undefined,
                    genderPreference: data.genderPreference ?? undefined,
                    lgbtqFriendly: data.lgbtqFriendly ?? false,
                    minAge: data.minAge ?? undefined,
                    maxAge: data.maxAge ?? undefined,
                });
            })
            .catch(() => {
                // 404 = no preferences yet
            })
            .finally(() => setLoading(false));
    }, [reset]);

    const onSubmit = async (data: RoommatePreferencesUpsert) => {
        setError(null);
        try {
            await upsertMyRoommatePreferences(data);
            onSuccess?.();
        } catch {
            setError(t('couldNotSavePreferences'));
        }
    };

    if (loading) {
        return <p className="text-xs text-slate-400 pl-7">{t('loading')}</p>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 pl-7 mt-1">
            {/* Smoking Preference */}
            <div>
                <label className="text-xs text-slate-500">{t('smokingPreference')}</label>
                <select
                    {...register('smoking')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">{t('select')}</option>
                    {Object.values(SmokingPreference).map((v) => (
                        <option key={v} value={v}>{t(v)}</option>
                    ))}
                </select>
                {errors.smoking && <p className="text-xs text-red-500 mt-0.5">{errors.smoking.message}</p>}
            </div>

            {/* Pet Preference */}
            <div>
                <label className="text-xs text-slate-500">{t('petPreference')}</label>
                <select
                    {...register('pets')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">{t('select')}</option>
                    {Object.values(PetPreference).map((v) => (
                        <option key={v} value={v}>{t(v)}</option>
                    ))}
                </select>
                {errors.pets && <p className="text-xs text-red-500 mt-0.5">{errors.pets.message}</p>}
            </div>

            {/* Noise Level */}
            <div>
                <label className="text-xs text-slate-500">{t('noiseLevelPreference')}</label>
                <select
                    {...register('noiseLevel')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">{t('select')}</option>
                    {Object.values(NoiseLevel).map((v) => (
                        <option key={v} value={v}>{t(v)}</option>
                    ))}
                </select>
                {errors.noiseLevel && <p className="text-xs text-red-500 mt-0.5">{errors.noiseLevel.message}</p>}
            </div>

            {/* Visitors */}
            <div>
                <label className="text-xs text-slate-500">{t('visitorsPreference')}</label>
                <select
                    {...register('visitors')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">{t('select')}</option>
                    {Object.values(VisitorFrequency).map((v) => (
                        <option key={v} value={v}>{t(v)}</option>
                    ))}
                </select>
                {errors.visitors && <p className="text-xs text-red-500 mt-0.5">{errors.visitors.message}</p>}
            </div>

            {/* Gender Preference */}
            <div>
                <label className="text-xs text-slate-500">{t('genderPreference')}</label>
                <select
                    {...register('genderPreference')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">{t('select')}</option>
                    {Object.values(GenderPreference).map((v) => (
                        <option key={v} value={v}>{t(v)}</option>
                    ))}
                </select>
                {errors.genderPreference && <p className="text-xs text-red-500 mt-0.5">{errors.genderPreference.message}</p>}
            </div>

            {/* Age Range */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="text-xs text-slate-500">{t('minAge')}</label>
                    <input
                        type="number"
                        {...register('minAge')}
                        placeholder="18"
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    {errors.minAge && <p className="text-xs text-red-500 mt-0.5">{errors.minAge.message}</p>}
                </div>
                <div className="flex-1">
                    <label className="text-xs text-slate-500">{t('maxAge')}</label>
                    <input
                        type="number"
                        {...register('maxAge')}
                        placeholder="99"
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    {errors.maxAge && <p className="text-xs text-red-500 mt-0.5">{errors.maxAge.message}</p>}
                </div>
            </div>

            {/* LGBTQ+ Friendly */}
            <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                <span className="text-sm text-slate-700">{t('lgbtqFriendly')}</span>
                <input
                    type="checkbox"
                    {...register('lgbtqFriendly')}
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
        </form>
    );
};

export default RoommatePreferencesForm;