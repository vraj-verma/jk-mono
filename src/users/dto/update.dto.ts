import { STATUS } from "../../enums/status.enum";

export interface UpdateDTO {
    account_id: number;
    user_id: number;
    name: string;
    status: STATUS;
    updated_at: Date;
}