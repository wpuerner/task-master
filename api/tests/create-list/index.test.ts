import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../../src/create-list/index";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { beforeEach, expect, test } from "@jest/globals";
import "aws-sdk-client-mock-jest";
import { context, uuidPattern } from "../constants";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset();
});

test("generates an id and creates a list under an existing space", async () => {
    ddbMock.on(GetCommand).resolves({
        Item: {
            id: 'space-id',
            name: 'space-name',
            listIds: []
        }
    })

    let result = await handler({ pathParameters: { "space-id": "space-id" } }, context, () => { });

    expect(result.statusCode).toBe(201);
    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
        TableName: "task-master-lists",
        Item: { id: expect.stringMatching(uuidPattern) },
    });
    expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: "task-master-spaces",
        Key: { id: expect.stringMatching("space-id") },
        UpdateExpression: "SET #list-ids = list_append(#list-ids, :val)",
        ExpressionAttributeNames: { "#list-ids": "listIds" },
        ExpressionAttributeValues: { ":val": expect.stringMatching(uuidPattern) }
    });
});

test("returns a 404 for a space that does not exist", async () => {
    ddbMock.on(GetCommand).resolves({Item: undefined});

    let result = await handler({pathParameters: { "space-id": "space-id"}}, context, () => {});

    expect(result.statusCode).toBe(404);
    expect(ddbMock).toHaveReceivedCommandTimes(GetCommand, 1);
    expect(ddbMock).toHaveReceivedCommandTimes(PutCommand, 0);
    expect(ddbMock).toHaveReceivedCommandTimes(UpdateCommand, 0);
});