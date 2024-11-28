import { WordType } from 'src/aiservice-module/models/word_type';
import { Word } from '../entities/word';

export abstract class WordsRepository {
  abstract addWord(word: string, type: WordType, info: any);
  abstract getWord(word: string): Promise<Word>;
}
