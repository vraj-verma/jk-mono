import { PERMISSIONS } from "src/enums/permission.enum";
import { ROLES } from "../../enums/role.enum";
import { STATUS } from "../../enums/status.enum";

export interface CreateDTO {
    account_id: number;
    user_id?: number;
    name: string;
    email: string;
    password: string;
    role: ROLES,
    permissions: PERMISSIONS[];
    status: STATUS;
    created_at: Date;
    updated_at: Date;
}