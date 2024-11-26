import { Module } from '@nestjs/common';
import { AIService } from './services/ai_services/ai.service';
import { OpenAIService } from './services/ai_services/openai.service';
import { WordTypeRetrieverService } from './services/word_type_retriever.service';
import { WordDetailsFactoryService } from './services/word_details_retrievers/word_details_factory.service';
import { VerbDetailsRetrieverService } from './services/word_details_retrievers/verb_details_retriever.service';
import { NounDetailsRetrieverService } from './services/word_details_retrievers/noun_details_retriever.service';
import { AdjectiveDetailsRetrieverService } from './services/word_details_retrievers/adjective_details_retriever.service';
import { GetWordInfoUsecase } from './usecases/get_word_info.usecase';

@Module({
  providers: [
    {
      provide: AIService,
      useClass: OpenAIService,
    },
    WordTypeRetrieverService,
    WordDetailsFactoryService,
    VerbDetailsRetrieverService,
    NounDetailsRetrieverService,
    AdjectiveDetailsRetrieverService,
    GetWordInfoUsecase,
  ],
  exports: [GetWordInfoUsecase],
})
export class AIServiceModule {}
