import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accounts.service';
import { Utility } from '../helpers/utils';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { randomInt } from 'crypto';

// Mock randomInt for predictability
jest.mock('crypto', () => ({
    randomInt: jest.fn(),
}));

describe('AuthController', () => {
    let controller: AuthController;
    let usersService: Partial<UsersService>;
    let accountsService: Partial<AccountsService>;
    let utils: Partial<Utility>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(async () => {
        usersService = {
            show: jest.fn(),
            create: jest.fn(),
        };
        accountsService = {
            create: jest.fn(),
        };
        utils = {
            bcryptString: jest.fn(),
            decryptString: jest.fn(),
            signJWT: jest.fn(),
        };
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (randomInt as jest.Mock).mockReturnValue(1); // Mock randomInt to always return 1

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: UsersService, useValue: usersService },
                { provide: AccountsService, useValue: accountsService },
                { provide: Utility, useValue: utils },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    describe('register', () => {
        const payload = {
            email: 'test@example.com',
            password: 'plainpassword',
            name: 'Test User',
        };

        it('should throw conflict if user exists', async () => {
            (usersService.show as jest.Mock).mockResolvedValue({ email: payload.email });

            await expect(
                controller.register(req as Request, res as Response, payload as any),
            ).rejects.toThrow(HttpException);

            expect(usersService.show).toHaveBeenCalledWith({ key1: 'email', value1: payload.email });
        });

        it('should throw if account creation fails', async () => {
            (usersService.show as jest.Mock).mockResolvedValue(null);
            (utils.bcryptString as jest.Mock).mockResolvedValue('hashed');
            (accountsService.create as jest.Mock).mockResolvedValue(null);

            await expect(
                controller.register(req as Request, res as Response, payload as any),
            ).rejects.toThrow(HttpException);

            expect(accountsService.create).toHaveBeenCalled();
        });

        it('should throw if user creation fails', async () => {
            (usersService.show as jest.Mock).mockResolvedValue(null);
            (utils.bcryptString as jest.Mock).mockResolvedValue('hashed');
            (accountsService.create as jest.Mock).mockResolvedValue({ account_status: 1, users_limit: 5, users_used: 1, created_at: new Date(), updated_at: new Date() });
            (usersService.create as jest.Mock).mockResolvedValue(null);

            await expect(
                controller.register(req as Request, res as Response, payload as any),
            ).rejects.toThrow(HttpException);

            expect(usersService.create).toHaveBeenCalled();
        });

        it('should create account and user and send response', async () => {
            (usersService.show as jest.Mock).mockResolvedValue(null);
            (utils.bcryptString as jest.Mock).mockResolvedValue('hashedpassword');

            const accountMock = { account_status: 1, users_limit: 5, users_used: 1, created_at: new Date(), updated_at: new Date() };
            (accountsService.create as jest.Mock).mockResolvedValue(accountMock);

            const userMock = {
                name: payload.name,
                email: payload.email,
                password: 'hashedpassword',
                status: 1,
                role: 'admin',
                permissions: expect.any(Array),
                user_id: expect.any(Number),
                account_id: 1,
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
            };
            (usersService.create as jest.Mock).mockResolvedValue({ ...userMock });

            await controller.register(req as Request, res as Response, payload as any);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                response: expect.objectContaining({
                    email: payload.email,
                    password: '',
                }),
            });
        });
    });

    describe('signin', () => {
        const payload = {
            email: 'test@example.com',
            password: 'somepassword',
        };

        it('should throw if user not found', async () => {
            (usersService.show as jest.Mock).mockResolvedValue(null);

            await expect(
                controller.signin(req as Request, res as Response, payload as any),
            ).rejects.toThrow(HttpException);

            expect(usersService.show).toHaveBeenCalledWith({ key: 'email', value: payload.email });
        });

        it('should throw if password incorrect', async () => {
            (usersService.show as jest.Mock).mockResolvedValue({ password: 'hashed' });
            (utils.decryptString as jest.Mock).mockResolvedValue(false);

            await expect(
                controller.signin(req as Request, res as Response, payload as any),
            ).rejects.toThrow(HttpException);
        });

        it('should respond with token and user data on success', async () => {
            const userMock = {
                user_id: 1,
                account_id: 10,
                email: payload.email,
                password: 'hashedpassword',
            };

            (usersService.show as jest.Mock).mockResolvedValue({ ...userMock });
            (utils.decryptString as jest.Mock).mockResolvedValue(true);
            (utils.signJWT as jest.Mock).mockResolvedValue('token123');

            await controller.signin(req as Request, res as Response, payload as any);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: true,
                response: expect.objectContaining({ email: payload.email, password: '' }),
                token: 'token123',
            });
        });
    });
});
