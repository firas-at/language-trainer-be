import { GetWordInfoFromAIService } from '../get_word_info_from_ai.service';
import { WordDetailsFactoryService } from '../word_details_retrievers/word_details_factory.service';
import { WordTypeRetrieverService } from '../word_type_retriever.service';
import { WordInfo } from '../../models/word_info';
import { WordType } from '../../models/word_type';

jest.mock('../word_details_retrievers/word_details_factory.service');
jest.mock('../word_type_retriever.service');

describe('GetWordInfoFromAIService', () => {
  let service: GetWordInfoFromAIService;
  let wordDetailsFactory: WordDetailsFactoryService;
  let wordTypeRetriever: WordTypeRetrieverService;

  beforeEach(() => {
    wordDetailsFactory = new WordDetailsFactoryService(null, null, null); // Mock the WordDetailsFactoryService
    wordTypeRetriever = new WordTypeRetrieverService(null); // Mock the WordTypeRetrieverService

    service = new GetWordInfoFromAIService(
      wordDetailsFactory,
      wordTypeRetriever,
    );
  });

  describe('constructor', () => {
    it('should initialize GetWordInfoFromAIService with the required services', () => {
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
