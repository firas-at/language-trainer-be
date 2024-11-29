import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {}

  async signUp(
    username: string,
    fullName: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.usersRepository.getUserByUsername(username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }
    const addedUser = this.usersRepository.addUser(
      username,
      fullName,
      password,
    );
    return this.usersRepository.getUser(addedUser.id);
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.getUserByUsername(username);
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const accessToken = this.generateJwtToken(user);
    return { accessToken };
  }

  private generateJwtToken(user: User): string {
    const payload = { sub: user.id, username: user.username };

    // Use the config service to get the secret from environment variables
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }

  async validateUser(payload: any): Promise<User> {
    return this.usersRepository.getUser(payload.sub);
  }
}
