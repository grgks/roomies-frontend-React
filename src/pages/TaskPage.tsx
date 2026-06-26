import Layout from "@/components/Layout.tsx";
import PageTable from "@/components/PageTable.tsx";
import {useEffect, useState} from "react";
import type {Roommate, Task} from "@/types";
import useAuth from "@/hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {deleteTask, getMyTasks, getTasksByHouse, updateTaskStatusById} from "@/api/taskApi.ts";
import LoadSpinner from "@/components/LoadSpinner.tsx";
import { Button } from "@/components/ui/button";
import {Trash2} from "lucide-react";
import { getStatusColor} from "@/services/taskService.ts";
import {TaskStatus} from "@/types/enums.ts";
import AddTaskModal from "@/components/AddTaskModal.tsx";
import EditTaskModal from "@/components/EditTaskModal.tsx";
import TaskInfoModal from "@/components/TaskInfoModal.tsx";
import {getActiveRoommates} from "@/api/roommateApi.ts";
import {useTranslation} from "react-i18next";
import usePageTitle from "@/hooks/usePageTitle.ts";


const TaskPage = ( ) => {

    const { t } = useTranslation();
    const { houseId} = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const [myTasks, setMyTasks] = useState<Task[]>([]);
    const [houseTasks, setHouseTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortByDate, setSortByDate] = useState(false);
    const [roommates, setRoommates] = useState<Roommate[]>([]);

    usePageTitle(t('tasks'))

    useEffect(() => {
        if (!houseId) {
            setError(t('couldNotLoadTasks'));
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                const [my, house, activeRoommates] = await Promise.all([
                    getMyTasks(),
                    getTasksByHouse(houseId),
                    getActiveRoommates(),
                ]);
                setMyTasks(my);
                setHouseTasks(house);
                setRoommates(activeRoommates);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [houseId]);

    const handleDelete = async (taskId: number) => {
        try {
            await deleteTask(taskId);
            setMyTasks(prev => prev.filter(t => t.id !== taskId));
            setHouseTasks(prev => prev.filter(t => t.id !== taskId));
        } catch {
            //console.error('Could not delete task');
        }
    };

    const handleStatusChange = async (taskId: number, status: string) => {
        try {
            const updated = await updateTaskStatusById(taskId, status);
            setMyTasks(prev => prev.map(t => t.id === taskId ? updated : t));
            setHouseTasks(prev => prev.map(t => t.id === taskId ? updated : t));
        } catch {
            //console.error('Could not update status');
        }
    };

    const sortTasks = (tasks: Task[]) => sortByDate
        ? [...tasks].sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        })
        : tasks;

    const filteredMyTasks = sortTasks(statusFilter === 'all' ? myTasks :
        myTasks.filter(t => t.taskStatus === statusFilter));

    const filteredHouseTasks = sortTasks(statusFilter === 'all' ? houseTasks :
        houseTasks.filter(t => t.taskStatus === statusFilter));

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-sky-100 flex items-center justify-center">
                    <p className="text-slate-600 text-lg">{error}</p>
                </div>
            </Layout>
        );
    }

    if (loading) return <LoadSpinner />;

    return (
        <Layout>
            <div className="bg-sky-300 min-h-screen p-6 pb-16">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">

                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-800">{t("tasks")}</h1>
                        <AddTaskModal houseId={houseId!} onTaskAdded={task => {
                            setMyTasks(prev => [...prev, task]);
                            setHouseTasks(prev => [...prev, task]);
                        }}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {['all', ...Object.values(TaskStatus)].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    statusFilter === s
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-200 text-slate-600'
                                }`}
                            >
                                {s === 'all' ? t('all') : t(s)}
                            </button>
                        ))}
                        <button
                            onClick={() => setSortByDate(prev => !prev)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                sortByDate ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                        >
                            {sortByDate ? t('date↑') : t('date↓')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* My Tasks */}
                        <PageTable
                            tableId="my-tasks-table"
                            title={t('myTasks')}
                            color="indigo"
                            columns={[t('task'), t('category'), "Status", t('dueDate'), "", "", ""]}
                            isEmpty={filteredMyTasks.length === 0}
                            emptyMessage={t('noTasksAssignedToYou')}
                            maxHeight="400px"
                        >
                            {filteredMyTasks.map(task => (
                                <tr key={`my-task-${task.id}`}>
                                    <td className="px-4 py-3 font-medium text-slate-700">{task.taskName}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">{t(task.taskCategory)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.taskStatus)}`}>
                                            {t(task.taskStatus)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('el-GR') : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            className="text-xs border rounded px-1 py-0.5"
                                            value={task.taskStatus}
                                            onChange={e => handleStatusChange(task.id, e.target.value)}
                                        >
                                            {Object.values(TaskStatus).map(s => (
                                                <option key={s} value={s}>{t(s)}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <EditTaskModal task={task} onTaskUpdated={updated => {
                                            setMyTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
                                            setHouseTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
                                        }} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            className="text-red-400 hover:text-red-600"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </PageTable>

                        {/* House Tasks */}
                        <PageTable
                            tableId="house-tasks-table"
                            title={t('houseTasks')}
                            color="violet"
                            columns={[t('task'), t('category'), "Status", t('dueDate'), ""]}
                            isEmpty={filteredHouseTasks.length === 0}
                            emptyMessage={t('noHouseTasksYet')}
                            maxHeight="400px"
                        >
                            {filteredHouseTasks.map(task => (
                                <tr key={task.id}>
                                    <td className="px-4 py-3 font-medium text-slate-700">{task.taskName}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">{t(task.taskCategory)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.taskStatus)}`}>
                                            {t(task.taskStatus)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('el-GR') : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <TaskInfoModal task={task} roommates={roommates} />
                                    </td>
                                </tr>
                            ))}
                        </PageTable>
                    </div>

                    <div className="flex justify-start">
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>{t('back')}</Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default TaskPage