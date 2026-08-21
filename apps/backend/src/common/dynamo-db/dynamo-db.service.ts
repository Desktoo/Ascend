import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { env } from '@day-mark/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class DynamoDbService implements OnModuleInit {
  private readonly logger = new Logger(DynamoDbService.name);
  private docClient!: DynamoDBDocumentClient;
  private readonly tableName = 'Day-Mark-Logs';

  onModuleInit() {
    const client = new DynamoDBClient({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_IAM_ACCESS_KEY,
        secretAccessKey: env.AWS_IAM_SECRET_ACCESS_KEY,
      },
    });

    this.docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });

    this.logger.log('DynamoDB Document Client initialized successfully.');
  }

  async putItem<T extends Record<string, any>>(item: T): Promise<T> {
    try {
      await this.docClient.send(
        new PutCommand({ TableName: this.tableName, Item: item }),
      );

      return item;
    } catch (error) {
      this.logger.log('DynamoDB Put Error: ', error);
      throw new InternalServerErrorException('Database write operation failed');
    }
  }

  async queryByPartitionKey<T>(pkValue: string): Promise<T[]> {
    try {
      const response = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression: 'PK = :pk',
          ExpressionAttributeValues: { ':pk': pkValue },
        }),
      );
      return (response.Items as T[]) || [];
    } catch (error) {
      this.logger.error(`DynamoDB Query Error for PK ${pkValue}:`, error);
      throw new InternalServerErrorException('Database read operation failed.');
    }
  }

  async queryKeysByPartitionKey(
    pkValue: string,
  ): Promise<{ PK: string; SK: string }[]> {
    try {
      const response = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression: 'PK = :pk',
          ExpressionAttributeValues: { ':pk': pkValue },
          ProjectionExpression: 'PK, SK', // Only fetch the keys needed for deletion
        }),
      );
      return (response.Items as { PK: string; SK: string }[]) || [];
    } catch (error) {
      this.logger.error(`DynamoDB Keys Query Error for PK ${pkValue}:`, error);
      throw new InternalServerErrorException(
        'Database key read operation failed.',
      );
    }
  }

  async queryByPrefix<T>(pkValue: string, skPrefix: string): Promise<T[]> {
    try {
      const response = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
          ExpressionAttributeValues: {
            ':pk': pkValue,
            ':skPrefix': skPrefix,
          },
        }),
      );
      return (response.Items as T[]) || [];
    } catch (error) {
      this.logger.error(
        `DynamoDB Prefix Query Error for PK ${pkValue}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Database conditional read failed.',
      );
    }
  }

  async queryGSI<T>(options: {
    indexName: string;
    pkName: string;
    pkValue: string;
    skName?: string;
    skPrefix?: string;
  }): Promise<T[]> {
    try {
      const hasSk = options.skName && options.skPrefix;
      const keyCondition = hasSk
        ? `#pk = :pk AND begins_with(#sk, :skPrefix)`
        : `#pk = :pk`;

      const expressionAttributeNames: Record<string, string> = {
        '#pk': options.pkName,
      };
      if (hasSk) {
        expressionAttributeNames['#sk'] = options.skName!;
      }

      const expressionAttributeValues: Record<string, any> = {
        ':pk': options.pkValue,
      };
      if (hasSk) {
        expressionAttributeValues[':skPrefix'] = options.skPrefix;
      }

      const response = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: options.indexName,
          KeyConditionExpression: keyCondition,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
        }),
      );

      return (response.Items as T[]) || [];
    } catch (error) {
      this.logger.error(
        `DynamoDB GSI Query Error for Index ${options.indexName} and PK ${options.pkValue}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Database GSI read operation failed.',
      );
    }
  }

  async deleteItem(pk: string, sk: string): Promise<{ success: boolean }> {
    try {
      await this.docClient.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { PK: pk, SK: sk },
        }),
      );
      return { success: true };
    } catch (error) {
      this.logger.error(
        `DynamoDB Delete Error for PK: ${pk}, SK: ${sk}`,
        error,
      );
      throw new InternalServerErrorException(
        'Database delete operation failed.',
      );
    }
  }

  async batchDeleteItems(
    keys: { PK: string; SK: string }[],
  ): Promise<{ success: boolean }> {
    if (keys.length === 0) return { success: true };

    try {
      // Explicitly type the chunks array to avoid the 'never[]' inference
      const chunks: { PK: string; SK: string }[][] = [];

      for (let i = 0; i < keys.length; i += 25) {
        chunks.push(keys.slice(i, i + 25));
      }

      for (const chunk of chunks) {
        const deleteRequests = chunk.map((key) => ({
          DeleteRequest: { Key: key },
        }));

        await this.docClient.send(
          new BatchWriteCommand({
            RequestItems: {
              [this.tableName]: deleteRequests,
            },
          }),
        );
      }

      return { success: true };
    } catch (error) {
      this.logger.error('DynamoDB Batch Delete Error:', error);
      throw new InternalServerErrorException(
        'Database batch delete operation failed.',
      );
    }
  }
}
