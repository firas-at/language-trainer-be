import { Module } from '@nestjs/common';
import { UserWordsController } from './controllers/user_words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWord } from './entities/user_word';
import { UserWordsRepository } from './repositories/user_words.repository';
import { UserWordsMysqlRepository } from './repositories/user_words_mysql.repository';
import { UserWordManagerService } from './services/user_words_manager.service';
import { UsersModule } from 'src/users-module/users.module';
import { WordsModule } from 'src/words-module/words.module';
import { AIServiceModule } from 'src/aiservice-module/aiservice.module';
import { JwtService } from '@nestjs/jwt';

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
    JwtService,
  ],
  controllers: [UserWordsController],
})
export class UserWordsModule {}
