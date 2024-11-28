import { WordsRepository } from 'src/words-module/repositories/words.repository';
import { UserWordsRepository } from '../repositories/user-words.repository';
import { UsersRepository } from 'src/users-module/repositories/users.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetWordInfoFromAIService } from 'src/aiservice-module/services/get_word_info_from_ai.service';

@Injectable()
export class UserWordManagerService {
  constructor(
    private readonly userWordsRepository: UserWordsRepository,
    private readonly wordsRepository: WordsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly getWordInfoFromAIService: GetWordInfoFromAIService,
  ) {}

  async getWordInfo(userId: number, word: string) {
    // check if userId exists
    const user = await this.usersRepository.findById(userId);
    if (user === undefined)
      throw new NotFoundException(`User not found: ${userId}`);

    //check if it already exists in user word
    const userWords = await this.userWordsRepository.findAll(user.id, word);

    //if it exists
    if (userWords.length > 0) {
      //get the word info from words table and return it
      return await this.wordsRepository.find(word);
    } else {
      //get word info using ai service
      const wordInfo = await this.getWordInfoFromAIService.run(word);

      //store the info in words table
      this.wordsRepository.insert(word, wordInfo.type, wordInfo);

      //store the word in user word
      this.userWordsRepository.insert(user.id, word);

      return wordInfo;
    }
  }
}
