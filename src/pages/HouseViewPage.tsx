import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageTable from '@/components/PageTable';
import { Button } from '@/components/ui/button';
import { getMyHouse } from '@/api/houseApi';
import { getActiveRoommates } from '@/api/roommateApi';
import type {Area, House, Roommate} from '@/types';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadSpinner';
import {handleLeaveHouse} from "@/services/houseService.ts";
import {getAreaById} from "@/api/staticApi.ts";
import { fetchAverageScores } from '@/services/ratingService';
import SearchHousesPage from "@/pages/SearchHousesPage.tsx";
import {useTranslation} from "react-i18next";
import usePageTitle from "@/hooks/usePageTitle.ts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';

const HouseViewPage = () => {

    const{ t } = useTranslation();
    const { houseId, roommateId, refreshAuth } = useAuth();
    const navigate = useNavigate();

    const [house, setHouse] = useState<House | null>(null);
    const [roommates, setRoommates] = useState<Roommate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [area, setArea] = useState<Area | null>(null);
    const [averageScores, setAverageScores] = useState<Record<number, number>>({});

    usePageTitle(t('myHouse'))

    useEffect(() => {
        if (!houseId) return;
        const fetchData = async () => {
            try {
                const myHouse = await getMyHouse();
                const [activeRoommates, houseArea] = await Promise.all([
                    getActiveRoommates(),
                    getAreaById(myHouse.areaId),
                ]);
                setHouse(myHouse);
                setRoommates(activeRoommates);

                const scores = await fetchAverageScores(activeRoommates);
                setAverageScores(scores);

                setArea(houseArea);
            } catch {
                setError('Could not load house.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [houseId]);

    const [leaveOpen, setLeaveOpen] = useState(false);
    const [leaving, setLeaving] = useState(false);

    const handleLeave = async () => {
        if (!houseId) return;
        try {
            await handleLeaveHouse(houseId);
            await refreshAuth();
            navigate('/dashboard');
        } catch {
            setLeaving(false);
            //console.error('Could not leave house');
        }
    };

    if (!houseId) return <SearchHousesPage />;

    if (loading) return <LoadingSpinner />;

    if (error || !house) {
        return (
            <Layout>
                <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                    <p className="text-slate-600">{error ?? t('houseNotFound')}</p>
                </div>
            </Layout>
        );
    }

    const isOwner = house.ownerId === roommateId;

    return (
        <Layout>
            <div className="bg-violet-300 min-h-screen p-6 pb-16">

                <div className="max-w-2xl mx-auto flex flex-col gap-6">

                    {/* House Info Card */}
                    <div id="house-info-card" className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-slate-800">{t('myHouse')}</h1>
                            {isOwner && (
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                                    {t('owner')}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">{t('address')}</span>
                                <span className="font-medium text-slate-700">
                                    {house.address} {house.addressNumber}, {house.apartment}
                                </span>
                            </div>
                            {area && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{t('area')}</span>
                                    <span className="font-medium text-slate-700">{area.name}, {area.cityName}</span>
                                </div>
                            )}
                            {house.numOfRooms && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{t('rooms')}</span>
                                    <span className="font-medium text-slate-700">{house.numOfRooms}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Roommates Table */}
                    <PageTable
                        tableId="roommates-table"
                        title={t('roommates')}
                        color="indigo"
                        columns={[t('firstname'), t('lastname'), t('rating')]}
                        isEmpty={roommates.length === 0}
                        emptyMessage={t('noRoommatesYet')}
                        maxHeight="300px"

                    >
                        {roommates.map(roommate => (
                            <tr key={roommate.id} id={`roommate-${roommate.id}`}>
                                <td id={`roommate-firstname-${roommate.id}`} className="px-5 py-3 font-medium text-slate-700">
                                    {roommate.firstname}
                                    {roommate.id === house.ownerId && (
                                        <span className="ml-2 text-xs bg-blue-300 text-indigo-700 px-2 py-0.5 rounded-full">{t('owner')}</span>
                                    )}
                                </td>
                                <td id={`roommate-lastname-${roommate.id}`} className="px-5 py-3 font-medium text-slate-700">
                                    {roommate.lastname}
                                </td>
                                <td className="px-5 py-3 text-slate-500">
                                    {averageScores[roommate.id] ? `⭐ ${averageScores[roommate.id].toFixed(1)}` : '-'}
                                </td>

                            </tr>

                        ))}
                    </PageTable>

                    {/* Leave House */}
                    <div className="flex justify-between">
                        <Button
                            id="back"
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                            className="hover:bg-slate-100 hover:border-slate-400 transition-colors"
                        >
                            {t('back')}
                        </Button>
                        <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
                            <DialogTrigger asChild>
                                <Button id="leave-house-btn" variant="destructive">
                                    {t('leaveHouse')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{t('leaveHouse')}</DialogTitle>
                                    <DialogDescription className="sr-only">{t('leaveHouse')}</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 mt-2">
                                    <p className="text-sm text-slate-600">{t('leaveHouseConfirmMessage')}</p>
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" onClick={() => setLeaveOpen(false)}>
                                            {t('cancel')}
                                        </Button>
                                        <Button variant="destructive" disabled={leaving} onClick={handleLeave}>
                                            {leaving ? t('leaving') : t('confirmLeave')}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default HouseViewPage;