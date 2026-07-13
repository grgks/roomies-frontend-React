import axiosInstance from '@/services/axiosInstance';

export const getHouseReport = async (houseId: number, language: string, forceRefresh = false): Promise<string> => {
    const res = await axiosInstance.get(`/api/ai/house-report/${houseId}`, {
        params: {
            language,
            forceRefresh
        },
        timeout: 60000,
    });
    return res.data;
};