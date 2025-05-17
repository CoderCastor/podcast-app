import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();
    
    const fileKey = `podcasts/${Date.now()}-${fileName}`;
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Expires: 60, // URL expires in 60 seconds
      ContentType: fileType,
    };

    const presignedPost = await s3.createPresignedPost({
      ...params,
      Conditions: [
        ['content-length-range', 0, 104857600], // Max file size: 100MB
        ['starts-with', '$Content-Type', 'audio/'],
      ],
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