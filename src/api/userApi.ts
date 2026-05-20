import axiosInstance from '../services/axiosInstance';
import type { ChangePassword,  User,  UserUpdate} from '@/types';

// POST /api/users/me - sync user with backend after first login
export const syncCreateUser = async (): Promise<User> => {
    const response = await axiosInstance.post('/api/users/me');
    return response.data;
};

// GET /api/users/me - get current user
export const getMe = async (): Promise<User> => {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
};

// DELETE /api/users/me — soft delete current user
export const deleteMe = async (): Promise<void> => {
    await axiosInstance.delete('/api/users/me');
};

//UPDATE /api/users/me - update current user
export const updateMe = async (data: UserUpdate): Promise<User> => {
    const response = await axiosInstance.put('/api/users/me', data);
    return response.data;
}

//PUT /api/users/me/reactivate - User reactivated themselves
export const reactivateMe = async (): Promise<User> => {
    const response =  await axiosInstance.put('/api/users/me/reactivate');
    return response.data;
}

//PUT /api/users/me/password - change password current user
export const changePassword = async (data: ChangePassword): Promise<string> =>{
    const response = await axiosInstance.put('/api/users/me/password', data);
    return response.data.message;
}