import { Controller, Get, Query } from '@nestjs/common';
import { WordInfo } from 'src/aiservice-module/models/word_info';
import { GetWordInfoUsecase } from 'src/aiservice-module/usecases/get_word_info.usecase';

@Controller()
export class AppController {
  constructor(private readonly getWordInfoUsecase: GetWordInfoUsecase) {}

  @Get()
  async getHello(@Query('word') word: string): Promise<WordInfo> {
    return this.getWordInfoUsecase.run(word);
  }
}
