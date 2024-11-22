import { Controller, Get, Query } from '@nestjs/common';
import { GetWordInfoUsecase } from 'src/usecases/get_word_info.usecase';

@Controller()
export class AppController {
  constructor(private readonly getWordInfoUsecase: GetWordInfoUsecase) {}

  @Get()
  async getHello(@Query('word') word: string): Promise<string> {
    return this.getWordInfoUsecase.run(word);
  }
}
