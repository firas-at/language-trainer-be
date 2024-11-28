import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class UsersMysqlRepository extends UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async insert(fullName: string) {
    try {
      const newUser = this.userRepository.create({ fullName }); // Creates a new User instance
      return await this.userRepository.save(newUser); // Saves it to the database
    } catch (error) {
      throw new InternalServerErrorException(`Error adding user: ${error}`);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting all users: ${error}`,
      );
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const users = await this.userRepository.find({ where: { id } });
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting a user by id: ${error}`,
      );
    }
  }
}
