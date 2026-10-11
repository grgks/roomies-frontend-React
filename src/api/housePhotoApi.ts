import type { HousePhoto } from '@/types';
import axiosInstance from '@/services/axiosInstance.ts';

// GET /api/houses/{houseId}/photos - get all photos for a house
export const getHousePhotos = async (houseId: number): Promise<HousePhoto[]> => {
    const res = await axiosInstance.get(`/api/houses/${houseId}/photos`);
    return res.data;
};

// POST /api/houses/{houseId}/photos - upload photo (owner only)
export const uploadHousePhoto = async (houseId: number, file: File): Promise<HousePhoto> => {
    const formData = new FormData();
    formData.append('file', file);

    const photosBefore = await getHousePhotos(houseId);
    const countBefore = photosBefore.length;

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const res = await axiosInstance.post(`/api/houses/${houseId}/photos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        } catch (error) {
            // Check if upload actually succeeded despite network error
            const photosNow = await getHousePhotos(houseId);
            if (photosNow.length > countBefore) {
                return photosNow[photosNow.length - 1];
            }
            if (attempt === maxRetries) throw error;
            await new Promise(r => setTimeout(r, attempt * 1000));
        }
    }
    throw new Error('Upload failed after retries');
};

// DELETE /api/houses/{houseId}/photos/{photoId} - delete photo (owner only)
export const deleteHousePhoto = async (houseId: number, photoId: number): Promise<void> => {
    await axiosInstance.delete(`/api/houses/${houseId}/photos/${photoId}`);
};