import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Define the VPC
    const vpc = new ec2.Vpc(this, 'NestJSTierVpc', {
      maxAzs: 2, // 2 Availability Zones for high availability
      natGateways: 1, // 1 NAT Gateway (cost-efficient for private subnet internet access)
    });

    // 2. Create a Secrets Manager secret for RDS credentials
    const dbSecret = new secretsmanager.Secret(this, 'DBSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'admin' }),
        generateStringKey: 'password',
        passwordLength: 16,
        excludeCharacters: '/@" ', // Exclude problematic characters
      },
    });

    // 3. Create the RDS MySQL database in the VPC
    const database = new rds.DatabaseInstance(this, 'NestJSDatabase', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_33, // Current free-tier eligible version
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3, // Free-tier eligible instance class
        ec2.InstanceSize.MICRO,
      ),
      vpc,
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: 'nestjs',
      multiAz: false, // Single-AZ for cost efficiency
      allocatedStorage: 20, // Free-tier limit
      publiclyAccessible: true, // Optional: Enable for debugging access from your local machine
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, // Private subnets for better security
      },
      backupRetention: cdk.Duration.days(0), // Disable backup for this database
    });

    // 4. Create a security group for the RDS instance
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });

    // Allow ECS to connect to RDS on port 3306
    dbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306),
      'Allow MySQL access from ECS tasks',
    );

    database.connections.addSecurityGroup(dbSecurityGroup);

    // 5. Create an ECS Cluster
    const cluster = new ecs.Cluster(this, 'NestJSCluster', {
      vpc,
    });

    // 6. Create an ECS Fargate Task Definition and Service
    const taskExecutionRole = new iam.Role(this, 'NestJSTaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy',
        ), // Grants permissions for ECR
      ],
    });

    const taskDefinitionRole = new iam.Role(this, 'NestJSTaskDefinitionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    taskDefinitionRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        resources: [dbSecret.secretArn], // Allow access only to the DB secret
      }),
    );

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'NestJSTaskDefinition',
      {
        memoryLimitMiB: 1024,
        cpu: 512,
        executionRole: taskExecutionRole, // Attach the task execution role to the task definition
        taskRole: taskDefinitionRole,
      },
    );

    taskDefinition.addContainer('NestJSContainer', {
      image: ecs.ContainerImage.fromRegistry(
        '825765425452.dkr.ecr.eu-central-1.amazonaws.com/language-trainer-repo:latest',
      ),
      environment: {
        DB_HOST: database.dbInstanceEndpointAddress,
        DB_USER: 'admin',
        DB_PORT: '3306',
        DB_SECRET_ARN: dbSecret.secretArn,
        DB_NAME: 'nestjs',
        GEMINI_API_KEY: 'AIzaSyB12ATRfOsBTMloOEFgtYYCF5x-hLAeLmc', // Pass API key for external service
        JWT_SECRET: 'Replace_it_with_your_JWT_Secret',
      },
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'NestJS' }),
      portMappings: [{ containerPort: 3000 }],
    });

    const fargateService =
      new ecsPatterns.ApplicationLoadBalancedFargateService(
        this,
        'NestJSFargateService',
        {
          cluster,
          taskDefinition,
          publicLoadBalancer: true,
        },
      );

    // Allow the ECS Task to connect to the RDS Database
    database.connections.allowFrom(fargateService.service, ec2.Port.tcp(3306));

    // 7. Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
      description: 'Load Balancer DNS URL for the NestJS backend',
    });

    new cdk.CfnOutput(this, 'DBEndpoint', {
      value: database.dbInstanceEndpointAddress,
      description: 'RDS MySQL Database Endpoint',
    });

    new cdk.CfnOutput(this, 'DBSecretArn', {
      value: dbSecret.secretArn,
      description: 'RDS Credentials Secret ARN',
    });
  }
}
