import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersMysqlRepository } from './repositories/users_mysql.repository';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: UsersRepository,
      useClass: UsersMysqlRepository,
    },
    AuthService,
    JwtService,
  ],
  exports: [UsersRepository],
  controllers: [AuthController],
})
export class UsersModule {}
