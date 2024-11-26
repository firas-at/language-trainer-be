import { Injectable } from '@nestjs/common';
import { WordDetailsRetrieverService } from './word_details_retriever.service';
import { AIService } from '../ai_services/ai.service';
import { AdjectiveInfo } from 'src/aiservice-module/models/adjective_info';
import { WordType } from '../../models/word_type';

@Injectable()
export class AdjectiveDetailsRetrieverService extends WordDetailsRetrieverService {
  static readonly SYSTEM_PROMPT = `
        You are a  German dictionary specific for adjectives, and you will help German language learners get information about the adjectives, for each provided adjective you need to provide the following information in json format:
            - translation: The meaning of the verb in English.
            - sentence_example
            - comparative
            - superlative
            - opposite
    `;

  constructor(private readonly aiService: AIService) {
    super();
  }

  async getDetails(word: string): Promise<AdjectiveInfo> {
    const response = await this.aiService.run(
      AdjectiveDetailsRetrieverService.SYSTEM_PROMPT,
      word,
    );
    const adjectiveInfo = JSON.parse(response) as AdjectiveInfo;
    adjectiveInfo.type = WordType.Adjective;
    return adjectiveInfo;
  }
}
