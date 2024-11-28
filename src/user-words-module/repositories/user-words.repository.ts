import { UserWord } from '../entities/user_word';

export abstract class UserWordsRepository {
  abstract insert(userId: number, word: string);
  abstract findAll(userId: number, word?: string): Promise<UserWord[]>;
}
