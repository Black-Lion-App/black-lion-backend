import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import * as fs from "fs";

export class AwsService {

    private s3: S3Client;

    private S3_AWS_BUCKET_NAME = "blacklion-s3-bucket";
    private S3_AWS_BUCKET_REGION = "us-east-1";
    private S3_AWS_BUCKET_ACCESS_KEY_ID = "AKIA4H7L43FQSNUMU4HN";
    private S3_AWS_BUCKET_SECRET_KEY = "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";

    constructor() {
        this.s3 = new S3Client({
            region: this.S3_AWS_BUCKET_REGION,
            credentials: {
                accessKeyId: this.S3_AWS_BUCKET_ACCESS_KEY_ID,
                secretAccessKey: this.S3_AWS_BUCKET_SECRET_KEY
            }
        })
    }

    async getFromAWSCloudS3(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                    Bucket: this.S3_AWS_BUCKET_NAME,
                    Key: id
                };
                const command = new GetObjectCommand(params);
                const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
                return resolve(url);
            } catch (err) {
                return reject(err);
            }
        })
    }

    async uploadToAWSCloudS3(file) {
        return new Promise(async (resolve, reject) => {
            try {
                const fileStream = fs.readFileSync(file.path, { encoding: 'utf8' });
                const params = {
                    Bucket: this.S3_AWS_BUCKET_NAME,
                    Body: Buffer.from(fileStream, 'base64'),
                    Key: file.filename
                }
                const command = new PutObjectCommand(params);
                const send = await this.s3.send(command);
                return resolve(send);
            } catch (err) {
                return reject(err);
            }
        })
    }

    async removeFromAWSCloudS3(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                    Bucket: this.S3_AWS_BUCKET_NAME,
                    Key: id
                };
                const command = new DeleteObjectCommand(params);
                const send = await this.s3.send(command);
                return resolve(send);
            } catch (err) {
                return reject(err);
            }
        })
    }

}

export default new AwsService();