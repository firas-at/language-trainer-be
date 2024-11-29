import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'Unique username', required: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: "User's password", required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
