import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageTable from '@/components/PageTable';
import { Button } from '@/components/ui/button';
import type { Roommate } from '@/types';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {inviteRoommate, searchRoommatesWithScores} from "@/services/roommateService.ts";
import usePageTitle from "@/hooks/usePageTitle.ts";
import {useTranslation} from "react-i18next";

const SearchRoommatesPage = () => {
    const { houseId } = useAuth();
    const navigate = useNavigate();

    const {t} = useTranslation();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [roommates, setRoommates] = useState<Roommate[]>([]);
    const [loading, setLoading] = useState(false);
    const [invitedIds, setInvitedIds] = useState<Set<number>>(new Set());
    const [sending, setSending] = useState<number | null>(null);
    const [scores, setScores] = useState<Record<number, number>>({});

    const [sortByRating, setSortByRating] = useState(false);

    usePageTitle(t('searchRoommate'))

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            try {
                const { roommates, scores } = await searchRoommatesWithScores({});
                setRoommates(roommates);
                setScores(scores);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const sortedRoommates = sortByRating
        ? [...roommates].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
        : roommates;

    const handleSearch = async () => {
        setLoading(true);
        try {
            const { roommates, scores } = await searchRoommatesWithScores({ firstname, lastname });
            setRoommates(roommates);
            setScores(scores);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (roommate: Roommate) => {
        if (!houseId) return;
        setSending(roommate.id);
        try {
            await inviteRoommate(roommate.id, houseId);
            setInvitedIds(prev => new Set(prev).add(roommate.id));
        } catch {
            //console.error('Could not send invite');
        } finally {
            setSending(null);
        }
    };

    return (
        <Layout>
            <div className="bg-slate-100 p-6 pb-16">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">
                    <h1 className="text-2xl font-bold text-slate-800">{t('searchRoommates')}</h1>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row gap-3">
                        <input
                            className="border rounded-lg px-3 py-2 text-sm flex-1"
                            placeholder={t('firstname')}
                            value={firstname}
                            onChange={e => setFirstname(e.target.value)}
                        />
                        <input
                            className="border rounded-lg px-3 py-2 text-sm flex-1"
                            placeholder={t('lastname')}
                            value={lastname}
                            onChange={e => setLastname(e.target.value)}
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? t('searching') : t('search')}
                        </Button>
                    </div>

                    {/* Sort */}
                    {roommates.length > 0 && (
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSortByRating(prev => !prev)}
                            >
                                {sortByRating ? t('defaultOrder') : t('sortByRating')} ⭐
                            </Button>
                        </div>
                    )}

                    {/* Results */}
                    <PageTable
                        tableId="search-roommates-table"
                        title={t('results')}
                        color="indigo"
                        columns={[t('firstname'), t('lastname'), t('gender'), t('rating'), ""]}
                        isEmpty={roommates.length === 0}
                        emptyMessage={t('noRoommatesFound')}
                        maxHeight="400px"
                    >
                        {sortedRoommates.map(roommate => (
                            <tr key={roommate.id} id={`roommate-${roommate.id}`}>
                                <td className="px-5 py-3 font-medium text-slate-700">{roommate.firstname}</td>
                                <td className="px-5 py-3 text-slate-500">{roommate.lastname}</td>
                                <td className="px-5 py-3 text-slate-500">{roommate.gender}</td>
                                <td className="px-5 py-3 text-slate-500">
                                    {scores[roommate.id] ? `⭐ ${scores[roommate.id].toFixed(1)}` : '—'}
                                </td>
                                <td className="px-5 py-3 text-right">
                                    {invitedIds.has(roommate.id) ? (
                                        <span className="text-xs text-green-600 font-medium">{t('invited')} ✅</span>
                                    ) : (
                                        <Button
                                            size="sm"
                                            disabled={sending === roommate.id}
                                            onClick={() => handleInvite(roommate)}
                                        >
                                            {sending === roommate.id ? t('sending') : t('invite')}
                                        </Button>
                                    )}
                                </td>
                            </tr>

                        ))}
                    </PageTable>

                    <div className="flex justify-start">
                        <Button variant="outline" onClick={() => navigate('/invitations')}>
                            {t('back')}
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SearchRoommatesPage;