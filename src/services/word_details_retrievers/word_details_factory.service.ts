import { Injectable } from '@nestjs/common';
import { WordType } from 'src/models/word_type';
import { VerbDetailsRetrieverService } from './verb_details_retriever.service';
import { WordInfo } from 'src/models/word_info';
import { NounDetailsRetrieverService } from './noun_details_retriever.service';

@Injectable()
export class WordDetailsFactoryService {
  constructor(
    private readonly verbDetailsRetrieverService: VerbDetailsRetrieverService,
    private readonly nounDetailsRetrieverService: NounDetailsRetrieverService,
  ) {}

  async run(word: string, type: WordType): Promise<WordInfo> {
    switch (type) {
      case WordType.Verb:
        return await this.verbDetailsRetrieverService.getDetails(word);
      case WordType.Noun:
        return await this.nounDetailsRetrieverService.getDetails(word);
      default:
        return null;
    }
  }
}
