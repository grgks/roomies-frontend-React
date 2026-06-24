import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageTable from '@/components/PageTable';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadSpinner';
import { getAllUsers, activateUser, softDeleteUser, hardDeleteUser } from '@/api/userAdminApi';
import useAuth from '@/hooks/useAuth';
import type { User, UserFilters } from '@/types';
import EditUserModal from '@/components/EditUserModal';
import ResetPasswordModal from '@/components/ResetPasswordModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { useTranslation } from 'react-i18next';
import usePageTitle from "@/hooks/usePageTitle.ts";

const AdminUsersPage = () => {
    const { t } = useTranslation();
    const { isSuperAdmin } = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState<UserFilters>({ page: 0, pageSize: 10 });
    const [totalElements, setTotalElements] = useState(0);

    usePageTitle(t('manageUsers'))

    useEffect(() => {
        const fetchUsers = async () => {
            setRefetching(true);
            try {
                const response = await getAllUsers(filters);
                setUsers(response.data);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } finally {
                setRefetching(false);
                setInitialLoading(false);
            }
        };
        fetchUsers();
    }, [filters]);

    const handleActivate = async (id: number) => {
        await activateUser(id);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: true } : u));
    };

    const handleDeactivate = async (id: number) => {
        await softDeleteUser(id);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: false } : u));
    };

    if (initialLoading) return <LoadingSpinner />;

    return (
        <Layout>
            <div className="min-h-screen bg-slate-100 p-6 pb-16">
                <div className="max-w-6xl mx-auto flex flex-col gap-6">

                    <h1 className="text-2xl font-bold text-slate-800">{t('adminUsers')}</h1>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-md p-4 flex gap-3 flex-wrap">
                        <input
                            placeholder={t('email')}
                            value={filters.email ?? ''}
                            onChange={e => setFilters(prev => ({ ...prev, email: e.target.value, page: 0 }))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                            placeholder={t('phoneNumber')}
                            value={filters.phoneNumber ?? ''}
                            onChange={e => setFilters(prev => ({ ...prev, phoneNumber: e.target.value, page: 0 }))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <select
                            value={filters.isActive === undefined ? 'all' : String(filters.isActive)}
                            onChange={e => setFilters(prev => ({
                                ...prev,
                                isActive: e.target.value === 'all' ? undefined : e.target.value === 'true',
                                page: 0,
                            }))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">{t('all')}</option>
                            <option value="true">{t('active')}</option>
                            <option value="false">{t('inactive')}</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className={refetching ? 'opacity-60 pointer-events-none transition' : 'transition'}>
                        <PageTable
                            tableId="admin-users-table"
                            title={`${t('users')} (${totalElements})`}
                            color="indigo"
                            columns={[t('email'), t('phoneNumber'), t('status'), t('createdAt'), '']}
                            isEmpty={users.length === 0}
                            emptyMessage={t('noUsersFound')}
                        >
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="px-5 py-3">{u.email}</td>
                                <td className="px-5 py-3">{u.phoneNumber}</td>
                                <td className="px-5 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {u.isActive ? t('active') : t('inactive')}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-xs text-slate-500">
                                    {new Date(u.createdAt).toLocaleDateString('el-GR')}
                                </td>
                                <td className="px-5 py-3 flex gap-2 items-center">
                                    {u.isActive ? (
                                        <button onClick={() => handleDeactivate(u.id)} className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200">
                                            {t('deactivate')}
                                        </button>
                                    ) : (
                                        <button onClick={() => handleActivate(u.id)} className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200">
                                            {t('activate')}
                                        </button>
                                    )}

                                    <EditUserModal
                                        user={u}
                                        onUserUpdated={(updated) =>
                                            setUsers(prev => prev.map(x => x.id === updated.id ? updated : x))
                                        }
                                    />

                                    <ResetPasswordModal userId={u.id} disabled={!isSuperAdmin} />

                                    <ConfirmDeleteModal
                                        title={t('hardDeleteUser')}
                                        message={t('hardDeleteConfirmMessage')}
                                        disabled={!isSuperAdmin}
                                        disabledTitle={t('onlySuperAdminCanDoThis')}
                                        onConfirm={async () => {
                                            await hardDeleteUser(u.id);
                                            setUsers(prev => prev.filter(x => x.id !== u.id));
                                        }}
                                    />
                                </td>
                            </tr>
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
        </Layout>
    );
};

export default AdminUsersPage;