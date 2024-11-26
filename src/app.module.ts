import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserWordsModule } from './user-words-module/user-words.module';
import { AIServiceModule } from './aiservice-module/aiservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AIServiceModule,
    UserWordsModule,
  ],
})
export class AppModule {}
