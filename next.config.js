/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: [
            `${process.env.APP_AWS_S3_BUCKET_NAME}.s3.${process.env.APP_AWS_REGION || 'ap-south-1'}.amazonaws.com`,
        ],
    },
    env: {
        APP_AWS_REGION: process.env.APP_AWS_REGION || 'ap-south-1',
        APP_AWS_ACCESS_KEY_ID: process.env.APP_AWS_ACCESS_KEY_ID,
        APP_AWS_SECRET_ACCESS_KEY: process.env.APP_AWS_SECRET_ACCESS_KEY,
        APP_AWS_S3_BUCKET_NAME: process.env.APP_AWS_S3_BUCKET_NAME,
        DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
    }
};

export default nextConfig; 