import { User } from '../models/user';

export abstract class UsersRepository {
  abstract insert(fullName: string);
  abstract findAll(): Promise<User[]>;
  abstract findById(id: number): Promise<User>;
}
