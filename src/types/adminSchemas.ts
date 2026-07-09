import {Gender} from "@/types/enums.ts";
import {z} from "zod";

export const AdminRoommate = z.object({
    id: z.number().int(),
    keycloakId: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    gender: z.enum(Object.values(Gender) as [string, ...string[]]),
    email: z.email(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
export type AdminRoommate = z.infer<typeof AdminRoommate>;

export const RoommateAdminUpdateSchema = (t: (key: string) => string) => z.object({
    firstname: z.string().min(1, t("firstnameIsRequired")),
    lastname: z.string().min(1, t("lastnameIsRequired")),
    gender: z.enum(Object.values(Gender) as [string, ...string[]]),
});
export type RoommateAdminUpdate = z.infer<ReturnType<typeof RoommateAdminUpdateSchema>>;