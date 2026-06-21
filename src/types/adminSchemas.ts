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