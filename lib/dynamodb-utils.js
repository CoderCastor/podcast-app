import { PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from './aws-config';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export async function createPodcast(podcast) {
    try {
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: podcast,
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
            ExpressionAttributeValues: {
                ":id": id
            },
        });

        const response = await dynamoDb.send(command);
        return {
            success: true,
            podcast: response.Items ? response.Items[0] : null,
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
                ExpressionAttributeValues: {
                    ":userId": userId
                },
                ScanIndexForward: false, // Sort in descending order
            });

            const response = await dynamoDb.send(command);
            return {
                success: true,
                podcasts: response.Items || []
            };
        } else {
            // Scan all podcasts if no userId provided
            const command = new ScanCommand({
                TableName: TABLE_NAME
            });

            const response = await dynamoDb.send(command);
            return {
                success: true,
                podcasts: response.Items || []
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
            ExpressionAttributeValues: {
                ":id": id
            },
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
            podcasts: response.Items || [],
        };
    } catch (error) {
        console.error("Error querying podcasts by date:", error);
        return { success: false, error: error.message };
    }
} 