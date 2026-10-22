import z from "zod";
import {SmokingPreference, PetPreference, NoiseLevel, VisitorFrequency, GenderPreference} from "@/types/enums.ts";

const numOrNull = (val: unknown) =>
    val === '' || val === null || val === undefined || Number.isNaN(Number(val)) ? null : Number(val);

const strOrNull = (val: unknown) =>
    val === '' || val === null || val === undefined ? null : val;

// RoommateProfile

export const RoommateProfile = z.object({
    id: z.number().int(),
    roommateId: z.number().int(),
    smoking: z.string().nullable(),
    hasPets: z.boolean().nullable(),
    noiseLevel: z.string().nullable(),
    visitors: z.string().nullable(),
    lgbtqFriendly: z.boolean(),
    age: z.number().int().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
export type RoommateProfile = z.infer<typeof RoommateProfile>;

export const RoommateProfileUpsertSchema = (t: (key: string) => string) => z.object({
    smoking: z.preprocess(strOrNull, z.enum(Object.values(SmokingPreference) as [string, ...string[]]).nullable()).optional(),
    hasPets: z.boolean().nullable().optional(),
    noiseLevel: z.preprocess(strOrNull, z.enum(Object.values(NoiseLevel) as [string, ...string[]]).nullable()).optional(),
    visitors: z.preprocess(strOrNull, z.enum(Object.values(VisitorFrequency) as [string, ...string[]]).nullable()).optional(),
    lgbtqFriendly: z.boolean().optional(),
    age: z.preprocess(numOrNull,
        z.number().int().min(18, t('ageMin18')).max(99, t('ageMax99')).nullable()
    ).optional(),
});
export type RoommateProfileUpsert = z.infer<ReturnType<typeof RoommateProfileUpsertSchema>>;


// HouseProfile

export const HouseProfile = z.object({
    id: z.number().int(),
    houseId: z.number().int(),
    rent: z.number().nullable(),
    hasHeating: z.boolean(),
    hasAirConditioning: z.boolean(),
    furnished: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
export type HouseProfile = z.infer<typeof HouseProfile>;

export const HouseProfileUpsertSchema = (t: (key: string) => string) => z.object({
    rent: z.preprocess(numOrNull,
        z.number().min(0, t('rentMin0')).nullable()
    ).optional(),
    hasHeating: z.boolean().optional(),
    hasAirConditioning: z.boolean().optional(),
    furnished: z.boolean().optional(),
});
export type HouseProfileUpsert = z.infer<ReturnType<typeof HouseProfileUpsertSchema>>;


//RoommatePreferences

export const RoommatePreferences = z.object({
    id: z.number().int(),
    roommateId: z.number().int(),
    smoking: z.string().nullable(),
    pets: z.string().nullable(),
    noiseLevel: z.string().nullable(),
    visitors: z.string().nullable(),
    genderPreference: z.string().nullable(),
    lgbtqFriendly: z.boolean(),
    minAge: z.number().int().nullable(),
    maxAge: z.number().int().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
export type RoommatePreferences = z.infer<typeof RoommatePreferences>;

export const RoommatePreferencesUpsertSchema = (t: (key: string) => string) => z.object({
    smoking: z.preprocess(strOrNull, z.enum(Object.values(SmokingPreference) as [string, ...string[]]).nullable()).optional(),
    pets: z.preprocess(strOrNull, z.enum(Object.values(PetPreference) as [string, ...string[]]).nullable()).optional(),
    noiseLevel: z.preprocess(strOrNull, z.enum(Object.values(NoiseLevel) as [string, ...string[]]).nullable()).optional(),
    visitors: z.preprocess(strOrNull, z.enum(Object.values(VisitorFrequency) as [string, ...string[]]).nullable()).optional(),
    genderPreference: z.preprocess(strOrNull, z.enum(Object.values(GenderPreference) as [string, ...string[]]).nullable()).optional(),
    lgbtqFriendly: z.boolean().optional(),
    minAge: z.preprocess(numOrNull,
        z.number().int().min(18, t('ageMin18')).max(99, t('ageMax99')).nullable()
    ).optional(),
    maxAge: z.preprocess(numOrNull,
        z.number().int().min(18, t('ageMin18')).max(99, t('ageMax99')).nullable()
    ).optional(),
});
export type RoommatePreferencesUpsert = z.infer<ReturnType<typeof RoommatePreferencesUpsertSchema>>;


//HousePreferences

export const HousePreferences = z.object({
    id: z.number().int(),
    roommateId: z.number().int(),
    cityId: z.number().int().nullable(),
    cityName: z.string().nullable(),
    areaId: z.number().int().nullable(),
    areaName: z.string().nullable(),
    minRooms: z.number().int().nullable(),
    maxRooms: z.number().int().nullable(),
    hasPhotosOnly: z.boolean(),
    minBudget: z.number().nullable(),
    maxBudget: z.number().nullable(),
    requiresHeating: z.boolean(),
    requiresAirConditioning: z.boolean(),
    requiresFurnished: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
export type HousePreferences = z.infer<typeof HousePreferences>;

export const HousePreferencesUpsertSchema = (t: (key: string) => string) => z.object({
    cityId: z.preprocess(numOrNull, z.number().int().nullable()).optional(),
    areaId: z.preprocess(numOrNull, z.number().int().nullable()).optional(),
    minRooms: z.preprocess(numOrNull, z.number().int().min(1, t('minValue1')).nullable()).optional(),
    maxRooms: z.preprocess(numOrNull, z.number().int().min(1, t('minValue1')).nullable()).optional(),
    hasPhotosOnly: z.boolean().optional(),
    minBudget: z.preprocess(numOrNull, z.number().min(0, t('minValue0')).nullable()).optional(),
    maxBudget: z.preprocess(numOrNull, z.number().min(0, t('minValue0')).nullable()).optional(),
    requiresHeating: z.boolean().optional(),
    requiresAirConditioning: z.boolean().optional(),
    requiresFurnished: z.boolean().optional(),
});
export type HousePreferencesUpsert = z.infer<ReturnType<typeof HousePreferencesUpsertSchema>>;