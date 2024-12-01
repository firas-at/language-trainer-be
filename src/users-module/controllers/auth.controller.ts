import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dtos/signup.dto';
import { SignInDto } from '../dtos/signin.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt_auth.guard';
import { UserDecorator } from '../decorators/user.decorator';
import { User } from '../entities/user';

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
    return user.getDTO();
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged in user' })
  getProfile(@UserDecorator() user: User) {
    return user.getDTO();
  }
}
