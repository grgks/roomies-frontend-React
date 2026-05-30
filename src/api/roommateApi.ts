import type {Roommate, RoommateFilters, RoommateInsert, RoommateUpdate} from "@/types";
import axiosInstance from "@/services/axiosInstance.ts";

//POST /api/roommate/me - create roommate with current user once
export const createCurrentRoommate =
    async (data: RoommateInsert): Promise<Roommate> => {
    const res = await axiosInstance.post('/api/roommate/me', data);
    return res.data;
}

//GET /api/roommate/me - get current roommate(me)
// id not needed because backend get informations from keycloak token
export const getCurrentRoommate =
    async (): Promise<Roommate> => {
    const res = await axiosInstance.get('/api/roommate/me');
    return res.data;
}

//PUT /api/roommate/me - update roommate(me)
export const updateRoommateMe =
    async (data: RoommateUpdate): Promise<Roommate> => {
    const res = await axiosInstance.put('/api/roommate/me', data);
    return res.data;
}

//GET /api/roommate/search - search houses with filters
export const searchRoommates =
    async(filters: RoommateFilters): Promise<Roommate[]> => {
    const res = await axiosInstance.get('/api/roommate/search',
        {params: filters});
    return res.data;
}

//GET /api/roommate/active - Get active roommates in my house
export const getActiveRoommates = async(): Promise<Roommate[]> => {
    const res = await axiosInstance.get('/api/roommate/active');
    return res.data;
}

//DELETE /api/roommate/me - soft delete myself
export const softDeleteMyself = async(): Promise<void> => {
    await axiosInstance.delete('/api/roommate/me');
}