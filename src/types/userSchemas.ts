import {z} from "zod";



//User
export const User = z.object({
    id: z.number().int(),
    keycloakId: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    isActive: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});

export type User = z.infer<typeof User>;

//UserUpdate
export const UserUpdate = User.omit({ id: true,
    keycloakId: true, createdAt: true, updatedAt: true })
    .extend({
        email: z.email(),
        phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    });
export type UserUpdate = z.infer<typeof UserUpdate>;


//ChangePassword
export const ChangePassword = z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
});
export type ChangePassword = z.infer<typeof ChangePassword>;