import { WordType } from '../word_type';

export class WordTypeResponse {
  word: string;
  type: WordType;
}

export class WordTypeErrorResponse {
  error: string;
}
