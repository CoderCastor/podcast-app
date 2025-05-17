import { NextResponse } from 'next/server';
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3Client = new S3Client({
  region: process.env.APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();
    
    const fileKey = `podcasts/${Date.now()}-${fileName}`;
    
    const presignedPost = await createPresignedPost(s3Client, {
      Bucket: process.env.APP_AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Conditions: [
        ['content-length-range', 0, 104857600], // Max file size: 100MB
        ['starts-with', '$Content-Type', 'audio/'],
      ],
      Expires: 60, // URL expires in 60 seconds
      Fields: {
        'Content-Type': fileType,
      },
    });

    return NextResponse.json(presignedPost);
  } catch (error) {
    console.error('Presign error:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
} 