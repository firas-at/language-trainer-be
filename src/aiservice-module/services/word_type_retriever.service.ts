import { Injectable } from '@nestjs/common';
import { AIService } from './ai_services/ai.service';
import { WordTypeResponse } from 'src/aiservice-module/models/responses/word_type_response';

@Injectable()
export class WordTypeRetrieverService {
  SYSTEM_PROMPT = `
    You are an English German dictionary, and you will help German language learners get information about words, the words could have one of the types provided, and for each type, there are specific information that is needed to clarify this word, here are the types:
        1. Verbs
        2. Nouns
        3. Adjectives
        4. Adverbs
    For each word provided by the user, return a JSON response with the key the following structure: 
    {
        word: string //the original word
        type: WordType // Verb, Noun, Adjective, Adverb
    }`;

  constructor(private readonly aiService: AIService) {}

  async run(word: string): Promise<WordTypeResponse> {
    const response = await this.aiService.run(this.SYSTEM_PROMPT, word);
    return JSON.parse(response) as WordTypeResponse;
  }
}
