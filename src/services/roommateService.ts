import { searchRoommatesForInvite } from '@/api/roommateApi';
import type { RoommateSearch, RoommateFilters } from '@/types';
import { sendInvitation } from "@/api/invitationApi.ts";

export interface RoommateSearchResult {
    roommates: RoommateSearch[];
    scores: Record<number, number>;
    totalPages: number;
    currentPage: number;
}

export const searchRoommatesWithScores = async (
    filters: RoommateFilters,
    page = 0
): Promise<RoommateSearchResult> => {
    const result = await searchRoommatesForInvite(filters, page);
    const roommates = result.data ?? [];

    // rating comes batch-computed inside each DTO now. no N+1
    const scores: Record<number, number> = {};
    for (const r of roommates) {
        scores[r.id] = r.rating ?? 0;
    }

    return {
        roommates,
        scores,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
    };
};

export const inviteRoommate = async (
    roommateId: number,
    houseId: number
): Promise<void> => {
    await sendInvitation({ receiverId: roommateId, houseId });
};