import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { uploadToS3 } from "@/lib/s3-utils";
import { createPodcast, listPodcasts } from "@/lib/dynamodb-utils";
import crypto from "crypto";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const audioFile = formData.get("audio");
        const title = formData.get("title");
        const description = formData.get("description");

        if (!audioFile || !title) {
            return NextResponse.json(
                { error: "Audio file and title are required" },
                { status: 400 }
            );
        }

        // Generate unique ID for the podcast
        const id = crypto.randomUUID();
        
        // Upload to S3
        const key = `podcasts/${id}/${audioFile.name}`;
        console.log("Uploading to S3 with key:", key);
        
        const s3Result = await uploadToS3(audioFile, key);
        
        if (!s3Result.success) {
            console.error("S3 upload failed:", s3Result.error);
            return NextResponse.json(
                { error: `Failed to upload audio file: ${s3Result.error}` },
                { status: 500 }
            );
        }

        // Create podcast record in DynamoDB
        const podcastData = {
            id,
            title,
            description: description || "",
            audioUrl: s3Result.url,
            duration: 0,
            userId: session.user.id,
            createdAt: new Date().toISOString()
        };

        console.log("Creating DynamoDB record:", podcastData);

        const dbResult = await createPodcast(podcastData);

        if (!dbResult.success) {
            console.error("DynamoDB creation failed:", dbResult.error);
            return NextResponse.json(
                { error: `Failed to create podcast record: ${dbResult.error}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            podcast: podcastData
        });
    } catch (error) {
        console.error("Error handling podcast upload:", error);
        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const result = await listPodcasts(session.user.id);

        if (!result.success) {
            console.error("Failed to fetch podcasts:", result.error);
            return NextResponse.json(
                { error: `Failed to fetch podcasts: ${result.error}` },
                { status: 500 }
            );
        }

        return NextResponse.json(result.podcasts);
    } catch (error) {
        console.error("Error fetching podcasts:", error);
        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
} 