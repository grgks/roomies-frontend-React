import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import FormField from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { HouseInsert } from '@/types/houseSchemas';
import type { HouseInsert as HouseInsertType } from '@/types/houseSchemas';
import type { City, Area } from '@/types';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadSpinner';
import {fetchHouseFormData, filterAreasByCity, submitCreateHouse} from "@/services/houseService.ts";
import {useTranslation} from "react-i18next";
import usePageTitle from "@/hooks/usePageTitle.ts";

const CreateHousePage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { refreshAuth } = useAuth();

    const [cities, setCities] = useState<City[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HouseInsertType>({
        resolver: zodResolver(HouseInsert) as never,
    });

    usePageTitle(t('createHouse'))

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchHouseFormData();
                setCities(data.cities);
                setAreas(data.areas);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCityId) {
            setFilteredAreas(filterAreasByCity(areas, selectedCityId));
        } else {
            setFilteredAreas([]);
        }
    }, [selectedCityId, areas]);

    const onSubmit = async (data: HouseInsertType) => {
        try {
            await submitCreateHouse(data);
            await refreshAuth();
            navigate('/dashboard');
        } catch {
            //console.error('Could not create house');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Layout>
            <div className=" bg-slate-100 pb-16"
            >
                <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">{t('createHouse')}</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                        <FormField label={t('address')} htmlFor="house-address" error={errors.address?.message}>
                            <input
                                id="house-address"
                                {...register('address')}
                                placeholder={t('ermou')}
                                className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </FormField>

                        <FormField label={t('addressNumber')} htmlFor="house-address-number" error={errors.addressNumber?.message}>
                            <input
                                id="house-address-number"
                                {...register('addressNumber')}
                                placeholder={t('addressNumberPL')}
                                className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </FormField>

                        <FormField label={t('apartment')} htmlFor="house-apartment" error={errors.apartment?.message}>
                            <input
                                id="house-apartment"
                                {...register('apartment')}
                                placeholder={t('3a')}
                                className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </FormField>

                        <FormField label={t('numberOfRooms')} htmlFor="house-rooms">
                            <input
                                id="house-rooms"
                                {...register('numOfRooms', { setValueAs: v => v === '' ? undefined : parseInt(v) })}
                                type="number"
                                min="1"
                                placeholder={t('roomsNumberPL')}
                                className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </FormField>

                        <FormField label={t('city')} htmlFor="house-city">
                            <select
                                id="house-city"
                                onChange={e => setSelectedCityId(Number(e.target.value))}
                                className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">{t('selectCity')}</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label={t('area')} htmlFor="house-area" error={errors.areaId?.message}>
                            <select
                                id="house-area"
                                {...register('areaId')}
                                disabled={!selectedCityId}
                                className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                            >
                                <option value="">{t('selectArea')}</option>
                                {filteredAreas.map(area => (
                                    <option key={area.id} value={area.id}>{area.name}</option>
                                ))}
                            </select>
                        </FormField>

                        <Button
                            id="create-house-submit-btn"
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2"
                        >
                            {isSubmitting ? t('creating') : t('createHouse')}
                        </Button>

                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateHousePage;