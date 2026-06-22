import { z } from 'zod';

export const PaginationParams = z.object({
    page: z.number().int().optional(),
    pageSize: z.number().int().optional(),
    sortDirection: z.enum(['ASC', 'DESC']).optional(),
    sortBy: z.string().optional(),
});
export type PaginationParams = z.infer<typeof PaginationParams>;

// zod schemas not support easy generics.Interface is natural choice for generic structures.  paginated data
export interface PagedResponse<T> {
    data: T[];
    currentPage: number;
    totalElements: number;
    totalPages: number;
    pageSize: number;
    numberOfElements: number;
}