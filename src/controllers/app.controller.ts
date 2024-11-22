import { Controller, Get } from '@nestjs/common';
import { WordType } from 'src/models/word_type';
import { WordTypeRetrieverService } from 'src/services/word_type_retriever.service';

@Controller()
export class AppController {
  constructor(
    private readonly wordTypeDetectorService: WordTypeRetrieverService,
  ) {}

  @Get()
  async getHello(): Promise<WordType> {
    return await this.wordTypeDetectorService.run('schon');
  }
}
