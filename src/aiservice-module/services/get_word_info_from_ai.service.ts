import { Injectable } from '@nestjs/common';
import { WordInfo } from 'src/aiservice-module/models/word_info';
import { WordDetailsFactoryService } from './word_details_retrievers/word_details_factory.service';
import { WordTypeRetrieverService } from './word_type_retriever.service';

@Injectable()
export class GetWordInfoFromAIService {
  constructor(
    private readonly wordDetailsFactory: WordDetailsFactoryService,
    private readonly wordTypeRetriever: WordTypeRetrieverService,
  ) {}

  async run(word: string): Promise<WordInfo> {
    const response = await this.wordTypeRetriever.run(word);
    return this.wordDetailsFactory.run(response.word, response.type);
  }
}
