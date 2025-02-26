import { Context } from "aws-lambda";

export const uuidPattern: string =
  "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$";

export const context: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "someFunction",
  functionVersion: "someVersion",
  invokedFunctionArn: "someArn",
  memoryLimitInMB: "someLimit",
  awsRequestId: "someRequestId",
  logGroupName: "someLogGroupName",
  logStreamName: "someLogStreamName",
  getRemainingTimeInMillis() {
    return 0;
  },
  done(error, result) {
    return null;
  },
  fail(error) {
    return null;
  },
  succeed() {
    return null;
  },
};
