import { createHouse, getMyHouse } from '@/api/houseApi';
import { getAllCities, getAllAreas } from '@/api/staticApi';
import type { City, Area, House, HouseInsert } from '@/types';
import { leaveHouse } from '@/api/houseApi';

export interface HousePageData {
    cities: City[];
    areas: Area[];
}

// Fetches cities and areas for CreateHousePage form
export const fetchHouseFormData = async (): Promise<HousePageData> => {
    const [cities, areas] = await Promise.all([
        getAllCities(),
        getAllAreas(),
    ]);
    return { cities, areas };
};

// Creates a house
export const submitCreateHouse = async (data: HouseInsert): Promise<House> => {
    return createHouse(data);
};

// Gets current user's house
export const fetchMyHouse = async (): Promise<House> => {
    return getMyHouse();
};

// Leaves current house and clears houseId from context
export const handleLeaveHouse = async (houseId: number): Promise<void> => {
    await leaveHouse(houseId);
};

// Filters areas by city
export const filterAreasByCity = (areas: Area[], cityId: number): Area[] => {
    return areas.filter(a => a.cityId === cityId);
};