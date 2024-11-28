import { Word } from 'src/words-module/entities/word';
import { UserWord } from '../entities/user_word';
import { User } from 'src/users-module/entities/user';

export abstract class UserWordsRepository {
  abstract addWordToUser(user: User, word: Word): Promise<UserWord>;
  abstract getWordsForUser(user: User): Promise<Word[]>;
  abstract getUserWordForUser(user: User, word: Word): Promise<UserWord | null>;
}
