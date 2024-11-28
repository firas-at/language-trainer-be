import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract addUser(fullName: string);
  abstract getAllUsers(): Promise<User[]>;
  abstract getUser(id: number): Promise<User>;
}
