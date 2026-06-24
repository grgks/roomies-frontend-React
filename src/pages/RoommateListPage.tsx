import PageTable from "@/components/PageTable.tsx";
import {useEffect, useState} from "react";
import {type Roommate} from "@/types";
import { useNavigate } from "react-router-dom";
import {getActiveRoommates} from "@/api/roommateApi.ts";
import {fetchAverageScores} from "@/services/ratingService.ts";
import LoadingSpinner from "@/components/LoadSpinner.tsx";
import {Button} from "@/components/ui/button.tsx";
import  Layout  from "@/components/Layout";
import {getAverageScoreForRoommateIdByCategory, getMyRatings} from "@/api/ratingApi.ts";

import {Info, MailPlus, UserStar} from "lucide-react";
import RatingInfoModal from "@/components/RatingInfoModal.tsx";
import RateRoommateModal from "@/components/RateRoommateModal.tsx";
import useAuth from "@/hooks/useAuth.ts";
import {getMyHouse} from "@/api/houseApi.ts";
import {useTranslation} from "react-i18next";
import usePageTitle from "@/hooks/usePageTitle.ts";


const RoommateListPage = () => {

    const { t } = useTranslation();
    const { roommateId } = useAuth();
    const navigate = useNavigate();
    const [roommates, setRoommates] = useState<Roommate[]>([]);
    const [ownerId, setOwnerId] = useState<number | null>(null);
    const [scores, setScores] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);

    const [selectedRoommate, setSelectedRoommate] = useState<Roommate | null>(null);
    const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
    const [modalOpen, setModalOpen] = useState(false);

    const [rateModalOpen, setRateModalOpen] = useState(false);
    const [selectedForRating, setSelectedForRating] = useState<Roommate | null>(null);

    const [selectedHouseRating, setSelectedHouseRating] = useState<number | null>(null);

    const [ratedIds, setRatedIds] = useState<Set<number>>(new Set());

    usePageTitle(t('roommates'))

    const handleOpenRatingModal = async (roommate: Roommate) => {
        setSelectedRoommate(roommate);
        setModalOpen(true);
        try {
            const cats = await getAverageScoreForRoommateIdByCategory(roommate.id);
            setCategoryScores(cats);
        } catch {
            setCategoryScores({});
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [active, myRatings, myHouse] = await Promise.all([
                    getActiveRoommates(),
                    getMyRatings(),
                    getMyHouse(),
                ]);
                setOwnerId(myHouse.ownerId);
                setSelectedHouseRating(myHouse.averageRating ?? null);
                setRoommates(active.filter(r => r.id !== roommateId));
                setRatedIds(new Set(myRatings.map(r => r.toRoommateId)));
                const s = await fetchAverageScores(active);
                setScores(s);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner />;

    return(
            <Layout>
            <div className="bg-orange-200 p-6 pb-16 min-h-screen">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">
                    <h1 className="text-2xl font-bold text-slate-800">{t('roommates')}</h1>
                    <PageTable
                        tableId="roommates-table"
                        title={t('myRoommates')}
                        color="indigo"
                        columns={[t('firstname'),t('lastname'), t('gender'), t('rating'), "", "", ""]}
                        isEmpty={roommates.length === 0}
                        emptyMessage={t('noRoommatesYet')}
                        maxHeight="400px"
                    >
                        {roommates.map(roommate => (
                            <tr key={roommate.id} id={`roommate-${roommate.id}`}>
                                <td className="px-5 py-3 font-medium text-slate-700">{roommate.firstname}
                                    {roommate.id === ownerId && (
                                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{t('owner')}</span>
                                    )}
                                </td>
                                <td className="px-5 py-3 text-slate-500">{roommate.lastname}</td>
                                <td className="px-5 py-3 text-slate-500">{roommate.gender}</td>
                                <td className="px-5 py-3 text-slate-500">
                                    {scores[roommate.id] ? `⭐ ${scores[roommate.id].toFixed(1)}` : '-'}
                                </td>
                                <td className="px-5 py-3 text-slate-500">
                                    <button
                                        className="ml-2 text-indigo-400 hover:text-indigo-600"
                                        onClick={() => handleOpenRatingModal(roommate)}
                                    >
                                        <Info size={18} strokeWidth={2.75} />
                                    </button>
                                </td>
                                <td className="px-5 py-3 text-slate-500">
                                    <button
                                        className="ml-2 text-indigo-400 hover:text-indigo-600"
                                        onClick={() => navigate(`/messages/private/${roommate.id}`)}
                                    >
                                        <MailPlus size={18} strokeWidth={2}/>
                                    </button>
                                </td>
                                <td className="px-5 py-3 text-slate-500">
                                    <button
                                        className={`ml-2 ${ratedIds.has(roommate.id) ? 'text-slate-300 cursor-not-allowed' : 'text-yellow-500 hover:text-yellow-600'}`}
                                        disabled={ratedIds.has(roommate.id)}
                                        onClick={() => { setSelectedForRating(roommate); setRateModalOpen(true); }}
                                    >
                                        <UserStar size={18} strokeWidth={1.75} absoluteStrokeWidth />
                                    </button>
                                </td>
                            </tr>
                        ))}
                     </PageTable>

                    {selectedForRating && (
                        <RateRoommateModal
                            open={rateModalOpen}
                            onOpenChange={setRateModalOpen}
                            roommate={selectedForRating}
                            onRated={() => setSelectedForRating(null)}
                        />
                    )}
                    <RatingInfoModal
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        firstname={selectedRoommate?.firstname}
                        lastname={selectedRoommate?.lastname}
                        categoryScores={categoryScores}
                        houseRating={selectedHouseRating}
                    />

                    <div className="flex justify-start">
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>
                            {t('back')}
                        </Button>
                    </div>
                </div>
            </div>
            </Layout>
    );
};
export default RoommateListPage;