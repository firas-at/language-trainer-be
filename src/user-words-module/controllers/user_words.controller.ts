import { Controller, Get, Query } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserWordManagerService } from '../services/user_words_manager.service';

export class CreateUserWordDTO {
  @ApiProperty({ description: 'Full name of the user', required: true })
  userId: number;

  @ApiProperty({ description: 'Full name of the user', required: true })
  word: string;
}

@ApiTags('User Words Module')
@Controller('user-words')
export class UserWordsController {
  constructor(
    private readonly userWordManagerService: UserWordManagerService,
  ) {}

  @Get()
  async getWordInfo(
    @Query('userId') userId: number,
    @Query('word') word: string,
  ): Promise<any> {
    return await this.userWordManagerService.getWordInfo(userId, word);
  }
}
