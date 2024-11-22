import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { AIService } from './ai.service';

@Injectable()
export class OpenAIService implements AIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key is missing');
    }

    this.openai = new OpenAI({ apiKey });
  }

  async askQuestion(): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: 'translate the world "School" to German and put it in an example',
        },
      ],
    });

    return completion.choices[0].message.content;
  }
}
