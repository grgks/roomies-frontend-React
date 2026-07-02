import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageTable from '@/components/PageTable';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadSpinner';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TaskInfoModal from '@/components/TaskInfoModal';
import ExpenseInfoModal from '@/components/ExpenseInfoModal';
import { getAllCities, getAllAreas } from '@/api/staticApi';
import {
    adminGetAllHouses,
    adminGetAllTasks,
    adminGetAllExpenses,
    adminDeleteTask,
    adminDeleteExpense,
    adminGetRoommatesByHouse,
    adminRemoveRoommateFromHouse, adminGetAllInvitations, adminDeleteInvitation, adminDeleteHouse,
} from '@/api/generalAdminApi';
import type {
    House, HouseFilters, Task, Expense,
    AdminRoommate, City, Area, Invitation,
} from '@/types';
import {Users, ChevronDown, ChevronUp, UserMinus, UserCog, Trash2} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AddCityModal from "@/components/AddCityModal.tsx";
import AddAreaModal from "@/components/AddAreaModal.tsx";
import EditHouseModal from "@/components/EditHouseModal.tsx";
import ChangeOwnerModal from "@/components/ChangeOwnerModal.tsx";
import EditAdminRoommateModal from "@/components/EditAdminRoommateModal.tsx";
import usePageTitle from "@/hooks/usePageTitle.ts";

type HouseTab = 'roommates' | 'tasks' | 'expenses' | 'ratings' | 'invitations';

const TABS: HouseTab[] = ['roommates', 'tasks', 'expenses', 'ratings', 'invitations'];

