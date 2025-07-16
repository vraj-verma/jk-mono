import { UsersService } from './users.service';
import { DatabaseConfigService } from '../db/db.config';
import { Users } from '../models/users.model';
import { CreateDTO } from './dto/insert.dto';
import { UpdateDTO } from './dto/update.dto';
import { PERMISSIONS } from '../enums/permission.enum';
import { ROLES } from '../enums/role.enum';

describe('UsersService', () => {
    let service: UsersService;
    let mockDb: Partial<DatabaseConfigService>;

    beforeEach(() => {
        mockDb = {
            query: jest.fn()
        };
        service = new UsersService(mockDb as DatabaseConfigService);
    });

    const fakeUser: Users = {
        account_id: 1,
        user_id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        permissions: [PERMISSIONS.CREATE, PERMISSIONS.READ],
        role: ROLES.ADMIN,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
    };

    describe('create', () => {
        it('should insert and return user', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([fakeUser]);

            const dto: CreateDTO = {
                account_id: 1,
                name: 'Test User',
                role: ROLES.ADMIN,
                permissions: [PERMISSIONS.CREATE, PERMISSIONS.READ],
                email: 'test@example.com',
                password: 'hashedpassword',
                status: 1,
                created_at: new Date(),
                updated_at: new Date()
            };

            const result = await service.create(dto);
            expect(result).toEqual(fakeUser);
            expect(mockDb.query).toHaveBeenCalled();
        });

        it('should throw DB error', async () => {
            (mockDb.query as jest.Mock).mockRejectedValue(new Error('Query failed'));

            await expect(service.create(fakeUser as unknown as CreateDTO)).rejects.toThrow('DB error..');
        });
    });

    describe('show', () => {
        it('should return user for valid query', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([fakeUser]);

            const result = await service.show({ key: 'user_id', value: 1 });
            expect(result).toEqual(fakeUser);
        });

        it('should return null if user not found', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([]);

            const result = await service.show({ key: 'user_id', value: 999 });
            expect(result).toBeNull();
        });
    });

    describe('index', () => {
        it('should return list of users', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([fakeUser]);

            const result = await service.index(1, { offset: 0, limit: 10 });
            expect(result).toEqual([fakeUser]);
        });
    });

    describe('update', () => {
        it('should update and return user', async () => {
            const updatedUser = { ...fakeUser, name: 'Updated Name' };
            (mockDb.query as jest.Mock).mockResolvedValue([updatedUser]);

            const dto: UpdateDTO = {
                account_id: 1,
                user_id: 1,
                name: 'Updated Name',
                status: 1,
                updated_at: new Date()
            };

            const result = await service.update(dto);
            expect(result).toEqual(updatedUser);
        });

        it('should return null if update fails', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([]);

            const dto: UpdateDTO = {
                account_id: 1,
                user_id: 1,
                name: 'Updated Name',
                status: 1,
                updated_at: new Date()
            };

            const result = await service.update(dto);
            expect(result).toBeNull();
        });
    });



    describe('delete', () => {
        it('should delete and return deleted user', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([fakeUser]);

            const result = await service.delete(1, 1);
            expect(result).toEqual(fakeUser);
        });

        it('should return null if user not found', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([]);

            const result = await service.delete(1, 999);
            expect(result).toBeNull();
        });
    });

    describe('count', () => {
        it('should return user count', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([{ count: 5 }]);

            const result = await service.count(1);
            expect(result).toBe(5);
        });

        it('should return 0 if no count found', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([]);

            const result = await service.count(1);
            expect(result).toBe(0);
        });
    });
});
