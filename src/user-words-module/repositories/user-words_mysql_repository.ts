import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserWordsRepository } from './user-words.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWord } from '../entities/user_word';
import { Repository } from 'typeorm';
import { Word } from 'src/words-module/entities/word';
import { User } from 'src/users-module/entities/user';

@Injectable()
export class UserWordsMysqlRepository extends UserWordsRepository {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordsRepository: Repository<UserWord>,
  ) {
    super();
  }

  /**
   * Adds a word to a user only if it doesn't already exist.
   */
  async addWordToUser(user: User, word: Word): Promise<UserWord> {
    try {
      const userWord = await this.getWordForUser(user, word);

      if (!userWord) {
        const userWord = this.userWordsRepository.create({ user, word });
        await this.userWordsRepository.save(userWord);
      }

      return userWord;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error adding word to user: ${error}`,
      );
    }
  }

  /**
   * Fetches all words associated with a specific user.
   */
  async getWordsForUser(user: User): Promise<Word[]> {
    try {
      const userWords = await this.userWordsRepository.find({
        where: { user },
        relations: ['word'], // Load the related Word entity
      });

      return userWords.map((userWord) => userWord.word); // Extract Word objects
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting all words for user: ${error}`,
      );
    }
  }

  /**
   * Fetches a specific word for a specific user.
   */
  async getWordForUser(user: User, word: Word): Promise<UserWord | null> {
    try {
      const userWords = await this.userWordsRepository
        .createQueryBuilder('UserWord')
        .leftJoinAndSelect('UserWord.word', 'word')
        .leftJoinAndSelect('UserWord.user', 'user')
        .where('word.id = :wordId', { wordId: word.id })
        .getMany();

      return userWords.length > 0 ? userWords[0] : null; // Return the Word if it exists, otherwise null
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting a word for user: ${error}`,
      );
    }
  }
}
