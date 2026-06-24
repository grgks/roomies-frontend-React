import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageTable from '@/components/PageTable';
import { Button } from '@/components/ui/button';
import { searchHouses } from '@/api/houseApi';
import {getMyOutgoingInvitations, sendInvitation} from '@/api/invitationApi';
import type { House } from '@/types';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadSpinner';
import type {PagedResponse} from "@/types/commonSchemas.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const SearchHousesPage = () => {

    const{ t } =  useTranslation();
    const { roommateId } = useAuth();
    const [houses, setHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestedHouseIds, setRequestedHouseIds] = useState<Set<number>>(new Set());
    const [sending, setSending] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [houses, outgoing] = await Promise.all([
                    searchHouses({ hasAvailableRooms: true }) as unknown as PagedResponse<House>,
                    getMyOutgoingInvitations({}),
                ]);
                setHouses(houses.data ?? []);
                // pre-populate requested house ids from PENDING outgoing
                const pendingHouseIds = new Set(
                    outgoing
                        .filter(inv => inv.status === 'PENDING')
                        .map(inv => inv.houseId)
                );
                setRequestedHouseIds(pendingHouseIds);
            } catch {
                setError(t('couldNotLoadAvailableHouses'));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRequestToJoin = async (house: House) => {
        if (!roommateId) return;
        setSending(house.id);
        try {
            await sendInvitation({
                receiverId: house.ownerId,
                houseId: house.id,
            });
            setRequestedHouseIds(prev => new Set(prev).add(house.id));
        } catch (error: unknown) {
            if ((error as { response?: { status: number } })?.response?.status === 409) {
                setRequestedHouseIds(prev => new Set(prev).add(house.id));
            } else {
                //console.error('Could not send request');
            }
        } finally {
            setSending(null);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Layout>
            <div className="bg-slate-100 p-6 pb-16">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 mb-6">{t('availableHouses')}</h1>

                    {error && (
                        <p className="text-slate-600 text-center py-8">{error}</p>
                    )}

                    <PageTable
                        tableId="available-houses-table"
                        title={t('housesWithAvailableRooms')}
                        color="indigo"
                        columns={[t('address'), t('rooms'), t('area'), t('city'), t('rating') ,""]}
                        isEmpty={houses.length === 0}
                        emptyMessage={t('couldNotLoadAvailableHouses')}
                    >
                        {houses.map(house => (
                            <tr key={house.id} id={`house-${house.id}`}>
                                <td id={`house-address-${house.id}`} className="px-5 py-3 font-medium text-slate-700">
                                    {house.address} {house.addressNumber}, {house.apartment}
                                </td>
                                <td className="px-5 py-3 font-medium">
                                    {house.numOfRooms && house.currentRoommates !== undefined ? (
                                        <span className={
                                            house.numOfRooms - ( house.currentRoommates  ?? 0 ) <= 1
                                                ? 'text-yellow-500'
                                                : 'text-green-600'
                                        }>
                                            {house.currentRoommates ?? 0}/{house.numOfRooms}
                                        </span>
                                            ) : '—'}
                                </td>
                                <td id={`house-area-${house.id}`} className="px-5 py-3 text-slate-500">
                                    {house.areaName}
                                </td>
                                <td id={`house-city-${house.id}`} className="px-5 py-3 text-slate-500">
                                    {house.cityName}
                                </td>
                                <td className="px-5 py-3 text-slate-500 text-sm">
                                    {house.averageRating ? `⭐ ${house.averageRating.toFixed(1)}` : '—'}
                                </td>
                                <td className="px-5 py-3 text-right">
                                    {requestedHouseIds.has(house.id) ? (
                                        <span className="text-xs text-green-600 font-medium">{t('requestSent')} ✅</span>
                                    ) : (
                                        <Button
                                            id={`request-join-btn-${house.id}`}
                                            size="sm"
                                            disabled={sending === house.id}
                                            onClick={() => handleRequestToJoin(house)}
                                        >
                                            {sending === house.id ? t('sending') : t('requestToJoin')}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </PageTable>
                    <div className="mt-14 flex gap-3 justify-between">
                        <Button
                            className="bg-indigo-600"
                            onClick={() => navigate("/dashboard")}>{t('back')}</Button>
                        <Button
                            className="bg-indigo-600"
                            onClick={() => navigate("/house/create")}>{t('createHouse')}</Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SearchHousesPage;