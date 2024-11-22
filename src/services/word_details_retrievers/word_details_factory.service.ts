import { Injectable } from '@nestjs/common';
import { WordType } from 'src/models/word_type';
import { VerbDetailsRetrieverService } from './verb_details_retriever.service';
import { WordInfo } from 'src/models/word_info';

@Injectable()
export class WordDetailsFactoryService {
  constructor(
    private readonly verbDetailsRetrieverService: VerbDetailsRetrieverService,
  ) {}

  async run(word: string, type: WordType): Promise<WordInfo> {
    switch (type) {
      case WordType.Verb:
        return await this.verbDetailsRetrieverService.getDetails(word);
      default:
        return null;
    }
  }
}
