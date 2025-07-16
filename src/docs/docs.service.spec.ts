import { DocsService } from './docs.service';
import { DatabaseConfigService } from '../db/db.config';
import { Documents } from '../models/documents.model';

describe('DocsService', () => {
    let service: DocsService;
    let mockDb: Partial<DatabaseConfigService>;

    beforeEach(() => {
        mockDb = {
            query: jest.fn(),
        };
        service = new DocsService(mockDb as DatabaseConfigService);
    });

    const fakeDocument: Documents = {
        account_id: 1,
        user_id: 1,
        fileURL: 'http://example.com/doc.pdf',
        size: 12345,
        status: 'uploaded',
        title: 'Test Document',
        desc: 'Test description',
        created_at: new Date(),
        updated_at: new Date(),
    };

    describe('create', () => {
        it('should insert and return document', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([[fakeDocument]]);

            const payload = {
                account_id: 1,
                user_id: 1,
                url: 'http://fake-website.com/doc.pdf',
                size: 12345,
                title: 'Fake Document',
                description: 'Test description...',
                created_at: new Date(),
                updated_at: new Date(),
            };

            const result = await service.create(payload);
            expect(result).toEqual(fakeDocument);
            expect(mockDb.query).toHaveBeenCalledWith(
                expect.any(String),
                [
                    payload.account_id,
                    payload.user_id,
                    payload.url,
                    payload.size,
                    payload.title,
                    payload.description,
                    payload.created_at,
                    payload.updated_at,
                ]
            );
        });

        it('should throw error if db fails', async () => {
            (mockDb.query as jest.Mock).mockRejectedValue(new Error('DB error'));

            await expect(service.create({} as any)).rejects.toThrow('DB create failed: DB error');
        });
    });

    describe('list', () => {
        it('should return list of documents', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([[fakeDocument]]);

            const paged = { offset: 0, limit: 10 };

            const result = await service.list(1, paged);

            // console.log(result, "+++++++++")

            expect(result).toEqual([fakeDocument]);

            expect(mockDb.query).toHaveBeenCalledWith(
                expect.any(String),
                [1, paged.offset, paged.limit]
            );
        });

        it('should return empty array if no documents', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue(null);

            const paged = { offset: 0, limit: 10 };
            const result = await service.list(1, paged);
            expect(result).toEqual([]);
        });

        it('should throw error if db fails', async () => {
            (mockDb.query as jest.Mock).mockRejectedValue(new Error('DB error'));

            await expect(service.list(1, { offset: 0, limit: 10 })).rejects.toThrow('DB FindList failed: DB error');
        });
    });

    describe('delete', () => {
        it('should delete and return deleted document', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([[fakeDocument]]);

            const result = await service.delete(1, 1);
            expect(result).toEqual(fakeDocument);
            expect(mockDb.query).toHaveBeenCalledWith(
                expect.any(String),
                [1, 1]
            );
        });

        it('should return null if no document deleted', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([null]);

            const result = await service.delete(1, 1);
            expect(result).toBeNull();
        });

        it('should throw error if db fails', async () => {
            (mockDb.query as jest.Mock).mockRejectedValue(new Error('DB error'));

            await expect(service.delete(1, 1)).rejects.toThrow('DB delete failed: DB error');
        });
    });

    describe('count', () => {
        it('should return count number', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([{ count: 5 }]);

            const result = await service.count(1);
            expect(result).toBe(5);
            expect(mockDb.query).toHaveBeenCalledWith(expect.any(String), [1]);
        });

        it('should return 0 if no count', async () => {
            (mockDb.query as jest.Mock).mockResolvedValue([null]);

            const result = await service.count(1);
            expect(result).toBe(0);
        });

        it('should throw error if db fails', async () => {
            (mockDb.query as jest.Mock).mockRejectedValue(new Error('DB error'));

            await expect(service.count(1)).rejects.toThrow('DB FindList failed: DB error');
        });
    });
});
