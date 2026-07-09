import z from "zod";
import {PaginationParams} from "@/types/commonSchemas.ts";

//Message
export const Message = z.object({
    id: z.number().int(),
    senderId: z.number().int(),
    senderFullName: z.string(),
    receiverId: z.number().int().optional(),
    receiverFullName: z.string().optional().nullable(),
    houseId: z.number().int(),
    content: z.string(),
    isRead: z.boolean(),
    createdAt: z.iso.datetime(),
});
export type Message = z.infer<typeof Message>;

//MessageInsert
export const MessageInsertSchema = (t: (key: string) => string) => z.object({
    receiverId: z.number().int().optional(),
    houseId: z.number().int(),
    content: z.string().min(1, t('messageIsRequired')).max(3000, t('messageMaxChars3000')),
});
export type MessageInsert = z.infer<ReturnType<typeof MessageInsertSchema>>;

//MessageFilters
export const MessageFilters = PaginationParams.extend({
    fromRoommateId: z.number().int().optional(),
    toRoommateId: z.number().int().optional(),
    houseId: z.number().int().optional(),
    isRead: z.boolean().optional(),
});
export type MessageFilters = z.infer<typeof MessageFilters>;