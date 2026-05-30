import type {Area, City} from "@/types";
import axiosInstance from "@/services/axiosInstance.ts";

//City

//GET /api/static/cities - get all cities
export const getAllCities = async(): Promise<City[]> => {
      const res = await axiosInstance.get("api/static/cities");
      return res.data;
};

//GET /api/static/cities/{id} - get city by id
export const getCityById =  async (id: number): Promise<City> => {
    const res = await axiosInstance.get(`/api/static/cities/${id}`);
    return res.data;
}

//Area

//GET /api/static/areas - get all areas
export const getAllAreas = async (): Promise<Area[]> => {
    const res = await axiosInstance.get('/api/static/areas');
    return res.data;
}

//GET /api/static/areas/{id} - get area by id
export const getAreaById = async (id: number): Promise<Area> => {
    const res = await axiosInstance.get(`/api/static/areas/${id}`);
    return res.data;
}