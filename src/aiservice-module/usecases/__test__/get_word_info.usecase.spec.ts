import { GetWordInfoUsecase } from '../get_word_info.usecase';
import { WordDetailsFactoryService } from '../../services/word_details_retrievers/word_details_factory.service';
import { WordTypeRetrieverService } from '../../services/word_type_retriever.service';
import { WordInfo } from '../../models/word_info';
import { WordType } from '../../models/word_type';

jest.mock(
  '../../services/word_details_retrievers/word_details_factory.service',
);
jest.mock('../../services/word_type_retriever.service');

describe('GetWordInfoUsecase', () => {
  let service: GetWordInfoUsecase;
  let wordDetailsFactory: WordDetailsFactoryService;
  let wordTypeRetriever: WordTypeRetrieverService;

  beforeEach(() => {
    wordDetailsFactory = new WordDetailsFactoryService(null, null, null); // Mock the WordDetailsFactoryService
    wordTypeRetriever = new WordTypeRetrieverService(null); // Mock the WordTypeRetrieverService

    service = new GetWordInfoUsecase(wordDetailsFactory, wordTypeRetriever);
  });

  describe('constructor', () => {
    it('should initialize GetWordInfoUsecase with the required services', () => {
      expect(service).toBeDefined();
    });
  });

  describe('run', () => {
    const mockWord = 'laufen';
    const mockWordTypeResponse = { word: mockWord, type: WordType.Verb };
    const mockWordInfo: WordInfo = {
      translation: 'to run',
      type: WordType.Verb,
      sentence_example: 'examples',
    };

    beforeEach(() => {
      jest
        .spyOn(wordTypeRetriever, 'run')
        .mockResolvedValue(mockWordTypeResponse); // Mock the wordTypeRetriever.run() method
      jest.spyOn(wordDetailsFactory, 'run').mockResolvedValue(mockWordInfo); // Mock the wordDetailsFactory.run() method
    });

    it('should call WordTypeRetrieverService.run with the correct word', async () => {
      await service.run(mockWord);

      expect(wordTypeRetriever.run).toHaveBeenCalledWith(mockWord);
    });

    it('should call WordDetailsFactoryService.run with the correct word and type', async () => {
      await service.run(mockWord);

      expect(wordDetailsFactory.run).toHaveBeenCalledWith(
        mockWordTypeResponse.word,
        mockWordTypeResponse.type,
      );
    });

    it('should return the correct WordInfo', async () => {
      const result = await service.run(mockWord);

      expect(result).toEqual(mockWordInfo);
    });
  });
});
