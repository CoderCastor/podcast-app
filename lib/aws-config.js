import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Default region if not provided
const DEFAULT_REGION = 'ap-south-1';

// Validate required environment variables
const requiredEnvVars = {
    APP_AWS_ACCESS_KEY_ID: process.env.APP_AWS_ACCESS_KEY_ID,
    APP_AWS_SECRET_ACCESS_KEY: process.env.APP_AWS_SECRET_ACCESS_KEY,
    APP_AWS_S3_BUCKET_NAME: process.env.APP_AWS_S3_BUCKET_NAME,
};

// Check for missing required variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

const config = {
    region: process.env.APP_AWS_REGION || DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
    },
};

// Initialize S3 Client
const s3Client = new S3Client(config);

// Initialize DynamoDB Client
const ddbClient = new DynamoDBClient(config);
const dynamoDb = DynamoDBDocumentClient.from(ddbClient);

export {
    s3Client as s3,
    dynamoDb,
    config,
    requiredEnvVars,
};

export const bucketName = process.env.APP_AWS_S3_BUCKET_NAME;
export const region = config.region; 