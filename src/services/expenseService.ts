import { getMyExpenseSplits, getExpenseByHouseId, markExpenseSplitAsPaid } from '@/api/expenseApi';
import { getMyHouse } from '@/api/houseApi';
import { getActiveRoommates } from '@/api/roommateApi';
import type { Expense, ExpenseSplit, Roommate, House } from '@/types';

export interface ExpensePageData {
    house: House;
    splits: ExpenseSplit[];
    expenses: Expense[];
    roommates: Roommate[];
}

// Fetches all data needed for ExpensesPage
export const fetchExpensePageData = async (): Promise<ExpensePageData> => {
    const house = await getMyHouse();
    const [splits, expenses, roommates] = await Promise.all([
        getMyExpenseSplits(),
        getExpenseByHouseId(house.id),
        getActiveRoommates(),
    ]);
    return { house, splits, expenses, roommates };
};

// Marks a split as paid and returns updated splits
export const handleMarkAsPaid = async (splitId: number): Promise<void> => {
    await markExpenseSplitAsPaid(splitId);
};

// Helper - get roommate name by id
export const getRoommateName = (roommates: Roommate[], id: number): string => {
    const roommate = roommates.find(r => r.id === id);
    return roommate ? `${roommate.firstname} ${roommate.lastname}` : 'formerRoommate';};

// Helper - get expense description by id
export const getExpenseDescription = (expenses: Expense[], expenseId: number): string => {
    return expenses.find(e => e.id === expenseId)?.description ?? `#${expenseId}`;
};

// Helper - get expense paidBy name
export const getExpensePaidBy = (expenses: Expense[], roommates: Roommate[], expenseId: number): string => {
    const expense = expenses.find(e => e.id === expenseId);
    return expense ? getRoommateName(roommates, expense.paidById) : '—';
};