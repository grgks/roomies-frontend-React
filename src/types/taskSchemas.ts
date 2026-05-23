import z from "zod";
import {TaskCategory, TaskStatus} from "@/types/enums.ts";

// Task
export const Task =  z.object({
    id: z.number().int(),
    taskName: z.string(),
    taskStatus: z.enum(Object.values(TaskStatus) as [string, ...string[]]),
    assigneeIds: z.array(z.number().int()),
    houseId: z.number().int(),
    dueDate: z.iso.datetime().optional(),
    taskCategory: z.enum(Object.values(TaskCategory) as [string, ...string[]]),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
export type Task = z.infer<typeof Task>;


//TaskInsert
export const TaskInsert = z.object({
    taskName: z.string(),
    dueDate: z.iso.datetime(),
    houseId: z.number().int(),
    taskCategory: z.enum(Object.values(TaskCategory) as [string, ...string[]]),
}) ;
export type TaskInsert = z.infer<typeof TaskInsert>;

//TaskUpdate
export const TaskUpdate = z.object({
    taskName: z.string(),
    taskCategory: z.enum(Object.values(TaskCategory) as [string, ...string[]]),
    taskStatus: z.enum(Object.values(TaskStatus) as [string, ...string[]]),
    dueDate: z.iso.datetime(),
}) ;
export type TaskUpdate = z.infer<typeof TaskUpdate>;

//TaskFilters
export const TaskFilters = z.object({
    taskStatus: z.enum(Object.values(TaskStatus) as
        [string, ...string[]]).optional(),
    taskCategory: z.enum(Object.values(TaskCategory) as
        [string, ...string[]]).optional(),
    taskName: z.string().optional(),
    houseId: z.number().int().optional(),
    roommateId: z.number().int().optional(),
    dueDateFrom: z.iso.date().optional(),
    dueDateTo: z.iso.date().optional(),
});
export type TaskFilters = z.infer<typeof TaskFilters>;