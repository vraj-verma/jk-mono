export interface InsertDTO {
    account_id: number;
    user_id: number;
    title: string;
    description: string;
    url: string;
    size: number;
    created_at: Date;
    updated_at: Date;
}