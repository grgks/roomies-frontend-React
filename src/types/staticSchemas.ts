import {z} from 'zod';

//City
export const City = z.object({
    id: z.number().int(),
    name: z.string(),
});
export type City = z.infer<typeof City>;

// CityInsert
export const CityInsert = z.object({
    name: z.string(),
});
export type CityInsert = z.infer<typeof CityInsert>;

// CityUpdate
export const CityUpdate = z.object({
    name: z.string(),
});
export type CityUpdate = z.infer<typeof CityUpdate>;


//Area
export const Area = z.object({
    id: z.number().int(),
    name: z.string(),
    cityId: z.number().int(),
    cityName: z.string(),
    postalCode: z.string().optional(),
});
export type Area = z.infer<typeof Area>;

// AreaInsert
export const AreaInsert = z.object({
    name: z.string(),
    cityId: z.number().int(),
    postalCode: z.string().optional(),
});
export type AreaInsert = z.infer<typeof AreaInsert>;

// AreaUpdate
export const AreaUpdate = z.object({
    name: z.string(),
    cityId: z.number().int(),
    postalCode: z.string().optional(),
});
export type AreaUpdate = z.infer<typeof AreaUpdate>;