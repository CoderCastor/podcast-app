import { NextResponse } from "next/server";
import { dynamoDb } from "@/lib/aws-config";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(request) {
    try {
        const { title, description, audioKey } = await request.json();

        // Create DynamoDB record
        const podcast = {
            id: audioKey.split('/')[1], // Extract UUID from the audioKey
            title,
            description,
            audioUrl: `https://${process.env.APP_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${audioKey}`,
            createdAt: new Date().toISOString()
        };

        await dynamoDb.send(new PutCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: podcast
        }));

        return NextResponse.json(podcast);
    } catch (error) {
        console.error('Error creating podcast:', error);
        return NextResponse.json(
            { error: 'Failed to create podcast' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const result = await dynamoDb.send(new ScanCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME
        }));

        // Ensure we always return an array
        const podcasts = result.Items || [];
        return NextResponse.json(podcasts);
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch podcasts' },
            { status: 500 }
        );
    }
} 