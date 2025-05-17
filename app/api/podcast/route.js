import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export async function POST(request) {
  try {
    const { title, description, audioUrl } = await request.json();
    
    const podcast = {
      id: Date.now().toString(),
      title,
      description,
      audioUrl,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: podcast,
      })
    );

    return NextResponse.json(podcast);
  } catch (error) {
    console.error('DynamoDB error:', error);
    return NextResponse.json(
      { error: 'Failed to save podcast metadata' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const { Item } = await docClient.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { id },
        })
      );
      
      if (!Item) {
        return NextResponse.json(
          { error: 'Podcast not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(Item);
    }

    const { Items } = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'createdAt-index',
        KeyConditionExpression: 'createdAt > :minDate',
        ExpressionAttributeValues: {
          ':minDate': '2000-01-01T00:00:00.000Z',
        },
        ScanIndexForward: false,
      })
    );

    return NextResponse.json(Items || []);
  } catch (error) {
    console.error('DynamoDB error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcasts' },
      { status: 500 }
    );
  }
} 