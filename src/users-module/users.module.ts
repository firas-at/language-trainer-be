import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersMysqlRepository } from './repositories/users_mysql_repository';
import { UsersRepository } from './repositories/users.repository';
import { UserEntity } from './db/entities/user.entity';
import { User } from './models/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity],
      synchronize: true,
    }),
  ],
  providers: [
    {
      provide: UsersRepository,
      useClass: UsersMysqlRepository,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
