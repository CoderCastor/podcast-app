# AWS Service Integration Guide for PodcastVault

This guide will help you set up the necessary AWS services for PodcastVault.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. IAM User with appropriate permissions

## Step 1: S3 Bucket Setup

1. Create an S3 bucket:
   ```bash
   aws s3api create-bucket --bucket your-podcast-bucket-name --region your-region
   ```

2. Enable CORS for the S3 bucket. Create a file named `cors.json`:
   ```json
   {
     "CORSRules": [
       {
         "AllowedHeaders": ["*"],
         "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
         "AllowedOrigins": ["*"],
         "ExposeHeaders": []
       }
     ]
   }
   ```

3. Apply CORS configuration:
   ```bash
   aws s3api put-bucket-cors --bucket your-podcast-bucket-name --cors-configuration file://cors.json
   ```

4. Create bucket policy for public access. Create `bucket-policy.json`:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-podcast-bucket-name/*"
       }
     ]
   }
   ```

5. Apply bucket policy:
   ```bash
   aws s3api put-bucket-policy --bucket your-podcast-bucket-name --policy file://bucket-policy.json
   ```

## Step 2: DynamoDB Table Setup

1. Create DynamoDB table:
   ```bash
   aws dynamodb create-table \
     --table-name your-table-name \
     --attribute-definitions \
       AttributeName=id,AttributeType=S \
       AttributeName=createdAt,AttributeType=S \
     --key-schema \
       AttributeName=id,KeyType=HASH \
     --provisioned-throughput \
       ReadCapacityUnits=5,WriteCapacityUnits=5 \
     --global-secondary-indexes \
       "[
         {
           \"IndexName\": \"createdAt-index\",
           \"KeySchema\": [{\"AttributeName\":\"createdAt\",\"KeyType\":\"HASH\"}],
           \"Projection\": {\"ProjectionType\":\"ALL\"},
           \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5,\"WriteCapacityUnits\": 5}
         }
       ]"
   ```

## Step 3: IAM Setup

1. Create an IAM policy. Create `policy.json`:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:ListBucket",
           "s3:DeleteObject"
         ],
         "Resource": [
           "arn:aws:s3:::your-podcast-bucket-name",
           "arn:aws:s3:::your-podcast-bucket-name/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:PutItem",
           "dynamodb:GetItem",
           "dynamodb:UpdateItem",
           "dynamodb:DeleteItem",
           "dynamodb:Query",
           "dynamodb:Scan"
         ],
         "Resource": [
           "arn:aws:dynamodb:*:*:table/your-table-name",
           "arn:aws:dynamodb:*:*:table/your-table-name/index/*"
         ]
       }
     ]
   }
   ```

2. Create the policy:
   ```bash
   aws iam create-policy --policy-name PodcastVaultPolicy --policy-document file://policy.json
   ```

3. Create an IAM user for the application:
   ```bash
   aws iam create-user --user-name podcastvault-app
   ```

4. Attach the policy to the user:
   ```bash
   aws iam attach-user-policy --user-name podcastvault-app --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/PodcastVaultPolicy
   ```

5. Create access keys:
   ```bash
   aws iam create-access-key --user-name podcastvault-app
   ```

## Step 4: Environment Variables

Create a `.env.local` file with the following variables:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET_NAME=your-podcast-bucket-name
DYNAMODB_TABLE_NAME=your-table-name
```

## Step 5: Testing AWS Integration

1. Test S3 connection:
   ```bash
   aws s3 ls s3://your-podcast-bucket-name
   ```

2. Test DynamoDB connection:
   ```bash
   aws dynamodb scan --table-name your-table-name
   ```

## Security Considerations

1. Enable bucket versioning (optional):
   ```bash
   aws s3api put-bucket-versioning --bucket your-podcast-bucket-name --versioning-configuration Status=Enabled
   ```

2. Enable server-side encryption:
   ```bash
   aws s3api put-bucket-encryption \
     --bucket your-podcast-bucket-name \
     --server-side-encryption-configuration '{
       "Rules": [
         {
           "ApplyServerSideEncryptionByDefault": {
             "SSEAlgorithm": "AES256"
           }
         }
       ]
     }'
   ```

3. Enable bucket logging (optional):
   ```bash
   aws s3api put-bucket-logging \
     --bucket your-podcast-bucket-name \
     --bucket-logging-status '{
       "LoggingEnabled": {
         "TargetBucket": "your-log-bucket",
         "TargetPrefix": "podcast-logs/"
       }
     }'
   ```

## Deployment Considerations

1. Set up CloudFront distribution for better content delivery (optional)
2. Configure AWS WAF for additional security
3. Set up monitoring and alerts using CloudWatch
4. Consider using AWS Cognito for user authentication

## Cost Considerations

1. S3: Pay for storage and data transfer
2. DynamoDB: Pay for read/write capacity units
3. CloudFront (if used): Pay for data transfer
4. Monitor usage to optimize costs

Remember to replace placeholder values:
- `your-podcast-bucket-name`
- `your-table-name`
- `your_access_key`
- `your_secret_key`
- `your_region`
- `YOUR_ACCOUNT_ID` 