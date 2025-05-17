/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: [
            `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com`,
        ],
    },
    env: {
        AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
        DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
    }
};

module.exports = nextConfig; 