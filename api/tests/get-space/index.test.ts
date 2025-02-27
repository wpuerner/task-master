import { beforeEach, expect, test } from "@jest/globals";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../../src/get-space";
import { context } from "../constants";
import "aws-sdk-client-mock-jest";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset()
});

test("returns a space if it exists", async () => {
    ddbMock.on(GetCommand, {
        TableName: 'task-master-spaces',
        Key: { id: 'space-id' }
    }).resolves({ Item: { id: 'space-id', name: 'space-name', listIds: ['list-id'] } })

    let result = await handler({ pathParameters: { "space-id": 'space-id' } }, context, () => { });

    expect(ddbMock).toHaveReceivedCommandTimes(GetCommand, 1);
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({ id: 'space-id', name: 'space-name', listIds: ['list-id'] }))
});

test("returns a 404 if the space doesn't exist", async () => {
    ddbMock.on(GetCommand).resolves({Item: undefined});

    let result = await handler({ pathParameters: { "space-id": 'space-id' } }, context, () => { });

    expect(ddbMock).toHaveReceivedCommandTimes(GetCommand, 1);
    expect(result.statusCode).toBe(404);
});