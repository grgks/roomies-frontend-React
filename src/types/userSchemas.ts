import {z} from "zod";
import { PaginationParams } from './commonSchemas';



//User
export const User = z.object({
    id: z.number().int(),
    keycloakId: z.string(),
    email: z.email(),
    avatarId: z.string(),
    phoneNumber: z.string(),
    isActive: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});

export type User = z.infer<typeof User>;

//UserUpdate
export const UserUpdateSchema = (t: (key: string) => string) => User.omit({ id: true,
    keycloakId: true, createdAt: true, updatedAt: true })
    .extend({
        email: z.email(),
        phoneNumber: z.string().regex(/^[0-9]{10}$/, t("phoneNumberMustBe10Digits")),
    });
export type UserUpdate = z.infer<ReturnType<typeof UserUpdateSchema>>;

// UserInsert
export const UserInsertSchema = (t: (key: string) => string) => z.object({
    phoneNumber: z.string().regex(/^[0-9]{10}$/, t("phoneNumberMustBe10Digits")),
});
export type UserInsert = z.infer<ReturnType<typeof UserInsertSchema>>;

// UserAdminUpdate
export const UserAdminUpdateSchema = (t: (key: string) => string) => z.object({
    id: z.number().int().optional(),
    keycloakId: z.string().optional(),
    email: z.email(),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, t("phoneNumberMustBe10Digits")),
    isActive: z.boolean().optional(),
});
export type UserAdminUpdate = z.infer<ReturnType<typeof UserAdminUpdateSchema>>;

// UserFilters
export const UserFilters = PaginationParams.extend({
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    isActive: z.boolean().optional(),
});
export type UserFilters = z.infer<typeof UserFilters>;

//ChangePassword
export const ChangePassword = z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
});
export type ChangePassword = z.infer<typeof ChangePassword>;

//AdminPasswordReset
export const AdminPasswordResetSchema = (t: (key: string) => string) => z.object({
    newPassword: z.string().min(8, t("passwordMinChars8")),
});
export type AdminPasswordReset = z.infer<ReturnType<typeof AdminPasswordResetSchema>>;