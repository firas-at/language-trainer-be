import { Injectable } from '@nestjs/common';
import { AIService } from '../ai_services/ai.service';
import { WordDetailsRetrieverService } from './word_details_retriever.service';
import { VerbInfo } from 'src/models/verb_info';

@Injectable()
export class VerbDetailsRetrieverService extends WordDetailsRetrieverService {
  private readonly SYSTEM_PROMPT = `
        You are a  German dictionary specific for verbs, and you will help German language learners get information about the verbs, for each provided verb you need to provide the following information in json format:
            - translation: The meaning of the verb in English.
            - infinitive Form: The base form of the verb.
            - partizip_2 form
            - auxiliary_verb: haben/sein
            - präteritum_form
            - sentence_example
    `;

  constructor(private readonly aiService: AIService) {
    super();
  }

  async getDetails(word: string): Promise<VerbInfo> {
    const response = await this.aiService.run(this.SYSTEM_PROMPT, word);
    return JSON.parse(response);
  }
}
