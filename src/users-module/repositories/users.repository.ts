import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract insert(fullName: string);
  abstract findAll(): Promise<User[]>;
  abstract findById(id: number): Promise<User>;
}
