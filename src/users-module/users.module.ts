import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersMysqlRepository } from './repositories/users_mysql_repository';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: UsersRepository,
      useClass: UsersMysqlRepository,
    },
  ],
  exports: [UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
