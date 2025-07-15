import * as joi from "joi";
import { ROLES } from "../enums/role.enum";
import { STATUS, PERMISSIONS } from "../enums/all.enum";

export class JoiValidation {

    static SignupSchema = joi.object({
        name: joi.string().min(2).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).max(100).required(),
    });

    static SigninSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).max(100).required(),
    });

    static createUserSchema = joi.object({
        name: joi.string().min(2).max(15).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).max(100).required(),
        role: joi.string().valid(...Object.values(ROLES)).default(ROLES.VIEWER),
        status: joi.string().valid(...Object.values(STATUS)).default(STATUS.ACTIVE).optional(),
        permissions: joi.array().items(joi.string().valid(...Object.values(PERMISSIONS)).required()).required(),
    });

    static updateUserSchema = joi.object({
        account_id: joi.number().integer().optional(),
        user_id: joi.number().integer().optional(),
        name: joi.string().min(2).max(15).required(),
        status: joi.string().valid(...Object.values(STATUS)).default(STATUS.ACTIVE).optional(),
        updated_at: joi.date().optional(),
    });

    static PaginationSchema = joi.object({
        offset: joi.number().integer().default(1).optional(),
        limit: joi.number().integer().default(10).optional(),
    });

}