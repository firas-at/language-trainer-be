import { Injectable } from '@nestjs/common';
import { WordDetailsRetrieverService } from './word_details_retriever.service';
import { AIService } from '../ai_services/ai.service';
import { WordType } from 'src/models/word_type';
import { NounInfo } from 'src/models/noun_info';

@Injectable()
export class NounDetailsRetrieverService extends WordDetailsRetrieverService {
  private readonly SYSTEM_PROMPT = `
        You are a  German dictionary specific for nouns, and you will help German language learners get information about the nouns, for each provided noun you need to provide the following information in json format:
            - translation: The meaning of the verb in English.
            - sentence_example
            - gender (Artikel): Masculine (der), Feminine (die), or Neuter (das).
            - plural_form: The plural version
    `;

  constructor(private readonly aiService: AIService) {
    super();
  }

  async getDetails(word: string): Promise<NounInfo> {
    const response = await this.aiService.run(this.SYSTEM_PROMPT, word);
    const nounInfo = JSON.parse(response) as NounInfo;
    nounInfo.type = WordType.Noun;
    return nounInfo;
  }
}
