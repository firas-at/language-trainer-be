import { Module } from '@nestjs/common';
import { UserWordsController } from './controllers/user_words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWord } from './entities/user_word';
import { UserWordsRepository } from './repositories/user-words.repository';
import { UserWordsMysqlRepository } from './repositories/user-words_mysql_repository';
import { UserWordManagerService } from './services/user_words_manager.service';
import { UsersModule } from 'src/users-module/users.module';
import { WordsModule } from 'src/words-module/words.module';
import { AIServiceModule } from 'src/aiservice-module/aiservice.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserWord]),
    UsersModule,
    WordsModule,
    AIServiceModule,
  ],
  providers: [
    {
      provide: UserWordsRepository,
      useClass: UserWordsMysqlRepository,
    },
    UserWordManagerService,
  ],
  controllers: [UserWordsController],
})
export class UserWordsModule {}
