import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateTaskById } from '@/api/taskApi';
import { TaskCategory, TaskStatus } from '@/types/enums';
import { TaskUpdate } from '@/types';
import type { Task } from '@/types';
import { Pencil } from 'lucide-react';
import FormField from '@/components/FormField';
import { useTranslation } from 'react-i18next';

// dueDate comes from a datetime-local input (raw string) and is converted to ISO before validating against TaskUpdate
const EditTaskFormSchema = TaskUpdate.extend({
    dueDate: z.string().min(1, 'Due date is required'),
});
type EditTaskForm = z.infer<typeof EditTaskFormSchema>;

interface EditTaskModalProps {
    task: Task;
    onTaskUpdated: (task: Task) => void;
}

const EditTaskModal = ({ task, onTaskUpdated }: EditTaskModalProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditTaskForm>({
        resolver: zodResolver(EditTaskFormSchema) as never,
        defaultValues: {
            taskName: task.taskName,
            taskCategory: task.taskCategory,
            taskStatus: task.taskStatus,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
        },
    });

    const onSubmit = async (data: EditTaskForm) => {
        try {
            const updated = await updateTaskById(task.id, {
                taskName: data.taskName,
                taskCategory: data.taskCategory,
                taskStatus: data.taskStatus,
                dueDate: new Date(data.dueDate).toISOString(),
            });
            onTaskUpdated(updated);
            setOpen(false);
        } catch {
            //console.error('Could not update task');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{t('editTaskDetails')}</DialogDescription>
            <DialogTrigger asChild>
                <button className="text-indigo-400 hover:text-indigo-600">
                    <Pencil size={16} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('editTask')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                    <FormField label={t('taskName')} htmlFor="edit-task-name-input" error={errors.taskName?.message}>
                        <input
                            id="edit-task-name-input"
                            {...register('taskName')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={t('category')} htmlFor="edit-task-category-select" error={errors.taskCategory?.message}>
                        <select
                            id="edit-task-category-select"
                            {...register('taskCategory')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {Object.values(TaskCategory).map(c => (
                                <option key={c} value={c}>{t(c)}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Status" htmlFor="edit-task-status-select" error={errors.taskStatus?.message}>
                        <select
                            id="edit-task-status-select"
                            {...register('taskStatus')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {Object.values(TaskStatus).map(s => (
                                <option key={s} value={s}>{t(s)}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label={t('dueDate')} htmlFor="edit-task-duedate-input" error={errors.dueDate?.message}>
                        <input
                            id="edit-task-duedate-input"
                            type="datetime-local"
                            {...register('dueDate')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {isSubmitting ? t('saving') : t('saveChanges')}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTaskModal;