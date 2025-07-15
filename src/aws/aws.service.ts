import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";

@Injectable()
export class AwsS3BucketService {

    constructor(
        private s3: S3,
        private configService: ConfigService
    ) { }


    async uploadOnAwsS3Bucket(folder: any, file: any) {

        try {

            const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

            if (!bucketName) {
                throw new Error('Bucket Name is not defined in environment vars');
            }

            const params = {
                Bucket: bucketName,
                Key: `${folder.name}/${Date.now().toString()}-${file?.originalname}`,
                Body: file.buffer,
                ACL: "public-read",
                ContentType: file?.mimetype || 'application/octet-stream',
                ContentDisposition: "inline",
            };

            const response = await this.s3.upload(params).promise();

            return response.Location;
        } catch (error) {
            console.error(`Upload to S3 failed: ${error.message}`);
            return;
        }
    }


    async removeFromAwsS3Bucket(location: string): Promise<any> {
        if (!location) return null;
        try {
            const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
            const key = location.split(".amazonaws.com/").pop();

            if (!bucketName || !key) {
                throw new Error('Bucket name or key is undefined');
            }

            const params = {
                Bucket: bucketName,
                Key: key
            };

            return await this.s3.deleteObject(params).promise();

        } catch (error) {
            console.error(`Failed to remove from S3 Bucket: ${error.message}`);
            return;
        }
    }

}