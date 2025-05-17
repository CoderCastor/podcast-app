import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from './aws-config';

// Environment variables validation
const requiredEnvVars = {
    APP_AWS_REGION: process.env.APP_AWS_REGION,
    APP_AWS_ACCESS_KEY_ID: process.env.APP_AWS_ACCESS_KEY_ID,
    APP_AWS_SECRET_ACCESS_KEY: process.env.APP_AWS_SECRET_ACCESS_KEY,
    APP_AWS_S3_BUCKET_NAME: process.env.APP_AWS_S3_BUCKET_NAME,
};

// Validate environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

// Export the bucket information
export const BUCKET_NAME = process.env.APP_AWS_S3_BUCKET_NAME;
export const REGION = process.env.APP_AWS_REGION;

export async function uploadToS3(file, key) {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        });

        await s3Client.send(command);

        const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
        return { success: true, url };
    } catch (error) {
        console.error("Error uploading to S3:", error);
        return { success: false, error: error.message };
    }
}

export async function getFromS3(key) {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const response = await s3Client.send(command);
        return {
            success: true,
            data: response.Body,
            contentType: response.ContentType,
        };
    } catch (error) {
        console.error("Error getting from S3:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteFromS3(key) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);
        return { success: true };
    } catch (error) {
        console.error("Error deleting from S3:", error);
        return { success: false, error: error.message };
    }
} 