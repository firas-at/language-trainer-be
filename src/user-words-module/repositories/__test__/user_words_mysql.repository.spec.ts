import { Test, TestingModule } from '@nestjs/testing';
import { UserWordsMysqlRepository } from '../user_words_mysql.repository';
import { UserWord } from '../../entities/user_word';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../users-module/entities/user';
import { Word } from '../../../words-module/entities/word';
import { InternalServerErrorException } from '@nestjs/common';

async function getUserWordsMysqlRepository(
  userWords: UserWord[],
  getMany?: jest.Mock,
): Promise<{
  repository: UserWordsMysqlRepository;
  userWordsRepoMock: jest.Mocked<Repository<UserWord>>;
}> {
  const userWordsRepoMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: getMany ? getMany : jest.fn(() => userWords),
    })),
  } as unknown as jest.Mocked<Repository<UserWord>>;

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserWordsMysqlRepository,
      {
        provide: getRepositoryToken(UserWord),
        useValue: userWordsRepoMock,
      },
    ],
  }).compile();

  return {
    repository: module.get<UserWordsMysqlRepository>(UserWordsMysqlRepository),
    userWordsRepoMock: userWordsRepoMock,
  };
}

describe('UserWordsMysqlRepository', () => {
  let repository: UserWordsMysqlRepository;
  let userWordsRepoMock: jest.Mocked<Repository<UserWord>>;

  beforeEach(async () => {
    const result = await getUserWordsMysqlRepository([new UserWord()]);
    repository = result.repository;
    userWordsRepoMock = result.userWordsRepoMock;
  });

  describe('addWordToUser', () => {
    it('should create and save a new UserWord if it does not exist', async () => {
      const user = new User();
      const word = new Word();
      const userWord = new UserWord();

      jest.spyOn(repository, 'getUserWordForUser').mockResolvedValue(null);
      userWordsRepoMock.create.mockReturnValue(userWord);
      userWordsRepoMock.save.mockResolvedValue(userWord);

      const result = await repository.addWordToUser(user, word);

      expect(repository.getUserWordForUser).toHaveBeenCalledWith(user, word);
      expect(userWordsRepoMock.create).toHaveBeenCalledWith({ user, word });
      expect(userWordsRepoMock.save).toHaveBeenCalledWith(userWord);
      expect(result).toBe(userWord);
    });

    it('should return the existing UserWord if it already exists', async () => {
      const user = new User();
      const word = new Word();
      const existingUserWord = new UserWord();

      jest
        .spyOn(repository, 'getUserWordForUser')
        .mockResolvedValue(existingUserWord);

      const result = await repository.addWordToUser(user, word);

      expect(repository.getUserWordForUser).toHaveBeenCalledWith(user, word);
      expect(result).toBe(existingUserWord);
      expect(userWordsRepoMock.create).not.toHaveBeenCalled();
      expect(userWordsRepoMock.save).not.toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      const user = new User();
      const word = new Word();

      jest
        .spyOn(repository, 'getUserWordForUser')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.addWordToUser(user, word)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getWordsForUser', () => {
    it('should return a list of words for a user', async () => {
      const user = new User();
      const word1 = new Word();
      const word2 = new Word();
      const userWords = [{ word: word1 }, { word: word2 }];

      userWordsRepoMock.find.mockResolvedValue(userWords as UserWord[]);

      const result = await repository.getWordsForUser(user);

      expect(userWordsRepoMock.find).toHaveBeenCalledWith({
        where: { user },
        relations: ['word'],
      });
      expect(result).toEqual([word1, word2]);
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      const user = new User();

      userWordsRepoMock.find.mockRejectedValue(new Error('Database error'));

      await expect(repository.getWordsForUser(user)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getUserWordForUser', () => {
    it('should return the UserWord if it exists', async () => {
      const user = new User();
      const word = new Word();
      const userWord = new UserWord();

      const result = await repository.getUserWordForUser(user, word);

      expect(userWordsRepoMock.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(userWord);
    });

    it('should return null if no UserWord exists', async () => {
      const user = new User();
      const word = new Word();

      const testModuleResult = await getUserWordsMysqlRepository([]);
      repository = testModuleResult.repository;
      userWordsRepoMock = testModuleResult.userWordsRepoMock;

      const result = await repository.getUserWordForUser(user, word);

      expect(userWordsRepoMock.createQueryBuilder).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      const user = new User();
      const word = new Word();

      const testModuleResult = await getUserWordsMysqlRepository(
        [],
        jest.fn().mockRejectedValue(new Error('Database error')),
      );
      repository = testModuleResult.repository;
      userWordsRepoMock = testModuleResult.userWordsRepoMock;

      await expect(repository.getUserWordForUser(user, word)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
