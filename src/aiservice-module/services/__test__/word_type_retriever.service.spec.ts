import { WordType } from '../../models/word_type';
import { OpenAIService } from '../ai_services/openai.service';
import { WordTypeRetrieverService } from '../word_type_retriever.service';

jest.mock('../ai_services/openai.service'); // Mock OpenAIService

describe('WordTypeRetrieverService', () => {
  let service: WordTypeRetrieverService;
  let openAIService: OpenAIService;

  beforeEach(() => {
    openAIService = new OpenAIService(null); // Mock dependency injection for OpenAIService
    service = new WordTypeRetrieverService(openAIService);
  });

  describe('constructor', () => {
    it('should initialize WordTypeRetrieverService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('run', () => {
    const mockResponse = JSON.stringify({
      word: 'laufen',
      type: WordType.Verb,
    });

    const mockWord = 'laufen';

    beforeEach(() => {
      jest.spyOn(openAIService, 'run').mockResolvedValue(mockResponse); // Mock run method of OpenAIService
    });

    it('should call AIService.run with correct parameters', async () => {
      await service.run(mockWord);

      expect(openAIService.run).toHaveBeenCalledWith(
        WordTypeRetrieverService.SYSTEM_PROMPT,
        mockWord,
      );
    });

    it('should return a WordTypeResponse with correct properties', async () => {
      const result = await service.run(mockWord);

      expect(result).toEqual({
        word: 'laufen',
        type: WordType.Verb,
      });
    });
  });
});
