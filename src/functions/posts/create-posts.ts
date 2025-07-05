import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from "aws-lambda";

const posts: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  try {
    // TODO: Implement the logic to create a post

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify({ message: "Created post successfully" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

export const main = posts;
