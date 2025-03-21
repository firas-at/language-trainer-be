import { Module } from '@nestjs/common';
import { AIService } from './services/ai_services/ai.service';
import { WordTypeRetrieverService } from './services/word_type_retriever.service';
import { WordDetailsFactoryService } from './services/word_details_retrievers/word_details_factory.service';
import { VerbDetailsRetrieverService } from './services/word_details_retrievers/verb_details_retriever.service';
import { NounDetailsRetrieverService } from './services/word_details_retrievers/noun_details_retriever.service';
import { AdjectiveDetailsRetrieverService } from './services/word_details_retrievers/adjective_details_retriever.service';
import { GetWordInfoFromAIService } from './services/get_word_info_from_ai.service';
import { GeminiService } from './services/ai_services/gemini.service';

@Module({
  providers: [
    {
      provide: AIService,
      useClass: GeminiService,
    },
    WordTypeRetrieverService,
    WordDetailsFactoryService,
    VerbDetailsRetrieverService,
    NounDetailsRetrieverService,
    AdjectiveDetailsRetrieverService,
    GetWordInfoFromAIService,
  ],
  exports: [GetWordInfoFromAIService],
})
export class AIServiceModule {}
