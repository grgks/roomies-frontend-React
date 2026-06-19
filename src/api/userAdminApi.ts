import axiosInstance from '@/services/axiosInstance';
import type { User, UserAdminUpdate, UserFilters, PagedResponse } from '@/types';

// GET /api/admin/users - get all users with filters
export const getAllUsers = async (filters: UserFilters): Promise<PagedResponse<User>> => {
    const response = await axiosInstance.get('/api/admin/users', { params: filters });
    return response.data;
};

// GET /api/admin/users/{id} - get user by id
export const getUserById = async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/api/admin/users/${id}`);
    return response.data;
};

// GET /api/admin/users/keycloak/{keycloakId} - get user by keycloakId
export const getUserByKeycloakId = async (keycloakId: string): Promise<User> => {
    const response = await axiosInstance.get(`/api/admin/users/keycloak/${keycloakId}`);
    return response.data;
};

// PUT /api/admin/users/{id} - update user
export const updateUser = async (id: number, data: UserAdminUpdate): Promise<User> => {
    const response = await axiosInstance.put(`/api/admin/users/${id}`, data);
    return response.data;
};

// DELETE /api/admin/users/{id} - soft delete user
export const softDeleteUser = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/users/${id}`);
};

// DELETE /api/admin/users/{id}/hard - hard delete user
export const hardDeleteUser = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/users/${id}/hard`);
};

// PUT /api/admin/users/{id}/activate - activate user
export const activateUser = async (id: number): Promise<void> => {
    await axiosInstance.put(`/api/admin/users/${id}/activate`);
};

// PUT /api/admin/users/{id}/password - reset user password
export const resetUserPassword = async (id: number, newPassword: string): Promise<void> => {
    await axiosInstance.put(`/api/admin/users/${id}/password`, { newPassword });
};