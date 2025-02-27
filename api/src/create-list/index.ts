import { DynamoDB, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent, Handler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const spacesTableName = 'task-master-spaces';
const listsTableName = 'task-master-lists';

export const handler: Handler = async (event: APIGatewayEvent) => {
  if (!(event.pathParameters && event.pathParameters["space-id"])) {
    return {statusCode: 404};
  }
  const spaceId = event.pathParameters["space-id"];

  const space = await dynamo.send(new GetCommand({TableName: spacesTableName, Key: {id: spaceId}}));

  if (space.Item == undefined) {
    return {statusCode: 404};
  }

  const listId = uuidv4();

  await dynamo.send(new PutCommand({
    TableName: listsTableName,
    Item: { id: listId },
  }));

  await dynamo.send(new UpdateCommand({
    TableName: spacesTableName,
    Key: {id: spaceId},
    UpdateExpression: "SET #list-ids = list_append(#list-ids, :val)",
    ExpressionAttributeNames: {"#list-ids": "listIds"},
    ExpressionAttributeValues: {":val": listId}
  }));

  return {
    statusCode: 201,
  }
};
