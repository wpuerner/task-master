import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { beforeEach, expect, test } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import { handler } from "../../src/get-list";
import { context } from "../constants";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset();
});

test("returns a list if it exists", async () => {
    ddbMock.on(GetCommand, {
        TableName: 'task-master-lists',
        Key: { id: 'list-id' }
    }).resolves({ Item: { id: 'list-id', name: 'list-name', items: [{ name: 'item-name' }] } });

    let result = await handler({ pathParameters: { "space-id": "space-id", "list-id": "list-id" } }, context, () => { });

    expect(ddbMock).toHaveReceivedCommandTimes(GetCommand, 1);
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({ id: 'list-id', name: 'list-name', items: [{ name: 'item-name' }] }));
});

test("returns a 404 if the list doesn't exist", async () => {
    ddbMock.on(GetCommand).resolves({ Item: undefined });

    let result = await handler({ pathParameters: { "space-id": 'space-id', "list-id": 'list-id' } }, context, () => { });

    expect(ddbMock).toHaveReceivedCommandTimes(GetCommand, 1);
    expect(result.statusCode).toBe(404);
});