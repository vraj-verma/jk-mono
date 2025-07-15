import { Injectable } from '@nestjs/common';
import { DatabaseConfigService } from '../db/db.config';
import { Documents } from '../models/documents.model';
import { Pagination } from '../types/authUser.type';
import { InsertDTO } from './dto/Insert.dto';

@Injectable()
export class DocsService {

    constructor(
        private readonly db: DatabaseConfigService
    ) { }

    async create(payload: InsertDTO): Promise<Documents | null> {
        try {

            const sql = `INSERT INTO Documents (account_id, user_id, url, size, title, description, created_at, updated_at)
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                        RETURNING *`;

            const [response] = await this.db.query(sql, [
                payload.account_id,
                payload.user_id,
                payload.url,
                payload.size,
                payload.title,
                payload.description,
                payload.created_at,
                payload.updated_at
            ]);

            return response ? response as Documents : null;

        } catch (error) {
            console.error(`Something went wrong at db end`, error.message);
            throw new Error(`DB create failed: ${error.message}`);
        }
    }

    async list(accountId: number, paged: Pagination) {
        try {
            const sql = `SELECT account_id, user_id, url, size, title, description, created_at, updated_at FROM Documents WHERE account_id = $1 OFFSET $2 LIMIT $3`;

            const response = await this.db.query(sql, [
                accountId,
                paged.offset,
                paged.limit
            ])

            return response ? response : [];
        } catch (error) {
            console.error(`Something went wrong at db end`, error.message);
            throw new Error(`DB FindList failed: ${error.message}`);
        }
    }

    async delete(account_id: number, doc_id: number): Promise<Documents | null> {
        try {

            const sql = `DELETE FROM Documents WHERE account_id = $1 AND doc_id = $2
                        RETURNING *`;

            const [response] = await this.db.query(sql, [
                account_id,
                doc_id,

            ]);

            return response ? response as Documents : null;

        } catch (error) {
            console.error(`Something went wrong at db end`, error.message);
            throw new Error(`DB delete failed: ${error.message}`);
        }
    }

    async count(accountId: number): Promise<number | null> {
        try {
            const sql = `SELECT COUNT(account_id) from Documents WHERE account_id = $1`;

            const [response] = await this.db.query(sql, [accountId]);

            return response ? response.count : 0;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error(`DB FindList failed: ${error.message}`);
        }
    }

}
