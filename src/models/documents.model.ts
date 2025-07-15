export interface Documents {
    accountId: number;
    userId: number;
    fileURL: string;
    title: string;
    desc: string;
    status: 'uploaded' | 'failed'
    created_at: Date;
    updated_at: Date;

}