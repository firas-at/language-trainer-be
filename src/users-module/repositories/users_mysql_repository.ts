import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user';
import { Repository } from 'typeorm';

@Injectable()
export class UsersMysqlRepository extends UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  insert(fullName: string) {
    const newUser = this.userRepository.create({ fullName }); // Creates a new User instance
    return this.userRepository.save(newUser); // Saves it to the database
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const users = await this.userRepository.find({ where: { id } });
    return users[0];
  }
}
