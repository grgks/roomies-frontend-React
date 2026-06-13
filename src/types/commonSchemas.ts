


// zod schemas not support easy generics.Interface is natural choice for generic structures.  paginated data
export interface PagedResponse<T> {
    data: T[];
    currentPage: number;
    totalElements: number;
    totalPages: number;
    pageSize: number;
    numberOfElements: number;
}