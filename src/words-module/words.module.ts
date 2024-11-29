import { Module } from '@nestjs/common';
import { WordsRepository } from './repositories/words.repository';
import { WordsMysqlRepository } from './repositories/words_mysql.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word';

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  providers: [
    {
      provide: WordsRepository,
      useClass: WordsMysqlRepository,
    },
  ],
  exports: [WordsRepository],
})
export class WordsModule {}
