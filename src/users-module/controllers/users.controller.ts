import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../models/user';
import { CreateUserDTO } from '../dtos/create_user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get()
  async getAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return this.usersRepository.insert(createUserDto.fullName);
  }
}
