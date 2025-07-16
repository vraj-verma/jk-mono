import { AccountsService } from './accounts.service';
import { DatabaseConfigService } from '../db/db.config';
import { Accounts } from '../models/accounts.model';

describe('AccountsService', () => {
    let service: AccountsService;
    let mockDb: Partial<DatabaseConfigService>;

    beforeEach(() => {
        mockDb = {
            query: jest.fn(),
        };
        service = new AccountsService(mockDb as DatabaseConfigService);
    });

    const fakeAccount: Accounts = {
        account_status: 1,
        users_limit: 10,
        users_used: 3,
        created_at: new Date(),
        updated_at: new Date(),
    };

    describe('create', () => {
        it('should insert and return account on success', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([fakeAccount]);

            const result = await service.create(fakeAccount);
            expect(result).toEqual(fakeAccount);
            expect(mockDb.query).toHaveBeenCalledWith(
                expect.any(String),
                [
                    fakeAccount.account_status,
                    fakeAccount.users_limit,
                    fakeAccount.users_used,
                    fakeAccount.created_at,
                    fakeAccount.updated_at,
                ]
            );
        });

        it('should return null on DB error', async () => {
            (mockDb.query as jest.Mock).mockRejectedValue(new Error('DB failure'));

            const result = await service.create(fakeAccount);
            expect(result).toBeNull();
        });
    });

    describe('show', () => {
        it('should return account when found', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([fakeAccount]);

            const result = await service.show(1);
            expect(result).toEqual(fakeAccount);
            expect(mockDb.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [1]
            );
        });

        it('should return null when account not found', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue(null);

            const result = await service.show(999);
            expect(result).toBeNull();
        });

        it('should return null on DB error', async () => {
            (mockDb.query as jest.Mock).mockRejectedValue(new Error('DB failure'));

            const result = await service.show(1);
            expect(result).toBeNull();
        });
    });


    describe('delete', () => {
        it('should return affected row count on success', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([{ count: 1 }]);

            const result = await service.delete(1);
            expect(result).toBe(1);
            expect(mockDb.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE'),
                [1]
            );
        });

        it('should return 0 if no rows affected', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([{ count: 0 }]);

            const result = await service.delete(1);
            expect(result).toBe(0);
        });

        it('should return null on DB error', async () => {
            (mockDb.query as jest.Mock).mockRejectedValue(new Error('DB failure'));

            const result = await service.delete(1);
            expect(result).toBeNull();
        });
    });



});
