import { WordType } from 'src/aiservice-module/models/word_type';
import { Word } from '../models/word';

export abstract class WordsRepository {
  abstract insert(word: string, type: WordType, info: any);
  abstract find(word: string): Promise<Word>;
}
