import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// AWS Configuration
const config = {
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};

// Initialize S3 Client with specific endpoint
export const s3Client = new S3Client({
    ...config,
    endpoint: `https://s3.${config.region}.amazonaws.com`,
});

// Initialize DynamoDB Client with specific endpoint
const ddbClient = new DynamoDBClient({
    ...config,
    endpoint: `https://dynamodb.${config.region}.amazonaws.com`,
});

export const dynamoDb = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions: {
        removeUndefinedValues: true,
    },
}); 