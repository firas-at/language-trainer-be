import { Word } from 'src/words-module/entities/word';
import { UserWord } from '../entities/user_word';
import { User } from 'src/users-module/entities/user';
import { WordType } from '../../aiservice-module/models/word_type';
import { UserWordsSortBy } from '../dtos/user_words_sort_by';
import { SortingOptions } from 'src/shared/sorting_options';

export abstract class UserWordsRepository {
  abstract addWordToUser(user: User, word: Word): Promise<UserWord>;
  abstract getWordsForUser(
    user: User,
    onlyWordTypes?: WordType[],
    sortBy?: UserWordsSortBy,
    sortOrder?: SortingOptions,
  ): Promise<Word[]>;
  abstract getUserWordForUser(user: User, word: Word): Promise<UserWord | null>;
}
