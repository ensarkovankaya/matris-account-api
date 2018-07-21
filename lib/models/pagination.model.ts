export interface IPaginationOptions {
    page?: number;
    offset?: number;
    limit?: 10 | 25 | 50 | 100 | 150;
}

export interface IPaginateResult<T> {
    docs: T[];
    total: number;
    limit: number;
    page?: number;
    pages?: number;
    offset?: number;
}
