import type { Task } from '@/types';

export const formatTaskStatus = (status: string) =>
    status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

export const formatTaskCategory = (category: string) =>
    category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'PENDING': return 'text-yellow-600 bg-yellow-50';
        case 'IN_PROGRESS': return 'text-blue-600 bg-blue-50';
        case 'DONE': return 'text-green-600 bg-green-50';
        case 'OVERDUE': return 'text-red-600 bg-red-50';
        default: return 'text-slate-600 bg-slate-50';
    }
};

export const isAssigned = (task: Task, roommateId: number): boolean =>
    task.assigneeIds.includes(roommateId);