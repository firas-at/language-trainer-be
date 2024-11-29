import { GeminiService } from '../gemini.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('@google/generative-ai'); // Mock GoogleGenerativeAI

describe('GeminiService', () => {
  let service: GeminiService;
  let configService: ConfigService;
  let mockGenAI: GoogleGenerativeAI;
  let mockModel: GenerativeModel;

  beforeEach(() => {
    configService = new ConfigService();
    mockGenAI = new GoogleGenerativeAI(
      'mockApiKey',
    ) as jest.Mocked<GoogleGenerativeAI>;
    mockModel = {
      startChat: jest.fn(),
    } as unknown as jest.Mocked<GenerativeModel>;
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => mockGenAI);
  });

  describe('constructor', () => {
    it('should throw an error if the API key is missing', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      expect(() => new GeminiService(configService)).toThrow(
        InternalServerErrorException,
      );
    });

    it('should initialize GoogleGenerativeAI with the provided API key', () => {
      jest.spyOn(configService, 'get').mockReturnValue('mockApiKey');

      service = new GeminiService(configService);

      expect(service).toBeDefined();
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('mockApiKey');
    });
  });

  describe('run', () => {
    const mockResponseText = 'mockResponseText';
    const mockSystemInput = 'mockSystemInput';
    const mockUserInput = 'mockUserInput';

    beforeEach(() => {
      jest.spyOn(configService, 'get').mockReturnValue('mockApiKey');
      service = new GeminiService(configService);

      jest.spyOn(mockGenAI, 'getGenerativeModel').mockReturnValue(mockModel);
      mockModel.startChat = jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: {
            text: jest.fn().mockReturnValue(mockResponseText),
          },
        }),
      });
    });

    it('should call GoogleGenerativeAI methods with correct parameters', async () => {
      const result = await service.run(mockSystemInput, mockUserInput);

      expect(mockGenAI.getGenerativeModel).toHaveBeenCalledWith({
        model: 'gemini-1.5-flash',
        systemInstruction: mockSystemInput,
      });

      expect(mockModel.startChat).toHaveBeenCalledWith({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
        history: [{ role: 'user', parts: [{ text: mockUserInput }] }],
      });

      expect(result).toBe(mockResponseText);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockModel.startChat = jest.fn().mockImplementation(() => {
        throw new Error('Mocked error');
      });
      jest.spyOn(mockGenAI, 'getGenerativeModel').mockReturnValue(mockModel);

      await expect(service.run(mockSystemInput, mockUserInput)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
