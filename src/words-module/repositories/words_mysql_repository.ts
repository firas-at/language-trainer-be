import { Injectable } from '@nestjs/common';
import { WordsRepository } from './words.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from '../models/word';
import { Repository } from 'typeorm';

@Injectable()
export class WordsMysqlRepository extends WordsRepository {
  constructor(
    @InjectRepository(Word)
    private readonly wordsRepository: Repository<Word>,
  ) {
    super();
  }

  insert(word: string, info: any) {
    const newWord = this.wordsRepository.create({ key: word, info }); // Creates a new User instance
    return this.wordsRepository.save(newWord); // Saves it to the database
  }

  async find(word: string): Promise<Word> {
    const words = await this.wordsRepository.find({ where: { key: word } });
    return words[0];
  }
}
