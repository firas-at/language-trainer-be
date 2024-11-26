import { WordType } from '../../../models/word_type';
import { VerbDetailsRetrieverService } from '../verb_details_retriever.service';
import { OpenAIService } from '../../ai_services/openai.service';

jest.mock('../../ai_services/openai.service'); // Mock OpenAIService

describe('VerbDetailsRetrieverService', () => {
  let service: VerbDetailsRetrieverService;
  let openAIService: OpenAIService;

  beforeEach(() => {
    openAIService = new OpenAIService(null); // Mock dependency injection for OpenAIService
    service = new VerbDetailsRetrieverService(openAIService);
  });

  describe('constructor', () => {
    it('should initialize VerbDetailsRetrieverService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getDetails', () => {
    const mockResponse = JSON.stringify({
      translation: 'to read',
      sentence_example: 'Ich lese ein Buch.',
      infinitive_form: 'lesen',
      partizip_2_form: 'gelesen',
      auxiliary_verb: 'haben',
      praeteritum_form: 'las',
    });

    const mockWord = 'lesen';

    beforeEach(() => {
      jest.spyOn(openAIService, 'run').mockResolvedValue(mockResponse); // Mock run method of OpenAIService
    });

    it('should call OpenAIService.run with correct parameters', async () => {
      await service.getDetails(mockWord);

      expect(openAIService.run).toHaveBeenCalledWith(
        VerbDetailsRetrieverService.SYSTEM_PROMPT,
        mockWord,
      );
    });

    it('should return a VerbInfo object with correct properties', async () => {
      const result = await service.getDetails(mockWord);

      expect(result).toEqual({
        translation: 'to read',
        sentence_example: 'Ich lese ein Buch.',
        infinitive_form: 'lesen',
        partizip_2_form: 'gelesen',
        auxiliary_verb: 'haben',
        praeteritum_form: 'las',
        type: WordType.Verb,
      });
    });
  });
});
