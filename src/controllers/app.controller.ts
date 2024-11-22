import { Controller, Get, Query } from '@nestjs/common';
import { WordInfo } from 'src/models/word_info';
import { GetWordInfoUsecase } from 'src/usecases/get_word_info.usecase';

@Controller()
export class AppController {
  constructor(private readonly getWordInfoUsecase: GetWordInfoUsecase) {}

  @Get()
  async getHello(@Query('word') word: string): Promise<WordInfo> {
    return this.getWordInfoUsecase.run(word);
  }
}
