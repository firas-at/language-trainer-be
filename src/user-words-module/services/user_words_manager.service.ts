import { WordsRepository } from 'src/words-module/repositories/words.repository';
import { UserWordsRepository } from '../repositories/user-words.repository';
import { UsersRepository } from 'src/users-module/repositories/users.repository';
import { GetWordInfoUsecase } from 'src/aiservice-module/usecases/get_word_info.usecase';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserWordManagerService {
  constructor(
    private readonly userWordsRepository: UserWordsRepository,
    private readonly wordsRepository: WordsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly getWordInfoUsecase: GetWordInfoUsecase,
  ) {}

  async getWordInfo(userId: number, word: string) {
    // check if userId exists
    const user = await this.usersRepository.findById(userId);
    if (user === undefined) return;

    //check if it already exists in user word
    const userWords = await this.userWordsRepository.findAll(user.id, word);

    //if it exists
    if (userWords.length > 0) {
      //get the word info from words table and return it
      return await this.wordsRepository.find(word);
    } else {
      //get word info using ai service
      const wordInfo = await this.getWordInfoUsecase.run(word);

      //store the info in words table
      this.wordsRepository.insert(word, wordInfo.type, wordInfo);

      //store the word in user word
      this.userWordsRepository.insert(user.id, word);

      return wordInfo;
    }
  }
}
