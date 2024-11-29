import { Test, TestingModule } from '@nestjs/testing';
import { UserWordManagerService } from '../user_words_manager.service';
import { UserWordsRepository } from '../../repositories/user_words.repository';
import { WordsRepository } from '../../../words-module/repositories/words.repository';
import { UsersRepository } from '../../../users-module/repositories/users.repository';
import { GetWordInfoFromAIService } from '../../../aiservice-module/services/get_word_info_from_ai.service';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/users-module/entities/user';
import { Word } from 'src/words-module/entities/word';
import { UserWord } from '../../entities/user_word';
import { WordType } from '../../../aiservice-module/models/word_type';
import { WordInfo } from '../../../aiservice-module/models/word_info';

describe('UserWordManagerService', () => {
  let service: UserWordManagerService;
  let userWordsRepository: jest.Mocked<UserWordsRepository>;
  let wordsRepository: jest.Mocked<WordsRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;
  let getWordInfoFromAIService: jest.Mocked<GetWordInfoFromAIService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserWordManagerService,
        {
          provide: UserWordsRepository,
          useValue: { getUserWordForUser: jest.fn(), addWordToUser: jest.fn() },
        },
        {
          provide: WordsRepository,
          useValue: { getWord: jest.fn(), addWord: jest.fn() },
        },
        { provide: UsersRepository, useValue: { getUser: jest.fn() } },
        { provide: GetWordInfoFromAIService, useValue: { run: jest.fn() } },
      ],
    }).compile();

    service = module.get<UserWordManagerService>(UserWordManagerService);
    userWordsRepository = module.get(UserWordsRepository);
    wordsRepository = module.get(WordsRepository);
    usersRepository = module.get(UsersRepository);
    getWordInfoFromAIService = module.get(GetWordInfoFromAIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWordInfo', () => {
    const userId = 1;
    const wordKey = 'testWord';

    const mockUser: User = {
      id: userId,
      fullName: 'Test User',
      userWords: [],
    } as User;

    const mockWordInfo: WordInfo = {
      type: WordType.Noun,
      translation: '',
      sentence_example: '',
    };

    const mockWord: Word = {
      id: 1,
      key: wordKey,
      type: WordType.Noun,
      wordUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Word;

    const mockUserWord: UserWord = {
      id: 1,
      user: mockUser,
      word: mockWord,
    } as UserWord;

    it('should throw NotFoundException if user is not found', async () => {
      usersRepository.getUser.mockResolvedValue(null);

      await expect(service.getWordInfo(userId, wordKey)).rejects.toThrow(
        new NotFoundException(`User not found: ${userId}`),
      );

      expect(usersRepository.getUser).toHaveBeenCalledWith(userId);
    });

    it('should retrieve and insert a word if it does not exist', async () => {
      usersRepository.getUser.mockResolvedValue(mockUser);
      wordsRepository.getWord.mockResolvedValueOnce(null); // Word does not exist
      getWordInfoFromAIService.run.mockResolvedValue(mockWordInfo);
      wordsRepository.getWord.mockResolvedValueOnce(mockWord); // After insertion, word exists
      userWordsRepository.getUserWordForUser.mockResolvedValue(null);

      const result = await service.getWordInfo(userId, wordKey);

      expect(usersRepository.getUser).toHaveBeenCalledWith(userId);
      expect(wordsRepository.getWord).toHaveBeenCalledWith(wordKey);
      expect(getWordInfoFromAIService.run).toHaveBeenCalledWith(wordKey);
      expect(wordsRepository.addWord).toHaveBeenCalledWith(
        wordKey,
        mockWordInfo.type,
        mockWordInfo,
      );
      expect(userWordsRepository.getUserWordForUser).toHaveBeenCalledWith(
        mockUser,
        mockWord,
      );
      expect(userWordsRepository.addWordToUser).toHaveBeenCalledWith(
        mockUser,
        mockWord,
      );
      expect(result).toEqual(mockWord);
    });

    it('should add the word to the user if it does not exist in their list', async () => {
      usersRepository.getUser.mockResolvedValue(mockUser);
      wordsRepository.getWord.mockResolvedValue(mockWord);
      userWordsRepository.getUserWordForUser.mockResolvedValue(null); // Word not in user's list

      const result = await service.getWordInfo(userId, wordKey);

      expect(userWordsRepository.addWordToUser).toHaveBeenCalledWith(
        mockUser,
        mockWord,
      );
      expect(result).toEqual(mockWord);
    });

    it('should not add the word to the user if it already exists in their list', async () => {
      usersRepository.getUser.mockResolvedValue(mockUser);
      wordsRepository.getWord.mockResolvedValue(mockWord);
      userWordsRepository.getUserWordForUser.mockResolvedValue(mockUserWord);

      const result = await service.getWordInfo(userId, wordKey);

      expect(userWordsRepository.addWordToUser).not.toHaveBeenCalled();
      expect(result).toEqual(mockWord);
    });
  });
});
