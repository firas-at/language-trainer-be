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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10), // Ensure port is a number
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Word, UserWord],
      synchronize: true,
      logging: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AIServiceModule,
    UsersModule,
    WordsModule,
    UserWordsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
