import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AIServiceModule } from 'src/aiservice-module/aiservice.module';

@Module({
  controllers: [AppController],
  imports: [AIServiceModule],
})
export class UserWordsModule {}
