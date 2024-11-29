import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dtos/signup.dto';
import { SignInDto } from '../dtos/signin.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users Module')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create new user' })
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(
      signUpDto.username,
      signUpDto.fullName,
      signUpDto.password,
    );
    return user;
  }

  @ApiOperation({ summary: 'Sign in with a user' })
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const { accessToken } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    return { accessToken };
  }
}
