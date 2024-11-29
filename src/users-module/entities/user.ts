import { BaseDBEntity } from '../../shared/base_db_entity';
import { UserWord } from '../../user-words-module/entities/user_word';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseDBEntity {
  @Column()
  fullName: string;

  @OneToMany(() => UserWord, (userWord) => userWord.user)
  userWords: UserWord[];
}
