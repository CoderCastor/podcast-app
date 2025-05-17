/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: [
            `${process.env.APP_AWS_S3_BUCKET_NAME}.s3.${process.env.APP_AWS_REGION}.amazonaws.com`,
        ],
    },
    env: {
        APP_AWS_REGION: process.env.APP_AWS_REGION,
        APP_AWS_S3_BUCKET_NAME: process.env.APP_AWS_S3_BUCKET_NAME,
        DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
    }
};

module.exports = nextConfig; 