import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { createExpense } from '@/api/expenseApi';
import { type Expense, ExpenseInsert } from '@/types';
import FormField from '@/components/FormField';
import {useTranslation} from "react-i18next";

const AddExpenseSchema = ExpenseInsert.omit({ houseId: true });
type AddExpenseForm = z.infer<typeof AddExpenseSchema>;

interface AddExpenseModalProps {
    houseId: number;
    onExpenseAdded: (expense: Expense) => void;
}


const AddExpenseModal = ({ houseId, onExpenseAdded }: AddExpenseModalProps) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddExpenseForm>({
        resolver: zodResolver(AddExpenseSchema) as never,
    });

    const onSubmit = async (data: AddExpenseForm) => {
        try {
            const expense = await createExpense({
                description: data.description,
                amount: data.amount,
                houseId,
                dueDate: data.dueDate || undefined,
            });
            onExpenseAdded(expense);
            reset();
            setOpen(false);
        } catch {
            console.error('Could not create expense');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    id="add-expense-btn"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    {t('addExpense')}
                </button>
            </DialogTrigger>
            <DialogContent id="add-expense-modal">
                <DialogHeader>
                    <DialogTitle>{t('addExpense')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

                    <FormField label={t('description')} htmlFor="expense-description-input" error={errors.description?.message}>
                        <input
                            id="expense-description-input"
                            {...register('description')}
                            placeholder={t('waterBill')}
                            className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={`${t('amount')} (€)`} htmlFor="expense-amount-input" error={errors.amount?.message}>
                        <input
                            id="expense-amount-input"
                            {...register('amount', { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <FormField label={`${t('dueDate')} (${t('optional')})`} htmlFor="expense-duedate-input">
                        <input
                            id="expense-duedate-input"
                            {...register('dueDate')}
                            type="date"
                            className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </FormField>

                    <button
                        id="expense-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {isSubmitting ? t('saving') : t('addExpense')}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddExpenseModal;