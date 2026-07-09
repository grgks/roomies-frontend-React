import z from "zod";
import {PaginationParams} from "@/types/commonSchemas.ts";

//House
export const House = z.object({
    id: z.number().int(),
    address: z.string(),
    addressNumber: z.string(),
    apartment: z.string(),
    numOfRooms: z.number().int().min(1).optional(),
    ownerId: z.number().int(),
    areaId: z.number().int(),
    areaName: z.string().optional(),
    cityId: z.number().int().optional(),
    cityName: z.string().optional(),
    ownerFullName: z.string().optional(),
    currentRoommates: z.number().int().optional(),
    averageRating: z.number().optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
export type House = z.infer<typeof House>;

//HouseInsert
export const HouseInsertSchema = (t: (key: string) => string) => z.object({
    address: z.string().min(3, t('minChars3')).max(40, t('maxChars40')),
    addressNumber: z.string().min(1, t('required')).max(15, t('maxChars15')),
    apartment: z.string().min(1, t('required')),
    numOfRooms: z.coerce.number().int().min(1, t('minValue1')).optional(),
    areaId: z.coerce.number({ error: t('required') }).int(),
});
export type HouseInsert = z.infer<ReturnType<typeof HouseInsertSchema>>;


//HouseUpdate
export const HouseUpdateSchema = (t: (key: string) => string) =>
    House.omit({id: true, ownerId: true, areaId: true,
    createdAt: true, updatedAt: true })
    .extend({
        address: z.string().min(3, t('minChars3')).max(40, t('maxChars40')),
        addressNumber: z.string().min(1, t('required')).max(15, t('maxChars15')),
        apartment: z.string().min(1, t('required')),
    })
export type HouseUpdate = z.infer<ReturnType<typeof HouseUpdateSchema>>;

//HouseFilters
export const HouseFilters = PaginationParams.extend({
    address: z.string().optional(),
    addressNumber: z.string().optional(),
    apartment: z.string().optional(),
    numOfRooms: z.number().int().optional(),
    hasAvailableRooms: z.boolean().optional(),
    ownerId: z.number().int().optional(),
    roommateId: z.number().int().optional(),
    areaId: z.number().int().optional(),
    cityId: z.number().int().optional(),
});
export type HouseFilters = z.infer<typeof HouseFilters>;