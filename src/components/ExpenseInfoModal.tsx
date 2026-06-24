import { Info } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Expense, ExpenseSplit, Roommate } from '@/types';
import { getRoommateName } from "@/services/expenseService.ts";
import { getSplitsByExpense } from "@/api/expenseApi.ts";
import {useTranslation} from "react-i18next";

interface ExpenseInfoModalProps {
    expense: Expense;
    paidByName: string;
    roommates: Roommate[];
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('el-GR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

const ExpenseInfoModal = ({ expense, paidByName, roommates = [] }: ExpenseInfoModalProps) => {

    const { t } = useTranslation();
    const [splits, setSplits] = useState<ExpenseSplit[]>([]);


    const handleOpen = async (open: boolean) => {
        if (open) {
            try {
                const data = await getSplitsByExpense(expense.id);
                setSplits(data);
            } catch {
                setSplits([]);
            }
        }
    };

    return (
        <Dialog onOpenChange={handleOpen}>
            <DialogTrigger asChild>
                <button className="text-slate-400 hover:text-violet-500 transition">
                    <Info size={16} strokeWidth={2.75} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('expenseDetails')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-2 text-sm text-slate-700">
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('paidBy')}</span>
                        <span className="font-medium">{paidByName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('createdAt')}</span>
                        <span className="font-medium">{formatDate(expense.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">{t('updatedAt')}</span>
                        <span className="font-medium">{formatDate(expense.updatedAt)}</span>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                        <span className="text-slate-500 text-xs font-medium">{t('splits')}</span>
                        {splits.map(s => (
                            <div key={s.id} className="flex justify-between text-xs">
                                <span>{t(getRoommateName(roommates, s.roommateId))}</span>
                                <span className={s.isPaid ? 'text-green-600' : 'text-red-500'}>
                                    €{s.amount} {s.isPaid ? '✅' : '⏳'}
                                </span>
                            </div>
                        ))}
                    </div>
                    {expense.dueDate && (
                        <div className="flex justify-between">
                            <span className="text-slate-500">{t('dueDate')}</span>
                            <span className="font-medium">{expense.dueDate}</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseInfoModal;