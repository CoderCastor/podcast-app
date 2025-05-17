# PodcastVault

A full-stack podcast hosting platform built with Next.js, AWS S3, and DynamoDB.

## Features

- Upload audio files to AWS S3
- Store podcast metadata in DynamoDB
- Beautiful UI with Tailwind CSS
- Audio player with playback controls
- Responsive dashboard
- Individual podcast pages

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=your_region
   AWS_S3_BUCKET_NAME=your_bucket_name
   DYNAMODB_TABLE_NAME=your_table_name
   ```

4. Set up AWS resources:
   - Create an S3 bucket for storing audio files
   - Create a DynamoDB table with the following schema:
     - Partition key: `id` (String)
     - Sort key: `createdAt` (String)
     - Other attributes: `title`, `description`, `audioUrl`
   - Create a secondary index named `createdAt-index` on the `createdAt` field

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## AWS Setup Requirements

1. S3 Bucket:
   - Enable CORS for audio file streaming
   - Set up appropriate bucket policy for public access to audio files

2. IAM User:
   - Create a user with programmatic access
   - Attach policies for S3 and DynamoDB access
   - Use the access keys in your `.env.local` file

3. DynamoDB:
   - Table name: (as specified in DYNAMODB_TABLE_NAME)
   - Primary key: id (String)
   - Sort key: createdAt (String)
   - GSI: createdAt-index

## Tech Stack

- Next.js (App Router)
- React Hook Form
- Tailwind CSS
- AWS S3
- AWS DynamoDB
- Axios

## File Structure

```
/app
  /upload
    page.js           # Upload form
  /dashboard
    page.js           # Podcast list
  /podcast
    /[id]
      page.js         # Individual podcast player
  /api
    /presign
      route.js        # S3 presigned URL generation
    /podcast
      route.js        # DynamoDB operations

/components
  AudioPlayer.js      # Audio player component
  PodcastCard.js      # Podcast list item component

/lib
  api.js             # API utilities
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
