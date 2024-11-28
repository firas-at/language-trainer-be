import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async insert(word: string, type: WordType, info: any) {
    try {
      const newWord = this.wordsRepository.create({ key: word, type, info });
      return await this.wordsRepository.save(newWord);
    } catch (error) {
      throw new InternalServerErrorException(`Error adding word: ${error}`);
    }
  }

  async find(word: string): Promise<Word> {
    try {
      const words = await this.wordsRepository.find({ where: { key: word } });
      return words.length > 0 ? words[0] : null;
    } catch (error) {
      throw new InternalServerErrorException(`Error getting word: ${error}`);
    }
  }
}
