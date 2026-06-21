import z from "zod";
import {PaginationParams} from "@/types/commonSchemas.ts";

//ExpenseSplit
export const ExpenseSplit = z.object({
    id: z.number().int(),
    expenseId: z.number().int(),
    roommateId: z.number().int(),
    amount: z.number(),
    isPaid: z.boolean(),
    isWrittenOff: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
export type ExpenseSplit = z.infer<typeof ExpenseSplit>;

//Expense
export const Expense = z.object({
    id: z.number().int(),
    description: z.string(),
    amount: z.number(),
    paidById: z.number().int(),
    houseId: z.number().int(),
    dueDate: z.iso.date().optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
export  type Expense = z.infer<typeof Expense>;

//ExpenseInsert
export const ExpenseInsert = z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.coerce.number().positive("Amount must be positive"),
    houseId: z.number().int(),
    dueDate: z.string().optional(),
});
export type ExpenseInsert = z.infer<typeof ExpenseInsert>;

//ExpenseUpdate
export const ExpenseUpdate = ExpenseInsert.omit({
    houseId: true
});
export type ExpenseUpdate = z.infer<typeof ExpenseUpdate>;

//ExpenseFilters
export const ExpenseFilters = PaginationParams.extend({
    description: z.string().optional(),
    houseId: z.number().int().optional(),
    paidById: z.number().int().optional(),
    dueDateFrom: z.iso.date().optional(),
    dueDateTo: z.iso.date().optional(),
    amountFrom: z.number().optional(),
    amountTo: z.number().optional(),
});
export type ExpenseFilters = z.infer<typeof ExpenseFilters>;