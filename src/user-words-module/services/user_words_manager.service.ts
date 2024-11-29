import { WordsRepository } from 'src/words-module/repositories/words.repository';
import { UserWordsRepository } from '../repositories/user_words.repository';
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
    const user = await this.usersRepository.getUser(userId);
    if (user === null) throw new NotFoundException(`User not found: ${userId}`);

    // check if word definition exists
    let wordObj = await this.wordsRepository.getWord(word);

    // if word definition doesn't exist, then retrieve and insert it
    if (wordObj === null) {
      const wordInfo = await this.getWordInfoFromAIService.run(word);
      await this.wordsRepository.addWord(word, wordInfo.type, wordInfo);
      wordObj = await this.wordsRepository.getWord(word);
    }

    // check if user already has the word
    const userWords = await this.userWordsRepository.getUserWordForUser(
      user,
      wordObj,
    );

    // add the word to the user if it doesn't exist
    if (userWords === null) {
      this.userWordsRepository.addWordToUser(user, wordObj);
    }

    return wordObj;
  }
}
