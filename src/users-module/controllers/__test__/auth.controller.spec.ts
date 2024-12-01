import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../../services/auth.service';
import { SignUpDto } from '../../dtos/signup.dto';
import { SignInDto } from '../../dtos/signin.dto';
import { User } from '../../entities/user';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
  });

  describe('signUp', () => {
    it('should call AuthService.signUp with correct parameters and return the result', async () => {
      const mockSignUpDto: SignUpDto = {
        username: 'testuser',
        fullName: 'Test User',
        password: 'testpassword',
      };

      const mockUser = new User();
      mockUser.id = 1;
      mockUser.username = 'testuser';
      mockUser.fullName = 'Test User';
      authService.signUp.mockResolvedValueOnce(mockUser);

      const result = await authController.signUp(mockSignUpDto);
      expect(authService.signUp).toHaveBeenCalledWith(
        mockSignUpDto.username,
        mockSignUpDto.fullName,
        mockSignUpDto.password,
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('signIn', () => {
    it('should call AuthService.signIn with correct parameters and return an access token', async () => {
      const mockSignInDto: SignInDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const mockAccessToken = { accessToken: 'mock-token' };
      authService.signIn.mockResolvedValueOnce(mockAccessToken);

      const result = await authController.signIn(mockSignInDto);
      expect(authService.signIn).toHaveBeenCalledWith(
        mockSignInDto.username,
        mockSignInDto.password,
      );
      expect(result).toEqual(mockAccessToken);
    });
  });
});
