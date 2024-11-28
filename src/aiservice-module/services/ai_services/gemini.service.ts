import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AIService } from './ai.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class GeminiService implements AIService {
  private readonly genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('Gemini API key is missing');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async run(systemRoleInput: string, userRoleInput: string): Promise<string> {
    try {
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemRoleInput,
      });

      const chatSession = this.model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
        history: [{ role: 'user', parts: [{ text: userRoleInput }] }],
      });

      const result = await chatSession.sendMessage('');
      console.log(result.response.text());
      return result.response.text();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting data from gemini: ${error}`,
      );
    }
  }
}
