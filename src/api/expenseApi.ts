import type {Expense, ExpenseInsert, ExpenseSplit, ExpenseUpdate} from "@/types";
import axiosInstance from "@/services/axiosInstance.ts";

//POST /api/expense - create expense
export const createExpense =
    async(data: ExpenseInsert): Promise<Expense> => {
    const res = await axiosInstance.post('/api/expense', data);
    return res.data;
    }

//PUT /api/expense/{id} - update expense
export const updateExpense =
    async(id: number, data: ExpenseUpdate): Promise<Expense> => {
    const res = await axiosInstance.put(`/api/expense/${id}`, data);
    return res.data;
    }

//DELETE /api/expense/{id} - delete expense
export const deleteExpense =
    async(id: number): Promise<void> => {
       await axiosInstance.delete(`/api/expense/${id}`);
    }

//PUT /api/expense//splits/{splitId}/paid - mark expenseSplit as paid
export const markExpenseSplitAsPaid =
    async(splitId : number): Promise<ExpenseSplit> => {
    const res = await
        axiosInstance.put(`/api/expense/splits/${splitId}/paid`);
    return res.data;
    }

 //GET /api/expense/house/{houseId} - get expenses by house
export const getExpenseByHouseId =
    async(houseId: number): Promise<Expense[]> => {
    const res =
        await axiosInstance.get(`/api/expense/house/${houseId}`);
    return res.data;
    }

//GET /api/expense/splits/me - get my ExpenseSplits
export const getMyExpenseSplits =
    async(): Promise<ExpenseSplit[]> => {
    const res =
        await axiosInstance.get(`/api/expense/splits/me`);
    return res.data;
    }

//GET /api/expense/splits/house/{houseId}/unpaid - get unpaid splits by house
export const getUnpaidExpenseSplitsByHouse =
    async(houseId: number): Promise<ExpenseSplit[]> => {
    const res =
        await axiosInstance.get(`/api/expense/splits/house/${houseId}/unpaid`);
    return res.data;
    }

//GET /api/expense/{expenseId/splits - get splits by expense
export const getSplitsByExpense = async (expenseId: number): Promise<ExpenseSplit[]> => {
    const res = await axiosInstance.get(`/api/expense/${expenseId}/splits`);
    return res.data;
};