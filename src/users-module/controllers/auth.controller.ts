import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dtos/signup.dto';
import { SignInDto } from '../dtos/signin.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt_auth.guard';
import { UserDecorator } from '../decorators/user.decorator';
import { User } from '../entities/user';
import { AuthResponseDto } from '../dtos/auth_response.dto';
import { UserDto } from '../dtos/user.dto';

@ApiTags('Users Module')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create new user' })
  @Post('signup')
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - username already exists',
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return await this.authService.signUp(
      signUpDto.username,
      signUpDto.fullName,
      signUpDto.password,
    );
  }

  @ApiOperation({ summary: 'Sign in with a user' })
  @Post('signin')
  @ApiResponse({
    status: 201,
    description: 'User successfully signed in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid username or password',
  })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged in user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the currently logged in user',
    type: UserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  getProfile(@UserDecorator() user: User): UserDto {
    return user.getDTO();
  }
}
