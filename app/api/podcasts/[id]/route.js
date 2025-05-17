import { NextResponse } from "next/server";
import { dynamoDb, s3 } from "@/lib/aws-config";
import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE(request, { params }) {
    try {
        // Get the podcast details first
        const result = await dynamoDb.send(new GetCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: { id: params.id }
        }));

        if (!result.Item) {
            return NextResponse.json(
                { error: 'Podcast not found' },
                { status: 404 }
            );
        }

        // Extract the S3 key from the audioUrl
        // audioUrl format: https://bucket-name.s3.region.amazonaws.com/podcasts/uuid/filename
        const audioUrl = new URL(result.Item.audioUrl);
        const audioKey = audioUrl.pathname.substring(1); // Remove leading slash

        // Delete from S3
        try {
            await s3.send(new DeleteObjectCommand({
                Bucket: process.env.APP_AWS_S3_BUCKET_NAME,
                Key: audioKey
            }));
        } catch (s3Error) {
            console.error('Error deleting from S3:', s3Error);
            // Continue with DynamoDB deletion even if S3 deletion fails
        }

        // Delete from DynamoDB
        await dynamoDb.send(new DeleteCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: { id: params.id }
        }));

        return NextResponse.json({ message: 'Podcast deleted successfully' });
    } catch (error) {
        console.error('Error deleting podcast:', error);
        return NextResponse.json(
            { error: 'Failed to delete podcast', details: error.message },
            { status: 500 }
        );
    }
} 