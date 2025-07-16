export interface Documents {
    account_id: number;
    user_id: number;
    fileURL: string;
    size: number;
    title: string;
    desc: string;
    status: 'uploaded' | 'failed'
    created_at: Date;
    updated_at: Date;

}