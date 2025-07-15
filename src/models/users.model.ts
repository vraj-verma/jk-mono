import { PERMISSIONS, ROLES } from "../enums/all.enum";

export interface Users {
    user_id?: number;
    account_id: number;
    email: string;
    name: string;
    password: string;
    status: number;
    role: ROLES;
    permissions: PERMISSIONS[];
    created_at: Date;
    updated_at: Date;
}