import Layout from "@/components/Layout";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import PageTable from "@/components/PageTable.tsx";
import type {Rating} from "@/types";
import LoadSpinner from "@/components/LoadSpinner.tsx";
import useAuth from "@/hooks/useAuth.ts";
import {getMyRatings, getRatingsByRoommateId} from "@/api/ratingApi.ts";
import {useTranslation} from "react-i18next";
import usePageTitle from "@/hooks/usePageTitle.ts";


const RatingPage = () => {

    const { t } = useTranslation();
    const { roommateId } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [givenRatings, setGivenRatings] = useState<Rating[]>([]);
    const [receivedRatings, setReceivedRatings] = useState<Rating[]>([]);

    usePageTitle(t('ratings'))

    useEffect(() => {
        const fetchData = async  () => {
            if(!roommateId){
                setError(t('couldNotLoadRatingsMakeSureYouAreRoommate'));
                setLoading(false);
                return;
            }
            try {
                const [given, received] = await Promise.all([
                    getMyRatings(),
                    getRatingsByRoommateId(roommateId!),
                ]);
                setGivenRatings(given);
                setReceivedRatings(received);
        } catch {
                setError("Could not load ratings.")
        } finally {
            setLoading(false);}
        }
        fetchData()
    }, [roommateId]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-slate-300 flex items-center justify-center">
                    <LoadSpinner />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-slate-300 flex items-center justify-center">
                    <p className="text-slate-600 text-lg">{error}</p>
                </div>
            </Layout>
        );
    }

    const overallScore = receivedRatings.length > 0
        ? (receivedRatings.reduce((sum, r) => sum + r.score, 0) / receivedRatings.length).toFixed(1)
        : null;

    const uniqueRaters = new Set(receivedRatings.map(r => r.fromRoommateFullName)).size;


    return(
        <Layout>
            <div className="bg-teal-200 p-6 pb-16 min-h-screen">
                <div className="max-w-5xl mx-auto flex flex-col gap-6">
                    <h1 className="text-2xl font-bold text-slate-800">{t('ratings')}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                 <div className="flex flex-col gap-2">

                     {/* Overall */}
                     {overallScore && (
                         <div className="flex justify-between items-center bg-indigo-50 rounded-xl px-5 py-3 text-sm font-medium text-indigo-700">
                             <span>{t('overall')}</span>
                             <span>{overallScore} ⭐ {t('from')} {uniqueRaters} {uniqueRaters !== 1 ? t('roommates') : t('roommate')}</span>                         </div>
                     )}

                    {/* My Ratings */}
                    <PageTable
                        tableId="received-ratings-table"
                        title={t('myRatings')}
                        color="indigo"
                        columns={["From", "Category", "Score"]}
                        isEmpty={receivedRatings.length === 0}
                        emptyMessage={t('noRatingsYet')}
                        maxHeight="300px"

                    >
                        {receivedRatings.map(rating => (
                            <tr key={rating.id}>
                                <td className="px-5 py-3 font-medium text-slate-700">{rating.fromRoommateFullName}</td>
                                <td className="px-5 py-3 text-slate-500">{t(rating.category)}</td>
                                <td className="px-5 py-3 text-slate-500">⭐ {rating.score}</td>
                            </tr>
                        ))}

                    </PageTable>

                </div>



                    {/* Given Ratings */}
                    <PageTable
                        tableId="given-ratings-table"
                        title={t('givenRatings')}
                        color="indigo"
                        columns={[ t('to'), t('category'), "Score"]}
                        isEmpty={givenRatings.length === 0}
                        emptyMessage={t('noGivenRatingsYet')}
                        maxHeight="300px"

                    >
                        {givenRatings.map(rating => (
                            <tr key={rating.id}>
                                <td className="px-5 py-3 font-medium text-slate-700">{rating.toRoommateFullName}</td>
                                <td className="px-5 py-3 text-slate-500">{t(rating.category)}</td>
                                <td className="px-5 py-3 text-slate-500">⭐ {rating.score}</td>
                            </tr>
                        ))}
                    </PageTable>

                    </div>
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>{t('back')}</Button>
                        <Button onClick={() => navigate('/roommates')}>{t('rateRoommates')}</Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default RatingPage;