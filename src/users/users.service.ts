import { Injectable } from '@nestjs/common';
import { DatabaseConfigService } from '../db/db.config';
import { Users } from '../models/users.model';
import { CreateDTO } from './dto/insert.dto';
import { UpdateDTO } from './dto/update.dto';

@Injectable()
export class UsersService {

    constructor(
        private readonly db: DatabaseConfigService,
    ) { }


    async create(payload: CreateDTO): Promise<Users | null> {
        try {

            const sql = `INSERT INTO Users (account_id, name, role, permissions, email, password, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`;

            const response = await this.db.query(sql, [
                payload.account_id,
                payload.name,
                payload.role,
                payload.permissions,
                payload.email,
                payload.password,
                payload.status,
                payload.created_at,
                payload.updated_at,
            ]);

            return response ? response as unknown as Users : null;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error("DB error..")
        }
    }

    async show(query: Record<string, any>): Promise<Users | null> {
        try {

            const sql = `SELECT account_id, email, name, password, permissions, user_id, status, created_at, updated_at FROM Users WHERE ${query.key} = $1`;

            const [response] = await this.db.query(sql, [query.value]);

            return response ? response as unknown as Users : null;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error("DB error..")
        }
    }

    async index(accountId: number, paged: { offset: number, limit: number }): Promise<Users[] | null> {
        try {
            const sql = `SELECT email, name, user_id, status, role, created_at, updated_at FROM Users WHERE account_id = $1 OFFSET $2 LIMIT $3`;

            const response = await this.db.query(sql, [accountId, paged.offset, paged.limit]);

            return response ? response as unknown as Users[] : [];
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error("DB error..")
        }
    }

    async update(payload: UpdateDTO): Promise<Users | null> {
        try {

            const sql = `UPDATE Users SET name = $1, status = $2, updated_at = $3
                        WHERE account_id = $4 AND user_id = $5
                        RETURNING *`;

            const [response] = await this.db.query(sql, [
                payload.name,
                payload.status,
                payload.updated_at,
                payload.account_id,
                payload.user_id
            ]);

            return response ? response as unknown as Users : null;

        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error("DB error..")
        }
    }

    async delete(accountId: number, userId: number): Promise<Users | null> {
        try {
            const sql = `DELETE FROM Users WHERE account_id = $1 AND user_id = $2 RETURNING *`;

            const [response] = await this.db.query(sql, [accountId, userId]);

            return response ? (response as unknown as Users) : null;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error("DB error..")
        }
    }

    async count(accountId: number): Promise<number | null> {
        try {
            const sql = `SELECT COUNT(account_id) from Users WHERE account_id = $1`;

            const [response] = await this.db.query(sql, [accountId]);

            return response ? response.count : 0;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error("DB error..")
        }
    }


}
