import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserWordsRepository } from './user_words.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWord } from '../entities/user_word';
import { Repository } from 'typeorm';
import { Word } from 'src/words-module/entities/word';
import { User } from 'src/users-module/entities/user';
import { WordType } from '../../aiservice-module/models/word_type';
import { UserWordsSortBy } from '../dtos/user_words_sort_by';
import { SortingOptions } from '../../shared/sorting_options';

@Injectable()
export class UserWordsMysqlRepository extends UserWordsRepository {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordsRepository: Repository<UserWord>,
  ) {
    super();
  }

  async addWordToUser(user: User, word: Word): Promise<UserWord> {
    try {
      let userWord = await this.getUserWordForUser(user, word);

      if (!userWord) {
        userWord = this.userWordsRepository.create({ user, word });
        await this.userWordsRepository.save(userWord);
      }

      return userWord;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error adding word to user: ${error}`,
      );
    }
  }

  async getWordsForUser(
    user: User,
    onlyWordTypes?: WordType[],
    sortBy?: UserWordsSortBy,
    sortOrder?: SortingOptions,
  ): Promise<Word[]> {
    try {
      let wordTypes = Object.values(WordType);

      if (onlyWordTypes) {
        wordTypes = onlyWordTypes;
      }

      const queryBuilder = await this.userWordsRepository
        .createQueryBuilder('UserWord')
        .leftJoinAndSelect('UserWord.word', 'word')
        .leftJoinAndSelect('UserWord.user', 'user')
        .where('user.id = :userId', { userId: user.id })
        .andWhere('word.type IN (:...wordTypes)', { wordTypes }); // Add this line for filtering by type

      if (sortBy) {
        const sortingOrder = sortOrder
          ? sortOrder == SortingOptions.asc
            ? 'ASC'
            : 'DESC'
          : 'DESC';
        queryBuilder.orderBy(`UserWord.${sortBy}`, sortingOrder);
      }

      const userWords = await queryBuilder.getMany();

      return userWords.map((userWord) => userWord.word); // Extract Word objects
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting all words for user: ${error}`,
      );
    }
  }

  async getUserWordForUser(user: User, word: Word): Promise<UserWord | null> {
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
