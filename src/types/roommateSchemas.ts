import z from "zod";
import {Gender} from "@/types/enums.ts";

//Roommate
export const Roommate =  z.object({
    id: z.number().int(),
    firstname: z.string(),
    lastname: z.string(),
    gender: z.enum(Object.values(Gender) as [string, ...string[]]),
    activeAtSearch: z.boolean().optional(),
    userId: z.number().int().optional(),
    houseIds: z.array(z.number().int()).optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});

export type Roommate = z.infer<typeof Roommate>;



//RoommateInsert
export const RoommateInsertSchema = (t: (key: string) => string) => z.object({
    firstname: z.string().min(3, t("firstnameMustBeBetween3And15")).max(15, t("firstnameMustBeBetween3And15")),
    lastname: z.string().min(3, t("lastnameMustBeBetween3And15")).max(15, t("lastnameMustBeBetween3And15")),
    gender: z.enum(Object.values(Gender) as [string, ...string[]], { error: t('selectGender') }),
});

export type RoommateInsert = z.infer<ReturnType<typeof RoommateInsertSchema>>;



//RoommateUpdate
export const RoommateUpdateSchema = (t: (key: string) => string) => z.object({
    id: z.number().int().optional(),
    keycloakId: z.string().optional(),
    firstname: z.string().min(3, t("firstnameMustBeBetween3And15")).max(15, t("firstnameMustBeBetween3And15")),
    lastname: z.string().min(3, t("lastnameMustBeBetween3And15")).max(15, t("lastnameMustBeBetween3And15")),
    gender: z.enum(Object.values(Gender) as [string, ...string[]], { error: t('selectGender') }),
    activeAtSearch: z.boolean().optional(),
});
export type RoommateUpdate = z.infer<ReturnType<typeof RoommateUpdateSchema>>;

//RoommateSearch (privacy-minimised, for invite search)
export const RoommateSearch = z.object({
    id: z.number().int(),
    firstname: z.string(),
    gender: z.enum(Object.values(Gender) as [string, ...string[]]),
    avatarId: z.string().nullable().optional(),
    rating: z.number().nullable().optional(),
});
export type RoommateSearch = z.infer<typeof RoommateSearch>;

//Roommate Filters
export const RoommateFilters = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    gender: z.enum(Object.values(Gender) as [string, ...string[]]).optional(),
    houseId: z.number().int().optional(),
});
export type RoommateFilters = z.infer<typeof RoommateFilters>;