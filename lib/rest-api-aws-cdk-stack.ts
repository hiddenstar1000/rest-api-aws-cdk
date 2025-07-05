import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class RestApiAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stage = this.node.tryGetContext("stage");

    const api = new apigateway.RestApi(this, `RestApi`, {
      restApiName: `rest-api-${stage}`,
      deployOptions: {
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        stageName: stage,
      },
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["*"],
        allowCredentials: true,
      },
    });

    const createPostsFn = new lambda.Function(this, "createPostsFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset("src/functions/posts"),
      handler: "create-posts.main",
      environment: {
        STAGE: stage,
        API_AWS_REGION: this.region,
      },
      memorySize: 512,
      timeout: cdk.Duration.seconds(15),
    });

    const postsResource = api.root.addResource("posts");
    postsResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createPostsFn),
      {
        authorizationType: apigateway.AuthorizationType.NONE,
      }
    );
  }
}
