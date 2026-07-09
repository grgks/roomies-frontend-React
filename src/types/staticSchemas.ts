import {z} from 'zod';

//City
export const City = z.object({
    id: z.number().int(),
    name: z.string(),
});
export type City = z.infer<typeof City>;

// CityInsert
export const CityInsertSchema = (t: (key: string) => string) => z.object({
    name: z.string().min(1, t('cityNameRequired')),
});
export type CityInsert = z.infer<ReturnType<typeof CityInsertSchema>>;

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
export const AreaInsertSchema = (t: (key: string) => string) => z.object({
    name: z.string().min(1, t('areaNameRequired')),
    cityId: z.coerce.number().int({ error: t('required') }),
    postalCode: z.string().optional(),
});
export type AreaInsert = z.infer<ReturnType<typeof AreaInsertSchema>>;

// AreaUpdate
export const AreaUpdate = z.object({
    name: z.string(),
    cityId: z.number().int(),
    postalCode: z.string().optional(),
});
export type AreaUpdate = z.infer<typeof AreaUpdate>;