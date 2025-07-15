import { Injectable } from '@nestjs/common';
import { DatabaseConfigService } from '../db/db.config';
import { Accounts } from '../models/accounts.model';

@Injectable()
export class AccountsService {

    constructor(
        private readonly db: DatabaseConfigService,
    ) { }


    async create(payload: Accounts): Promise<Accounts | null> {
        try {

            const sql = `
            INSERT INTO Accounts (account_status, users_limit, users_used, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;

            const response = await this.db.query(sql, [
                payload.account_status,
                payload.users_limit,
                payload.users_used,
                payload.created_at,
                payload.updated_at
            ]);

            return response ? response as unknown as Accounts : null;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            return null;
        }
    }

    async show(id: number): Promise<Accounts | null> {
        try {
            const sql = `SELECT email, name, password, userId, status, createdAt, updatedAt FROM Users WHERE email = ?`;

            const response = await this.db.query(sql, [id]);

            return response ? response as unknown as Accounts : null;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            return null;
        }
    }

    async index() { }

    async update() { }

    async delete() { }


}
