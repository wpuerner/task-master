import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Handler } from "aws-lambda";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = 'task-master-spaces';

export const handler: Handler = async (event, context) => {

  let result = await dynamo.send(new GetCommand({ TableName: tableName, Key: { id: event.pathParameters["space-id"] } }));

  if (result.Item) {
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    }
  } else {
    return { statusCode: 404 }
  }
};
