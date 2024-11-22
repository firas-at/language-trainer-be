import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AIService } from './services/ai_services/ai.service';
import { OpenAIService } from './services/ai_services/openai.service';
import { AppController } from './controllers/app.controller';
import { WordTypeRetrieverService } from './services/word_type_retriever.service';
import { WordDetailsFactoryService } from './services/word_details_retrievers/word_details_factory.service';
import { VerbDetailsRetrieverService } from './services/word_details_retrievers/verb_details_retriever.service';
import { GetWordInfoUsecase } from './usecases/get_word_info.usecase';
import { NounDetailsRetrieverService } from './services/word_details_retrievers/noun_details_retriever.service';
import { AdjectiveDetailsRetrieverService } from './services/word_details_retrievers/adjective_details_retriever.service';

const aiServiceProvider: Provider = {
  provide: AIService,
  useFactory: (configService: ConfigService) => {
    const aiProvider = configService.get<string>('AI_PROVIDER');
    if (aiProvider === 'openai') {
      return new OpenAIService(configService);
    } else {
      throw new Error('Invalid AI_PROVIDER value');
    }
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [
    aiServiceProvider,
    WordTypeRetrieverService,
    WordDetailsFactoryService,
    VerbDetailsRetrieverService,
    NounDetailsRetrieverService,
    AdjectiveDetailsRetrieverService,
    GetWordInfoUsecase,
  ],
})
export class AppModule {}
