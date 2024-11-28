import { NounDetailsRetrieverService } from '../noun_details_retriever.service';
import { OpenAIService } from '../../ai_services/openai.service';
import { WordType } from '../../../models/word_type';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('../../ai_services/openai.service'); // Mock OpenAIService

describe('NounDetailsRetrieverService', () => {
  let service: NounDetailsRetrieverService;
  let openAIService: OpenAIService;

  beforeEach(() => {
    openAIService = new OpenAIService(null); // Mock dependency injection for OpenAIService
    service = new NounDetailsRetrieverService(openAIService);
  });

  describe('constructor', () => {
    it('should initialize NounDetailsRetrieverService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getDetails', () => {
    const mockResponse = JSON.stringify({
      translation: 'book',
      sentence_example: 'Das Buch ist interessant.',
      gender: 'der',
      plural_form: 'Bücher',
    });

    const mockWord = 'Buch';

    beforeEach(() => {
      jest.spyOn(openAIService, 'run').mockResolvedValue(mockResponse); // Mock run method of OpenAIService
    });

    it('should call OpenAIService.run with correct parameters', async () => {
      await service.getDetails(mockWord);

      expect(openAIService.run).toHaveBeenCalledWith(
        NounDetailsRetrieverService.SYSTEM_PROMPT,
        mockWord,
      );
    });

    it('should return a NounInfo object with correct properties', async () => {
      const result = await service.getDetails(mockWord);

      expect(result).toEqual({
        translation: 'book',
        sentence_example: 'Das Buch ist interessant.',
        gender: 'der',
        plural_form: 'Bücher',
        type: WordType.Noun,
      });
    });

    it("should throw an error if open AI didn't work", async () => {
      jest
        .spyOn(openAIService, 'run')
        .mockRejectedValue(new InternalServerErrorException('error')); // Mock run method of OpenAIService

      await expect(() => service.getDetails(mockWord)).rejects.toThrow('error');
    });
  });
});
