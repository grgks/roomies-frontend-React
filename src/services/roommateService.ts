import { searchRoommates } from '@/api/roommateApi';
import { getAverageScoreForRoommateId } from '@/api/ratingApi';
import type { Roommate, RoommateFilters } from '@/types';
import {sendInvitation} from "@/api/invitationApi.ts";
import type {PagedResponse} from "@/types/commonSchemas.ts";

export interface RoommateSearchResult {
    roommates: Roommate[];
    scores: Record<number, number>;
}

export const searchRoommatesWithScores = async (
    filters: RoommateFilters
): Promise<RoommateSearchResult> => {
    const result = await searchRoommates(filters) as unknown as PagedResponse<Roommate>;
    const roommates: Roommate[] = result.data ?? [];

    const scoreEntries = await Promise.all(
        roommates.map(async (r) => {
            try {
                const avg = await getAverageScoreForRoommateId(r.id);
                return [r.id, avg] as [number, number];
            } catch {
                return [r.id, 0] as [number, number];
            }
        })
    );

    return {
        roommates,
        scores: Object.fromEntries(scoreEntries),
    };
};

export const inviteRoommate = async (
    roommateId: number,
    houseId: number
): Promise<void> => {
    await sendInvitation({ receiverId: roommateId, houseId });
};