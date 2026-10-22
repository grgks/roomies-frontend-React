import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { HousePreferencesUpsertSchema } from '@/types/searchSchemas';
import type { HousePreferencesUpsert } from '@/types/searchSchemas';
import type { City, Area } from '@/types';
import { getMyHousePreferences, upsertMyHousePreferences } from '@/api/searchApi';
import { getAllCities, getAllAreas } from '@/api/staticApi';

interface HousePreferencesFormProps {
    onSuccess?: () => void;
}

const HousePreferencesForm = ({ onSuccess }: HousePreferencesFormProps) => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState<City[]>([]);
    const [allAreas, setAllAreas] = useState<Area[]>([]);
    const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<HousePreferencesUpsert>({
        resolver: zodResolver(HousePreferencesUpsertSchema(t)) as never,
    });

    // Watch cityId to filter areas
    const selectedCityId = watch('cityId');

    useEffect(() => {
        if (selectedCityId) {
            const filtered = allAreas.filter((a) => a.cityId === Number(selectedCityId));
            setFilteredAreas(filtered);
        } else {
            setFilteredAreas([]);
            setValue('areaId', undefined as never); // reset area when city cleared
        }
    }, [selectedCityId, allAreas, setValue]);

    useEffect(() => {
        Promise.all([
            getAllCities(),
            getAllAreas(),
            getMyHousePreferences(), // returns null for 204.  handled by if (prefsData) below
        ]).then(([citiesData, areasData, prefsData]) => {
            setCities(citiesData);
            setAllAreas(areasData);

            if (prefsData) {
                // Pre-filter areas for the saved city
                if (prefsData.cityId) {
                    setFilteredAreas(areasData.filter((a) => a.cityId === Number(prefsData.cityId)));
                }
                reset({
                    cityId: prefsData.cityId ?? undefined,
                    areaId: prefsData.areaId ?? undefined,
                    minRooms: prefsData.minRooms ?? undefined,
                    maxRooms: prefsData.maxRooms ?? undefined,
                    hasPhotosOnly: prefsData.hasPhotosOnly ?? false,
                    minBudget: prefsData.minBudget ?? undefined,
                    maxBudget: prefsData.maxBudget ?? undefined,
                    requiresHeating: prefsData.requiresHeating ?? false,
                    requiresAirConditioning: prefsData.requiresAirConditioning ?? false,
                    requiresFurnished: prefsData.requiresFurnished ?? false,
                });
            }
        }).finally(() => setLoading(false));
    }, [reset]);

    const onSubmit = async (data: HousePreferencesUpsert) => {
        setError(null);
        try {
            await upsertMyHousePreferences(data);
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
            {/* City */}
            <div>
                <label className="text-xs text-slate-500">{t('city')}</label>
                <select
                    {...register('cityId')}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="">{t('selectCity')}</option>
                    {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {errors.cityId && <p className="text-xs text-red-500 mt-0.5">{errors.cityId.message}</p>}
            </div>

            {/* Area — appears when city is chosen */}
            {filteredAreas.length > 0 && (
                <div>
                    <label className="text-xs text-slate-500">{t('area')}</label>
                    <select
                        {...register('areaId')}
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <option value="">{t('selectArea')}</option>
                        {filteredAreas.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                    {errors.areaId && <p className="text-xs text-red-500 mt-0.5">{errors.areaId.message}</p>}
                </div>
            )}

            {/* Rooms Range */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="text-xs text-slate-500">{t('minRooms')}</label>
                    <input
                        type="number"
                        {...register('minRooms')}
                        placeholder="1"
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    {errors.minRooms && <p className="text-xs text-red-500 mt-0.5">{errors.minRooms.message}</p>}
                </div>
                <div className="flex-1">
                    <label className="text-xs text-slate-500">{t('maxRooms')}</label>
                    <input
                        type="number"
                        {...register('maxRooms')}
                        placeholder="10"
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    {errors.maxRooms && <p className="text-xs text-red-500 mt-0.5">{errors.maxRooms.message}</p>}
                </div>
            </div>

            {/* Budget Range */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="text-xs text-slate-500">{t('minBudget')} (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('minBudget')}
                        placeholder="0"
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    {errors.minBudget && <p className="text-xs text-red-500 mt-0.5">{errors.minBudget.message}</p>}
                </div>
                <div className="flex-1">
                    <label className="text-xs text-slate-500">{t('maxBudget')} (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('maxBudget')}
                        placeholder="2000"
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    {errors.maxBudget && <p className="text-xs text-red-500 mt-0.5">{errors.maxBudget.message}</p>}
                </div>
            </div>

            {/* Boolean toggles */}
            <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                <span className="text-sm text-slate-700">{t('requiresHeating')}</span>
                <input
                    type="checkbox"
                    {...register('requiresHeating')}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
            </label>

            <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                <span className="text-sm text-slate-700">{t('requiresAirConditioning')}</span>
                <input
                    type="checkbox"
                    {...register('requiresAirConditioning')}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
            </label>

            <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                <span className="text-sm text-slate-700">{t('requiresFurnished')}</span>
                <input
                    type="checkbox"
                    {...register('requiresFurnished')}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
            </label>

            <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
                <span className="text-sm text-slate-700">{t('hasPhotosOnly')}</span>
                <input
                    type="checkbox"
                    {...register('hasPhotosOnly')}
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

export default HousePreferencesForm;