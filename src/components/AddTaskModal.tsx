import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { createTask } from '@/api/taskApi';
import { TaskCategory } from '@/types/enums';
import type { Task } from '@/types';
import { TaskInsertSchema } from '@/types';
import FormField from '@/components/FormField';
import { useTranslation } from 'react-i18next';
import {z} from "zod";

// dueDate comes from a datetime-local input (raw string) and is converted to ISO before validating against TaskInsert
type AddTaskForm = { taskName: string; taskCategory: string; dueDate: string };

interface AddTaskModalProps {
    houseId: number;
    onTaskAdded: (task: Task) => void;
}

const AddTaskModal = ({ houseId, onTaskAdded }: AddTaskModalProps) => {
    const { t } = useTranslation();

    // dueDate comes from a datetime-local input (raw string) and is converted to ISO before validating against TaskInsert
    const AddTaskFormSchema = TaskInsertSchema(t).omit({ houseId: true, dueDate: true }).extend({
        dueDate: z.string().min(1, t('dueDateIsRequired')),
    });

    const [open, setOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddTaskForm>({
        resolver: zodResolver(AddTaskFormSchema) as never,
        defaultValues: {
            taskName: '',
            taskCategory: TaskCategory.OTHER,
            dueDate: '',
        },
    });

    const onSubmit = async (data: AddTaskForm) => {
        try {
            const task = await createTask({
                taskName: data.taskName,
                taskCategory: data.taskCategory,
                dueDate: new Date(data.dueDate).toISOString(),
                houseId,
            });
            onTaskAdded(task);
            reset();
            setOpen(false);
        } catch {
            //console.error('Could not create task');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogDescription className="sr-only">{t('addANewTask')}</DialogDescription>
            <DialogTrigger asChild>
                <button
                    id="add-task-btn"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    + {t('addANewTask')}
                </button>
            </DialogTrigger>
            <DialogContent id="add-task-modal">
                <DialogHeader>
                    <DialogTitle>{t('addTask')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                    <FormField label={t('taskName')} htmlFor="task-name-input" error={errors.taskName?.message}>
                        <input
                            id="task-name-input"
                            {...register('taskName')}
                            placeholder={t('cleanTheDishes')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={t('category')} htmlFor="task-category-select" error={errors.taskCategory?.message}>
                        <select
                            id="task-category-select"
                            {...register('taskCategory')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {Object.values(TaskCategory).map(c => (
                                <option key={c} value={c}>{t(c)}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label={t('dueDate')} htmlFor="task-duedate-input" error={errors.dueDate?.message}>
                        <input
                            id="task-duedate-input"
                            type="datetime-local"
                            {...register('dueDate')}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <button
                        id="task-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {isSubmitting ? t('creating') : t('addTask')}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTaskModal;