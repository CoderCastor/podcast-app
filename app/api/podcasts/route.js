import { NextResponse } from "next/server";
import { dynamoDb } from "@/lib/aws-config";

export async function POST(request) {
    try {
        const { title, description, audioKey } = await request.json();

        // Create DynamoDB record
        const podcast = {
            id: audioKey.split('/')[1], // Extract UUID from the audioKey
            title,
            description,
            audioUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${audioKey}`,
            createdAt: new Date().toISOString()
        };

        await dynamoDb.put({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: podcast
        }).promise();

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
        const result = await dynamoDb.scan({
            TableName: process.env.DYNAMODB_TABLE_NAME
        }).promise();

        return NextResponse.json(result.Items || []);
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch podcasts' },
            { status: 500 }
        );
    }
} 