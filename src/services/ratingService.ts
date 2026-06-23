import { getAverageScoreForRoommateId } from '@/api/ratingApi';
import type { Roommate } from '@/types';

// Fetches average scores for all roommates
export const fetchAverageScores = async (roommates: Roommate[]): Promise<Record<number, number>> => {
    const scores: Record<number, number> = {};
    await Promise.all(
        roommates.map(async r => {
            scores[r.id] = await getAverageScoreForRoommateId(r.id);
        })
    );
    return scores;
};