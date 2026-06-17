import axiosInstance from '@/services/axiosInstance';
import type {
    House, HouseFilters, HouseUpdate,
    Task, TaskFilters,
    Expense, ExpenseFilters,
    Rating, RatingFilters,
    Invitation, InvitationFilters,
    Message, MessageFilters,
    City, CityInsert, CityUpdate,
    Area, AreaInsert, AreaUpdate,
} from '@/types';

// House
// PUT /api/admin/houses/{id} - update house
export const adminUpdateHouse = async (id: number, data: HouseUpdate): Promise<House> => {
    const res = await axiosInstance.put(`/api/admin/houses/${id}`, data);
    return res.data;
};

// DELETE /api/admin/houses/{id} - delete house
export const adminDeleteHouse = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/houses/${id}`);
};

// PUT /api/admin/houses/{houseId}/owner/{newOwnerId} - change house owner
export const adminChangeHouseOwner = async (houseId: number, newOwnerId: number): Promise<House> => {
    const res = await axiosInstance.put(`/api/admin/houses/${houseId}/owner/${newOwnerId}`);
    return res.data;
};

// GET /api/admin/houses - get all houses
export const adminGetAllHouses = async (filters: HouseFilters): Promise<House[]> => {
    const res = await axiosInstance.get('/api/admin/houses', { params: filters });
    return res.data;
};

// GET /api/admin/houses/empty - find empty houses
export const adminFindEmptyHouses = async (): Promise<House[]> => {
    const res = await axiosInstance.get('/api/admin/houses/empty');
    return res.data;
};

// Task
// GET /api/admin/tasks - get all tasks
export const adminGetAllTasks = async (filters: TaskFilters): Promise<Task[]> => {
    const res = await axiosInstance.get('/api/admin/tasks', { params: filters });
    return res.data;
};

// DELETE /api/admin/tasks/{id} - delete task
export const adminDeleteTask = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/tasks/${id}`);
};

// Expense
// GET /api/admin/expenses - get all expenses
export const adminGetAllExpenses = async (filters: ExpenseFilters): Promise<Expense[]> => {
    const res = await axiosInstance.get('/api/admin/expenses', { params: filters });
    return res.data;
};

// DELETE /api/admin/expenses/{id} - delete expense
export const adminDeleteExpense = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/expenses/${id}`);
};

// Rating
// GET /api/admin/ratings - get all ratings
export const adminGetAllRatings = async (filters: RatingFilters): Promise<Rating[]> => {
    const res = await axiosInstance.get('/api/admin/ratings', { params: filters });
    return res.data;
};

// DELETE /api/admin/ratings/{id} - delete rating
export const adminDeleteRating = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/ratings/${id}`);
};

// Invitation
// GET /api/admin/invitations - get all invitations
export const adminGetAllInvitations = async (filters: InvitationFilters): Promise<Invitation[]> => {
    const res = await axiosInstance.get('/api/admin/invitations', { params: filters });
    return res.data;
};

// DELETE /api/admin/invitations/{id} - delete invitation
export const adminDeleteInvitation = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/invitations/${id}`);
};

// Message
// GET /api/admin/messages - get all messages
export const adminGetAllMessages = async (filters: MessageFilters): Promise<Message[]> => {
    const res = await axiosInstance.get('/api/admin/messages', { params: filters });
    return res.data;
};

// DELETE /api/admin/messages/{id} - delete message
export const adminDeleteMessage = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/messages/${id}`);
};

// City
// POST /api/admin/cities - add city
export const adminAddCity = async (data: CityInsert): Promise<City> => {
    const res = await axiosInstance.post('/api/admin/cities', data);
    return res.data;
};

// PUT /api/admin/cities/{id} - update city
export const adminUpdateCity = async (id: number, data: CityUpdate): Promise<City> => {
    const res = await axiosInstance.put(`/api/admin/cities/${id}`, data);
    return res.data;
};

// DELETE /api/admin/cities/{id} - delete city
export const adminDeleteCity = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/cities/${id}`);
};

// Area
// POST /api/admin/areas - add area
export const adminAddArea = async (data: AreaInsert): Promise<Area> => {
    const res = await axiosInstance.post('/api/admin/areas', data);
    return res.data;
};

// PUT /api/admin/areas/{id} - update area
export const adminUpdateArea = async (id: number, data: AreaUpdate): Promise<Area> => {
    const res = await axiosInstance.put(`/api/admin/areas/${id}`, data);
    return res.data;
};

// DELETE /api/admin/areas/{id} - delete area
export const adminDeleteArea = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/areas/${id}`);
};