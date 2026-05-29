import type {House, HouseFilters, HouseInsert, HouseUpdate} from '@/types';
import axiosInstance from "@/services/axiosInstance.ts";

//POST /api/house - create house
export const createHouse = async(data:HouseInsert): Promise<House> => {
    const res = await axiosInstance.post('/api/house', data);
    return res.data;
}

//GET /api/house/{id} - get house by id
export const getHouse = async (id: number): Promise<House> => {
    const res = await axiosInstance.get(`/api/house/${id}`);
    return res.data;
}

//GET /api/house/my - get my house
export const getMyHouse = async(): Promise<House> =>{
    const res = await axiosInstance.get('/api/house/my');
    return res.data;
}

//PUT /api/house/{id} - update house
export const updateHouse = async(id: number, data: HouseUpdate):
    Promise<House> => {
    const res = await axiosInstance.put(`/api/house/${id}`, data)
    return res.data;
}

//GET /api/house/search -> search houses by filters
export const searchHouses = async(filters: HouseFilters): Promise<House[]> => {
    const res = await axiosInstance.get('/api/house/search', {params: filters});
    return res.data;
}

//DELETE /api/house/{houseId}/leave - roommate leave from house
export const leaveHouse = async ( houseId: number): Promise<void> => {
   await axiosInstance.delete(`/api/house/${houseId}/leave`);
}