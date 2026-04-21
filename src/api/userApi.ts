import axiosInstance from '../services/axiosInstance';
import type { User } from '../types';

// POST /api/users/me — sync user with backend after first login
export const syncUser = async (): Promise<User> => {
    const response = await axiosInstance.post('/api/users/me');
    return response.data;
};

// GET /api/users/me — get current user
export const getMe = async (): Promise<User> => {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
};

// DELETE /api/users/me — soft delete current user
export const deleteMe = async (): Promise<void> => {
    await axiosInstance.delete('/api/users/me');
};