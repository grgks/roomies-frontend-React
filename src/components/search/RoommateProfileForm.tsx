import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { SmokingPreference, NoiseLevel, VisitorFrequency } from '@/types/enums';
import { RoommateProfileUpsertSchema } from '@/types/searchSchemas';
import type { RoommateProfileUpsert } from '@/types/searchSchemas';
import { getMyRoommateProfile, upsertMyRoommateProfile } from '@/api/searchApi';

interface RoommateProfileFormProps {
    onSuccess?: () => void;
}

const RoommateProfileForm = ({ onSuccess }: RoommateProfileFormProps) => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RoommateProfileUpsert>({
        resolver: zodResolver(RoommateProfileUpsertSchema(t)) as never,
    });

    useEffect(() => {
        getMyRoommateProfile()
            .then((data) => {
                if (!data) return; // 204 = no profile yet, form stays empty
                reset({
                    smoking: data.smoking ?? undefined,
                    hasPets: data.hasPets ?? false,
                    noiseLevel: data.noiseLevel ?? undefined,
                    visitors: data.visitors ?? undefined,
                    lgbtqFriendly: data.lgbtqFriendly ?? false,
                    age: data.age ?? undefined,
                });
            })
            .catch(() => {
                // Real error (e.g. roommate not found)
            })
            .finally(() => setLoading(false));
    }, [reset]);

    const onSubmit = async (data: RoommateProfileUpsert) => {
        setError(null);
        try {
            await upsertMyRoommateProfile(data);
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
            {/* Smoking */}
            <div>
                <label className="text-xs text-slate-500">{t('smoking')}</label>
                <select
                    {...register('smoking')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">{t('select')}</option>
                    {Object.values(SmokingPreference).filter(v => v !== 'NO_PREFERENCE').map((v) => (
                        <option key={v} value={v}>{t(v)}</option>
                    ))}
                </select>
                {errors.smoking && <p className="text-xs text-red-500 mt-0.5">{errors.smoking.message}</p>}
            </div>

            {/* Noise Level */}
            <div>
                <label className="text-xs text-slate-500">{t('noiseLevel')}</label>
                <select
                    {...register('noiseLevel')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">{t('select')}</option>
                    {Object.values(NoiseLevel).filter(v => v !== 'NO_PREFERENCE').map((v) => (
                        <option key={v} value={v}>{t(v)}</option>
                    ))}
                </select>
                {errors.noiseLevel && <p className="text-xs text-red-500 mt-0.5">{errors.noiseLevel.message}</p>}
            </div>

            {/* Visitors */}
            <div>
                <label className="text-xs text-slate-500">{t('visitors')}</label>
                <select
                    {...register('visitors')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">{t('select')}</option>
                    {Object.values(VisitorFrequency).filter(v => v !== 'NO_PREFERENCE').map((v) => (
                        <option key={v} value={v}>{t(v)}</option>
                    ))}
                </select>
                {errors.visitors && <p className="text-xs text-red-500 mt-0.5">{errors.visitors.message}</p>}
            </div>

            {/* Age */}
            <div>
                <label className="text-xs text-slate-500">{t('age')}</label>
                <input
                    type="number"
                    {...register('age')}
                    placeholder="18-99"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.age && <p className="text-xs text-red-500 mt-0.5">{errors.age.message}</p>}
            </div>

            {/* Has Pets */}
            <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                <span className="text-sm text-slate-700">{t('hasPets')}</span>
                <input
                    type="checkbox"
                    {...register('hasPets')}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
            </label>

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

export default RoommateProfileForm;