import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AIService } from '../ai_services/ai.service';
import { WordDetailsRetrieverService } from './word_details_retriever.service';
import { VerbInfo } from 'src/aiservice-module/models/verb_info';
import { WordType } from '../../models/word_type';

@Injectable()
export class VerbDetailsRetrieverService extends WordDetailsRetrieverService {
  static readonly SYSTEM_PROMPT = `
        You are a  German dictionary specific for verbs, and you will help German language learners get information about the verbs, for each provided verb return a JSON response with the following structure:
        {
            translation: string, //The meaning of the verb in English.
            sentence_example: string,
            infinitive Form: string, //The base form of the verb.
            partizip_2 form: string,
            auxiliary_verb: string, //haben/sein
            präteritum_form
        }
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
