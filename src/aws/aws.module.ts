import { Module } from '@nestjs/common';
import {
    ConfigModule,
    ConfigService
} from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { AwsS3BucketService } from '../aws/aws.service';

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [
        {
            provide: S3,
            useFactory: async (configService: ConfigService) => {
                const accessKeyId = configService.get<string>('aws.aws_access_key');
                const secretAccessKey = configService.get<string>('aws.aws_access_secret');
                const region = configService.get<string>('aws.aws_region');

                if (!accessKeyId || !secretAccessKey || !region) {
                    throw new Error('Missing config values');
                }

                const s3Config = {
                    region,
                    credentials: {
                        accessKeyId,
                        secretAccessKey
                    },
                };
                return new S3(s3Config);
            },
            inject: [ConfigService],
        },
        AwsS3BucketService
    ],
    exports: [
        S3,
        AwsS3BucketService,

    ]
})
export class AWSModule { }