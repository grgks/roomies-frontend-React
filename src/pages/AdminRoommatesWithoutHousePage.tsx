import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageTable from '@/components/PageTable';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadSpinner';
import EditAdminRoommateModal from '@/components/EditAdminRoommateModal';
import { adminGetRoommatesWithoutHouse } from '@/api/generalAdminApi';
import type { AdminRoommate } from '@/types';
import { useTranslation } from 'react-i18next';
import usePageTitle from "@/hooks/usePageTitle.ts";

const AdminRoommatesWithoutHousePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [roommates, setRoommates] = useState<AdminRoommate[]>([]);
    const [loading, setLoading] = useState(true);

    usePageTitle(t('roommatesWithoutHouse'))

    useEffect(() => {
        const fetchRoommates = async () => {
            try {
                const data = await adminGetRoommatesWithoutHouse();
                setRoommates(data);
            } finally {
                setLoading(false);
            }
        };
        fetchRoommates();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <Layout>
            <div className="min-h-screen bg-gray-400 p-6 pb-16">
                <div className="max-w-4xl mx-auto flex flex-col gap-6">

                    <h1 className="text-2xl font-bold text-slate-800">{t('roommatesWithoutHouse')}</h1>

                    <PageTable
                        tableId="admin-roommates-without-house-table"
                        title={`${t('roommatesWithoutHouse')} (${roommates.length})`}
                        color="violet"
                        columns={[t('firstname'), t('lastname'), t('email'), t('gender'), '']}
                        isEmpty={roommates.length === 0}
                        emptyMessage={t('noRoommatesWithoutHouseFound')}
                    >
                        {roommates.map(roommate => (
                            <tr key={roommate.id}>
                                <td className="px-5 py-3">{roommate.firstname}</td>
                                <td className="px-5 py-3">{roommate.lastname}</td>
                                <td className="px-5 py-3 text-slate-500">{roommate.email}</td>
                                <td className="px-5 py-3 text-slate-500">{t(roommate.gender)}</td>
                                <td className="px-5 py-3">
                                    <EditAdminRoommateModal
                                        roommate={roommate}
                                        onRoommateUpdated={(updated) =>
                                            setRoommates(prev => prev.map(r => r.id === updated.id ? updated : r))
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </PageTable>

                    <div className="flex justify-start">
                        <Button variant="outline" onClick={() => navigate('/admin')}>
                            {t('back')}
                        </Button>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default AdminRoommatesWithoutHousePage;