import axiosInstance from "@/services/axiosInstance.ts";
import type {RoommateProfile, RoommateProfileUpsert, HouseProfile, HouseProfileUpsert, RoommatePreferences, RoommatePreferencesUpsert, HousePreferences, HousePreferencesUpsert} from "@/types/searchSchemas.ts";

//RoommateProfile

// GET /api/roommate/profile/me
export const getMyRoommateProfile = async (): Promise<RoommateProfile | null> => {
    const res = await axiosInstance.get('/api/roommate/profile/me');
    if (res.status === 204) return null; // Profile not filled yet
    return res.data;
};

// GET /api/roommate/profile/{roommateId}
export const getRoommateProfile = async (roommateId: number): Promise<RoommateProfile | null> => {
    const res = await axiosInstance.get(`/api/roommate/profile/${roommateId}`);
    if (res.status === 204) return null; // Profile not filled yet
    return res.data;
};

// PUT /api/roommate/profile/me
export const upsertMyRoommateProfile = async (data: RoommateProfileUpsert): Promise<RoommateProfile> => {
    const res = await axiosInstance.put('/api/roommate/profile/me', data);
    return res.data;
};


//HouseProfile

// GET /api/house/profile/me
export const getMyHouseProfile = async (): Promise<HouseProfile | null> => {
    const res = await axiosInstance.get('/api/house/profile/me');
    if (res.status === 204) return null; // Profile not filled yet
    return res.data;
};

// GET /api/house/profile/{houseId}
export const getHouseProfile = async (houseId: number): Promise<HouseProfile | null> => {
    const res = await axiosInstance.get(`/api/house/profile/${houseId}`);
    if (res.status === 204) return null; // Profile not filled yet
    return res.data;
};

// PUT /api/house/profile/{houseId}
export const upsertHouseProfile = async (houseId: number, data: HouseProfileUpsert): Promise<HouseProfile> => {
    const res = await axiosInstance.put(`/api/house/profile/${houseId}`, data);
    return res.data;
};


//RoommatePreferences

// GET /api/roommate/preferences/me
export const getMyRoommatePreferences = async (): Promise<RoommatePreferences | null> => {
    const res = await axiosInstance.get('/api/roommate/preferences/me');
    if (res.status === 204) return null; // No preferences yet
    return res.data;
};

// GET /api/roommate/preferences/{roommateId}
export const getRoommatePreferences = async (roommateId: number): Promise<RoommatePreferences | null> => {
    const res = await axiosInstance.get(`/api/roommate/preferences/${roommateId}`);
    if (res.status === 204) return null; // No preferences yet
    return res.data;
};

// PUT /api/roommate/preferences/me
export const upsertMyRoommatePreferences = async (data: RoommatePreferencesUpsert): Promise<RoommatePreferences> => {
    const res = await axiosInstance.put('/api/roommate/preferences/me', data);
    return res.data;
};


//HousePreferences

// GET /api/roommate/house-preferences/me
export const getMyHousePreferences = async (): Promise<HousePreferences | null> => {
    const res = await axiosInstance.get('/api/roommate/house-preferences/me');
    if (res.status === 204) return null; // No preferences yet
    return res.data;
};

// GET /api/roommate/house-preferences/{roommateId}
export const getHousePreferences = async (roommateId: number): Promise<HousePreferences | null> => {
    const res = await axiosInstance.get(`/api/roommate/house-preferences/${roommateId}`);
    if (res.status === 204) return null; // No preferences yet
    return res.data;
};

// PUT /api/roommate/house-preferences/me
export const upsertMyHousePreferences = async (data: HousePreferencesUpsert): Promise<HousePreferences> => {
    const res = await axiosInstance.put('/api/roommate/house-preferences/me', data);
    return res.data;
};