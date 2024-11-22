import { Injectable } from '@nestjs/common';
import { WordDetailsFactoryService } from 'src/services/word_details_retrievers/word_details_factory.service';
import { WordTypeRetrieverService } from 'src/services/word_type_retriever.service';

@Injectable()
export class GetWordInfoUsecase {
  constructor(
    private readonly wordDetailsFactory: WordDetailsFactoryService,
    private readonly wordTypeRetriever: WordTypeRetrieverService,
  ) {}

  async run(word: string): Promise<string> {
    const response = await this.wordTypeRetriever.run(word);
    return this.wordDetailsFactory.run(response.word, response.type);
  }
}
