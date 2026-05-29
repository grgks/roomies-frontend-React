import z from "zod";

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
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
export type House = z.infer<typeof House>;

//HouseInsert
export const HouseInsert = z.object({
    address: z.string().min(3).max(40),
    addressNumber: z.string().max(15),
    apartment: z.string(),
    numOfRooms: z.coerce.number().int().min(1).optional(),
    areaId: z.coerce.number().int(),
});
export type HouseInsert = z.infer<typeof HouseInsert>;


//HouseUpdate
export const HouseUpdate =
    House.omit({id: true, ownerId: true, areaId: true,
    createdAt: true, updatedAt: true })
    .extend({
        address: z.string().min(3).max(40),
        addressNumber: z.string().max(15),
        apartment: z.string(),
    })
export type HouseUpdate = z.infer<typeof HouseUpdate>;

//HouseFilters
export const HouseFilters = z.object({
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