import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { beforeEach, expect, test } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import { context, uuidPattern } from "../constants";

import { handler } from "../../src/create-space/index";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

test("generates an id and calls dynamo db", async () => {
  let result = await handler({}, context, () => {});

  expect(ddbMock).toHaveReceivedCommandTimes(PutCommand, 1);
  expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
    TableName: "task-master-spaces",
    Item: { id: expect.stringMatching(uuidPattern) },
  });
  expect(result.statusCode).toBe(201);
});
