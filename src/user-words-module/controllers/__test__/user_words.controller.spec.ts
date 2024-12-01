import { Test, TestingModule } from '@nestjs/testing';
import { UserWordsController } from '../user_words.controller';
import { UserWordManagerService } from '../../services/user_words_manager.service';
import { UserWordsRepository } from '../../repositories/user_words.repository';
import { JwtAuthGuard } from '../../../users-module/guards/jwt_auth.guard';
import { User } from '../../../users-module/entities/user';
import { InternalServerErrorException } from '@nestjs/common';

// Mocking the services and dependencies
const mockUserWordManagerService = {
  getWordInfo: jest.fn(),
};

const mockUserWordsRepository = {
  getWordsForUser: jest.fn(),
};

const mockUser = { id: 1, fullName: 'John Doe' } as User;

describe('UserWordsController', () => {
  let controller: UserWordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWordsController],
      providers: [
        {
          provide: UserWordManagerService,
          useValue: mockUserWordManagerService,
        },
        { provide: UserWordsRepository, useValue: mockUserWordsRepository },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mocking the JwtAuthGuard
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserWordsController>(UserWordsController);
  });

  describe('addWord', () => {
    it('should add a word to the user', async () => {
      const dto = { word: 'test' };
      const user = mockUser;
      const wordInfo = { id: 1, key: 'test', type: 'noun', info: {} };

      // Mocking service method to return a word info object
      mockUserWordManagerService.getWordInfo.mockResolvedValue(wordInfo);

      const result = await controller.addWord(user, dto);

      expect(result).toEqual(wordInfo);
      expect(mockUserWordManagerService.getWordInfo).toHaveBeenCalledWith(
        user.id,
        dto.word,
      );
    });

    it('should throw an error if word info fails', async () => {
      const dto = { word: 'test' };
      const user = mockUser;

      // Mocking service method to throw an error
      mockUserWordManagerService.getWordInfo.mockRejectedValue(
        new InternalServerErrorException(),
      );

      try {
        await controller.addWord(user, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('getAllWords', () => {
    it('should return all words for the user', async () => {
      const user = mockUser;
      const words = [
        { key: 'word1', type: 'noun', info: {} },
        { key: 'word2', type: 'verb', info: {} },
      ];

      // Mocking repository method to return a list of words
      mockUserWordsRepository.getWordsForUser.mockResolvedValue(words);

      const result = await controller.getAllWords(user);

      expect(result).toEqual(words);
      expect(mockUserWordsRepository.getWordsForUser).toHaveBeenCalledWith(
        user,
      );
    });

    it('should throw an error if fetching words fails', async () => {
      const user = mockUser;

      // Mocking repository method to throw an error
      mockUserWordsRepository.getWordsForUser.mockRejectedValue(
        new InternalServerErrorException(),
      );

      try {
        await controller.getAllWords(user);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
