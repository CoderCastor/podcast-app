const AWS = require('aws-sdk');

// Default region if not provided
const DEFAULT_REGION = 'ap-south-1';

// Validate required environment variables
const requiredEnvVars = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
};

// Check for missing required variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

const config = {
    region: process.env.AWS_REGION || DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};

// Initialize S3 Client
const s3 = new AWS.S3(config);

// Initialize DynamoDB Client
const dynamoDb = new AWS.DynamoDB.DocumentClient(config);

module.exports = {
    s3,
    dynamoDb,
    config,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    region: config.region
}; 