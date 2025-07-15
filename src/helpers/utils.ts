import { Global, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as sharp from 'sharp';


@Injectable()
export class Utility {

    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async bcryptString(plainStr: string) {
        const salt = await bcrypt.genSalt(7);
        return await bcrypt.hash(plainStr, salt);
    }

    async decryptString(plainStr: string, encryptedStr: string) {
        return await bcrypt.compare(plainStr, encryptedStr);
    }

    async signJWT(payload: any) {
        try {
            return this.jwtService.sign(payload)
        } catch (error) {
            return null;
        }
    }

    async verifyJWT(token: string) {
        try {
            return await this.jwtService.verify(token);
        } catch (error) {
            return null;
        }
    }

        async compressor(file: Express.Multer.File, userName: string) {

            const compressedBuffer = await sharp(file.buffer)
                .resize(400, 400, {
                    fit: 'cover'
                })
                .jpeg({ quality: 70 })
                .toBuffer();

            const compressedFile = {
                ...file,
                buffer: compressedBuffer,
                size: compressedBuffer.length,
                originalname: file.originalname.replace(/\.[^/.]+$/, `${userName}`) + '.jpg',
                mimetype: file.mimetype,
            };

            return compressedFile;


        }

}