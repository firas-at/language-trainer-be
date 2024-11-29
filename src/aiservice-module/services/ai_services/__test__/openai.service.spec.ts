import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { OpenAIService } from '../openai.service';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(), // Mock the nested method
      },
    },
  })),
}));

describe('OpenAIService', () => {
  let service: OpenAIService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAIService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'OPENAI_API_KEY') {
                return 'test-api-key';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('constructor', () => {
    it('should throw an error if OPENAI_API_KEY is missing', () => {
      jest.spyOn(configService, 'get').mockReturnValue(null);

      expect(() => new OpenAIService(configService)).toThrow(
        'OpenAI API key is missing',
      );
    });

    it('should initialize OpenAI client with the API key', () => {
      const mockApiKey = 'test-api-key';
      jest.spyOn(configService, 'get').mockReturnValue(mockApiKey);

      expect(service.openai).toBeDefined();
      expect(OpenAI).toHaveBeenCalledWith({ apiKey: mockApiKey });
    });
  });

  describe('run', () => {
    const mockApiKey = 'test-api-key';
    const mockResponse = {
      choices: [{ message: { content: 'Test response' } }],
    };

    beforeEach(() => {
      jest.spyOn(configService, 'get').mockReturnValue(mockApiKey);
      // Mock the OpenAI chat completion response
      (service.openai.chat.completions.create as jest.Mock).mockResolvedValue(
        mockResponse,
      );
    });

    it('should call OpenAI with correct parameters', async () => {
      const systemRoleInput = 'system role';
      const userRoleInput = 'user input';

      await service.run(systemRoleInput, userRoleInput);

      expect(service.openai.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemRoleInput },
          { role: 'user', content: userRoleInput },
        ],
      });
    });

    it('should return the correct response content', async () => {
      const result = await service.run('system role', 'user input');

      expect(result).toEqual('Test response');
    });

    it("should throw an error if open ai didn't work", async () => {
      (service.openai.chat.completions.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException('error'),
      );

      await expect(() =>
        service.run('system role', 'user input'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
