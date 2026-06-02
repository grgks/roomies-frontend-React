import z from "zod";
import {InvitationStatus} from "@/types/enums.ts";

//Invitation
export const Invitation = z.object({
    id: z.number().int(),
    senderId: z.number().int(),
    senderFullName: z.string(),
    receiverId: z.number().int(),
    receiverFullName: z.string(),
    houseId: z.number().int(),
    houseAddress: z.string(),
    houseArea: z.string(),
    status:z.enum(Object.values(InvitationStatus) as [string, ...string[]]),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
export type Invitation = z.infer<typeof Invitation>;

//InvitationInsert
export const InvitationInsert = z.object({
    receiverId: z.number().int(),
    houseId: z.number().int(),
});
export type InvitationInsert = z.infer<typeof InvitationInsert>;

export const InvitationFilters = z.object({
    status: z.enum(Object.values(InvitationStatus) as [string, ...string[]]).optional(),
    fromRoommateId: z.number().int().optional(),
    toRoommateId: z.number().int().optional(),
});
export type InvitationFilters = z.infer<typeof InvitationFilters>;