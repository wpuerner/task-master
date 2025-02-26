import { Handler, APIGatewayEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "task-master-spaces";

export const handler: Handler = async (event: APIGatewayEvent) => {
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: { id: uuidv4() },
    })
  );

  return {
    statusCode: 201,
  };
};
