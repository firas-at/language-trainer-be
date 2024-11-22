import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AIService } from './ai_services/ai.service';
import { OpenAIService } from './ai_services/openai.service';

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
  providers: [aiServiceProvider],
})
export class AppModule {}
