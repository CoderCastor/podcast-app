const { s3, bucketName, region } = require('./aws-config');

async function uploadToS3(file, key) {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        };

        await s3.putObject(params).promise();
        const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
        return { success: true, url };
    } catch (error) {
        console.error("Error uploading to S3:", error);
        return { success: false, error: error.message };
    }
}

async function getFromS3(key) {
    try {
        const params = {
            Bucket: bucketName,
            Key: key,
        };

        const response = await s3.getObject(params).promise();
        return {
            success: true,
            data: response.Body,
            contentType: response.ContentType,
        };
    } catch (error) {
        console.error("Error getting from S3:", error);
        return { success: false, error: error.message };
    }
}

async function deleteFromS3(key) {
    try {
        const params = {
            Bucket: bucketName,
            Key: key,
        };

        await s3.deleteObject(params).promise();
        return { success: true };
    } catch (error) {
        console.error("Error deleting from S3:", error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    uploadToS3,
    getFromS3,
    deleteFromS3
}; 