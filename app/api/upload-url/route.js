import { NextResponse } from 'next/server';
import { s3 } from '@/lib/aws-config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();
    const key = `podcasts/${uuidv4()}/${fileName}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.APP_AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, putObjectCommand, { expiresIn: 300 }); // URL expires in 5 minutes

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL', details: error.message },
      { status: 500 }
    );
  }
} 