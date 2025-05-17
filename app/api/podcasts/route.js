import { NextResponse } from "next/server";
import { dynamoDb } from "@/lib/aws-config";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(request) {
    try {
        const { title, description, audioKey } = await request.json();

        // Validate required fields
        if (!title || !audioKey) {
            return NextResponse.json(
                { error: 'Title and audioKey are required' },
                { status: 400 }
            );
        }

        // Create DynamoDB record
        const podcast = {
            id: audioKey.split('/')[1], // Extract UUID from the audioKey
            title,
            description: description || '',
            audioUrl: `https://${process.env.APP_AWS_S3_BUCKET_NAME}.s3.${process.env.APP_AWS_REGION || 'ap-south-1'}.amazonaws.com/${audioKey}`,
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
            { error: 'Failed to create podcast', details: error.message },
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
        
        // Sort by createdAt in descending order (newest first)
        podcasts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return NextResponse.json(podcasts);
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch podcasts', details: error.message },
            { status: 500 }
        );
    }
} 