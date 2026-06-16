import {changePassword, getMe, updateAvatar} from '../api/userApi';
import type {ChangePassword, User} from '@/types/';

// Try to get user - if 404, user doesn't exist yet (will be created in CompleteProfilePage)
export const initializeUser = async (): Promise<User | null> => {
    try {
        return await getMe();
    } catch {
        return null;  // user not in DB yet
    }};


// change password
export const changeUserPassword = async (data: ChangePassword): Promise<void> => {
    await changePassword(data);
};


export const updateUserAvatar = async (avatarId: string): Promise<User> => {
    return await updateAvatar(avatarId);
};