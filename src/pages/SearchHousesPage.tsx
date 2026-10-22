import { useEffect, useState, Fragment } from 'react';
import Layout from '@/components/Layout';
import PageTable from '@/components/PageTable';
import { Button } from '@/components/ui/button';
import { searchHouses } from '@/api/houseApi';
import { getMyHousePreferences, getHouseProfile } from '@/api/searchApi';
import HousePhotoGallery from '@/components/HousePhotoGallery';
import HouseFilterPanel, { type HouseFilterValues } from '@/components/HouseFilterPanel';
import HouseCharacteristics from '@/components/HouseCharacteristics';
import { getMyOutgoingInvitations, sendInvitation } from '@/api/invitationApi';
import type { House } from '@/types';
import type { HouseFilters } from '@/types/houseSchemas';
import type { HouseProfile } from '@/types/searchSchemas';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadSpinner';
import type { PagedResponse } from '@/types/commonSchemas';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EMPTY_FILTERS: HouseFilterValues = {
    minBudget: '', maxBudget: '',
    requiresHeating: false, requiresAC: false, requiresFurnished: false,
};

const SearchHousesPage = () => {
    const { t } = useTranslation();
    const { roommateId } = useAuth();
    const navigate = useNavigate();

    // Data state
    const [houses, setHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestedHouseIds, setRequestedHouseIds] = useState<Set<number>>(new Set());
    const [expandedHouseId, setExpandedHouseId] = useState<number | null>(null);
    const [sending, setSending] = useState<number | null>(null);

    // Profile data for characteristic icons
    const [profiles, setProfiles] = useState<Record<number, HouseProfile>>({});

    // Filter state — lifted so the page can build the API query
    const [filterValues, setFilterValues] = useState<HouseFilterValues>(EMPTY_FILTERS);
    const [filtersApplied, setFiltersApplied] = useState(false);

    //helpers

    const buildFilters = (v: HouseFilterValues): HouseFilters => {
        const f: HouseFilters = { hasAvailableRooms: true };
        if (v.minBudget) f.minBudget = Number(v.minBudget);
        if (v.maxBudget) f.maxBudget = Number(v.maxBudget);
        if (v.requiresHeating) f.requiresHeating = true;
        if (v.requiresAC) f.requiresAirConditioning = true;
        if (v.requiresFurnished) f.requiresFurnished = true;
        return f;
    };

    const hasActiveFilters = (v: HouseFilterValues) =>
        !!(v.minBudget || v.maxBudget || v.requiresHeating || v.requiresAC || v.requiresFurnished);

    const fetchProfiles = async (houseList: House[]) => {
        if (houseList.length === 0) { setProfiles({}); return; }
        const results = await Promise.allSettled(
            houseList.map(h => getHouseProfile(h.id))
        );
        const map: Record<number, HouseProfile> = {};
        results.forEach((r, i) => {
            if (r.status === 'fulfilled' && r.value) map[houseList[i].id] = r.value;
        });
        setProfiles(map);
    };

    const doSearch = async (filters: HouseFilters) => {
        const [housesRes, outgoing] = await Promise.all([
            searchHouses(filters) as unknown as PagedResponse<House>,
            getMyOutgoingInvitations({ pageSize: 100}),
        ]);
        const houseList = housesRes.data ?? [];
        setHouses(houseList);
        setRequestedHouseIds(new Set(
            outgoing.filter(inv => inv.status === 'PENDING').map(inv => inv.houseId)
        ));
        await fetchProfiles(houseList);
    };

    //Initial load
    useEffect(() => {
        const init = async () => {
            try {
                // Try loading preferences as filter defaults
                try {
                    const prefs = await getMyHousePreferences();
                    if (prefs) {
                        const initial: HouseFilterValues = { ...EMPTY_FILTERS };
                        if (prefs.minBudget != null) initial.minBudget = String(prefs.minBudget);
                        if (prefs.maxBudget != null) initial.maxBudget = String(prefs.maxBudget);
                        if (prefs.requiresHeating) initial.requiresHeating = true;
                        if (prefs.requiresAirConditioning) initial.requiresAC = true;
                        if (prefs.requiresFurnished) initial.requiresFurnished = true;
                        setFilterValues(initial);
                    }
                } catch {
                    // No preferences saved. that's fine
                }

                // Initial search; show all available houses
                await doSearch({ hasAvailableRooms: true });
            } catch {
                setError(t('couldNotLoadAvailableHouses'));
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    //handlers

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            await doSearch(buildFilters(filterValues));
            setFiltersApplied(hasActiveFilters(filterValues));
        } catch {
            setError(t('couldNotLoadAvailableHouses'));
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = async () => {
        setFilterValues(EMPTY_FILTERS);
        setFiltersApplied(false);
        setLoading(true);
        try {
            await doSearch({ hasAvailableRooms: true });
        } catch {
            setError(t('couldNotLoadAvailableHouses'));
        } finally {
            setLoading(false);
        }
    };

    const handleRequestToJoin = async (house: House) => {
        if (!roommateId) return;
        setSending(house.id);
        try {
            await sendInvitation({ receiverId: house.ownerId, houseId: house.id });
            setRequestedHouseIds(prev => new Set(prev).add(house.id));
        } catch (error: unknown) {
            if ((error as { response?: { status: number } })?.response?.status === 409) {
                setRequestedHouseIds(prev => new Set(prev).add(house.id));
            }
        } finally {
            setSending(null);
        }
    };

    //render

    if (loading && houses.length === 0) return <LoadingSpinner />;

    return (
        <Layout>
            <div className="bg-slate-100 p-6 pb-16">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 mb-6">{t('availableHouses')}</h1>

                    {/* Filter panel (extracted component) */}
                    <div className="mb-6">
                        <HouseFilterPanel
                            values={filterValues}
                            onChange={setFilterValues}
                            onSearch={handleSearch}
                            onClear={handleClearFilters}
                            loading={loading}
                            filtersApplied={filtersApplied}
                        />
                    </div>

                    {error && <p className="text-slate-600 text-center py-8">{error}</p>}

                    {/* Results Table */}
                    <PageTable
                        tableId="available-houses-table"
                        title={t('housesWithAvailableRooms')}
                        color="indigo"
                        columns={[t('address'), t('rooms'), t('characteristics'), t('rating'), ""]}
                        isEmpty={houses.length === 0}
                        emptyMessage={t('couldNotLoadAvailableHouses')}
                    >
                        {houses.map(house => (
                            <Fragment key={house.id}>
                                <tr
                                    id={`house-${house.id}`}
                                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => setExpandedHouseId(prev => prev === house.id ? null : house.id)}
                                >
                                    {/* Address + location subtitle */}
                                    <td className="px-5 py-3 font-medium text-slate-700">
                                        <span className="mr-2 text-slate-400 inline-block transition-transform duration-200"
                                              style={{ transform: expandedHouseId === house.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                            ▶
                                        </span>
                                        {house.address} {house.addressNumber}, {house.apartment}
                                        <div className="text-xs text-slate-400 ml-6">
                                            {house.areaName}{house.cityName ? `, ${house.cityName}` : ''}
                                        </div>
                                    </td>

                                    {/* Rooms */}
                                    <td className="px-5 py-3 font-medium">
                                        {house.numOfRooms && house.currentRoommates !== undefined ? (
                                            <span className={house.numOfRooms - (house.currentRoommates ?? 0) <= 1 ? 'text-yellow-500' : 'text-green-600'}>
                                                {house.currentRoommates ?? 0}/{house.numOfRooms}
                                            </span>
                                        ) : '—'}
                                    </td>

                                    {/* Characteristics (extracted component) */}
                                    <td className="px-5 py-3">
                                        <HouseCharacteristics profile={profiles[house.id]} />
                                    </td>

                                    {/* Rating */}
                                    <td className="px-5 py-3 text-slate-500 text-sm">
                                        {house.averageRating ? `⭐ ${house.averageRating.toFixed(1)}` : '—'}
                                    </td>

                                    {/* Action */}
                                    <td className="px-5 py-3 text-right">
                                        {requestedHouseIds.has(house.id) ? (
                                            <span className="text-xs text-green-600 font-medium">{t('requestSent')} ✅</span>
                                        ) : (
                                            <Button
                                                id={`request-join-btn-${house.id}`}
                                                size="sm"
                                                disabled={sending === house.id}
                                                onClick={e => { e.stopPropagation(); handleRequestToJoin(house); }}
                                            >
                                                {sending === house.id ? t('sending') : t('requestToJoin')}
                                            </Button>
                                        )}
                                    </td>
                                </tr>

                                {/* Expanded photo gallery */}
                                {expandedHouseId === house.id && (
                                    <tr>
                                        <td colSpan={5} className="bg-slate-50 border-t border-slate-200">
                                            <HousePhotoGallery houseId={house.id} />
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </PageTable>

                    <div className="mt-14 flex gap-3 justify-between">
                        <Button className="bg-indigo-600" onClick={() => navigate("/dashboard")}>
                            {t('back')}
                        </Button>
                        <Button className="bg-indigo-600" onClick={() => navigate("/house/create")}>
                            {t('createHouse')}
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SearchHousesPage;