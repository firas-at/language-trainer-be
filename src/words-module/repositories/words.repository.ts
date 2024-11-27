import { Word } from '../models/word';

export abstract class WordsRepository {
  abstract insert(word: string, info: any);
  abstract find(word: string): Promise<Word>;
}
