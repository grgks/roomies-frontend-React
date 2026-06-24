import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageTable from '@/components/PageTable';
import { Button } from '@/components/ui/button';
import {
    getMyIncomingInvitations,
    getMyOutgoingInvitations,
    acceptInvitation,
    rejectInvitation, cancelInvitation,
} from '@/api/invitationApi';
import type {Invitation, Roommate} from '@/types';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadSpinner';
import {useNavigate} from "react-router-dom";
import {Info} from "lucide-react";
import {getAverageScoreForRoommateIdByCategory} from "@/api/ratingApi.ts";
import RatingInfoModal from "@/components/RatingInfoModal.tsx";
import {getHouse, getMyHouse} from "@/api/houseApi.ts";
import {useTranslation} from "react-i18next";
import usePageTitle from "@/hooks/usePageTitle.ts";

const statusColor = (status: string) => {
    if (status === 'ACCEPTED') return 'text-green-600 font-medium';
    if (status === 'REJECTED') return 'text-red-500 font-medium';
    if (status === 'CANCELLED') return 'text-slate-400 font-medium';
    return 'text-yellow-500 font-medium';
};

const InvitationsPage = () => {

    const { t  } = useTranslation();

    const { houseId, roommateId, refreshAuth } = useAuth();

    const [houseOwnerId, setHouseOwnerId] = useState<number | null>(null);
    const [incoming, setIncoming] = useState<Invitation[]>([]);
    const [outgoing, setOutgoing] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState<number | null>(null);
    const navigate = useNavigate();

    const [selectedRoommate, setSelectedRoommate] = useState<Roommate | null>(null);
    const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
    const [selectedHouseRating, setSelectedHouseRating] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isFull, setIsFull] = useState(false);

    usePageTitle(t('invitations'))

    useEffect(() => {
        const fetchData = async () => {

            try {
                const [inc, out] = await Promise.all([
                    getMyIncomingInvitations({}),
                    getMyOutgoingInvitations({}),
                ]);
                setIncoming(inc);
                setOutgoing(out);

                if (houseId) {
                    const myHouse = await getMyHouse();
                    setHouseOwnerId(myHouse.ownerId);
                }

                if (houseId) {
                    const myHouse = await getMyHouse();
                    setHouseOwnerId(myHouse.ownerId);
                    setIsFull((myHouse.currentRoommates ?? 0) >= (myHouse.numOfRooms ?? Infinity));
                }

            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAccept = async (id: number) => {
        setActing(id);
        try {
            await acceptInvitation(id);
            await refreshAuth();

                // after accept goes auto to HouseViewPage with Id
            setIncoming(prev => prev.map(i => i.id === id ? { ...i, status: 'ACCEPTED' } : i));
            navigate('/house');

        } finally {
            setActing(null);
        }
    };

    const handleReject = async (id: number) => {
        setActing(id);
        try {
            await rejectInvitation(id);
            setIncoming(prev => prev.map(i => i.id === id ? { ...i, status: 'REJECTED' } : i));
        } finally {
            setActing(null);
        }
    };

    const handleCancel = async (id: number) => {
        setActing(id);
        try {
            await cancelInvitation(id);
            setOutgoing(prev => prev.map(i => i.id === id ? { ...i, status: 'CANCELLED' } : i));
        } finally {
            setActing(null);
        }
    };

    const handleOpenRatingModal = async (roommateId: number, name: string, invHouseId: number) => {
        setSelectedRoommate({ id: roommateId, firstname: name, lastname: '' } as Roommate);
        setModalOpen(true);
        try {
            const cats = await getAverageScoreForRoommateIdByCategory(roommateId);
            setCategoryScores(cats);

            // only show house rating if it's not your own house
            if (invHouseId !== houseId) {
                const house = await getHouse(invHouseId);
                setSelectedHouseRating(house.averageRating ?? null);
            } else {
                setSelectedHouseRating(null);
            }
        } catch {
            setCategoryScores({});
            setSelectedHouseRating(null);
        }
    };

    if (loading) return <LoadingSpinner />;

    const isOwner = roommateId === houseOwnerId;

    return (
        <Layout>
            <div className="bg-slate-300 min-h-screen p-6 pb-16">
                <div className="max-w-5xl mx-auto flex flex-col gap-6">

                    {/* Top - Invite */}
                    <div className="bg-slate-200 rounded-2xl shadow-md p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-800">{t('inviteARoommate')}</h2>
                            <p className="text-sm text-slate-600">
                                {isFull ? t('yourHouseIsFull') : isOwner ? t('searchForARoommateToInviteToYourHouse') : ''}
                            </p>
                        </div>
                        <Button onClick={() => navigate('/roommates/search')} disabled={!isOwner || isFull}>
                            {t('searchRoommate')}
                        </Button>
                    </div>

                    {/* Right - History */}
                    <div className="flex flex-col md:flex-row gap-6">

                        {/* Incoming */}
                        <div className="flex-1">
                        <PageTable
                            tableId="incoming-invitations-table"
                            title={t('incoming')}
                            color="indigo"
                            columns={[ t('from'), t('house'), t('area'), "Status", "",""]}
                            isEmpty={incoming.length === 0}
                            emptyMessage={t('noIncomingInvitations')}
                            maxHeight="300px"

                        >
                            {incoming.map(inv => (
                                <tr key={inv.id} id={`incoming-${inv.id}`}>
                                    <td className="px-5 py-3 text-slate-700 font-medium">{inv.senderFullName}</td>
                                    <td className="px-5 py-3 text-slate-500">{inv.houseAddress}</td>
                                    <td className="px-5 py-3 text-slate-500">{inv.houseArea}</td>
                                    <td className={`px-5 py-3 ${statusColor(inv.status)}`}>{t(inv.status)}</td>
                                    <td className="px-5 py-3 text-right">
                                        {inv.status === 'PENDING' && (
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    disabled={acting === inv.id}
                                                    onClick={() => handleAccept(inv.id)}
                                                >
                                                    {t('accept')}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    disabled={acting === inv.id}
                                                    onClick={() => handleReject(inv.id)}
                                                >
                                                    {t('reject')}
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">
                                        <button
                                            className="ml-2 text-indigo-400 hover:text-indigo-600"
                                            onClick={() => handleOpenRatingModal(inv.senderId, inv.senderFullName, inv.houseId)}
                                        >
                                            <Info size={18} strokeWidth={2.75} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </PageTable>
                        </div>

                        <RatingInfoModal
                            open={modalOpen}
                            onOpenChange={setModalOpen}
                            firstname={selectedRoommate?.firstname}
                            lastname={selectedRoommate?.lastname}
                            categoryScores={categoryScores}
                            houseRating={selectedHouseRating}
                        />

                        {/* Outgoing */}
                        <div className="flex-1">
                            <PageTable
                                tableId="outgoing-invitations-table"
                                title={t('outgoing')}
                                color="indigo"
                                columns={[t('to'), t('house'), t('area'), "Status", ""]}
                                isEmpty={outgoing.length === 0}
                                emptyMessage={t('noOutgoingInvitations')}
                                maxHeight="300px"

                            >
                                {outgoing.map(inv => (
                                    <tr key={inv.id} id={`outgoing-${inv.id}`}>
                                        <td className="px-5 py-3 text-slate-700 font-medium">{inv.receiverFullName}</td>
                                        <td className="px-5 py-3 text-slate-500">{inv.houseAddress}</td>
                                        <td className="px-5 py-3 text-slate-500">{inv.houseArea}</td>
                                        <td className={`px-5 py-3 ${statusColor(inv.status)}`}>{t(inv.status)}</td>
                                        <td className="px-5 py-3 text-right">
                                            {inv.status === 'PENDING' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={acting === inv.id}
                                                    onClick={() => handleCancel(inv.id)}
                                                >
                                                    {t('cancel')}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </PageTable>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default InvitationsPage;