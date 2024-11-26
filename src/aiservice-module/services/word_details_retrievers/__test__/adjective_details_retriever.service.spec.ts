import { WordType } from '../../../models/word_type';
import { OpenAIService } from '../../ai_services/openai.service';
import { AdjectiveDetailsRetrieverService } from '../adjective_details_retriever.service';

jest.mock('../../ai_services/openai.service'); // Mock OpenAIService

describe('AdjectiveDetailsRetrieverService', () => {
  let service: AdjectiveDetailsRetrieverService;
  let openAIService: OpenAIService;

  beforeEach(() => {
    openAIService = new OpenAIService(null); // Mock dependency injection for OpenAIService
    service = new AdjectiveDetailsRetrieverService(openAIService);
  });

  describe('constructor', () => {
    it('should initialize AdjectiveDetailsRetrieverService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getDetails', () => {
    const mockResponse = JSON.stringify({
      translation: 'big',
      sentence_example: 'Das Haus ist groß.',
      comparative: 'größer',
      superlative: 'am größten',
      opposite: 'klein',
    });

    const mockWord = 'groß';

    beforeEach(() => {
      jest.spyOn(openAIService, 'run').mockResolvedValue(mockResponse); // Mock run method of OpenAIService
    });

    it('should call OpenAIService.run with correct parameters', async () => {
      await service.getDetails(mockWord);

      expect(openAIService.run).toHaveBeenCalledWith(
        AdjectiveDetailsRetrieverService.SYSTEM_PROMPT,
        mockWord,
      );
    });

    it('should return an AdjectiveInfo object with correct properties', async () => {
      const result = await service.getDetails(mockWord);

      expect(result).toEqual({
        translation: 'big',
        sentence_example: 'Das Haus ist groß.',
        comparative: 'größer',
        superlative: 'am größten',
        opposite: 'klein',
        type: WordType.Adjective,
      });
    });
  });
});
