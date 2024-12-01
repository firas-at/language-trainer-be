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

  async addUser(
    username: string,
    fullName: string,
    password: string,
  ): Promise<User> {
    try {
      const newUser = this.userRepository.create({ username, fullName });
      await newUser.setPassword(password); // Hash the password before saving
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(`Error adding user: ${error}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting all users: ${error}`,
      );
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const users = await this.userRepository.find({ where: { username } });
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting user by username: ${error}`,
      );
    }
  }

  async getUser(id: number): Promise<User> {
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
