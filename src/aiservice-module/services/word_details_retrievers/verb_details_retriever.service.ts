import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AIService } from '../ai_services/ai.service';
import { WordDetailsRetrieverService } from './word_details_retriever.service';
import { VerbInfo } from 'src/aiservice-module/models/verb_info';
import { WordType } from '../../models/word_type';

@Injectable()
export class VerbDetailsRetrieverService extends WordDetailsRetrieverService {
  static readonly SYSTEM_PROMPT = `
        You are a  German dictionary specific for verbs, and you will help German language learners get information about the verbs, for each provided verb you need to provide the following information in json format:
            - translation: The meaning of the verb in English.
            - sentence_example
            - infinitive Form: The base form of the verb.
            - partizip_2 form
            - auxiliary_verb: haben/sein
            - präteritum_form
    `;

  constructor(private readonly aiService: AIService) {
    super();
  }

  async getDetails(word: string): Promise<VerbInfo> {
    try {
      const response = await this.aiService.run(
        VerbDetailsRetrieverService.SYSTEM_PROMPT,
        word,
      );
      const verbInfo = JSON.parse(response) as VerbInfo;
      verbInfo.type = WordType.Verb;
      return verbInfo;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting verb details: ${error}`,
      );
    }
  }
}
