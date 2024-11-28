import { Injectable } from '@nestjs/common';
import { WordsRepository } from './words.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from '../entities/word';
import { Repository } from 'typeorm';
import { WordType } from 'src/aiservice-module/models/word_type';

@Injectable()
export class WordsMysqlRepository extends WordsRepository {
  constructor(
    @InjectRepository(Word)
    private readonly wordsRepository: Repository<Word>,
  ) {
    super();
  }

  insert(word: string, type: WordType, info: any) {
    const newWord = this.wordsRepository.create({ key: word, type, info });
    return this.wordsRepository.save(newWord);
  }

  async find(word: string): Promise<Word> {
    const words = await this.wordsRepository.find({ where: { key: word } });
    return words[0];
  }
}
