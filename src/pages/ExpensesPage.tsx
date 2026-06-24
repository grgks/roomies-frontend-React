import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {getExpenseByHouseId, getMyExpenseSplits} from "@/api/expenseApi";
import type { Expense, ExpenseSplit, Roommate } from "@/types";
import PageTable from "@/components/PageTable.tsx";
import AddExpenseModal from "@/components/AddExpenseModal.tsx";
import {
    getRoommateName,
    getExpenseDescription,
    getExpensePaidBy,
    handleMarkAsPaid
} from "@/services/expenseService.ts";
import ExpenseSplitInfoModal from "@/components/ExpenseSpliInfoModal.tsx";
import { Button } from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import useAuth from "@/hooks/useAuth.ts";
import {getActiveRoommates} from "@/api/roommateApi.ts";
import ExpenseInfoModal from "@/components/ExpenseInfoModal.tsx";
import {useTranslation} from "react-i18next";
import usePageTitle from "@/hooks/usePageTitle.ts";

const ExpensesPage = () => {
    const { houseId, roommateId } = useAuth();
    const { t } = useTranslation();
    const [splits, setSplits] = useState<ExpenseSplit[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [roommates, setRoommates] = useState<Roommate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');

    const navigate = useNavigate();

    usePageTitle(t('expenses'))

    useEffect(() => {
        const fetchData = async () => {
            if (!houseId) {
                setError(t('couldNotLoadExpensesMakeSureYouArePartOfAHouse'));
                setLoading(false);
                return;
            }
            try {
                const [mySplits, houseExpenses, activeRoommates] = await Promise.all([
                    getMyExpenseSplits(),
                    getExpenseByHouseId(houseId),
                    getActiveRoommates(),
                ]);
                setSplits(mySplits);
                setExpenses(houseExpenses);
                setRoommates(activeRoommates);
            } catch {
                setError("Could not load expenses.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [houseId]);

    const onMarkAsPaid = async (splitId: number) => {
        try {
            await handleMarkAsPaid(splitId);
            setSplits(prev => prev.map(s =>
                s.id === splitId ? { ...s, isPaid: true } : s
            ));
        } catch {
            //console.error('Could not mark split as paid');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-slate-300 flex items-center justify-center">
                    <Loader2 size={48} className="text-indigo-500 animate-spin" />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-slate-300 flex items-center justify-center">
                    <p className="text-slate-600 text-lg">{error}</p>
                </div>
            </Layout>
        );
    }

    const filteredSplits = splits.filter(s => {
        if (filter === 'paid' && !s.isPaid) return false;
        if (filter === 'unpaid' && s.isPaid) return false;
        if (dateFrom && new Date(s.createdAt) < new Date(dateFrom)) return false;
        if (dateTo && new Date(s.createdAt) > new Date(dateTo)) return false;
        return true;
    });

    return (
        <Layout>
            <div className="min-h-screen bg-mist-400 p-6">

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">{t('expenses')}</h1>
                    <AddExpenseModal
                        houseId={houseId!}
                        onExpenseAdded={async (expense) => {
                            setExpenses(prev => [...prev, expense]);
                            const newSplits = await getMyExpenseSplits();
                            setSplits(newSplits);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* LEFT - My Splits / search actionsβ */}
                    {/*  */}
                    <div>
                        <div className="flex gap-2 mb-2 items-center flex-wrap">
                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                   className="border rounded px-2 py-1 text-xs" />
                            <span className="text-xs text-slate-500">-</span>
                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                   className="border rounded px-2 py-1 text-xs" />
                            <button onClick={() => setFilter('all')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium 
                                    ${filter === 'all' ? 'bg-indigo-600 text-white' :
                                        'bg-slate-200 text-slate-600'}`}>{t('all')}</button>
                            <button onClick={() => setFilter('unpaid')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium
                                     ${filter === 'unpaid' ? 'bg-red-500 text-white' :
                                        'bg-slate-200 text-slate-600'}`}>{t('unpaid')}</button>
                            <button onClick={() => setFilter('paid')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium
                                     ${filter === 'paid' ? 'bg-green-500 text-white' :
                                        'bg-slate-200 text-slate-600'}`}>{t('paid')}</button>
                    </div>
                    <PageTable
                        tableId="my-splits-table"
                        title={t('mySplits')}
                        color="indigo"
                        columns={["Status", t('expenses'), t('owedTo'),
                            t('amount'), t('paid'), ""]}
                        isEmpty={splits.length === 0}
                        emptyMessage={('noSplitsYet')}
                        maxHeight="400px"

                    >
                        {filteredSplits.map((split) => (
                            <tr key={split.id} id={`split-${split.id}`}>
                                <td id={`split-status-${split.id}`} className="px-5 py-3">
                                    {split.isPaid
                                        ? <CheckCircle size={18} className="text-green-500" />
                                        : <XCircle size={18} className="text-red-400" />
                                    }
                                </td>
                                <td id={`split-description-${split.id}`} className="px-5 py-3 font-medium text-slate-700">
                                    {getExpenseDescription(expenses, split.expenseId)}
                                </td>
                                <td id={`split-owedto-${split.id}`} className="px-5 py-3 text-slate-500">
                                    {t(getExpensePaidBy(expenses, roommates, split.expenseId))}
                                    {expenses.find(e => e.id === split.expenseId)?.paidById === roommateId && (
                                        <span className="ml-2 text-xs bg-blue-300 text-indigo-700 px-2 py-0.5 rounded-full">{t('owner')}</span>
                                    )}
                                </td>
                                <td id={`split-amount-${split.id}`} className={`px-5 py-3 text-right font-semibold ${split.isPaid ? "text-green-600" : "text-red-500"}`}>
                                    €{split.amount}
                                </td>
                                <td id={`split-action-${split.id}`} className="px-5 py-3">
                                    <input
                                        type="checkbox"
                                        checked={split.isPaid}
                                        disabled={split.isPaid}
                                        onChange={() => onMarkAsPaid(split.id)}
                                        className="w-4 h-4 accent-green-500 cursor-pointer disabled:cursor-default"
                                    />
                                </td>
                                <td className="px-5 py-3">
                                    <ExpenseSplitInfoModal
                                        split={split}
                                        createdByName={t(getRoommateName(roommates, split.roommateId))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </PageTable>
                    </div>


                    {/* RIGHT - House Expenses */}
                    <PageTable
                        tableId="house-expenses-table"
                        title={t('houseExpenses')}
                        color="violet"
                        columns={[t('description'), t('paidBy'),t('total'),""]}
                        isEmpty={expenses.length === 0}
                        emptyMessage={t('noExpensesYet')}
                        maxHeight="400px"

                    >
                        {expenses.map((expense) => (
                            <tr key={expense.id} id={`expense-${expense.id}`}>
                                <td id={`expense-description-${expense.id}`} className="px-5 py-3 font-medium text-slate-700">
                                    {expense.description}
                                </td>
                                <td id={`expense-paidby-${expense.id}`} className="px-5 py-3 text-slate-500">
                                    {t(getRoommateName(roommates, expense.paidById))}
                                    {expense.paidById === roommateId && (
                                        <span className="ml-2 text-xs bg-blue-300 text-indigo-700 px-2 py-0.5 rounded-full">{t('owner')}</span>
                                    )}
                                </td>
                                <td id={`expense-amount-${expense.id}`} className="px-5 py-3 text-right font-semibold text-violet-700">
                                    €{expense.amount}
                               </td>
                                <td className="px-5 py-3">
                                    <ExpenseInfoModal
                                        expense={expense}
                                        paidByName={t(getRoommateName(roommates, expense.paidById))}
                                        roommates={roommates}
                                    />
                                </td>
                            </tr>
                        ))}
                    </PageTable>
                    <div>
                    <Button
                    onClick={() => navigate("/dashboard")}>
                        {t('back')}
                    </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ExpensesPage;