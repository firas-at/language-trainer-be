import { Controller, Get } from '@nestjs/common';
import { AIService } from './ai_services/ai.service';

@Controller()
export class AppController {
  constructor(private readonly aiService: AIService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.aiService.askQuestion();
  }
}
