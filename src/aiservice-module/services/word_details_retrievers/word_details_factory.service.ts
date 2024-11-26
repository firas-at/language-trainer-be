import { Injectable } from '@nestjs/common';
import { WordType } from '../../models/word_type';
import { VerbDetailsRetrieverService } from './verb_details_retriever.service';
import { WordInfo } from 'src/aiservice-module/models/word_info';
import { NounDetailsRetrieverService } from './noun_details_retriever.service';
import { AdjectiveDetailsRetrieverService } from './adjective_details_retriever.service';

@Injectable()
export class WordDetailsFactoryService {
  constructor(
    private readonly verbDetailsRetrieverService: VerbDetailsRetrieverService,
    private readonly nounDetailsRetrieverService: NounDetailsRetrieverService,
    private readonly adjectiveDetailsRetrieverService: AdjectiveDetailsRetrieverService,
  ) {}

  async run(word: string, type: WordType): Promise<WordInfo> {
    switch (type) {
      case WordType.Verb:
        return await this.verbDetailsRetrieverService.getDetails(word);
      case WordType.Noun:
        return await this.nounDetailsRetrieverService.getDetails(word);
      case WordType.Adjective:
        return await this.adjectiveDetailsRetrieverService.getDetails(word);
      default:
        return null;
    }
  }
}
