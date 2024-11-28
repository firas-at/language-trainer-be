import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { AIService } from './ai.service';

@Injectable()
export class OpenAIService implements AIService {
  private readonly MODEL: string = 'gpt-4o-mini';

  public openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('OpenAI API key is missing');
    }

    this.openai = new OpenAI({ apiKey });
  }

  async run(systemRoleInput: string, userRoleInput: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.MODEL,
        response_format: {
          type: 'json_object',
        },
        messages: [
          { role: 'system', content: systemRoleInput },
          { role: 'user', content: userRoleInput },
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting data from open ai: ${error}`,
      );
    }
  }
}
