import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserWordsModule } from './user-words-module/user-words.module';
import { AIServiceModule } from './aiservice-module/aiservice.module';
import { UsersModule } from './users-module/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users-module/db/entities/user.entity';
import { UserWordEntity } from './user-words-module/db/entities/user_word.entity';
import { WordsModule } from './words-module/words.module';
import { WordEntity } from './words-module/db/entities/word.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, WordEntity, UserWordEntity],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AIServiceModule,
    UsersModule,
    WordsModule,
    UserWordsModule,
  ],
})
export class AppModule {}
