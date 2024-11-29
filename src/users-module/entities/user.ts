import { BaseDBEntity } from '../../shared/base_db_entity';
import { UserWord } from '../../user-words-module/entities/user_word';
import { Column, Entity, OneToMany } from 'typeorm';
import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseDBEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  fullName: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @OneToMany(() => UserWord, (userWord) => userWord.user)
  userWords: UserWord[];

  async setPassword(password: string): Promise<void> {
    this.password = await argon2.hash(password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return argon2.verify(this.password, password);
  }
}
