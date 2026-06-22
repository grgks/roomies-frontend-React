import {z} from "zod";
import {RatingCategory} from "@/types/enums.ts";
import {PaginationParams} from "@/types/commonSchemas.ts";


//Rating
export const Rating = z.object({
    id: z.number().int(),
    fromRoommateId: z.number().int(),
    fromRoommateFullName: z.string(),
    toRoommateId: z.number().int(),
    toRoommateFullName: z.string(),
    category: z.enum(Object.values(RatingCategory) as [string, ...string[]]),
    score: z.number().int(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
export type Rating = z.infer<typeof Rating>;

//RatingInsert
export const RatingInsert = z.object({
    toRoommateId: z.number().int(),
    category: z.enum(Object.values(RatingCategory) as [string, ...string[]]),
    score: z.number().int().min(1).max(5),
});
export type RatingInsert = z.infer<typeof RatingInsert>;

//RatingFilters
export const RatingFilters = PaginationParams.extend({
    fromRoommateId: z.number().int().optional(),
    toRoommateId: z.number().int().optional(),
    category: z.enum(Object.values(RatingCategory) as [string, ...string[]]).optional(),
    score: z.number().int().min(1).max(5).optional(),
});
export type RatingFilters = z.infer<typeof RatingFilters>;