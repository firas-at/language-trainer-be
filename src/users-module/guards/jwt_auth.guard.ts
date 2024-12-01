import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extract Bearer token

    if (!token) {
      return false; // Deny access if no token is present
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = this.usersRepository.getUserByUsername(decoded.username); // Attach the decoded user to the request object
      return true;
    } catch {
      return false; // Deny access if token is invalid
    }
  }
}
