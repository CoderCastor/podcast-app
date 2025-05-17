import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Check for required environment variables
const requiredEnvVars = {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
};

// Validate environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION;

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