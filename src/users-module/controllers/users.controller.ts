import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../models/user';
import { CreateUserDTO } from '../dtos/create_user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users Module')
@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  @ApiOperation({ summary: 'Create new user' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return this.usersRepository.insert(createUserDto.fullName);
  }
}
