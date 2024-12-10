import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract addUser(
    username: string,
    fullName: string,
    password: string,
  ): Promise<User>;
  abstract getAllUsers(): Promise<User[]>;
  abstract getUser(id: number): Promise<User>;
  abstract getUserByUsername(username: string): Promise<User>;
}
