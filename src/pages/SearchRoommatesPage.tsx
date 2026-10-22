import { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '@/components/Layout';
import PageTable from '@/components/PageTable';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { inviteRoommate, searchRoommatesWithScores } from '@/services/roommateService';
import { getMyRoommatePreferences, getRoommateProfile } from '@/api/searchApi';
import RoommateFilterPanel, { type RoommateFilterValues } from '@/components/RoommateFilterPanel';
import RoommateCharacteristics from '@/components/RoommateCharacteristics';
import usePageTitle from '@/hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
import { AVATARS } from '@/utils/constants';
import type { RoommateSearch, RoommateFilters } from '@/types';
import type { RoommateProfile } from '@/types/searchSchemas';

const EMPTY_FILTERS: RoommateFilterValues = {
    firstname: '', lastname: '',
    smoking: '', hasPets: '', noiseLevel: '', visitors: '',
    lgbtqFriendly: false, minAge: '', maxAge: '',
};

const SearchRoommatesPage = () => {
    const { houseId } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Data state
    const [roommates, setRoommates] = useState<RoommateSearch[]>([]);
    const [loading, setLoading] = useState(false);
    const [invitedIds, setInvitedIds] = useState<Set<number>>(new Set());
    const [sending, setSending] = useState<number | null>(null);
    const [scores, setScores] = useState<Record<number, number>>({});
    const [sortByRating, setSortByRating] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Keep current filters in a ref so loadMore always sees the latest
    const activeFiltersRef = useRef<RoommateFilters>({});

    // Profile data for characteristic icons
    const [profiles, setProfiles] = useState<Record<number, RoommateProfile>>({});

    // Filter state. lifted so the page can build the API query
    const [filterValues, setFilterValues] = useState<RoommateFilterValues>(EMPTY_FILTERS);
    const [filtersApplied, setFiltersApplied] = useState(false);

    usePageTitle(t('searchRoommate'));

    //helpers

    const buildFilters = (v: RoommateFilterValues): RoommateFilters => {
        const f: RoommateFilters = {};
        if (v.firstname) f.firstname = v.firstname;
        if (v.lastname) f.lastname = v.lastname;
        if (v.smoking) f.smoking = v.smoking;
        if (v.hasPets === 'true') f.hasPets = true;
        if (v.hasPets === 'false') f.hasPets = false;
        if (v.noiseLevel) f.noiseLevel = v.noiseLevel;
        if (v.visitors) f.visitors = v.visitors;
        if (v.lgbtqFriendly) f.lgbtqFriendly = true;
        if (v.minAge) f.minAge = Number(v.minAge);
        if (v.maxAge) f.maxAge = Number(v.maxAge);
        return f;
    };

    const hasActiveFilters = (v: RoommateFilterValues) =>
        !!(v.firstname || v.lastname || v.smoking || v.hasPets ||
            v.noiseLevel || v.visitors || v.lgbtqFriendly || v.minAge || v.maxAge);

    const fetchProfiles = async (list: RoommateSearch[]) => {
        if (list.length === 0) return;
        const results = await Promise.all(
            list.map(r => getRoommateProfile(r.id))
        );
        const map: Record<number, RoommateProfile> = {};
        results.forEach((profile, i) => {
            if (profile) map[list[i].id] = profile;
        });
        setProfiles(prev => ({ ...prev, ...map }));
    };

    // Fresh search (page 0). replaces results
    const doSearch = async (filters: RoommateFilters) => {
        activeFiltersRef.current = filters;
        const result = await searchRoommatesWithScores(filters, 0);
        setRoommates(result.roommates);
        setScores(result.scores);
        setPage(0);
        setHasMore(result.currentPage + 1 < result.totalPages);
        setProfiles({});
        await fetchProfiles(result.roommates);
    };

    // Load next page.  appends results
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const result = await searchRoommatesWithScores(activeFiltersRef.current, nextPage);
            setRoommates(prev => [...prev, ...result.roommates]);
            setScores(prev => ({ ...prev, ...result.scores }));
            setPage(nextPage);
            setHasMore(nextPage + 1 < result.totalPages);
            await fetchProfiles(result.roommates);
        } finally {
            setLoadingMore(false);
        }
    }, [page, hasMore, loadingMore]);

    //Initial load
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const prefs = await getMyRoommatePreferences();
                if (prefs) {
                    const initial: RoommateFilterValues = { ...EMPTY_FILTERS };
                    if (prefs.smoking) initial.smoking = prefs.smoking;
                    if (prefs.noiseLevel) initial.noiseLevel = prefs.noiseLevel;
                    if (prefs.visitors) initial.visitors = prefs.visitors;
                    if (prefs.lgbtqFriendly) initial.lgbtqFriendly = true;
                    if (prefs.minAge != null) initial.minAge = String(prefs.minAge);
                    if (prefs.maxAge != null) initial.maxAge = String(prefs.maxAge);
                    if (prefs.pets === 'NO') initial.hasPets = 'false';
                    else if (prefs.pets === 'YES') initial.hasPets = 'true';
                    setFilterValues(initial);
                }

                await doSearch({});
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    //handlers

    const handleSearch = async () => {
        setLoading(true);
        try {
            await doSearch(buildFilters(filterValues));
            setFiltersApplied(hasActiveFilters(filterValues));
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = async () => {
        setFilterValues(EMPTY_FILTERS);
        setFiltersApplied(false);
        setLoading(true);
        try {
            await doSearch({});
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (roommate: RoommateSearch) => {
        if (!houseId) return;
        setSending(roommate.id);
        try {
            await inviteRoommate(roommate.id, houseId);
            setInvitedIds(prev => new Set(prev).add(roommate.id));
        } catch {
            // Could not send invite
        } finally {
            setSending(null);
        }
    };

    // Sort
    const sortedRoommates = sortByRating
        ? [...roommates].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
        : roommates;

    //render

    return (
        <Layout>
            <div className="bg-slate-100 p-6 pb-16">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">
                    <h1 className="text-2xl font-bold text-slate-800">{t('searchRoommates')}</h1>

                    <RoommateFilterPanel
                        values={filterValues}
                        onChange={setFilterValues}
                        onSearch={handleSearch}
                        onClear={handleClearFilters}
                        loading={loading}
                        filtersApplied={filtersApplied}
                    />

                    {roommates.length > 0 && (
                        <div className="flex justify-end">
                            <Button size="sm" variant="outline"
                                    onClick={() => setSortByRating(prev => !prev)}>
                                {sortByRating ? t('defaultOrder') : t('sortByRating')} ⭐
                            </Button>
                        </div>
                    )}

                    <PageTable
                        tableId="search-roommates-table"
                        title={t('results')}
                        color="indigo"
                        columns={[t('firstname'), t('gender'), t('characteristics'), t('rating'), ""]}
                        isEmpty={roommates.length === 0}
                        emptyMessage={t('noRoommatesFound')}
                        maxHeight="400px"
                        onLoadMore={loadMore}
                        hasMore={hasMore}
                        loadingMore={loadingMore}
                    >
                        {sortedRoommates.map(roommate => {
                            const avatarUrl = AVATARS.find(a => a.id === roommate.avatarId)?.url;
                            return (
                                <tr key={roommate.id} id={`roommate-${roommate.id}`}>
                                    <td className="px-5 py-3 font-medium text-slate-700">
                                        <div className="flex items-center gap-2">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt=""
                                                     className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-200" />
                                            )}
                                            <span>{roommate.firstname}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">{t(roommate.gender)}</td>
                                    <td className="px-5 py-3">
                                        <RoommateCharacteristics profile={profiles[roommate.id]} />
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">
                                        {scores[roommate.id] ? `⭐ ${scores[roommate.id].toFixed(1)}` : '—'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        {invitedIds.has(roommate.id) ? (
                                            <span className="text-xs text-green-600 font-medium">
                                                {t('invited')} ✅
                                            </span>
                                        ) : (
                                            <Button size="sm"
                                                    disabled={sending === roommate.id}
                                                    onClick={() => handleInvite(roommate)}>
                                                {sending === roommate.id ? t('sending') : t('invite')}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
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