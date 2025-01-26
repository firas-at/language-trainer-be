import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserWordsModule } from './user-words-module/user-words.module';
import { AIServiceModule } from './aiservice-module/aiservice.module';
import { UsersModule } from './users-module/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsModule } from './words-module/words.module';
import { User } from './users-module/entities/user';
import { Word } from './words-module/entities/word';
import { UserWord } from './user-words-module/entities/user_word';
import { LoggerMiddleware } from './middleware/logger.middleware';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        let dbConfig;

        if (process.env.NODE_ENV === 'development') {
          // Use environment variables for local development
          dbConfig = {
            type: (process.env.DB_TYPE as any) || 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10), // Ensure port is a number
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          };
        } else {
          // Fetch credentials from AWS Secrets Manager
          const secretArn = process.env.DB_SECRET_ARN; // Secret ARN passed via Lambda environment
          const client = new SecretsManagerClient({});
          const command = new GetSecretValueCommand({ SecretId: secretArn });
          const response = await client.send(command);

          if (!response.SecretString) {
            throw new Error('Database secret is not available.');
          }

          const secret = JSON.parse(response.SecretString);
          dbConfig = {
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: secret.username,
            password: secret.password,
            database: process.env.DB_NAME,
          };
        }

        console.log(`THIS IS DB CONFIG: ${JSON.stringify(dbConfig)}`);

        return {
          ...dbConfig,
          entities: [User, Word, UserWord],
          synchronize: true,
          logging: false,
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    AIServiceModule,
    UsersModule,
    WordsModule,
    UserWordsModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
