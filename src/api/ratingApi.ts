import type { Rating, RatingInsert} from "@/types";
import axiosInstance from "@/services/axiosInstance.ts";


//POST /api/rating - create rating
export const createRating =
    async(data: RatingInsert): Promise<Rating> => {
        const res = await axiosInstance.post('/api/rating', data);
        return res.data;
    }

//GET /api/rating/roommate/{roommateId} - get ratings by Roommate
export const getRatingsByRoommateId =
    async(roommateId: number): Promise<Rating[]> => {
        const res = await axiosInstance.get(`/api/rating/roommate/${roommateId}`);
        return res.data;
    }

//GET /api/rating/me - get my ratings
export const getMyRatings =
    async(): Promise<Rating[]> => {
        const res = await axiosInstance.get(`/api/rating/me`);
        return res.data;
    }

//GET /api/rating/roommate/{roommateId}/average - get average score rating for RoommateId
export const getAverageScoreForRoommateId =
    async(roommateId: number): Promise<number> => {
        const res = await axiosInstance.get(`/api/rating/roommate/${roommateId}/average`);
        return res.data;
    }

//GET /api/rating/roommate/{roommateId}/average/category -
// get average score rating for RoommateId by category
export const getAverageScoreForRoommateIdByCategory =
    async(roommateId: number): Promise<Record<string, number>> => {
        const res = await axiosInstance.get(`/api/rating/roommate/${roommateId}/average/category`);
        return res.data;
    }























