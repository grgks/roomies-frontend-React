import { Info } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import type {Roommate, Task} from '@/types';
import { getStatusColor } from '@/services/taskService';
import {useTranslation} from "react-i18next";

interface TaskInfoModalProps {
    task: Task;
    roommates: Roommate[];
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('el-GR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

const TaskInfoModal = ({ task , roommates}: TaskInfoModalProps) => {

    const { t } = useTranslation();

    return (
        <Dialog>
            <DialogDescription className="sr-only">{t('taskDetails')}</DialogDescription>
            <DialogTrigger asChild>
                 <span className="text-slate-400 hover:text-indigo-500 transition cursor-pointer">
        <Info size={16} strokeWidth={2.75} />
                </span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('taskDetails')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-2 text-sm text-slate-700">
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('name')}</span>
                        <span className="font-medium">{task.taskName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('category')}</span>
                        <span className="font-medium">{t(task.taskCategory)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Status</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.taskStatus)}`}>
                             {t(task.taskStatus)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('dueDate')}</span>
                        <span className="font-medium">{task.dueDate ? formatDate(task.dueDate) : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('assignees')}</span>
                        <span className="font-medium">
                            {task.assigneeIds.length > 0
                                ? task.assigneeIds.map(id => {
                                    const r = roommates.find(r => r.id === id);
                                    return r ? `${r.firstname} ${r.lastname}` : `#${id}`;
                                }).join(', ')
                                : '—'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('createdAt')}</span>
                        <span className="font-medium">{formatDate(task.createdAt)}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskInfoModal;