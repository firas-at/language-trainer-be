import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth.service';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../entities/user';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('../../repositories/users.repository');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            addUser: jest.fn(),
            getAllUsers: jest.fn(),
            getUser: jest.fn(),
            getUserByUsername: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_SECRET') {
                return 'mockSecret';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    usersRepository = module.get(UsersRepository);
  });

  describe('signUp', () => {
    it('should throw UnauthorizedException if the username already exists', async () => {
      usersRepository.getUserByUsername.mockResolvedValueOnce(new User());
      await expect(
        authService.signUp('existingUser', 'Test User', 'password123'),
      ).rejects.toThrow(ConflictException);
    });

    it('should successfully create and return a new user', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        fullName: 'Test User',
        validatePassword: jest.fn(),
        getDTO: jest.fn().mockReturnValue({
          id: 1,
          username: 'testuser',
          fullName: 'Test User',
        }),
      } as any;
      usersRepository.getUserByUsername.mockResolvedValueOnce(null);
      usersRepository.addUser.mockResolvedValueOnce(mockUser);
      usersRepository.getUser.mockResolvedValueOnce(mockUser);

      const mockToken = 'mockToken';
      const mockResponse = {
        token: mockToken,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          fullName: mockUser.fullName,
        },
      };
      (jwt.sign as jest.Mock).mockReturnValueOnce(mockToken);
      configService.get('JWT_SECRET');

      const result = await authService.signUp(
        'newUser',
        'New User',
        'password',
      );
      expect(result).toEqual(mockResponse);
      expect(usersRepository.addUser).toHaveBeenCalledWith(
        'newUser',
        'New User',
        'password',
      );
    });
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException for invalid username or password', async () => {
      usersRepository.getUserByUsername.mockResolvedValueOnce(null);
      await expect(
        authService.signIn('invalidUser', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return a valid response for valid credentials', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        fullName: 'Test User',
        validatePassword: jest.fn(),
        getDTO: jest.fn().mockReturnValue({
          id: 1,
          username: 'testuser',
          fullName: 'Test User',
        }),
      } as any;
      mockUser.validatePassword.mockResolvedValueOnce(true);
      usersRepository.getUserByUsername.mockResolvedValueOnce(mockUser);

      const mockToken = 'mockToken';
      const mockResponse = {
        token: mockToken,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          fullName: mockUser.fullName,
        },
      };
      (jwt.sign as jest.Mock).mockReturnValueOnce(mockToken);
      configService.get('JWT_SECRET');

      const result = await authService.signIn('validUser', 'password');
      expect(result).toEqual(mockResponse);
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: mockUser.id, username: mockUser.username },
        'mockSecret',
        { expiresIn: '1h' },
      );
    });
  });

  describe('generateJwtToken', () => {
    it('should throw an error if JWT_SECRET is not defined', () => {
      const mockUser = { id: 1, username: 'user' } as User;
      jest.spyOn(configService, 'get').mockReturnValue(null);
      expect(() => authService['generateJwtToken'](mockUser)).toThrowError(
        'JWT_SECRET is not defined',
      );
    });

    it('should generate a valid JWT token', () => {
      const mockUser = { id: 1, username: 'user' } as User;
      configService.get('JWT_TOKEN');
      const mockToken = 'mockToken';
      (jwt.sign as jest.Mock).mockReturnValueOnce(mockToken);

      const result = authService['generateJwtToken'](mockUser);
      expect(result).toEqual(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: mockUser.id, username: mockUser.username },
        'mockSecret',
        { expiresIn: '1h' },
      );
    });
  });

  describe('validateUser', () => {
    it('should return the user for a valid payload', async () => {
      const mockUser = { id: 1 } as User;
      usersRepository.getUser.mockResolvedValueOnce(mockUser);

      const result = await authService.validateUser({ sub: 1 });
      expect(result).toEqual(mockUser);
    });
  });
});
