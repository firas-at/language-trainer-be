import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserWordManagerService } from '../services/user_words_manager.service';
import { JwtAuthGuard } from '../../users-module/guards/jwt_auth.guard';
import { UserDecorator } from '../../users-module/decorators/user.decorator';
import { User } from '../../users-module/entities/user';
import { UserWordsRepository } from '../repositories/user_words.repository';
import { GetAllUserWordsDTO } from '../dtos/get_all_user_words.dto';
import { AddWordDTO } from '../dtos/add_word.dto';
import { Word } from '../../words-module/entities/word';

@ApiTags('User Words Module')
@UseGuards(JwtAuthGuard)
@Controller('user-words')
export class UserWordsController {
  constructor(
    private readonly userWordManagerService: UserWordManagerService,
    private readonly userWordsRepository: UserWordsRepository,
  ) {}

  @ApiOperation({ summary: 'Add a new word for the user' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Word successfully added',
    type: Word,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid word data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  async addWord(
    @UserDecorator() user: User,
    @Body() addWordDto: AddWordDTO,
  ): Promise<Word> {
    return await this.userWordManagerService.getWordInfo(
      user.id,
      addWordDto.word,
    );
  }

  @ApiOperation({ summary: 'Get all words for the user' })
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all words for the user',
    type: Word,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  async getAllWords(
    @UserDecorator() user: User,
    @Body() getAllWordsDto: GetAllUserWordsDTO,
  ): Promise<Word[]> {
    return await this.userWordsRepository.getWordsForUser(
      user,
      getAllWordsDto.types,
      getAllWordsDto.sort_by,
      getAllWordsDto.sort_order,
    );
  }
}
