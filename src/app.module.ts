import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserWordsModule } from './user-words-module/user-words.module';
import { AIServiceModule } from './aiservice-module/aiservice.module';
import { UsersModule } from './users-module/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsModule } from './words-module/words.module';
import { User } from './users-module/entities/user';
import { Word } from './words-module/entities/word';
import { UserWord } from './user-words-module/entities/user_word';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Word, UserWord],
      synchronize: true,
      logging: false,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AIServiceModule,
    UsersModule,
    WordsModule,
    UserWordsModule,
  ],
})
export class AppModule {}
