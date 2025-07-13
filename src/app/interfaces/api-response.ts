export interface ApiResponse<T = any> {
    state: string;
    message?: string;
    data?: T;
}