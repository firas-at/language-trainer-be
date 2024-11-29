import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ description: 'Unique username for the user', required: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Full name', required: true })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Password at least 6 characters long',
    required: true,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
