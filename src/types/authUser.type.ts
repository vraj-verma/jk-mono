import { ROLES } from "src/enums/role.enum";
import { STATUS } from "src/enums/status.enum";

export class AuthUser {
    account_id: number;
    user_id: number;
    name: string;
    email: string;
    role: ROLES;
    status: STATUS;
}

export class Pagination {

    offset: number;
    limit: number;

    constructor(offset: number = 1, limit: number = 10) {
        this.offset = offset;
        this.limit = limit
    }

}