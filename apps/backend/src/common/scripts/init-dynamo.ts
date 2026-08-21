import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { env } from '@day-mark/config';

const client = new DynamoDBClient({
  region: env.AWS_REGION,
  credentials: {
    secretAccessKey: env.AWS_IAM_SECRET_ACCESS_KEY,
    accessKeyId: env.AWS_IAM_ACCESS_KEY,
  },
});

async function createTable(tableName: string) {
  const command = new CreateTableCommand({
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],

    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],

    BillingMode: 'PAY_PER_REQUEST',
  });

  try {
    const response = await client.send(command);
    console.log(
      'DynamoDB Table Created Successfully:',
      response.TableDescription?.TableName,
    );
  } catch (error) {
    console.error('Failed to create table:', error);
  }
}

createTable('Ascend-habit-Logs');
