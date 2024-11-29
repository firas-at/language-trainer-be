import { Test, TestingModule } from '@nestjs/testing';
import { WordsMysqlRepository } from '../words_mysql.repository';
import { Word } from '../../entities/word';
import { WordType } from '../../../aiservice-module/models/word_type';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WordsMysqlRepository', () => {
  let repository: WordsMysqlRepository;
  let wordsRepository: jest.Mocked<Repository<Word>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsMysqlRepository,
        {
          provide: getRepositoryToken(Word),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<WordsMysqlRepository>(WordsMysqlRepository);
    wordsRepository = module.get(getRepositoryToken(Word));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('addWord', () => {
    it('should successfully add a word', async () => {
      const word = 'example';
      const type = WordType.Noun;
      const info = { definition: 'a representative form or pattern' };
      const mockWord: Word = { id: 1, key: word, type, info } as Word;

      wordsRepository.create.mockReturnValue(mockWord);
      wordsRepository.save.mockResolvedValue(mockWord);

      const result = await repository.addWord(word, type, info);

      expect(wordsRepository.create).toHaveBeenCalledWith({
        key: word,
        type,
        info,
      });
      expect(wordsRepository.save).toHaveBeenCalledWith(mockWord);
      expect(result).toEqual(mockWord);
    });

    it('should throw an InternalServerErrorException if adding word fails', async () => {
      const word = 'example';
      const type = WordType.Noun;
      const info = { definition: 'a representative form or pattern' };

      wordsRepository.create.mockReturnValue(new Word());
      wordsRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(repository.addWord(word, type, info)).rejects.toThrow(
        new InternalServerErrorException(
          'Error adding word: Error: Database error',
        ),
      );
    });
  });

  describe('getWord', () => {
    it('should return a word by its key', async () => {
      const word = 'example';
      const mockWord: Word = {
        id: 1,
        key: word,
        type: WordType.Noun,
        info: { definition: 'a representative form or pattern' },
      } as Word;

      wordsRepository.find.mockResolvedValue([mockWord]);

      const result = await repository.getWord(word);

      expect(wordsRepository.find).toHaveBeenCalledWith({
        where: { key: word },
      });
      expect(result).toEqual(mockWord);
    });

    it('should return null if no word is found', async () => {
      const word = 'example';

      wordsRepository.find.mockResolvedValue([]);

      const result = await repository.getWord(word);

      expect(wordsRepository.find).toHaveBeenCalledWith({
        where: { key: word },
      });
      expect(result).toBeNull();
    });

    it('should throw an InternalServerErrorException if getting word fails', async () => {
      const word = 'example';

      wordsRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(repository.getWord(word)).rejects.toThrow(
        new InternalServerErrorException(
          'Error getting word: Error: Database error',
        ),
      );
    });
  });
});
