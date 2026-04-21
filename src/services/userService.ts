import { syncUser, getMe } from '../api/userApi';
import type { User } from '../types';

// Sync user after first login — calls POST then GET to return full user
export const initializeUser = async (): Promise<User> => {
    await syncUser();
    return getMe();
};