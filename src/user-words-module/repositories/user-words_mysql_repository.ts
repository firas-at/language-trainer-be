import { Injectable } from '@nestjs/common';
import { UserWordsRepository } from './user-words.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWord } from '../models/user_word';
import { Repository } from 'typeorm';

@Injectable()
export class UserWordsMysqlRepository extends UserWordsRepository {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordsRepository: Repository<UserWord>,
  ) {
    super();
  }

  insert(userId: number, word: string) {
    const newUserWord = this.userWordsRepository.create({ userId, word }); // Creates a new User instance
    return this.userWordsRepository.save(newUserWord); // Saves it to the database
  }

  async findAll(userId: number, word?: string): Promise<UserWord[]> {
    return await this.userWordsRepository.find({ where: { userId, word } });
  }
}
