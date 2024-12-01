import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddWordDTO {
  @ApiProperty({ description: 'German word to get its info', required: true })
  @IsString()
  @IsNotEmpty()
  word: string;
}
