import { NextResponse } from 'next/server';
import { s3 } from '@/lib/aws-config';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();
    const key = `podcasts/${uuidv4()}/${fileName}`;

    const params = {
      Bucket: process.env.APP_AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      Expires: 60 * 5 // URL expires in 5 minutes
    };

    const url = await s3.getSignedUrlPromise('putObject', params);

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
} 