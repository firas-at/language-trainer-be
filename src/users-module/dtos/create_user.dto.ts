import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({ description: 'Full name of the user', required: true })
  fullName: string;
}
