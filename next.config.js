/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: [
            'podcastvault-storage-castor.s3.ap-south-1.amazonaws.com'
        ],
    },
    env: {
        AWS_REGION: process.env.AWS_REGION,
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
        DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
    }
};

module.exports = nextConfig; 