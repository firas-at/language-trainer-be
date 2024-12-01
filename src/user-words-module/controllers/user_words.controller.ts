import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserWordManagerService } from '../services/user_words_manager.service';
import { JwtAuthGuard } from '../../users-module/guards/jwt_auth.guard';
import { UserDecorator } from '../../users-module/decorators/user.decorator';
import { User } from '../../users-module/entities/user';
import { UserWordsRepository } from '../repositories/user_words.repository';

@ApiTags('User Words Module')
@UseGuards(JwtAuthGuard)
@Controller('user-words')
export class UserWordsController {
  constructor(
    private readonly userWordManagerService: UserWordManagerService,
    private readonly userWordsRepository: UserWordsRepository,
  ) {}

  @Post()
  async addWord(
    @UserDecorator() user: User,
    @Body() dto: { word: string },
  ): Promise<any> {
    return await this.userWordManagerService.getWordInfo(user.id, dto.word);
  }

  @Get()
  async getAllWords(@UserDecorator() user: User): Promise<any> {
    return await this.userWordsRepository.getWordsForUser(user);
  }
}
