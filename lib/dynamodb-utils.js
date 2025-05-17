import { DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDb = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export async function createPodcast(podcast) {
    try {
        const command = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: marshall(podcast, { removeUndefinedValues: true }),
        });

        await dynamoDb.send(command);
        return { success: true };
    } catch (error) {
        console.error("Error creating podcast:", error);
        return { success: false, error: error.message };
    }
}

export async function getPodcast(id) {
    try {
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: marshall({
                ":id": id
            }),
        });

        const response = await dynamoDb.send(command);
        return {
            success: true,
            podcast: response.Items ? response.Items.map(item => unmarshall(item))[0] : null,
        };
    } catch (error) {
        console.error("Error getting podcast:", error);
        return { success: false, error: error.message };
    }
}

export async function listPodcasts(userId) {
    try {
        if (userId) {
            // Query podcasts for specific user
            const command = new QueryCommand({
                TableName: TABLE_NAME,
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: marshall({
                    ":userId": userId
                }),
                ScanIndexForward: false, // Sort in descending order
            });

            const response = await dynamoDb.send(command);
            return {
                success: true,
                podcasts: response.Items ? response.Items.map(item => unmarshall(item)) : []
            };
        } else {
            // Scan all podcasts if no userId provided
            const command = new ScanCommand({
                TableName: TABLE_NAME
            });

            const response = await dynamoDb.send(command);
            return {
                success: true,
                podcasts: response.Items ? response.Items.map(item => unmarshall(item)) : []
            };
        }
    } catch (error) {
        console.error("Error listing podcasts:", error);
        return { success: false, error: error.message };
    }
}

export async function deletePodcast(id) {
    try {
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: marshall({
                ":id": id
            }),
        });

        await dynamoDb.send(command);
        return { success: true };
    } catch (error) {
        console.error("Error deleting podcast:", error);
        return { success: false, error: error.message };
    }
}

export async function getPodcastsByDate(startDate, endDate) {
    try {
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: "createdAt-index",
            KeyConditionExpression: "createdAt BETWEEN :start AND :end",
            ExpressionAttributeValues: {
                ":start": startDate,
                ":end": endDate,
            },
        });

        const response = await dynamoDb.send(command);
        return {
            success: true,
            podcasts: response.Items ? response.Items.map(item => unmarshall(item)) : [],
        };
    } catch (error) {
        console.error("Error querying podcasts by date:", error);
        return { success: false, error: error.message };
    }
} 