const AdminDashboardPage = () => {
    const { t } = useTranslation();

    const [houses, setHouses] = useState<House[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [filters, setFilters] = useState<HouseFilters>({ page: 0, pageSize: 10 });
    const [invitationsInHouse, setInvitationsInHouse] = useState<Invitation[]>([]);

    const [addressSearch, setAddressSearch] = useState('');
    const [cities, setCities] = useState<City[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);

    // Accordion state - only one house open at a time
    const [expandedHouseId, setExpandedHouseId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<HouseTab>('roommates');

    const [tabLoading, setTabLoading] = useState(false);
    const [roommatesInHouse, setRoommatesInHouse] = useState<AdminRoommate[]>([]);
    const [tasksInHouse, setTasksInHouse] = useState<Task[]>([]);
    const [expensesInHouse, setExpensesInHouse] = useState<Expense[]>([]);

    // Initial confirmation, before any API call happens
    const [confirmTarget, setConfirmTarget] = useState<AdminRoommate | null>(null);

    // Remove-roommate flow state (409 -> confirm -> retry with forceWriteOff)
    const [removeTarget, setRemoveTarget] = useState<AdminRoommate | null>(null);
    const [removeConflictMessage, setRemoveConflictMessage] = useState<string | null>(null);
    const [removeSubmitting, setRemoveSubmitting] = useState(false);

    usePageTitle(t('adminDashboard'))

    useEffect(() => {
        const fetchStaticData = async () => {
            const [citiesData, areasData] = await Promise.all([getAllCities(), getAllAreas()]);
            setCities(citiesData);
            setAreas(areasData);
        };
        fetchStaticData();
    }, []);

    useEffect(() => {
        const fetchHouses = async () => {
            setRefetching(true);
            try {
                const response = await adminGetAllHouses(filters);
                setHouses(response.data);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } finally {
                setRefetching(false);
                setInitialLoading(false);
            }
        };
        fetchHouses();
    }, [filters]);

    useEffect(() => {
        if (expandedHouseId === null) return;

        const fetchTabData = async () => {
            setTabLoading(true);
            try {
                if (activeTab === 'roommates') {
                    const data = await adminGetRoommatesByHouse(expandedHouseId);
                    setRoommatesInHouse(data);
                } else if (activeTab === 'tasks') {
                    const res = await adminGetAllTasks({ houseId: expandedHouseId, page: 0, pageSize: 50 });
                    setTasksInHouse(res.data);
                } else if (activeTab === 'expenses') {
                    const res = await adminGetAllExpenses({ houseId: expandedHouseId, page: 0, pageSize: 50 });
                    setExpensesInHouse(res.data);
                } else if (activeTab === 'ratings') {
                    // NOTE: RatingFilters has no houseId yet - server-side filtering by house isn't supported.
                } else if (activeTab === 'invitations') {
                    const res = await adminGetAllInvitations({ houseId: expandedHouseId, page: 0, pageSize: 50 });
                    setInvitationsInHouse(res.data);
                }
            } finally {
                setTabLoading(false);
            }
        };
        fetchTabData();
    }, [expandedHouseId, activeTab]);

    const toggleExpand = (houseId: number) => {
        if (expandedHouseId === houseId) {
            setExpandedHouseId(null);
        } else {
            setExpandedHouseId(houseId);
            setActiveTab('roommates');
            setRoommatesInHouse([]);
            setTasksInHouse([]);
            setExpensesInHouse([]);
            setInvitationsInHouse([]);
        }
    };

    // Step 1 of the remove flow: try without forceWriteOff
    const handleRemoveClick = async (roommate: AdminRoommate) => {
        if (expandedHouseId === null) return;
        setRemoveConflictMessage(null);
        setRemoveTarget(roommate);
        try {
            await adminRemoveRoommateFromHouse(expandedHouseId, roommate.id, false);
            // succeeded with no unpaid splits - remove from local list immediately
            setRoommatesInHouse(prev => prev.filter(r => r.id !== roommate.id));
            setRemoveTarget(null);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                // unpaid splits exist - show the backend message and ask for confirmation to force write-off
                setRemoveConflictMessage(err.response.data?.message ?? t('roommateHasUnpaidSplits'));
            } else {
                setRemoveTarget(null);
                console.error('Could not remove roommate', err);
            }
        }
    };

    // Step 2: confirmed force write-off retry
    const handleForceWriteOffConfirm = async () => {
        if (expandedHouseId === null || removeTarget === null) return;
        setRemoveSubmitting(true);
        try {
            await adminRemoveRoommateFromHouse(expandedHouseId, removeTarget.id, true);
            setRoommatesInHouse(prev => prev.filter(r => r.id !== removeTarget.id));
        } finally {
            setRemoveSubmitting(false);
            setRemoveTarget(null);
            setRemoveConflictMessage(null);
        }
    };

    if (initialLoading) return <LoadingSpinner />;

    return (
        <Layout>
            <div className="min-h-screen bg-gray-400 p-6 pb-16">
                <div className="max-w-6xl mx-auto flex flex-col gap-6">

                    {/* Nav row */}
                    <div className="flex flex-wrap justify-end gap-3">
                        <AddCityModal onCityAdded={(city) => setCities(prev => [...prev, city])} />
                        <AddAreaModal onAreaAdded={(area) => setAreas(prev => [...prev, area])} />
                        <Link to="/admin/roommates-without-house">
                            <Button variant="outline" className="flex items-center gap-2">
                                <UserCog size={16} />
                                {t('roommatesWithoutHouse')}
                            </Button>
                        </Link>
                        <Link to="/admin/users">
                            <Button className="flex items-center gap-2">
                                <Users size={16} />
                                {t('manageUsers')}
                            </Button>
                        </Link>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800">{t('adminDashboard')}</h1>

                    {/* Search bar */}
                    <div className="bg-white rounded-2xl shadow-md p-4 flex gap-3 flex-wrap">
                        <input
                            placeholder={t('searchByAddress')}
                            value={addressSearch}
                            onChange={e => {
                                setAddressSearch(e.target.value);
                                setFilters(prev => ({ ...prev, address: e.target.value || undefined, page: 0 }));
                            }}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <select
                            value={filters.cityId ?? 'all'}
                            onChange={e => setFilters(prev => ({
                                ...prev,
                                cityId: e.target.value === 'all' ? undefined : Number(e.target.value),
                                page: 0,
                            }))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">{t('allCities')}</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                        <select
                            value={filters.areaId ?? 'all'}
                            onChange={e => setFilters(prev => ({
                                ...prev,
                                areaId: e.target.value === 'all' ? undefined : Number(e.target.value),
                                page: 0,
                            }))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">{t('allAreas')}</option>
                            {areas.map(area => (
                                <option key={area.id} value={area.id}>{area.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Houses table */}
                    <div className={refetching ? 'opacity-60 pointer-events-none transition' : 'transition'}>
                        <PageTable
                            tableId="admin-houses-table"
                            title={`${t('houses')} (${totalElements})`}
                            color="indigo"
                            columns={[t('address'), t('owner'), t('roommates'), t('rating'), '', '', '']}
                            isEmpty={houses.length === 0}
                            emptyMessage={t('noHousesFound')}
                        >
                            {houses.map(house => (
                                <Fragment key={house.id}>
                                    <tr>
                                        <td className="px-5 py-3">
                                            <div>{house.address} {house.addressNumber}</div>
                                            <div className="text-xs text-slate-400">
                                                {[house.areaName, house.cityName].filter(Boolean).join(', ')}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">{house.ownerFullName}</td>
                                        <td className="px-5 py-3">{house.currentRoommates ?? 0}</td>
                                        <td className="px-5 py-3">
                                            {house.averageRating ? `⭐ ${house.averageRating.toFixed(1)}` : '-'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <EditHouseModal
                                                house={house}
                                                onHouseUpdated={(updated) =>
                                                    setHouses(prev => prev.map(h => h.id === updated.id ? updated : h))
                                                }
                                            />
                                        </td>
                                        <td className="px-5 py-3">
                                            <ChangeOwnerModal
                                                house={house}
                                                onOwnerChanged={(updated) =>
                                                    setHouses(prev => prev.map(h => h.id === updated.id ? updated : h))
                                                }
                                            />
                                        </td>
                                        <td className="px-5 py-3">
                                            <button
                                                title={t('viewDetails')}
                                                onClick={() => toggleExpand(house.id)}
                                                className="text-slate-400 hover:text-slate-600"
                                            >
                                                {expandedHouseId === house.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </td>

                                        {/* delete house */}
                                        <td className="px-5 py-3">
                                            <ConfirmDeleteModal
                                                onConfirm={async () => {
                                                    await adminDeleteHouse(house.id);
                                                    setHouses(prev => prev.filter(h => h.id !== house.id));
                                                    setExpandedHouseId(null);
                                                }}
                                                title={t('deleteHouse') || 'Delete House'}
                                                message={t('deleteHouseConfirmMessage') || 'Are you sure? This will permanently delete the house and all related data.'}
                                                triggerIcon={<Trash2 size={16} className="text-red-400" />}
                                            />
                                        </td>
                                    </tr>

                                    {expandedHouseId === house.id && (
                                        <tr>
                                            <td colSpan={7} className="bg-slate-50 px-5 py-4">
                                                {/* Pill tabs */}
                                                <div className="flex gap-2 flex-wrap mb-4">
                                                    {TABS.map(tab => (
                                                        <button
                                                            key={tab}
                                                            onClick={() => setActiveTab(tab)}
                                                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                                                                activeTab === tab
                                                                    ? 'bg-indigo-600 text-white'
                                                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                                                            }`}
                                                        >
                                                            {t(tab)}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* tab loading/scroll */}
                                                {tabLoading ? (
                                                    <p className="text-sm text-slate-400 italic">{t('loading')}</p>
                                                ) : (
                                                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">

                                                        {/* Roommates tab */}
                                                        {activeTab === 'roommates' && (
                                                            roommatesInHouse.length === 0 ? (
                                                                <p className="text-sm text-slate-400">{t('noRoommatesFound')}</p>
                                                            ) : roommatesInHouse.map(roommate => (
                                                                <div key={roommate.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 text-sm">
                                                                    <span>
                                                                        {roommate.firstname} {roommate.lastname}
                                                                        <span className="text-slate-400 ml-2">{roommate.email}</span>
                                                                        <span className="text-slate-400 ml-2">({t(roommate.gender)})</span>
                                                                    </span>
                                                                    <div className="flex items-center gap-3">
                                                                        <EditAdminRoommateModal
                                                                            roommate={roommate}
                                                                            onRoommateUpdated={(updated) =>
                                                                                setRoommatesInHouse(prev => prev.map(r => r.id === updated.id ? updated : r))
                                                                            }
                                                                        />
                                                                        <button
                                                                            title={t('removeFromHouse')}
                                                                            onClick={() => setConfirmTarget(roommate)}
                                                                            className="text-red-400 hover:text-red-600"
                                                                        >
                                                                            <UserMinus size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}

                                                        {/* Tasks tab */}
                                                        {activeTab === 'tasks' && (
                                                            tasksInHouse.length === 0 ? (
                                                                <p className="text-sm text-slate-400">{t('noTasksFound')}</p>
                                                            ) : tasksInHouse.map(task => (
                                                                <div key={task.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 text-sm">
                                                                    <span>{task.taskName}</span>
                                                                    <div className="flex items-center gap-3">
                                                                        <TaskInfoModal task={task} roommates={roommatesInHouse} />
                                                                        <ConfirmDeleteModal
                                                                            title={t('deleteTask')}
                                                                            message={t('deleteTaskConfirmMessage')}
                                                                            onConfirm={async () => {
                                                                                await adminDeleteTask(task.id);
                                                                                setTasksInHouse(prev => prev.filter(x => x.id !== task.id));
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}

                                                        {/* Expenses tab */}
                                                        {activeTab === 'expenses' && (
                                                            expensesInHouse.length === 0 ? (
                                                                <p className="text-sm text-slate-400">{t('noExpensesFound')}</p>
                                                            ) : expensesInHouse.map(expense => (
                                                                <div key={expense.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 text-sm">
                                                                    <span>{expense.description} - €{expense.amount}</span>
                                                                    <div className="flex items-center gap-3">
                                                                        <ExpenseInfoModal
                                                                            expense={expense}
                                                                            paidByName={
                                                                                roommatesInHouse.find(r => r.id === expense.paidById)
                                                                                    ? `${roommatesInHouse.find(r => r.id === expense.paidById)!.firstname} ${roommatesInHouse.find(r => r.id === expense.paidById)!.lastname}`
                                                                                    : `#${expense.paidById}`
                                                                            }
                                                                            roommates={roommatesInHouse}
                                                                        />
                                                                        <ConfirmDeleteModal
                                                                            title={t('deleteExpense')}
                                                                            message={t('deleteExpenseConfirmMessage')}
                                                                            onConfirm={async () => {
                                                                                await adminDeleteExpense(expense.id);
                                                                                setExpensesInHouse(prev => prev.filter(x => x.id !== expense.id));
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}

                                                        {/* Ratings tab - server-side house filtering not supported yet */}
                                                        {activeTab === 'ratings' && (
                                                            <p className="text-sm text-slate-400 italic">{t('comingSoon')}</p>
                                                        )}

                                                        {/* Invitations tab - inline rows, Invitation shape is small enough to not need a dedicated modal */}
                                                        {activeTab === 'invitations' && (
                                                            invitationsInHouse.length === 0 ? (
                                                                <p className="text-sm text-slate-400">{t('noInvitationsFound')}</p>
                                                            ) : invitationsInHouse.map(invitation => (
                                                                <div key={invitation.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 text-sm">
                                                                    <span>{invitation.senderFullName} → {invitation.receiverFullName} ({t(invitation.status)})</span>
                                                                    <ConfirmDeleteModal
                                                                        title={t('deleteInvitation')}
                                                                        message={t('deleteInvitationConfirmMessage')}
                                                                        onConfirm={async () => {
                                                                            await adminDeleteInvitation(invitation.id);
                                                                            setInvitationsInHouse(prev => prev.filter(x => x.id !== invitation.id));
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))
                                                        )}

                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </PageTable>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            disabled={(filters.page ?? 0) <= 0}
                            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page ?? 0) - 1 }))}
                        >
                            {t('previous')}
                        </Button>
                        <span className="text-sm text-slate-600 self-center">
                            {(filters.page ?? 0) + 1} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={(filters.page ?? 0) + 1 >= totalPages}
                            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page ?? 0) + 1 }))}
                        >
                            {t('next')}
                        </Button>
                    </div>

                </div>
            </div>

            {/* Step 1: plain confirmation before attempting the remove at all */}
            {confirmTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md flex flex-col gap-4">
                        <h3 className="font-semibold text-slate-800">{t('confirmRemoveRoommate')}</h3>
                        <p className="text-sm text-slate-600">
                            {t('confirmRemoveRoommateMessage', {
                                name: `${confirmTarget.firstname} ${confirmTarget.lastname}`,
                            })}
                        </p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setConfirmTarget(null)}>
                                {t('cancel')}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    const target = confirmTarget;
                                    setConfirmTarget(null);
                                    handleRemoveClick(target);
                                }}
                            >
                                {t('confirmRemove')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove-roommate confirmation, shown only when a 409 conflict happened */}
            {removeTarget && removeConflictMessage && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md flex flex-col gap-4">
                        <h3 className="font-semibold text-slate-800">{t('unsettledExpenses')}</h3>
                        <p className="text-sm text-slate-600">{removeConflictMessage}</p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => { setRemoveTarget(null); setRemoveConflictMessage(null); }}>
                                {t('cancel')}
                            </Button>
                            <Button variant="destructive" disabled={removeSubmitting} onClick={handleForceWriteOffConfirm}>
                                {removeSubmitting ? t('removing') : t('forceRemoveAndWriteOff')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};
export default AdminDashboardPage;